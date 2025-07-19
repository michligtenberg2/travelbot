package com.example.travelbot

import android.os.Bundle
import android.widget.Button
import android.widget.LinearLayout
import androidx.appcompat.app.AppCompatActivity

class SoundboardActivity : AppCompatActivity() {

    private lateinit var ttsManager: TtsManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_soundboard)

        ttsManager = TtsManager(this)

        val container = findViewById<LinearLayout>(R.id.buttonContainer)
        val persona = Settings.getPersonality(this)
        val phrases = PersonaManager.getPhrases(persona)

        for (phrase in phrases) {
            val btn = Button(this)
            btn.text = phrase.label
            btn.setOnClickListener { ttsManager.speak(phrase.text) }
            container.addView(btn)
        }
    }

    override fun onDestroy() {
        ttsManager.shutdown()
        super.onDestroy()
    }
}

