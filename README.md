# 🚗 Travelbot

[![Docs](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml/badge.svg)](https://github.com/michligtenberg2/travelbot/actions/workflows/update-pages.yml)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Codespaces Ready](https://github.com/codespaces/badge.svg)](https://github.com/codespaces)
[![Made with Kotlin & Flask](https://img.shields.io/badge/Made%20with-Kotlin%20%26%20Flask-blue)](#)

**Travelbot** is een AI-reisgenoot die iedere 15 minuten een grappige opmerking maakt over je huidige locatie. De app draait op een Android-telefoon en gebruikt een kleine Flask-backend om via OpenAI teksten op te halen.

Lees dit document in het Engels via [README-en.md](README-en.md).

## 📦 Installatie

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

4. Start de backend:

   ```bash
   python backend/app.py
   ```

5. Open de map `app/` in Android Studio, bouw de app en installeer de APK op je telefoon.
6. Vul in de app het adres van je backend in en je bent klaar!

## 🎬 Voorbeeldgebruik

Onderstaande afbeelding toont een voorbeeld van Heino's reactie en hoe de onderdelen samenhangen.



## 📚 Documentatie

Meer uitleg vind je op de [GitHub Pages site](https://michligtenberg2.github.io/travelbot/). Daar staan screenshots, het update-log en een FAQ.

## 📂 Projectstructuur

```
backend/   Flask API die reacties genereert
app/       Android-app geschreven in Kotlin
docs/      Documentatie (GitHub Pages)
```

## 🤝 Bijdragen

Wil je bijdragen aan Travelbot? Bekijk de [CONTRIBUTING.md](CONTRIBUTING.md) voor richtlijnen en tips.

## 📄 Licentie

Dit project valt onder de MIT-licentie. Zie het [LICENSE](LICENSE) bestand voor details.
