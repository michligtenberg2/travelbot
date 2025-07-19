/**
 * Text-to-Speech Manager for Web Speech API
 * Safari-compatible TTS with fallbacks
 */

class TtsManager {
    constructor() {
        this.isSupported = 'speechSynthesis' in window;
        this.voices = [];
        this.preferredVoice = null;
        this.isInitialized = false;
        
        // Settings
        this.settings = {
            pitch: 1.0,
            rate: 1.0,
            volume: 1.0,
            lang: 'nl-NL'
        };
        
        this.init();
    }

    async init() {
        if (!this.isSupported) {
            console.warn('⚠️ Text-to-Speech not supported');
            return;
        }

        console.log('🗣️ Initializing TTS Manager...');

        // Wait for voices to be loaded
        await this.loadVoices();
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.isInitialized = true;
        console.log('✅ TTS Manager initialized');
    }

    async loadVoices() {
        return new Promise((resolve) => {
            const loadVoicesTimeout = setTimeout(() => {
                console.warn('⏰ Voice loading timeout, using available voices');
                this.voices = speechSynthesis.getVoices();
                this.selectBestVoice();
                resolve();
            }, 3000);

            const onVoicesChanged = () => {
                clearTimeout(loadVoicesTimeout);
                this.voices = speechSynthesis.getVoices();
                this.selectBestVoice();
                speechSynthesis.removeEventListener('voiceschanged', onVoicesChanged);
                resolve();
            };

            // Some browsers load voices immediately
            this.voices = speechSynthesis.getVoices();
            if (this.voices.length > 0) {
                clearTimeout(loadVoicesTimeout);
                this.selectBestVoice();
                resolve();
            } else {
                // Wait for voices to load
                speechSynthesis.addEventListener('voiceschanged', onVoicesChanged);
            }
        });
    }

    selectBestVoice() {
        if (this.voices.length === 0) {
            console.warn('⚠️ No voices available');
            return;
        }

        // Preference order for Dutch/Netherlands voices
        const voicePreferences = [
            // Dutch voices
            'nl-NL',
            'nl-BE',
            'nl',
            // English as fallback with Dutch characteristics
            'en-GB',
            'en-US',
            'en'
        ];

        // Find the best matching voice
        for (const langCode of voicePreferences) {
            const voice = this.voices.find(v => 
                v.lang.toLowerCase().startsWith(langCode.toLowerCase())
            );
            
            if (voice) {
                this.preferredVoice = voice;
                console.log(`🎤 Selected voice: ${voice.name} (${voice.lang})`);
                break;
            }
        }

        // If no preferred voice found, use the first available
        if (!this.preferredVoice) {
            this.preferredVoice = this.voices[0];
            console.log(`🎤 Fallback voice: ${this.preferredVoice.name} (${this.preferredVoice.lang})`);
        }
    }

    setupEventListeners() {
        // Handle page visibility changes (important for Safari)
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden') {
                this.pauseIfSpeaking();
            }
        });

        // Handle user interaction requirement (Safari needs user gesture)
        this.setupUserInteractionHandler();
    }

    setupUserInteractionHandler() {
        // Safari requires user interaction before TTS can work
        let hasUserInteracted = false;
        
        const enableTTS = () => {
            if (!hasUserInteracted) {
                hasUserInteracted = true;
                console.log('👆 User interaction detected, TTS enabled');
                
                // Test TTS with a silent utterance to initialize
                const testUtterance = new SpeechSynthesisUtterance('');
                testUtterance.volume = 0;
                speechSynthesis.speak(testUtterance);
            }
        };

        ['click', 'touch', 'keydown'].forEach(eventType => {
            document.addEventListener(eventType, enableTTS, { once: true });
        });
    }

    speak(text, options = {}) {
        if (!this.isSupported || !text) {
            console.warn('⚠️ Cannot speak: TTS not supported or no text provided');
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                // Stop any current speech
                this.stop();

                // Create utterance
                const utterance = new SpeechSynthesisUtterance(text);
                
                // Apply settings
                utterance.voice = options.voice || this.preferredVoice;
                utterance.pitch = options.pitch || this.settings.pitch;
                utterance.rate = options.rate || this.settings.rate;
                utterance.volume = options.volume || this.settings.volume;
                utterance.lang = options.lang || this.settings.lang;

                // Set up event handlers
                utterance.onstart = () => {
                    console.log('🗣️ Speaking:', text.substring(0, 50) + '...');
                };

                utterance.onend = () => {
                    console.log('✅ Speech completed');
                    resolve();
                };

                utterance.onerror = (event) => {
                    console.error('❌ Speech error:', event.error);
                    reject(new Error(`Speech error: ${event.error}`));
                };

                utterance.onpause = () => {
                    console.log('⏸️ Speech paused');
                };

                utterance.onresume = () => {
                    console.log('▶️ Speech resumed');
                };

                // Safari-specific handling
                if (this.isSafari()) {
                    this.speakWithSafariWorkaround(utterance);
                } else {
                    speechSynthesis.speak(utterance);
                }

            } catch (error) {
                console.error('❌ TTS error:', error);
                reject(error);
            }
        });
    }

    speakWithSafariWorkaround(utterance) {
        // Safari has issues with long text and concurrent speech
        // Split long text and ensure proper handling
        
        const text = utterance.text;
        if (text.length > 200) {
            console.log('📝 Long text detected, splitting for Safari...');
            this.speakLongTextInSafari(text, utterance);
        } else {
            speechSynthesis.speak(utterance);
        }
    }

    speakLongTextInSafari(text, originalUtterance) {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        let currentIndex = 0;

        const speakNextSentence = () => {
            if (currentIndex >= sentences.length) return;

            const sentence = sentences[currentIndex].trim();
            if (sentence) {
                const utterance = new SpeechSynthesisUtterance(sentence);
                
                // Copy settings from original
                utterance.voice = originalUtterance.voice;
                utterance.pitch = originalUtterance.pitch;
                utterance.rate = originalUtterance.rate;
                utterance.volume = originalUtterance.volume;
                utterance.lang = originalUtterance.lang;

                utterance.onend = () => {
                    currentIndex++;
                    // Small delay between sentences for Safari
                    setTimeout(speakNextSentence, 100);
                };

                utterance.onerror = (event) => {
                    console.error('❌ Safari speech error:', event.error);
                    currentIndex++;
                    setTimeout(speakNextSentence, 100);
                };

                speechSynthesis.speak(utterance);
            } else {
                currentIndex++;
                speakNextSentence();
            }
        };

        speakNextSentence();
    }

    stop() {
        if (this.isSupported && speechSynthesis.speaking) {
            speechSynthesis.cancel();
            console.log('🛑 Speech stopped');
        }
    }

    pause() {
        if (this.isSupported && speechSynthesis.speaking) {
            speechSynthesis.pause();
            console.log('⏸️ Speech paused');
        }
    }

    resume() {
        if (this.isSupported && speechSynthesis.paused) {
            speechSynthesis.resume();
            console.log('▶️ Speech resumed');
        }
    }

    pauseIfSpeaking() {
        if (this.isSupported && speechSynthesis.speaking && !speechSynthesis.paused) {
            this.pause();
        }
    }

    // Voice selection methods
    getAvailableVoices() {
        return this.voices.filter(voice => 
            voice.lang.toLowerCase().startsWith('nl') ||
            voice.lang.toLowerCase().startsWith('en')
        );
    }

    setVoice(voiceName) {
        const voice = this.voices.find(v => v.name === voiceName);
        if (voice) {
            this.preferredVoice = voice;
            console.log(`🎤 Voice changed to: ${voice.name}`);
        } else {
            console.warn('⚠️ Voice not found:', voiceName);
        }
    }

    // Persona-specific voice settings
    applyPersonaVoice(persona) {
        switch (persona) {
            case 'Jordanees':
                this.settings.pitch = 0.9;
                this.settings.rate = 1.0;
                break;
            case 'Belg':
                this.settings.pitch = 1.1;
                this.settings.rate = 0.95;
                break;
            case 'Brabander':
                this.settings.pitch = 0.85;
                this.settings.rate = 1.05;
                break;
            default:
                this.settings.pitch = 1.0;
                this.settings.rate = 1.0;
        }
        
        console.log(`🎭 Applied voice settings for ${persona}`);
    }

    // Utility methods
    isSafari() {
        return /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    }

    isChrome() {
        return /chrome/i.test(navigator.userAgent) && !/edge/i.test(navigator.userAgent);
    }

    getStatus() {
        return {
            isSupported: this.isSupported,
            isInitialized: this.isInitialized,
            voiceCount: this.voices.length,
            preferredVoice: this.preferredVoice ? this.preferredVoice.name : null,
            isSpeaking: this.isSupported ? speechSynthesis.speaking : false,
            isPaused: this.isSupported ? speechSynthesis.paused : false,
            settings: this.settings
        };
    }

    // Test method
    async testTTS() {
        console.log('🧪 Testing TTS...');
        
        try {
            await this.speak('Test van Text-to-Speech functionaliteit.');
            return {
                success: true,
                message: 'TTS test succesvol'
            };
        } catch (error) {
            console.error('❌ TTS test failed:', error);
            return {
                success: false,
                error: error.message,
                message: 'TTS test gefaald'
            };
        }
    }

    // Fallback for unsupported browsers
    createAudioFallback(text) {
        // This could be extended to use external TTS APIs
        console.warn('🔇 TTS not supported, would need audio fallback for:', text);
        
        // Could implement:
        // - External TTS service calls
        // - Pre-recorded audio files
        // - Display text prominently as visual feedback
        
        return null;
    }
}

// Make it available globally
window.TtsManager = TtsManager;
