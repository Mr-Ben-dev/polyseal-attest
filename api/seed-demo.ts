import type { VercelRequest, VercelResponse } from '@vercel/node';
import { encodeAbiParameters, parseAbiParameters } from 'viem';
import { cors } from './_lib/cors';

// Demo data templates
const NAMES = [
  'Alice Johnson',
  'Bob Smith',
  'Carol Williams',
  'David Brown',
  'Eve Davis',
  'Frank Miller',
  'Grace Wilson',
  'Henry Moore',
  'Ivy Taylor',
  'Jack Anderson',
];
const COMPANIES = [
  'TechCorp',
  'DataSystems',
  'BlockchainLab',
  'CryptoInnovations',
  'Web3Ventures',
  'DecentralizedApps',
  'SmartContracts Inc',
  'DeFi Solutions',
  'NFT Studios',
  'MetaverseCo',
];
const SKILLS = [
  'Solidity',
  'TypeScript',
  'React',
  'Node.js',
  'Python',
  'Go',
  'Rust',
  'Web3.js',
  'Ethers.js',
  'Hardhat',
];
const UNIVERSITIES = [
  'MIT',
  'Stanford',
  'Berkeley',
  'Harvard',
  'Oxford',
  'Cambridge',
  'ETH Zurich',
  'NUS',
  'Tokyo Tech',
  'Tsinghua',
];
const DEGREES = [
  'Computer Science',
  'Blockchain Engineering',
  'Mathematics',
  'Physics',
  'Economics',
  'Data Science',
  'Cryptography',
  'Software Engineering',
];

// Schema definitions
const SCHEMAS = [
  {
    uid: '0x27d06e3659317e9a4f8154d1e849eb53d43d91fb4f219884d1684f86d797804a',
    name: 'Identity Verification',
    schema: 'string name, string email, uint256 timestamp',
    generator: () => {
      const name = NAMES[Math.floor(Math.random() * NAMES.length)];
      const email = `${name.toLowerCase().replace(' ', '.')}@example.com`;
      const timestamp = BigInt(Date.now() - Math.floor(Math.random() * 365 * 24 * 60 * 60 * 1000));
      return { name, email, timestamp };
    },
  },
  {
    uid: '0x93f80b4674cbd9f74ddbd3cf593f463dd3a87cd9f002e5fe2a8048ef2d5eaa5a',
    name: 'Employment Credential',
    schema:
      'string employeeName, string company, string position, uint256 startDate, bool isActive',
    generator: () => {
      const employeeName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const company = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
      const position = [
        'Software Engineer',
        'Blockchain Developer',
        'Smart Contract Auditor',
        'DevOps Engineer',
        'Technical Lead',
      ][Math.floor(Math.random() * 5)];
      const startDate = BigInt(
        Date.now() - Math.floor(Math.random() * 3 * 365 * 24 * 60 * 60 * 1000)
      );
      const isActive = Math.random() > 0.3;
      return { employeeName, company, position, startDate, isActive };
    },
  },
  {
    uid: '0x3eb39e89d37aa75c64380bdf3b66c245b1e0aae23cb2d2599bcb17f218cb68ee',
    name: 'Skill Certification',
    schema:
      'string holderName, string skillName, uint256 proficiencyLevel, string certifier, uint256 issuedDate',
    generator: () => {
      const holderName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const skillName = SKILLS[Math.floor(Math.random() * SKILLS.length)];
      const proficiencyLevel = BigInt(Math.floor(Math.random() * 5) + 1);
      const certifier = COMPANIES[Math.floor(Math.random() * COMPANIES.length)];
      const issuedDate = BigInt(
        Date.now() - Math.floor(Math.random() * 2 * 365 * 24 * 60 * 60 * 1000)
      );
      return { holderName, skillName, proficiencyLevel, certifier, issuedDate };
    },
  },
  {
    uid: '0x7f3e1c8b9a4d2e6f5c8b1a3d7e9f2c4a6b8d0e1f3a5c7b9d1e3f5a7c9b0d2e4f6',
    name: 'Education Credential',
    schema:
      'string studentName, string university, string degree, uint256 graduationYear, bool verified',
    generator: () => {
      const studentName = NAMES[Math.floor(Math.random() * NAMES.length)];
      const university = UNIVERSITIES[Math.floor(Math.random() * UNIVERSITIES.length)];
      const degree = DEGREES[Math.floor(Math.random() * DEGREES.length)];
      const graduationYear = BigInt(2015 + Math.floor(Math.random() * 10));
      const verified = Math.random() > 0.1;
      return { studentName, university, degree, graduationYear, verified };
    },
  },
  {
    uid: '0x1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b',
    name: 'Reputation Score',
    schema: 'address user, uint256 score, string category, uint256 lastUpdated',
    generator: () => {
      const user = `0x${Math.random().toString(16).substr(2, 40)}`;
      const score = BigInt(Math.floor(Math.random() * 1000));
      const category = ['Developer', 'Contributor', 'Reviewer', 'Mentor', 'Community Leader'][
        Math.floor(Math.random() * 5)
      ];
      const lastUpdated = BigInt(Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000));
      return { user, score, category, lastUpdated };
    },
  },
];

// Generate random wallet address
function randomAddress(): string {
  return `0x${Math.random().toString(16).substr(2, 40)}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Apply CORS
  if (cors(req, res)) return;

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { count = 100 } = req.body;
    const maxCount = 150; // Limit to prevent abuse
    const actualCount = Math.min(count, maxCount);

    const demoAttestations = [];

    for (let i = 0; i < actualCount; i++) {
      // Randomly select a schema
      const schemaTemplate = SCHEMAS[Math.floor(Math.random() * SCHEMAS.length)];

      // Generate data for the schema
      const data = schemaTemplate.generator();

      // Encode the data
      const abiParams = parseAbiParameters(schemaTemplate.schema);
      const values = Object.values(data);
      const encodedData = encodeAbiParameters(abiParams, values);

      // Create attestation object
      const attestation = {
        uid: `0x${Math.random().toString(16).substr(2, 64)}`, // Fake UID for demo
        schema: schemaTemplate.uid,
        schemaName: schemaTemplate.name,
        recipient: randomAddress(),
        attester: randomAddress(),
        time: Date.now() - Math.floor(Math.random() * 180 * 24 * 60 * 60 * 1000), // Within last 6 months
        expirationTime: 0, // No expiration
        revocationTime:
          Math.random() > 0.9
            ? Date.now() - Math.floor(Math.random() * 30 * 24 * 60 * 60 * 1000)
            : 0, // 10% revoked
        revocable: true,
        refUID: '0x0000000000000000000000000000000000000000000000000000000000000000',
        data: encodedData,
        decodedData: data,
      };

      demoAttestations.push(attestation);
    }

    return res.status(200).json({
      success: true,
      count: demoAttestations.length,
      attestations: demoAttestations,
      message: `Generated ${demoAttestations.length} demo attestations across ${SCHEMAS.length} schemas`,
      schemas: SCHEMAS.map((s) => ({ uid: s.uid, name: s.name, schema: s.schema })),
    });
  } catch (error) {
    console.error('Error generating demo data:', error);

    return res.status(500).json({
      error: 'Failed to generate demo data',
      message: error instanceof Error ? error.message : 'Unknown error',
    });
  }
}
