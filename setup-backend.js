const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up NotesHub Backend...');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, 'backend', '.env');
const envExamplePath = path.join(__dirname, 'backend', 'env.example');

if (!fs.existsSync(envPath) && fs.existsSync(envExamplePath)) {
  console.log('📝 Creating .env file from template...');
  const envContent = fs.readFileSync(envExamplePath, 'utf8');
  fs.writeFileSync(envPath, envContent);
  console.log('✅ .env file created');
} else if (fs.existsSync(envPath)) {
  console.log('✅ .env file already exists');
} else {
  console.log('❌ env.example not found');
}

// Create frontend .env.local if it doesn't exist
const frontendEnvPath = path.join(__dirname, 'frontend', '.env.local');
const frontendEnvExamplePath = path.join(__dirname, 'frontend', 'env.example');

if (!fs.existsSync(frontendEnvPath) && fs.existsSync(frontendEnvExamplePath)) {
  console.log('📝 Creating frontend .env.local file from template...');
  const envContent = fs.readFileSync(frontendEnvExamplePath, 'utf8');
  fs.writeFileSync(frontendEnvPath, envContent);
  console.log('✅ frontend .env.local file created');
} else if (fs.existsSync(frontendEnvPath)) {
  console.log('✅ frontend .env.local file already exists');
} else {
  console.log('❌ frontend env.example not found');
}

console.log('\n📋 Next steps:');
console.log('1. cd backend');
console.log('2. npm install');
console.log('3. npx prisma generate');
console.log('4. npx prisma migrate dev');
console.log('5. npm run seed');
console.log('6. npm run dev');
console.log('\n7. In another terminal:');
console.log('   cd frontend');
console.log('   npm install');
console.log('   npm run dev');
console.log('\n🔑 Admin credentials:');
console.log('   Email: admin@noteshub.com');
console.log('   Password: admin123');
console.log('\n💳 Razorpay Test Card:');
console.log('   Card Number: 4111 1111 1111 1111');
console.log('   Expiry: Any future date');
console.log('   CVV: Any 3 digits');
console.log('   Name: Any name'); 