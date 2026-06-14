#!/usr/bin/env node
/* eslint-disable no-console */

// Check that all required modules can be loaded
const requiredModules = [
  'express',
  'cors',
  'helmet',
  'morgan',
  'dotenv',
  'meilisearch',
  'jsonwebtoken',
];

console.log('🔍 Checking framework dependencies...\n');

let allGood = true;
for (const mod of requiredModules) {
  try {
    // Use dynamic import to check ES modules
    await import(mod);
    console.log(`✅ ${mod}`);
  } catch (err) {
    console.error(`❌ ${mod} - ${err.message}`);
    allGood = false;
  }
}

if (!allGood) {
  console.error('\n⚠️  Some dependencies failed to load.');
  console.error('Run: npm install');
  process.exit(1);
}

console.log('\n✅ All dependencies loaded successfully!');
console.log('\n📊 Framework Status: SOLID\n');

// Show next steps
console.log('Next steps:');
console.log('  npm run dev      - Start development server');
console.log('  npm test         - Run test suite');
console.log('  npm run lint     - Check code quality');
console.log('\n📚 See DEVELOPMENT.md for more info.');
