package com.example.travelbot

import android.content.SharedPreferences
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity

class CustomPersonaActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_custom_persona)

        sharedPreferences = getSharedPreferences("travelbot_prefs", MODE_PRIVATE)

        val nameInput = findViewById<EditText>(R.id.personaNameInput)
        val descriptionInput = findViewById<EditText>(R.id.personaDescriptionInput)
        val saveButton = findViewById<Button>(R.id.savePersonaButton)

        saveButton.setOnClickListener {
            val name = nameInput.text.toString()
            val description = descriptionInput.text.toString()

            if (name.isNotEmpty() && description.isNotEmpty()) {
                val persona = "{"name":"$name","description":"$description"}"
                sharedPreferences.edit().putString(name, persona).apply()
                Toast.makeText(this, "Persona saved successfully!", Toast.LENGTH_SHORT).show()
                finish()
            } else {
                Toast.makeText(this, "Please fill in all fields", Toast.LENGTH_SHORT).show()
            }
        }
    }
}
