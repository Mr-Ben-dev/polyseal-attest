#!/usr/bin/env node

/**
 * Validation script for Polyseal API and CORS changes
 * Tests the new relative API paths and CORS configuration
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
  bold: '\x1b[1m'
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function checkFile(filePath, description) {
  const exists = fs.existsSync(filePath);
  if (exists) {
    log(`✅ ${description}: ${filePath}`, colors.green);
    return true;
  } else {
    log(`❌ ${description}: ${filePath}`, colors.red);
    return false;
  }
}

function checkFileContent(filePath, pattern, description) {
  if (!fs.existsSync(filePath)) {
    log(`❌ File not found: ${filePath}`, colors.red);
    return false;
  }
  
  const content = fs.readFileSync(filePath, 'utf8');
  const matches = content.match(pattern);
  
  if (matches) {
    log(`✅ ${description}: Found ${matches.length} occurrence(s)`, colors.green);
    return true;
  } else {
    log(`❌ ${description}: Pattern not found`, colors.red);
    return false;
  }
}

function validateAPIChanges() {
  log('\n🔍 Validating API and CORS Changes', colors.bold + colors.blue);
  log('='.repeat(50), colors.blue);
  
  let allPassed = true;
  
  // Check CORS file exists and has new implementation
  log('\n📁 Checking CORS Implementation:', colors.yellow);
  allPassed &= checkFile('api/_lib/cors.ts', 'CORS middleware file');
  allPassed &= checkFileContent(
    'api/_lib/cors.ts', 
    /ALLOWED_ORIGINS[\s\S]*split[\s\S]*map[\s\S]*trim[\s\S]*filter/,
    'Multi-origin CORS support'
  );
  
  // Check environment configuration
  log('\n🔧 Checking Environment Configuration:', colors.yellow);
  allPassed &= checkFile('.env.example', 'Environment example file');
  allPassed &= checkFileContent(
    '.env.example',
    /ALLOWED_ORIGINS=/,
    'ALLOWED_ORIGINS variable'
  );
  allPassed &= checkFileContent(
    '.env.example',
    /https:\/\/rpc-amoy\.polygon\.technology(?!\/)/,
    'RPC URL without trailing slash'
  );
  
  // Check that VITE_SERVER_URL is removed
  log('\n🗑️  Checking Removed Variables:', colors.yellow);
  const hasServerUrl = checkFileContent(
    '.env.example',
    /VITE_SERVER_URL=/,
    'VITE_SERVER_URL removal (should fail)'
  );
  if (!hasServerUrl) {
    log(`✅ VITE_SERVER_URL successfully removed`, colors.green);
    allPassed &= true;
  } else {
    allPassed = false;
  }
  
  // Check API calls use relative paths
  log('\n🌐 Checking API Call Patterns:', colors.yellow);
  allPassed &= checkFileContent(
    'src/pages/Attestations.tsx',
    /fetch\s*\(\s*['"`]\/api\/eas\//,
    'Relative API path in Attestations'
  );
  allPassed &= checkFileContent(
    'src/pages/Contact.tsx',
    /fetch\s*\(\s*['"`]\/api\/contact/,
    'Relative API path in Contact'
  );
  
  // Check ENV.SERVER usage is removed
  const hasEnvServer = checkFileContent(
    'src/lib/env.ts',
    /SERVER.*VITE_SERVER_URL/,
    'ENV.SERVER removal (should fail)'
  );
  if (!hasEnvServer) {
    log(`✅ ENV.SERVER successfully removed from env.ts`, colors.green);
    allPassed &= true;
  } else {
    allPassed = false;
  }
  
  // Check reference documentation
  log('\n📚 Checking Documentation:', colors.yellow);
  allPassed &= checkFile('docs/REFERENCES.md', 'Reference documentation');
  allPassed &= checkFileContent(
    'docs/REFERENCES.md',
    /API & CORS Configuration/,
    'Updated documentation section'
  );
  
  // Check test files
  log('\n🧪 Checking Test Files:', colors.yellow);
  allPassed &= checkFile('test-cors.js', 'CORS test script');
  
  // Final result
  log('\n📊 Validation Results:', colors.bold + colors.blue);
  log('='.repeat(50), colors.blue);
  
  if (allPassed) {
    log('🎉 All validations passed! API and CORS changes are ready.', colors.bold + colors.green);
    log('\n📋 Next steps:', colors.yellow);
    log('  1. Set ALLOWED_ORIGINS in production environment');
    log('  2. Deploy to Vercel and test CORS with browser dev tools');
    log('  3. Verify API calls work from both localhost and production');
    return 0;
  } else {
    log('❌ Some validations failed. Please review the output above.', colors.bold + colors.red);
    return 1;
  }
}

// Run validation if this script is executed directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  process.exit(validateAPIChanges());
}

export { validateAPIChanges };
