# 🚗 Travelbot

**Travelbot** is een locatiebewuste reisgenoot voor onderweg. Deze versie van de README is in het Nederlands geschreven. Wil je liever de Engelse uitleg lezen? Ga dan naar [README-en.md](README-en.md).

Deze repository bevat:
- ✅ Een Flask-backend (`app.py`) dat locatiegegevens ontvangt en een grappige opmerking genereert via OpenAI.
- ✅ Een minimale Android-app die de locatie verstuurt en het antwoord via TTS voorleest.
- ✅ Ondersteuning voor GitHub Codespaces – geen lokale installatie nodig!

## 🧠 Wat doet het?

1. De Android-app stuurt GPS-coördinaten naar de endpoint `/comment`.
2. De backend gebruikt Wikipedia en GPT om een karakteristieke Nederlandse reactie te maken.
3. De app leest deze reactie hardop voor met Text-to-Speech.

## 🚀 Aan de slag in Codespaces

1. Klik op **"Use this template"** of open deze repo in GitHub.
2. Kies **"Code > Codespaces > Create new codespace"**.
3. Wacht tot de omgeving is opgebouwd (~1 min).
4. Start de backend met:

```bash
python app.py
```

Je backend is vervolgens bereikbaar op `http://localhost:5000` (via port forwarding).

## 🔑 API-sleutel instellen

Zet je API-sleutel in `.bashrc` of in de terminal:

```bash
export OPENAI_API_KEY=sk-xxx
```

Of voeg deze toe via Codespaces secrets.

## 📱 Android

Installeer de app uit de map `/app/` op je telefoon. De app roept de backend aan en laat Henk vervolgens zijn opmerkingen uitspreken.
