Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Glucose Tracker - Server Status" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Check if port 3000 is in use
$portCheck = netstat -ano | findstr :3000

if ($portCheck) {
    Write-Host "✅ Server is running!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Access URLs:" -ForegroundColor Yellow
    Write-Host "• Local: http://localhost:3000" -ForegroundColor White
    Write-Host "• Mobile: http://192.168.1.137:3000" -ForegroundColor White
    Write-Host "• QR Code: http://localhost:3000/qr.html" -ForegroundColor White
    Write-Host ""
    Write-Host "📱 Mobile Instructions:" -ForegroundColor Yellow
    Write-Host "1. Make sure your phone is on the same WiFi network" -ForegroundColor White
    Write-Host "2. Open browser and go to: http://192.168.1.137:3000" -ForegroundColor White
    Write-Host "3. Add to home screen for app-like experience" -ForegroundColor White
} else {
    Write-Host "❌ Server is not running" -ForegroundColor Red
    Write-Host ""
    Write-Host "To start the server:" -ForegroundColor Yellow
    Write-Host "• Run: .\start-mobile.ps1" -ForegroundColor White
    Write-Host "• Or: .\start-mobile.bat" -ForegroundColor White
    Write-Host "• Or: npm start" -ForegroundColor White
}

Write-Host "" 