$profiles = @($profile.CurrentUserCurrentHost, $profile.CurrentUserAllHosts, $profile.AllUsersCurrentHost, $profile.AllUsersAllHosts)
Write-Output "Checking PowerShell profiles for 'Test-Tool'..."
foreach ($p in $profiles) {
    Write-Output "Profile: $p"
    if (Test-Path $p) {
    Select-String -Path $p -Pattern 'Test-Tool' -SimpleMatch -ErrorAction SilentlyContinue | ForEach-Object { "$($_.Path):$($_.LineNumber): $($_.Line)" }
    } else {
        Write-Output "  (not present)"
    }
}

Write-Output "\nChecking installed modules for an exported 'Test-Tool' command..."
## Ensure any session-level function named 'Check-Tool' is removed to avoid unapproved-verb warnings
if (Get-Command -Name 'Check-Tool' -ErrorAction SilentlyContinue) {
    $sc = Get-Command -Name 'Check-Tool' -ErrorAction SilentlyContinue
    if ($sc -and $sc.CommandType -eq 'Function') {
        Write-Output "Removing session function 'Check-Tool' detected during profile check."
        try { Remove-Item "Function:\Check-Tool" -ErrorAction SilentlyContinue } catch { }
    }
}

## Check installed modules for an exported 'Test-Tool' command
Write-Output "\nChecking installed modules for an exported 'Test-Tool' command..."
$modulesWithTestTool = @(Get-Module -ListAvailable | ForEach-Object {
    $module = $_
    $cmds = Get-Command -Module $module.Name -ErrorAction SilentlyContinue | Where-Object { $_.Name -eq 'Test-Tool' }
    if ($cmds) {
        $cmds | ForEach-Object { 
            Write-Output "Found in module: $($module.Name) -> $($_.Source)"
            $_  # Output the command to be collected in array
        }
    }
})

if ($modulesWithTestTool.Count -eq 0) { 
    Write-Output "No Test-Tool command exported by installed modules" 
}

## Also report if a session-level Check-Tool still exists (shouldn't after removal above)
$sessionCheck = Get-Command -Name 'Check-Tool' -ErrorAction SilentlyContinue
if ($sessionCheck) { Write-Output "Session-level Check-Tool still present: $($sessionCheck.Name) ($($sessionCheck.CommandType))" } else { Write-Output "No session-level Check-Tool command found" }
