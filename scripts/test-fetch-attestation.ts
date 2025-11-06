#!/usr/bin/env bun
/**
 * Test fetching an attestation from the blockchain
 * Usage: bun run scripts/test-fetch-attestation.ts <UID>
 */

import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

const log = {
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  warn: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  step: (msg: string) => console.log(`${colors.cyan}➜ ${msg}${colors.reset}`),
};

const EAS_ABI = [
  {
    inputs: [{ name: 'uid', type: 'bytes32' }],
    name: 'getAttestation',
    outputs: [
      {
        components: [
          { name: 'uid', type: 'bytes32' },
          { name: 'schema', type: 'bytes32' },
          { name: 'refUID', type: 'bytes32' },
          { name: 'time', type: 'uint64' },
          { name: 'expirationTime', type: 'uint64' },
          { name: 'revocationTime', type: 'uint64' },
          { name: 'recipient', type: 'address' },
          { name: 'attester', type: 'address' },
          { name: 'revocable', type: 'bool' },
          { name: 'data', type: 'bytes' },
        ],
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

const EAS_CONTRACT = '0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc' as `0x${string}`;

async function testFetchAttestation(uid: string) {
  console.log('\n' + '='.repeat(70));
  log.step(`Testing Attestation Fetch: ${uid}`);
  console.log('='.repeat(70) + '\n');

  // Validate UID format
  if (!uid.startsWith('0x') || uid.length !== 66) {
    log.error('Invalid UID format! Must be 66 characters starting with 0x');
    process.exit(1);
  }

  log.step('Step 1: Connecting to Polygon Amoy...');
  const client = createPublicClient({
    chain: polygonAmoy,
    transport: http(process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
  });
  log.success('Connected');

  log.step('Step 2: Fetching attestation from EAS contract...');
  try {
    const attestation = await client.readContract({
      address: EAS_CONTRACT,
      abi: EAS_ABI,
      functionName: 'getAttestation',
      args: [uid as `0x${string}`],
    });

    log.success('Attestation fetched!');

    // Log raw response
    console.log('\nRaw Response:');
    console.log(attestation);
    console.log('\nType:', typeof attestation);
    console.log('Keys:', typeof attestation === 'object' ? Object.keys(attestation) : 'N/A');

    // Check if attestation exists (time > 0)
    if (attestation.time === BigInt(0)) {
      log.error('Attestation not found (time = 0)');
      log.warn('The attestation might not exist or needs more time to be indexed');

      // Show all fields anyway
      console.log('\nAll fields (even though time = 0):');
      console.log(
        JSON.stringify(
          attestation,
          (key, value) => (typeof value === 'bigint' ? value.toString() : value),
          2
        )
      );

      process.exit(1);
    }

    console.log('\n' + '-'.repeat(70));
    console.log('Attestation Details:');
    console.log('-'.repeat(70));
    console.log(`  UID:              ${attestation.uid}`);
    console.log(`  Schema:           ${attestation.schema}`);
    console.log(`  Attester:         ${attestation.attester}`);
    console.log(`  Recipient:        ${attestation.recipient}`);
    console.log(
      `  Time:             ${new Date(Number(attestation.time) * 1000).toLocaleString()}`
    );
    console.log(
      `  Expiration Time:  ${attestation.expirationTime === BigInt(0) ? 'Never' : new Date(Number(attestation.expirationTime) * 1000).toLocaleString()}`
    );
    console.log(
      `  Revocation Time:  ${attestation.revocationTime === BigInt(0) ? 'Not Revoked' : new Date(Number(attestation.revocationTime) * 1000).toLocaleString()}`
    );
    console.log(`  Revocable:        ${attestation.revocable ? 'Yes' : 'No'}`);
    console.log(`  Ref UID:          ${attestation.refUID}`);
    console.log(`  Data:             ${attestation.data}`);
    console.log('-'.repeat(70) + '\n');

    log.step('Step 3: Testing API endpoint...');
    log.info(`Testing: https://polyseal-jade.vercel.app/api/eas/${uid}`);

    try {
      const response = await fetch(`https://polyseal-jade.vercel.app/api/eas/${uid}`);

      if (response.ok) {
        const data = await response.json();
        log.success('API endpoint working!');
        console.log('API Response:', JSON.stringify(data, null, 2));
      } else {
        log.error(`API returned status ${response.status}`);
        const text = await response.text();
        console.log('Error response:', text);
      }
    } catch (error) {
      log.error('API request failed');
      console.error(error);
    }

    console.log('\n' + '='.repeat(70));
    log.success('TEST PASSED! Attestation exists and can be fetched 🎉');
    console.log('='.repeat(70) + '\n');
  } catch (error) {
    log.error('Failed to fetch attestation');
    console.error(error);
    process.exit(1);
  }
}

// Get UID from command line or use default
const uid = process.argv[2] || '0x51c4a0dad896d8fe3dae5b65b1abceaced50ec248bd51fadc191d4980e613d7e';

testFetchAttestation(uid).catch((error) => {
  log.error('Test failed');
  console.error(error);
  process.exit(1);
});
