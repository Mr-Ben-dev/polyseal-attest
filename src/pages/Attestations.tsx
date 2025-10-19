import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Search, Loader2, AlertCircle, CheckCircle, ExternalLink } from 'lucide-react';
import { ENV } from '@/lib/env';
import { getSchemaByUid } from '@/lib/eas';
import SEO from '@/ui/SEO';

export default function Attestations() {
  const [uid, setUid] = useState('');

  // Fetch schema definition
  const { data: schemaData, isLoading: schemaLoading, error: schemaError } = useQuery({
    queryKey: ['schema', ENV.SCHEMA_UID],
    queryFn: async () => {
      const result = await getSchemaByUid(ENV.REGISTRY, ENV.SCHEMA_UID);
      return result;
    },
  });

  // Lookup attestation mutation
  const lookup = useMutation({
    mutationFn: async (attestationUid: string) => {
      const response = await fetch(`${ENV.SERVER}/eas/${attestationUid}`);
      if (!response.ok) {
        throw new Error('Attestation not found');
      }
      return response.json();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (uid.trim()) {
      lookup.mutate(uid.trim());
    }
  };

  return (
    <>
      <SEO title="EAS Tools — Polyseal" path="/attestations" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          <h1 className="mb-4">EAS Attestation Tools</h1>
          <p className="text-xl text-muted-foreground mb-12">
            Decode schemas and lookup attestations on Polygon Amoy. All data is verified on-chain through the EAS protocol.
          </p>
        </motion.div>

        {/* Schema Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6 mb-8 max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-3 mb-4">
            <CheckCircle className="w-6 h-6 text-primary mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Polyseal Schema</h2>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">UID:</span>
                  <code className="px-2 py-1 bg-muted rounded text-xs break-all">
                    {ENV.SCHEMA_UID}
                  </code>
                  <a
                    href={`${ENV.SCANNER}/address/${ENV.REGISTRY}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:text-primary/80"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
                
                {schemaLoading && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Loading schema definition...</span>
                  </div>
                )}
                
                {schemaError && (
                  <div className="flex items-center gap-2 text-destructive">
                    <AlertCircle className="w-4 h-4" />
                    <span>Could not load schema. Check network or UID.</span>
                  </div>
                )}
                
                {schemaData && (
                  <div className="mt-3">
                    <span className="text-muted-foreground block mb-1">Schema Definition:</span>
                    <code className="block px-3 py-2 bg-muted rounded text-xs break-all">
                      {schemaData.schema || 'No schema string returned for this UID'}
                    </code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Attestation Lookup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="glass-card p-6 max-w-4xl mx-auto"
        >
          <div className="flex items-start gap-3 mb-6">
            <Search className="w-6 h-6 text-primary mt-1" />
            <div className="flex-1">
              <h2 className="text-xl font-bold mb-2">Lookup Attestation</h2>
              <p className="text-sm text-muted-foreground">
                Enter an attestation UID to fetch and verify its data from the blockchain.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="0x..."
                value={uid}
                onChange={(e) => setUid(e.target.value)}
                className="flex-1 px-4 py-3 bg-muted border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                disabled={!uid.trim() || lookup.isPending}
                className="btn btn-primary px-8"
              >
                {lookup.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" />
                    Fetch
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Results */}
          {lookup.isPending && (
            <div className="mt-6 p-4 bg-muted rounded-xl flex items-center gap-3">
              <Loader2 className="w-5 h-5 animate-spin text-primary" />
              <span>Querying EAS contract on Polygon Amoy...</span>
            </div>
          )}

          {lookup.isError && (
            <div className="mt-6 p-4 bg-destructive/10 border border-destructive/20 rounded-xl flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-destructive mt-0.5" />
              <div>
                <p className="font-medium text-destructive">Attestation Not Found</p>
                <p className="text-sm text-destructive/80 mt-1">
                  Unable to fetch attestation. Please verify the UID and ensure you're connected to Polygon Amoy.
                </p>
              </div>
            </div>
          )}

          {lookup.isSuccess && lookup.data && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2 text-primary">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">Attestation Found</span>
              </div>
              <pre className="p-4 bg-muted rounded-xl text-xs overflow-x-auto">
                {JSON.stringify(lookup.data, null, 2)}
              </pre>
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
