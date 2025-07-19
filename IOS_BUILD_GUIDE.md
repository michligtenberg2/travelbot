# 📱 TravelBot iOS Build Opties (Zonder Mac)

## 🎯 **Optie 1: GitHub Actions (GRATIS - Aanbevolen)**

### Setup:
1. **Push je code naar GitHub**
2. **GitHub Actions** bouwt automatisch iOS app op macOS runner
3. **Download .ipa** van GitHub Artifacts

### Activeren:
```bash
# Code is al klaar - push naar GitHub:
git add .
git commit -m "Add iOS build workflow"
git push origin main
```

**Voordelen:** ✅ Gratis, ✅ Automatisch, ✅ Native .ipa

---

## 🎯 **Optie 2: PWA Installeren (Direct bruikbaar)**

### Direct installeren als "app":
1. **Open** `https://jouw-domain.com/webapp/` in Safari
2. **Deel knop** → "Voeg toe aan beginscherm"
3. **Klaar!** App werkt bijna als native iOS app

### Voordelen:
- ✅ **Direct werkend** - geen build proces
- ✅ **GPS werkt** via Safari
- ✅ **Offline** functionaliteit
- ✅ **Spraak** via Web API
- ✅ **Home screen** icon

### Deploy naar Vercel/Netlify:
```bash
# Vercel (gratis):
npm install -g vercel
cd webapp
vercel --prod

# Of Netlify:
# Drag & drop webapp/ folder naar netlify.com
```

---

## 🎯 **Optie 3: Cordova + Online Build Service**

### Ionic Appflow (Gratis tier):
```bash
npm install -g @ionic/cli
ionic start travelbot blank --capacitor
# Upload naar Appflow → iOS build in cloud
```

### Voltbuilder.com (€10/maand):
```bash
# Upload cordova-travelbot/ → krijg .ipa terug
```

---

## 🥇 **Aanbeveling:**

### **Voor direct gebruik:** PWA (Optie 2)
- Werkt meteen, geen wachttijd
- Alle features beschikbaar
- Via Safari installeerbaar

### **Voor echte .ipa:** GitHub Actions (Optie 1)  
- Gratis
- Automatisch
- Native iOS app

## 🚀 **Volgende Stappen:**

**Kies Optie 2 (PWA):**
1. Deploy webapp naar Vercel/Netlify
2. Open URL in iPhone Safari
3. "Voeg toe aan beginscherm"
4. Klaar! 

**Of Kies Optie 1 (GitHub Actions):**
1. Push code naar GitHub
2. Wacht 10-15 min voor build
3. Download .ipa van Actions tab
4. Installeer via AltStore
