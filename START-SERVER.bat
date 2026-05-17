@echo off
title MOE Exam Practice Platform - Server
color 0A
echo.
echo  =====================================================
echo   MOE EXAM PRACTICE PLATFORM
echo   Starting server... Please wait.
echo  =====================================================
echo.

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    color 0C
    echo  ERROR: Node.js is not installed!
    echo.
    echo  Please download and install Node.js from:
    echo  https://nodejs.org
    echo  Choose the LTS version
    echo.
    pause
    exit
)

:: Install express if not already installed
if not exist "node_modules" (
    echo  Installing required files for first time...
    npm install
    echo.
)

:: Start the server
echo  Server is starting...
echo  Do NOT close this window while students are using the platform.
echo.
node server.js

pause
