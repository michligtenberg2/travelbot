/**
 * Mock Location Provider - Simulation mode for development/testing
 * Provides realistic GPS coordinates for Netherlands/Belgium
 */

class MockLocationProvider {
    constructor() {
        this.currentIndex = 0;
        this.isActive = false;
        
        // Predefined route through Netherlands with interesting locations
        this.mockRoute = [
            // Amsterdam area
            { lat: 52.3676, lon: 4.9041, name: "Amsterdam Centrum", description: "De hoofdstad" },
            { lat: 52.3731, lon: 4.8932, name: "Jordaan, Amsterdam", description: "Gezellige buurt" },
            { lat: 52.3702, lon: 4.8952, name: "Anne Frank Huis", description: "Historische plek" },
            
            // Moving south
            { lat: 52.2215, lon: 4.9041, name: "Hoofddorp", description: "Nabij Schiphol" },
            { lat: 52.1601, lon: 4.4970, name: "Leiden", description: "Universiteitsstad" },
            { lat: 52.0907, lon: 4.3007, name: "Den Haag", description: "Politieke hoofdstad" },
            { lat: 51.9244, lon: 4.4777, name: "Rotterdam", description: "Haven stad" },
            
            // Further south
            { lat: 51.6978, lon: 5.3037, name: "Den Bosch", description: "Brabantse hoofdstad" },
            { lat: 51.4416, lon: 5.4697, name: "Eindhoven", description: "Technologie centrum" },
            { lat: 51.5074, lon: 5.0781, name: "Tilburg", description: "Industriestad" },
            
            // Belgium
            { lat: 51.2194, lon: 4.4025, name: "Antwerpen", description: "Diamantstad" },
            { lat: 50.8476, lon: 4.3572, name: "Brussel", description: "Europese hoofdstad" },
            { lat: 50.9264, lon: 4.0431, name: "Gent", description: "Historisch centrum" },
            
            // Back north
            { lat: 51.2277, lon: 4.4169, name: "Antwerpen Haven", description: "Grote haven" },
            { lat: 51.4988, lon: 4.1563, name: "Bergen op Zoom", description: "Grensgemeente" },
            { lat: 51.5906, lon: 4.7725, name: "Breda", description: "Prinsenstad" },
            { lat: 52.0116, lon: 4.3571, name: "Delft", description: "Delfts blauw" },
            { lat: 52.0785, lon: 4.2888, name: "Den Haag Scheveningen", description: "Aan de kust" }
        ];
        
        // Add some random variation to make it more realistic
        this.addRouteVariations();
        
        console.log(`🎭 MockLocationProvider initialized with ${this.mockRoute.length} locations`);
    }

    addRouteVariations() {
        // Add small random variations to coordinates to simulate GPS drift
        this.mockRoute = this.mockRoute.map(location => ({
            ...location,
            // Add small random offset (±0.001 degrees ≈ ±100m)
            lat: location.lat + (Math.random() - 0.5) * 0.002,
            lon: location.lon + (Math.random() - 0.5) * 0.002,
            // Add realistic accuracy values
            accuracy: Math.random() * 20 + 5 // 5-25 meters
        }));
    }

    start() {
        this.isActive = true;
        this.currentIndex = 0;
        console.log('🎬 Mock location simulation started');
    }

    stop() {
        this.isActive = false;
        console.log('🛑 Mock location simulation stopped');
    }

    getNextLocation() {
        if (!this.isActive) {
            console.warn('Mock provider not active');
            return null;
        }

        const location = this.mockRoute[this.currentIndex];
        
        // Create a realistic position object
        const mockPosition = {
            coords: {
                latitude: location.lat,
                longitude: location.lon,
                accuracy: location.accuracy,
                altitude: Math.random() * 50 + 10, // 10-60m altitude
                altitudeAccuracy: Math.random() * 10 + 5,
                heading: this.calculateHeading(),
                speed: Math.random() * 30 + 10 // 10-40 km/h
            },
            timestamp: Date.now()
        };

        // Add location metadata for debugging
        mockPosition.mockData = {
            name: location.name,
            description: location.description,
            routeIndex: this.currentIndex,
            totalLocations: this.mockRoute.length
        };

        // Move to next location
        this.currentIndex = (this.currentIndex + 1) % this.mockRoute.length;

        console.log(`🗺️ Mock location: ${location.name} (${location.lat.toFixed(4)}, ${location.lon.toFixed(4)})`);
        
        return mockPosition;
    }

    calculateHeading() {
        if (this.mockRoute.length < 2) return null;
        
        const current = this.mockRoute[this.currentIndex];
        const next = this.mockRoute[(this.currentIndex + 1) % this.mockRoute.length];
        
        // Calculate bearing between two points
        const lat1 = current.lat * Math.PI / 180;
        const lat2 = next.lat * Math.PI / 180;
        const deltaLon = (next.lon - current.lon) * Math.PI / 180;
        
        const y = Math.sin(deltaLon) * Math.cos(lat2);
        const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(deltaLon);
        
        const bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360; // Normalize to 0-360
    }

    getCurrentLocationInfo() {
        if (!this.isActive || this.currentIndex >= this.mockRoute.length) {
            return null;
        }
        
        return this.mockRoute[this.currentIndex];
    }

    // Jump to specific location (for testing)
    jumpToLocation(index) {
        if (index >= 0 && index < this.mockRoute.length) {
            this.currentIndex = index;
            console.log(`🎯 Jumped to location: ${this.mockRoute[index].name}`);
            return this.getNextLocation();
        }
        return null;
    }

    // Jump to location by name
    jumpToLocationByName(name) {
        const index = this.mockRoute.findIndex(loc => 
            loc.name.toLowerCase().includes(name.toLowerCase())
        );
        
        if (index >= 0) {
            return this.jumpToLocation(index);
        }
        
        console.warn(`Location not found: ${name}`);
        return null;
    }

    // Add custom location to route
    addCustomLocation(lat, lon, name, description = '') {
        const newLocation = {
            lat: lat,
            lon: lon,
            name: name,
            description: description,
            accuracy: Math.random() * 20 + 5
        };
        
        this.mockRoute.push(newLocation);
        console.log(`➕ Added custom location: ${name}`);
    }

    // Generate random location within Netherlands/Belgium bounds
    generateRandomLocation() {
        // Netherlands/Belgium bounding box
        const bounds = {
            north: 53.5,
            south: 50.5,
            east: 7.2,
            west: 3.2
        };
        
        const lat = bounds.south + Math.random() * (bounds.north - bounds.south);
        const lon = bounds.west + Math.random() * (bounds.east - bounds.west);
        
        return {
            coords: {
                latitude: lat,
                longitude: lon,
                accuracy: Math.random() * 30 + 10,
                altitude: Math.random() * 100,
                altitudeAccuracy: Math.random() * 15 + 5,
                heading: Math.random() * 360,
                speed: Math.random() * 40
            },
            timestamp: Date.now(),
            mockData: {
                name: "Random Location",
                description: "Randomly generated coordinates",
                routeIndex: -1,
                totalLocations: 1
            }
        };
    }

    // Get route information
    getRouteInfo() {
        return {
            totalLocations: this.mockRoute.length,
            currentIndex: this.currentIndex,
            isActive: this.isActive,
            locations: this.mockRoute.map((loc, index) => ({
                index: index,
                name: loc.name,
                description: loc.description,
                coordinates: `${loc.lat.toFixed(4)}, ${loc.lon.toFixed(4)}`
            }))
        };
    }

    // Simulate GPS errors occasionally
    simulateGPSError() {
        const errorTypes = [
            { code: 1, message: "Simulated permission denied" },
            { code: 2, message: "Simulated position unavailable" },
            { code: 3, message: "Simulated timeout" }
        ];
        
        const randomError = errorTypes[Math.floor(Math.random() * errorTypes.length)];
        
        console.warn(`🎭 Simulating GPS error: ${randomError.message}`);
        
        return {
            code: randomError.code,
            message: randomError.message,
            PERMISSION_DENIED: 1,
            POSITION_UNAVAILABLE: 2,
            TIMEOUT: 3
        };
    }

    // Test mode with specific scenarios
    setTestScenario(scenario) {
        switch (scenario) {
            case 'urban':
                this.currentIndex = 0; // Amsterdam
                console.log('🏙️ Set to urban scenario (Amsterdam area)');
                break;
            case 'highway':
                this.currentIndex = 3; // Between cities
                console.log('🛣️ Set to highway scenario');
                break;
            case 'rural':
                this.currentIndex = Math.floor(this.mockRoute.length / 2);
                console.log('🌾 Set to rural scenario');
                break;
            case 'border':
                this.currentIndex = this.mockRoute.findIndex(loc => loc.name.includes('Antwerpen'));
                console.log('🚧 Set to border scenario (NL/BE)');
                break;
            default:
                console.log('❓ Unknown scenario, using default');
        }
    }
}

// Make it available globally
window.MockLocationProvider = MockLocationProvider;
