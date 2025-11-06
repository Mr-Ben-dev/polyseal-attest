export const ENV = {
  CHAIN_ID: Number(import.meta.env.VITE_CHAIN_ID || 80002),
  RPC: import.meta.env.VITE_RPC_URL || 'https://rpc-amoy.polygon.technology',
  SCANNER: import.meta.env.VITE_SCANNER_BASE || 'https://amoy.polygonscan.com',
  EAS: (import.meta.env.VITE_EAS_ADDRESS ||
    '0xb101275a60d8bfb14529C421899aD7CA1Ae5B5Fc') as `0x${string}`,
  REGISTRY: (import.meta.env.VITE_SCHEMA_REGISTRY ||
    '0x23c5701A1BDa89C61d181BD79E5203c730708AE7') as `0x${string}`,
  SCHEMA_UID: (import.meta.env.VITE_POLYSEAL_SCHEMA_UID ||
    '0x27d06e3659317e9a4f8154d1e849eb53d3d91fb4f219884d1684f86d797804a') as `0x${string}`,
  SESSIONPAY: (import.meta.env.VITE_SESSIONPAY_ADDRESS ||
    '0xE23EF3e9A5903cB8F68334FCAfDb89d50541d235') as `0x${string}`,
  MOCKUSDC: (import.meta.env.VITE_MOCKUSDC_ADDRESS ||
    '0xcF28F960aA85b051D030374B1ACd14668abaAf3e') as `0x${string}`,
  WALLETCONNECT_PROJECT_ID:
    import.meta.env.VITE_WALLETCONNECT_PROJECT_ID || '819c488197a77d15c78fc60950b32fe2',
  EAS_SUBGRAPH_URL: import.meta.env.VITE_EAS_SUBGRAPH_URL || '',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Polyseal',
  API_TIMEOUT: Number(import.meta.env.VITE_API_TIMEOUT || 30000),
  SERVER_URL: import.meta.env.VITE_SERVER_URL || '',
  ENABLE_DEBUG: import.meta.env.VITE_ENABLE_DEBUG === 'true',
};
