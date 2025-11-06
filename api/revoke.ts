import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createPublicClient, createWalletClient, http, parseAbi } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { polygonAmoy } from 'viem/chains';
import { cors } from './_lib/cors';
import { rate } from './_lib/rate';

// Environment variables
const POLYGON_RPC_URL = process.env.POLYGON_RPC_URL || 'https://rpc-amoy.polygon.technology';
const EAS_CONTRACT_ADDRESS = (process.env.EAS_CONTRACT_ADDRESS ||
  '0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc') as `0x${string}`;
const PRIVATE_KEY = process.env.ATTESTER_PRIVATE_KEY as `0x${string}` | undefined;

// EAS revoke function ABI
const EAS_ABI = parseAbi([
  'function revoke((bytes32 schema, (bytes32 uid, uint256 value) data) request) payable',
  'function getAttestation(bytes32 uid) view returns ((bytes32 uid, bytes32 schema, uint64 time, uint64 expirationTime, uint64 revocationTime, bytes32 refUID, address recipient, address attester, bool revocable, bytes data))',
]);

interface RevokeRequest {
  uid: string;
  schema: string;
  value?: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  if (cors(req, res)) return;

  // Rate limiting
  if (rate(req, res)) return;

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { uid, schema, value = '0' } = req.body as RevokeRequest;

    // Validate required fields
    if (!uid || !schema) {
      return res.status(400).json({
        error: 'Missing required fields: uid, schema',
      });
    }

    // Validate format
    if (!uid.match(/^0x[a-fA-F0-9]{64}$/)) {
      return res.status(400).json({ error: 'Invalid attestation UID format' });
    }

    if (!schema.match(/^0x[a-fA-F0-9]{64}$/)) {
      return res.status(400).json({ error: 'Invalid schema UID format' });
    }

    // Check if private key is configured
    if (!PRIVATE_KEY) {
      return res.status(503).json({
        error: 'Delegated revocation not configured on server',
        message: 'Please set ATTESTER_PRIVATE_KEY environment variable',
      });
    }

    // Create clients
    const publicClient = createPublicClient({
      chain: polygonAmoy,
      transport: http(POLYGON_RPC_URL),
    });

    const account = privateKeyToAccount(PRIVATE_KEY);
    const walletClient = createWalletClient({
      account,
      chain: polygonAmoy,
      transport: http(POLYGON_RPC_URL),
    });

    // Verify attestation exists and check revocability
    try {
      const attestation = await publicClient.readContract({
        address: EAS_CONTRACT_ADDRESS,
        abi: EAS_ABI,
        functionName: 'getAttestation',
        args: [uid as `0x${string}`],
      });

      // Check if already revoked
      if (attestation.revocationTime > 0n) {
        return res.status(400).json({
          error: 'Attestation already revoked',
          revocationTime: attestation.revocationTime.toString(),
        });
      }

      // Check if revocable
      if (!attestation.revocable) {
        return res.status(403).json({
          error: 'Attestation is not revocable',
        });
      }

      // Check if caller is the attester
      if (attestation.attester.toLowerCase() !== account.address.toLowerCase()) {
        return res.status(403).json({
          error: 'Only the original attester can revoke this attestation',
          attester: attestation.attester,
          caller: account.address,
        });
      }
    } catch (error) {
      return res.status(404).json({
        error: 'Attestation not found',
        uid,
      });
    }

    // Build revocation request
    const revocationRequest = {
      schema: schema as `0x${string}`,
      data: {
        uid: uid as `0x${string}`,
        value: BigInt(value),
      },
    };

    // Submit revocation transaction
    const hash = await walletClient.writeContract({
      address: EAS_CONTRACT_ADDRESS,
      abi: EAS_ABI,
      functionName: 'revoke',
      args: [revocationRequest],
      value: BigInt(value),
    });

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60_000, // 60 seconds
    });

    return res.status(200).json({
      success: true,
      transactionHash: hash,
      attestationUid: uid,
      revoker: account.address,
      schema,
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
    });
  } catch (error) {
    console.error('Error revoking attestation:', error);

    return res.status(500).json({
      error: 'Failed to revoke attestation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
