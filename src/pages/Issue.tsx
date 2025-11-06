import SchemaFormGenerator from '@/components/SchemaFormGenerator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { getSchemaByUid } from '@/lib/eas';
import { ENV } from '@/lib/env';
import SEO from '@/ui/SEO';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Copy,
  ExternalLink,
  FileText,
  Loader2,
  Wallet,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { decodeEventLog } from 'viem';
import { useAccount, useWaitForTransactionReceipt, useWriteContract } from 'wagmi';
import { polygonAmoy } from 'wagmi/chains';

// EAS Contract ABI for attest function
const EAS_ABI = [
  {
    inputs: [
      {
        components: [
          { name: 'schema', type: 'bytes32' },
          {
            components: [
              { name: 'recipient', type: 'address' },
              { name: 'expirationTime', type: 'uint64' },
              { name: 'revocable', type: 'bool' },
              { name: 'refUID', type: 'bytes32' },
              { name: 'data', type: 'bytes' },
              { name: 'value', type: 'uint256' },
            ],
            name: 'data',
            type: 'tuple',
          },
        ],
        name: 'request',
        type: 'tuple',
      },
    ],
    name: 'attest',
    outputs: [{ name: '', type: 'bytes32' }],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'recipient', type: 'address' },
      { indexed: true, name: 'attester', type: 'address' },
      { indexed: false, name: 'uid', type: 'bytes32' },
      { indexed: true, name: 'schemaUID', type: 'bytes32' },
    ],
    name: 'Attested',
    type: 'event',
  },
] as const;

// Common schemas on Polygon Amoy for demo
const COMMON_SCHEMAS = [
  {
    uid: ENV.SCHEMA_UID,
    name: 'Polyseal Schema',
    description: 'Default Polyseal attestation schema',
    schemaString: 'bool isFriend', // Hardcoded since registry lookup fails
  },
  {
    uid: '0x93f80b4674cbd9f74ddbd3cf593f463dd3a87cd9f002e5fe2a8048ef2d5eaa5a',
    name: 'Identity Verification',
    description: 'Schema for identity verification attestations',
    schemaString: 'string name,address wallet',
  },
  {
    uid: '0x3eb39e89d37aa75c64380bdf3b66c245b1e0aae23cb2d2599bcb17f218cb68ee',
    name: 'Credential',
    description: 'Schema for educational or professional credentials',
    schemaString: 'string credentialType,string issuer,uint256 issueDate',
  },
];

interface AttestationFormData {
  recipient: string;
  expirationTime: string;
  revocable: boolean;
}

interface SelectedSchema {
  uid: `0x${string}`;
  name: string;
  schemaString: string;
  revocable: boolean;
}

export default function Issue() {
  const { address, isConnected, chainId } = useAccount();
  const [selectedSchemaUid, setSelectedSchemaUid] = useState<string>(ENV.SCHEMA_UID);
  const [selectedSchema, setSelectedSchema] = useState<SelectedSchema | null>(null);
  const [formData, setFormData] = useState<AttestationFormData>({
    recipient: '',
    expirationTime: '',
    revocable: true,
  });
  const [demoEnabled, setDemoEnabled] = useState(false);

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();

  const {
    isLoading: isConfirming,
    isSuccess: isConfirmed,
    data: receipt,
  } = useWaitForTransactionReceipt({
    hash,
  });

  // Extract attestation UID from transaction receipt
  // The UID is in the event data, not topics (it's not indexed)
  let attestationUid: `0x${string}` | undefined = hash;

  if (receipt?.logs?.[0]) {
    try {
      // Find the Attested event log
      const attestedLog = receipt.logs.find(
        (log) =>
          log.topics[0] === '0x8bf46bf4cfd674fa735a3d63ec1c9ad4153f033c290341f3a588b75685141b35' // Attested event signature
      );

      if (attestedLog) {
        // Decode the non-indexed data (uid is the 3rd parameter, not indexed)
        const decoded = decodeEventLog({
          abi: EAS_ABI,
          data: attestedLog.data,
          topics: attestedLog.topics,
        });

        if (decoded && typeof decoded === 'object' && 'args' in decoded) {
          const args = decoded.args as { uid?: `0x${string}` };
          if (args.uid) {
            attestationUid = args.uid;
            console.log('✅ Extracted attestation UID:', attestationUid);
          }
        }
      } else {
        console.warn('⚠️ Attested event not found in receipt logs');
      }
    } catch (error) {
      console.error('Failed to extract attestation UID:', error);
    }
  }

  console.log('Final attestation UID:', attestationUid, 'Transaction hash:', hash);

  // Fetch selected schema details
  const { data: schemaData, isLoading: schemaLoading } = useQuery({
    queryKey: ['schema', selectedSchemaUid],
    queryFn: async () => {
      const result = await getSchemaByUid(ENV.REGISTRY, selectedSchemaUid as `0x${string}`);
      return result;
    },
    enabled: !!selectedSchemaUid,
  });

  // Update selectedSchema when data loads
  useEffect(() => {
    if (selectedSchemaUid) {
      const commonSchema = COMMON_SCHEMAS.find((s) => s.uid === selectedSchemaUid);

      if (commonSchema) {
        // Use hardcoded schema string first, fallback to API data
        setSelectedSchema({
          uid: selectedSchemaUid as `0x${string}`,
          name: commonSchema.name,
          schemaString: commonSchema.schemaString || schemaData?.schema || '',
          revocable: schemaData?.revocable ?? true,
        });
      } else if (schemaData) {
        // For custom schemas not in COMMON_SCHEMAS
        setSelectedSchema({
          uid: selectedSchemaUid as `0x${string}`,
          name: 'Custom Schema',
          schemaString: schemaData.schema || '',
          revocable: schemaData.revocable || false,
        });
      }
    }
  }, [schemaData, selectedSchemaUid]);

  const isWrongNetwork = isConnected && chainId !== ENV.CHAIN_ID;
  const canSubmit =
    isConnected && !isWrongNetwork && demoEnabled && formData.recipient && selectedSchema;

  const handleInputChange = (field: keyof AttestationFormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSchemaFormSubmit = async (
    encodedData: `0x${string}`,
    formValues: Record<string, unknown>
  ) => {
    if (!canSubmit || !selectedSchema) return;

    try {
      // Parse expiration time (0 means no expiration)
      const expirationTime = formData.expirationTime
        ? Math.floor(new Date(formData.expirationTime).getTime() / 1000)
        : 0;

      const attestationRequest = {
        schema: selectedSchema.uid,
        data: {
          recipient: formData.recipient as `0x${string}`,
          expirationTime: BigInt(expirationTime),
          revocable: formData.revocable,
          refUID:
            '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
          data: encodedData,
          value: 0n,
        },
      };

      writeContract({
        address: ENV.EAS,
        abi: EAS_ABI,
        functionName: 'attest',
        args: [attestationRequest],
        chain: polygonAmoy,
        account: address,
      });

      toast.success('Transaction submitted!');
    } catch (error) {
      console.error('Error submitting attestation:', error);
      toast.error('Failed to submit attestation');
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  // Reset form
  const resetForm = () => {
    setFormData({
      recipient: '',
      expirationTime: '',
      revocable: true,
    });
    setDemoEnabled(false);
    setSelectedSchemaUid(ENV.SCHEMA_UID);
  };

  // Success state
  if (isConfirmed && hash) {
    return (
      <>
        <SEO title="Attestation Created — Polyseal" path="/issue" />

        <div className="container py-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-2xl mx-auto text-center"
          >
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-6" />
            <h1 className="text-3xl font-bold mb-4">Attestation Created!</h1>
            <p className="text-muted-foreground mb-8">
              Your attestation has been successfully submitted to the blockchain.
            </p>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted rounded">
                  <span className="text-sm font-medium">Transaction Hash:</span>
                  <div className="flex items-center gap-2">
                    <code className="text-xs">
                      {hash.slice(0, 10)}...{hash.slice(-8)}
                    </code>
                    <Button variant="ghost" size="sm" onClick={() => copyToClipboard(hash)}>
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <a href={`/attestations?uid=${attestationUid}`}>View Attestation</a>
                  </Button>
                  <Button asChild variant="outline">
                    <a href={`${ENV.SCANNER}/tx/${hash}`} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      PolygonScan
                    </a>
                  </Button>
                </div>

                <Button variant="ghost" onClick={resetForm} className="w-full">
                  Create Another Attestation
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </>
    );
  }

  return (
    <>
      <SEO title="Issue Attestation — Polyseal" path="/issue" />

      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold mb-4">Issue Attestation</h1>
            <p className="text-xl text-muted-foreground">
              Create a new attestation on Polygon Amoy testnet using EAS schemas.
            </p>
          </div>

          {!isConnected ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <Wallet className="w-16 h-16 text-primary mx-auto mb-6" />
                <h2 className="text-2xl font-bold mb-4">Connect Your Wallet</h2>
                <p className="text-muted-foreground mb-6">
                  You need to connect your wallet to create attestations.
                </p>
                <ConnectButton />
              </CardContent>
            </Card>
          ) : isWrongNetwork ? (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Please switch to Polygon Amoy testnet (Chain ID: {ENV.CHAIN_ID}) to create
                attestations.
              </AlertDescription>
            </Alert>
          ) : (
            <div className="space-y-6">
              {/* Demo Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>
                      This is a demo feature that writes to Polygon Amoy testnet. Gas fees required.
                    </span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="demo-toggle" className="text-sm">
                        Enable Demo
                      </Label>
                      <Switch
                        id="demo-toggle"
                        checked={demoEnabled}
                        onCheckedChange={setDemoEnabled}
                      />
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Schema Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Select Schema
                  </CardTitle>
                  <CardDescription>
                    Choose an EAS schema to structure your attestation data.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="schema-select">Schema</Label>
                    <Select
                      value={selectedSchemaUid}
                      onValueChange={setSelectedSchemaUid}
                      disabled={!demoEnabled}
                    >
                      <SelectTrigger id="schema-select">
                        <SelectValue placeholder="Select a schema" />
                      </SelectTrigger>
                      <SelectContent>
                        {COMMON_SCHEMAS.map((schema) => (
                          <SelectItem key={schema.uid} value={schema.uid}>
                            <div className="flex flex-col">
                              <span className="font-medium">{schema.name}</span>
                              <span className="text-xs text-muted-foreground">
                                {schema.description}
                              </span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {schemaLoading && (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Loading schema definition...</span>
                    </div>
                  )}

                  {selectedSchema && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted rounded">
                        <span className="text-sm font-medium">Schema UID:</span>
                        <div className="flex items-center gap-2">
                          <code className="text-xs">
                            {selectedSchema.uid.slice(0, 10)}...{selectedSchema.uid.slice(-8)}
                          </code>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => copyToClipboard(selectedSchema.uid)}
                          >
                            <Copy className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {selectedSchema.schemaString && (
                        <div>
                          <span className="text-sm text-muted-foreground block mb-1">
                            Schema Definition:
                          </span>
                          <code className="block px-3 py-2 bg-muted rounded text-xs break-all">
                            {selectedSchema.schemaString}
                          </code>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Attestation Metadata */}
              <Card>
                <CardHeader>
                  <CardTitle>Attestation Metadata</CardTitle>
                  <CardDescription>Configure recipient and attestation properties.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="recipient">Recipient Address</Label>
                    <Input
                      id="recipient"
                      type="text"
                      placeholder="0x..."
                      value={formData.recipient}
                      onChange={(e) => handleInputChange('recipient', e.target.value)}
                      disabled={!demoEnabled}
                    />
                  </div>

                  <div>
                    <Label htmlFor="expiration">Expiration Time (Optional)</Label>
                    <Input
                      id="expiration"
                      type="datetime-local"
                      value={formData.expirationTime}
                      onChange={(e) => handleInputChange('expirationTime', e.target.value)}
                      disabled={!demoEnabled}
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="revocable"
                      checked={formData.revocable}
                      onCheckedChange={(checked) => handleInputChange('revocable', checked)}
                      disabled={!demoEnabled}
                    />
                    <Label htmlFor="revocable">Revocable</Label>
                  </div>
                </CardContent>
              </Card>

              {/* Dynamic Schema Form */}
              {selectedSchema && selectedSchema.schemaString && (
                <Card>
                  <CardHeader>
                    <CardTitle>Attestation Data</CardTitle>
                    <CardDescription>Fill in the schema-specific fields below.</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {writeError && (
                      <Alert variant="destructive" className="mb-4">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>Error: {writeError.message}</AlertDescription>
                      </Alert>
                    )}

                    <SchemaFormGenerator
                      schemaString={selectedSchema.schemaString}
                      onSubmit={handleSchemaFormSubmit}
                      disabled={!canSubmit || isPending || isConfirming}
                      submitLabel={
                        isPending || isConfirming
                          ? isPending
                            ? 'Submitting...'
                            : 'Confirming...'
                          : 'Create Attestation'
                      }
                    />

                    {!demoEnabled && (
                      <p className="text-xs text-muted-foreground text-center mt-2">
                        Enable demo mode to create attestations
                      </p>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </>
  );
}
