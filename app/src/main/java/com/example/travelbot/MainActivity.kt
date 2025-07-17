package com.example.travelbot

// Hoofdscherm van de app waar je een vraag kunt stellen aan Henk en extra
// schermen kunt openen.

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import android.widget.TextView
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var ttsManager: TtsManager
    private lateinit var statusText: TextView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        ttsManager = TtsManager(this)

        requestPermissions()

        ContextCompat.startForegroundService(
            this,
            Intent(this, CompanionService::class.java)
        )

        val askButton = findViewById<Button>(R.id.askButton)
        val soundButton = findViewById<Button>(R.id.soundButton)
        val settingsButton = findViewById<Button>(R.id.settingsButton)
        val input = findViewById<EditText>(R.id.questionInput)
        statusText = findViewById(R.id.sleepStatus)

        updateStatus()

        askButton.setOnClickListener {
            val question = input.text.toString()
            val loc = LocationProvider.getLocation(this)
            if (loc != null && question.isNotBlank()) {
                QuietMode.updateLocation(loc)
                Thread {
                    val response = ApiClient.sendLocation(this, loc.latitude, loc.longitude, question)
                    if (response != null) {
                        runOnUiThread {
                            input.text.clear()
                            updateStatus()
                        }
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

    override fun onResume() {
        super.onResume()
        updateStatus()
    }

    private fun updateStatus() {
        statusText.text = if (QuietMode.isSleeping(this)) {
            getString(R.string.status_sleeping)
        } else {
            getString(R.string.status_awake)
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
    }
}