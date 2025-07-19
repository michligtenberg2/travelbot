/**
 * TravelBot WebApp - Main Application Logic
 * Safari-compatible GPS webapp met offline support
 */

class TravelBotApp {
    constructor() {
        this.isRunning = false;
        this.currentLocation = null;
        this.watchId = null;
        this.updateInterval = null;
        this.settings = {
            backendUrl: 'https://travelbot-2k7x.onrender.com',
            updateIntervalMinutes: 15,
            simulationMode: false,
            enableSpeech: true,
            persona: 'Jordanees'
        };
        
        // Bind methods
        this.init = this.init.bind(this);
        this.startTrip = this.startTrip.bind(this);
        this.stopTrip = this.stopTrip.bind(this);
        this.handleLocationUpdate = this.handleLocationUpdate.bind(this);
        
        this.init();
    }

    init() {
        console.log('🚗 TravelBot WebApp initializing...');
        
        // Load settings from localStorage
        this.loadSettings();
        
        // Check HTTPS requirement
        if (location.protocol !== 'https:' && location.hostname !== 'localhost') {
            this.showHttpsWarning();
        }
        
        // Initialize UI components
        this.initializeUI();
        
        // Initialize location services
        if (window.LocationManager) {
            this.locationManager = new LocationManager();
        }
        
        // Initialize TTS
        if (window.TtsManager) {
            this.ttsManager = new TtsManager();
        }
        
        // Initialize TravelBot engine
        if (window.TravelBotEngine) {
            this.botEngine = new TravelBotEngine(this.settings.backendUrl);
        }
        
        console.log('✅ TravelBot WebApp initialized');
        this.log('TravelBot webapp geladen. Klaar om te starten!');
    }

    initializeUI() {
        // Get DOM elements
        this.elements = {
            startButton: document.getElementById('startButton'),
            statusText: document.getElementById('statusText'),
            statusIndicator: document.getElementById('statusIndicator'),
            currentLocation: document.getElementById('currentLocation'),
            currentCoordinates: document.getElementById('currentCoordinates'),
            botResponse: document.getElementById('botResponse'),
            responseText: document.getElementById('responseText'),
            playAudio: document.getElementById('playAudio'),
            personaSelect: document.getElementById('personaSelect'),
            logContainer: document.getElementById('logContainer'),
            clearLog: document.getElementById('clearLog'),
            // Settings
            settingsPanel: document.getElementById('settingsPanel'),
            backendUrl: document.getElementById('backendUrl'),
            updateInterval: document.getElementById('updateInterval'),
            simulationMode: document.getElementById('simulationMode'),
            enableSpeech: document.getElementById('enableSpeech'),
            saveSettings: document.getElementById('saveSettings'),
            // Navigation
            navHome: document.getElementById('navHome'),
            navSettings: document.getElementById('navSettings'),
            navMap: document.getElementById('navMap'),
            // Modal
            httpsModal: document.getElementById('httpsModal'),
            closeHttpsModal: document.getElementById('closeHttpsModal')
        };

        // Bind event listeners
        this.bindEvents();
        
        // Update UI with current settings
        this.updateSettingsUI();
    }

    bindEvents() {
        // Main controls
        this.elements.startButton.addEventListener('click', this.toggleTrip.bind(this));
        this.elements.playAudio.addEventListener('click', this.playLastResponse.bind(this));
        this.elements.personaSelect.addEventListener('change', this.changePersona.bind(this));
        this.elements.clearLog.addEventListener('click', this.clearLog.bind(this));
        
        // Settings
        this.elements.saveSettings.addEventListener('click', this.saveSettings.bind(this));
        this.elements.closeHttpsModal.addEventListener('click', this.hideHttpsWarning.bind(this));
        
        // Navigation
        this.elements.navHome.addEventListener('click', () => this.showPanel('home'));
        this.elements.navSettings.addEventListener('click', () => this.showPanel('settings'));
        this.elements.navMap.addEventListener('click', () => this.showPanel('map'));
        
        // Handle visibility change (page becomes hidden/visible)
        document.addEventListener('visibilitychange', this.handleVisibilityChange.bind(this));
        
        // Handle online/offline
        window.addEventListener('online', () => this.updateStatus('Online', 'active'));
        window.addEventListener('offline', () => this.updateStatus('Offline - Cached modus', 'warning'));
    }

    async toggleTrip() {
        if (this.isRunning) {
            this.stopTrip();
        } else {
            await this.startTrip();
        }
    }

    async startTrip() {
        console.log('🚀 Starting TravelBot trip...');
        
        try {
            this.elements.startButton.disabled = true;
            this.elements.startButton.innerHTML = '📡 Activeren...';
            this.updateStatus('GPS activeren...', 'active');
            
            // Check geolocation support
            if (!navigator.geolocation) {
                throw new Error('Geolocation wordt niet ondersteund door deze browser');
            }

            // Start location tracking
            if (this.settings.simulationMode) {
                this.log('🎭 Simulatie modus geactiveerd');
                this.startSimulation();
            } else {
                await this.startRealGPS();
            }
            
            this.isRunning = true;
            this.elements.startButton.innerHTML = '⏹️ Stop Reis';
            this.elements.startButton.disabled = false;
            this.updateStatus('TravelBot actief', 'active');
            
            // Start periodic updates
            this.startPeriodicUpdates();
            
            this.log('✅ TravelBot reis gestart!');
            
        } catch (error) {
            console.error('Error starting trip:', error);
            this.updateStatus('Fout: ' + error.message, 'error');
            this.elements.startButton.disabled = false;
            this.elements.startButton.innerHTML = '📍 Start Reis';
            this.log('❌ Fout bij starten: ' + error.message);
        }
    }

    async startRealGPS() {
        return new Promise((resolve, reject) => {
            const options = {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            };

            this.watchId = navigator.geolocation.watchPosition(
                (position) => {
                    this.handleLocationUpdate(position);
                    resolve();
                },
                (error) => {
                    console.error('GPS Error:', error);
                    let errorMsg = 'GPS fout';
                    
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMsg = 'GPS toegang geweigerd. Controleer browser instellingen.';
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMsg = 'GPS locatie niet beschikbaar. Probeer het buiten.';
                            break;
                        case error.TIMEOUT:
                            errorMsg = 'GPS timeout. Controleer verbinding.';
                            break;
                    }
                    reject(new Error(errorMsg));
                },
                options
            );
        });
    }

    startSimulation() {
        if (window.MockLocationProvider) {
            this.mockProvider = new MockLocationProvider();
            
            // Simulate location updates every 30 seconds
            this.simulationInterval = setInterval(() => {
                const mockPosition = this.mockProvider.getNextLocation();
                this.handleLocationUpdate(mockPosition);
            }, 30000);
            
            // Trigger first update immediately
            const firstPosition = this.mockProvider.getNextLocation();
            this.handleLocationUpdate(firstPosition);
        }
    }

    stopTrip() {
        console.log('🛑 Stopping TravelBot trip...');
        
        this.isRunning = false;
        
        // Stop GPS tracking
        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }
        
        // Stop simulation
        if (this.simulationInterval) {
            clearInterval(this.simulationInterval);
            this.simulationInterval = null;
        }
        
        // Stop periodic updates
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
        
        this.elements.startButton.innerHTML = '📍 Start Reis';
        this.updateStatus('Gestopt', 'ready');
        this.log('🛑 TravelBot reis gestopt');
    }

    handleLocationUpdate(position) {
        const lat = position.coords.latitude;
        const lon = position.coords.longitude;
        const accuracy = Math.round(position.coords.accuracy);
        
        this.currentLocation = { lat, lon, accuracy };
        
        // Update UI
        this.elements.currentCoordinates.textContent = `${lat.toFixed(4)}°, ${lon.toFixed(4)}°`;
        
        // Get location name (reverse geocoding)
        this.updateLocationName(lat, lon);
        
        console.log(`📍 Location update: ${lat}, ${lon} (±${accuracy}m)`);
        this.log(`📍 Locatie: ${lat.toFixed(4)}°, ${lon.toFixed(4)}° (±${accuracy}m)`);
    }

    async updateLocationName(lat, lon) {
        try {
            // Simple reverse geocoding using a free service
            // Note: In production, consider using a more reliable service
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=nl`);
            
            if (response.ok) {
                const data = await response.json();
                const locationName = data.city || data.locality || data.principalSubdivision || 'Onbekende locatie';
                this.elements.currentLocation.textContent = locationName;
            }
        } catch (error) {
            console.warn('Failed to get location name:', error);
            this.elements.currentLocation.textContent = 'Locatie ophalen...';
        }
    }

    startPeriodicUpdates() {
        const intervalMs = this.settings.updateIntervalMinutes * 60 * 1000;
        
        this.updateInterval = setInterval(async () => {
            if (this.isRunning && this.currentLocation) {
                await this.generateBotResponse();
            }
        }, intervalMs);
        
        // Generate first response after 5 seconds
        setTimeout(async () => {
            if (this.isRunning && this.currentLocation) {
                await this.generateBotResponse();
            }
        }, 5000);
    }

    async generateBotResponse() {
        if (!this.currentLocation || !this.botEngine) {
            console.warn('No location or bot engine available');
            return;
        }
        
        try {
            console.log('🤖 Generating bot response...');
            this.updateStatus('TravelBot denkt na...', 'active');
            
            const response = await this.botEngine.generateComment(
                this.currentLocation.lat,
                this.currentLocation.lon,
                this.settings.persona
            );
            
            if (response) {
                this.displayBotResponse(response);
                
                // Play TTS if enabled
                if (this.settings.enableSpeech && this.ttsManager) {
                    this.ttsManager.speak(response);
                }
                
                this.updateStatus('TravelBot actief', 'active');
                this.log(`🤖 ${this.settings.persona}: "${response}"`);
            }
            
        } catch (error) {
            console.error('Error generating bot response:', error);
            this.updateStatus('Bot fout - cache gebruikt', 'error');
            
            // Try offline fallback
            const offlineResponse = this.getOfflineResponse();
            this.displayBotResponse(offlineResponse);
            this.log(`❌ Bot fout, offline reactie: "${offlineResponse}"`);
        }
    }

    displayBotResponse(text) {
        this.elements.responseText.textContent = text;
        this.elements.botResponse.style.display = 'block';
        this.lastResponse = text;
    }

    playLastResponse() {
        if (this.lastResponse && this.ttsManager) {
            this.ttsManager.speak(this.lastResponse);
        }
    }

    getOfflineResponse() {
        const offlineResponses = [
            "Hmm, ik kan even niet online... maar deze plek ziet er... interessant uit.",
            "Verbinding zoek... Maar volgens mij zijn we nog steeds onderweg!",
            "Even offline, maar de reis gaat door!",
            "Geen internet, maar wel een mooie route aan het rijden.",
            "Momenteel offline - hopelijk vind je de weg nog wel!"
        ];
        return offlineResponses[Math.floor(Math.random() * offlineResponses.length)];
    }

    changePersona() {
        this.settings.persona = this.elements.personaSelect.value;
        this.saveSettings();
        this.log(`🎭 Persona gewijzigd naar: ${this.settings.persona}`);
    }

    // Settings Management
    loadSettings() {
        const saved = localStorage.getItem('travelbotSettings');
        if (saved) {
            this.settings = { ...this.settings, ...JSON.parse(saved) };
        }
    }

    saveSettings() {
        // Get values from UI
        this.settings.backendUrl = this.elements.backendUrl.value;
        this.settings.updateIntervalMinutes = parseInt(this.elements.updateInterval.value);
        this.settings.simulationMode = this.elements.simulationMode.checked;
        this.settings.enableSpeech = this.elements.enableSpeech.checked;
        
        // Update bot engine URL if changed
        if (this.botEngine) {
            this.botEngine.updateBackendUrl(this.settings.backendUrl);
        }
        
        // Save to localStorage
        localStorage.setItem('travelbotSettings', JSON.stringify(this.settings));
        
        // Restart interval if running
        if (this.isRunning) {
            if (this.updateInterval) {
                clearInterval(this.updateInterval);
            }
            this.startPeriodicUpdates();
        }
        
        this.log('⚙️ Instellingen opgeslagen');
        this.showPanel('home');
    }

    updateSettingsUI() {
        this.elements.backendUrl.value = this.settings.backendUrl;
        this.elements.updateInterval.value = this.settings.updateIntervalMinutes;
        this.elements.simulationMode.checked = this.settings.simulationMode;
        this.elements.enableSpeech.checked = this.settings.enableSpeech;
        this.elements.personaSelect.value = this.settings.persona;
    }

    // UI Management
    showPanel(panel) {
        // Remove active class from all nav buttons
        document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
        
        // Hide all panels
        this.elements.settingsPanel.classList.remove('open');
        
        switch (panel) {
            case 'home':
                this.elements.navHome.classList.add('active');
                break;
            case 'settings':
                this.elements.navSettings.classList.add('active');
                this.elements.settingsPanel.classList.add('open');
                break;
            case 'map':
                this.elements.navMap.classList.add('active');
                // TODO: Implement map view
                this.log('🗺️ Kaart functie komt binnenkort!');
                break;
        }
    }

    updateStatus(text, type = 'ready') {
        this.elements.statusText.textContent = text;
        this.elements.statusIndicator.className = `status-indicator ${type}`;
    }

    showHttpsWarning() {
        this.elements.httpsModal.style.display = 'flex';
    }

    hideHttpsWarning() {
        this.elements.httpsModal.style.display = 'none';
    }

    log(message) {
        const timestamp = new Date().toLocaleTimeString('nl-NL');
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry';
        logEntry.innerHTML = `
            <div class="timestamp">${timestamp}</div>
            <div>${message}</div>
        `;
        
        this.elements.logContainer.insertBefore(logEntry, this.elements.logContainer.firstChild);
        
        // Keep only last 50 entries
        while (this.elements.logContainer.children.length > 50) {
            this.elements.logContainer.removeChild(this.elements.logContainer.lastChild);
        }
    }

    clearLog() {
        this.elements.logContainer.innerHTML = '<div class="log-entry"><small>Log gewist.</small></div>';
    }

    handleVisibilityChange() {
        if (document.visibilityState === 'hidden') {
            console.log('App hidden - continuing in background');
        } else {
            console.log('App visible - resuming');
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.travelbotApp = new TravelBotApp();
});
