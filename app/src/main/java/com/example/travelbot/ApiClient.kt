package com.example.travelbot

import android.content.Context
import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.lang.Exception
import java.net.HttpURLConnection
import java.net.URL

object ApiClient {

    fun sendLocation(context: Context, lat: Double, lon: Double, question: String? = null): String? {
        val baseUrl = Settings.getBackendUrl(context)
        val url = URL("$baseUrl/comment")
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
            json.optString("text")
        } catch (e: Exception) {
            e.printStackTrace()
            null
        }
    }
}