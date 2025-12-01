@echo off
REM RxCompass.AI Frontend Setup Script for Windows
REM This script sets up the project for any developer who clones the repo

echo 🚀 Setting up RxCompass.AI Frontend...

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed. Please install Node.js v18 or higher.
    echo 📥 Download from: https://nodejs.org/
    pause
    exit /b 1
)

echo ✅ Node.js detected

REM Install dependencies
echo 📦 Installing dependencies...
npm install

if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies
    pause
    exit /b 1
)

REM Create environment file if it doesn't exist
if not exist .env (
    echo 📝 Creating environment file...
    copy .env.example .env
    echo ⚠️  Please edit .env file and set your VITE_API_URL
) else (
    echo ✅ Environment file already exists
)

echo.
echo 🎉 Setup completed successfully!
echo.
echo 📋 Next steps:
echo 1. Edit .env file and set your VITE_API_URL
echo 2. Start your backend server
echo 3. Run: npm run dev
echo 4. Open: http://localhost:8080
echo.
echo 📚 For more info, check README.md
pause
