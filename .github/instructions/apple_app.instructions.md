Natuurlijk! Hieronder vind je de volledige Claude-prompt in de vorm van een `.md`-bestand (Markdown), **inline**, zodat je hem direct kunt gebruiken in je repo, in een issue of als los promptbestand voor Claude.

---

```markdown
# 📦 Claude Prompt: Maak een `.ipa`-builder voor TravelBot (AltStore-compatible)

## 🔧 Context

We hebben een werkende webversie van **TravelBot v4** met de volgende eigenschappen:

- GPS-tracking via `navigator.geolocation`
- Realtime routebeschrijvingen en instructies ("Over 500 meter afslag N257")
- Audio-uitvoer via Web Speech API of lokale geluidsbestanden
- Gebouwd als webapp in HTML/CSS/JS (eventueel met framework zoals Vue, Svelte of Preact)
- Draait perfect in browser, ook op iOS Safari (met de juiste user gesture + HTTPS)

---

## 🎯 Doel van deze opdracht

Maak een **volledige `.ipa`-builder pipeline** zodat ik deze webapp kan packagen als een native iOS-app die:

- **Offline kan draaien**
- **GPS en audio werkt** binnen een sandboxed WebView
- **Sideloadbaar is via AltStore** zonder Apple developer account
- De juiste iOS-permissies aanvraagt

De output moet een `.ipa` bestand zijn dat ik kan **uploaden via AltStore** naar mijn iPhone of iPad, zonder Xcode of App Store-distributie.

---

## ✅ Specificaties

### 📁 1. Structuur van de `.ipa`-builder

Je maakt een projectmap met de volgende structuur:

```

/travelbot-ipa-builder/
├── www/                  # output van de webapp (build/ of dist/)
├── ios/                  # Xcode of Capacitor project met WKWebView wrapper
├── build.sh              # shell script dat de IPA bouwt (Xcode/Capacitor CLI)
├── README.md             # uitleg hoe te gebruiken + AltStore stappen
└── assets/ (optioneel)   # launch screen, app-icon, etc.

````

### 🧱 2. Gebruik één van deze methodes voor bundling

Kies de stabielste route:

#### Optie A: Capacitor.js

- Wrap de webapp in een Capacitor container
- Stel in `capacitor.config.json` de app-ID, naam, etc.
- Maak automatisch een iOS-platform aan met:
  ```bash
  npx cap add ios
````

* Stel WebView instellingen in voor maximale compatibiliteit:

  * `allowNavigation`
  * `backgroundColor`
  * Offline assets support

#### Optie B: Swift/Xcode + WKWebView wrapper

* Maak een minimalistische SwiftUI of UIKit project
* Voeg een `WKWebView` toe die `index.html` laadt vanaf `Bundle.main`
* Voeg alle assets toe in `Copy Bundle Resources`
* Stel `info.plist` permissies correct in

### 🔐 3. Vereiste permissies

In de gegenereerde `.ipa`, zorg dat dit in `Info.plist` staat:

```xml
<key>NSLocationWhenInUseUsageDescription</key>
<string>TravelBot gebruikt je locatie om sarcastische routehints te geven.</string>
<key>NSMicrophoneUsageDescription</key>
<string>Voor spraakoutput of audio hints indien nodig.</string>
<key>NSSpeechRecognitionUsageDescription</key>
<string>Voor gesproken output (via Web Speech of alternatief).</string>
```

### 🗣️ 4. Spraak & GPS werken in WebView?

* Bevestig dat `navigator.geolocation` werkt binnen WebView containers
* Zorg dat `SpeechSynthesis` (Web Speech API) beschikbaar is, of gebruik audio fallback
* Als Web Speech niet werkt, geef instructie hoe lokale `.mp3` instructies in te laden

---

## 🧪 Testscenario’s

* Werkt de app volledig offline?
* GPS werkt op iPhone via AltStore-sideload?
* Audiocommando’s worden uitgesproken?
* Geen crashes bij toegang tot locatie/microfoon?

---

## 📥 Verwachte output

1. Een werkend `.ipa` bestand dat:

   * Geen developer account vereist
   * Werkt via AltStore + AltServer
   * TravelBot bevat in native wrapper
2. Een `build.sh` dat ik kan uitvoeren om nieuwe versies te bouwen
3. Een duidelijke `README.md` die uitlegt:

   * Hoe ik `www/` vervang met nieuwe webapp
   * Hoe ik via Terminal een `.ipa` maak
   * Hoe ik deze via AltStore op mijn toestel krijg
   * Wat de valkuilen zijn (bijv. permissions, sandboxing)

---

## 🧠 Bonus (optioneel)

* Voeg een toggle toe voor "mock GPS" zodat ik de app kan testen zonder echt te bewegen
* Offline-kaarten als tiles of vector-bestand
* Logview voor AI-reacties onderweg

---

Kan je dit hele IPA-builder systeem opzetten voor me? Graag met buildscript, permissies en fallback voor spraak als Web Speech niet werkt op iOS.