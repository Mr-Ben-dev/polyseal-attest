import { createPublicClient, http, parseAbi } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { ENV } from './env';

export const publicClient = createPublicClient({
  chain: polygonAmoy,
  transport: http(ENV.RPC),
});

export const schemaRegistryAbi = parseAbi([
  'function getSchema(bytes32 uid) view returns (tuple(bytes32 uid, address resolver, bool revocable, string schema))',
]);

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
