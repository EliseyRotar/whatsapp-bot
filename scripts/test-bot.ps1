# Bot Test Script (Windows PowerShell)
# Equivalent to scripts/test-bot.sh

Write-Host ""
Write-Host "🧪 Testing bot setup..." -ForegroundColor Cyan
Write-Host ""

$allPassed = $true

# Test 1: Node.js
Write-Host "1. Checking Node.js..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    Write-Host "   ✅ Node.js installed: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ Node.js not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 2: npm
Write-Host "2. Checking npm..." -ForegroundColor Yellow
try {
    $npmVersion = npm --version
    Write-Host "   ✅ npm installed: v$npmVersion" -ForegroundColor Green
} catch {
    Write-Host "   ❌ npm not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 3: Dependencies
Write-Host "3. Checking dependencies..." -ForegroundColor Yellow
if (Test-Path "node_modules") {
    Write-Host "   ✅ node_modules exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ node_modules not found (run: npm install)" -ForegroundColor Red
    $allPassed = $false
}

# Test 4: Configuration
Write-Host "4. Checking configuration..." -ForegroundColor Yellow
if (Test-Path ".env") {
    Write-Host "   ✅ .env file exists" -ForegroundColor Green
} else {
    Write-Host "   ❌ .env file not found" -ForegroundColor Red
    $allPassed = $false
}

# Test 5: Data directories
Write-Host "5. Checking data directories..." -ForegroundColor Yellow
$requiredDirs = @("data", "data\economy", "data\games", "data\groups")
$missingDirs = @()
foreach ($dir in $requiredDirs) {
    if (!(Test-Path $dir)) {
        $missingDirs += $dir
    }
}
if ($missingDirs.Count -eq 0) {
    Write-Host "   ✅ All data directories exist" -ForegroundColor Green
} else {
    Write-Host "   ⚠️  Missing directories: $($missingDirs -join ', ')" -ForegroundColor Yellow
    Write-Host "   Creating missing directories..." -ForegroundColor Cyan
    foreach ($dir in $missingDirs) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
    Write-Host "   ✅ Directories created" -ForegroundColor Green
}

# Test 6: Main files
Write-Host "6. Checking main files..." -ForegroundColor Yellow
$requiredFiles = @("index.js", "config.js", "package.json")
$missingFiles = @()
foreach ($file in $requiredFiles) {
    if (!(Test-Path $file)) {
        $missingFiles += $file
    }
}
if ($missingFiles.Count -eq 0) {
    Write-Host "   ✅ All main files exist" -ForegroundColor Green
} else {
    Write-Host "   ❌ Missing files: $($missingFiles -join ', ')" -ForegroundColor Red
    $allPassed = $false
}

# Test 7: Web dashboard
Write-Host "7. Checking web dashboard..." -ForegroundColor Yellow
if (Test-Path "web\server.js") {
    Write-Host "   ✅ Web dashboard files exist" -ForegroundColor Green
} else {
    Write-Host "   ❌ Web dashboard not found" -ForegroundColor Red
    $allPassed = $false
}

# Summary
Write-Host ""
Write-Host "═══════════════════════════════════════" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "✅ All tests passed!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Bot is ready to start!" -ForegroundColor Green
    Write-Host "Run: npm start" -ForegroundColor White
} else {
    Write-Host "❌ Some tests failed" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please fix the issues above before starting the bot" -ForegroundColor Yellow
}
Write-Host ""
