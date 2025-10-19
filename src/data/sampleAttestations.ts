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
    uid: '0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a',
    title: 'Polyseal Schema UID',
    description: 'This is our main schema UID - should return schema data, not attestation',
    expectedOutcome: 'error',
    category: 'edge-case',
  },
  {
    uid: '0x0000000000000000000000000000000000000000000000000000000000000000',
    title: 'Empty Attestation',
    description: 'Zero UID - should return empty/null attestation data',
    expectedOutcome: 'success',
    category: 'edge-case',
  },
  {
    uid: '0x0000000000000000000000000000000000000000000000000000000000000001',
    title: 'Minimal UID Test',
    description: 'Tests handling of minimal non-zero UID',
    expectedOutcome: 'success',
    category: 'edge-case',
  },
  {
    uid: '0x1111111111111111111111111111111111111111111111111111111111111111',
    title: 'Non-existent Attestation #1',
    description: 'This UID likely does not exist on Polygon Amoy - will show error handling',
    expectedOutcome: 'error',
    category: 'invalid',
  },
  {
    uid: '0x9999999999999999999999999999999999999999999999999999999999999999',
    title: 'Non-existent Attestation #2',
    description: 'Another non-existent UID to demonstrate error handling',
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