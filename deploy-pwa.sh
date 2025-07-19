#!/bin/bash

echo "🚀 TravelBot PWA Deployment"
echo "=========================="

# Check if vercel is installed
if ! command -v vercel &> /dev/null; then
    echo "📦 Installing Vercel CLI..."
    npm install -g vercel
fi

echo "🌐 Deploying TravelBot PWA to Vercel..."

cd webapp

# Deploy to production
vercel --prod

echo ""
echo "✅ PWA Deployment Complete!"
echo ""
echo "📱 Install Instructions:"
echo "1. Open the URL above in iPhone Safari"
echo "2. Tap Share button → 'Add to Home Screen'"
echo "3. Your TravelBot 'app' is now installed!"
echo ""
echo "🎉 All iOS features work: GPS, Speech, Offline!"
