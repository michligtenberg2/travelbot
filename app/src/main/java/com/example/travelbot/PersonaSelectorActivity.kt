package com.example.travelbot

import android.content.Intent
import android.content.SharedPreferences
import android.os.Bundle
import android.view.View
import android.widget.Button
import android.widget.ListView
import android.widget.ProgressBar
import android.widget.Toast
import androidx.appcompat.app.AppCompatActivity
import androidx.appcompat.widget.SearchView
import androidx.recyclerview.widget.LinearLayoutManager
import androidx.recyclerview.widget.RecyclerView
import org.json.JSONArray
import org.json.JSONObject
import java.net.HttpURLConnection
import java.net.URL
import kotlin.concurrent.thread

class PersonaSelectorActivity : AppCompatActivity() {

    private lateinit var sharedPreferences: SharedPreferences
    private lateinit var progressBar: ProgressBar
    private lateinit var personaAdapter: PersonaAdapter

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_persona_selector)

        sharedPreferences = getSharedPreferences("travelbot_prefs", MODE_PRIVATE)
        progressBar = findViewById(R.id.progressBar)

        val searchView = findViewById<SearchView>(R.id.searchView)
        val personaRecyclerView = findViewById<RecyclerView>(R.id.personaRecyclerView)
        val loadButton = findViewById<Button>(R.id.loadPersonaButton)

        // Initialize RecyclerView and Adapter
        personaAdapter = PersonaAdapter(ArrayList())
        personaRecyclerView.layoutManager = LinearLayoutManager(this)
        personaRecyclerView.adapter = personaAdapter

        // Fetch personas from backend
        fetchPersonas()

        // Search functionality
        searchView.setOnQueryTextListener(object : SearchView.OnQueryTextListener {
            override fun onQueryTextSubmit(query: String?): Boolean {
                return false
            }

            override fun onQueryTextChange(newText: String?): Boolean {
                personaAdapter.filter.filter(newText)
                return true
            }
        })

        // Load selected persona
        loadButton.setOnClickListener {
            val selectedPosition = personaRecyclerView.getChildAdapterPosition(personaRecyclerView.focusedChild!!)
            if (selectedPosition != -1) {
                val selectedPersona = personaAdapter.getItem(selectedPosition)

                // Check if persona is already downloaded
                val localPersona = sharedPreferences.getString(selectedPersona, null)
                if (localPersona != null) {
                    Toast.makeText(this, "Loaded local persona: $selectedPersona", Toast.LENGTH_SHORT).show()
                    val intent = Intent(this, MainActivity::class.java)
                    intent.putExtra("persona", localPersona)
                    startActivity(intent)
                } else {
                    // Download persona from backend
                    progressBar.visibility = View.VISIBLE
                    thread {
                        try {
                            val url = URL("https://your-backend-url.com/load-persona/$selectedPersona")
                            val connection = url.openConnection() as HttpURLConnection
                            connection.requestMethod = "GET"

                            val response = connection.inputStream.bufferedReader().use { it.readText() }
                            val persona = JSONObject(response)

                            // Save persona locally
                            sharedPreferences.edit().putString(selectedPersona, persona.toString()).apply()

                            runOnUiThread {
                                progressBar.visibility = View.GONE
                                Toast.makeText(this, "Downloaded and loaded persona: ${persona.getString("name")}", Toast.LENGTH_SHORT).show()
                                val intent = Intent(this, MainActivity::class.java)
                                intent.putExtra("persona", persona.toString())
                                startActivity(intent)
                            }
                        } catch (e: Exception) {
                            runOnUiThread {
                                progressBar.visibility = View.GONE
                                Toast.makeText(this, "Failed to download persona: ${e.message}", Toast.LENGTH_SHORT).show()
                            }
                        }
                    }
                }
            } else {
                Toast.makeText(this, "Please select a persona", Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun fetchPersonas() {
        thread {
            try {
                val url = URL("https://your-backend-url.com/personas")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"

                val response = connection.inputStream.bufferedReader().use { it.readText() }
                val personas = JSONArray(response)

                val personaNames = ArrayList<String>()
                for (i in 0 until personas.length()) {
                    val persona = personas.getJSONObject(i)
                    personaNames.add(persona.getString("name"))
                }

                runOnUiThread {
                    personaAdapter.updateData(personaNames)
                }
            } catch (e: Exception) {
                runOnUiThread {
                    Toast.makeText(this, "Failed to fetch personas: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }

    // Add bulk download functionality
    private fun downloadAllPersonas() {
        progressBar.visibility = View.VISIBLE
        thread {
            try {
                val url = URL("https://your-backend-url.com/personas")
                val connection = url.openConnection() as HttpURLConnection
                connection.requestMethod = "GET"

                val response = connection.inputStream.bufferedReader().use { it.readText() }
                val personas = JSONArray(response)

                for (i in 0 until personas.length()) {
                    val persona = personas.getJSONObject(i)
                    val name = persona.getString("name")

                    // Save each persona locally
                    sharedPreferences.edit().putString(name, persona.toString()).apply()
                }

                runOnUiThread {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this, "All personas downloaded successfully!", Toast.LENGTH_SHORT).show()
                }
            } catch (e: Exception) {
                runOnUiThread {
                    progressBar.visibility = View.GONE
                    Toast.makeText(this, "Failed to download personas: ${e.message}", Toast.LENGTH_SHORT).show()
                }
            }
        }
    }
}
