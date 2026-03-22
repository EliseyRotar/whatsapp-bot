# WhatsApp Bot Session Fix Script (Windows PowerShell)
# Equivalent to fix-session.sh

Write-Host ""
Write-Host "🔧 WhatsApp Bot Session Fix" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if auth_info exists
if (Test-Path "auth_info") {
    Write-Host "📁 Found existing session data" -ForegroundColor Yellow
    Write-Host ""
    
    # Create backup
    $timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
    $backupName = "auth_info_backup_$timestamp"
    
    Write-Host "💾 Creating backup..." -ForegroundColor Cyan
    Copy-Item -Path "auth_info" -Destination $backupName -Recurse -Force
    Write-Host "✅ Backup created: $backupName" -ForegroundColor Green
    Write-Host ""
    
    # Remove current session
    Write-Host "🗑️  Removing current session..." -ForegroundColor Yellow
    Remove-Item -Path "auth_info" -Recurse -Force
    Write-Host "✅ Session cleared" -ForegroundColor Green
} else {
    Write-Host "ℹ️  No existing session found" -ForegroundColor Gray
}

Write-Host ""
Write-Host "✨ Session fix complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Run: npm start" -ForegroundColor White
Write-Host "2. Scan QR code with WhatsApp mobile app" -ForegroundColor White
Write-Host "3. Bot will create new session" -ForegroundColor White
Write-Host ""
