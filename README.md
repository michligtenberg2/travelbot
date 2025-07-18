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

4. De backend is nu gehost op Render en bereikbaar via [https://travelbot-2k7x.onrender.com/](https://travelbot-2k7x.onrender.com/). Lokale hosting is niet meer nodig.

5. Open de map `app/` in Android Studio, bouw de app en installeer de APK op je telefoon.
6. Vul in de app het adres van je Render-backend in en je bent klaar!

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

## 🛠️ Troubleshooting

### Veelvoorkomende problemen en oplossingen

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
- **Probleem**: Server start niet of crasht
- **Oplossing**:
  - Controleer alle environment variabelen zijn correct ingesteld
  - Voor Render: controleer de logs in het dashboard
  - Zorg dat alle dependencies in `requirements.txt` staan

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
