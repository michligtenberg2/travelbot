package com.example.travelbot

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.Handler
import android.os.IBinder
import android.os.Looper

class CompanionService : Service() {

    private val handler = Handler(Looper.getMainLooper())
    private lateinit var ttsManager: TtsManager

    override fun onCreate() {
        super.onCreate()
        ttsManager = TtsManager(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, createNotification())
        scheduleTask()
        return START_STICKY
    }

    private fun scheduleTask() {
        handler.post(object : Runnable {
            override fun run() {
                fetchAndSpeak()
                val minutes = Settings.getInterval(this@CompanionService)
                handler.postDelayed(this, minutes * 60 * 1000L)
            }
        })
    }

    private fun fetchAndSpeak() {
        val location = LocationProvider.getLocation(this)
        if (location != null) {
            Thread {
                val response = ApiClient.sendLocation(this@CompanionService, location.latitude, location.longitude)
                if (response != null) {
                    ttsManager.speak(response)
                }
            }.start()
        }
    }

    override fun onDestroy() {
        handler.removeCallbacksAndMessages(null)
        ttsManager.shutdown()
        super.onDestroy()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    private fun createNotification(): Notification {
        val builder = Notification.Builder(this, CHANNEL_ID)
            .setContentTitle("Travelbot actief")
            .setSmallIcon(android.R.drawable.ic_dialog_info)
        return builder.build()
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val channel = NotificationChannel(
                CHANNEL_ID,
                "Travelbot",
                NotificationManager.IMPORTANCE_LOW
            )
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    companion object {
        private const val CHANNEL_ID = "travelbot_channel"
    }
}