package com.example.travelbot

import android.Manifest
import android.content.Intent
import android.content.pm.PackageManager
import android.os.Bundle
import android.widget.Button
import android.widget.EditText
import androidx.appcompat.app.AppCompatActivity
import androidx.core.app.ActivityCompat
import androidx.core.content.ContextCompat

class MainActivity : AppCompatActivity() {

    private lateinit var ttsManager: TtsManager

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
        val input = findViewById<EditText>(R.id.questionInput)

        askButton.setOnClickListener {
            val question = input.text.toString()
            val loc = LocationProvider.getLocation(this)
            if (loc != null && question.isNotBlank()) {
                Thread {
                    val response = ApiClient.sendLocation(loc.latitude, loc.longitude, question)
                    if (response != null) {
                        runOnUiThread { input.text.clear() }
                        ttsManager.speak(response)
                    }
                }.start()
            }
        }

        soundButton.setOnClickListener {
            ttsManager.speak("Hou je bek, ik probeer hier wat te vertellen!")
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