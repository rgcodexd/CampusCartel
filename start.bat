@echo off
cd /d "%~dp0"

echo [INFO] Starting backend in a new terminal...
start "Backend" cmd /k "npm run dev -w backend"

echo [INFO] Starting frontend in a new terminal...
start "Frontend" cmd /k "npm run dev -w frontend"

echo [INFO] Both services started in separate windows!
