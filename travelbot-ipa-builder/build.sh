#!/bin/bash

# TravelBot iOS Builder Script
# Dit script bouwt een .ipa bestand van de TravelBot webapp

set -e

echo "🧭 TravelBot iOS Builder v4.0"
echo "================================"

# Controleer of Node.js en npm geïnstalleerd zijn
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js is not installed. Please install Node.js first."
    exit 1
fi

if ! command -v npm &> /dev/null; then
    echo "❌ Error: npm is not installed. Please install npm first."
    exit 1
fi

# Ga naar de project directory
cd "$(dirname "$0")"

echo "📦 Installing dependencies..."
npm install

# Controleer of Capacitor CLI is geïnstalleerd
if ! command -v npx cap &> /dev/null; then
    echo "Installing Capacitor CLI..."
    npm install -g @capacitor/cli
fi

# Initialiseer Capacitor project (alleen eerste keer)
if [ ! -d "ios" ]; then
    echo "🔧 Initializing Capacitor project..."
    npx cap init
fi

# Voeg iOS platform toe (alleen eerste keer)
if [ ! -d "ios" ]; then
    echo "📱 Adding iOS platform..."
    npx cap add ios
fi

# Sync webapp naar iOS project
echo "🔄 Syncing webapp to iOS..."
npx cap sync ios

# Kopieer custom iOS configuratie
echo "⚙️ Applying iOS configuration..."

# Maak Info.plist aanpassingen voor permissies
PLIST_FILE="ios/App/App/Info.plist"
if [ -f "$PLIST_FILE" ]; then
    # Backup origineel
    cp "$PLIST_FILE" "$PLIST_FILE.backup"
    
    # Voeg permissies toe (dit is een simpele implementatie, voor productie gebruik een plist editor)
    echo "Adding location permissions to Info.plist..."
    
    # Maak een tijdelijke plist met extra keys
    cat >> ios/App/App/Info-extra.plist << EOF
	<key>NSLocationWhenInUseUsageDescription</key>
	<string>TravelBot gebruikt je locatie om sarcastische routehints te geven.</string>
	<key>NSMicrophoneUsageDescription</key>
	<string>Voor spraakoutput of audio hints indien nodig.</string>
	<key>NSSpeechRecognitionUsageDescription</key>
	<string>Voor gesproken output (via Web Speech of alternatief).</string>
EOF
fi

# Build instructies
echo ""
echo "✅ Project is ready for building!"
echo ""
echo "Next steps:"
echo "1. Open Xcode: npx cap open ios"
echo "2. In Xcode, go to: Product > Archive"
echo "3. Export as 'Ad Hoc' or 'Development' distribution"
echo "4. Save the .ipa file"
echo "5. Install via AltStore"
echo ""
echo "Alternative: Use automated build (requires Xcode command line tools):"
echo "./build-ipa.sh"
echo ""
