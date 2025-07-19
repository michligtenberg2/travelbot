/**
 * TravelBot Service Worker - PWA Offline Support
 * Provides caching and offline functionality
 */

const CACHE_NAME = 'travelbot-v1.2.0';
const CACHE_URLS = [
    '/',
    '/index.html',
    '/style.css',
    '/main.js',
    '/travelbot_engine.js',
    '/location.js',
    '/tts.js',
    '/mock.js',
    '/manifest.json',
    // Add external dependencies if any
    'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css'
];

// Offline responses for different scenarios
const OFFLINE_RESPONSES = {
    '/comment': {
        text: "Sorry, momenteel offline. Maar de reis gaat gewoon door!"
    }
};

// Install event - cache resources
self.addEventListener('install', event => {
    console.log('🔧 Service Worker installing...');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('📦 Caching app resources...');
                return cache.addAll(CACHE_URLS);
            })
            .then(() => {
                console.log('✅ Service Worker installed successfully');
                // Take control immediately
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('❌ Service Worker install failed:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    console.log('🚀 Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== CACHE_NAME) {
                            console.log('🗑️ Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker activated');
                // Take control of all pages
                return self.clients.claim();
            })
    );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') {
        return;
    }

    const url = new URL(event.request.url);
    
    // Handle API requests differently
    if (url.pathname.startsWith('/comment') || url.hostname !== location.hostname) {
        event.respondWith(handleAPIRequest(event.request));
        return;
    }
    
    // Handle static resources with cache-first strategy
    event.respondWith(handleStaticRequest(event.request));
});

async function handleStaticRequest(request) {
    try {
        // Try cache first
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            console.log('💾 Serving from cache:', request.url);
            return cachedResponse;
        }

        // If not in cache, fetch from network
        const networkResponse = await fetch(request);
        
        // Cache successful responses
        if (networkResponse.ok) {
            const cache = await caches.open(CACHE_NAME);
            cache.put(request, networkResponse.clone());
            console.log('🌐 Fetched and cached:', request.url);
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Static request failed:', request.url, error);
        
        // Return a basic offline page for HTML requests
        if (request.headers.get('accept')?.includes('text/html')) {
            return new Response(
                generateOfflinePage(),
                { 
                    headers: { 'Content-Type': 'text/html' },
                    status: 200
                }
            );
        }
        
        // Return empty response for other resources
        return new Response('', { status: 503 });
    }
}

async function handleAPIRequest(request) {
    try {
        // Try network first for API requests
        const networkResponse = await fetch(request, {
            timeout: 10000 // 10 second timeout
        });
        
        if (networkResponse.ok) {
            console.log('🌐 API request successful:', request.url);
            return networkResponse;
        } else {
            throw new Error(`API returned ${networkResponse.status}`);
        }
    } catch (error) {
        console.warn('⚠️ API request failed, returning offline response:', error);
        
        // Return offline response
        const url = new URL(request.url);
        const offlineResponse = OFFLINE_RESPONSES[url.pathname];
        
        if (offlineResponse) {
            return new Response(
                JSON.stringify(offlineResponse),
                {
                    headers: { 'Content-Type': 'application/json' },
                    status: 200
                }
            );
        }
        
        // Generic offline response
        return new Response(
            JSON.stringify({
                text: "Momenteel offline. Probeer het later opnieuw.",
                offline: true
            }),
            {
                headers: { 'Content-Type': 'application/json' },
                status: 503
            }
        );
    }
}

function generateOfflinePage() {
    return `
<!DOCTYPE html>
<html lang="nl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>TravelBot - Offline</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, sans-serif;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            background: linear-gradient(135deg, #007bff, #0056b3);
            color: white;
            text-align: center;
            padding: 20px;
        }
        .offline-container {
            max-width: 400px;
        }
        .offline-icon {
            font-size: 4rem;
            margin-bottom: 20px;
        }
        .offline-title {
            font-size: 2rem;
            margin-bottom: 10px;
        }
        .offline-message {
            font-size: 1.1rem;
            opacity: 0.9;
            line-height: 1.5;
            margin-bottom: 30px;
        }
        .retry-btn {
            background: rgba(255, 255, 255, 0.2);
            color: white;
            border: 2px solid white;
            padding: 12px 24px;
            border-radius: 25px;
            cursor: pointer;
            font-size: 1rem;
            text-decoration: none;
            display: inline-block;
            transition: background 0.3s ease;
        }
        .retry-btn:hover {
            background: rgba(255, 255, 255, 0.3);
        }
    </style>
</head>
<body>
    <div class="offline-container">
        <div class="offline-icon">📡</div>
        <h1 class="offline-title">TravelBot Offline</h1>
        <p class="offline-message">
            Geen internetverbinding beschikbaar. TravelBot werkt het beste online, 
            maar sommige functies zijn beschikbaar in cached modus.
        </p>
        <a href="/" class="retry-btn" onclick="window.location.reload()">
            🔄 Probeer Opnieuw
        </a>
    </div>
</body>
</html>`;
}

// Handle push notifications (future feature)
self.addEventListener('push', event => {
    if (event.data) {
        const data = event.data.json();
        
        const options = {
            body: data.body || 'TravelBot heeft een nieuwe opmerking!',
            icon: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🚗</text></svg>',
            badge: 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="90">🔔</text></svg>',
            tag: 'travelbot-comment',
            requireInteraction: false,
            actions: [
                {
                    action: 'open',
                    title: 'Open TravelBot'
                },
                {
                    action: 'dismiss',
                    title: 'Sluiten'
                }
            ]
        };
        
        event.waitUntil(
            self.registration.showNotification(data.title || 'TravelBot', options)
        );
    }
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.matchAll({ type: 'window' })
                .then(clients => {
                    // If TravelBot is already open, focus it
                    for (let client of clients) {
                        if (client.url.includes(location.origin)) {
                            return client.focus();
                        }
                    }
                    // Otherwise open a new window
                    return clients.openWindow('/');
                })
        );
    }
});

// Background sync (for future features)
self.addEventListener('sync', event => {
    console.log('🔄 Background sync:', event.tag);
    
    if (event.tag === 'sync-location-data') {
        event.waitUntil(
            // Sync any pending location data when back online
            syncLocationData()
        );
    }
});

async function syncLocationData() {
    // This would sync any cached location data when back online
    console.log('📍 Syncing location data...');
    
    try {
        // Implementation would go here
        console.log('✅ Location data synced');
    } catch (error) {
        console.error('❌ Failed to sync location data:', error);
    }
}

// Send messages to the main app
function sendMessageToApp(message) {
    return self.clients.matchAll()
        .then(clients => {
            clients.forEach(client => {
                client.postMessage(message);
            });
        });
}

// Log service worker lifecycle
console.log('🚀 TravelBot Service Worker loaded');

// Handle unhandled promise rejections
self.addEventListener('unhandledrejection', event => {
    console.error('❌ Service Worker unhandled rejection:', event.reason);
});

// Handle errors
self.addEventListener('error', event => {
    console.error('❌ Service Worker error:', event.error);
});
