package com.example.travelbot

import android.content.Context
import android.content.SharedPreferences
import android.util.Log
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.io.IOException
import java.lang.Exception
import java.net.HttpURLConnection
import java.net.URL
import kotlin.math.roundToInt

/**
 * ApiClient is verantwoordelijk voor het communiceren met de backend API.
 * Het biedt methoden om locatiegegevens te verzenden en reacties op te halen.
 */
object ApiClient {
    private const val TAG = "ApiClient"
    private const val PREFS_NAME = "travelbot_cache"

    /**
     * Haalt de SharedPreferences op voor caching.
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
     * Verzendt locatiegegevens naar de backend en haalt een reactie op.
     *
     * @param context De context van de applicatie.
     * @param lat Latitude van de locatie.
     * @param lon Longitude van de locatie.
     * @param question Optionele vraag om mee te sturen.
     * @return De reactie van de backend als string, of null bij een fout.
     */
    fun sendLocation(context: Context, lat: Double, lon: Double, question: String? = null): String? {
        val baseUrl = Settings.getBackendUrl(context)
        val url = URL("$baseUrl/comment")
        val key = cacheKey(lat, lon)
        val body = JSONObject().apply {
            put("lat", lat)
            put("lon", lon)
            put("style", Settings.getPersonality(context))
            if (question != null) put("question", question)
        }.toString()

        return try {
            val conn = url.openConnection() as HttpURLConnection
            conn.requestMethod = "POST"
            conn.doOutput = true
            conn.setRequestProperty("Content-Type", "application/json")

            OutputStreamWriter(conn.outputStream).use { it.write(body) }

            val response = StringBuilder()
            BufferedReader(InputStreamReader(conn.inputStream)).use { reader ->
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
            }
            val json = JSONObject(response.toString())
            val text = json.optString("text")
            cachePrefs(context).edit().putString(key, text).apply()
            text
        } catch (e: IOException) {
            val cached = cachePrefs(context).getString(key, null)
            return if (cached != null) {
                Log.d(TAG, "Gebruik cache voor locatie $key")
                cached
            } else {
                e.printStackTrace()
                null
            }
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}