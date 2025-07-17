package com.example.travelbot

// Hoofdscherm van de app waar je een vraag kunt stellen aan Henk en extra
// schermen kunt openen.

import android.Manifest
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.EditText
import android.widget.ScrollView
import android.widget.TextView
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

import com.example.travelbot.Logger

class MainActivity : AppCompatActivity() {

    private lateinit var ttsManager: TtsManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        ttsManager = TtsManager(this)
        Logger.attachView(findViewById(R.id.logView))
        Logger.log("MainActivity created")

        requestPermissions()

        ContextCompat.startForegroundService(
            this,
            Intent(this, CompanionService::class.java)
        )

        val askButton = findViewById<Button>(R.id.askButton)
        val soundButton = findViewById<Button>(R.id.soundButton)
        val settingsButton = findViewById<Button>(R.id.settingsButton)
        val toggleButton = findViewById<Button>(R.id.toggleLogButton)
        val logScroll = findViewById<ScrollView>(R.id.logScroll)
        val input = findViewById<EditText>(R.id.questionInput)

        toggleButton.setOnClickListener {
            if (logScroll.visibility == View.GONE) {
                logScroll.visibility = View.VISIBLE
                toggleButton.text = "Verberg logs"
            } else {
                logScroll.visibility = View.GONE
                toggleButton.text = "Toon logs"
            }
        }

        askButton.setOnClickListener {
            val question = input.text.toString()
            val loc = LocationProvider.getLocation(this)
            if (loc != null && question.isNotBlank()) {
                Thread {
                    Logger.log("Vraag: $question")
                    val response = ApiClient.sendLocation(this, loc.latitude, loc.longitude, question)
                    if (response != null) {
                        runOnUiThread { input.text.clear() }
                        Logger.log("Antwoord: $response")
                        ttsManager.speak(response)
                    }
                }.start()
            }
        }

        settingsButton.setOnClickListener {
            startActivity(Intent(this, SettingsActivity::class.java))
        }

        soundButton.setOnClickListener {
            startActivity(Intent(this, SoundboardActivity::class.java))
        }
    }

    override fun onDestroy() {
        ttsManager.shutdown()
        super.onDestroy()
    }

    private fun requestPermissions() {
        val perms = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.ACCESS_COARSE_LOCATION
        )
        ActivityCompat.requestPermissions(this, perms, 0)
        Logger.log("Permissions requested")
    }
}