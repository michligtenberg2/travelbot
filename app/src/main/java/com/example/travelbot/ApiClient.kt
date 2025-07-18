package com.example.travelbot

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.json.JSONObject
import java.io.BufferedReader
import java.io.IOException
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.roundToInt
import com.example.travelbot.data.LocationCacheRepository

/**
 * ApiClient is verantwoordelijk voor het communiceren met de backend API.
 * Het biedt methoden om locatiegegevens te verzenden en reacties op te halen.
 */
object ApiClient {
    private const val TAG = "ApiClient"
    private const val PREFS_NAME = "travelbot_cache"
    private const val KEY_BACKEND_URL = "backend_url"
    private const val DEFAULT_BACKEND_URL = "http://10.0.2.2:5000"

    private var cacheRepository: LocationCacheRepository? = null

    /**
     * Initializes the cache repository
     */
    private fun initCacheRepository(context: Context) {
        if (cacheRepository == null) {
            cacheRepository = LocationCacheRepository(context)
        }
    }

    /**
     * Haalt de SharedPreferences op voor legacy caching support.
     *
     * @param context De context van de applicatie.
     * @return SharedPreferences object voor caching.
     */
    private fun cachePrefs(context: Context): SharedPreferences =
        context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    /**
     * Genereert een unieke sleutel voor caching op basis van latitude en longitude.
     *
     * @param lat Latitude van de locatie.
     * @param lon Longitude van de locatie.
     * @return Een unieke cache-sleutel.
     */
    private fun cacheKey(lat: Double, lon: Double): String {
        val rLat = (lat * 100).roundToInt() / 100.0
        val rLon = (lon * 100).roundToInt() / 100.0
        return "${'$'}rLat_${'$'}rLon"
    }

    /**
     * Helperfunctie om een HTTP POST-verzoek uit te voeren.
     *
     * @param url De URL van de backend.
     * @param body De JSON-string die moet worden verzonden.
     * @param context De context van de applicatie.
     * @return De JSON-string van de serverrespons.
     */
    private suspend fun postRequest(url: URL, body: String, context: Context): String {
        return withContext(Dispatchers.IO) {
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.doOutput = true
            conn.setRequestProperty("Content-Type", "application/json")
            val apiKey = Settings.getApiKey(context)
            if (apiKey.isNotEmpty()) {
                conn.setRequestProperty("X-API-KEY", apiKey)
            }

            OutputStreamWriter(conn.outputStream).use { it.write(body) }

            val response = StringBuilder()
            BufferedReader(InputStreamReader(conn.inputStream)).use { reader ->
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
            }
            response.toString()
        }
    }

    /**
     * Verzendt locatiegegevens naar de backend en haalt een reactie op.
     * Deze functie is asynchroon gemaakt om de hoofdthread niet te blokkeren.
     * Gebruikt Room database voor geavanceerd caching.
     *
     * @param context De context van de applicatie.
     * @param lat Latitude van de locatie.
     * @param lon Longitude van de locatie.
     * @param question Optionele vraag om mee te sturen.
     * @return De reactie van de backend als string, of null bij een fout.
     */
    suspend fun sendLocationAsync(context: Context, lat: Double, lon: Double, question: String? = null): String? {
        initCacheRepository(context)
        
        val baseUrl = Settings.getBackendUrl(context)
        val url = URL("$baseUrl/comment")
        val personality = Settings.getPersonality(context)
        val body = JSONObject().apply {
            put("lat", lat)
            put("lon", lon)
            put("style", personality)
            if (question != null) put("question", question)
        }.toString()

        return try {
            // Try to get from Room cache first
            val cachedResponse = cacheRepository?.getCachedResponse(lat, lon, personality)
            if (cachedResponse != null) {
                Log.d(TAG, "Using Room cache for location ${cacheKey(lat, lon)}")
                return cachedResponse
            }

            // If not in Room cache, make API call
            val response = postRequest(url, body, context)
            val json = JSONObject(response)
            val text = json.optString("text")
            
            // Save to Room cache
            cacheRepository?.saveLocationResponse(lat, lon, text, personality)
            text
        } catch (e: IOException) {
            Log.e(TAG, "Netwerkfout: ${e.message}", e)
            
            // Try Room cache as fallback
            val cachedResponse = cacheRepository?.getCachedResponse(lat, lon, personality)
            if (cachedResponse != null) {
                Log.d(TAG, "Using Room cache fallback for location ${cacheKey(lat, lon)}")
                cachedResponse
            } else {
                // Fall back to legacy SharedPreferences cache
                val key = cacheKey(lat, lon)
                val legacyCached = cachePrefs(context).getString(key, null)
                if (legacyCached != null) {
                    Log.d(TAG, "Using legacy cache for location $key")
                    legacyCached
                } else {
                    "Kon geen verbinding maken met de server. Controleer je internetverbinding."
                }
            }
        } catch (e: Exception) {
            Log.e(TAG, "Onverwachte fout: ${e.message}", e)
            "Er is een onverwachte fout opgetreden. Probeer het later opnieuw."
        }
    }

    /**
     * Haalt de backend-URL op uit de SharedPreferences.
     * Als er geen aangepaste URL is ingesteld, wordt een standaardwaarde gebruikt.
     *
     * @param context De context van de applicatie.
     * @return De backend-URL als string.
     */
    private fun getBackendUrl(context: Context): String {
        val prefs = context.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)
        return prefs.getString(KEY_BACKEND_URL, DEFAULT_BACKEND_URL) ?: DEFAULT_BACKEND_URL
    }

    /**
     * Clears the cache (both Room and legacy)
     * 
     * @param context De context van de applicatie.
     */
    suspend fun clearCache(context: Context) {
        initCacheRepository(context)
        cacheRepository?.clearCache()
        
        // Also clear legacy SharedPreferences cache
        cachePrefs(context).edit().clear().apply()
        Log.d(TAG, "Cache cleared")
    }

    /**
     * Cleanup old cache entries
     * 
     * @param context De context van de applicatie.
     */
    suspend fun cleanupCache(context: Context) {
        initCacheRepository(context)
        cacheRepository?.cleanupOldEntries()
        Log.d(TAG, "Old cache entries cleaned up")
    }

    /**
     * Haalt gegevens op van de backend.
     * Dit is een algemene functie die kan worden gebruikt om verschillende eindpunten te benaderen.
     *
     * @param context De context van de applicatie.
     * @param endpoint Het specifieke eindpunt om gegevens van op te halen.
     * @return Een JSONObject met de responsgegevens, of null bij een fout.
     */
    suspend fun fetchData(context: Context, endpoint: String): JSONObject? {
        return withContext(Dispatchers.IO) {
            val backendUrl = getBackendUrl(context)
            val url = "$backendUrl/$endpoint"
            try {
                val connection = URL(url).openConnection() as HttpURLConnection
                connection.requestMethod = "GET"
                val apiKey = Settings.getApiKey(context)
                if (apiKey.isNotEmpty()) {
                    connection.setRequestProperty("X-API-KEY", apiKey)
                }

                val responseCode = connection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val reader = BufferedReader(InputStreamReader(connection.inputStream))
                    val response = reader.readText()
                    reader.close()
                    JSONObject(response)
                } else {
                    Log.e(TAG, "Error: HTTP $responseCode")
                    null
                }
            } catch (e: IOException) {
                Log.e(TAG, "IOException: ${e.message}")
                null
            }
        }
    }
}