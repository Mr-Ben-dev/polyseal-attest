#!/usr/bin/env bun
/**
 * Analyze a transaction to extract the real attestation UID
 * Usage: bun run scripts/analyze-transaction.ts <TX_HASH>
 */

import { createPublicClient, decodeEventLog, http } from 'viem';
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

async function analyzeTransaction(txHash: string) {
  console.log('\n' + '='.repeat(70));
  log.step(`Analyzing Transaction: ${txHash}`);
  console.log('='.repeat(70) + '\n');

  // Validate tx hash format
  if (!txHash.startsWith('0x') || txHash.length !== 66) {
    log.error('Invalid transaction hash format! Must be 66 characters starting with 0x');
    process.exit(1);
  }

  log.step('Step 1: Connecting to Polygon Amoy...');
  const client = createPublicClient({
    chain: polygonAmoy,
    transport: http(process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
  });
  log.success('Connected');

  log.step('Step 2: Fetching transaction receipt...');
  const receipt = await client.getTransactionReceipt({
    hash: txHash as `0x${string}`,
  });

  console.log('\nTransaction Status:', receipt.status === 'success' ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Block Number:', receipt.blockNumber);
  console.log('Gas Used:', receipt.gasUsed.toString());
  console.log('Total Logs:', receipt.logs.length);
  console.log('');

  if (receipt.status !== 'success') {
    log.error('Transaction failed! Attestation was not created.');
    process.exit(1);
  }

  log.step('Step 3: Analyzing logs for Attested event...');
  console.log(`\nFound ${receipt.logs.length} logs:\n`);

  receipt.logs.forEach((eventLog, index) => {
    console.log(`Log #${index}:`);
    console.log(`  Address: ${eventLog.address}`);
    console.log(`  Topic 0 (Event Signature): ${eventLog.topics[0]}`);
    if (eventLog.topics.length > 1) {
      console.log(`  Topic 1 (Indexed Param 1): ${eventLog.topics[1]}`);
    }
    if (eventLog.topics.length > 2) {
      console.log(`  Topic 2 (Indexed Param 2): ${eventLog.topics[2]}`);
    }
    if (eventLog.topics.length > 3) {
      console.log(`  Topic 3 (Indexed Param 3): ${eventLog.topics[3]}`);
    }
    console.log(`  Data: ${eventLog.data}`);
    console.log('');
  });

  // Find the Attested event
  const attestedEventSignature =
    '0x8bf46bf4cfd674fa735a3d63ec1c9ad4153f033c290341f3a588b75685141b35';
  const attestedLog = receipt.logs.find(
    (eventLog) => eventLog.topics[0] === attestedEventSignature
  );

  if (!attestedLog) {
    log.error('Attested event not found in transaction logs!');
    log.warn('This might not be an attestation transaction');
    process.exit(1);
  }

  log.success('Found Attested event!');

  log.step('Step 4: Decoding Attested event...');
  try {
    const decoded = decodeEventLog({
      abi: EAS_ABI,
      data: attestedLog.data,
      topics: attestedLog.topics,
    });

    console.log('\nDecoded Event:');
    console.log('  Event Name:', decoded.eventName);
    console.log('  Args:', decoded.args);

    if (decoded && typeof decoded === 'object' && 'args' in decoded) {
      const args = decoded.args as {
        uid?: `0x${string}`;
        recipient?: `0x${string}`;
        attester?: `0x${string}`;
        schemaUID?: `0x${string}`;
      };

      console.log('\n' + '='.repeat(70));
      log.success('ATTESTATION UID EXTRACTED!');
      console.log('='.repeat(70));
      console.log(`\n  UID:       ${args.uid}`);
      console.log(`  Recipient: ${args.recipient}`);
      console.log(`  Attester:  ${args.attester}`);
      console.log(`  Schema:    ${args.schemaUID}`);
      console.log('');

      if (args.uid) {
        log.info(`Test this UID: bun run scripts/test-fetch-attestation.ts ${args.uid}`);
        log.info(`View in app: https://polyseal-jade.vercel.app/attestations?uid=${args.uid}`);
      }
    }
  } catch (error) {
    log.error('Failed to decode event');
    console.error(error);
  }
}

// Get tx hash from command line
const txHash =
  process.argv[2] || '0xbc69c87d22df8d842c478c9c015c0f781f600d7adc5d4eec95f725203d33e151';

if (!txHash) {
  log.error('Usage: bun run scripts/analyze-transaction.ts <TX_HASH>');
  process.exit(1);
}

analyzeTransaction(txHash).catch((error) => {
  log.error('Analysis failed');
  console.error(error);
  process.exit(1);
});
