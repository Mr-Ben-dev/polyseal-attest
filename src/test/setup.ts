import '@testing-library/jest-dom'
import { beforeAll, vi } from 'vitest'

// Mock Web3 APIs
beforeAll(() => {
  // Mock window.ethereum
  Object.defineProperty(window, 'ethereum', {
    writable: true,
    value: {
      isMetaMask: true,
      request: vi.fn(),
      on: vi.fn(),
      removeListener: vi.fn(),
    },
  })

  // Mock navigator.serviceWorker
  Object.defineProperty(navigator, 'serviceWorker', {
    writable: true,
    value: {
      register: vi.fn(() => Promise.resolve()),
    },
  })

  // Mock console methods to reduce noise in tests
  vi.spyOn(console, 'log').mockImplementation(() => {})
  vi.spyOn(console, 'warn').mockImplementation(() => {})
})

// Global test utilities
export const mockWalletAddress = '0x742d35Cc6634C0532925a3b8D6Ac6f2'
export const mockAttestation = {
  id: '0x123',
  uid: '0x456',
  schema: '0x789',
  recipient: mockWalletAddress,
  attester: '0x999',
  time: Date.now(),
  data: '0xdata',
  revoked: false,
}