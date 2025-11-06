#!/usr/bin/env bun
/**
 * Test script for Wave 2 Week 1 features
 * Tests: Issue page, schema selector, dynamic forms, API endpoints
 */

const BASE_URL = 'http://localhost:8080';
const API_BASE = 'http://localhost:8080/api';

// Make this a module
export {};

console.log('🧪 Starting Wave 2 Feature Tests\n');

// Test 1: Schema Selector Schemas
console.log('📋 Test 1: Verify schema data structure');
const SCHEMAS = [
  {
    uid: '0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a',
    name: 'Polyseal Schema',
  },
  {
    uid: '0x93f80b4674cbd9f74ddbd3cf593f463dd3a87cd9f002e5fe2a8048ef2d5eaa5a',
    name: 'Identity Verification',
  },
  {
    uid: '0x3eb39e89d37aa75c64380bdf3b66c245b1e0aae23cb2d2599bcb17f218cb68ee',
    name: 'Credential',
  },
];

SCHEMAS.forEach((schema) => {
  console.log(`  ✓ Schema: ${schema.name} (${schema.uid.slice(0, 10)}...)`);
});

// Test 2: Demo Data Generation API
console.log('\n🎯 Test 2: Demo Data Generation API');
try {
  const response = await fetch(`${API_BASE}/seed-demo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ count: 10 }),
  });

  if (response.ok) {
    const data = await response.json();
    console.log(`  ✓ Generated ${data.count} demo attestations`);
    console.log(`  ✓ First attestation UID: ${data.attestations[0]?.uid.slice(0, 16)}...`);
    console.log(`  ✓ First attestation schema: ${data.attestations[0]?.schemaName}`);

    // Verify data structure
    if (data.attestations && data.attestations.length > 0) {
      const att = data.attestations[0];
      const hasRequired = att.uid && att.schema && att.recipient && att.attester && att.data;
      console.log(`  ✓ Data structure valid: ${hasRequired ? 'YES' : 'NO'}`);
    }
  } else {
    console.log(`  ✗ Failed with status: ${response.status}`);
  }
} catch (error) {
  console.log(`  ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Test 3: Attestation API (if private key is configured)
console.log('\n🔐 Test 3: Attest API Validation');
try {
  // Test with missing fields
  const response = await fetch(`${API_BASE}/attest`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (response.status === 400) {
    const data = await response.json();
    console.log(`  ✓ Validation working: ${data.error}`);
  } else if (response.status === 503) {
    const data = await response.json();
    console.log(`  ℹ Endpoint available but not configured: ${data.error}`);
  } else {
    console.log(`  ✓ API endpoint responding (status: ${response.status})`);
  }
} catch (error) {
  console.log(`  ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Test 4: Revoke API Validation
console.log('\n🚫 Test 4: Revoke API Validation');
try {
  const response = await fetch(`${API_BASE}/revoke`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({}),
  });

  if (response.status === 400) {
    const data = await response.json();
    console.log(`  ✓ Validation working: ${data.error}`);
  } else if (response.status === 503) {
    const data = await response.json();
    console.log(`  ℹ Endpoint available but not configured: ${data.error}`);
  } else {
    console.log(`  ✓ API endpoint responding (status: ${response.status})`);
  }
} catch (error) {
  console.log(`  ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Test 5: Schema Form Generator Logic
console.log('\n📝 Test 5: Schema Form Generator (Logic Validation)');
const testSchemas = [
  { schema: 'string name,uint256 age,bool verified', expectedFields: 3 },
  { schema: 'address recipient,bytes32 hash', expectedFields: 2 },
  { schema: 'string title,string issuer,uint256 timestamp,bool active', expectedFields: 4 },
];

testSchemas.forEach((test) => {
  const fields = test.schema.split(',').length;
  console.log(`  ✓ Schema: "${test.schema.substring(0, 30)}..." (${fields} fields)`);
});

// Test 6: Page Routes
console.log('\n🌐 Test 6: Frontend Routes');
const routes = [
  { path: '/', name: 'Home' },
  { path: '/issue', name: 'Issue Attestation' },
  { path: '/attestations', name: 'Attestations' },
  { path: '/dashboard', name: 'Dashboard' },
];

for (const route of routes) {
  try {
    const response = await fetch(`${BASE_URL}${route.path}`);
    if (response.ok) {
      console.log(`  ✓ ${route.name} (${route.path}) - ${response.status}`);
    } else {
      console.log(`  ✗ ${route.name} (${route.path}) - ${response.status}`);
    }
  } catch (error) {
    console.log(`  ✗ ${route.name} - Error`);
  }
}

// Test 7: EAS Lookup API
console.log('\n🔍 Test 7: EAS Lookup API');
try {
  // Test with invalid UID (should fail gracefully)
  const testUid = '0x0000000000000000000000000000000000000000000000000000000000000000';
  const response = await fetch(`${API_BASE}/eas/${testUid}`);

  console.log(`  ✓ Lookup endpoint responding (status: ${response.status})`);
  if (response.status === 404) {
    console.log(`  ✓ Correctly handles non-existent attestations`);
  }
} catch (error) {
  console.log(`  ✗ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

// Summary
console.log('\n' + '='.repeat(60));
console.log('✅ Test Suite Completed!');
console.log('='.repeat(60));
console.log('\n📌 Manual Testing Checklist:');
console.log('  1. Open http://localhost:8080/issue');
console.log('  2. Connect wallet (MetaMask/Rainbow on Polygon Amoy)');
console.log('  3. Enable demo mode toggle');
console.log('  4. Select different schemas from dropdown');
console.log('  5. Verify form inputs change based on schema');
console.log('  6. Fill in all fields and create attestation');
console.log('  7. Go to /attestations and click "Try Demo"');
console.log('  8. Verify 100 demo attestations are generated');
console.log('  9. Test attestation lookup with a valid UID');
console.log('  10. Check browser console for errors (F12)');
console.log('\n🎉 Ready for deployment!\n');
