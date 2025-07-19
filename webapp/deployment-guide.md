# 🚀 Deploy TravelBot WebApp naar eigen domein

## ✨ Snelle deployment opties:

### 1. **Vercel (Aanbevolen - Gratis)**
```bash
# Installeer Vercel CLI
npm install -g vercel

# In webapp/ directory:
cd webapp/
vercel

# Volg de setup wizard
# Result: https://jouw-domein.vercel.app
```

### 2. **Netlify (Ook gratis)**
```bash
# Drag & drop webapp/ folder naar netlify.com/drop
# Of via Git:
npm install -g netlify-cli
cd webapp/
netlify deploy --prod --dir .
```

### 3. **GitHub Pages**
```bash
# Push webapp/ naar je GitHub repo
# Settings > Pages > Source: Deploy from branch
# Kies main branch, /webapp folder
# Result: https://jouw-gebruiker.github.io/repo-naam
```

### 4. **Eigen server/VPS**
```bash
# Upload webapp/ naar je server
# Nginx config:
server {
    listen 443 ssl;
    server_name jouw-domein.nl;
    
    ssl_certificate /pad/naar/cert.pem;
    ssl_certificate_key /pad/naar/key.pem;
    
    location / {
        root /var/www/travelbot-webapp;
        try_files $uri $uri/ /index.html;
    }
    
    # CORS headers voor API calls
    add_header 'Access-Control-Allow-Origin' '*';
    add_header 'Access-Control-Allow-Methods' 'GET, POST, OPTIONS';
    add_header 'Access-Control-Allow-Headers' 'Content-Type';
}
```

## 🔧 **Configuratie voor jouw domein:**

### Stap 1: Kopieer alle webapp/ bestanden
```bash
# Kopieer hele webapp/ directory
cp -r webapp/ /jouw/website/directory/
```

### Stap 2: Optioneel - Eigen backend
Als je eigen Flask backend wilt (anders gebruikt het de bestaande):

```bash
# Kopieer backend/ 
cp -r backend/ /jouw/server/
cd backend/

# Installeer requirements
pip install -r requirements.txt

# Set environment variabelen
export OPENAI_API_KEY=sk-jouw-key
export ADMIN_USERNAME=admin
export ADMIN_PASSWORD=password

# Start server
python app.py
```

### Stap 3: Update webapp config (optioneel)
Als je eigen backend hebt, wijzig in `webapp/main.js`:
```javascript
// Regel ~15
this.engine = new TravelBotEngine('https://jouw-backend-url.com');
```

## ⚠️ **Belangrijke vereisten:**

### HTTPS Verplicht
- GPS werkt ALLEEN op HTTPS
- Localhost is uitzondering voor development
- SSL certificaat nodig voor productie

### Backend API Key
- OpenAI API key is vereist in backend
- Render backend heeft al key geconfigureerd
- Voor eigen backend: stel OPENAI_API_KEY environment variabele in

### CORS Instellingen
- Backend moet CORS toestaan voor jouw domein
- Huidige backend staat alle origins toe
- Voor eigen backend: pas CORS settings aan in app.py

## 🧪 **Test na deployment:**

1. **GPS Test**: Ga naar https://jouw-domein.nl/test-drive.html
2. **API Test**: Controleer of backend bereikbaar is
3. **HTTPS Test**: Controleer groene slot in browser
4. **Mobile Test**: Test op iPhone Safari specifically

## 💡 **Pro Tips:**

- **Snelst**: Gewoon webapp/ uploaden naar Vercel/Netlify
- **Meeste controle**: Eigen VPS met Nginx
- **Gratis SSL**: Let's Encrypt of Cloudflare
- **CDN**: Cloudflare voor snellere loading wereldwijd

Alles staat klaar om direct te kopiëren! 🚀
