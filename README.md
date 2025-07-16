# travelbot

A lightweight Android companion app that provides humorous spoken commentary about a user's journey. The app runs on an older Android phone and periodically speaks in the persona of a Dutch man from Amsterdam's Jordaan neighborhood. Below is an architecture proposal and sample code snippets for a prototype implementation.

## Architecture Overview

```
[Android Device] <--- HTTPS ---> [Backend Server]
```

- **Android client**: Runs as a foreground service. It collects location updates, sends them to a backend and plays responses using Text-to-Speech. A simple UI allows the user to ask questions or trigger preset lines.
- **Backend server**: Receives location data, gathers information about points of interest using open APIs (e.g., Wikipedia/Wikidata/OpenStreetMap) and generates short Dutch comments in the required persona using an LLM. The server returns a text response to the client.

## Android App Components

1. **MainActivity** – hosts the UI with buttons to ask a question, play soundboard lines and toggle commentary.
2. **CompanionService** – foreground service started on boot. It handles periodic location updates and schedules commentary roughly every 15 minutes.
3. **LocationProvider** – wraps `FusedLocationProviderClient` (or `LocationManager` on older devices) to obtain GPS coordinates.
4. **ApiClient** – sends location or user questions to the backend server and retrieves the generated text.
5. **TtsManager** – manages Android's `TextToSpeech` engine to speak text in Dutch.

## Kotlin Snippets

### Foreground Service
```kotlin
class CompanionService : Service() {
    private lateinit var locationProvider: LocationProvider

    override fun onCreate() {
        super.onCreate()
        startForeground(1, buildNotification())
        locationProvider = LocationProvider(this) { location ->
            sendLocation(location)
        }
        locationProvider.startUpdates()
    }

    override fun onBind(intent: Intent?): IBinder? = null

    override fun onDestroy() {
        locationProvider.stopUpdates()
        super.onDestroy()
    }
}
```

### Making a Request to the Backend
```kotlin
class ApiClient(private val context: Context) {
    private val http = OkHttpClient()

    suspend fun fetchComment(payload: JSONObject): String = withContext(Dispatchers.IO) {
        val body = RequestBody.create(
            "application/json".toMediaType(),
            payload.toString()
        )
        val request = Request.Builder()
            .url("https://your-server.example.com/comment")
            .post(body)
            .build()
        http.newCall(request).execute().use { resp ->
            if (!resp.isSuccessful) throw IOException("Unexpected code $resp")
            resp.body!!.string()
        }
    }
}
```

### Text-to-Speech
```kotlin
class TtsManager(context: Context) : TextToSpeech.OnInitListener {
    private var tts: TextToSpeech? = TextToSpeech(context, this)

    override fun onInit(status: Int) {
        if (status == TextToSpeech.SUCCESS) {
            tts?.language = Locale("nl", "NL")
        }
    }

    fun speak(text: String) {
        tts?.speak(text, TextToSpeech.QUEUE_ADD, null, null)
    }

    fun shutdown() {
        tts?.shutdown()
    }
}
```

### Basic UI Elements
```kotlin
class MainActivity : AppCompatActivity() {
    private lateinit var api: ApiClient
    private lateinit var tts: TtsManager

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_main)

        api = ApiClient(this)
        tts = TtsManager(this)

        findViewById<Button>(R.id.askButton).setOnClickListener {
            // send user question to backend
        }
        findViewById<Button>(R.id.soundboardButton).setOnClickListener {
            tts.speak("Hé, daar gaan we weer!")
        }
    }
}
```

## Example Backend Endpoint (Flask)
```python
from flask import Flask, request, jsonify
app = Flask(__name__)

@app.post('/comment')
def comment():
    data = request.get_json()
    # TODO: lookup points of interest with data['location']
    # TODO: query LLM and generate Dutch response
    return jsonify(text="Dit is een voorbeeldreactie.")
```

This outline is intentionally lightweight to keep the client simple and offload heavier tasks like AI text generation to the server.

