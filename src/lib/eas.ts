import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { ENV } from './env';

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(ENV.RPC),
});

export const schemaRegistryAbi = [
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

export async function getSchemaByUid(registry: `0x${string}`, uid: `0x${string}`) {
  try {
    // @ts-ignore - Type compatibility issue with viem version
    const result = await publicClient.readContract({
      address: registry,
      abi: schemaRegistryAbi,
      functionName: 'getSchema',
      args: [uid],
    }) as { uid: string; resolver: string; revocable: boolean; schema: string };
    return result;
  } catch (error) {
    console.error('Error fetching schema:', error);
    throw error;
  }
}
