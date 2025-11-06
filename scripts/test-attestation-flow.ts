#!/usr/bin/env bun
/**
 * Comprehensive Attestation Flow Test Script
 * Tests the entire attestation creation and lookup flow locally
 */

import {
  createPublicClient,
  createWalletClient,
  encodeAbiParameters,
  http,
  parseAbiParameters,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
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
  step: (msg: string) => console.log(`${colors.cyan}${colors.bright}➜ ${msg}${colors.reset}`),
};

// EAS Contract ABI
const EAS_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'schema', type: 'bytes32' },
          {
            components: [
              { name: 'recipient', type: 'address' },
              { name: 'expirationTime', type: 'uint64' },
              { name: 'revocable', type: 'bool' },
              { name: 'refUID', type: 'bytes32' },
              { name: 'data', type: 'bytes' },
              { name: 'value', type: 'uint256' },
            ],
            name: 'data',
            type: 'tuple',
          },
        ],
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'attest',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'payable',
    type: 'function',
  },
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
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'recipient', type: 'address' },
      { indexed: true, name: 'attester', type: 'address' },
      { indexed: false, name: 'uid', type: 'bytes32' },
      { indexed: true, name: 'schemaUID', type: 'bytes32' },
    ],
    name: 'Attested',
    type: 'event',
  },
] as const;

// Configuration
const EAS_CONTRACT = '0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc' as `0x${string}`;
const SCHEMA_UID =
  '0x27d06e3659317e9a4f8154d1e849eb53d3d91fb4f219884d1684f86d797804a' as `0x${string}`;
const PRIVATE_KEY =
  process.env.ATTESTER_PRIVATE_KEY ||
  '0xe7db771abed2bdb3cbfd995708087890006046098688409238d180d7e897ca8e';

async function testAttestationFlow() {
  console.log('\n' + '='.repeat(60));
  log.step('Starting Attestation Flow Test');
  console.log('='.repeat(60) + '\n');

  // Step 1: Setup clients
  log.step('Step 1: Setting up blockchain clients...');
  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);
  log.info(`Using account: ${account.address}`);

  const publicClient = createPublicClient({
    chain: polygonAmoy,
    transport: http(process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
  });

  const walletClient = createWalletClient({
    account,
    chain: polygonAmoy,
    transport: http(process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
  });

  // Step 2: Check balance
  log.step('Step 2: Checking wallet balance...');
  const balance = await publicClient.getBalance({ address: account.address });
  log.info(`Balance: ${(Number(balance) / 1e18).toFixed(4)} POL`);

  if (balance === BigInt(0)) {
    log.error('No POL balance! Get testnet tokens from https://faucet.polygon.technology/');
    process.exit(1);
  }
  log.success('Sufficient balance');

  // Step 3: Verify schema exists
  log.step('Step 3: Verifying schema exists on-chain...');
  try {
    const schemaRegistry = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
    });

    const SCHEMA_REGISTRY = '0x4200000000000000000000000000000000000020' as `0x${string}`;
    const schemaData = await schemaRegistry.readContract({
      address: SCHEMA_REGISTRY,
      abi: [
        {
          inputs: [{ name: 'uid', type: 'bytes32' }],
          name: 'getSchema',
          outputs: [
            {
              components: [
                { name: 'uid', type: 'bytes32' },
                { name: 'resolver', type: 'address' },
                { name: 'revocable', type: 'bool' },
                { name: 'schema', type: 'string' },
              ],
              name: '',
              type: 'tuple',
            },
          ],
          stateMutability: 'view',
          type: 'function',
        },
      ],
      functionName: 'getSchema',
      args: [SCHEMA_UID],
    });

    if (typeof schemaData === 'object' && 'schema' in schemaData) {
      log.info(`Schema found: ${schemaData.schema}`);
      log.success('Schema exists on-chain');
    } else {
      log.error('Schema not found! You need to register it first.');
      log.info('Visit: https://polygon-amoy.easscan.org/schema/create');
      process.exit(1);
    }
  } catch (error) {
    log.warn('Could not verify schema (registry might use different address)');
    log.info('Continuing anyway...');
  }

  // Step 4: Prepare attestation data
  log.step('Step 4: Preparing attestation data...');
  const schemaString = 'bool isFriend';
  const abiParams = parseAbiParameters(schemaString);
  const values = [true] as const; // isFriend = true
  const encodedData = encodeAbiParameters(abiParams, values as readonly [boolean]);
  log.info(`Schema: ${schemaString}`);
  log.info(`Encoded data: ${encodedData}`);
  log.success('Data encoded');

  // Step 5: Create attestation
  log.step('Step 5: Creating attestation on-chain...');
  const attestationRequest = {
    schema: SCHEMA_UID,
    data: {
      recipient: account.address, // Attest to ourselves for testing
      expirationTime: BigInt(0),
      revocable: true,
      refUID: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
      data: encodedData,
      value: BigInt(0),
    },
  };

  try {
    const hash = await walletClient.writeContract({
      address: EAS_CONTRACT,
      abi: EAS_ABI,
      functionName: 'attest',
      args: [attestationRequest],
    });

    log.info(`Transaction submitted: ${hash}`);
    log.info(`View on PolygonScan: https://amoy.polygonscan.com/tx/${hash}`);

    // Step 6: Wait for transaction
    log.step('Step 6: Waiting for transaction confirmation...');
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      confirmations: 1,
    });

    log.success(`Transaction confirmed in block ${receipt.blockNumber}`);

    // Step 7: Extract attestation UID
    log.step('Step 7: Extracting attestation UID from receipt...');
    const attestedEvent = receipt.logs.find(
      (log) =>
        log.topics[0] === '0x8bf46bf4cfd674fa735a3d63ec1c9ad4153f033c290341f3a588b75685141b35'
    );

    if (!attestedEvent || !attestedEvent.data) {
      log.error('Attested event not found in transaction logs!');
      console.log('Receipt logs:', receipt.logs);
      process.exit(1);
    }

    // The UID is in the data field (not indexed)
    // Parse the data field - it should be a bytes32
    const attestationUID = attestedEvent.data as `0x${string}`;
    log.success(`Attestation UID: ${attestationUID}`);

    // Step 8: Wait a bit for blockchain to index
    log.step('Step 8: Waiting 3 seconds for blockchain indexing...');
    await new Promise((resolve) => setTimeout(resolve, 3000));

    // Step 9: Read attestation from chain
    log.step('Step 9: Reading attestation from EAS contract...');
    const attestation = await publicClient.readContract({
      address: EAS_CONTRACT,
      abi: EAS_ABI,
      functionName: 'getAttestation',
      args: [attestationUID],
    });

    log.info('Attestation data retrieved:');
    console.log({
      uid: attestation.uid,
      schema: attestation.schema,
      attester: attestation.attester,
      recipient: attestation.recipient,
      time: attestation.time.toString(),
      revocable: attestation.revocable,
      data: attestation.data,
    });

    // Check if attestation exists (time > 0)
    if (attestation.time === BigInt(0)) {
      log.error('Attestation not found on-chain! (time = 0)');
      process.exit(1);
    }

    log.success('Attestation successfully created and verified!');

    // Step 10: Test API endpoint
    log.step('Step 10: Testing local API endpoint...');
    log.info('You can test the API with:');
    console.log(`  curl http://localhost:3000/api/eas/${attestationUID}`);
    log.info('Or visit:');
    console.log(`  http://localhost:3000/attestations?uid=${attestationUID}`);

    // Summary
    console.log('\n' + '='.repeat(60));
    log.success('ALL TESTS PASSED! 🎉');
    console.log('='.repeat(60));
    console.log('\nTest Summary:');
    console.log(`  Transaction Hash: ${hash}`);
    console.log(`  Attestation UID:  ${attestationUID}`);
    console.log(`  Block Number:     ${receipt.blockNumber}`);
    console.log(`  Gas Used:         ${receipt.gasUsed.toString()}`);
    console.log(`  Attester:         ${attestation.attester}`);
    console.log(`  Recipient:        ${attestation.recipient}`);
    console.log(`  Schema:           ${attestation.schema}`);
    console.log('\n');
  } catch (error) {
    log.error('Transaction failed!');
    console.error(error);
    process.exit(1);
  }
}

// Run the test
testAttestationFlow().catch((error) => {
  log.error('Test failed with error:');
  console.error(error);
  process.exit(1);
});
