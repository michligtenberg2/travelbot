package com.example.travelbot

import android.content.Context
import android.location.Location
import java.util.Calendar

object QuietMode {
    private var lastLocation: Location? = null
    private var lastMoveTime: Long = System.currentTimeMillis()

    fun updateLocation(loc: Location) {
        if (lastLocation == null || loc.distanceTo(lastLocation) > 10) {
            lastMoveTime = System.currentTimeMillis()
        }
        lastLocation = loc
    }

    fun isSleeping(context: Context): Boolean {
        if (!Settings.isQuietModeEnabled(context)) return false
        val noMovement = System.currentTimeMillis() - lastMoveTime > 10 * 60 * 1000
        val hour = Calendar.getInstance().get(Calendar.HOUR_OF_DAY)
        val night = hour < 7 || hour >= 23
        return noMovement || night
    }
}
