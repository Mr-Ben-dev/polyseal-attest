import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/hooks/use-toast';
import { EAS_ABI, MOCKUSDC_ABI, SCHEMA_REGISTRY_ABI } from '@/lib/abis';
import { analytics } from '@/lib/analytics';
import { ENV } from '@/lib/env';
import SEO from '@/ui/SEO';
import { motion } from 'framer-motion';
import { CheckCircle, Code, Copy, ExternalLink, Loader2, Play } from 'lucide-react';
import { useState } from 'react';
import type { Abi } from 'viem';
import { useReadContract } from 'wagmi';

export default function Contracts() {
  const explorerLink = (address: string) => `${ENV.SCANNER}/address/${address}`;
  const [copied, setCopied] = useState<string | null>(null);
  const [testInputs, setTestInputs] = useState<Record<string, string>>({});
  const [expandedContract, setExpandedContract] = useState<string | null>(null);

  const copyAddress = (address: string, name: string) => {
    navigator.clipboard.writeText(address);
    setCopied(address);
    toast({
      title: 'Copied!',
      description: `${name} address copied to clipboard`,
    });
    analytics.copyContract(name);
    setTimeout(() => setCopied(null), 2000);
  };

  const copyABI = (abi: Abi, name: string) => {
    navigator.clipboard.writeText(JSON.stringify(abi, (key, value) => 
      typeof value === 'bigint' ? value.toString() : value, 2
    ));
    toast({
      title: 'ABI Copied!',
      description: `${name} ABI copied to clipboard`,
    });
    analytics.copyToClipboard(`${name}_abi`);
  };

  // Contract test read component
  const ContractTestRead = ({ contract }: { contract: typeof contracts[0] }) => {
    const [selectedFunction, setSelectedFunction] = useState<string>('');
    const [testParams, setTestParams] = useState<string[]>([]);
    
    const selectedFunc = contract.testFunctions.find(f => f.name === selectedFunction);
    
    const { data, error, isLoading, refetch } = useReadContract({
      address: contract.address as `0x${string}`,
      abi: contract.abi as Abi,
      functionName: selectedFunction,
      args: testParams.length > 0 ? testParams : undefined,
      query: { enabled: false }
    } as any);

    const handleTest = () => {
      if (!selectedFunc) return;
      
      analytics.testContractFunction(contract.name, selectedFunction);
      
      refetch();
    };

    return (
      <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
        <Label className="text-sm font-medium">Test Read Functions</Label>
        
        {contract.testFunctions.length === 0 ? (
          <p className="text-sm text-muted-foreground">No test functions available</p>
        ) : (
          <>
            <select
              value={selectedFunction}
              onChange={(e) => {
                setSelectedFunction(e.target.value);
                setTestParams([]);
              }}
              className="w-full p-2 border rounded-md bg-background"
            >
              <option value="">Select a function to test</option>
              {contract.testFunctions.map((func) => (
                <option key={func.name} value={func.name}>
                  {func.name} - {func.description}
                </option>
              ))}
            </select>

            {selectedFunc && selectedFunc.args.length > 0 && (
              <div className="space-y-2">
                {selectedFunc.args.map((arg, index) => (
                  <div key={arg}>
                    <Label className="text-xs">{arg}</Label>
                    <Input
                      placeholder={selectedFunc.placeholder || `Enter ${arg}`}
                      value={testParams[index] || ''}
                      onChange={(e) => {
                        const newParams = [...testParams];
                        newParams[index] = e.target.value;
                        setTestParams(newParams);
                      }}
                    />
                  </div>
                ))}
              </div>
            )}

            {selectedFunc && (
              <div className="space-y-2">
                <Button 
                  onClick={handleTest} 
                  disabled={isLoading || (selectedFunc.args.length > 0 && testParams.some(p => !p))}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Testing...
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-2" />
                      Test Function
                    </>
                  )}
                </Button>

                {data !== undefined && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-md">
                    <Label className="text-xs text-green-700">Result:</Label>
                    <pre className="text-sm text-green-800 mt-1 whitespace-pre-wrap">
                      {JSON.stringify(data, (key, value) => 
                        typeof value === 'bigint' ? value.toString() : value, 2
                      )}
                    </pre>
                  </div>
                )}

                {error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-md">
                    <Label className="text-xs text-red-700">Error:</Label>
                    <p className="text-sm text-red-800 mt-1">{error.message}</p>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const contracts = [
    {
      name: 'EAS',
      address: ENV.EAS,
      description: 'Ethereum Attestation Service main contract for creating and managing attestations.',
      abi: EAS_ABI,
      testFunctions: [
        {
          name: 'getSchemaRegistry',
          args: [],
          description: 'Get the schema registry contract address'
        },
        {
          name: 'getAttestation',
          args: ['uid'],
          description: 'Get attestation details by UID',
          placeholder: 'Enter attestation UID (0x...)'
        },
        {
          name: 'isAttestationValid',
          args: ['uid'],
          description: 'Check if attestation is valid',
          placeholder: 'Enter attestation UID (0x...)'
        }
      ]
    },
    {
      name: 'SchemaRegistry',
      address: ENV.REGISTRY,
      description: 'Registry contract for managing attestation schemas and their definitions.',
      abi: SCHEMA_REGISTRY_ABI,
      testFunctions: [
        {
          name: 'getSchema',
          args: ['uid'],
          description: 'Get schema details by UID',
          placeholder: 'Enter schema UID (0x...)'
        }
      ]
    },
    {
      name: 'SessionPay',
      address: ENV.SESSIONPAY,
      description: 'Payment contract for session-based transactions and gasless experiences.',
      abi: null, // No ABI for SessionPay in this demo
      testFunctions: []
    },
    {
      name: 'MockUSDC',
      address: ENV.MOCKUSDC,
      description: 'Test USDC token for development and testing on Polygon Amoy.',
      abi: MOCKUSDC_ABI,
      testFunctions: [
        {
          name: 'name',
          args: [],
          description: 'Get token name'
        },
        {
          name: 'symbol',
          args: [],
          description: 'Get token symbol'
        },
        {
          name: 'totalSupply',
          args: [],
          description: 'Get total token supply'
        },
        {
          name: 'balanceOf',
          args: ['account'],
          description: 'Get token balance of address',
          placeholder: 'Enter address (0x...)'
        }
      ]
    },
  ];

  return (
    <>
      <SEO title="Contracts — Polyseal" path="/contracts" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto mb-12"
        >
          <h1 className="mb-4">Smart Contracts</h1>
          <p className="text-xl text-muted-foreground">
            All Polyseal contracts deployed on Polygon Amoy testnet. Verified and publicly accessible.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 max-w-4xl mx-auto">
          {contracts.map((contract, i) => (
            <motion.div
              key={contract.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass-card p-6"
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div>
                  <h2 className="text-2xl font-bold mb-1">{contract.name}</h2>
                  <p className="text-sm text-muted-foreground">{contract.description}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-muted rounded-lg mb-4">
                <code className="flex-1 text-sm break-all">{contract.address}</code>
                <button
                  onClick={() => copyAddress(contract.address, contract.name)}
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="Copy address"
                >
                  {copied === contract.address ? (
                    <CheckCircle className="w-4 h-4 text-primary" />
                  ) : (
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  )}
                </button>
                <a
                  href={explorerLink(contract.address)}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 hover:bg-background rounded transition-colors"
                  title="View on PolygonScan"
                >
                  <ExternalLink className="w-4 h-4 text-muted-foreground" />
                </a>
              </div>

              {/* ABI and Test Section */}
              <div className="space-y-4">
                {contract.abi && (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyABI(contract.abi, contract.name)}
                      className="flex-1"
                    >
                      <Code className="w-4 h-4 mr-2" />
                      Copy ABI
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setExpandedContract(expandedContract === contract.name ? null : contract.name)}
                      className="flex-1"
                    >
                      <Play className="w-4 h-4 mr-2" />
                      {expandedContract === contract.name ? 'Hide Tests' : 'Test Functions'}
                    </Button>
                  </div>
                )}

                {expandedContract === contract.name && contract.abi && (
                  <ContractTestRead contract={contract} />
                )}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Network Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="glass-card p-6 max-w-4xl mx-auto mt-8"
        >
          <h3 className="text-xl font-bold mb-4">Network Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Chain ID:</span>
              <span className="ml-2 font-mono font-medium">{ENV.CHAIN_ID}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Network:</span>
              <span className="ml-2 font-medium">Polygon Amoy Testnet</span>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">RPC URL:</span>
              <code className="ml-2 px-2 py-1 bg-muted rounded text-xs">{ENV.RPC}</code>
            </div>
            <div className="md:col-span-2">
              <span className="text-muted-foreground">Explorer:</span>
              <a
                href={ENV.SCANNER}
                target="_blank"
                rel="noreferrer"
                className="ml-2 text-primary hover:text-primary/80 inline-flex items-center gap-1"
              >
                {ENV.SCANNER}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
}
