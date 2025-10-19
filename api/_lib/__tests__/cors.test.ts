import { describe, expect, it, vi } from 'vitest'
import { cors } from '../cors'

// Mock VercelRequest and VercelResponse
const createMockRequest = (method: string, origin?: string) => ({
  method,
  headers: {
    origin: origin || 'https://polyseal.dev',
  },
}) as any

const createMockResponse = () => {
  const res = {
    status: vi.fn().mockReturnThis(),
    setHeader: vi.fn().mockReturnThis(),
    end: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
  }
  return res as any
}

describe('CORS Middleware', () => {
  it('allows requests from allowed origins', () => {
    const req = createMockRequest('GET', 'https://polyseal.dev')
    const res = createMockResponse()

    const result = cors(req, res)

    expect(result).toBe(true)
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'https://polyseal.dev')
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  })

  it('allows localhost in development', () => {
    const req = createMockRequest('GET', 'http://localhost:5173')
    const res = createMockResponse()

    const result = cors(req, res)

    expect(result).toBe(true)
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'http://localhost:5173')
  })

  it('blocks requests from disallowed origins', () => {
    const req = createMockRequest('GET', 'https://malicious-site.com')
    const res = createMockResponse()

    const result = cors(req, res)

    expect(result).toBe(false)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(res.json).toHaveBeenCalledWith({ error: 'Forbidden' })
  })

  it('handles preflight OPTIONS requests', () => {
    const req = createMockRequest('OPTIONS', 'https://polyseal.dev')
    const res = createMockResponse()

    const result = cors(req, res)

    expect(result).toBe(false) // Should return false to stop processing
    expect(res.status).toHaveBeenCalledWith(200)
    expect(res.end).toHaveBeenCalled()
  })

  it('handles missing origin header', () => {
    const req = createMockRequest('GET')
    req.headers.origin = undefined
    const res = createMockResponse()

    const result = cors(req, res)

    // Should allow requests without origin (direct API calls)
    expect(result).toBe(true)
  })

  it('sets correct CORS headers for allowed requests', () => {
    const req = createMockRequest('POST', 'https://polyseal.dev')
    const res = createMockResponse()

    cors(req, res)

    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', 'https://polyseal.dev')
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Headers', 'Content-Type, Authorization')
    expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Max-Age', '86400')
  })
})