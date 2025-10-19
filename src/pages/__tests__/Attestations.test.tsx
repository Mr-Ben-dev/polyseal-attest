import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { mockAttestation } from '../../test/setup'
import Attestations from '../Attestations'

// Mock the EAS hook
vi.mock('../../hooks/useAttestations', () => ({
  useAttestationByUID: vi.fn(),
}))

// Mock analytics
vi.mock('../../lib/analytics', () => ({
  analytics: {
    captureEvent: vi.fn(),
  },
}))

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}

describe('Attestations Page', () => {
  it('renders attestation lookup form', () => {
    const { useAttestationByUID } = require('../../hooks/useAttestations')
    useAttestationByUID.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    })

    render(<Attestations />, { wrapper: createWrapper() })

    expect(screen.getByText('Attestation Lookup')).toBeInTheDocument()
    expect(screen.getByPlaceholderText(/Enter attestation UID/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /lookup/i })).toBeInTheDocument()
  })

  it('shows loading state when searching', async () => {
    const { useAttestationByUID } = require('../../hooks/useAttestations')
    useAttestationByUID.mockReturnValue({
      data: null,
      isLoading: true,
      error: null,
    })

    render(<Attestations />, { wrapper: createWrapper() })

    expect(screen.getByText(/searching/i)).toBeInTheDocument()
  })

  it('displays attestation data when found', async () => {
    const { useAttestationByUID } = require('../../hooks/useAttestations')
    useAttestationByUID.mockReturnValue({
      data: mockAttestation,
      isLoading: false,
      error: null,
    })

    render(<Attestations />, { wrapper: createWrapper() })

    await waitFor(() => {
      expect(screen.getByText('Attestation Details')).toBeInTheDocument()
      expect(screen.getByText(mockAttestation.uid)).toBeInTheDocument()
    })
  })

  it('shows error message when attestation not found', async () => {
    const { useAttestationByUID } = require('../../hooks/useAttestations')
    useAttestationByUID.mockReturnValue({
      data: null,
      isLoading: false,
      error: new Error('Attestation not found'),
    })

    render(<Attestations />, { wrapper: createWrapper() })

    expect(screen.getByText(/not found/i)).toBeInTheDocument()
  })

  it('handles UID input correctly', async () => {
    const user = userEvent.setup()
    const { useAttestationByUID } = require('../../hooks/useAttestations')
    useAttestationByUID.mockReturnValue({
      data: null,
      isLoading: false,
      error: null,
    })

    render(<Attestations />, { wrapper: createWrapper() })

    const input = screen.getByPlaceholderText(/Enter attestation UID/i)
    await user.type(input, '0x123456')

    expect(input).toHaveValue('0x123456')
  })
})