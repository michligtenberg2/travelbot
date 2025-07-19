package com.example.travelbot

import android.os.Bundle
import android.util.Log
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.launch
import kotlinx.coroutines.withContext
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import java.io.File
import kotlin.math.min

class MarketplaceActivity : AppCompatActivity() {

    private var personas: List<JSONObject> = emptyList()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_marketplace)

        val marketplaceRecyclerView = findViewById<RecyclerView>(R.id.marketplaceRecyclerView)
        marketplaceRecyclerView.layoutManager = LinearLayoutManager(this)

        // Fetch personas from the marketplace endpoint
        CoroutineScope(Dispatchers.Main).launch {
            val fetchedPersonas = fetchMarketplacePersonas()
            if (fetchedPersonas != null) {
                personas = fetchedPersonas
                val pageSize = 10
                var currentPage = 0
                val currentPersonas = fetchMarketplacePersonasPaginated(currentPage, pageSize)
                val adapter = PersonaRecyclerAdapter(currentPersonas.map { it.getString("name") })
                marketplaceRecyclerView.adapter = adapter
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

    private fun fetchMarketplacePersonasPaginated(page: Int, pageSize: Int): List<JSONObject> {
        val start = page * pageSize
        val end = min(start + pageSize, personas.size)
        return personas.subList(start, end)
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

    private fun savePersonaLocally(personaName: String, personaData: String) {
        val file = File(filesDir, "$personaName.json")
        file.writeText(personaData)
    }

    private fun loadPersonaLocally(personaName: String): String? {
        val file = File(filesDir, "$personaName.json")
        return if (file.exists()) file.readText() else null
    }
}
