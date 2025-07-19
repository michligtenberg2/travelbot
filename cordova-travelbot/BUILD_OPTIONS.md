# TravelBot iOS Build zonder Mac

## Optie 1: GitHub Actions + iOS Build Service

### 1. Ionic Appflow (Gratis tier beschikbaar)
```bash
npm install -g @ionic/cli
ionic start travelbot blank --type=angular
# Upload je project naar Ionic Appflow
# Build iOS automatisch in de cloud
```

### 2. Voltbuilder.com (Betaald)
```bash
# Upload je Cordova project
# Krijg iOS .ipa terug zonder Mac
```

### 3. GitHub Actions met macOS runner
```yaml
# .github/workflows/ios-build.yml
name: Build iOS
on: [push]
jobs:
  build:
    runs-on: macos-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      - name: Install Cordova
        run: npm install -g cordova
      - name: Add iOS platform
        run: cordova platform add ios
      - name: Build iOS
        run: cordova build ios --release
      - name: Upload IPA
        uses: actions/upload-artifact@v2
        with:
          name: ios-app
          path: platforms/ios/build/device/*.ipa
```

## Optie 2: Docker met OSX-KVM (Geavanceerd)

### 3. Lokale macOS VM (Complexer)
```bash
# Installeer Docker
# Run macOS in container (OSX-KVM)
# Build iOS app in virtuele Mac
```

## Optie 3: Progressive Web App (Eenvoudigst)
```bash
# Maak een PWA die je kunt "installeren" op iOS
# Werkt bijna als native app
# Geen .ipa nodig, direct via Safari
```

## Aanbeveling: GitHub Actions
De makkelijkste gratis optie is GitHub Actions met macOS runner.
