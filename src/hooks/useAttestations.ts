import { ENV } from '@/lib/env';
import { GET_ATTESTATIONS_BY_ADDRESS, type AttestationsResponse } from '@/lib/graphql';
import { useQuery } from '@tanstack/react-query';

export function useAttestationsByAddress(address?: string) {
  return useQuery({
    queryKey: ['attestations', address],
    queryFn: async (): Promise<AttestationsResponse> => {
      if (!ENV.EAS_SUBGRAPH_URL || !address) {
        throw new Error('Subgraph URL or address not available');
      }

      const response = await fetch(ENV.EAS_SUBGRAPH_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: GET_ATTESTATIONS_BY_ADDRESS,
          variables: {
            address: address.toLowerCase(),
            first: 10,
          },
        }),
      });

      if (!response.ok) {
        throw new Error(`GraphQL request failed: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.errors) {
        throw new Error(`GraphQL errors: ${JSON.stringify(result.errors)}`);
      }

      return result.data;
    },
    enabled: Boolean(ENV.EAS_SUBGRAPH_URL && address),
    staleTime: 30000, // 30 seconds
    retry: 2,
  });
}