#!/bin/bash

echo "🏪 AltStore Source Upload Script"
echo "==============================="
echo ""

# Check if we have the required files
if [ ! -f "altstore-source/apps.json" ]; then
    echo "❌ Error: apps.json not found!"
    exit 1
fi

if [ ! -f "altstore-source/index.html" ]; then
    echo "❌ Error: index.html not found!"
    exit 1
fi

echo "✅ Required files found"
echo ""

echo "📂 Files to upload to michligtenberg.nl/appstore/:"
echo ""
find altstore-source -type f | sed 's/altstore-source\//  /' | sort

echo ""
echo "🚀 Next steps:"
echo ""
echo "1. **Upload via FTP/cPanel:**"
echo "   Upload all files from altstore-source/ to:"
echo "   https://michligtenberg.nl/appstore/"
echo ""
echo "2. **Test AltStore source:**"
echo "   URL: https://michligtenberg.nl/appstore/apps.json"
echo ""
echo "3. **For PWA deployment:**"
echo "   Upload webapp/ contents to:"
echo "   https://michligtenberg.nl/travelbot/"
echo ""
echo "4. **When .ipa is ready:**"
echo "   Upload TravelBot.ipa to:"
echo "   https://michligtenberg.nl/appstore/ipa/"
echo ""
echo "🎉 Your AltStore source will be live at:"
echo "   https://michligtenberg.nl/appstore/"
echo ""
echo "📱 Users can add your source with:"
echo "   https://michligtenberg.nl/appstore/apps.json"
