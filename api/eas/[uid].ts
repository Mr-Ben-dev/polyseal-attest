import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPublicClient, http } from 'viem';
import { polygonAmoy } from 'viem/chains';
import { cors } from '../_lib/cors';
import { rate } from '../_lib/rate';

const abi = [
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

const eas = (process.env.EAS_CONTRACT_ADDRESS || '0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc') as `0x${string}`;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (cors(req, res) || rate(req, res)) return;

  try {
    const { uid } = req.query;
    if (!uid || typeof uid !== 'string') {
      return res.status(400).json({ error: 'missing_uid' });
    }

    const client = createPublicClient({
      chain: polygonAmoy,
      transport: http(process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology'),
    });

    const data = await client.readContract({
      address: eas,
      abi,
      functionName: 'getAttestation',
      args: [uid as `0x${string}`],
    });

    // Convert BigInt values to strings for JSON serialization
    const serializedData = JSON.parse(JSON.stringify(data, (key, value) =>
      typeof value === 'bigint' ? value.toString() : value
    ));

    res.status(200).json(serializedData);
  } catch (error) {
    console.error('EAS lookup error:', error);
    res.status(404).json({ error: 'attestation_not_found' });
  }
}
