#!/bin/bash

# TravelBot WebApp Development Server
# Provides HTTPS support for GPS testing

echo "🚗 TravelBot WebApp Development Setup"
echo "======================================"

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "❌ mkcert niet gevonden. Installeer met:"
    echo "   macOS: brew install mkcert"
    echo "   Linux: siehe https://github.com/FiloSottile/mkcert#installation"
    echo ""
    echo "🔄 Fallback: gebruik HTTP server (GPS werkt niet)"
    echo "   python3 -m http.server 8080"
    echo "   Open: http://localhost:8080"
    exit 1
fi

# Setup local CA
echo "🔐 Setting up local Certificate Authority..."
mkcert -install

# Create certificates for localhost
echo "📜 Creating SSL certificates..."
mkcert localhost 127.0.0.1 ::1

# Check if certificates were created
if [[ ! -f "localhost+2.pem" ]] || [[ ! -f "localhost+2-key.pem" ]]; then
    echo "❌ Certificate creation failed!"
    exit 1
fi

echo "✅ Certificates created successfully!"

# Create a simple HTTPS server script
cat > https_server.py << 'EOF'
#!/usr/bin/env python3
import http.server
import ssl
import socketserver
import os

PORT = 8443
CERTFILE = "localhost+2.pem"
KEYFILE = "localhost+2-key.pem"

class HTTPSHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Add CORS headers for development
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, X-API-KEY')
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

if __name__ == "__main__":
    # Check if certificates exist
    if not os.path.exists(CERTFILE) or not os.path.exists(KEYFILE):
        print(f"❌ Certificates not found: {CERTFILE}, {KEYFILE}")
        print("Run setup script first!")
        exit(1)
    
    # Create HTTPS server
    with socketserver.TCPServer(("", PORT), HTTPSHandler) as httpd:
        print(f"🚀 Starting HTTPS server on port {PORT}...")
        print(f"🌐 Open: https://localhost:{PORT}")
        print("📍 GPS will work on HTTPS!")
        print("🛑 Press Ctrl+C to stop")
        
        # Setup SSL context
        context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
        context.load_cert_chain(CERTFILE, KEYFILE)
        httpd.socket = context.wrap_socket(httpd.socket, server_side=True)
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n🛑 Server stopped.")
EOF

# Make the server script executable
chmod +x https_server.py

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start HTTPS server:"
echo "   ./https_server.py"
echo ""
echo "🌐 Then open: https://localhost:8443"
echo "📍 GPS will work on HTTPS!"
echo ""
echo "💡 Alternative (HTTP only, no GPS):"
echo "   python3 -m http.server 8080"
echo "   Open: http://localhost:8080"
