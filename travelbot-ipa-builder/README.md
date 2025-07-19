# TravelBot IPA Builder

Deze builder maakt van de TravelBot webapp een native iOS-app (.ipa) die je kunt sideloaden via AltStore, zonder Apple developer account.

## ✅ Wat is ingebouwd

- **Complete webapp** met alle TravelBot functionaliteiten
- **iOS permissies** voor GPS, microfoon en spraakherkenning
- **Offline ondersteuning** met lokale assets
- **Mock GPS toggle** voor development/testing (alleen zichtbaar in debug mode)
- **Spraak fallback** als Web Speech API niet werkt

## 🚀 Snelstart

### 1. Installeer dependencies
```bash
cd travelbot-ipa-builder
npm install
```

### 2. Bouw de IPA
```bash
# Voor macOS met Xcode:
./build-ipa.sh
```

Het .ipa-bestand vind je in `travelbot-ipa-builder/build/TravelBot.ipa`

### 3. Sideload via AltStore
- Open AltServer op je computer
- Open AltStore op je iPhone/iPad
- Importeer het .ipa-bestand en installeer

## 📱 App Features

- **GPS tracking** met sarcastische routehints
- **Spraakherkenning** en spraakuitvoer
- **Offline navigatie** met Leaflet kaarten
- **Mock GPS** voor testing (debug mode)
- **Multi-language** ondersteuning
- **Nacht/dag** modus

## 🔧 Development

### Mock GPS activeren
In debug mode (localhost, file://, of ?debug=true) is er een "🧪 Mock GPS" toggle zichtbaar in de status bar.

### Webapp updates
Om de webapp bij te werken:
```bash
# Kopieer nieuwe webapp bestanden
cp -r ../webapp/* www/

# Synchroniseer met iOS
npx cap sync ios

# Bouw nieuwe IPA
./build-ipa.sh
```

## ⚠️ Valkuilen

- **Web Speech API** werkt niet altijd in iOS WebView → Fallback naar tekst
- **GPS permissies** moeten geaccepteerd worden bij eerste gebruik
- **Xcode Command Line Tools** vereist voor IPA building:
  ```bash
  xcode-select --install
  ```
- **AltStore/AltServer** moeten up-to-date zijn

## 🎯 Permissions

De app vraagt om:
- **Locatie** - "TravelBot gebruikt je locatie om sarcastische routehints te geven."
- **Microfoon** - "Voor spraakoutput of audio hints indien nodig."
- **Spraakherkenning** - "Voor gesproken output (via Web Speech of alternatief)."

## 📁 Structuur

```
travelbot-ipa-builder/
├── www/                    # Webapp bestanden
├── ios/                    # iOS project (gegenereerd)
├── build.sh                # Setup script
├── build-ipa.sh           # IPA builder
├── capacitor.config.json   # Capacitor configuratie
└── Info.plist.template    # iOS permissies template
```

## 🧪 Testing

Test altijd:
1. **GPS functionaliteit** (permissie accepteren)
2. **Offline werking** (airplane mode test)
3. **Spraak input/output** (microfoon test)
4. **Mock GPS** toggle in debug mode

## 📞 Support

Bij problemen:
1. Check Xcode Command Line Tools installatie
2. Update AltStore/AltServer naar laatste versie  
3. Test webapp eerst in browser
4. Bekijk console logs in Xcode voor debugging
