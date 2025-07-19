# 🚀 Upload Instructies voor michligtenberg.nl

## 📁 Wat uploaden:

### 1. PWA (Directe installatie):
```
📂 Upload naar: /public_html/travelbot/
📋 Bestanden: Alle bestanden uit pwa-deploy/
🌐 URL: https://michligtenberg.nl/travelbot/
📱 Installatie: Safari → Delen → "Voeg toe aan beginscherm"
```

### 2. AltStore Source:
```
📂 Upload naar: /public_html/appstore/
📋 Bestanden: Alle bestanden uit altstore-source/
🌐 URL: https://michligtenberg.nl/appstore/
📱 Installatie: AltStore → Voeg source toe
```

### 3. IPA Bestand (wanneer klaar):
```
📂 Upload naar: /public_html/appstore/ipa/
📋 Bestand: TravelBot-4.0.0.ipa (van GitHub Actions build)
🔗 Link: https://michligtenberg.nl/appstore/ipa/TravelBot-4.0.0.ipa
```

## 📋 Checklist:

### PWA Setup:
- [ ] Upload `pwa-deploy/` naar `/travelbot/`
- [ ] Test https://michligtenberg.nl/travelbot/
- [ ] Test installatie via Safari op iPhone

### AltStore Setup:
- [ ] Upload `altstore-source/` naar `/appstore/`  
- [ ] Test https://michligtenberg.nl/appstore/
- [ ] Test AltStore source URL: `altstore://source?url=https://michligtenberg.nl/appstore/apps.json`

### GitHub Actions (voor .ipa):
- [ ] Push code naar GitHub
- [ ] Wacht op build in Actions tab
- [ ] Download .ipa van Artifacts
- [ ] Upload .ipa naar `/appstore/ipa/`

## 🎯 Resultaat:

**Optie 1: PWA (Direct werkend)**
- ✅ https://michligtenberg.nl/travelbot/
- ✅ Installeerbaar via Safari
- ✅ Alle features werken

**Optie 2: AltStore (.ipa)**  
- ✅ https://michligtenberg.nl/appstore/
- ✅ Native iOS app
- ✅ Via sideloading

## 🛠️ FTP Upload Commando's:

```bash
# Via rsync (als SSH beschikbaar):
rsync -avz pwa-deploy/ user@michligtenberg.nl:/public_html/travelbot/
rsync -avz altstore-source/ user@michligtenberg.nl:/public_html/appstore/

# Via FTP client of cPanel File Manager
# Upload pwa-deploy/* naar /travelbot/  
# Upload altstore-source/* naar /appstore/
```

## ✅ Test URLs:

- **PWA**: https://michligtenberg.nl/travelbot/
- **AltStore**: https://michligtenberg.nl/appstore/
- **Apps JSON**: https://michligtenberg.nl/appstore/apps.json

Beide opties zijn nu klaar voor deployment! 🎉
