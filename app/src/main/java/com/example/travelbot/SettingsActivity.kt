package com.example.travelbot

import android.os.Bundle
import android.widget.ArrayAdapter
import com.google.android.material.button.MaterialButton
import com.google.android.material.textfield.TextInputEditText
import com.google.android.material.textfield.TextInputLayout
import androidx.appcompat.app.AppCompatActivity
import android.widget.Spinner

class SettingsActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_settings)

        val intervalInput = findViewById<TextInputEditText>(R.id.intervalInput)
        val urlInput = findViewById<TextInputEditText>(R.id.urlInput)
        val personaSpinner = findViewById<Spinner>(R.id.personaSpinner)
        val quietSwitch = findViewById<android.widget.Switch>(R.id.quietSwitch)
        val saveButton = findViewById<MaterialButton>(R.id.saveButton)

        val personas = PersonaManager.getNames()
        personaSpinner.adapter = ArrayAdapter(this, android.R.layout.simple_spinner_dropdown_item, personas)

        intervalInput.setText(Settings.getInterval(this).toString())
        urlInput.setText(Settings.getBackendUrl(this))
        personaSpinner.setSelection(personas.indexOf(Settings.getPersonality(this)))
        quietSwitch.isChecked = Settings.isQuietModeEnabled(this)

        saveButton.setOnClickListener {
            val interval = intervalInput.text.toString().toIntOrNull() ?: 15
            val url = urlInput.text.toString().ifBlank { "http://10.0.2.2:5000" }
            val personality = personaSpinner.selectedItem as String
            Settings.setInterval(this, interval)
            Settings.setBackendUrl(this, url)
            Settings.setPersonality(this, personality)
            Settings.setQuietModeEnabled(this, quietSwitch.isChecked)
            finish()
        }
    }
}
