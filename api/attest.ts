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

// EAS attest function ABI
const EAS_ABI = parseAbi([
  'function attest((bytes32 schema, (address recipient, uint64 expirationTime, bool revocable, bytes32 refUID, bytes data, uint256 value) data) request) payable returns (bytes32)',
]);

interface AttestRequest {
  schema: string;
  recipient: string;
  expirationTime?: number;
  revocable?: boolean;
  refUID?: string;
  data: string;
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
    const {
      schema,
      recipient,
      expirationTime = 0,
      revocable = true,
      refUID = '0x0000000000000000000000000000000000000000000000000000000000000000',
      data,
      value = '0',
    } = req.body as AttestRequest;

    // Validate required fields
    if (!schema || !recipient || !data) {
      return res.status(400).json({
        error: 'Missing required fields: schema, recipient, data',
      });
    }

    // Validate addresses
    if (!schema.match(/^0x[a-fA-F0-9]{64}$/)) {
      return res.status(400).json({ error: 'Invalid schema UID format' });
    }

    if (!recipient.match(/^0x[a-fA-F0-9]{40}$/)) {
      return res.status(400).json({ error: 'Invalid recipient address format' });
    }

    if (!data.match(/^0x[a-fA-F0-9]*$/)) {
      return res.status(400).json({ error: 'Invalid data format (must be hex)' });
    }

    // Check if private key is configured for delegated attestation
    if (!PRIVATE_KEY) {
      return res.status(503).json({
        error: 'Delegated attestation not configured on server',
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

    // Build attestation request
    const attestationRequest = {
      schema: schema as `0x${string}`,
      data: {
        recipient: recipient as `0x${string}`,
        expirationTime: BigInt(expirationTime),
        revocable: Boolean(revocable),
        refUID: refUID as `0x${string}`,
        data: data as `0x${string}`,
        value: BigInt(value),
      },
    };

    // Submit attestation transaction
    const hash = await walletClient.writeContract({
      address: EAS_CONTRACT_ADDRESS,
      abi: EAS_ABI,
      functionName: 'attest',
      args: [attestationRequest],
      value: BigInt(value),
    });

    // Wait for transaction confirmation
    const receipt = await publicClient.waitForTransactionReceipt({
      hash,
      timeout: 60_000, // 60 seconds
    });

    // Parse logs to get attestation UID
    // The EAS contract emits an Attested event with the UID
    let attestationUid: string | null = null;
    if (receipt.logs && receipt.logs.length > 0) {
      // The UID is typically the first topic of the Attested event
      const attestedEvent = receipt.logs.find(
        (log) => log.address.toLowerCase() === EAS_CONTRACT_ADDRESS.toLowerCase()
      );
      if (attestedEvent && attestedEvent.topics.length > 1) {
        attestationUid = attestedEvent.topics[1] as string;
      }
    }

    return res.status(200).json({
      success: true,
      transactionHash: hash,
      attestationUid: attestationUid || hash, // Fallback to tx hash if UID not found
      attester: account.address,
      recipient,
      schema,
      blockNumber: receipt.blockNumber.toString(),
      gasUsed: receipt.gasUsed.toString(),
    });
  } catch (error) {
    console.error('Error creating attestation:', error);

    return res.status(500).json({
      error: 'Failed to create attestation',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
