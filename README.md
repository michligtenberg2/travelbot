# 🧭 TravelBot v4.0 - Slimme AI Navigator

[![Docs](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml/badge.svg)](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Codespaces Ready](https://github.com/codespaces/badge.svg)](https://github.com/codespaces)
[![Made with Kotlin & JavaScript](https://img.shields.io/badge/Made%20with-Kotlin%20%26%20JavaScript-blue)](#)

**TravelBot v4.0** is een geavanceerde AI-reisgenoot die niet alleen sarcastische opmerkingen maakt, maar ook volledig functioneert als navigatiesysteem met real-time routing en intelligente locatiebewuste observaties.

🆕 **Nieuw: v4.0 Navigation Edition** - Volledige navigatie, slimme AI observaties, en kaart integratie!

## 📊 Development Roadmap

![TravelBot Roadmap](./docs/assets/roadmap.svg)

*[🔗 Interactieve roadmap bekijken](./docs/assets/roadmap.html)*

Lees dit document in het Engels via [README-en.md](README-en.md).

## 🚀 What's New in v4.0

### 🗺️ **Volledig Navigatiesysteem**
- ✅ **Real-time routing** - OpenRouteService API integratie
- ✅ **Turn-by-turn instructies** - Nederlandse spraakgeleiding  
- ✅ **Live kaartweergave** - Leaflet.js route visualization
- ✅ **Afstand & tijd updates** - Real-time voortgang tracking
- ✅ **Aankomst detectie** - Automatische navigatie stop

### 🤖 **Slimme AI Observaties**
- ✅ **Context-bewuste opmerkingen** - Alleen interessante locaties
- ✅ **POI detectie** - OpenStreetMap Overpass API
- ✅ **Straatnaam analyse** - Grappige/interessante namen detectie
- ✅ **File detectie** - Traffic jam observaties
- ✅ **Anti-spam filtering** - Minimale, zinvolle opmerkingen

### 🧠 **Intelligente Integratie**
- ✅ **Navigatie-bewustheid** - Geen observaties tijdens instructies
- ✅ **Locatie geschiedenis** - Context voor betere opmerkingen
- ✅ **Bewegingsanalyse** - Speed/direction voor timing
- ✅ **Multi-persona support** - Verschillende AI persoonlijkheden

### 🗺️ **Kaart & Visualisatie**
- ✅ **Interactieve kaart** - Leaflet.js implementatie
- ✅ **Route rendering** - Real-time route weergave
- ✅ **Locatie markers** - Current position tracking
- ✅ **Responsive design** - Mobile-first kaart interface

## � Project Structuur (v4.0)

```
travelbot/
├── 🌐 web-app/                 # Progressive Web App (PRIMAIR)
│   ├── index.html              # TravelBot v4.0 web applicatie
│   ├── navigation.js           # Volledig navigatiesysteem  
│   ├── smart-observations.js   # Intelligente AI observaties
│   └── ...                     # Volledige PWA implementatie
│
├── 🔄 shared/                  # Backend API (Flask)
│   ├── app.py                  # Gedeelde API voor alle platforms
│   ├── personas/               # AI persona definitjes
│   └── requirements.txt        # Python dependencies
│
├── � android-app/             # Native Android (TOEKOMST)
│   └── README.md               # Geplande Android implementatie
│
└── 📖 docs/                    # Project documentatie
    └── [Bestaande documentatie]
```

**🎯 Huidige Focus**: [Web App](web-app/) is volledig functioneel als Progressive Web App
**📱 Toekomst**: Android app wanneer user base groeit

### 🔧 **Developer Tools**
- ✅ **Location simulation** - Test mode for development
- ✅ **Performance monitoring** - FPS, memory, API metrics
- ✅ **Debug interface** - Real-time system information
- ✅ **Mock data generation** - Comprehensive testing suite

### 🌐 **Enhanced WebApp**
- ✅ **Progressive Web App** - Installable, offline-ready
- ✅ **Service Worker** - Smart caching strategies
- ✅ **Background sync** - Seamless data management

### 🎭 **AI Character Voices (Preview)**
- 🎤 **OpenAI TTS integration** - Studio-kwaliteit AI stemmen
- 🎵 **Character-specific voices** - Unieke stem per persona
- 🔊 **ElevenLabs voice cloning** - Custom character stemmen (enterprise)
- 🎯 **Smart fallback** - Browser TTS backup

### 💬 **Interactive Features**  
- 🗨️ **Real-time chat interface** - Floating chat tijdens reis
- 📍 **Location-based conversations** - Vragen over omgeving
- 📱 **Mobile-optimized** - Touch-friendly interface
- 🎨 **Responsive design** - Werkt op alle schermformaten

### 🏢 **Enterprise Edition**
- 📊 **Real-time monitoring dashboard** - Live system metrics
- ⚡ **Advanced error handling** - Smart recovery strategies
- 🧪 **Automated testing framework** - Quality assurance
- 📈 **Performance analytics** - FPS, memory, API tracking

## 📦 Installatie

### 🌐 WebApp (Aanbevolen - Nieuw!)

**Quick Start:**
```bash
cd webapp
python3 -m http.server 8080
# Open: http://localhost:8080
```

**Features:**
- ✅ Geen app store nodig
- ✅ Werkt op iPhone Safari  
- ✅ Direct GPS ondersteuning
- ✅ Installeerbaar als PWA
- ⚠️ **Let op**: HTTPS vereist voor GPS op mobiel

[→ Volledige WebApp Setup Guide](webapp/README.md)

### � Android App

1. Zorg voor **Python 3.11+** en een Android-telefoon met **Android 8+**.
2. Kloon deze repository en installeer de vereisten:

   ```bash
   git clone https://github.com/michligtenberg2/travelbot.git
   cd travelbot
   pip install flask requests
   ```

3. Zet je OpenAI API-sleutel in je omgeving:

   ```bash
   export OPENAI_API_KEY=sk-xxx
   ```

4. De backend is nu gehost op Render en bereikbaar via [https://travelbot-2k7x.onrender.com/](https://travelbot-2k7x.onrender.com/). Lokale hosting is niet meer nodig.

5. Open de map `app/` in Android Studio, bouw de app en installeer de APK op je telefoon.
6. Vul in de app het adres van je Render-backend in en je bent klaar!

## 🔧 Gebruik

### 🌐 WebApp (Nieuw!)

1. **Start lokaal** (development):
   ```bash
   cd webapp
   python3 -m http.server 8080
   ```

2. **Open je browser** naar `http://localhost:8080`

3. **Sta GPS-toegang toe** en kies je AI reisgenoot

4. **Start de reis** - TravelBot geeft automatisch commentaar elke 15 minuten

**Mobile gebruikers**: Voor HTTPS/GPS ondersteuning, gebruik een tool zoals ngrok of host op een server.

### 📱 Android App

Open de app, selecteer je persona en **Travelbot** begint automatisch met het geven van commentaar op je reis.

### 🎭 Persona's

Kies uit verschillende karakters:
- **🏛️ De Amsterdammer** - Directe, nuchtere Amsterdam-style
- **🍺 Neerslachtige Belg** - Melancholisch maar grappig  
- **🍻 Brabander** - Gezellige Brabantse humor
- **👑 Jordanees** - Amsterdamse volksbuurt charme

### 🎵 Voice Features

**Browser TTS (Beschikbaar nu):**
- Native browser spraaksynthese
- Werkt op alle apparaten
- Geen extra setup vereist

**AI Voices (Preview - Binnenkort):**  
- OpenAI studio-kwaliteit stemmen
- ElevenLabs voice cloning
- Karakter-specifieke stemmen

## 🎬 Voorbeeldgebruik

Onderstaande afbeelding toont een voorbeeld van Heino's reactie en hoe de onderdelen samenhangen.



## 📚 Documentatie

Meer uitleg vind je op de [GitHub Pages site](https://michligtenberg2.github.io/travelbot/). Daar staan screenshots, het update-log en een FAQ.

### 📖 Project Gidsen

- **[WebApp Setup Guide](webapp/README.md)** - Volledige installatie en configuratie voor webapp
- **[Gebruikershandleiding](docs/gebruikershandleiding.md)** - Android app gebruikershandleiding
- **[English Documentation](README-en.md)** - English version of this README

## 📂 Projectstructuur

```
webapp/             🌐 Modern webapp met GPS & AI chat
  ├── main.js       ⚡ Core app logic & location tracking
  ├── tts.js        🎵 Text-to-speech & voice management
  ├── location.js   📍 GPS tracking & location services
  └── chat.js       💬 Interactive chat interface

backend/            🖥️ Flask API die reacties genereert
  ├── app.py        🐍 Main Flask server
  └── personas/     🎭 Character definitions

app/                📱 Android-app geschreven in Kotlin
  └── src/          🏗️ Android source code

docs/               📚 Documentatie (GitHub Pages)
```

## 🛠️ Troubleshooting

### Veelvoorkomende problemen en oplossingen

#### 🌐 WebApp Issues

**GPS werkt niet:**
- ✅ Zorg voor HTTPS verbinding (vereist voor GPS)  
- ✅ Sta locatietoegangstoe in je browser
- ✅ Voor lokale development: gebruik ngrok voor HTTPS

**Audio speelt niet af:**
- ✅ Controleer browser audio permissions
- ✅ Test of TTS ondersteund is: `speechSynthesis.getVoices()`
- ✅ Safari: eerste audio speelt pas na user interaction

**Chat reageert niet:**
- ✅ Check browser console voor API errors
- ✅ Controleer internetverbinding  
- ✅ Verify OpenAI API key is correct

#### 📱 Android App Issues

#### Backend connectie problemen
- **Probleem**: App kan geen verbinding maken met de backend
- **Oplossing**: 
  - Controleer of de backend URL correct is ingesteld in de app instellingen
  - Voor lokale ontwikkeling: gebruik `http://10.0.2.2:5000` (Android emulator) of je lokale IP-adres
  - Voor productie: gebruik de volledige HTTPS URL van je server

#### API sleutel fouten
- **Probleem**: "API key is required" foutmelding
- **Oplossing**:
  - Zorg dat `OPENAI_API_KEY` environment variable is ingesteld op de server
  - Voor productie: stel `ADMIN_USERNAME` en `ADMIN_PASSWORD` environment variabelen in
  - Controleer dat de API sleutel geldig is en voldoende credits heeft

#### Cache problemen
- **Probleem**: Oude reacties worden getoond
- **Oplossing**:
  - Ga naar app instellingen en klik op "Cache Wissen"
  - De app gebruikt nu Room database voor verbeterde caching
  - Cache wordt automatisch na 24 uur opgeschoond

#### GPS/Locatie problemen
- **Probleem**: App krijgt geen locatie gegevens
- **Oplossing**:
  - Controleer dat locatie permissies zijn toegestaan
  - Zorg dat GPS is ingeschakeld op je telefoon
  - Test de locatie in een gebied met goede GPS ontvangst

#### Backend deployment problemen
- **Probleem**: Backend start niet op Render/Heroku
- **Oplossing**:
  - Check dat alle dependencies in `requirements.txt` staan
  - Verify OpenAI API key environment variable
  - Monitor server logs voor specifieke error messages

## 🚀 Technische Highlights

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

#### Android build problemen
- **Probleem**: App compileert niet
- **Oplossing**:
  - Controleer dat je Android SDK 34 hebt geïnstalleerd
  - Clean en rebuild het project
  - Zorg dat alle Gradle dependencies up-to-date zijn

### Debug tips
- Schakel verbose logging in voor meer gedetailleerde informatie
- Gebruik Android Studio's logcat om app logs te bekijken
- Test eerst met de lokale backend voordat je naar productie gaat
- Controleer de Swagger documentatie op `/apidocs` voor API details

### Contact
Als je een bug vindt of hulp nodig hebt, maak dan een issue aan in de GitHub repository.

## 🤝 Bijdragen

Wil je bijdragen aan Travelbot? Bekijk de [CONTRIBUTING.md](CONTRIBUTING.md) voor richtlijnen en tips.

## 📄 Licentie

Dit project valt onder de MIT-licentie. Zie het [LICENSE](LICENSE) bestand voor details.
