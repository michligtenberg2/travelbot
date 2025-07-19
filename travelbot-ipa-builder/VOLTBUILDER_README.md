# TravelBot iOS Build

## Voltbuilder Instructions

1. Ga naar: https://voltbuilder.com
2. Registreer voor gratis account (5 builds per maand gratis)
3. Upload het `travelbot-ios-build.zip` bestand
4. Kies "iOS" platform
5. Klik "Build"
6. Download de .ipa na 5-10 minuten

## Alternatieve Build Services

### 1. Ionic Appflow
- https://ionic.io/appflow
- Gratis tier beschikbaar
- Upload via Git repository

### 2. PhoneGap Build (Deprecated maar nog werkend)
- https://build.phonegap.com
- Upload ZIP bestand
- Download IPA

## Manual Build op macOS
Als je toegang hebt tot een macOS systeem:
```bash
npm install
npx cap sync ios
npx cap open ios
# Build via Xcode
```

## Bestanden in ZIP
- config.xml - Cordova configuratie
- www/ - Webapp bestanden
- assets/ - App iconen

## Test de App
1. Install via AltStore of TestFlight
2. Controleer GPS permissies
3. Test spraakoutput
4. Controleer offline functionaliteit
