// Types for EAS Subgraph GraphQL queries
export interface Attestation {
  id: string;
  uid: string;
  schema: {
    id: string;
    schema: string;
  };
  attester: string;
  recipient: string;
  time: number;
  expirationTime: number;
  revocationTime: number;
  revocable: boolean;
  data: string;
}

export interface AttestationsResponse {
  attestations: Attestation[];
}

export interface AttestationsQueryVariables {
  where?: {
    OR?: Array<{
      attester?: string;
      recipient?: string;
    }>;
  };
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  first?: number;
}

// GraphQL query for fetching attestations by address
export const GET_ATTESTATIONS_BY_ADDRESS = `
  query GetAttestationsByAddress($address: String!, $first: Int = 10) {
    attestations(
      where: {
        OR: [
          { attester: $address }
          { recipient: $address }
        ]
      }
      orderBy: time
      orderDirection: desc
      first: $first
    ) {
      id
      uid
      schema {
        id
        schema
      }
      attester
      recipient
      time
      expirationTime
      revocationTime
      revocable
      data
    }
  }
`;