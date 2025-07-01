@echo off
echo.
echo ========================================
echo    Glucose Tracker - Mobile Access
echo ========================================
echo.
echo Starting server for mobile access...
echo.
echo Your app will be available at:
echo http://192.168.1.137:3000
echo.
echo To access on your phone:
echo 1. Make sure your phone is on the same WiFi
echo 2. Open browser and go to the URL above
echo 3. Or visit: http://localhost:3000/qr.html
echo.
echo Press Ctrl+C to stop the server
echo.
set HOST=0.0.0.0
call npm start 