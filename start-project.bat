@echo off
setlocal EnableExtensions

cd /d "%~dp0"

set "NPM_CMD="

if exist "%ProgramFiles%\nodejs\npm.cmd" set "NPM_CMD=%ProgramFiles%\nodejs\npm.cmd"
if not defined NPM_CMD if exist "%ProgramFiles(x86)%\nodejs\npm.cmd" set "NPM_CMD=%ProgramFiles(x86)%\nodejs\npm.cmd"
if not defined NPM_CMD if exist "%LocalAppData%\Programs\nodejs\npm.cmd" set "NPM_CMD=%LocalAppData%\Programs\nodejs\npm.cmd"
if not defined NPM_CMD for %%I in (npm.cmd) do set "NPM_CMD=%%~$PATH:I"

if not defined NPM_CMD (
  echo [ERROR] npm.cmd was not found.
  echo Install Node.js LTS from https://nodejs.org and run this file again.
  exit /b 1
)

for %%P in ("%NPM_CMD%") do set "NODE_DIR=%%~dpP"
set "PATH=%NODE_DIR%;%PATH%"

if not exist "frontend\.env.local" (
  if exist "frontend\.env.example" (
    copy /Y "frontend\.env.example" "frontend\.env.local" >nul
    echo [INFO] Created frontend\.env.local from example.
  )
)

if not exist "backend\.env" (
  if exist "backend\.env.example" (
    copy /Y "backend\.env.example" "backend\.env" >nul
    echo [INFO] Created backend\.env from example.
  )
)

echo [INFO] Using npm at: %NPM_CMD%
echo [INFO] Using node directory: %NODE_DIR%
echo [INFO] Installing dependencies...
call "%NPM_CMD%" install
if errorlevel 1 (
  echo [ERROR] npm install failed.
  exit /b 1
)

echo [INFO] Starting frontend + backend...
call "%NPM_CMD%" run dev
exit /b %errorlevel%
