/**
 * TravelBot v3.0 - Main Application Controller
 * Coördineert alle modules en functionaliteit
 */

class TravelBotApp {
    constructor() {
        this.version = '3.0';
        this.currentPersona = null;
        this.isNightMode = false;
        this.isInitialized = false;
        this.updateInterval = 15; // minutes
        this.lastUpdate = null;
        this.updateTimer = null;
        
        // Component references
        this.translator = null;
        this.speechManager = null;
        this.ttsManager = null;
        this.locationManager = null;
        this.chatManager = null;
        this.shareManager = null;
        this.mockManager = null;
        
        // App state
        this.appState = {
            isTracking: false,
            hasLocation: false,
            currentLocation: null,
            currentMovement: null,
            lastResponse: null,
            settings: {}
        };
        
        this.init();
    }
    
    async init() {
        console.log(`🚗 TravelBot v${this.version} starting...`);
        
        try {
            await this.initializeComponents();
            this.setupEventListeners();
            this.loadSettings();
            this.checkNightMode();
            this.showInterface();
            
            console.log('✅ TravelBot v3.0 initialized successfully');
            this.isInitialized = true;
            this.hideLoadingOverlay();
            
        } catch (error) {
            console.error('❌ TravelBot initialization failed:', error);
            this.showError('Er is een fout opgetreden bij het opstarten van TravelBot.');
        }
    }
    
    async initializeComponents() {
        // Initialize components in order of dependency
        this.translator = window.translator;
        this.speechManager = window.speechManager;  
        this.ttsManager = window.ttsManager;
        this.locationManager = window.locationManager;
        this.chatManager = window.chatManager;
        this.shareManager = window.shareManager;
        this.mockManager = window.mockManager;
        
        // Wait for components to be ready
        await this.waitForComponents();
        
        // Setup component callbacks
        this.setupComponentCallbacks();
    }
    
    async waitForComponents() {
        // Wait for critical components to be available
        const checkComponents = () => {
            return window.translator && window.locationManager && window.ttsManager;
        };
        
        let attempts = 0;
        while (!checkComponents() && attempts < 50) {
            await new Promise(resolve => setTimeout(resolve, 100));
            attempts++;
        }
        
        if (!checkComponents()) {
            throw new Error('Essential components failed to load');
        }
    }
    
    setupComponentCallbacks() {
        // Location updates
        if (this.locationManager) {
            this.locationManager.onLocation((location, summary) => {
                this.handleLocationUpdate(location, summary);
            });
            
            this.locationManager.onRouteChange((routeType, data) => {
                this.handleRouteChange(routeType, data);
            });
            
            this.locationManager.onError((code, message) => {
                this.handleLocationError(code, message);
            });
        }
        
        // Speech commands
        if (this.speechManager) {
            this.speechManager.onCommand((action, data) => {
                this.handleVoiceCommand(action, data);
            });
            
            this.speechManager.onError((error, message) => {
                this.handleSpeechError(error, message);
            });
        }
        
        // Update TTS language when translator language changes
        if (this.translator && this.ttsManager) {
            document.addEventListener('language-changed', () => {
                this.ttsManager.setLanguage(this.translator.getVoiceLanguage());
            });
        }
    }
    
    setupEventListeners() {
        // Persona selection
        document.addEventListener('click', (e) => {
            const personaCard = e.target.closest('.persona-card');
            if (personaCard) {
                const persona = personaCard.dataset.persona;
                this.selectPersona(persona);
            }
        });
        
        // Settings modal
        const settingsBtn = document.getElementById('settings-btn');
        const settingsModal = document.getElementById('settings-modal');
        const closeButtons = document.querySelectorAll('.close-btn');
        
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                this.showSettings();
            });
        }
        
        closeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) {
                    modal.classList.add('hidden');
                }
            });
        });
        
        // Night mode toggle
        const nightModeToggle = document.getElementById('night-mode-toggle');
        if (nightModeToggle) {
            nightModeToggle.addEventListener('click', () => {
                this.toggleNightMode();
            });
        }
        
        // Settings controls
        this.setupSettingsControls();
        
        // Custom events
        document.addEventListener('request-location-comment', () => {
            this.generateLocationComment();
        });
        
        document.addEventListener('persona-changed', (e) => {
            this.currentPersona = e.detail.persona;
            this.updatePersonaDisplay();
        });
        
        // Window events
        window.addEventListener('beforeunload', () => {
            this.saveSettings();
        });
        
        // Visibility change for pause/resume
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.handleAppPause();
            } else {
                this.handleAppResume();
            }
        });
    }
    
    setupSettingsControls() {
        // Update interval slider
        const intervalSlider = document.getElementById('interval-slider');
        const intervalValue = document.getElementById('interval-value');
        
        if (intervalSlider && intervalValue) {
            intervalSlider.addEventListener('input', (e) => {
                this.updateInterval = parseInt(e.target.value);
                intervalValue.textContent = this.updateInterval;
                this.restartUpdateTimer();
            });
        }
        
        // Voice enabled checkbox
        const voiceEnabled = document.getElementById('voice-enabled');
        if (voiceEnabled) {
            voiceEnabled.addEventListener('change', (e) => {
                if (this.ttsManager) {
                    this.ttsManager.volume = e.target.checked ? 0.8 : 0;
                }
            });
        }
        
        // Auto night mode checkbox
        const autoNightMode = document.getElementById('auto-night-mode');
        if (autoNightMode) {
            autoNightMode.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.checkNightMode();
                }
            });
        }
        
        // Developer mode checkbox
        const developerMode = document.getElementById('developer-mode');
        if (developerMode) {
            developerMode.addEventListener('change', (e) => {
                if (e.target.checked && this.mockManager) {
                    this.mockManager.enable();
                } else if (this.mockManager) {
                    this.mockManager.disable();
                }
            });
        }
    }
    
    selectPersona(persona) {
        console.log('Persona selected:', persona);
        
        this.currentPersona = persona;
        
        // Hide persona selector
        const personaSelector = document.getElementById('persona-selector');
        if (personaSelector) {
            personaSelector.classList.add('hidden');
        }
        
        // Show travel interface
        const travelInterface = document.getElementById('travel-interface');
        if (travelInterface) {
            travelInterface.classList.remove('hidden');
        }
        
        // Update persona display
        this.updatePersonaDisplay();
        
        // Start location tracking
        this.startTracking();
        
        // Start update timer
        this.startUpdateTimer();
        
        // Notify other components
        const event = new CustomEvent('persona-changed', {
            detail: { persona: persona }
        });
        document.dispatchEvent(event);
        
        // Generate welcome message
        this.generateWelcomeMessage();
    }
    
    updatePersonaDisplay() {
        const personaEmoji = document.getElementById('persona-emoji');
        const responseText = document.getElementById('response-text');
        
        if (personaEmoji && this.currentPersona) {
            const emojis = {
                'amsterdammer': '🏛️',
                'belg': '🍺', 
                'brabander': '🍻',
                'jordanees': '👑'
            };
            personaEmoji.textContent = emojis[this.currentPersona] || '🤖';
        }
    }
    
    async generateWelcomeMessage() {
        if (!this.currentPersona || !this.translator) return;
        
        const welcomeText = this.translator.getPersonaResponse(this.currentPersona, 'greetings');
        this.updateResponse(welcomeText);
        
        // Speak welcome message
        if (this.ttsManager) {
            setTimeout(() => {
                this.ttsManager.speakPersonaResponse(welcomeText, this.currentPersona);
            }, 1000);
        }
    }
    
    startTracking() {
        if (this.locationManager && !this.appState.isTracking) {
            this.locationManager.startTracking();
            this.appState.isTracking = true;
        }
    }
    
    startUpdateTimer() {
        this.restartUpdateTimer();
    }
    
    restartUpdateTimer() {
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        const intervalMs = this.updateInterval * 60 * 1000; // Convert to milliseconds
        
        this.updateTimer = setInterval(() => {
            this.generateLocationComment();
        }, intervalMs);
        
        console.log(`Update timer set for ${this.updateInterval} minutes`);
    }
    
    handleLocationUpdate(location, summary) {
        this.appState.currentLocation = location;
        this.appState.currentMovement = summary;
        this.appState.hasLocation = true;
        
        console.log('Location updated:', {
            lat: location.latitude.toFixed(6),
            lng: location.longitude.toFixed(6),
            speed: Math.round(summary.speed || 0),
            routeType: summary.routeType
        });
        
        // Update chat context
        if (this.chatManager) {
            this.chatManager.updateContext({
                location: location,
                movement: summary
            });
        }
        
        // Adjust TTS based on movement
        if (this.ttsManager && summary.speed) {
            this.ttsManager.adjustForMovement(summary.speed);
        }
    }
    
    handleRouteChange(routeType, data) {
        console.log('Route type changed:', routeType);
        
        // Generate route-specific comment occasionally
        if (Math.random() < 0.3) { // 30% chance
            this.generateRouteComment(routeType, data);
        }
    }
    
    handleLocationError(code, message) {
        console.error('Location error:', code, message);
        this.showError(`GPS fout: ${message}`);
        
        // Suggest mock location in development
        if (this.mockManager && this.mockManager.isEnabled()) {
            setTimeout(() => {
                this.mockManager.showMockLocationDialog();
            }, 2000);
        }
    }
    
    handleVoiceCommand(action, data) {
        console.log('Voice command:', action, data);
        
        switch (action) {
            case 'get_location':
                this.speakCurrentLocation();
                break;
                
            case 'ask_persona':
                this.generatePersonaResponse(data.transcript);
                break;
                
            case 'cynical_response':
                this.generateCynicalResponse();
                break;
                
            case 'new_comment':
                this.generateLocationComment();
                break;
                
            default:
                console.log('Unhandled voice command:', action);
                break;
        }
    }
    
    handleSpeechError(error, message) {
        console.warn('Speech error:', error, message);
        // Could show a notification or fallback to text input
    }
    
    async generateLocationComment() {
        if (!this.currentPersona || !this.appState.hasLocation) {
            console.log('Cannot generate location comment - missing persona or location');
            return;
        }
        
        try {
            this.showProcessing();
            
            // Determine comment type based on context
            const context = this.buildCommentContext();
            let comment;
            
            if (this.isNightMode) {
                comment = this.translator.getNightModeResponses(this.currentPersona);
            } else if (this.appState.currentMovement?.routeType) {
                comment = this.translator.getRouteResponse(
                    this.currentPersona, 
                    this.appState.currentMovement.routeType
                );
            } else {
                comment = await this.generateContextualComment(context);
            }
            
            this.updateResponse(comment);
            this.lastUpdate = Date.now();
            
            // Speak the comment
            if (this.ttsManager) {
                this.ttsManager.speakPersonaResponse(comment, this.currentPersona);
            }
            
            this.hideProcessing();
            
        } catch (error) {
            console.error('Error generating location comment:', error);
            this.hideProcessing();
            
            // Fallback to local response
            const fallback = this.translator.getPersonaResponse(this.currentPersona, 'movement');
            this.updateResponse(fallback);
        }
    }
    
    generateRouteComment(routeType, data) {
        if (!this.currentPersona || !this.translator) return;
        
        const comment = this.translator.getRouteResponse(this.currentPersona, routeType);
        this.updateResponse(comment);
        
        // Speak with appropriate timing
        if (this.ttsManager) {
            setTimeout(() => {
                this.ttsManager.speakPersonaResponse(comment, this.currentPersona);
            }, 500);
        }
    }
    
    async generateContextualComment(context) {
        // Try to get contextual comment from backend
        try {
            const response = await fetch('/api/location-comment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    persona: this.currentPersona,
                    context: context,
                    language: this.translator?.getCurrentLanguage() || 'nl'
                })
            });
            
            if (response.ok) {
                const data = await response.json();
                return data.comment;
            } else {
                throw new Error(`API error: ${response.status}`);
            }
        } catch (error) {
            console.warn('Backend comment generation failed:', error);
            
            // Use mock response if available
            if (this.mockManager) {
                return this.mockManager.generateMockLocationComment(
                    this.currentPersona, 
                    context.locationName
                );
            }
            
            // Fallback to translator
            return this.translator.getPersonaResponse(this.currentPersona, 'movement');
        }
    }
    
    buildCommentContext() {
        const locationElement = document.getElementById('location-details');
        const locationName = locationElement?.textContent?.replace('📍 ', '') || '';
        
        return {
            locationName: locationName,
            speed: Math.round(this.appState.currentMovement?.speed || 0),
            routeType: this.appState.currentMovement?.routeType || 'detecting',
            timeOfDay: this.getTimeOfDay(),
            isNightMode: this.isNightMode,
            language: this.translator?.getCurrentLanguage() || 'nl',
            lastUpdate: this.lastUpdate
        };
    }
    
    speakCurrentLocation() {
        if (!this.appState.hasLocation) {
            const message = this.translator?.translate('location_not_available') || 
                          'Locatie nog niet beschikbaar';
            if (this.ttsManager) {
                this.ttsManager.speak(message);
            }
            return;
        }
        
        const locationElement = document.getElementById('location-details');
        const locationText = locationElement?.textContent || '';
        
        const message = `Je bent op dit moment hier: ${locationText.replace('📍 ', '')}`;
        
        if (this.ttsManager) {
            this.ttsManager.speak(message);
        }
    }
    
    generatePersonaResponse(prompt) {
        if (!this.currentPersona || !this.translator) return;
        
        // Generate response based on prompt
        const response = this.translator.getPersonaResponse(this.currentPersona, 'greetings');
        this.updateResponse(response);
        
        if (this.ttsManager) {
            this.ttsManager.speakPersonaResponse(response, this.currentPersona);
        }
    }
    
    generateCynicalResponse() {
        const cynicalResponses = [
            'Het leven is een file, en wij staan stil.',
            'GPS weet waar we zijn, maar weten wij waar we naartoe gaan?',
            'Weer een dag van A naar B, alsof het uitmaakt.',
            'Benzine wordt duurder, tijd wordt korter, de weg blijft hetzelfde.',
            'We jagen op groen licht terwijl het leven op rood staat.'
        ];
        
        const response = cynicalResponses[Math.floor(Math.random() * cynicalResponses.length)];
        this.updateResponse(response);
        
        if (this.ttsManager) {
            this.ttsManager.speak(response);
        }
    }
    
    updateResponse(text) {
        const responseElement = document.getElementById('response-text');
        if (responseElement) {
            // Animate text change
            responseElement.style.opacity = '0.5';
            
            setTimeout(() => {
                responseElement.textContent = text;
                responseElement.style.opacity = '1';
            }, 200);
        }
        
        this.appState.lastResponse = text;
    }
    
    showProcessing() {
        const responseElement = document.getElementById('response-text');
        if (responseElement) {
            responseElement.style.opacity = '0.5';
            responseElement.textContent = 'Een moment, ik observeer de omgeving...';
        }
    }
    
    hideProcessing() {
        // Processing indication will be cleared by updateResponse
    }
    
    checkNightMode() {
        const hour = new Date().getHours();
        const shouldBeNight = hour < 6 || hour >= 21;
        
        const autoNightMode = document.getElementById('auto-night-mode')?.checked;
        
        if (autoNightMode && shouldBeNight !== this.isNightMode) {
            this.toggleNightMode();
        }
        
        // Check again in 1 hour
        setTimeout(() => this.checkNightMode(), 3600000);
    }
    
    toggleNightMode() {
        this.isNightMode = !this.isNightMode;
        document.body.classList.toggle('night-mode', this.isNightMode);
        
        const toggle = document.getElementById('night-mode-toggle');
        if (toggle) {
            toggle.textContent = this.isNightMode ? '☀️' : '🌙';
            toggle.title = this.isNightMode ? 'Dag modus' : 'Nacht modus';
        }
        
        console.log('Night mode:', this.isNightMode ? 'enabled' : 'disabled');
    }
    
    getTimeOfDay() {
        const hour = new Date().getHours();
        if (hour < 6) return 'night';
        if (hour < 12) return 'morning';
        if (hour < 18) return 'afternoon';
        if (hour < 22) return 'evening';
        return 'night';
    }
    
    showInterface() {
        // Show the main app interface
        const app = document.getElementById('app');
        if (app) {
            app.style.opacity = '1';
        }
    }
    
    showSettings() {
        const modal = document.getElementById('settings-modal');
        if (modal) {
            modal.classList.remove('hidden');
            
            // Update settings values
            const intervalSlider = document.getElementById('interval-slider');
            const intervalValue = document.getElementById('interval-value');
            if (intervalSlider && intervalValue) {
                intervalSlider.value = this.updateInterval;
                intervalValue.textContent = this.updateInterval;
            }
        }
    }
    
    showError(message) {
        console.error('App error:', message);
        
        // Could show a proper error modal or notification
        const statusElement = document.getElementById('location-status');
        if (statusElement) {
            statusElement.textContent = `❌ ${message}`;
        }
    }
    
    hideLoadingOverlay() {
        const overlay = document.getElementById('loading-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => {
                overlay.classList.add('hidden');
            }, 500);
        }
    }
    
    handleAppPause() {
        console.log('App paused');
        // Pause non-critical operations
        if (this.speechManager && this.speechManager.isListening) {
            this.speechManager.stop();
        }
    }
    
    handleAppResume() {
        console.log('App resumed');
        // Resume operations if needed
    }
    
    // Settings persistence
    saveSettings() {
        const settings = {
            version: this.version,
            currentPersona: this.currentPersona,
            updateInterval: this.updateInterval,
            isNightMode: this.isNightMode,
            lastUpdate: this.lastUpdate,
            appState: this.appState
        };
        
        localStorage.setItem('travelbot-app-settings', JSON.stringify(settings));
    }
    
    loadSettings() {
        const saved = localStorage.getItem('travelbot-app-settings');
        if (saved) {
            try {
                const settings = JSON.parse(saved);
                
                this.updateInterval = settings.updateInterval || 15;
                this.isNightMode = settings.isNightMode || false;
                this.lastUpdate = settings.lastUpdate;
                
                if (this.isNightMode) {
                    document.body.classList.add('night-mode');
                }
                
                console.log('Settings loaded:', settings);
            } catch (error) {
                console.warn('Could not load app settings:', error);
            }
        }
    }
    
    // Public API methods
    getCurrentState() {
        return {
            version: this.version,
            persona: this.currentPersona,
            isInitialized: this.isInitialized,
            hasLocation: this.appState.hasLocation,
            isTracking: this.appState.isTracking,
            lastResponse: this.appState.lastResponse,
            isNightMode: this.isNightMode
        };
    }
    
    exportAppData() {
        const data = {
            ...this.getCurrentState(),
            settings: this.appState.settings,
            locationHistory: this.locationManager?.locationHistory || [],
            chatHistory: this.chatManager?.exportChat() || null,
            timestamp: Date.now()
        };
        
        return data;
    }
    
    reset() {
        // Reset app to initial state
        this.currentPersona = null;
        this.lastUpdate = null;
        
        if (this.updateTimer) {
            clearInterval(this.updateTimer);
        }
        
        if (this.locationManager) {
            this.locationManager.stopTracking();
        }
        
        // Show persona selector again
        const personaSelector = document.getElementById('persona-selector');
        const travelInterface = document.getElementById('travel-interface');
        
        if (personaSelector) personaSelector.classList.remove('hidden');
        if (travelInterface) travelInterface.classList.add('hidden');
        
        // Clear stored settings
        localStorage.removeItem('travelbot-app-settings');
        
        console.log('App reset to initial state');
    }
}

// Initialize the app when DOM is ready
let travelBot;
document.addEventListener('DOMContentLoaded', async () => {
    travelBot = new TravelBotApp();
    
    // Make it available globally for debugging
    window.travelBot = travelBot;
    
    console.log('🚗 TravelBot v3.0 ready!');
});

// Handle service worker for PWA functionality
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}

// Export for modules
window.TravelBotApp = TravelBotApp;
