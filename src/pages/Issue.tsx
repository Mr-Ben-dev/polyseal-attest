import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { ENV } from '@/lib/env';
import SEO from '@/ui/SEO';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    AlertTriangle,
    CheckCircle,
    Copy,
    ExternalLink,
    FileText,
    Loader2,
    Wallet
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
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
] as const;

interface AttestationFormData {
  recipient: string;
  data: string;
  expirationTime: string;
  revocable: boolean;
}

export default function Issue() {
  const { address, isConnected, chainId } = useAccount();
  const [formData, setFormData] = useState<AttestationFormData>({
    recipient: '',
    data: '',
    expirationTime: '',
    revocable: true,
  });
  const [demoEnabled, setDemoEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { writeContract, data: hash, error: writeError, isPending } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });

  const isWrongNetwork = isConnected && chainId !== ENV.CHAIN_ID;
  const canSubmit = isConnected && !isWrongNetwork && demoEnabled && formData.recipient && formData.data;

  const handleInputChange = (field: keyof AttestationFormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;

    setIsSubmitting(true);
    
    try {
      // Parse expiration time (0 means no expiration)
      const expirationTime = formData.expirationTime 
        ? Math.floor(new Date(formData.expirationTime).getTime() / 1000)
        : 0;

      // Encode the data as bytes (simple string to hex conversion for demo)
      const encodedData = `0x${Buffer.from(formData.data, 'utf8').toString('hex')}` as `0x${string}`;

      const attestationRequest = {
        schema: ENV.SCHEMA_UID,
        data: {
          recipient: formData.recipient as `0x${string}`,
          expirationTime: BigInt(expirationTime),
          revocable: formData.revocable,
          refUID: '0x0000000000000000000000000000000000000000000000000000000000000000' as `0x${string}`,
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

    } catch (error) {
      console.error('Error submitting attestation:', error);
      toast.error('Failed to submit attestation');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
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
                    <code className="text-xs">{hash.slice(0, 10)}...{hash.slice(-8)}</code>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => copyToClipboard(hash)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button asChild className="flex-1">
                    <a href={`/attestations?uid=${hash}`}>
                      View Attestation
                    </a>
                  </Button>
                  <Button asChild variant="outline">
                    <a 
                      href={`${ENV.SCANNER}/tx/${hash}`}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      PolygonScan
                    </a>
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  onClick={() => {
                    setFormData({
                      recipient: '',
                      data: '',
                      expirationTime: '',
                      revocable: true,
                    });
                    setDemoEnabled(false);
                  }}
                  className="w-full"
                >
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
              Create a new attestation on the Polyseal schema (Polygon Amoy testnet).
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
                Please switch to Polygon Amoy testnet (Chain ID: {ENV.CHAIN_ID}) to create attestations.
              </AlertDescription>
            </Alert>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Demo Warning */}
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="flex items-center justify-between">
                    <span>This is a demo feature that writes to Polygon Amoy testnet. Gas fees required.</span>
                    <div className="flex items-center gap-2">
                      <Label htmlFor="demo-toggle" className="text-sm">Enable Demo</Label>
                      <Switch
                        id="demo-toggle"
                        checked={demoEnabled}
                        onCheckedChange={setDemoEnabled}
                      />
                    </div>
                  </div>
                </AlertDescription>
              </Alert>

              {/* Schema Info */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" />
                    Polyseal Schema
                  </CardTitle>
                  <CardDescription>
                    Attestations will be created using the Polyseal schema on EAS.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-3 bg-muted rounded">
                    <span className="text-sm font-medium">Schema UID:</span>
                    <div className="flex items-center gap-2">
                      <code className="text-xs">{ENV.SCHEMA_UID.slice(0, 10)}...{ENV.SCHEMA_UID.slice(-8)}</code>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => copyToClipboard(ENV.SCHEMA_UID)}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Form Fields */}
              <Card>
                <CardHeader>
                  <CardTitle>Attestation Details</CardTitle>
                  <CardDescription>
                    Fill in the attestation information below.
                  </CardDescription>
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
                    <Label htmlFor="data">Attestation Data</Label>
                    <Textarea
                      id="data"
                      placeholder="Enter the attestation data (will be encoded as bytes)"
                      rows={4}
                      value={formData.data}
                      onChange={(e) => handleInputChange('data', e.target.value)}
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

              {/* Submit Button */}
              <Card>
                <CardContent className="pt-6">
                  {writeError && (
                    <Alert variant="destructive" className="mb-4">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>
                        Error: {writeError.message}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={!canSubmit || isPending || isConfirming}
                  >
                    {isPending || isConfirming ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {isPending ? 'Submitting...' : 'Confirming...'}
                      </>
                    ) : (
                      <>
                        <FileText className="w-4 h-4 mr-2" />
                        Create Attestation
                      </>
                    )}
                  </Button>
                  
                  {!demoEnabled && (
                    <p className="text-xs text-muted-foreground text-center mt-2">
                      Enable demo mode to create attestations
                    </p>
                  )}
                </CardContent>
              </Card>
            </form>
          )}
        </motion.div>
      </div>
    </>
  );
}