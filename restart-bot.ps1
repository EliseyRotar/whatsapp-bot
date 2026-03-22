# WhatsApp Bot Restart Script (Windows PowerShell)
# Equivalent to restart-bot.sh

Write-Host ""
Write-Host "🔄 Restarting WhatsApp Bot..." -ForegroundColor Cyan
Write-Host ""

# Find and kill existing node processes running the bot
Write-Host "⏹️  Stopping existing bot processes..." -ForegroundColor Yellow
$processes = Get-Process node -ErrorAction SilentlyContinue | Where-Object {
    $_.Path -like "*node.exe*" -and $_.CommandLine -like "*index.js*"
}

if ($processes) {
    $processes | Stop-Process -Force
    Write-Host "✅ Stopped $($processes.Count) process(es)" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No running bot processes found" -ForegroundColor Gray
}

# Wait a moment for cleanup
Start-Sleep -Seconds 2

# Start bot
Write-Host ""
Write-Host "🚀 Starting bot..." -ForegroundColor Green
Write-Host ""

# Start the bot
npm start
