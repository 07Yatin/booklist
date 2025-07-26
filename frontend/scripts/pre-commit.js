#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔍 Running pre-commit checks...');

// Check for ESLint errors
try {
  console.log('📝 Checking ESLint...');
  execSync('npm run lint:check', { stdio: 'inherit' });
  console.log('✅ ESLint passed');
} catch (error) {
  console.error('❌ ESLint failed. Please fix the issues before committing.');
  process.exit(1);
}

// Check for console statements in production code
console.log('🔍 Checking for console statements...');
const srcDir = path.join(__dirname, '..', 'src');
const files = getAllFiles(srcDir, '.js');

let hasConsoleStatements = false;
files.forEach(file => {
  const content = fs.readFileSync(file, 'utf8');
  if (content.includes('console.')) {
    console.warn(`⚠️  Console statement found in: ${path.relative(process.cwd(), file)}`);
    hasConsoleStatements = true;
  }
});

if (hasConsoleStatements) {
  console.warn('⚠️  Console statements found. Consider removing them for production.');
}

// Check for unused imports
console.log('🔍 Checking for unused imports...');
try {
  execSync('npx eslint src --ext .js,.jsx --rule "unused-imports/no-unused-imports: error"', { stdio: 'inherit' });
  console.log('✅ No unused imports found');
} catch (error) {
  console.error('❌ Unused imports found. Please remove them before committing.');
  process.exit(1);
}

console.log('✅ All pre-commit checks passed!');

function getAllFiles(dir, ext) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  items.forEach(item => {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getAllFiles(fullPath, ext));
    } else if (item.endsWith(ext)) {
      files.push(fullPath);
    }
  });
  
  return files;
} 