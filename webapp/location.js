/**
 * Location Manager - GPS handling voor Safari/WebKit
 * Handles geolocation with Safari-specific optimizations
 */

class LocationManager {
    constructor() {
        this.isTracking = false;
        this.watchId = null;
        this.lastPosition = null;
        this.callbacks = [];
        
        // Safari-specific settings
        this.options = {
            enableHighAccuracy: true,
            timeout: 15000, // 15 seconds
            maximumAge: 60000 // 1 minute
        };
        
        console.log('📍 LocationManager initialized');
    }

    isSupported() {
        return 'geolocation' in navigator;
    }

    isSecureContext() {
        // Check if we're in a secure context (HTTPS or localhost)
        return location.protocol === 'https:' || 
               location.hostname === 'localhost' || 
               location.hostname === '127.0.0.1';
    }

    async requestPermission() {
        if (!this.isSupported()) {
            throw new Error('Geolocation wordt niet ondersteund door deze browser');
        }

        if (!this.isSecureContext()) {
            throw new Error('HTTPS is vereist voor GPS toegang (behalve localhost)');
        }

        return new Promise((resolve, reject) => {
            // Test permission by requesting current position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    console.log('✅ Location permission granted');
                    resolve(position);
                },
                (error) => {
                    console.error('❌ Location permission denied:', error);
                    reject(this.handleLocationError(error));
                },
                this.options
            );
        });
    }

    startTracking(callback) {
        if (!this.isSupported()) {
            throw new Error('Geolocation niet ondersteund');
        }

        if (this.isTracking) {
            console.warn('Location tracking already active');
            return;
        }

        console.log('🎯 Starting location tracking...');

        this.callbacks.push(callback);
        this.isTracking = true;

        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.lastPosition = position;
                this.notifyCallbacks(position);
            },
            (error) => {
                console.error('Location tracking error:', error);
                const errorObj = this.handleLocationError(error);
                this.notifyCallbacks(null, errorObj);
            },
            this.options
        );

        console.log(`📡 Location tracking started (watchId: ${this.watchId})`);
    }

    stopTracking() {
        if (!this.isTracking) {
            console.warn('Location tracking not active');
            return;
        }

        if (this.watchId) {
            navigator.geolocation.clearWatch(this.watchId);
            this.watchId = null;
        }

        this.isTracking = false;
        this.callbacks = [];

        console.log('🛑 Location tracking stopped');
    }

    async getCurrentPosition() {
        if (!this.isSupported()) {
            throw new Error('Geolocation niet ondersteund');
        }

        return new Promise((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.lastPosition = position;
                    resolve(position);
                },
                (error) => {
                    reject(this.handleLocationError(error));
                },
                this.options
            );
        });
    }

    getLastKnownPosition() {
        return this.lastPosition;
    }

    handleLocationError(error) {
        const errorMessages = {
            [error.PERMISSION_DENIED]: {
                message: 'GPS toegang geweigerd. Controleer browser instellingen en geef toestemming voor locatietoegang.',
                code: 'PERMISSION_DENIED',
                userAction: 'Vernieuw de pagina en geef toestemming voor locatietoegang.'
            },
            [error.POSITION_UNAVAILABLE]: {
                message: 'GPS locatie niet beschikbaar. Controleer of GPS is ingeschakeld en probeer het buiten.',
                code: 'POSITION_UNAVAILABLE',
                userAction: 'Ga naar buiten of naar een locatie met beter GPS signaal.'
            },
            [error.TIMEOUT]: {
                message: 'GPS timeout. Controleer je verbinding en probeer het opnieuw.',
                code: 'TIMEOUT',
                userAction: 'Controleer internetverbinding en probeer opnieuw.'
            }
        };

        const errorInfo = errorMessages[error.code] || {
            message: 'Onbekende GPS fout opgetreden.',
            code: 'UNKNOWN',
            userAction: 'Probeer de app opnieuw te starten.'
        };

        return {
            ...errorInfo,
            originalError: error
        };
    }

    notifyCallbacks(position, error = null) {
        this.callbacks.forEach(callback => {
            try {
                if (error) {
                    callback(null, error);
                } else {
                    callback(position);
                }
            } catch (e) {
                console.error('Error in location callback:', e);
            }
        });
    }

    // Utility methods
    calculateDistance(lat1, lon1, lat2, lon2) {
        // Haversine formula for distance calculation
        const R = 6371e3; // Earth's radius in meters
        const φ1 = lat1 * Math.PI / 180;
        const φ2 = lat2 * Math.PI / 180;
        const Δφ = (lat2 - lat1) * Math.PI / 180;
        const Δλ = (lon2 - lon1) * Math.PI / 180;

        const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
                  Math.cos(φ1) * Math.cos(φ2) *
                  Math.sin(Δλ/2) * Math.sin(Δλ/2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

        return R * c; // Distance in meters
    }

    hasMovedSignificantly(newPosition, threshold = 100) {
        if (!this.lastPosition) {
            return true;
        }

        const distance = this.calculateDistance(
            this.lastPosition.coords.latitude,
            this.lastPosition.coords.longitude,
            newPosition.coords.latitude,
            newPosition.coords.longitude
        );

        return distance >= threshold;
    }

    formatCoordinates(lat, lon, precision = 4) {
        return `${lat.toFixed(precision)}°, ${lon.toFixed(precision)}°`;
    }

    formatAccuracy(accuracy) {
        if (accuracy < 10) {
            return `±${Math.round(accuracy)}m (zeer nauwkeurig)`;
        } else if (accuracy < 50) {
            return `±${Math.round(accuracy)}m (nauwkeurig)`;
        } else if (accuracy < 200) {
            return `±${Math.round(accuracy)}m (redelijk)`;
        } else {
            return `±${Math.round(accuracy)}m (onnauwkeurig)`;
        }
    }

    // Safari-specific optimizations
    optimizeForSafari() {
        // Detect Safari browser
        const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
        
        if (isSafari) {
            console.log('🍎 Safari detected, applying optimizations...');
            
            // Adjust options for better Safari compatibility
            this.options.timeout = 20000; // Longer timeout for Safari
            this.options.maximumAge = 30000; // Shorter cache for more frequent updates
            
            // Add specific handling for Safari's location services
            this.addSafariLocationHandlers();
        }
    }

    addSafariLocationHandlers() {
        // Handle Safari's specific behavior
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible' && this.isTracking) {
                console.log('🔄 App visible, refreshing location...');
                this.refreshLocation();
            }
        });
        
        // Handle Safari's power saving mode
        if ('getBattery' in navigator) {
            navigator.getBattery().then((battery) => {
                battery.addEventListener('levelchange', () => {
                    if (battery.level < 0.2 && this.isTracking) {
                        console.log('🔋 Low battery detected, reducing GPS frequency...');
                        this.adjustForLowBattery();
                    }
                });
            });
        }
    }

    refreshLocation() {
        if (this.isTracking) {
            // Force a new location request
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    this.lastPosition = position;
                    this.notifyCallbacks(position);
                },
                (error) => {
                    console.warn('Failed to refresh location:', error);
                },
                { ...this.options, maximumAge: 0 }
            );
        }
    }

    adjustForLowBattery() {
        // Reduce GPS accuracy to save battery
        this.options.enableHighAccuracy = false;
        this.options.timeout = 30000;
        
        console.log('⚡ Adjusted GPS settings for low battery');
    }

    // Debug and testing methods
    getStatus() {
        return {
            isSupported: this.isSupported(),
            isSecureContext: this.isSecureContext(),
            isTracking: this.isTracking,
            watchId: this.watchId,
            hasLastPosition: !!this.lastPosition,
            callbackCount: this.callbacks.length,
            options: this.options
        };
    }

    // Test location services
    async testLocationServices() {
        console.log('🧪 Testing location services...');
        
        try {
            const position = await this.getCurrentPosition();
            console.log('✅ Location test successful:', position);
            return {
                success: true,
                position: position,
                message: 'GPS werkt correct'
            };
        } catch (error) {
            console.error('❌ Location test failed:', error);
            return {
                success: false,
                error: error,
                message: error.message
            };
        }
    }
}

// Make it available globally
window.LocationManager = LocationManager;
