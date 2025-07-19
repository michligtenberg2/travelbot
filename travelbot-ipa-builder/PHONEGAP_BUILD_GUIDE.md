# PhoneGap Build Instructions voor TravelBot IPA

## 🎯 Je hebt nu een `travelbot-phonegap-build.zip` klaar!

### Stap 1: PhoneGap Build Account
1. Ga naar: **https://build.phonegap.com/**
2. Maak een gratis account aan met je GitHub/Google account
3. Log in

### Stap 2: Upload Project
1. Klik op **"+ new app"**
2. Kies **"Upload a .zip file"**
3. Upload je `travelbot-phonegap-build.zip`
4. Geef het de naam: **TravelBot**

### Stap 3: iOS Certificaat (voor .ipa)
Voor een .ipa heb je een iOS ontwikkelaarsaccount nodig ($99/jaar):

**Met Apple Developer Account:**
1. Ga naar Apple Developer Portal
2. Maak een App ID aan: `nl.michligtenberg.travelbot`
3. Genereer een Development/Distribution certificaat
4. Upload certificaat naar PhoneGap Build

**Zonder Apple Developer Account (alternatief):**
- Je krijgt een unsigned .ipa die je kunt installeren via:
  - **TestFlight** (als je toegang hebt)
  - **AltStore** sideloading
  - **Xcode** (op Mac)

### Stap 4: Bouwen
1. Klik op **"Ready to build"**
2. Selecteer **iOS**
3. Klik **"Build"**
4. Wacht 5-10 minuten

### Stap 5: Download
- Download de .ipa wanneer de build klaar is
- Voor AltStore: gebruik de .ipa direct
- Voor App Store: je hebt een signed certificaat nodig

## 🚨 Troubleshooting
- **Build fails**: Check de logs in PhoneGap Build
- **Plugins missing**: Alle plugins staan in config.xml
- **GPS werkt niet**: Check iOS permissies in config.xml
- **Icons missing**: Alle iconen zijn in het ZIP bestand

## 📱 Installatie opties met .ipa:
1. **AltStore** - Gratis sideloading
2. **TestFlight** - Als je in een test groep zit
3. **Xcode** - Direct installeren op Mac
4. **Enterprise** - Als je enterprise account hebt

Probeer PhoneGap Build uit en laat me weten als je hulp nodig hebt!
