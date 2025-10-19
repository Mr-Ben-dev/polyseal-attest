import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { INVALID_UIDS, SAMPLE_ATTESTATIONS, type SampleAttestation } from '@/data/sampleAttestations';
import { analytics } from '@/lib/analytics';
import SEO from '@/ui/SEO';
import { motion } from 'framer-motion';
import { AlertTriangle, CheckCircle, ExternalLink, Play, XCircle } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function JudgeMode() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'valid' | 'invalid' | 'edge-case'>('all');

  const handleTryAttestation = (attestation: SampleAttestation | typeof INVALID_UIDS[0]) => {
    analytics.tryDemoUID(attestation.uid);
    
    // Navigate to attestations page with the UID pre-filled
    navigate(`/attestations?uid=${encodeURIComponent(attestation.uid)}`);
  };

  const filteredAttestations = selectedCategory === 'all' 
    ? SAMPLE_ATTESTATIONS 
    : SAMPLE_ATTESTATIONS.filter(a => a.category === selectedCategory);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'valid': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'invalid': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'edge-case': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      default: return null;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'valid': return 'bg-green-100 text-green-800 border-green-200';
      case 'invalid': return 'bg-red-100 text-red-800 border-red-200';
      case 'edge-case': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <>
      <SEO title="Judge Mode — Polyseal Demo" path="/demo" />
      
      <div className="container py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Play className="w-8 h-8 text-primary" />
            </motion.div>
            
            <h1 className="text-4xl font-bold mb-4">Judge Mode</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Test Polyseal with pre-selected attestation UIDs. Click any example to see how the system handles different scenarios.
            </p>
            
            {/* Info Banner */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8 text-blue-800"
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5" />
                <span className="font-semibold">Interactive Demo</span>
              </div>
              <p className="text-sm mb-2">
                These test cases demonstrate different scenarios you might encounter when working with EAS attestations:
              </p>
              <ul className="text-sm space-y-1 ml-4">
                <li>• <strong>Edge Cases:</strong> Test boundary conditions and special scenarios</li>
                <li>• <strong>Error Cases:</strong> See how the system handles invalid or non-existent UIDs</li>
                <li>• <strong>Real Data:</strong> Interact with actual blockchain data from Polygon Amoy</li>
              </ul>
            </motion.div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-8 justify-center">
            {[
              { key: 'all', label: 'All Examples', count: SAMPLE_ATTESTATIONS.length },
              { key: 'valid', label: 'Valid Cases', count: SAMPLE_ATTESTATIONS.filter(a => a.category === 'valid').length },
              { key: 'edge-case', label: 'Edge Cases', count: SAMPLE_ATTESTATIONS.filter(a => a.category === 'edge-case').length },
              { key: 'invalid', label: 'Error Cases', count: SAMPLE_ATTESTATIONS.filter(a => a.category === 'invalid').length + INVALID_UIDS.length },
            ].map((category) => (
              <Button
                key={category.key}
                variant={selectedCategory === category.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(category.key as 'all' | 'valid' | 'invalid' | 'edge-case')}
                className="text-sm"
              >
                {category.label} ({category.count})
              </Button>
            ))}
          </div>

          {/* Valid & Edge Case Attestations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {filteredAttestations.map((attestation, index) => (
              <motion.div
                key={attestation.uid}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between gap-2">
                      <CardTitle className="text-lg leading-tight">
                        {attestation.title}
                      </CardTitle>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getCategoryIcon(attestation.category)}
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getCategoryColor(attestation.category)}`}
                        >
                          {attestation.category}
                        </Badge>
                      </div>
                    </div>
                    <CardDescription className="text-sm">
                      {attestation.description}
                    </CardDescription>
                  </CardHeader>
                  
                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      {/* UID Display */}
                      <div>
                        <label className="text-xs font-medium text-muted-foreground block mb-1">
                          Attestation UID
                        </label>
                        <code className="text-xs bg-muted p-2 rounded block break-all font-mono">
                          {attestation.uid}
                        </code>
                      </div>
                      
                      {/* Expected Outcome */}
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Expected: {' '}
                          <span className={attestation.expectedOutcome === 'success' ? 'text-green-600' : 'text-red-600'}>
                            {attestation.expectedOutcome}
                          </span>
                        </span>
                        
                        <Button
                          size="sm"
                          onClick={() => handleTryAttestation(attestation)}
                          className="text-xs h-8"
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Try It
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Invalid UIDs Section */}
          {(selectedCategory === 'all' || selectedCategory === 'invalid') && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                <XCircle className="w-6 h-6 text-red-500" />
                Invalid UID Formats
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {INVALID_UIDS.map((invalid, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base text-red-700">
                        {invalid.title}
                      </CardTitle>
                      <CardDescription className="text-xs">
                        {invalid.description}
                      </CardDescription>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        <div>
                          <code className="text-xs bg-red-50 text-red-800 p-2 rounded block break-all font-mono border border-red-200">
                            {invalid.uid || '(empty)'}
                          </code>
                        </div>
                        
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleTryAttestation(invalid)}
                          className="text-xs h-8 w-full"
                        >
                          <AlertTriangle className="w-3 h-3 mr-1" />
                          Test Error
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </motion.div>
          )}

          {/* Instructions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-50 border border-blue-200 rounded-lg p-6"
          >
            <h3 className="font-semibold text-blue-900 mb-3">How to Use Judge Mode</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">1.</span>
                Choose a category or browse all examples above
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">2.</span>
                Click "Try It" on any attestation to test the lookup
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">3.</span>
                Observe how Polyseal handles valid attestations, edge cases, and errors
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold text-blue-600">4.</span>
                Use this to understand the system before working with real data
              </li>
            </ul>
            
            <div className="mt-4 pt-4 border-t border-blue-200">
              <Button asChild variant="outline" className="text-blue-700 border-blue-300">
                <a 
                  href="/docs/getting-started"
                  className="inline-flex items-center gap-2"
                >
                  <ExternalLink className="w-4 h-4" />
                  View Documentation
                </a>
              </Button>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
}