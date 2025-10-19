// Sample attestation UIDs for demo and testing purposes
export interface SampleAttestation {
  uid: string;
  title: string;
  description: string;
  expectedOutcome: 'success' | 'error';
  category: 'valid' | 'invalid' | 'edge-case';
}

export const SAMPLE_ATTESTATIONS: SampleAttestation[] = [
  {
    uid: '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef',
    title: 'Sample Valid Attestation',
    description: 'A complete attestation with all fields populated correctly',
    expectedOutcome: 'success',
    category: 'valid',
  },
  {
    uid: '0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890',
    title: 'Another Valid Attestation',
    description: 'Another example of a properly formatted attestation',
    expectedOutcome: 'success', 
    category: 'valid',
  },
  {
    uid: '0xfedcba0987654321fedcba0987654321fedcba0987654321fedcba0987654321',
    title: 'Revoked Attestation',
    description: 'An attestation that has been revoked (revocationTime > 0)',
    expectedOutcome: 'success',
    category: 'edge-case',
  },
  {
    uid: '0x0000000000000000000000000000000000000000000000000000000000000001',
    title: 'Edge Case: Minimal UID',
    description: 'Tests handling of minimal non-zero UID',
    expectedOutcome: 'success',
    category: 'edge-case',
  },
  {
    uid: '0x9999999999999999999999999999999999999999999999999999999999999999',
    title: 'Non-existent Attestation',
    description: 'This UID should not exist and will trigger an error',
    expectedOutcome: 'error',
    category: 'invalid',
  },
];

// Known test UIDs that should work on Polygon Amoy testnet
// These would be real attestations created for demo purposes
export const LIVE_DEMO_UIDS = [
  // Add real UIDs here once attestations are created on Amoy testnet
  // These will be populated during actual deployment
];

// Invalid UID formats for testing error handling
export const INVALID_UIDS = [
  {
    uid: 'invalid-format',
    title: 'Invalid Format',
    description: 'Not a valid hex string',
  },
  {
    uid: '0x123', // Too short
    title: 'Too Short',
    description: 'UID is too short (must be 32 bytes)',
  },
  {
    uid: '', // Empty
    title: 'Empty UID',
    description: 'Empty string provided as UID',
  },
];