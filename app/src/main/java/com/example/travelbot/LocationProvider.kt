package com.example.travelbot

import android.Manifest
import android.content.Context
import android.content.pm.PackageManager
import android.location.Location
import android.location.LocationManager
import androidx.core.app.ActivityCompat
import com.google.android.gms.location.FusedLocationProviderClient
import com.google.android.gms.location.LocationServices

/**
 * LocationProvider is verantwoordelijk voor het ophalen van de huidige locatie van de gebruiker.
 * Het controleert permissies en gebruikt beschikbare providers om de meest nauwkeurige locatie te bepalen.
 */
object LocationProvider {

    private lateinit var fusedLocationClient: FusedLocationProviderClient

    /**
     * Initialiseert de LocationProvider met de gegeven context.
     *
     * @param context De context van de applicatie.
     */
    fun init(context: Context) {
        fusedLocationClient = LocationServices.getFusedLocationProviderClient(context)
    }

    /**
     * Haalt de huidige locatie van de gebruiker op.
     *
     * @param context De context van de applicatie.
     * @return De meest nauwkeurige beschikbare locatie, of null als geen locatie beschikbaar is.
     */
    fun getLocation(context: Context): Location? {
        val manager = context.getSystemService(Context.LOCATION_SERVICE) as LocationManager

        // Controleer of de vereiste permissies zijn verleend.
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

    /**
     * Haalt de laatst bekende locatie op met behulp van de Fused Location Provider.
     *
     * @param callback De callback die wordt aangeroepen met de laatst bekende locatie.
     */
    fun getLastKnownLocation(callback: (Location?) -> Unit) {
        fusedLocationClient.lastLocation
            .addOnSuccessListener { location -> callback(location) }
            .addOnFailureListener { callback(null) }
    }
}