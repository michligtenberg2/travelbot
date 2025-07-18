package com.example.travelbot

import android.content.SharedPreferences
import android.os.Bundle
import android.widget.ArrayAdapter
import android.widget.Button
import android.widget.EditText
import android.widget.Spinner
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout

class SettingsActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        sharedPreferences = getSharedPreferences("travelbot_prefs", MODE_PRIVATE)

        val intervalInput = findViewById<TextInputEditText>(R.id.intervalInput)
        val urlInput = findViewById<TextInputEditText>(R.id.urlInput)
        val personaSpinner = findViewById<Spinner>(R.id.personaSpinner)
        val quietSwitch = findViewById<android.widget.Switch>(R.id.quietSwitch)
        val saveButton = findViewById<MaterialButton>(R.id.saveButton)

        val backendUrlInput = findViewById<EditText>(R.id.backendUrlInput)

        val personas = PersonaManager.names()
        personaSpinner.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, personas)

        intervalInput.setText(Settings.getInterval(this).toString())
        urlInput.setText(Settings.getBackendUrl(this))
        personaSpinner.setSelection(personas.indexOf(Settings.getPersonality(this)))
        quietSwitch.isChecked = Settings.isQuietModeEnabled(this)

        // Load current backend URL
        val currentUrl = sharedPreferences.getString("backend_url", "http://10.0.2.2:5000")
        backendUrlInput.setText(currentUrl)

        saveButton.setOnClickListener {
            val interval = intervalInput.text.toString().toIntOrNull() ?: 15
            val url = urlInput.text.toString().ifBlank { "http://10.0.2.2:5000" }
            val personality = personaSpinner.selectedItem as String
            Settings.setInterval(this, interval)
            Settings.setBackendUrl(this, url)
            Settings.setPersonality(this, personality)
            Settings.setQuietModeEnabled(this, quietSwitch.isChecked)

            val newUrl = backendUrlInput.text.toString()
            if (newUrl.isNotEmpty()) {
                sharedPreferences.edit().putString("backend_url", newUrl).apply()
                Toast.makeText(this, "Backend URL saved!", Toast.LENGTH_SHORT).show()
            } else {
                Toast.makeText(this, "Please enter a valid URL", Toast.LENGTH_SHORT).show()
            }
            finish()
        }
    }
}
