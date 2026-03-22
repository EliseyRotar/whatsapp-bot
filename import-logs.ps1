# Import Historical Data Script (Windows PowerShell)
# Equivalent to import-logs.sh

Write-Host ""
Write-Host "📊 Import Historical Data from Logs" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if import script exists
if (!(Test-Path "scripts\import-historical-data.js")) {
    Write-Host "❌ Import script not found: scripts\import-historical-data.js" -ForegroundColor Red
    exit 1
}

# Check if log files exist
$logFiles = @("bot.log", "bot-console.log")
$foundLogs = @()

foreach ($log in $logFiles) {
    if (Test-Path $log) {
        $size = (Get-Item $log).Length / 1KB
        Write-Host "✅ Found: $log ($([math]::Round($size, 2)) KB)" -ForegroundColor Green
        $foundLogs += $log
    } else {
        Write-Host "⚠️  Not found: $log" -ForegroundColor Yellow
    }
}

if ($foundLogs.Count -eq 0) {
    Write-Host ""
    Write-Host "❌ No log files found to import" -ForegroundColor Red
    Write-Host "   The bot needs to run first to generate logs" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "🚀 Starting import..." -ForegroundColor Cyan
Write-Host ""

# Run import script
node scripts\import-historical-data.js

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Import complete!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Yellow
    Write-Host "1. Restart bot: npm start" -ForegroundColor White
    Write-Host "2. Open dashboard: http://localhost:3000" -ForegroundColor White
    Write-Host "3. Check analytics for historical data" -ForegroundColor White
    Write-Host ""
} else {
    Write-Host ""
    Write-Host "❌ Import failed" -ForegroundColor Red
    exit 1
}
