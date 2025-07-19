# 🧭 TravelBot v4.0 - Progressive Web App

[![Docs](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml/badge.svg)](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Codespaces Ready](https://github.com/codespaces/badge.svg)](https://github.com/codespaces)
[![Made with JavaScript & Flask](https://img.shields.io/badge/Made%20with-JavaScript%20%26%20Flask-blue)](#)

**TravelBot v4.0** is een geavanceerde AI-navigator die niet alleen sarcastische opmerkingen maakt, maar ook volledig functioneert als navigatiesysteem met real-time routing en intelligente locatiebewuste observaties.

🆕 **Nieuw: v4.0 Navigation Edition** - Volledig navigatiesysteem, slimme AI observaties, en kaart integratie!

Lees dit document in het Engels via [README-en.md](README-en.md).

## 🚀 TravelBot v4.0 Features

### 🧭 **Volledig Navigatiesysteem**
- ✅ **Real-time routing** - OpenRouteService API integratie
- ✅ **Turn-by-turn instructies** - Nederlandse spraakgeleiding  
- ✅ **Interactive maps** - Leaflet.js route visualization
- ✅ **Afstand & tijd updates** - Real-time voortgang tracking
- ✅ **Aankomst detectie** - Automatische navigatie stop

### 🤖 **Slimme AI Observaties**
- ✅ **Context-bewuste opmerkingen** - Alleen interessante locaties
- ✅ **POI detectie** - OpenStreetMap Overpass API
- ✅ **Straatnaam analyse** - Grappige/interessante namen detectie
- ✅ **File detectie** - Traffic jam observaties
- ✅ **Anti-spam filtering** - Minimale, zinvolle opmerkingen

### 🌐 **Progressive Web App**
- ✅ **Safari-compatible** - Werkt perfect op iOS/iPhone
- ✅ **Real-time GPS tracking** - Geen app installatie nodig
- ✅ **Interactive AI chat** - Chat direct met je AI reisgenoot  
- ✅ **Multiple personas** - Amsterdammer, Belg, Brabander, Jordanees
- ✅ **Text-to-Speech** - Gesproken commentaren in browser
- ✅ **Installeerbaar** - Add to Home Screen functionaliteit

### 🗺️ **Kaart & Visualisatie**
- ✅ **Interactieve kaart** - Leaflet.js implementatie
- ✅ **Route rendering** - Real-time route weergave
- ✅ **Locatie markers** - Current position tracking
- ✅ **Mobile-optimized** - Touch-friendly interface

## 📦 Installatie & Gebruik

### 🌐 **Progressive Web App (Aanbevolen)**

**Direct gebruiken:**
```bash
# Lokaal draaien
cd webapp/
python3 -m http.server 8000

# Open in browser
http://localhost:8000
```

**Of installeren als app:**
1. 📱 Open TravelBot in Chrome/Safari
2. 📲 "Add to Home Screen" of "Install App"
3. 🎯 Gebruik als native app!
# Open: http://localhost:8080
```

**Features:**
- ✅ Geen app store nodig
- ✅ Werkt op iPhone Safari  
- ✅ Direct GPS ondersteuning
- ✅ Installeerbaar als PWA
## 🚀 Installatie & Setup

### 🌐 Progressive Web App v4.0

1. **Clone de repository:**
   ```bash
   git clone https://github.com/michligtenberg2/travelbot.git
   cd travelbot
   ```

2. **Start de backend (optioneel voor lokale ontwikkeling):**
   ```bash
   cd backend
   pip install flask requests
   export OPENAI_API_KEY=sk-xxx
   python app.py
   ```

3. **Open de webapp:**
   - **Production**: [https://travelbot-2k7x.onrender.com/](https://travelbot-2k7x.onrender.com/)
   - **Local development**: `http://localhost:5000`

4. **Installeer als PWA**: 
   - Klik op "Toevoegen aan startscherm" (mobiel)
   - Of "App installeren" (desktop) voor volledige app-ervaring

### 🗝️ API Setup
- Zet je OpenAI API-sleutel in je omgeving voor AI persona's
- Gebruik de gehoste backend op Render voor gemak
- ⚠️ **Let op**: HTTPS vereist voor GPS op mobiel

[→ Volledige WebApp Setup Guide](webapp/README.md)

## 🔧 Gebruik

### 🌐 TravelBot v4.0 Web App

1. **Open de webapp:**
   - **Production**: [https://travelbot-2k7x.onrender.com/](https://travelbot-2k7x.onrender.com/)
   - **Local**: `http://localhost:8080` (na `python3 -m http.server 8080` in webapp/)

2. **Sta GPS-toegang toe** en kies je AI reisgenoot

3. **Nieuwe v4.0 functies:**
   - 🗺️ **Navigatie systeem** - Routeplanning met turn-by-turn instructies
   - 🧠 **Slimme observaties** - Contextbewuste POI detectie
   - 📍 **Interactieve kaarten** - Leaflet.js integratie
   - 🔄 **Real-time tracking** - Live positie-updates

4. **Start de reis** - TravelBot geeft automatisch commentaar + navigatie

**Mobile gebruikers**: Voor HTTPS/GPS ondersteuning wordt de Render-hosting aanbevolen.

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

- **[WebApp v4.0 Guide](webapp/README.md)** - Complete Progressive Web App documentatie
- **[Navigatie Systeem](docs/navigation.md)** - v4.0 navigatie functies uitleg
- **[English Documentation](README-en.md)** - English version of this README

## 📂 Projectstructuur

## 📂 Project Structuur

```
webapp/             🌐 Progressive Web App v4.0
  ├── main.js       ⚡ Core app logic & navigation system
  ├── navigation.js 🧭 Route planning & turn-by-turn 
  ├── smart-observations.js 🧠 Context-aware POI detection
  ├── tts.js        🎵 Text-to-speech & voice management
  ├── location.js   📍 GPS tracking & location services
  ├── chat.js       💬 Interactive chat interface
  ├── index.html    📄 PWA interface with Leaflet maps
  ├── style.css     🎨 Responsive design & navigation UI
  └── manifest.json 📱 PWA configuration

backend/            🖥️ Flask API server (shared)
  ├── app.py        🐍 Main Flask server
  └── personas/     🎭 Character definitions

docs/               📚 Documentatie (GitHub Pages)
```

## 🛠️ Troubleshooting

### Veelvoorkomende problemen en oplossingen

#### 🌐 Progressive Web App Issues

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

**Navigatie werkt niet (v4.0):**
- ✅ Controleer OpenRouteService API toegang
- ✅ Verifieer GPS-precisie voor routeberekening
- ✅ Test internetverbinding voor kaartdata

#### Backend connectie problemen
- **Probleem**: App kan geen verbinding maken met de backend
- **Oplossing**: 
  - Gebruik production URL: `https://travelbot-2k7x.onrender.com/`
  - Voor lokale ontwikkeling: `http://localhost:5000`
  - Controleer CORS instellingen

#### API sleutel fouten
- **Probleem**: "API key is required" foutmelding
- **Oplossing**:
  - Zorg dat `OPENAI_API_KEY` environment variable is ingesteld op de server
  - Voor productie: stel `ADMIN_USERNAME` en `ADMIN_PASSWORD` environment variabelen in
  - Controleer dat de API sleutel geldig is en voldoende credits heeft

#### Cache problemen
- **Probleem**: Oude reacties of kaartdata worden getoond
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
- [ ] Multi-language support
- [ ] Trip planning integration
- [ ] Social sharing features
- [ ] Offline map caching

### Debug tips
- Schakel verbose logging in voor meer gedetailleerde informatie
- Gebruik browser developer tools voor debugging
- Test GPS functionality met HTTPS verbinding
- Controleer de API documentatie op `/apidocs` voor backend details

### Contact
Als je een bug vindt of hulp nodig hebt, maak dan een issue aan in de GitHub repository.

## 🤝 Bijdragen

Wil je bijdragen aan Travelbot? Bekijk de [CONTRIBUTING.md](CONTRIBUTING.md) voor richtlijnen en tips.

## 📄 Licentie

Dit project valt onder de MIT-licentie. Zie het [LICENSE](LICENSE) bestand voor details.
