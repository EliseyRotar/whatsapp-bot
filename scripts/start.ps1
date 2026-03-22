# WhatsApp Bot Starter Script (Windows PowerShell)
# Equivalent to scripts/start.sh

Write-Host ""
Write-Host "🤖 WhatsApp Bot Starter" -ForegroundColor Cyan
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found" -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if .env exists
if (!(Test-Path ".env")) {
    Write-Host "⚠️  .env file not found" -ForegroundColor Yellow
    if (Test-Path ".env.example") {
        Write-Host "   Creating .env from template..." -ForegroundColor Cyan
        Copy-Item ".env.example" ".env"
        Write-Host "   ✅ Created .env" -ForegroundColor Green
        Write-Host "   ⚠️  Please edit .env with your settings before starting!" -ForegroundColor Yellow
        Write-Host ""
        exit 0
    } else {
        Write-Host "   ❌ .env.example not found" -ForegroundColor Red
        exit 1
    }
}

# Check if node_modules exists
if (!(Test-Path "node_modules")) {
    Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
}

# Create data directories if they don't exist
$directories = @("data", "data\economy", "data\games", "data\groups", "data\config", "data\backups")
foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

Write-Host ""
Write-Host "🚀 Starting WhatsApp Bot..." -ForegroundColor Green
Write-Host ""

# Start the bot
npm start
