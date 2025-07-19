# 🚗 Travelbot

[![Docs](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml/badge.svg)](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Codespaces Ready](https://github.com/codespaces/badge.svg)](https://github.com/codespaces)
[![Made with Kotlin & Flask](https://img.shields.io/badge/Made%20with-Kotlin%20%26%20Flask-blue)](#)

**Travelbot** is an AI travel buddy that cracks a joke about your location every 15 minutes. Available as Android app and modern webapp with GPS support.

🆕 **New: WebApp Edition** - Use TravelBot directly in your browser with GPS tracking!

This file is the English counterpart of the Dutch [README.md](README.md).

## 🚀 New Features in this Release

### 🌐 **WebApp Edition**
- ✅ **Safari-compatible GPS webapp** - Works perfectly on iOS/iPhone
- ✅ **Real-time location tracking** - No app installation required
- ✅ **Interactive AI chat** - Chat directly with your AI travel buddy  
- ✅ **Multiple personas** - Amsterdammer, Belgian, Brabander, Jordanees
- ✅ **Text-to-Speech** - Spoken commentary in browser
- ✅ **PWA ready** - Installable as native app
- ✅ **Background audio support** - Audio continues during screen lock

### 🎭 **AI Character Voices (Preview)**
- 🎤 **OpenAI TTS integration** - Studio-quality AI voices
- 🎵 **Character-specific voices** - Unique voice per persona
- 🔊 **ElevenLabs voice cloning** - Custom character voices (enterprise)
- 🎯 **Smart fallback** - Browser TTS backup

### 💬 **Interactive Features**  
- 🗨️ **Real-time chat interface** - Floating chat during travel
- 📍 **Location-based conversations** - Ask questions about surroundings
- 📱 **Mobile-optimized** - Touch-friendly interface
- 🎨 **Responsive design** - Works on all screen sizes

### 🏢 **Enterprise Edition**
- 📊 **Real-time monitoring dashboard** - Live system metrics
- ⚡ **Advanced error handling** - Smart recovery strategies
- 🧪 **Automated testing framework** - Quality assurance
- 📈 **Performance analytics** - FPS, memory, API tracking

## 📦 Installation

### 🌐 WebApp (Recommended - New!)

**Quick Start:**
```bash
cd webapp
python3 -m http.server 8080
# Open: http://localhost:8080
```

**Features:**
- ✅ No app store required
- ✅ Works on iPhone Safari  
- ✅ Direct GPS support
- ✅ Installable as PWA
- ⚠️ **Note**: HTTPS required for GPS on mobile

[→ Complete WebApp Setup Guide](webapp/README.md)

### � Android App

1. Ensure **Python 3.11+** and an Android phone with **Android 8+**.
2. Clone the repository and install the requirements:

   ```bash
   git clone https://github.com/michligtenberg2/travelbot.git
   cd travelbot
   pip install flask requests
   ```

3. Set your OpenAI API key:

   ```bash
   export OPENAI_API_KEY=sk-xxx
   ```

4. Start the backend:

   ```bash
   cd backend
   python app.py
   ```

5. Open the `app/` folder in Android Studio, build the app, and install the APK on your phone.
6. Enter the address of your backend in the app and you're ready to go!

## 🔧 Usage

### 🌐 WebApp (New!)

1. **Start locally** (development):
   ```bash
   cd webapp
   python3 -m http.server 8080
   ```

2. **Open your browser** to `http://localhost:8080`

3. **Allow GPS access** and choose your AI travel companion

4. **Start the journey** - TravelBot automatically comments every 15 minutes

**Mobile users**: For HTTPS/GPS support, use a tool like ngrok or host on a server.

### 📱 Android App

Open the app, select your persona, and **Travelbot** will automatically start commenting on your journey.

### 🎭 Personas

Choose from different characters:
- **🏛️ The Amsterdammer** - Direct, no-nonsense Amsterdam style
- **🍺 Melancholic Belgian** - Melancholic but funny  
- **🍻 Brabander** - Cozy Brabant humor
- **👑 Jordanees** - Amsterdam neighborhood charm

### 🎵 Voice Features

**Browser TTS (Available now):**
- Native browser speech synthesis
- Works on all devices
- No extra setup required

**AI Voices (Preview - Coming soon):**  
- OpenAI studio-quality voices
- ElevenLabs voice cloning
- Character-specific voices

## 🎬 Example Usage

The image below shows an example of Heino's reaction and how the components work together.

## 📚 Documentation

More information can be found on the [GitHub Pages site](https://michligtenberg2.github.io/travelbot/). There you'll find screenshots, the update log, and a FAQ.

### 📖 Project Guides

- **[WebApp Setup Guide](webapp/README.md)** - Complete installation and configuration for webapp
- **[User Manual](docs/gebruikershandleiding.md)** - Android app user guide (Dutch)
- **[Dutch Documentation](README.md)** - Dutch version of this README

## 📂 Project Structure

```
webapp/             🌐 Modern webapp with GPS & AI chat
  ├── main.js       ⚡ Core app logic & location tracking
  ├── tts.js        🎵 Text-to-speech & voice management
  ├── location.js   📍 GPS tracking & location services
  └── chat.js       💬 Interactive chat interface

backend/            🖥️ Flask API that generates responses
  ├── app.py        🐍 Main Flask server
  └── personas/     🎭 Character definitions

app/                📱 Android app written in Kotlin
  └── src/          🏗️ Android source code

docs/               📚 Documentation (GitHub Pages)
```

## 🛠️ Troubleshooting

### Common problems and solutions

#### 🌐 WebApp Issues

**GPS not working:**
- ✅ Ensure HTTPS connection (required for GPS)  
- ✅ Allow location access in your browser
- ✅ For local development: use ngrok for HTTPS

**Audio not playing:**
- ✅ Check browser audio permissions
- ✅ Test if TTS is supported: `speechSynthesis.getVoices()`
- ✅ Safari: first audio plays only after user interaction

**Chat not responding:**
- ✅ Check browser console for API errors
- ✅ Verify internet connection  
- ✅ Verify OpenAI API key is correct

#### 📱 Android App Issues

#### Backend connection problems
- **Problem**: App cannot connect to the backend
- **Solution**: 
  - Check that the backend URL is correctly set in the app settings
  - For local development: use `http://10.0.2.2:5000` (Android emulator) or your local IP address
  - For production: use the full HTTPS URL of your server

#### API key errors
- **Problem**: "API key is required" error message
- **Solution**:
  - Ensure `OPENAI_API_KEY` environment variable is set on the server

#### Location cache problems
- **Problem**: Old responses are being shown
- **Solution**:
  - Go to app settings and click "Clear Cache"
  - The app now uses Room database for improved caching
  - Cache is automatically cleaned after 24 hours

#### GPS/Location problems
- **Problem**: App doesn't get location data
- **Solution**:
  - Check that location permissions are allowed
  - Make sure GPS is enabled on your phone
  - Test the location in an area with good GPS reception

#### Backend deployment problems
- **Problem**: Backend won't start on Render/Heroku
- **Solution**:
  - Check that all dependencies are in `requirements.txt`
  - Verify OpenAI API key environment variable
  - Monitor server logs for specific error messages

## 🚀 Technical Highlights

### 🌐 WebApp Architecture

**Modern Web Technologies:**
- ✅ **PWA Ready** - Service Worker, manifest, caching
- ✅ **WebGL/Canvas** - Hardware-accelerated graphics 
- ✅ **Web APIs** - Geolocation, Speech Synthesis, Wake Lock
- ✅ **ES6+ JavaScript** - Modern async/await patterns

**Performance Features:**
- 📊 **Real-time FPS monitoring** - Smooth 60fps interactions
- 🔄 **Background sync** - Offline-capable with smart queueing  
- ⚡ **Lazy loading** - Components loaded on demand
- 🎯 **Smart caching** - API responses cached with TTL

**Mobile Optimization:**
- 📱 **Touch gestures** - Swipe, pinch, tap interactions
- 🌗 **Adaptive UI** - Dark/light mode detection
- 🔋 **Battery aware** - Reduced GPS polling on low battery
- 📶 **Network resilient** - Offline fallbacks built-in

### 🎙️ Voice System

**Multi-Provider Support:**
```javascript
// Browser TTS (Active)
const utterance = new SpeechSynthesisUtterance(text);
utterance.voice = voices.find(v => v.lang === 'nl-NL');

// AI Voices (Preview)  
const audioStream = await openai.audio.speech.create({
    model: "tts-1-hd",
    voice: "nova", // Character-specific mapping
    input: text
});
```

## 🏗️ Development Roadmap

### ✅ Completed (V2.0)
- [x] Safari/iOS GPS support
- [x] Interactive AI chat  
- [x] Background audio continuation
- [x] Multiple voice providers
- [x] Enterprise monitoring dashboard
- [x] Automated testing framework

### 🔄 In Progress  
- [ ] AI voice integration (OpenAI TTS)
- [ ] Custom voice cloning (ElevenLabs)
- [ ] Offline mode improvements
- [ ] Enhanced persona conversations

### 🗓️ Planned (V3.0)
- [ ] Multi-language support (EN, DE, FR)
- [ ] Voice command interaction
- [ ] Trip planning integration
- [ ] Social sharing features



## 📚 Documentation

More details can be found on the [GitHub Pages site](https://michligtenberg2.github.io/travelbot/). It includes screenshots, the update log and an FAQ.

## 📂 Project structure

```
backend/   Flask API generating responses
app/       Android app written in Kotlin
docs/      Documentation (GitHub Pages)
```

## 🤝 Contributing

Want to contribute to Travelbot? Check out the [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines and tips.

## 📄 License

This project is licensed under the MIT license. See the [LICENSE](LICENSE) file for details.
