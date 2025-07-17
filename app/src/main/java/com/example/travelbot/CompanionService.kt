package com.example.travelbot

// Service die op de achtergrond draait en periodiek de locatie ophaalt om een
// nieuwe opmerking van Henk op te vragen en te laten uitspreken.

import android.app.Notification
import android.app.NotificationChannel
import android.app.NotificationManager
import android.app.Service
import android.content.Context
import android.content.Intent
import android.os.Build
import android.os.IBinder
import android.location.Location
import android.location.Geocoder
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.Job
import kotlinx.coroutines.SupervisorJob
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import java.util.Locale

class CompanionService : Service() {

    private val scope = CoroutineScope(Dispatchers.Main + SupervisorJob())
    private var task: Job? = null
    private lateinit var ttsManager: TtsManager
    private var lastLocation: Location? = null
    private var lastMunicipality: String? = null

    override fun onCreate() {
        super.onCreate()
        ttsManager = TtsManager(this)
        createNotificationChannel()
    }

    override fun onStartCommand(intent: Intent?, flags: Int, startId: Int): Int {
        startForeground(1, createNotification())
        scheduleNext()
        return START_STICKY
    }

    private fun scheduleNext() {
        task?.cancel()
        task = scope.launch {
            val minutes = (10..20).random()
            delay(minutes * 60 * 1000L)
            if (isActive) {
                fetchAndSpeak()
                scheduleNext()
            }
        }
    }

    private fun fetchAndSpeak() {
        val location = LocationProvider.getLocation(this) ?: return

        val municipality = getMunicipality(location)
        val distance = lastLocation?.distanceTo(location) ?: Float.MAX_VALUE
        val changed = municipality != lastMunicipality

        if (distance > 500 || changed) {
            lastLocation = location
            lastMunicipality = municipality
            scope.launch(Dispatchers.IO) {
                val response = ApiClient.sendLocation(this@CompanionService, location.latitude, location.longitude)
                if (response != null) {
                    withContext(Dispatchers.Main) { ttsManager.speak(response) }
                }
            }
            // restart jitter when location changes significantly
            scheduleNext()
        }
    }

    private fun getMunicipality(loc: Location): String {
        return try {
            val geocoder = Geocoder(this, Locale.getDefault())
            val addr = geocoder.getFromLocation(loc.latitude, loc.longitude, 1)?.firstOrNull()
            addr?.subAdminArea ?: addr?.locality ?: ""
        } catch (e: Exception) {
            ""
        }
    }

    override fun onDestroy() {
        task?.cancel()
        scope.cancel()
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
