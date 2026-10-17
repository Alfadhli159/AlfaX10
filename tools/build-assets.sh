#!/usr/bin/env bash
# Build assets: convert images to AVIF/WebP, subset fonts to WOFF2, generate critical CSS, and rewrite HTML.
# Idempotent. Run from project root: ./tools/build-assets.sh

set -euo pipefail

SITE_ROOT="$(pwd)"
PAGES=(index.html cookie-policy.html privacy-policy.html terms-of-service.html)

check_tool(){
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Warning: $1 not found. $2" >&2
    return 1
  fi
  return 0
}

echo "Starting build-assets.sh in $SITE_ROOT"

tools_ok=0
check_tool cwebp "Install libwebp or use your package manager." || tools_ok=1
check_tool avifenc "Install libavif or ensure magick can write AVIF." || tools_ok=1
check_tool pyftsubset "pip install fonttools" || tools_ok=1
check_tool woff2_compress "install woff2 (https://github.com/google/woff2)" || tools_ok=1
check_tool node "Install Node.js for npx" || tools_ok=1

if [ "$tools_ok" -ne 0 ]; then
  echo "One or more tools missing. Install them and re-run." >&2
  exit 2
fi

ASSET_IMAGES="$SITE_ROOT/assets/images"
ASSET_FONTS="$SITE_ROOT/assets/fonts"
ASSET_CSS="$SITE_ROOT/assets/css"
ASSET_JS="$SITE_ROOT/assets/js"
BACKUPS="$SITE_ROOT/backups"

mkdir -p "$ASSET_IMAGES" "$ASSET_FONTS" "$ASSET_CSS" "$ASSET_JS" "$BACKUPS"

TS=$(date +%Y%m%d-%H%M%S)

backup_file(){
  if [ -f "$1" ]; then
    cp "$1" "$BACKUPS/$(basename "$1").$TS.bak"
    echo "Backed up $1 -> $BACKUPS/$(basename "$1").$TS.bak"
  fi
}

# Find images
images=( $(find assets assets/images -maxdepth 2 -type f \( -iname "*.png" -o -iname "*.jpg" -o -iname "*.jpeg" \) 2>/dev/null || true) )
if [ ${#images[@]} -eq 0 ]; then
  echo "No PNG/JPG images found in assets. Nothing to convert."
fi

avifCQ=28
webpQ=82
widths=(384 640 768 1024 1280)

for img in "${images[@]:-}"; do
  base=$(basename "$img" | sed 's/\.[^.]*$//')
  for w in "${widths[@]}"; do
    outAvif="$ASSET_IMAGES/${base}-$w.avif"
    outWebp="$ASSET_IMAGES/${base}-$w.webp"
    magick "$img" -resize ${w}x "$outWebp" || cwebp -q $webpQ "$img" -resize $w 0 -o "$outWebp" || true
    magick "$img" -resize ${w}x "$outAvif" || avifenc --cq-level $avifCQ "$img" "$outAvif" || true
  done
  magick "$img" "$ASSET_IMAGES/${base}.webp" || cwebp -q $webpQ "$img" -o "$ASSET_IMAGES/${base}.webp" || true
  magick "$img" "$ASSET_IMAGES/${base}.avif" || avifenc --cq-level $avifCQ "$img" "$ASSET_IMAGES/${base}.avif" || true
  if [[ "$base" == *hero* ]]; then
    magick "$img" -resize 2560x "$ASSET_IMAGES/${base}@2x.webp" || cwebp -q $webpQ "$img" -resize 2560 0 -o "$ASSET_IMAGES/${base}@2x.webp" || true
    magick "$img" -resize 2560x "$ASSET_IMAGES/${base}@2x.avif" || avifenc --cq-level $avifCQ "$img" "$ASSET_IMAGES/${base}@2x.avif" || true
  fi
done

# Fonts
font_sources=( $(find assets/fonts . -maxdepth 2 -type f \( -iname "*.ttf" -o -iname "*.otf" \) 2>/dev/null || true) )
if [ ${#font_sources[@]} -eq 0 ]; then
  echo "No TTF/OTF font sources found. Place font files in assets/fonts/ and re-run." >&2
fi

ranges='U+0020-007E,U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF,U+2000-206F,U+00A0,U+0660-0669,U+0030-0039'
for f in "${font_sources[@]:-}"; do
  name=$(basename "$f" | sed 's/\.[^.]*$//')
  out="$ASSET_FONTS/${name}-subset.woff2"
  pyftsubset "$f" --output-file="$out" --flavor=woff2 --with-zopfli --unicodes=$ranges --layout-features='*' --ignore-missing-glyphs
  echo "Created $out"
done

# Write fonts.css
cat > "$ASSET_CSS/fonts.css" <<'EOF'
@font-face{font-family:'CairoLocal';src:url('/assets/fonts/Cairo-subset.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'CairoLocal';src:url('/assets/fonts/Cairo-Bold-subset.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'InterLocal';src:url('/assets/fonts/Inter-subset.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'InterLocal';src:url('/assets/fonts/Inter-SemiBold-subset.woff2') format('woff2');font-weight:600;font-style:normal;font-display:swap}
EOF
echo "Wrote $ASSET_CSS/fonts.css"

# Critical CSS via npx critical
if command -v npx >/dev/null 2>&1; then
  echo "Generating critical CSS for index.html"
  npx critical http://localhost:8080/index.html --width 390 --height 844 --inline false --extract --minify --timeout 60000 --output "$ASSET_CSS/critical-index.css" || true
fi

# HTML rewrites
for p in "${PAGES[@]}"; do
  if [ ! -f "$p" ]; then echo "Skipping $p (not found)"; continue; fi
  backup_file "$p"
  html=$(cat "$p")
  html=${html//assets\/logo-AldaX10.png/assets\/logo-AldaX10.webp}
  if [[ $html != *Inter-subset.woff2* ]]; then
    html=${html//</head>/    <link rel="preload" href="/assets/fonts/Inter-subset.woff2" as="font" type="font/woff2" crossorigin>\n    <link rel="preload" href="/assets/fonts/Cairo-subset.woff2" as="font" type="font/woff2" crossorigin>\n</head>}
  fi
  if [[ $html != *assets\/css\/fonts.css* ]]; then
    html=${html//</head>/    <link rel="stylesheet" href="/assets/css/fonts.css" media="print" onload="this.media='all'">\n<noscript><link rel="stylesheet" href="/assets/css/fonts.css"></noscript>\n</head>}
  fi
  echo "$html" > "$p"
  echo "Updated $p"
done

# CHANGELOG
cat > CHANGELOG.md <<EOF
## build-assets run $TS

Files modified:
${PAGES[*]}

New assets in assets/images and assets/fonts. Backups stored in backups/ with timestamp $TS.

Run: ./tools/build-assets.sh (or PowerShell equivalent)
EOF

echo "build-assets.sh complete"
