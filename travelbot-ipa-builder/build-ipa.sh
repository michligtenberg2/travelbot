#!/bin/bash

# Automated IPA Builder voor TravelBot
# Vereist: Xcode Command Line Tools geïnstalleerd

set -e

SCHEME="App"
CONFIGURATION="Release"
ARCHIVE_PATH="./build/TravelBot.xcarchive"
EXPORT_PATH="./build/"
IPA_PATH="./build/TravelBot.ipa"

echo "🏗️  Building TravelBot.ipa..."

# Zorg dat we in iOS project directory zijn
cd ios/App

# Controleer of xcodebuild beschikbaar is
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: xcodebuild not found. Install Xcode Command Line Tools:"
    echo "xcode-select --install"
    exit 1
fi

# Maak build directory
mkdir -p ../../build

# Archive het project
echo "📦 Archiving project..."
xcodebuild archive \
    -project App.xcodeproj \
    -scheme "$SCHEME" \
    -configuration "$CONFIGURATION" \
    -archivePath "$ARCHIVE_PATH" \
    -allowProvisioningUpdates

# Export options plist voor Ad-Hoc distributie (geen developer account nodig)
cat > export_options.plist << EOF
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD PLIST 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>method</key>
    <string>ad-hoc</string>
    <key>compileBitcode</key>
    <false/>
    <key>uploadBitcode</key>
    <false/>
    <key>uploadSymbols</key>
    <false/>
    <key>signingStyle</key>
    <string>automatic</string>
</dict>
</plist>
EOF

# Export IPA
echo "📱 Exporting IPA..."
xcodebuild -exportArchive \
    -archivePath "$ARCHIVE_PATH" \
    -exportPath "$EXPORT_PATH" \
    -exportOptionsPlist export_options.plist

# Verplaats IPA naar root
if [ -f "${EXPORT_PATH}App.ipa" ]; then
    mv "${EXPORT_PATH}App.ipa" "$IPA_PATH"
    echo "✅ IPA succesvol gebouwd: $IPA_PATH"
else
    echo "❌ Error: IPA bestand niet gevonden"
    exit 1
fi

# Cleanup
rm -f export_options.plist

echo ""
echo "🎉 TravelBot.ipa is klaar!"
echo "📍 Locatie: $(pwd)/$IPA_PATH"
echo ""
echo "📲 Installatie via AltStore:"
echo "1. Zorg dat AltServer draait op je computer"
echo "2. Open AltStore op je iPhone/iPad"
echo "3. Ga naar 'My Apps' > '+' knop"
echo "4. Selecteer het TravelBot.ipa bestand"
echo "5. Installeer en vertrouw de developer"
echo ""
