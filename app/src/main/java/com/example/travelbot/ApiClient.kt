package com.example.travelbot

import org.json.JSONObject
import java.io.BufferedReader
import java.io.InputStreamReader
import java.io.OutputStreamWriter
import java.lang.Exception
import java.net.HttpURLConnection
import java.net.URL

object ApiClient {

    private const val BASE_URL = "http://10.0.2.2:5000"

    fun sendLocation(lat: Double, lon: Double, question: String? = null): String? {
        val url = URL("$BASE_URL/comment")
        val body = JSONObject().apply {
            put("lat", lat)
            put("lon", lon)
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