#!/usr/bin/env bun
/**
 * Verify schema exists and can be fetched
 */

import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';

const SCHEMA_REGISTRY = '0x23c5701A1BDa89C61d181BD79E5203c730708AE7' as `0x${string}`;
const SCHEMA_UID =
  '0x27d06e3659317e9a4f8154d1e849eb53d3d91fb4f219884d1684f86d797804a' as `0x${string}`;

const schemaRegistryAbi = [
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
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

async function verifySchema() {
  console.log('\n🔍 Verifying Schema on Polygon Amoy...\n');
  console.log('Registry:', SCHEMA_REGISTRY);
  console.log('Schema UID:', SCHEMA_UID);
  console.log('');

  const client = createPublicClient({
    chain: polygonAmoy,
    transport: http('https://rpc-amoy.polygon.technology'),
  });

  try {
    console.log('📡 Fetching schema...\n');

    const result = (await client.readContract({
      address: SCHEMA_REGISTRY,
      abi: schemaRegistryAbi,
      functionName: 'getSchema',
      args: [SCHEMA_UID],
    })) as { uid: string; resolver: string; revocable: boolean; schema: string };

    console.log('✅ Schema found!\n');
    console.log('Schema Details:');
    console.log('  UID:', result.uid);
    console.log('  Resolver:', result.resolver);
    console.log('  Revocable:', result.revocable);
    console.log('  Schema String:', result.schema);
    console.log('');

    if (!result.schema || result.schema === '') {
      console.log('❌ ERROR: Schema string is empty!');
      console.log('This schema exists but has no fields defined.');
      process.exit(1);
    }

    console.log('✅ Schema is valid and has fields!\n');
  } catch (error) {
    console.log('❌ Failed to fetch schema\n');
    console.error(error);
    console.log('\n💡 Possible issues:');
    console.log('  1. Schema UID does not exist on Polygon Amoy');
    console.log('  2. Schema Registry address is incorrect');
    console.log('  3. RPC endpoint is down');
    process.exit(1);
  }
}

verifySchema();
