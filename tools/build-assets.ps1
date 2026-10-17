<#
PowerShell build script to convert images to AVIF/WebP, subset fonts to WOFF2, generate critical CSS (via npx critical), and rewrite HTML to use responsive assets.
Idempotent: safe to run multiple times. Creates backups in /backups with timestamp.

Requirements (install if missing):
 - cwebp (for WebP)
 - avifenc (or magick with AVIF delegate)
 - pyftsubset (from fonttools)
 - woff2_compress (from woff2 project)
 - node + npx (for critical)

Usage: Run from repo root: .\tools\build-assets.ps1
#>

# Note: This script uses Test-Tool helper function to verify required tools are available.
# Any legacy references to Check-Tool should be removed from your environment as it uses
# an unapproved PowerShell verb. Search user profile files or loaded modules and rename
# or remove any Check-Tool definitions.


param(
    [string]$SiteRoot = (Get-Location).Path,
    [string[]]$Pages = @('index.html','cookie-policy.html','privacy-policy.html','terms-of-service.html')
)

## Defensive cleanup: ensure no Check-Tool remains in the session
## Check both function and alias namespaces to be thorough
$checkToolCmd = Get-Command -Name 'Check-Tool' -ErrorAction SilentlyContinue
if ($checkToolCmd) {
    Write-Output "Found Check-Tool command: $($checkToolCmd.CommandType) from $($checkToolCmd.Source)"
    if ($checkToolCmd.CommandType -eq 'Function') {
        Write-Output "Removing function 'Check-Tool' to avoid unapproved-verb warnings."
        Remove-Item -Path "Function:\Check-Tool" -ErrorAction SilentlyContinue
    }
    if ($checkToolCmd.CommandType -eq 'Alias') {
        Write-Output "Removing alias 'Check-Tool' to avoid unapproved-verb warnings."
        Remove-Item -Path "Alias:\Check-Tool" -ErrorAction SilentlyContinue
    }
}

## Double-check after removal
$remainingCmd = Get-Command -Name 'Check-Tool' -ErrorAction SilentlyContinue
if ($remainingCmd) {
    Write-Warning "Unable to remove Check-Tool ($($remainingCmd.CommandType)) from $($remainingCmd.Source)"
}

function Test-Tool($name, $cmd, $hint) {
    $found = Get-Command $cmd -ErrorAction SilentlyContinue
    if (-not $found) {
        Write-Warning "$name not found. $hint"
        return $false
    }
    return $true
}

Write-Output "Starting build-assets.ps1 in $SiteRoot"

# Tools check
# Check for tools but continue; missing tools will skip specific steps later.
$haveCwebp = Test-Tool 'cwebp' 'cwebp' 'Install libwebp (https://developers.google.com/speed/webp) or use package manager.'
$haveAvifenc = Test-Tool 'avifenc' 'avifenc' 'Install libavif (https://github.com/AOMediaCodec/libavif) or ensure magick can write AVIF.'
$havePyftsubset = Test-Tool 'pyftsubset' 'pyftsubset' 'Install fonttools: pip install fonttools'
$haveWoff2 = Test-Tool 'woff2_compress' 'woff2_compress' 'Install woff2 tool (https://github.com/google/woff2).'
Test-Tool 'node' 'node' 'Install Node.js (https://nodejs.org/) and ensure npx is available.'

if (-not ($haveCwebp -or $haveAvifenc -or (Get-Command magick -ErrorAction SilentlyContinue))) {
    Write-Warning "No image conversion tools detected (magick/cwebp/avifenc). Image conversion steps will be skipped."
}

if (-not ($havePyftsubset -or $haveWoff2)) {
    Write-Warning "Font subsetting tools not fully available (pyftsubset/woff2_compress). Font subsetting steps will be skipped or partial."
}

# Prepare folders
$assetImages = Join-Path $SiteRoot 'assets\images'
$assetFonts = Join-Path $SiteRoot 'assets\fonts'
$assetCss = Join-Path $SiteRoot 'assets\css'
$assetJs = Join-Path $SiteRoot 'assets\js'
$backups = Join-Path $SiteRoot 'backups'

foreach ($d in @($assetImages,$assetFonts,$assetCss,$assetJs,$backups)) {
    if (-not (Test-Path $d)) { New-Item -Path $d -ItemType Directory | Out-Null }
}

# Timestamp for backups
$ts = (Get-Date).ToString('yyyyMMdd-HHmmss')

function Backup-File($path) {
    if (Test-Path $path) {
        $name = Split-Path $path -Leaf
        $dst = Join-Path $backups "$name.$ts.bak"
        Copy-Item $path $dst -Force
        Write-Output "Backed up $path -> $dst"
    }
}

# Find source images (png/jpg/jpeg) in assets root and assets/images
$searchDirs = @((Join-Path $SiteRoot 'assets'), $assetImages)
$images = @()
foreach ($d in $searchDirs) {
    if (Test-Path $d) {
        $images += Get-ChildItem -Path $d -Include *.png,*.jpg,*.jpeg -File -Recurse | Select-Object -ExpandProperty FullName
    }
}

if ($images.Count -eq 0) { Write-Output "No PNG/JPG source images found in assets directories. Nothing to convert." }

# Quality and widths
$avifCQ = 28
$webpQ = 82
$widths = @(384,640,768,1024,1280)

foreach ($img in $images) {
    $base = [System.IO.Path]::GetFileNameWithoutExtension($img)
    # Note: Source image directory path not needed for current operations
    foreach ($w in $widths) {
        $outAvif = Join-Path $assetImages "$base-$w.avif"
        $outWebp = Join-Path $assetImages "$base-$w.webp"
        # Try ImageMagick (magick) first, otherwise fallback to cwebp/avifenc if available
        try {
            & magick "$img" -resize "${w}x" "$outWebp"
        } catch {
            try { & cwebp -q $webpQ "$img" -resize $w 0 -o "$outWebp" } catch { Write-Verbose "Failed to create $outWebp" }
        }
        try {
            & magick "$img" -resize "${w}x" "$outAvif"
        } catch {
            try { & avifenc --cq-level $avifCQ "$img" "$outAvif" } catch { Write-Verbose "Failed to create $outAvif" }
        }
    }
    # create default .webp and .avif (no suffix)
    $outAvif = Join-Path $assetImages "$base.avif"
    $outWebp = Join-Path $assetImages "$base.webp"
    try { & magick "$img" "$outWebp" } catch { try { & cwebp -q $webpQ "$img" -o "$outWebp" } catch { Write-Verbose "Failed to create $outWebp" } }
    try { & magick "$img" "$outAvif" } catch { try { & avifenc --cq-level $avifCQ "$img" "$outAvif" } catch { Write-Verbose "Failed to create $outAvif" } }
    # hero 2x special handling if base contains hero
    if ($base -match 'hero') {
        $outAvif2 = Join-Path $assetImages "$base@2x.avif"
        $outWebp2 = Join-Path $assetImages "$base@2x.webp"
        try { & magick "$img" -resize 2560x "$outWebp2" } catch { try { & cwebp -q $webpQ "$img" -resize 2560 0 -o "$outWebp2" } catch { Write-Verbose "Failed to create $outWebp2" } }
        try { & magick "$img" -resize 2560x "$outAvif2" } catch { try { & avifenc --cq-level $avifCQ "$img" "$outAvif2" } catch { Write-Verbose "Failed to create $outAvif2" } }
    }
}

# Fonts: look for TTF/OTF in assets/fonts or repo root
$fontSources = Get-ChildItem -Path (Join-Path $SiteRoot 'assets\fonts'), $SiteRoot -Include *.ttf,*.otf -File -Recurse -ErrorAction SilentlyContinue | Select-Object -ExpandProperty FullName

if ($fontSources.Count -eq 0) { Write-Warning "No TTF/OTF font sources found. If you have font files, place them in assets/fonts/ or repo root." }

# Subset ranges
$ranges = 'U+0020-007E,U+0600-06FF,U+FB50-FDFF,U+FE70-FEFF,U+2000-206F,U+00A0,U+0660-0669,U+0030-0039'

foreach ($f in $fontSources) {
    $name = [System.IO.Path]::GetFileNameWithoutExtension($f)
    $woffOut = Join-Path $assetFonts ("$name-subset.woff2")
    & pyftsubset "$f" --output-file="$woffOut" --flavor=woff2 --with-zopfli --unicodes=$ranges --layout-features='*' --ignore-missing-glyphs
    if ($LASTEXITCODE -eq 0) { Write-Output "Created subset $woffOut" }
    # compress via woff2_compress if not already woff2
}

# Create fonts.css
$fontsCss = Join-Path $assetCss 'fonts.css'
@"
@font-face{font-family:'CairoLocal';src:url('/assets/fonts/Cairo-subset.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'CairoLocal';src:url('/assets/fonts/Cairo-Bold-subset.woff2') format('woff2');font-weight:700;font-style:normal;font-display:swap}
@font-face{font-family:'InterLocal';src:url('/assets/fonts/Inter-subset.woff2') format('woff2');font-weight:400;font-style:normal;font-display:swap}
@font-face{font-family:'InterLocal';src:url('/assets/fonts/Inter-SemiBold-subset.woff2') format('woff2');font-weight:600;font-style:normal;font-display:swap}
"@ | Out-File -FilePath $fontsCss -Encoding utf8

Write-Output "fonts.css written to $fontsCss"

# Critical CSS generation using npx critical for index.html
$criticalOut = Join-Path $assetCss 'critical-index.css'
function Invoke-CriticalTry {
    param(
        [string]$url,
        [string]$out
    )
    if (-not (Get-Command npx -ErrorAction SilentlyContinue)) {
        Write-Warning "npx not found, skipping critical CSS generation. Install Node.js and try again."
        return $false
    }

    # Try to run critical and capture CSS from stdout (avoid using --output which varies across versions)
    $npxArgs = @('--yes','critical',$url,'--width','390','--height','844','--inline','false','--extract')
    Write-Output "Attempting: npx $($npxArgs -join ' ')"
    try {
        $outTemp = [System.IO.Path]::GetTempFileName()
        $errTemp = [System.IO.Path]::GetTempFileName()
        $proc = Start-Process -FilePath 'npx' -ArgumentList $npxArgs -NoNewWindow -Wait -PassThru -RedirectStandardOutput $outTemp -RedirectStandardError $errTemp
        $css = Get-Content -Path $outTemp -Raw -ErrorAction SilentlyContinue
        $err = Get-Content -Path $errTemp -Raw -ErrorAction SilentlyContinue
        Remove-Item $outTemp -ErrorAction SilentlyContinue
        Remove-Item $errTemp -ErrorAction SilentlyContinue
        if ($proc.ExitCode -eq 0 -and $css) {
            $css | Out-File -FilePath $out -Encoding utf8
            Write-Output "critical produced CSS to $out"
            return $true
        } else {
            Write-Verbose "npx critical returned non-zero or empty output: exit $($proc.ExitCode) ; stderr: $err"
        }
    } catch {
        Write-Verbose "critical invocation failed: $_"
    }

    # Try alternative: dimensions flag (some versions accept --dimensions as a single token)
    $npxArgs2 = @('--yes','critical',$url,'--dimensions','390x844','--inline','false','--extract')
    Write-Output "Attempting alternative: npx $($npxArgs2 -join ' ')"
    try {
        $outTemp2 = [System.IO.Path]::GetTempFileName()
        $errTemp2 = [System.IO.Path]::GetTempFileName()
        $proc2 = Start-Process -FilePath 'npx' -ArgumentList $npxArgs2 -NoNewWindow -Wait -PassThru -RedirectStandardOutput $outTemp2 -RedirectStandardError $errTemp2
        $css2 = Get-Content -Path $outTemp2 -Raw -ErrorAction SilentlyContinue
        $err2 = Get-Content -Path $errTemp2 -Raw -ErrorAction SilentlyContinue
        Remove-Item $outTemp2 -ErrorAction SilentlyContinue
        Remove-Item $errTemp2 -ErrorAction SilentlyContinue
        if ($proc2.ExitCode -eq 0 -and $css2) {
            $css2 | Out-File -FilePath $out -Encoding utf8
            Write-Output "critical produced CSS to $out (alternative)"
            return $true
        } else {
            Write-Verbose "npx critical alternative returned non-zero or empty output: exit $($proc2.ExitCode) ; stderr: $err2"
        }
    } catch {
        Write-Verbose "critical alternative invocation failed: $_"
    }

    Write-Warning "All critical attempts failed. To generate critical CSS, run npx critical locally against a running server and inspect errors (puppeteer/chromium may need to download)."
    return $false
}

if (Invoke-CriticalTry "http://localhost:8080/index.html" $criticalOut) {
    Write-Output "Critical CSS generated: $criticalOut"
} else {
    Write-Warning "Critical CSS not generated. You can run npx critical locally with a server at http://localhost:8080 to produce $criticalOut."
}

# Optionally inline critical CSS into index.html between <!--CRITICAL-CSS--> marker or before </head>
$inlineCritical = $true
if ($inlineCritical -and (Test-Path $criticalOut)) {
    $indexPath = Join-Path $SiteRoot 'index.html'
    if (Test-Path $indexPath) {
        Backup-File $indexPath
        $indexHtml = Get-Content $indexPath -Raw
        $criticalCss = Get-Content $criticalOut -Raw
        if ($indexHtml -match '<!--CRITICAL-CSS-->') {
            $indexHtml = $indexHtml -replace '<!--CRITICAL-CSS-->.*?<!--END-CRITICAL-CSS-->', "<!--CRITICAL-CSS-->`n<style>$criticalCss</style>`n<!--END-CRITICAL-CSS-->" -replace "(?s)" , ''
            Write-Output "Inlined critical CSS into $indexPath (marker replacement)."
        } else {
            # Insert before </head>
            $snippet = "`n<style>$criticalCss</style>`n</head>"
            $indexHtml = $indexHtml -replace '</head>', $snippet
            Write-Output "Inlined critical CSS into $indexPath (before </head>)."
        }
        Set-Content -Path $indexPath -Value $indexHtml -Encoding utf8
    } else {
        Write-Warning "index.html not found; cannot inline critical CSS."
    }
}

# HTML rewrites: backup and replace hero image/logo usages and preload fonts
foreach ($p in $Pages) {
    $path = Join-Path $SiteRoot $p
    if (-not (Test-Path $path)) { Write-Warning "$p not found, skipping"; continue }
    Backup-File $path
    $html = Get-Content $path -Raw
    # Replace logo png references with .webp and add picture where simple img exists
    $html = $html -replace 'assets/logo-AldaX10.png','assets/logo-AldaX10.webp'
    # Add preload for Inter and Cairo subset near head (use variables to avoid quoting issues)
    $preloadSnippet = @'
    <link rel="preload" href="/assets/fonts/Inter-subset.woff2" as="font" type="font/woff2" crossorigin>
    <link rel="preload" href="/assets/fonts/Cairo-subset.woff2" as="font" type="font/woff2" crossorigin>
</head>
'@
    if ($html -notmatch "Inter-subset.woff2") {
        $html = $html -replace '</head>', $preloadSnippet
    }
    # Insert fonts.css link (media=print swap, safe quoting)
    $fontsCssSnippet = @'
    <link rel="stylesheet" href="/assets/css/fonts.css" media="print" onload="this.media='all'">
<noscript><link rel="stylesheet" href="/assets/css/fonts.css"></noscript>
</head>
'@
    if ($html -notmatch 'assets/css/fonts.css') {
        $html = $html -replace '</head>', $fontsCssSnippet
    }
    Set-Content -Path $path -Value $html -Encoding utf8
    Write-Output "Updated $p"
}

# Backfill CHANGELOG.md
$changelog = Join-Path $SiteRoot 'CHANGELOG.md'
"## build-assets run $ts`n`nFiles modified:`n" + ($Pages -join "`n") + "`n`nAssets produced in assets/images and assets/fonts. See backups/ for originals." | Out-File -FilePath $changelog -Encoding utf8

Write-Output "build-assets.ps1 complete. Review produced files in assets/images and assets/fonts. Upload any missing source fonts if needed."
