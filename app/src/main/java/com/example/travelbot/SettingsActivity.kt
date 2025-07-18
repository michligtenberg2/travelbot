package com.example.travelbot

import android.content.SharedPreferences
import android.os.Bundle
import android.util.Patterns
import android.view.View
import android.widget.ArrayAdapter
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.lifecycle.lifecycleScope
import com.google.android.material.button.MaterialButton
import com.google.android.material.materialswitch.MaterialSwitch
import com.google.android.material.progressindicator.CircularProgressIndicator
import com.google.android.material.textfield.TextInputEditText
import kotlinx.coroutines.launch

class SettingsActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var loadingIndicator: CircularProgressIndicator

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        sharedPreferences = getSharedPreferences("travelbot_prefs", MODE_PRIVATE)

        // Initialize UI components
        val intervalInput = findViewById<TextInputEditText>(R.id.intervalInput)
        val urlInput = findViewById<TextInputEditText>(R.id.urlInput)
        val apiKeyInput = findViewById<TextInputEditText>(R.id.apiKeyInput)
        val personaSpinner = findViewById<Spinner>(R.id.personaSpinner)
        val quietSwitch = findViewById<MaterialSwitch>(R.id.quietSwitch)
        val saveButton = findViewById<MaterialButton>(R.id.saveButton)
        val clearCacheButton = findViewById<MaterialButton>(R.id.clearCacheButton)
        loadingIndicator = findViewById<CircularProgressIndicator>(R.id.loadingIndicator)

        // Setup persona spinner
        val personas = PersonaManager.names()
        personaSpinner.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, personas)

        // Load current settings
        loadCurrentSettings(intervalInput, urlInput, apiKeyInput, personaSpinner, quietSwitch)

        // Save button click listener
        saveButton.setOnClickListener {
            saveSettings(intervalInput, urlInput, apiKeyInput, personaSpinner, quietSwitch)
        }

        // Clear cache button click listener
        clearCacheButton.setOnClickListener {
            clearCache()
        }
    }

    private fun loadCurrentSettings(
        intervalInput: TextInputEditText,
        urlInput: TextInputEditText,
        apiKeyInput: TextInputEditText,
        personaSpinner: Spinner,
        quietSwitch: MaterialSwitch
    ) {
        // Load existing settings
        intervalInput.setText(Settings.getInterval(this).toString())
        urlInput.setText(Settings.getBackendUrl(this))
        apiKeyInput.setText(Settings.getApiKey(this))
        
        val personas = PersonaManager.names()
        val currentPersonality = Settings.getPersonality(this)
        val personaIndex = personas.indexOf(currentPersonality)
        if (personaIndex >= 0) {
            personaSpinner.setSelection(personaIndex)
        }
        
        quietSwitch.isChecked = Settings.isQuietModeEnabled(this)
    }

    private fun saveSettings(
        intervalInput: TextInputEditText,
        urlInput: TextInputEditText,
        apiKeyInput: TextInputEditText,
        personaSpinner: Spinner,
        quietSwitch: MaterialSwitch
    ) {
        showLoading(true)

        // Validate inputs
        val intervalText = intervalInput.text.toString()
        val urlText = urlInput.text.toString().trim()
        val apiKeyText = apiKeyInput.text.toString().trim()

        // Validate interval
        val interval = intervalText.toIntOrNull()
        if (interval == null || interval < 1) {
            showError("Voer een geldig interval in (minimaal 1 minuut)")
            showLoading(false)
            return
        }

        // Validate URL
        if (urlText.isNotEmpty() && !Patterns.WEB_URL.matcher(urlText).matches()) {
            showError("Voer een geldige URL in")
            showLoading(false)
            return
        }

        val finalUrl = urlText.ifBlank { "http://10.0.2.2:5000" }
        val personality = personaSpinner.selectedItem as String

        try {
            // Save settings
            Settings.setInterval(this, interval)
            Settings.setBackendUrl(this, finalUrl)
            Settings.setApiKey(this, apiKeyText)
            Settings.setPersonality(this, personality)
            Settings.setQuietModeEnabled(this, quietSwitch.isChecked)

            showSuccess("Instellingen opgeslagen!")
            
            // Auto-finish after short delay
            loadingIndicator.postDelayed({
                finish()
            }, 1000)
        } catch (e: Exception) {
            showError("Fout bij het opslaan van instellingen: ${e.message}")
        } finally {
            showLoading(false)
        }
    }

    private fun clearCache() {
        showLoading(true)
        
        lifecycleScope.launch {
            try {
                // Clear both Room cache and legacy cache
                ApiClient.clearCache(this@SettingsActivity)
                
                runOnUiThread {
                    showSuccess("Cache gewist!")
                    showLoading(false)
                }
            } catch (e: Exception) {
                runOnUiThread {
                    showError("Fout bij het wissen van cache: ${e.message}")
                    showLoading(false)
                }
            }
        }
    }

    private fun showLoading(show: Boolean) {
        loadingIndicator.visibility = if (show) View.VISIBLE else View.GONE
        
        // Disable buttons during loading
        findViewById<MaterialButton>(R.id.saveButton).isEnabled = !show
        findViewById<MaterialButton>(R.id.clearCacheButton).isEnabled = !show
    }

    private fun showError(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_LONG).show()
    }

    private fun showSuccess(message: String) {
        Toast.makeText(this, message, Toast.LENGTH_SHORT).show()
    }
}
