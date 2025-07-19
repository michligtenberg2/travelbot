#!/bin/bash

# 🚗 TravelBot v3.0 Deployment Script
# Automated deployment for production webapp

set -e  # Exit on any error

echo "🚗 TravelBot v3.0 Deployment Script"
echo "==================================="

# Configuration
WEBAPP_DIR="webapp"
BUILD_DIR="dist"
DOCS_DIR="docs"
VERSION="3.0.0"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

log() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
    exit 1
}

# Check prerequisites
check_prerequisites() {
    log "Checking prerequisites..."
    
    # Check if we're in the right directory
    if [[ ! -d "$WEBAPP_DIR" ]]; then
        error "WebApp directory not found. Are you in the TravelBot root?"
    fi
    
    # Check for required tools
    command -v python3 >/dev/null 2>&1 || error "Python 3 is required but not installed."
    
    # Check if git is clean (optional warning)
    if [[ $(git status --porcelain) ]]; then
        warning "Git working directory is not clean. Consider committing changes first."
    fi
    
    success "Prerequisites check passed"
}

# Validate webapp files
validate_webapp() {
    log "Validating webapp files..."
    
    required_files=(
        "index.html"
        "style.css"
        "main.js"
        "translations.js"
        "speech.js"
        "tts.js"
        "location.js"
        "chat.js"
        "share.js"
        "mock.js"
        "manifest.json"
        "sw.js"
    )
    
    for file in "${required_files[@]}"; do
        if [[ ! -f "$WEBAPP_DIR/$file" ]]; then
            error "Required file missing: $WEBAPP_DIR/$file"
        fi
    done
    
    success "All required webapp files found"
}

# Update version numbers
update_versions() {
    log "Updating version numbers to v$VERSION..."
    
    # Update manifest.json version
    if command -v jq >/dev/null 2>&1; then
        jq ".version = \"$VERSION\"" "$WEBAPP_DIR/manifest.json" > temp.json && mv temp.json "$WEBAPP_DIR/manifest.json"
    else
        warning "jq not found, skipping manifest.json version update"
    fi
    
    # Update version in main.js
    if [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS sed
        sed -i '' "s/version: '[^']*'/version: '$VERSION'/" "$WEBAPP_DIR/main.js"
    else
        # Linux sed
        sed -i "s/version: '[^']*'/version: '$VERSION'/" "$WEBAPP_DIR/main.js"
    fi
    
    success "Version numbers updated"
}

# Build production version
build_production() {
    log "Building production version..."
    
    # Create build directory
    rm -rf "$BUILD_DIR"
    mkdir -p "$BUILD_DIR"
    
    # Copy webapp files
    cp -r "$WEBAPP_DIR"/* "$BUILD_DIR/"
    
    # Copy documentation
    mkdir -p "$BUILD_DIR/docs"
    cp -r "$DOCS_DIR"/* "$BUILD_DIR/docs/"
    
    # Create production-specific modifications
    log "Applying production optimizations..."
    
    # Disable debug mode in main.js
    if [[ "$OSTYPE" == "darwin"* ]]; then
        sed -i '' 's/debugMode: true/debugMode: false/' "$BUILD_DIR/main.js"
        sed -i '' 's/mockMode: true/mockMode: false/' "$BUILD_DIR/main.js"
    else
        sed -i 's/debugMode: true/debugMode: false/' "$BUILD_DIR/main.js"
        sed -i 's/mockMode: true/mockMode: false/' "$BUILD_DIR/main.js"
    fi
    
    # Add production manifest modifications
    if command -v jq >/dev/null 2>&1; then
        jq '.start_url = "./" | .scope = "./"' "$BUILD_DIR/manifest.json" > temp.json && mv temp.json "$BUILD_DIR/manifest.json"
    fi
    
    success "Production build created in $BUILD_DIR"
}

# Validate build
validate_build() {
    log "Validating production build..."
    
    # Check critical files exist
    critical_files=(
        "index.html"
        "manifest.json"
        "sw.js"
        "main.js"
    )
    
    for file in "${critical_files[@]}"; do
        if [[ ! -f "$BUILD_DIR/$file" ]]; then
            error "Critical file missing in build: $file"
        fi
    done
    
    # Check HTML validity (basic)
    if command -v python3 >/dev/null 2>&1; then
        python3 -c "
import html.parser
class HTMLValidator(html.parser.HTMLParser):
    def error(self, message):
        raise Exception(f'HTML Error: {message}')

with open('$BUILD_DIR/index.html', 'r') as f:
    validator = HTMLValidator()
    validator.feed(f.read())
print('HTML validation passed')
" || warning "HTML validation failed"
    fi
    
    success "Build validation completed"
}

# Generate deployment info
generate_deployment_info() {
    log "Generating deployment info..."
    
    cat > "$BUILD_DIR/deployment-info.json" << EOF
{
  "version": "$VERSION",
  "buildDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "gitCommit": "$(git rev-parse HEAD 2>/dev/null || echo 'unknown')",
  "gitBranch": "$(git branch --show-current 2>/dev/null || echo 'unknown')",
  "buildHost": "$(hostname)",
  "buildUser": "$(whoami)",
  "features": [
    "voice-commands",
    "multilingual-support",
    "night-mode",
    "route-analysis",
    "quote-sharing",
    "pwa-support"
  ],
  "languages": ["nl", "en", "de", "fr"],
  "compatibility": {
    "browsers": ["Chrome 70+", "Firefox 65+", "Safari 13+", "Edge 79+"],
    "features": ["Web Speech API", "Geolocation API", "Canvas API", "Service Workers"]
  }
}
EOF
    
    success "Deployment info generated"
}

# Test production build
test_build() {
    log "Testing production build..."
    
    # Start test server
    cd "$BUILD_DIR"
    python3 -m http.server 8080 > /dev/null 2>&1 &
    SERVER_PID=$!
    cd ..
    
    # Wait for server to start
    sleep 2
    
    # Test basic connectivity
    if command -v curl >/dev/null 2>&1; then
        if curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/ | grep -q "200"; then
            success "Test server responds correctly"
        else
            error "Test server not responding"
        fi
    else
        warning "curl not found, skipping connectivity test"
    fi
    
    # Cleanup
    kill $SERVER_PID 2>/dev/null || true
    
    success "Build testing completed"
}

# Main deployment function
main() {
    log "Starting TravelBot v$VERSION deployment..."
    
    check_prerequisites
    validate_webapp
    update_versions
    build_production
    validate_build
    generate_deployment_info
    test_build
    
    success "🎉 Deployment completed successfully!"
    echo ""
    echo "📁 Production files are in: $BUILD_DIR"
    echo "🚀 Ready for deployment to your web server"
    echo ""
    echo "Quick deploy commands:"
    echo "  Local test:  cd $BUILD_DIR && python3 -m http.server 8080"
    echo "  Nginx:       cp -r $BUILD_DIR/* /var/www/html/travelbot/"
    echo "  Apache:      cp -r $BUILD_DIR/* /var/www/html/travelbot/"
    echo ""
    echo "📱 PWA Installation:"
    echo "  Visit your deployed URL in Chrome/Safari"
    echo "  Look for 'Install' prompt or Add to Home Screen"
    echo ""
    echo "🔧 Production checklist:"
    echo "  ✅ HTTPS enabled (required for GPS + Voice)"
    echo "  ✅ Proper MIME types configured"
    echo "  ✅ Service Worker allowed"
    echo "  ✅ Geolocation permissions policy set"
    echo ""
}

# Command line options
case "${1:-deploy}" in
    "deploy")
        main
        ;;
    "validate")
        check_prerequisites
        validate_webapp
        success "Validation completed"
        ;;
    "build")
        check_prerequisites
        validate_webapp
        build_production
        success "Build completed"
        ;;
    "test")
        if [[ -d "$BUILD_DIR" ]]; then
            test_build
        else
            error "No build found. Run deployment first."
        fi
        ;;
    "clean")
        log "Cleaning build directory..."
        rm -rf "$BUILD_DIR"
        success "Build directory cleaned"
        ;;
    "help"|"-h"|"--help")
        echo "TravelBot v3.0 Deployment Script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  deploy    Full deployment process (default)"
        echo "  validate  Validate webapp files only"
        echo "  build     Build production version only"
        echo "  test      Test existing build"
        echo "  clean     Clean build directory"
        echo "  help      Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0                    # Full deployment"
        echo "  $0 validate          # Check files"
        echo "  $0 build             # Build only"
        echo ""
        ;;
    *)
        error "Unknown command: $1. Use '$0 help' for usage information."
        ;;
esac
