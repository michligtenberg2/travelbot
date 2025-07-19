Je werkt aan het project **TravelBot** — een sarcastische AI-reisgenoot die werkt als Android-app en als moderne WebApp, inclusief GPS-tracking in iOS Safari. De huidige `README.md` bevat al uitgebreide documentatie over v2.0, waaronder AI-chat, personas, browser TTS, PWA-installatie, en Enterprise features.

---

## ✍️ Doel van deze opdracht

Je taak is om een **grote update voor TravelBot (v3.0)** voor te bereiden in een aparte branch, en daarbij een **visuele roadmap te genereren** in zowel ASCII als SVG/HTML.

---

## 🔧 Stap 1 – Nieuwe Branch

Maak een nieuwe feature branch aan:
```

git checkout -b update-v3

````

---

## 🚀 Stap 2 – Nieuwe functies in TravelBot v3.0

Implementeer de volgende features:

### 🗣️ 1. Spraakcommando’s in WebApp
- Gebruik de **Web Speech API** (`SpeechRecognition`) om gebruikersvragen te herkennen.
- Voorbeeldcommando’s: “Waar ben ik?”, “Wat zegt de Belg?”, “Zeg iets cynisch.”

### 🌍 2. Meertalige ondersteuning
- Voeg taalkeuze toe (NL, EN, DE, FR) aan UI.
- Vertaal persona-reacties, labels, UI, en TTS-output.

### 🧭 3. Route-gebaseerde commentaarlogica
- Analyseer bewegingsrichting via `navigator.geolocation.watchPosition()`.
- Voeg reacties toe op lineair rijden, scherpe bochten, stilstand.

### 💤 4. Nachtmodus / Ruststand
- Detecteer tijdstip en pas visuele stijl + quotes aan.
- UI automatisch in donker thema na 21:00.

### 📤 5. Deelbare reisquotes
- Maak van bepaalde quotes een **deelbare afbeelding of URL**.
- Optie: Genereer met canvas of via een statische deelpagina (`/share?quote=...`)

---

## 🧪 Stap 3 – Techniek en UX

- Houd het project compatibel met Safari op iOS:
  - Vraag locatie via **user gesture**
  - Zorg voor HTTPS via `ngrok`, `localhost + SSL` of live server
- Fallbacks voor browsers zonder TTS of SpeechRecognition
- Voeg ook een **simulatiemodus** toe voor ontwikkelaars

---

## 🖼️ Stap 4 – Genereer een Visuele Roadmap

Laat Claude automatisch een roadmap genereren met volgende specificaties:

### 🔹 ASCII Roadmap (voor README.md of `docs/roadmap.md`)
```plaintext
+-------------------+       +------------------+       +------------------------+
|  ✅ v2.0 Completed | ----> | 🔄 v3.0 In Progress| ----> | 🧪 Testing & Feedback     |
|                   |       |                  |       |                        |
| - WebApp Edition  |       | - Multilingual UI|       | - Mobile testing (iOS) |
| - Safari GPS fix  |       | - Voice Commands |       | - Voice UX QA          |
| - Personas + TTS  |       | - Night Mode     |       | - Performance logging  |
+-------------------+       | - Route Comments  |
                            | - Shareable Quotes|
                            +--------+---------+
                                     |
                                     v
                        +-----------------------------+
                        |  🧭 v3.1 / Enterprise Preview |
                        |  - Server analytics         |
                        |  - Custom personas          |
                        |  - OpenAI Whisper backend   |
                        |  - Enhanced dashboard       |
                        +-----------------------------+
````

### 🔸 HTML / SVG / PNG variant

* Genereer een visuele versie van de roadmap in:

  * `docs/assets/roadmap.svg` (of `.html`)
  * Bonus: render automatisch als `.png` voor GitHub Pages
* Integreer in `docs/index.html` of `README.md` via `<img src="./docs/assets/roadmap.svg">`

---

## 📁 Verwachte output

* Nieuwe branch: `update-v3`
* Gewijzigde of toegevoegde bestanden:

  * `webapp/main.js`, `speech.js`, `tts.js`, `mock.js`
  * `webapp/index.html`, `style.css`
  * `docs/roadmap.md` (ASCII-versie)
  * `docs/assets/roadmap.svg` of `.png`
  * `README.md`: nieuw hoofdstuk `## What’s New in v3.0`
  * `webapp/README.md` + `docs/gebruikershandleiding.md`: nieuwe functies gedocumenteerd

---

## 📦 Bonus (optioneel)

* Voeg een CI-stap toe (`update-pages.yml`) die roadmap genereert bij nieuwe push naar `update-v3`
* Voeg togglebare debug UI toe voor ontwikkelaars (mock locatie, logs, latency)

---

Gebruik creativiteit bij het uitwerken van persona-responses en deelbare quotes — ze mogen droog, lomp of hyperlokaal zijn.

Laat de interface licht aanvoelen, maar met technische diepgang.