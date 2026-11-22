#!/usr/bin/env bash
# ==============================================================================
# Script de Configuración y Despliegue de Iconos Adaptativos para Android y PWA
# Proyecto: Grimorio Entrópico (com.sierra88.grimorioentropico)
# ==============================================================================

set -e

RES_DIR="android/app/src/main/res"
SOURCE_SVG="public/icon.svg"

echo "========================================================"
echo "🔮 GRIMORIO ENTRÓPICO: Configurando Iconos Android & PWA"
echo "========================================================"

# 1. Comprobación de directorios
if [ ! -d "android" ]; then
  echo "⚠️  No se encontró la carpeta 'android'. Ejecuta primero: npx cap add android"
  exit 1
fi

echo "📁 Creando estructura de directorios en $RES_DIR..."
mkdir -p "$RES_DIR/mipmap-mdpi"
mkdir -p "$RES_DIR/mipmap-hdpi"
mkdir -p "$RES_DIR/mipmap-xhdpi"
mkdir -p "$RES_DIR/mipmap-xxhdpi"
mkdir -p "$RES_DIR/mipmap-xxxhdpi"
mkdir -p "$RES_DIR/mipmap-anydpi-v26"
mkdir -p "$RES_DIR/values"

# 2. Configurar el color de fondo para Adaptive Icons
echo "🎨 Configurando color de fondo alquímico (#060910)..."
cat << 'EOF' > "$RES_DIR/values/ic_launcher_background.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <color name="ic_launcher_background">#060910</color>
</resources>
EOF

# 3. Configurar XML de Adaptive Icons (Android 8.0+ / API 26+)
echo "📐 Creando definiciones XML para Android Adaptive Icons..."
cat << 'EOF' > "$RES_DIR/mipmap-anydpi-v26/ic_launcher.xml"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
EOF

cat << 'EOF' > "$RES_DIR/mipmap-anydpi-v26/ic_launcher_round.xml"
<?xml version="1.0" encoding="utf-8"?>
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
EOF

# 4. Generación de imágenes PNG con ImageMagick (convert / magick) si está instalado
if command -v convert >/dev/null 2>&1 || command -v magick >/dev/null 2>&1; then
  CMD="convert"
  if command -v magick >/dev/null 2>&1; then CMD="magick"; fi
  echo "🖼️  Generando PNGs usando ImageMagick ($CMD)..."

  # Iconos Legacy Estándar y Redondos (ic_launcher.png y ic_launcher_round.png)
  $CMD -background none "$SOURCE_SVG" -resize 48x48 "$RES_DIR/mipmap-mdpi/ic_launcher.png"
  $CMD -background none "$SOURCE_SVG" -resize 48x48 "$RES_DIR/mipmap-mdpi/ic_launcher_round.png"
  $CMD -background none "$SOURCE_SVG" -resize 72x72 "$RES_DIR/mipmap-hdpi/ic_launcher.png"
  $CMD -background none "$SOURCE_SVG" -resize 72x72 "$RES_DIR/mipmap-hdpi/ic_launcher_round.png"
  $CMD -background none "$SOURCE_SVG" -resize 96x96 "$RES_DIR/mipmap-xhdpi/ic_launcher.png"
  $CMD -background none "$SOURCE_SVG" -resize 96x96 "$RES_DIR/mipmap-xhdpi/ic_launcher_round.png"
  $CMD -background none "$SOURCE_SVG" -resize 144x144 "$RES_DIR/mipmap-xxhdpi/ic_launcher.png"
  $CMD -background none "$SOURCE_SVG" -resize 144x144 "$RES_DIR/mipmap-xxhdpi/ic_launcher_round.png"
  $CMD -background none "$SOURCE_SVG" -resize 192x192 "$RES_DIR/mipmap-xxxhdpi/ic_launcher.png"
  $CMD -background none "$SOURCE_SVG" -resize 192x192 "$RES_DIR/mipmap-xxxhdpi/ic_launcher_round.png"

  # Capas Foreground de Adaptive Icons (108, 162, 216, 324, 432 px)
  $CMD -background none "$SOURCE_SVG" -resize 108x108 "$RES_DIR/mipmap-mdpi/ic_launcher_foreground.png"
  $CMD -background none "$SOURCE_SVG" -resize 162x162 "$RES_DIR/mipmap-hdpi/ic_launcher_foreground.png"
  $CMD -background none "$SOURCE_SVG" -resize 216x216 "$RES_DIR/mipmap-xhdpi/ic_launcher_foreground.png"
  $CMD -background none "$SOURCE_SVG" -resize 324x324 "$RES_DIR/mipmap-xxhdpi/ic_launcher_foreground.png"
  $CMD -background none "$SOURCE_SVG" -resize 432x432 "$RES_DIR/mipmap-xxxhdpi/ic_launcher_foreground.png"

  # Iconos para PWA en public/
  $CMD -background none "$SOURCE_SVG" -resize 192x192 "public/pwa-192x192.png"
  $CMD -background none "$SOURCE_SVG" -resize 512x512 "public/pwa-512x512.png"
  $CMD -background none "$SOURCE_SVG" -resize 180x180 "public/apple-touch-icon.png"

  echo "✅ ¡Todos los PNGs para Android y PWA se generaron exitosamente con ImageMagick!"
else
  echo "ℹ️  ImageMagick no está instalado. Puedes generarlos con Capacitor Assets:"
  echo "👉 npx @capacitor/assets generate --android"
fi

echo "========================================================"
echo "✨ Estructura Android generada en $RES_DIR"
echo "🚀 Sincroniza ahora con: npx cap sync"
echo "========================================================"
