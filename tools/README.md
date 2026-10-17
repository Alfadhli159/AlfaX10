This folder contains build scripts to generate optimized assets for the site.

Files:

Usage:
 - Ensure required tools are installed: cwebp, avifenc (or ImageMagick with AVIF support), pyftsubset (fonttools), woff2_compress, node (for npx critical).
 - Start a local server (see parent README) and run the script from the repo root.

If font TTF/OTF sources or high-res images are missing in assets/, the scripts will warn and pause. Add source images or fonts to assets/ then re-run.
```markdown
This folder contains build scripts to generate optimized assets for the site.

Files:
- build-assets.ps1 : PowerShell script for Windows (idempotent)
- build-assets.sh  : Bash script for macOS/Linux (idempotent)

Usage:
 - Ensure required tools are installed: cwebp, avifenc (or ImageMagick with AVIF support), pyftsubset (fonttools), woff2_compress, node (for npx critical).
 - Start a local server (see parent README) and run the script from the repo root.

If font TTF/OTF sources or high-res images are missing in assets/, the scripts will warn and pause. Add source images or fonts to assets/ then re-run.

```

Windows quick setup
-------------------

Open PowerShell and install or verify the following tools are available in PATH:

- Node.js (https://nodejs.org/) — provides `node` and `npx`.
- libwebp (`cwebp`) — Chocolatey: `choco install libwebp` or download binaries.
- ImageMagick (with AVIF) or `avifenc` — Chocolatey: `choco install imagemagick` (verify AVIF support) or install libavif tools.
- Python 3 and fonttools: `pip install fonttools`.
- woff2 (woff2_compress) — build from https://github.com/google/woff2 or install a prebuilt binary.

Run the build script from the repo root:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\tools\build-assets.ps1
```

Start a simple server on port 8080 before running critical (if you want the script to generate critical CSS):

```powershell
npx http-server -p 8080
# or
python -m http.server 8080
```

The script will create backups in `backups/` and will skip steps when required tools are missing.
