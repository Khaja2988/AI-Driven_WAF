@echo off
echo Starting AI Security Suite...
echo.

echo Starting Backend Server...
cd back\ai-security-suite
start "Backend Server" cmd /k "mvnw.cmd spring-boot:run"

echo Waiting for backend to start...
timeout /t 10 /nobreak >nul

echo Starting Frontend Server...
cd ..\..\front\frontend
start "Frontend Server" cmd /k "npm run dev"

echo.
echo Both servers are starting...
echo Backend: http://localhost:8081
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause >nul
