# 🔄 TravelBot Shared Backend

**Flask API backend** - Gedeeld door web app en toekomstige Android app

## 🎯 Doel

Deze backend biedt gedeelde functionaliteit voor alle TravelBot platforms:
- AI persona responses
- Location-based content generation  
- User preferences en settings
- Shared business logic

## 🚀 Quick Start

```bash
# Installeer dependencies
pip install -r requirements.txt

# Start development server
python app.py

# API beschikbaar op:
http://localhost:5000
```

## 📋 API Endpoints

### **Health Check**
```bash
GET /health
# Response: {"status": "healthy", "version": "1.0"}
```

### **Personas**
```bash
GET /api/personas
# Response: List van alle beschikbare persona's

GET /api/personas/{persona_name}
# Response: Specifieke persona configuratie
```

### **AI Responses**
```bash
POST /api/chat
{
    "persona": "amsterdammer",
    "context": "location_update",
    "location": "Amsterdam Centraal",
    "language": "nl"
}
# Response: AI-gegenereerde response
```

### **Location Context**
```bash
POST /api/location-context
{
    "latitude": 52.3676,
    "longitude": 4.9041,
    "persona": "neerslachtige_belg"
}  
# Response: Context-aware location commentary
```

## 📁 Bestanden Overzicht

### **Core Files**
- `app.py` - Flask application en API routes
- `requirements.txt` - Python dependencies
- `test_app.py` - Unit tests voor API endpoints

### **Persona Definitios**
- `personas/heino.json` - Heino persona configuratie
- `personas/neerslachtige_belg.json` - Belgische persona
- `personas/sergio_herman.json` - Chef persona  

### **Data Models**
Personas bevatten:
```json
{
    "name": "persona_name",
    "description": "Persona omschrijving",
    "personality_traits": [],
    "response_templates": {
        "greeting": [],
        "location_comment": [],
        "traffic_observation": []
    },
    "language_style": {
        "tone": "sarcastic",
        "formality": "casual"
    }
}
```

## 🔧 Development

### **Local Development:**
```bash
# Virtual environment (aanbevolen)
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Install dependencies
pip install -r requirements.txt

# Development server met auto-reload
export FLASK_ENV=development
python app.py
```

### **Testing:**
```bash
# Run unit tests
python -m pytest test_app.py

# Manual API testing
curl http://localhost:5000/health
curl http://localhost:5000/api/personas
```

### **Adding New Personas:**
1. Maak nieuw JSON bestand in `personas/`
2. Volg bestaande persona structuur
3. Test via API endpoint
4. Update documentatie

## 🌐 Platform Integration

### **Web App Integration:**
```javascript
// Web app roept backend aan voor AI responses
const response = await fetch('/api/chat', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
        persona: currentPersona,
        context: 'location_update',
        location: currentLocation
    })
});
```

### **Future Android Integration:**
```kotlin
// Android app gebruikt Retrofit voor API calls
@POST("api/chat")
suspend fun getChatResponse(
    @Body request: ChatRequest
): Response<ChatResponse>
```

## 🚀 Deployment

### **Render.com (Aanbevolen):**
```yaml
# render.yaml
services:
  - type: web
    name: travelbot-backend
    env: python
    buildCommand: "pip install -r requirements.txt"
    startCommand: "python app.py"
    envVars:
      - key: FLASK_ENV
        value: production
```

### **Heroku:**
```bash
# Procfile
web: python app.py

# Deploy
git push heroku main
```

### **Environment Variables:**
```bash
# Production settings
FLASK_ENV=production
PORT=5000  # Automatisch gezet door hosting provider
```

## 📊 Performance & Scaling

### **Current Capabilities:**
- ✅ Stateless design - Eenvoudig te schalen
- ✅ JSON responses - Efficiënte serialization  
- ✅ Error handling - Graceful degradation
- ✅ CORS support - Cross-origin requests

### **Future Optimizations:**
- 🚧 Redis caching voor frequent requests
- 🚧 Database integration voor user data
- 🚧 Rate limiting voor API protection
- 🚧 Authentication voor user accounts

## 🔐 Security

### **Current Security:**
- ✅ CORS configuratie
- ✅ Input validation
- ✅ Error message sanitization

### **Production Security (TODO):**
- 🚧 API rate limiting
- 🚧 Authentication tokens
- 🚧 Request logging
- 🚧 Environment variable secrets

## 🧪 Testing

### **Run Tests:**
```bash
python -m pytest test_app.py -v

# Coverage report
pip install pytest-cov
python -m pytest --cov=app test_app.py
```

### **Manual Testing:**
```bash
# Health check
curl http://localhost:5000/health

# Get personas
curl http://localhost:5000/api/personas

# Chat API
curl -X POST http://localhost:5000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"persona":"amsterdammer","context":"greeting"}'
```

---

**Shared backend zorgt voor consistente AI experience across alle platforms!** 🔄✨
