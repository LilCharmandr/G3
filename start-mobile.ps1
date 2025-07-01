Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "    Glucose Tracker - Mobile Access" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Starting server for mobile access..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Your app will be available at:" -ForegroundColor Green
Write-Host "http://192.168.1.137:3000" -ForegroundColor White
Write-Host ""
Write-Host "To access on your phone:" -ForegroundColor Green
Write-Host "1. Make sure your phone is on the same WiFi" -ForegroundColor White
Write-Host "2. Open browser and go to the URL above" -ForegroundColor White
Write-Host "3. Or visit: http://localhost:3000/qr.html" -ForegroundColor White
Write-Host ""
Write-Host "Press Ctrl+C to stop the server" -ForegroundColor Yellow
Write-Host ""

$env:HOST = "0.0.0.0"
npm start 