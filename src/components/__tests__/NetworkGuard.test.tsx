import { render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { useChainId } from 'wagmi'
import { polygonAmoy } from 'wagmi/chains'
import { NetworkGuard } from '../NetworkGuard'

// Mock wagmi hooks
vi.mock('wagmi', () => ({
  useChainId: vi.fn(),
}))

// Mock child component
const TestChild = () => <div>Test Content</div>

describe('NetworkGuard', () => {
  it('renders children when on correct network', () => {
    vi.mocked(useChainId).mockReturnValue(polygonAmoy.id)

    render(
      <NetworkGuard>
        <TestChild />
      </NetworkGuard>
    )

    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('shows network switch prompt when on wrong network', () => {
    vi.mocked(useChainId).mockReturnValue(1) // Ethereum mainnet

    render(
      <NetworkGuard>
        <TestChild />
      </NetworkGuard>
    )

    expect(screen.getByText(/Please switch to Polygon Amoy/i)).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })

  it('shows fallback when chain ID is undefined', () => {
    vi.mocked(useChainId).mockReturnValue(undefined)

    render(
      <NetworkGuard>
        <TestChild />
      </NetworkGuard>
    )

    expect(screen.getByText(/Please connect your wallet/i)).toBeInTheDocument()
    expect(screen.queryByText('Test Content')).not.toBeInTheDocument()
  })
})