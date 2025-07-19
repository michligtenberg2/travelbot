# 🚗 TravelBot v3.0 - Gebruikershandleiding

*Uitgebreide handleiding voor de Advanced Edition met voice commands, meertalige ondersteuning en slimme route-analyse*

---

## 🎯 Quick Start

### 🚀 WebApp starten
```bash
cd webapp
python3 -m http.server 8080
# Open: https://localhost:8080
```

### 🎤 Voice Commands activeren
1. Klik op de **🎙️ microphone** knop
2. Geef toestemming voor microfoon toegang
3. Zeg een commando zoals:
   - "Waar ben ik?"
   - "What does the Belgian say?"
   - "Sag etwas zynisch"
   - "Dis quelque chose de drôle"

### 🌍 Taal wijzigen
- Gebruik de taalwisselaar in de header
- Ondersteunde talen: 🇳🇱 NL | 🇬🇧 EN | 🇩🇪 DE | 🇫🇷 FR
- Interface en persona responses worden automatisch vertaald

---

## 🗣️ Voice Commands Reference

### 🔵 Nederlandse Commands
- **"Waar ben ik?"** - Huidige locatie opvragen
- **"Zeg iets cynisch"** - Sarcastisch commentaar
- **"Wat zegt de Belg?"** - Belgische persona activeren
- **"Start navigatie"** - GPS tracking inschakelen
- **"Nachtmodus aan"** - Dark theme activeren

### 🔵 English Commands  
- **"Where am I?"** - Get current location
- **"Say something sarcastic"** - Sarcastic comment
- **"What does the Belgian say?"** - Activate Belgian persona
- **"Start navigation"** - Enable GPS tracking
- **"Night mode on"** - Activate dark theme

### 🔵 Deutsche Kommandos
- **"Wo bin ich?"** - Aktuelle Position abrufen
- **"Sag etwas Zynisches"** - Zynischer Kommentar
- **"Was sagt der Belgier?"** - Belgische Persona aktivieren
- **"Navigation starten"** - GPS-Tracking einschalten

### 🔵 Commandes Françaises
- **"Où suis-je ?"** - Obtenir la position actuelle
- **"Dis quelque chose de cynique"** - Commentaire cynique
- **"Que dit le Belge ?"** - Activer la persona belge
- **"Démarrer la navigation"** - Activer le suivi GPS

---

## 🧭 GPS & Route Analysis

### 📍 Location Tracking
- **Automatic updates** - Elke 10 seconden nieuwe positie
- **Movement detection** - Herkenning van rijden, stilstand, bochten
- **Smart geocoding** - Automatische plaatsnaam lookup via OpenStreetMap
- **Privacy-first** - Alle data blijft lokaal opgeslagen

### 🚗 Route Commentary Logic
```javascript
// Voorbeelden van route-gebaseerde responses
Linear driving (>50 km/h, rechte lijn)
→ "Wel lekker rechtdoor beuken hier..."

Sharp turns (>30° richting wijziging)  
→ "Oeh, scherpe bocht! Ben je aan het racen?"

Standstill (< 5 km/h voor >30s)
→ "Staan we in de file? Perfect tijd voor sarcasme!"

City driving (frequent stops/starts)
→ "Ah, stadsverkeer. Mijn favoriete chaos."
```

### 🎯 Movement Categories
- **🚗 Highway** - Snelle, rechte trajecten
- **🏘️ City** - Frequent stoppen en starten  
- **🌳 Rural** - Rustige landelijke routes
- **⛔ Standstill** - Stilstand of file
- **🔄 Roundabout** - Rotonde detectie

---

## 💤 Night Mode & Themes

### 🌙 Automatische activering
- **21:00 - 06:00** - Night mode automatisch actief
- **Detectie via systeemtijd** - Gebruikt lokale tijdzone
- **Aanpasbare UI** - Donkere kleuren, gereduceerde helderheid
- **Persona aanpassingen** - Rustiger, gedempte reacties

### 🎨 Theme Customization
```css
/* Night mode CSS custom properties */
--bg-primary: #1a1a1a;
--text-primary: #e0e0e0;  
--accent-color: #4a90e2;
--card-bg: #2d2d2d;
```

### 🕘 Theme Schedule
- **06:00-09:00** - Morning theme (zachte kleuren)
- **09:00-17:00** - Day theme (heldere kleuren)
- **17:00-21:00** - Evening theme (warme tinten)  
- **21:00-06:00** - Night theme (donkere UI)

---

## 📤 Quote Sharing System

### 🖼️ Generated Quote Cards
- **Canvas-based rendering** - High-quality afbeeldingen
- **Persona-specific styling** - Unieke visuele identiteit per karakter
- **Social media optimized** - Perfect formaat voor delen
- **Real-time generation** - Dynamische quote processing

### 📱 Sharing Options
```javascript
// Share API integration
await navigator.share({
  title: 'TravelBot Quote',
  text: quote.content,
  url: `${window.location.origin}/share?quote=${encodeURIComponent(quote.id)}`
});
```

### 🎭 Persona Visual Themes
- **🌊 Belg** - Blauw/grijs, regen effecten
- **🧡 Brabander** - Oranje/rood, gezellige sfeer  
- **🌆 Amsterdammer** - Modern, strak design
- **🏜️ Jordanees** - Warm, aardse tinten

---

## 🔧 Developer Tools & Debug Mode

### 🧪 Mock Location System
```javascript
// Activeer simulatie mode
TravelBot.enableMockMode({
  startLocation: { lat: 52.3676, lng: 4.9041 }, // Amsterdam
  route: 'highway', // highway | city | rural
  speed: 80 // km/h
});
```

### 📊 Performance Monitoring
- **FPS counter** - Real-time frame rate
- **Memory usage** - RAM consumption tracking
- **API response times** - Network performance
- **GPS accuracy** - Location precision metrics
- **Speech recognition stats** - Voice command success rate

### 🐛 Debug Interface
```javascript
// Debug panel shortcuts
Ctrl/Cmd + Shift + D  // Toggle debug panel
Ctrl/Cmd + Shift + L  // Show location log
Ctrl/Cmd + Shift + V  // Voice command history
Ctrl/Cmd + Shift + P  // Performance graphs
```

---

## 🔒 Privacy & Security

### 📍 Location Data
- **Lokale opslag** - GPS data blijft op device
- **Geen cloud sync** - Privacy-first approach
- **Automatische cleanup** - Oude data wordt gewist
- **User consent** - Expliciete toestemming voor locatie

### 🎤 Voice Processing  
- **Browser API only** - Geen externe voice servers
- **Real-time processing** - Geen audio opslag
- **Language detection** - Lokale taalherkenning
- **Secure context required** - HTTPS verplicht

### 💾 Data Storage
```javascript
// localStorage structure
{
  "travelbot_preferences": {
    "language": "nl",
    "selectedPersona": "belg",  
    "nightMode": "auto",
    "voiceEnabled": true
  },
  "travelbot_location_cache": [...], // Max 50 entries
  "travelbot_performance_logs": [...] // Max 100 entries
}
```

---

## 🚨 Troubleshooting

### 🎤 Voice Commands werken niet
1. **HTTPS check** - Voice API vereist secure context
2. **Microphone permissions** - Check browser instellingen
3. **Supported browser** - Chrome/Edge/Safari/Firefox  
4. **Language setting** - Command moet matchen gekozen taal

### 📍 GPS Issues op iOS Safari
1. **User gesture required** - Klik eerst op location knop
2. **Privacy settings** - Check iOS location permissions
3. **WiFi + Cellular** - Beide netwerken helpen met accuracy  
4. **Background refresh** - Sta toe voor PWA mode

### 🔊 TTS niet hoorbaar
1. **System volume** - Check device audio instellingen
2. **Browser audio policy** - Interactie vereist voor autoplay
3. **Voice selection** - Fallback naar system voices
4. **Silent mode** - Check iOS/Android silent switch

### ⚡ Performance Issues
```bash
# Performance optimization
# 1. Cache cleanup
localStorage.clear();

# 2. Service worker reset  
navigator.serviceWorker.getRegistrations()
  .then(registrations => registrations.forEach(reg => reg.unregister()));

# 3. Hard refresh
Ctrl/Cmd + Shift + R
```

---

## 🔄 Updates & Changelog

### 📅 Version History
- **v3.0.0** - Voice commands, multilingual, night mode (Current)
- **v2.5.0** - Enhanced PWA support, performance improvements  
- **v2.0.0** - WebApp edition, chat interface, personas
- **v1.5.0** - GPS tracking, Android app improvements
- **v1.0.0** - Initial Android release

### 🚀 Coming Soon (v3.1)
- **🤖 OpenAI TTS** - Studio-quality AI voices
- **🎭 Custom personas** - User-created characters
- **📊 Analytics dashboard** - Advanced monitoring  
- **🎵 Voice cloning** - Personalized character voices

---

## 📞 Support & Contact

### 🐛 Bug Reports
- **GitHub Issues** - [Create issue](https://github.com/michligtenberg2/travelbot/issues)
- **Include logs** - Debug panel → Export logs
- **Device info** - Browser, OS, GPS capabilities

### 💡 Feature Requests
- **Discussions** - [GitHub Discussions](https://github.com/michligtenberg2/travelbot/discussions)
- **Roadmap voting** - Community prioritization
- **Beta testing** - Early access program

### 🤝 Contributing
```bash
# Development setup
git clone https://github.com/michligtenberg2/travelbot.git
cd travelbot
git checkout update-v3

# Start development server
cd webapp  
python3 -m http.server 8080
```

---

*🚗 TravelBot v3.0 - AI Reisgenoot met Attitude | 2025*

## Wat doet Travelbot?
Travelbot is een locatiebewuste reisgenoot. Een oude Android-telefoon stuurt je GPS-positie naar een Flask-backend. Deze backend haalt een korte samenvatting van de omgeving op via Wikipedia en genereert met behulp van OpenAI een grappige reactie in de stijl van "Heino". De app leest dit hardop voor met Text-to-Speech.

## Hoe stel je hem in?
1. Installeer de vereiste Python-pakketten in je Codespaces of lokale omgeving:
   ```bash
   pip install -r backend/requirements.txt
   ```
2. Start de backend met:
   ```bash
   python app.py
   ```
3. Zet je OpenAI API-sleutel als omgevingsvariabele:
   ```bash
   export OPENAI_API_KEY=sk-xxx
   ```
4. Installeer de Android-app uit de map `app/` op je telefoon.
5. Zorg dat de app verbinding maakt met de backend-URL (standaard `http://10.0.2.2:5000`).

## Wat betekenen de knoppen?
- **Stel vraag aan Heino** – stuurt de ingevoerde tekst plus je locatie naar de backend en leest Heino zijn antwoord voor.
- **Speel soundboard-zin** – opent het soundboard waar je een korte geluidsclip kunt afspelen.
- **Instellingen** – opent het instellingenmenu om onder meer het commentaar-interval en de backend-URL aan te passen.

## Hoe verander je van karakter?
Ga naar **Instellingen** en kies bij *Persona* een van de beschikbare opties (Jordanees, Belg of Brabander). Travelbot gebruikt dit karakter om zijn opmerkingen te formuleren.

## Hoe los je veelvoorkomende fouten op?
- **Geen spraak** – controleer of je Android-toestel Text-to-Speech ondersteunt en of het volume aan staat.
- **Foutmelding bij OpenAI** – verifieer dat `OPENAI_API_KEY` correct staat ingesteld.
- **Locatie niet gevonden** – geef de app toestemming voor locatie­toegang via je Android-instellingen.
- **Backend niet bereikbaar** – controleer of `python app.py` draait en of de app de juiste backend-URL gebruikt.
