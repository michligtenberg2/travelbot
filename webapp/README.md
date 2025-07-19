# 🚗 TravelBot WebApp

Een Safari-compatibele GPS webapp versie van TravelBot die werkt op iOS en desktop browsers.

## ✨ Features

- **📍 Live GPS Tracking**: Werkt op Safari met `navigator.geolocation`
- **🤖 AI Reacties**: Communiceert met Flask backend voor OpenAI reacties
- **🗣️ Text-to-Speech**: Web Speech API voor gesproken reacties
- **💾 Offline Support**: PWA met service worker en caching
- **🎭 Persona's**: Keuze uit Heino (Jordanees), Belg, of Sergio Herman
- **🎮 Simulatie Modus**: Mock GPS voor ontwikkeling/demo
- **📱 Mobile-First**: Geoptimaliseerd voor telefoon gebruik in auto

## 🛠️ Safari/iOS Vereisten

### HTTPS Vereist
GPS werkt alleen op HTTPS (behalve localhost). Voor ontwikkeling:

```bash
# Optie 1: mkcert voor lokale SSL
brew install mkcert
mkcert -install
mkcert localhost 127.0.0.1
# Start met HTTPS server

# Optie 2: ngrok tunnel
npm install -g ngrok
ngrok http 8080
# Gebruik https://xxx.ngrok.io URL

# Optie 3: Deploy naar HTTPS hosting
# Vercel, Netlify, GitHub Pages, etc.
```

### User Gesture Vereist
Safari vereist user interaction voor GPS en TTS:
- GPS activeert alleen na klik op "Start Reis" knop
- TTS werkt alleen na eerste user interaction

## 🚀 Installatie & Gebruik

### Lokaal draaien

```bash
# Ga naar webapp directory
cd webapp

# Start een simpele HTTP server
python -m http.server 8080
# Of met Node.js
npx serve -s . -p 8080

# Open in browser
# Voor HTTP: http://localhost:8080 (GPS werkt niet)
# Voor HTTPS: https://localhost:8080 (met mkcert setup)
```

### PWA Installatie
1. Open de webapp in Safari op iOS
2. Tap de "Share" knop
3. Scroll en tap "Add to Home Screen"
4. De app wordt geïnstalleerd als standalone app

## ⚙️ Configuratie

### Backend URL
Standaard verbindt de app met: `https://travelbot-2k7x.onrender.com`

Wijzig in instellingen voor:
- Lokale ontwikkeling: `http://localhost:5000` (alleen HTTP)
- Custom backend: `https://jouw-backend.com`

### Persona's
- **Jordanees (Heino)**: Amsterdamse humor, droog en sarcastisch
- **Neerslachtige Belg**: Melancholisch, gebruikt "Alleeh" en "C'est bon"
- **Sergio Herman**: Perfectionist chef, "T moet tip top in orde zijn"

## 🧪 Simulatie Modus

Voor ontwikkeling/demo zonder echte GPS:

1. Ga naar Instellingen
2. Schakel "Simulatie Modus" in
3. Start reis - gebruikt voorgedefinieerde route door NL/BE
4. Toont realistische GPS coordinaten van bekende locaties

### Mock Route
De simulatie gebruikt een route langs:
- Amsterdam (Centrum, Jordaan, Anne Frank Huis)
- Den Haag, Rotterdam, Den Bosch
- Eindhoven, Tilburg
- Antwerpen, Brussel, Gent
- Terug naar Nederland

## 📱 Safari Specificaties

### Geolocation
```javascript
// Vereist user gesture
startButton.addEventListener('click', async () => {
    const position = await navigator.geolocation.getCurrentPosition(
        success, error,
        { 
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 60000 
        }
    );
});
```

### Web Speech API
```javascript
// TTS initialisatie na user interaction
const utterance = new SpeechSynthesisUtterance(text);
utterance.voice = dutchVoice; // Bij voorkeur Nederlandse stem
utterance.rate = 1.0;
speechSynthesis.speak(utterance);
```

### Service Worker
```javascript
// PWA registratie
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceWorker.js');
}
```

## 🔧 Ontwikkeling

### Bestand Structuur
```
webapp/
├── index.html              # Hoofd HTML bestand
├── style.css              # Mobile-first CSS
├── main.js                # App logica & UI
├── travelbot_engine.js    # Backend API communicatie
├── location.js            # GPS & locatie handling
├── tts.js                 # Text-to-Speech manager
├── mock.js                # Simulatie GPS data
├── manifest.json          # PWA manifest
└── serviceWorker.js       # Offline & caching
```

### API Communicatie
```javascript
// Backend aanroep
const response = await fetch('/comment', {
    method: 'POST',
    headers: { 
        'Content-Type': 'application/json',
        'X-API-KEY': 'webapp-client-key'
    },
    body: JSON.stringify({
        lat: position.coords.latitude,
        lon: position.coords.longitude,
        style: 'Jordanees'
    })
});
```

### Caching Strategie
- **Static assets**: Cache first
- **API calls**: Network first, fallback to cache
- **Offline responses**: Fallback reacties per persona

## 🐛 Troubleshooting

### GPS werkt niet
- ✅ Controleer HTTPS verbinding
- ✅ Geef locatie permissie in browser
- ✅ Test buiten voor beter GPS signaal
- ✅ Gebruik simulatie modus als fallback

### Geen spraak
- ✅ Controleer volume op apparaat
- ✅ Test met andere tekst in browser console
- ✅ Safari TTS werkt alleen na user interaction
- ✅ Nederlandse stem mogelijk niet beschikbaar

### Backend verbinding
- ✅ Controleer backend URL in instellingen
- ✅ Test backend bereikbaarheid in browser
- ✅ Controleer CORS headers op backend
- ✅ Gebruik fallback offline responses

### PWA installatie
- ✅ Alleen beschikbaar op HTTPS
- ✅ Manifest.json moet bereikbaar zijn
- ✅ Service worker moet registreren
- ✅ Icons moeten laden

## 🔮 Toekomstige Features

- 🗺️ Interactieve kaart (Leaflet/OpenLayers)
- 🎯 Custom waypoints en routes
- 📊 Reis statistieken
- 🔔 Push notifications
- 🎵 Audio effecten & soundboard
- 🌐 Meertalige ondersteuning
- 🚗 OBD-II integratie
- 📸 Foto's bij locaties

## 📄 Licentie

MIT - Zie LICENSE bestand voor details.

## 🤝 Bijdragen

Pull requests welkom! Zie CONTRIBUTING.md voor richtlijnen.

---

**Veel plezier met TravelBot! 🚗💨**
