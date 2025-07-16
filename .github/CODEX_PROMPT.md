# Codex Prompt: Help me finish Travelbot

You are an AI assistant working on an Android + Flask project.

The Android app runs on an old phone and sends location data to the Flask backend every 15 minutes. The backend fetches local info (Wikipedia) and generates a comment using OpenAI GPT, spoken by a Dutch character named Henk.

The Android app is in `/app/`, the backend in `/app.py`.

Please help me:
- Wire the Android app to call the backend every 15 mins
- Trigger TTS on the returned text
- Handle the `askButton` (user questions) and connect it to the backend
- Make it stable and log errors

Use Kotlin best practices. Add helper classes if needed.