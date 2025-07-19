# 🌐 TravelBot PWA Deployment Instructies

## ✅ PWA Features:
- 📍 **GPS tracking** werkt volledig  
- 🎤 **Spraakherkenning** via Web Speech API
- 🗺️ **Offline kaarten** met lokale assets
- 📱 **App-like ervaring** wanneer geïnstalleerd  
- 🌙 **Dark/Light mode** ondersteuning

## 📤 Deployment Opties:

### Optie 1: Vercel (Aanbevolen)
1. **Ga naar:** [vercel.com](https://vercel.com)
2. **Sign up/Login** met GitHub account
3. **New Project** → Import van GitHub: `michligtenberg2/travelbot`
4. **Root Directory:** `webapp/`
5. **Deploy!**

### Optie 2: Netlify  
1. **Ga naar:** [netlify.com](https://netlify.com)
2. **Drag & drop** de `webapp/` folder
3. **Auto-deploy** klaar!

### Optie 3: Upload naar jouw domein (michligtenberg.nl)
```bash
# Upload alle bestanden uit webapp/ naar:
# michligtenberg.nl/travelbot/
scp -r webapp/* user@server:/var/www/michligtenberg.nl/travelbot/
```

### Via FTP/cPanel:
```bash
# Upload alle bestanden uit webapp/ naar:
# michligtenberg.nl/travelbot/
```

### Dan is je # PWA Deploy Instructies

## Voor michligtenberg.nl

Upload alle bestanden uit `pwa-deploy/` naar:
`https://michligtenberg.nl/travelbot/`

## Test URL:
https://michligtenberg.nl/travelbot/

## Installatie op iPhone:
1. Open https://michligtenberg.nl/travelbot/ in Safari
2. Deel knop → "Voeg toe aan beginscherm"
3. App is geïnstalleerd!

## Features die werken:
✅ GPS tracking
✅ Offline functionaliteit  
✅ Spraakherkenning
✅ Push notifications
✅ Home screen icon
✅ Volledig scherm (geen browser UI)

## Upload via FTP/cPanel:
1. Zip de `pwa-deploy/` folder
2. Upload naar michligtenberg.nl
3. Unzip in `/public_html/travelbot/`
4. Klaar!
`https://michligtenberg.nl/travelbot/`

---

## 📱 Installatie op iPhone:

1. **Open** de URL in Safari
2. **Deel knop** (□↑) → "Voeg toe aan beginscherm"
3. **App werkt** als native iOS app!

---

## ✅ Features die werken:
- 🧭 GPS tracking
- 🎤 Spraakherkenning  
- 🔊 Text-to-speech
- 📱 Offline functionaliteit
- 🌙 Night mode
- 🧪 Mock GPS (debug mode)
