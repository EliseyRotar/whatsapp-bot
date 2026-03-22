# WhatsApp Bot Dashboard Setup Script (Windows PowerShell)
# Equivalent to setup-dashboard.sh

Write-Host ""
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║   WhatsApp Bot Dashboard Setup        ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

# Check if Node.js is installed
Write-Host "🔍 Checking prerequisites..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "✅ Node.js: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js not found. Please install Node.js first." -ForegroundColor Red
    Write-Host "   Download from: https://nodejs.org/" -ForegroundColor Yellow
    exit 1
}

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "✅ npm: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ npm not found" -ForegroundColor Red
    exit 1
}

Write-Host ""

# Install dependencies
Write-Host "📦 Installing dependencies..." -ForegroundColor Cyan
npm install
if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
    exit 1
}
Write-Host "✅ Dependencies installed" -ForegroundColor Green
Write-Host ""

# Create data directories
Write-Host "📁 Creating data directories..." -ForegroundColor Cyan
$directories = @(
    "data",
    "data\economy",
    "data\games",
    "data\groups",
    "data\config",
    "data\backups",
    "data\migrations"
)

foreach ($dir in $directories) {
    if (!(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
        Write-Host "  ✓ Created: $dir" -ForegroundColor Gray
    } else {
        Write-Host "  ✓ Exists: $dir" -ForegroundColor Gray
    }
}
Write-Host "✅ Data directories ready" -ForegroundColor Green
Write-Host ""

# Check .env file
Write-Host "⚙️  Checking configuration..." -ForegroundColor Cyan
if (!(Test-Path ".env")) {
    if (Test-Path ".env.example") {
        Copy-Item ".env.example" ".env"
        Write-Host "✅ Created .env from template" -ForegroundColor Green
        Write-Host "⚠️  Please edit .env with your settings!" -ForegroundColor Yellow
    } else {
        Write-Host "⚠️  .env.example not found" -ForegroundColor Yellow
    }
} else {
    Write-Host "✅ .env file exists" -ForegroundColor Green
}
Write-Host ""

# Summary
Write-Host "╔════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║         Setup Complete! ✨             ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Yellow
Write-Host "1. Edit .env file with your settings" -ForegroundColor White
Write-Host "2. Run: npm start" -ForegroundColor White
Write-Host "3. Scan QR code with WhatsApp" -ForegroundColor White
Write-Host "4. Open dashboard: http://localhost:3000" -ForegroundColor White
Write-Host ""
Write-Host "Default dashboard login:" -ForegroundColor Cyan
Write-Host "  Username: admin" -ForegroundColor White
Write-Host "  Password: (set in .env WEB_PASSWORD)" -ForegroundColor White
Write-Host ""
