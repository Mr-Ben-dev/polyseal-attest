import { describe, expect, it } from 'vitest'
import { isValidEthereumAddress, truncateAddress } from '../utils'

describe('Utils', () => {
  describe('truncateAddress', () => {
    it('truncates Ethereum addresses correctly', () => {
      const address = '0x742d35Cc6634C0532925a3b8D6Ac6fFDB59d7C7B'
      const result = truncateAddress(address)
      expect(result).toBe('0x742d...7C7B')
    })

    it('handles short addresses', () => {
      const address = '0x123'
      const result = truncateAddress(address)
      expect(result).toBe('0x123')
    })

    it('handles custom length', () => {
      const address = '0x742d35Cc6634C0532925a3b8D6Ac6fFDB59d7C7B'
      const result = truncateAddress(address, 6)
      expect(result).toBe('0x742d35...9d7C7B')
    })
  })

  describe('isValidEthereumAddress', () => {
    it('validates correct Ethereum addresses', () => {
      expect(isValidEthereumAddress('0x742d35Cc6634C0532925a3b8D6Ac6fFDB59d7C7B')).toBe(true)
      expect(isValidEthereumAddress('0x0000000000000000000000000000000000000000')).toBe(true)
    })

    it('rejects invalid addresses', () => {
      expect(isValidEthereumAddress('invalid')).toBe(false)
      expect(isValidEthereumAddress('0x123')).toBe(false)
      expect(isValidEthereumAddress('')).toBe(false)
      expect(isValidEthereumAddress('0xGGGG35Cc6634C0532925a3b8D6Ac6fFDB59d7C7B')).toBe(false)
    })
  })
})