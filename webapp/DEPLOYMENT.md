# 🚀 TravelBot WebApp Deployment Guide

Deployment instructies voor verschillende platforms. GPS vereist HTTPS!

## 🌐 GitHub Pages (Gratis)

### Stap 1: Repository Setup
```bash
# Zorg dat webapp/ op main branch staat
git checkout main
git merge travelbot-webapp
git push origin main
```

### Stap 2: GitHub Pages Activeren
1. Ga naar repository Settings
2. Scroll naar "Pages" sectie
3. Source: "Deploy from a branch"
4. Branch: `main` 
5. Folder: `/ (root)` of `/webapp` als je subfolder wilt
6. Save

### Stap 3: Custom Domain (Optioneel)
```bash
# Voeg CNAME bestand toe
echo "travelbot.jouw-domein.com" > webapp/CNAME
```

**URL**: `https://username.github.io/travelbot/webapp/`
**GPS**: ✅ Werkt (HTTPS)
**Kosten**: Gratis

---

## ⚡ Vercel (Aanbevolen)

### Stap 1: Vercel CLI
```bash
npm i -g vercel
cd webapp
vercel
```

### Stap 2: Configuratie
```json
// vercel.json
{
  "builds": [
    {
      "src": "**/*",
      "use": "@vercel/static"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "/$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Access-Control-Allow-Origin",
          "value": "*"
        }
      ]
    }
  ]
}
```

### Stap 3: Deploy
```bash
vercel --prod
```

**URL**: `https://travelbot-xxx.vercel.app`
**GPS**: ✅ Werkt (HTTPS)
**Kosten**: Gratis tier beschikbaar

---

## 🟢 Netlify

### Stap 1: Drag & Drop
1. Ga naar https://netlify.com
2. Sleep `webapp/` folder naar deploy area
3. Site wordt automatisch gedeployed

### Stap 2: Custom Domain
```bash
# _redirects bestand voor SPA routing
echo "/* /index.html 200" > webapp/_redirects
```

### Stap 3: Headers voor CORS
```toml
# netlify.toml
[[headers]]
  for = "/*"
  [headers.values]
    Access-Control-Allow-Origin = "*"
    Access-Control-Allow-Methods = "GET, POST, OPTIONS"
    Access-Control-Allow-Headers = "Content-Type, X-API-KEY"
```

**URL**: `https://random-name-12345.netlify.app`
**GPS**: ✅ Werkt (HTTPS)
**Kosten**: Gratis tier beschikbaar

---

## 🔥 Firebase Hosting

### Stap 1: Firebase CLI
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
```

### Stap 2: Configuratie
```json
// firebase.json
{
  "hosting": {
    "public": "webapp",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "*"
          }
        ]
      }
    ]
  }
}
```

### Stap 3: Deploy
```bash
firebase deploy
```

**URL**: `https://project-id.web.app`
**GPS**: ✅ Werkt (HTTPS)
**Kosten**: Gratis tier beschikbaar

---

## 🌊 Surge.sh (Simpel)

### Stap 1: Installatie
```bash
npm install -g surge
cd webapp
surge
```

### Stap 2: Custom Domain
```bash
surge --domain travelbot-demo.surge.sh
```

**URL**: `https://travelbot-demo.surge.sh`
**GPS**: ✅ Werkt (HTTPS)
**Kosten**: Gratis

---

## 🐳 Docker Deployment

### Dockerfile
```dockerfile
FROM nginx:alpine

# Copy webapp files
COPY webapp/ /usr/share/nginx/html/

# Add NGINX config for SPA
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### Deploy Commands
```bash
# Build image
docker build -t travelbot-webapp .

# Run locally
docker run -p 8080:80 travelbot-webapp

# Deploy to cloud (example)
docker tag travelbot-webapp your-registry/travelbot-webapp
docker push your-registry/travelbot-webapp
```

---

## ☁️ Cloud Providers

### AWS S3 + CloudFront
```bash
# S3 bucket setup
aws s3 mb s3://travelbot-webapp
aws s3 sync webapp/ s3://travelbot-webapp
aws s3 website s3://travelbot-webapp --index-document index.html

# CloudFront voor HTTPS
aws cloudfront create-distribution --distribution-config file://distribution-config.json
```

### Google Cloud Storage
```bash
gsutil mb gs://travelbot-webapp
gsutil -m cp -r webapp/* gs://travelbot-webapp
gsutil web set -m index.html gs://travelbot-webapp
```

### Azure Static Web Apps
```bash
az staticwebapp create \
  --name travelbot-webapp \
  --resource-group myResourceGroup \
  --location westus \
  --source https://github.com/user/repo \
  --branch main \
  --app-location "/webapp"
```

---

## ⚙️ Environment Configuration

### Backend URL per Environment
```javascript
// In main.js - environment detection
const getBackendUrl = () => {
    const hostname = window.location.hostname;
    
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
        return 'http://localhost:5000'; // Local development
    }
    
    if (hostname.includes('vercel.app')) {
        return 'https://travelbot-2k7x.onrender.com'; // Production
    }
    
    // Default production backend
    return 'https://travelbot-2k7x.onrender.com';
};
```

### Build Script
```bash
#!/bin/bash
# build.sh - Optimalisatie voor productie

echo "🏗️ Building TravelBot WebApp for production..."

# Minify CSS (optioneel)
if command -v cleancss &> /dev/null; then
    cleancss -o webapp/style.min.css webapp/style.css
    echo "✅ CSS minified"
fi

# Minify JS (optioneel)
if command -v uglifyjs &> /dev/null; then
    uglifyjs webapp/main.js --compress --mangle -o webapp/main.min.js
    echo "✅ JavaScript minified"
fi

# Update cache version in service worker
DATE=$(date +%s)
sed -i "s/travelbot-v[0-9.]*/travelbot-v1.0.${DATE}/" webapp/serviceWorker.js
echo "✅ Cache version updated"

echo "🚀 Build complete!"
```

---

## 📊 Performance Tips

### 1. Optimize Assets
```bash
# Compress images (if any)
find webapp -name "*.png" -exec pngcrush -ow {} \;

# Gzip pre-compression
find webapp -name "*.js" -o -name "*.css" -o -name "*.html" | xargs gzip -k
```

### 2. CDN Setup
```html
<!-- In index.html - use CDN for external libs -->
<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
```

### 3. Cache Headers
```nginx
# NGINX config
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 🔍 Testing Deployment

### Checklist
- [ ] HTTPS actief (GPS test)
- [ ] Service Worker registreert
- [ ] PWA installeerbaar
- [ ] Backend API bereikbaar
- [ ] TTS werkt na user interaction
- [ ] Simulatie modus functioneel
- [ ] Responsive op mobiel
- [ ] Cross-browser compatible

### Test Script
```bash
#!/bin/bash
# test_deployment.sh

URL="https://your-domain.com"

echo "🧪 Testing TravelBot WebApp deployment..."
echo "URL: $URL"

# Test HTTPS
curl -s -I "$URL" | grep -q "HTTP/2 200" && echo "✅ HTTPS OK" || echo "❌ HTTPS FAILED"

# Test PWA manifest
curl -s "$URL/manifest.json" | jq . > /dev/null && echo "✅ PWA Manifest OK" || echo "❌ PWA Manifest FAILED"

# Test Service Worker
curl -s "$URL/serviceWorker.js" | grep -q "TravelBot" && echo "✅ Service Worker OK" || echo "❌ Service Worker FAILED"

# Test main assets
for asset in "index.html" "style.css" "main.js"; do
    curl -s -f "$URL/$asset" > /dev/null && echo "✅ $asset OK" || echo "❌ $asset FAILED"
done

echo "🏁 Testing complete!"
```

---

**🎉 Kies de deployment methode die het beste past bij je behoeften!**

- **Gemakkelijkst**: Netlify drag & drop
- **Meest flexibel**: Vercel
- **Gratis**: GitHub Pages  
- **Enterprise**: AWS/Azure/GCP
