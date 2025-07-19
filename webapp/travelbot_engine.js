/**
 * TravelBot Engine - Backend API Communication
 * Handles communication with the Flask backend and provides fallbacks
 */

class TravelBotEngine {
    constructor(backendUrl) {
        this.backendUrl = backendUrl.replace(/\/$/, ''); // Remove trailing slash
        this.cache = new Map();
        this.maxCacheSize = 100;
        this.cacheExpiryMs = 24 * 60 * 60 * 1000; // 24 hours
        
        // Load cache from localStorage
        this.loadCacheFromStorage();
        
        console.log(`🤖 TravelBot Engine initialized with backend: ${this.backendUrl}`);
    }

    updateBackendUrl(newUrl) {
        this.backendUrl = newUrl.replace(/\/$/, '');
        console.log(`🔄 Backend URL updated: ${this.backendUrl}`);
    }

    async generateComment(lat, lon, persona = 'Jordanees', question = null) {
        const cacheKey = this.generateCacheKey(lat, lon, persona, question);
        
        // Check cache first
        const cachedResponse = this.getCachedResponse(cacheKey);
        if (cachedResponse) {
            console.log('💾 Using cached response');
            return cachedResponse;
        }

        try {
            // Try API call
            const response = await this.callBackendAPI(lat, lon, persona, question);
            
            // Cache successful response
            this.cacheResponse(cacheKey, response);
            
            return response;
        } catch (error) {
            console.error('API call failed:', error);
            
            // Try to find similar cached response as fallback
            const fallbackResponse = this.findSimilarCachedResponse(lat, lon, persona);
            if (fallbackResponse) {
                console.log('🔄 Using similar cached response as fallback');
                return fallbackResponse;
            }
            
            // Generate offline response
            return this.generateOfflineResponse(lat, lon, persona);
        }
    }

    async callBackendAPI(lat, lon, persona, question) {
        const url = `${this.backendUrl}/comment`;
        const payload = {
            lat: lat,
            lon: lon,
            style: persona
        };
        
        if (question) {
            payload.question = question;
        }

        console.log(`🌐 Calling API: ${url}`, payload);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-API-KEY': 'webapp-client-key' // Simple API key for webapp
            },
            body: JSON.stringify(payload),
            timeout: 15000 // 15 second timeout
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        
        if (!data.text) {
            throw new Error('Invalid API response: missing text field');
        }

        return data.text;
    }

    generateCacheKey(lat, lon, persona, question) {
        // Round coordinates to reduce cache size while maintaining reasonable accuracy
        const roundedLat = Math.round(lat * 1000) / 1000; // 3 decimal places (~100m accuracy)
        const roundedLon = Math.round(lon * 1000) / 1000;
        
        let key = `${roundedLat},${roundedLon},${persona}`;
        if (question) {
            key += `,${question}`;
        }
        return key;
    }

    getCachedResponse(key) {
        const entry = this.cache.get(key);
        if (entry) {
            // Check if cache entry is still valid
            if (Date.now() - entry.timestamp < this.cacheExpiryMs) {
                entry.lastUsed = Date.now();
                return entry.response;
            } else {
                // Remove expired entry
                this.cache.delete(key);
                this.saveCacheToStorage();
            }
        }
        return null;
    }

    cacheResponse(key, response) {
        // Implement LRU cache
        if (this.cache.size >= this.maxCacheSize) {
            this.evictOldestEntry();
        }

        this.cache.set(key, {
            response: response,
            timestamp: Date.now(),
            lastUsed: Date.now()
        });

        this.saveCacheToStorage();
    }

    evictOldestEntry() {
        let oldestKey = null;
        let oldestTime = Date.now();

        for (const [key, entry] of this.cache.entries()) {
            if (entry.lastUsed < oldestTime) {
                oldestTime = entry.lastUsed;
                oldestKey = key;
            }
        }

        if (oldestKey) {
            this.cache.delete(oldestKey);
            console.log(`🗑️ Evicted old cache entry: ${oldestKey}`);
        }
    }

    findSimilarCachedResponse(targetLat, targetLon, persona) {
        const maxDistance = 0.01; // ~1km radius
        
        for (const [key, entry] of this.cache.entries()) {
            const [lat, lon, cachedPersona] = key.split(',');
            
            if (cachedPersona === persona) {
                const distance = this.calculateDistance(
                    targetLat, targetLon,
                    parseFloat(lat), parseFloat(lon)
                );
                
                if (distance <= maxDistance) {
                    entry.lastUsed = Date.now();
                    return entry.response;
                }
            }
        }
        
        return null;
    }

    calculateDistance(lat1, lon1, lat2, lon2) {
        // Simple distance calculation (good enough for cache proximity)
        const dlat = lat2 - lat1;
        const dlon = lon2 - lon1;
        return Math.sqrt(dlat * dlat + dlon * dlon);
    }

    generateOfflineResponse(lat, lon, persona) {
        console.log('💭 Generating offline response');
        
        const responses = this.getOfflineResponses(persona);
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        
        // Add some location context if possible
        const direction = this.getCompassDirection(lat, lon);
        
        return randomResponse.replace('{direction}', direction);
    }

    getOfflineResponses(persona) {
        const responseMap = {
            'Jordanees': [
                "Weet je wat, ik heb geen internet maar dit lijkt me wel een plek waar je een biertje kunt pakken.",
                "Verbinding is weg, maar volgens mij zijn we ergens waar het gezellig kan zijn.",
                "Offline hier, maar hey - soms is dat juist fijn, toch?",
                "Geen netwerk, maar de weg lijkt me nog wel te vinden {direction}.",
                "Internet is zoek, maar de reis gaat gewoon door hoor!"
            ],
            'Belg': [
                "Alleeh, geen internet weer... zoals gewoonlijk gaat er iets mis.",
                "C'est bon, offline... net zoals mijn humeur vandaag.",
                "Pff, verbinding weg. Waarom gebeurt dit altijd met mij?",
                "Geen netwerk... typisch weer. Maar goed, we rijden maar door {direction}.",
                "Offline, maar dat past wel bij deze dag eigenlijk..."
            ],
            'Brabander': [
                "T netwerk moet tip top in orde zijn, maar nu is het dat niet hey.",
                "Geen verbinding - dit is niet volgens de standaard!",
                "Offline situatie - maar we gaan wel richting {direction}, dat moet perfect zijn.",
                "Internet werkt niet optimaal - daar kan ik niet mee werken!",
                "Verbinding is beneden peil, maar de route blijft van topkwaliteit."
            ]
        };

        return responseMap[persona] || responseMap['Jordanees'];
    }

    getCompassDirection(lat, lon) {
        // Very simple heuristic based on coordinates
        // This is just for fun, not accurate navigation
        const directions = ['noord', 'noordoost', 'oost', 'zuidoost', 'zuid', 'zuidwest', 'west', 'noordwest'];
        const index = Math.floor(Math.abs(lat + lon) * 8) % 8;
        return directions[index];
    }

    loadCacheFromStorage() {
        try {
            const cached = localStorage.getItem('travelbotCache');
            if (cached) {
                const data = JSON.parse(cached);
                this.cache = new Map(data);
                console.log(`📦 Loaded ${this.cache.size} cached responses`);
            }
        } catch (error) {
            console.warn('Failed to load cache from storage:', error);
        }
    }

    saveCacheToStorage() {
        try {
            const data = Array.from(this.cache.entries());
            localStorage.setItem('travelbotCache', JSON.stringify(data));
        } catch (error) {
            console.warn('Failed to save cache to storage:', error);
        }
    }

    clearCache() {
        this.cache.clear();
        localStorage.removeItem('travelbotCache');
        console.log('🗑️ Cache cleared');
    }

    getCacheStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxCacheSize,
            entries: Array.from(this.cache.entries()).map(([key, entry]) => ({
                key,
                age: Date.now() - entry.timestamp,
                lastUsed: Date.now() - entry.lastUsed
            }))
        };
    }

    // Test method for development
    async testAPI() {
        console.log('🧪 Testing API connection...');
        
        try {
            const testLat = 52.3676;
            const testLon = 4.9041;
            const response = await this.generateComment(testLat, testLon, 'Jordanees');
            console.log('✅ API test successful:', response);
            return true;
        } catch (error) {
            console.error('❌ API test failed:', error);
            return false;
        }
    }
}

// Make it available globally
window.TravelBotEngine = TravelBotEngine;
