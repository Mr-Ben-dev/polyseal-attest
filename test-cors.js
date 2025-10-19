// Test script to validate CORS configuration
// Run with: node test-cors.js

const testOrigins = [
  'https://polyseal-jade.vercel.app',
  'http://localhost:5173',
  'https://another-domain.com', // Should not be allowed
  undefined, // No origin
];

async function testCORS() {
  console.log('Testing CORS configuration...\n');
  
  for (const origin of testOrigins) {
    console.log(`Testing origin: ${origin || 'undefined'}`);
    
    try {
      const headers = {};
      if (origin) {
        headers['Origin'] = origin;
      }
      
      const response = await fetch('http://localhost:3000/api/health', {
        method: 'OPTIONS',
        headers,
      });
      
      const corsHeaders = {
        'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
        'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
        'Vary': response.headers.get('Vary'),
      };
      
      console.log('Response headers:', corsHeaders);
      console.log('Status:', response.status);
      
    } catch (error) {
      console.log('Error:', error.message);
    }
    
    console.log('---\n');
  }
}

// Only run if this file is executed directly
if (require.main === module) {
  testCORS().catch(console.error);
}

module.exports = { testCORS };