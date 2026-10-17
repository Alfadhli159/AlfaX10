<#
Undo helper for build-assets.ps1

Usage:
  .\tools\undo-build-assets.ps1           # lists available most-recent backups for pages
  .\tools\undo-build-assets.ps1 --restore index.html  # restore the latest backup for index.html

This script is conservative: by default it only lists backups. Use --restore to restore a
single page from the latest timestamped backup found in backups/.
#>

param(
    [switch]$Restore,
    [string]$File
)

# Defensive cleanup of legacy Check-Tool to avoid unapproved-verb warnings
if (Get-Command -Name 'Check-Tool' -ErrorAction SilentlyContinue) {
    Write-Output "Removing legacy Check-Tool to avoid unapproved-verb warnings"
    Remove-Item -Path "Function:\Check-Tool" -ErrorAction SilentlyContinue
    Remove-Item -Path "Alias:\Check-Tool" -ErrorAction SilentlyContinue
}

$siteRoot = (Get-Location).Path
$backupsDir = Join-Path $siteRoot 'backups'

if (-not (Test-Path $backupsDir)) {
    Write-Output "No backups directory found at $backupsDir"
    exit 0
}

function Get-LatestBackupFor($name) {
    $pattern = "$name.*.bak"
    $candidates = Get-ChildItem -Path $backupsDir -Filter $pattern -File -ErrorAction SilentlyContinue | Sort-Object LastWriteTime -Descending
    return $candidates | Select-Object -First 1
}

$pages = @('index.html','cookie-policy.html','privacy-policy.html','terms-of-service.html')

Write-Output "Available latest backups:"
foreach ($p in $pages) {
    $b = Get-LatestBackupFor $p
    if ($b) {
        Write-Output " - $p -> $($b.Name) (created: $($b.LastWriteTime))"
    } else {
        Write-Output " - $p -> (no backup found)"
    }
}

if ($Restore) {
    if (-not $File) {
        Write-Error "To restore, provide --restore <filename> (e.g. index.html)"
        exit 2
    }
    $latest = Get-LatestBackupFor $File
    if (-not $latest) {
        Write-Error "No backup found for $File"
        exit 2
    }
    $dst = Join-Path $siteRoot $File
    Write-Output "Restoring $($latest.FullName) -> $dst"
    Copy-Item -Path $latest.FullName -Destination $dst -Force
    Write-Output "Restored. Consider re-running build-assets.ps1 after verification."
}
