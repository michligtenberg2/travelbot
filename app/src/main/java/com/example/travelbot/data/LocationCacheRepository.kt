package com.example.travelbot.data

import android.content.Context
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import kotlin.math.roundToInt

/**
 * Repository to manage location caching with Room database
 */
class LocationCacheRepository(context: Context) {
    
    private val dao = TravelBotDatabase.getDatabase(context).locationCacheDao()
    
    /**
     * Generates a cache key from latitude and longitude
     */
    private fun generateCacheKey(lat: Double, lon: Double): String {
        val rLat = (lat * 100).roundToInt() / 100.0
        val rLon = (lon * 100).roundToInt() / 100.0
        return "${rLat}_${rLon}"
    }
    
    /**
     * Saves a location response to cache
     */
    suspend fun saveLocationResponse(
        lat: Double, 
        lon: Double, 
        response: String, 
        personality: String
    ) {
        withContext(Dispatchers.IO) {
            val cacheEntry = LocationCache(
                id = generateCacheKey(lat, lon),
                latitude = lat,
                longitude = lon,
                response = response,
                personality = personality
            )
            dao.insertLocationResponse(cacheEntry)
        }
    }
    
    /**
     * Retrieves cached response for a location
     */
    suspend fun getCachedResponse(lat: Double, lon: Double, personality: String): String? {
        return withContext(Dispatchers.IO) {
            val cacheKey = generateCacheKey(lat, lon)
            val cached = dao.getLocationResponse(cacheKey)
            // Return cached response only if personality matches
            if (cached?.personality == personality) {
                cached.response
            } else {
                null
            }
        }
    }
    
    /**
     * Cleans up old cache entries (older than 24 hours)
     */
    suspend fun cleanupOldEntries() {
        withContext(Dispatchers.IO) {
            val yesterday = System.currentTimeMillis() - (24 * 60 * 60 * 1000)
            dao.deleteOldEntries(yesterday)
        }
    }
    
    /**
     * Clears all cached data
     */
    suspend fun clearCache() {
        withContext(Dispatchers.IO) {
            dao.clearAll()
        }
    }
}