package com.example.travelbot

import android.os.Bundle
import android.util.Log
import android.widget.ListView
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL

class MarketplaceActivity : AppCompatActivity() {

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_marketplace)

        val marketplaceListView = findViewById<ListView>(R.id.marketplaceListView)

        // Fetch personas from the marketplace endpoint
        CoroutineScope(Dispatchers.Main).launch {
            val personas = fetchMarketplacePersonas()
            if (personas != null) {
                val personaNames = personas.map { it.getString("name") }
                val adapter = PersonaListAdapter(this@MarketplaceActivity, personaNames)
                marketplaceListView.adapter = adapter
            } else {
                Toast.makeText(this@MarketplaceActivity, "Failed to load marketplace personas", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private suspend fun fetchMarketplacePersonas(): List<JSONObject>? {
        return withContext(Dispatchers.IO) {
            try {
                val url = URL("https://your-backend-url.com/marketplace")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"

                val responseCode = connection.responseCode
                if (responseCode == HttpURLConnection.HTTP_OK) {
                    val response = connection.inputStream.bufferedReader().use { it.readText() }
                    val jsonArray = JSONArray(response)
                    List(jsonArray.length()) { jsonArray.getJSONObject(it) }
                } else {
                    null
                }
            } catch (e: Exception) {
                null
            }
        }
    }

    private fun loadMarketplace() {
        try {
            // ...existing code...
            val response = apiClient.getMarketplaceItems()
            if (response.isSuccessful) {
                // ...existing code...
            } else {
                Log.e("MarketplaceActivity", "Failed to load marketplace: ${response.errorBody()?.string()}")
                Toast.makeText(this, "Failed to load marketplace", Toast.LENGTH_SHORT).show()
            }
        } catch (e: Exception) {
            Log.e("MarketplaceActivity", "Error loading marketplace", e)
            Toast.makeText(this, "An error occurred while loading the marketplace", Toast.LENGTH_SHORT).show()
        }
    }
}
