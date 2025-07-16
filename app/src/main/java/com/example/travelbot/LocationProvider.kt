package com.example.travelbot

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import androidx.core.app.ActivityCompat

object LocationProvider {

    fun getLocation(context: Context): Location? {
        val manager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

        val hasFine = ActivityCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_FINE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        val hasCoarse = ActivityCompat.checkSelfPermission(
            context,
            Manifest.permission.ACCESS_COARSE_LOCATION
        ) == PackageManager.PERMISSION_GRANTED

        if (!hasFine && !hasCoarse) return null

        var location: Location? = null
        val providers = manager.getProviders(true)
        for (p in providers) {
            val l = manager.getLastKnownLocation(p) ?: continue
            if (location == null || l.accuracy < location!!.accuracy) {
                location = l
            }
        }
        return location
    }
}