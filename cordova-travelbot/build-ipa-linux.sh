#!/bin/bash

# TravelBot IPA Builder voor Linux
# Gebruikt PhoneGap Build service of lokale Docker container

set -e

echo "🏗️  Building TravelBot.ipa on Linux..."

# Check if we have the webapp files
if [ ! -f "www/index.html" ]; then
    echo "📱 Copying webapp files..."
    cp -r ../webapp/* www/
fi

# Update config.xml met de juiste versie
echo "📝 Updating config.xml..."
VERSION=$(date +%Y.%m.%d)
sed -i "s/version=\".*\"/version=\"$VERSION\"/" config.xml

echo "📦 Building with Cordova..."

# Option 1: Try local build (requires more setup)
if command -v cordova &> /dev/null; then
    echo "🔧 Using local Cordova..."
    cordova prepare ios
    cordova build ios --release
    
    if [ -f "platforms/ios/build/device/TravelBot.ipa" ]; then
        cp "platforms/ios/build/device/TravelBot.ipa" "./TravelBot.ipa"
        echo "✅ IPA created: ./TravelBot.ipa"
        exit 0
    fi
fi

# Option 2: Use online build service
echo "🌐 Using online build service..."
echo "Please use one of these options:"
echo ""
echo "1. 📱 Build via Capacitor (recommended):"
echo "   cd ../travelbot-ipa-builder"
echo "   npx cap sync ios"
echo "   npx cap open ios"
echo ""
echo "2. ☁️  Use GitHub Actions (automatic):"
echo "   git add . && git commit -m 'Update for iOS build' && git push"
echo "   Check: https://github.com/michligtenberg2/travelbot/actions"
echo ""
echo "3. 🐳 Use Docker with macOS container:"
echo "   docker run --rm -v \$(pwd):/project sickcodes/docker-osx"
echo ""
echo "4. 📲 Deploy as PWA instead:"
echo "   cd ../webapp && python -m http.server 8000"
echo "   Open: http://localhost:8000"

echo ""
echo "💡 Your files are ready in www/ - choose your preferred build method!"
