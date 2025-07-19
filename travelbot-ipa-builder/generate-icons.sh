#!/bin/bash

# Generate iOS App Icons from SVG
# Vereist: ImageMagick of librsvg-bin

ICON_SVG="assets/app-icon.svg"
ASSETS_DIR="assets/icons"

echo "🎨 Generating iOS app icons..."

# Maak assets directory
mkdir -p "$ASSETS_DIR"

# iOS App Icon groottes
declare -a sizes=(
    "20:Icon-App-20x20@1x.png"
    "40:Icon-App-20x20@2x.png"
    "60:Icon-App-20x20@3x.png"
    "29:Icon-App-29x29@1x.png"
    "58:Icon-App-29x29@2x.png"
    "87:Icon-App-29x29@3x.png"
    "40:Icon-App-40x40@1x.png"
    "80:Icon-App-40x40@2x.png"
    "120:Icon-App-40x40@3x.png"
    "60:Icon-App-60x60@1x.png"
    "120:Icon-App-60x60@2x.png"
    "180:Icon-App-60x60@3x.png"
    "76:Icon-App-76x76@1x.png"
    "152:Icon-App-76x76@2x.png"
    "167:Icon-App-83.5x83.5@2x.png"
    "1024:Icon-App-1024x1024@1x.png"
)

# Probeer verschillende tools voor conversie
if command -v magick &> /dev/null; then
    CONVERT_CMD="magick"
elif command -v convert &> /dev/null; then
    CONVERT_CMD="convert"
elif command -v rsvg-convert &> /dev/null; then
    CONVERT_CMD="rsvg"
else
    echo "❌ Error: Geen image conversion tool gevonden."
    echo "Installeer ImageMagick of librsvg-bin:"
    echo "  Ubuntu/Debian: sudo apt install imagemagick librsvg2-bin"
    echo "  macOS: brew install imagemagick librsvg"
    exit 1
fi

# Genereer icons
for size_info in "${sizes[@]}"; do
    IFS=":" read -r size filename <<< "$size_info"
    output_file="$ASSETS_DIR/$filename"
    
    echo "Generating ${filename} (${size}x${size})"
    
    if [ "$CONVERT_CMD" = "rsvg" ]; then
        rsvg-convert -h $size -w $size "$ICON_SVG" > "$output_file"
    else
        $CONVERT_CMD -background transparent -resize "${size}x${size}" "$ICON_SVG" "$output_file"
    fi
done

# Genereer ook simpele PWA icons voor webapp
declare -a pwa_sizes=("72" "96" "128" "144" "152" "192" "384" "512")

echo "Generating PWA icons..."
for size in "${pwa_sizes[@]}"; do
    output_file="www/icon-${size}.png"
    echo "Generating icon-${size}.png"
    
    if [ "$CONVERT_CMD" = "rsvg" ]; then
        rsvg-convert -h $size -w $size "$ICON_SVG" > "$output_file"
    else
        $CONVERT_CMD -background transparent -resize "${size}x${size}" "$ICON_SVG" "$output_file"
    fi
done

echo "✅ App icons generated successfully!"
echo "📁 iOS icons: $ASSETS_DIR/"
echo "📱 PWA icons: www/"
