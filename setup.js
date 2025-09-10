#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Setting up Employee Management System...\n');

// Check if Node.js is installed
try {
  const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
  console.log(`✅ Node.js version: ${nodeVersion}`);
} catch (error) {
  console.error('❌ Node.js is not installed. Please install Node.js v16 or higher.');
  process.exit(1);
}

// Check if MongoDB is running
try {
  execSync('mongosh --version', { encoding: 'utf8' });
  console.log('✅ MongoDB is available');
} catch (error) {
  console.log('⚠️  MongoDB might not be installed or running. Please ensure MongoDB is installed and running.');
}

// Setup backend
console.log('\n📦 Setting up backend...');
try {
  process.chdir('backend');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Backend dependencies installed');
  
  // Create .env file if it doesn't exist
  const envPath = '.env';
  if (!fs.existsSync(envPath)) {
    const envContent = `PORT=5000
MONGODB_URI=mongodb://localhost:27017/employee_management
JWT_SECRET=your_jwt_secret_key_here_${Date.now()}
NODE_ENV=development
FRONTEND_URL=http://localhost:5173`;
    
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Environment file created');
  }
  
  process.chdir('..');
} catch (error) {
  console.error('❌ Backend setup failed:', error.message);
  process.exit(1);
}

// Setup frontend
console.log('\n📦 Setting up frontend...');
try {
  process.chdir('frontend');
  execSync('npm install', { stdio: 'inherit' });
  console.log('✅ Frontend dependencies installed');
  process.chdir('..');
} catch (error) {
  console.error('❌ Frontend setup failed:', error.message);
  process.exit(1);
}

console.log('\n🎉 Setup completed successfully!');
console.log('\n📋 Next steps:');
console.log('1. Make sure MongoDB is running');
console.log('2. Start the backend server:');
console.log('   cd backend && npm run dev');
console.log('3. Start the frontend server:');
console.log('   cd frontend && npm run dev');
console.log('4. Open http://localhost:5173 in your browser');
console.log('\n📚 For more information, check the README.md file');
