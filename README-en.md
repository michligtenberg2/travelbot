# 🚗 Travelbot

**Travelbot** is a location-aware roadtrip companion powered by AI. It runs on an Android phone and speaks every ~15 minutes with sarcastic or informative commentary in the voice of “Henk”, a grumpy Amsterdammer from the Jordaan.

This repo contains:
- ✅ A Flask backend (`app.py`) that receives location data and generates a funny Dutch remark using OpenAI.
- ✅ A minimal Android app that sends location data and plays the TTS response.
- ✅ GitHub Codespaces support — no local setup required!

## 🧠 What does it do?

1. The Android app sends GPS coordinates to the `/comment` endpoint.
2. The backend uses Wikipedia and GPT to generate a characterful Dutch response.
3. The app speaks it aloud using Text-to-Speech.

## 🚀 Getting Started in Codespaces

1. Click **“Use this template”** or open this repo in GitHub.
2. Click **“Code > Codespaces > Create new codespace”**.
3. Wait for it to set up (~1 min).
4. Install the requirements:

```bash
pip install -r backend/requirements.txt
```

5. Run the backend:

```bash
python app.py
```

Your backend is now live at `http://localhost:5000` (forwarded).

## 🔑 Set your API key

In `.bashrc` or terminal:

```bash
export OPENAI_API_KEY=sk-xxx
```

Or add it via Codespaces secrets.

## 📱 Android

Install the app from `/app/` onto your phone. It will call the backend and speak Henk’s remarks.