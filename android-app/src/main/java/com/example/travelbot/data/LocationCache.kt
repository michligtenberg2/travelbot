package com.example.travelbot.data

import androidx.room.Entity
import androidx.room.PrimaryKey
import java.util.*

/**
 * Room entity to cache location responses
 */
@Entity(tableName = "location_cache")
data class LocationCache(
    @PrimaryKey
    val id: String, // Generated from lat/lon
    val latitude: Double,
    val longitude: Double,
    val response: String,
    val personality: String,
    val timestamp: Long = System.currentTimeMillis()
)