#!/bin/bash

# 🚀 TravelBot v4.0 Deployment Script
# Nieuwe mappenstructuur met gescheiden web app en backend

set -e

echo "🧭 TravelBot v4.0 Deployment Script"
echo "=================================="

# Kleuren voor output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Functies
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Controleer of we in de juiste directory zitten
if [ ! -f "PROJECT-STRUCTURE.md" ]; then
    print_error "Run dit script vanuit de travelbot root directory"
    exit 1
fi

# Menu voor deployment keuze
echo ""
echo "Kies deployment optie:"
echo "1) Web App (Progressive Web App)"
echo "2) Backend API (Flask)"
echo "3) Beide (Full stack)"
echo "4) Ontwikkeling setup"
read -p "Keuze (1-4): " choice

case $choice in
    1)
        print_status "Deploying Web App..."
        deploy_webapp
        ;;
    2)
        print_status "Deploying Backend..."
        deploy_backend
        ;;
    3)
        print_status "Deploying Full Stack..."
        deploy_webapp
        deploy_backend
        ;;
    4)
        print_status "Setting up development environment..."
        setup_development
        ;;
    *)
        print_error "Ongeldige keuze"
        exit 1
        ;;
esac

# Web App Deployment
deploy_webapp() {
    print_status "🌐 Web App Deployment"
    
    cd web-app/
    
    # Valideer bestanden
    if [ ! -f "index.html" ]; then
        print_error "index.html niet gevonden in web-app/"
        exit 1
    fi
    
    if [ ! -f "navigation.js" ]; then
        print_error "navigation.js niet gevonden - v4.0 features ontbreken"
        exit 1
    fi
    
    print_success "✅ Web app bestanden gevalideerd"
    
    # JavaScript syntax check (als Node.js beschikbaar is)
    if command -v node &> /dev/null; then
        print_status "Checking JavaScript syntax..."
        node -c main.js || { print_error "Syntax fout in main.js"; exit 1; }
        node -c navigation.js || { print_error "Syntax fout in navigation.js"; exit 1; }
        node -c smart-observations.js || { print_error "Syntax fout in smart-observations.js"; exit 1; }
        print_success "✅ JavaScript syntax correct"
    fi
    
    # Test lokale server
    print_status "Starting lokale test server..."
    if command -v python3 &> /dev/null; then
        echo "Test server beschikbaar op: http://localhost:8000"
        echo "Druk Ctrl+C om te stoppen"
        python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        echo "Test server beschikbaar op: http://localhost:8000"
        echo "Druk Ctrl+C om te stoppen"
        python -m SimpleHTTPServer 8000
    else
        print_error "Python niet gevonden voor test server"
        exit 1
    fi
    
    cd ../
}

# Backend Deployment  
deploy_backend() {
    print_status "🔄 Backend Deployment"
    
    cd shared/
    
    # Valideer bestanden
    if [ ! -f "app.py" ]; then
        print_error "app.py niet gevonden in shared/"
        exit 1
    fi
    
    if [ ! -f "requirements.txt" ]; then
        print_error "requirements.txt niet gevonden in shared/"
        exit 1
    fi
    
    print_success "✅ Backend bestanden gevalideerd"
    
    # Python syntax check
    if command -v python3 &> /dev/null; then
        print_status "Checking Python syntax..."
        python3 -m py_compile app.py || { print_error "Syntax fout in app.py"; exit 1; }
        print_success "✅ Python syntax correct"
    fi
    
    # Installeer dependencies in virtual environment
    print_status "Setting up Python virtual environment..."
    if [ ! -d "venv" ]; then
        python3 -m venv venv
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    
    print_success "✅ Dependencies geïnstalleerd"
    
    # Test backend server
    print_status "Starting backend test server..."
    echo "Backend API beschikbaar op: http://localhost:5000"
    echo "Test endpoints:"
    echo "  - GET  http://localhost:5000/health"
    echo "  - GET  http://localhost:5000/api/personas"
    echo "Druk Ctrl+C om te stoppen"
    
    python app.py
    
    cd ../
}

# Development Setup
setup_development() {
    print_status "🛠️ Development Environment Setup"
    
    # Web App development
    print_status "Setting up web app development..."
    cd web-app/
    
    if [ ! -f "test-v4.html" ]; then
        print_error "test-v4.html ontbreekt - v4.0 development tools niet beschikbaar"
        exit 1
    fi
    
    print_success "✅ Web app development ready"
    cd ../
    
    # Backend development
    print_status "Setting up backend development..."
    cd shared/
    
    if [ ! -d "venv" ]; then
        python3 -m venv venv
        print_success "✅ Virtual environment aangemaakt"
    fi
    
    source venv/bin/activate
    pip install -r requirements.txt
    
    # Install development dependencies
    pip install pytest pytest-cov
    
    print_success "✅ Backend development ready"
    
    # Run tests
    if [ -f "test_app.py" ]; then
        print_status "Running backend tests..."
        python -m pytest test_app.py -v
        print_success "✅ Backend tests passed"
    fi
    
    cd ../
    
    # Development server script
    cat > dev-server.sh << 'EOF'
#!/bin/bash
echo "🚀 TravelBot v4.0 Development Servers"
echo "===================================="
echo ""
echo "Starting concurrent servers..."

# Start backend in background
cd shared/
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Start frontend
cd ../web-app/
python3 -m http.server 8000 &
FRONTEND_PID=$!

echo ""
echo "✅ Servers running:"
echo "   🌐 Web App:  http://localhost:8000"  
echo "   🔄 Backend:  http://localhost:5000"
echo ""
echo "Press any key to stop servers..."
read

# Cleanup
kill $BACKEND_PID $FRONTEND_PID
echo "🛑 Development servers stopped"
EOF
    
    chmod +x dev-server.sh
    print_success "✅ Development server script created: ./dev-server.sh"
    
    print_success "🎉 Development environment ready!"
    echo ""
    echo "Quick commands:"
    echo "  ./dev-server.sh          - Start both servers"
    echo "  cd web-app && open test-v4.html  - Test interface"
    echo "  cd shared && python -m pytest    - Run backend tests"
}

print_success "🎉 Deployment completed!"
echo ""
echo "Next steps:"
echo "- Voor production: push naar GitHub en deploy via Render.com/Netlify"
echo "- Voor development: gebruik ./dev-server.sh"
echo "- Voor testing: open web-app/test-v4.html"
