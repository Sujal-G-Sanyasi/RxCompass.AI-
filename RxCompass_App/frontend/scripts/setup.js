// RxCompass.AI Frontend Setup Script (Cross-platform)
// This script sets up the project for any developer who clones the repo

const fs = require('fs');
const path = require('path');
const { execSync, spawn } = require('child_process');

console.log('🚀 Setting up RxCompass.AI Frontend...');

// Check Node.js version
function checkNodeVersion() {
  try {
    const nodeVersion = process.version;
    const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
    
    if (majorVersion < 18) {
      console.log('❌ Node.js version is too old. Please install v18 or higher.');
      console.log('📥 Download from: https://nodejs.org/');
      process.exit(1);
    }
    
    console.log(`✅ Node.js ${nodeVersion} detected`);
  } catch (error) {
    console.log('❌ Could not detect Node.js version');
    process.exit(1);
  }
}

// Install dependencies
function installDependencies() {
  console.log('📦 Installing dependencies...');
  
  try {
    execSync('npm install', { stdio: 'inherit' });
    console.log('✅ Dependencies installed successfully');
  } catch (error) {
    console.log('❌ Failed to install dependencies');
    process.exit(1);
  }
}

// Create environment file
function setupEnvironment() {
  const envPath = path.join(process.cwd(), '.env');
  const envExamplePath = path.join(process.cwd(), '.env.example');
  
  if (!fs.existsSync(envPath)) {
    if (fs.existsSync(envExamplePath)) {
      fs.copyFileSync(envExamplePath, envPath);
      console.log('📝 Created .env file from .env.example');
      console.log('⚠️  Please edit .env file and set your VITE_API_URL');
    } else {
      console.log('⚠️  .env.example not found, creating basic .env file');
      fs.writeFileSync(envPath, 'VITE_API_URL=http://localhost:5000\n');
    }
  } else {
    console.log('✅ .env file already exists');
  }
}

// Check backend connectivity (optional)
function checkBackend() {
  console.log('🔍 Checking backend connectivity...');
  
  try {
    const http = require('http');
    const req = http.request('http://localhost:5000', (res) => {
      if (res.statusCode < 400) {
        console.log('✅ Backend is running on localhost:5000');
      } else {
        console.log('⚠️  Backend returned status code:', res.statusCode);
      }
    });
    
    req.on('error', () => {
      console.log('⚠️  Backend is not running on localhost:5000');
      console.log('💡 Make sure to start your backend server before running the app');
    });
    
    req.setTimeout(2000, () => {
      req.destroy();
      console.log('ℹ️  Backend check timed out (this is normal if backend is not running)');
    });
    
    req.end();
  } catch (error) {
    console.log('ℹ️  Skipping backend check');
  }
}

// Main setup function
function runSetup() {
  checkNodeVersion();
  installDependencies();
  setupEnvironment();
  checkBackend();
  
  console.log('\n🎉 Setup completed successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Edit .env file and set your VITE_API_URL');
  console.log('2. Start your backend server');
  console.log('3. Run: npm run dev');
  console.log('4. Open: http://localhost:8080');
  console.log('\n📚 For more info, check README.md');
}

// Run setup
runSetup();
