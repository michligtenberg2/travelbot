# Travelbot Gebruikershandleiding

## Wat doet Travelbot?
Travelbot is een locatiebewuste reisgenoot. Een oude Android-telefoon stuurt je GPS-positie naar een Flask-backend. Deze backend haalt een korte samenvatting van de omgeving op via Wikipedia en genereert met behulp van OpenAI een grappige reactie in de stijl van "Henk". De app leest dit hardop voor met Text-to-Speech.

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
- **Stel vraag aan Henk** – stuurt de ingevoerde tekst plus je locatie naar de backend en leest Henk zijn antwoord voor.
- **Speel soundboard-zin** – opent het soundboard waar je een korte geluidsclip kunt afspelen.
- **Instellingen** – opent het instellingenmenu om onder meer het commentaar-interval en de backend-URL aan te passen.

## Hoe verander je van karakter?
Ga naar **Instellingen** en kies bij *Persona* een van de beschikbare opties (Jordanees, Belg of Brabander). Travelbot gebruikt dit karakter om zijn opmerkingen te formuleren.

## Hoe los je veelvoorkomende fouten op?
- **Geen spraak** – controleer of je Android-toestel Text-to-Speech ondersteunt en of het volume aan staat.
- **Foutmelding bij OpenAI** – verifieer dat `OPENAI_API_KEY` correct staat ingesteld.
- **Locatie niet gevonden** – geef de app toestemming voor locatie­toegang via je Android-instellingen.
- **Backend niet bereikbaar** – controleer of `python app.py` draait en of de app de juiste backend-URL gebruikt.
