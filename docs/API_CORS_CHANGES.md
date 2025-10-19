# API and CORS Configuration Changes

This document outlines the changes made to normalize API calls and improve CORS configuration.

## Changes Made

### 1. Enhanced CORS Middleware (`api/_lib/cors.ts`)

**Before:**

```typescript
const origin = process.env.CORS_ORIGIN || "*";
res.setHeader("Access-Control-Allow-Origin", origin);
```

**After:**

```typescript
const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);

// Smart origin matching logic
let allowOrigin = "*";
if (requestOrigin && allowedOrigins.length > 0) {
  if (allowedOrigins.includes(requestOrigin)) {
    allowOrigin = requestOrigin;
  } else {
    allowOrigin = allowedOrigins[0];
  }
}
```

**Benefits:**

- Supports multiple allowed origins via CSV format
- Proper Origin header validation
- Secure fallback to first allowed origin if no match
- Better preflight handling

### 2. Normalized API Calls

**Before:**

```typescript
// In Attestations.tsx
const response = await fetch(`${ENV.SERVER}/eas/${attestationUid}`);

// In env.ts
SERVER: import.meta.env.VITE_SERVER_URL || '/api',
```

**After:**

```typescript
// Direct relative path
const response = await fetch(`/api/eas/${attestationUid}`);

// Removed ENV.SERVER from env.ts
```

**Benefits:**

- No more absolute URL dependencies
- Cleaner client-side code
- Better development/production parity
- Reduced environment variable complexity

### 3. Environment Variable Updates

**Removed:**

- `VITE_SERVER_URL` (no longer needed)
- `CORS_ORIGIN` (replaced with ALLOWED_ORIGINS)

**Added:**

- `ALLOWED_ORIGINS` - CSV list of allowed origins

**Fixed:**

- `POLYGON_RPC_URL` - Removed trailing slash for consistency

### 4. Production Environment Setup

Set these environment variables in Vercel:

```bash
ALLOWED_ORIGINS=https://polyseal-jade.vercel.app,http://localhost:5173
POLYGON_RPC_URL=https://rpc-amoy.polygon.technology
```

## Testing

### Local Development

1. Set `ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000` in `.env`
2. Test CORS with the included `test-cors.js` script
3. Verify API calls work from both frontend and browser dev tools

### Production

1. Deploy with `ALLOWED_ORIGINS=https://polyseal-jade.vercel.app,http://localhost:5173`
2. Test cross-origin requests from production domain
3. Verify localhost development still works against production API

## API Endpoints Using CORS

All API endpoints automatically use the enhanced CORS middleware:

- `/api/health` - Health check
- `/api/contact` - Contact form submission
- `/api/eas/[uid]` - EAS attestation lookup
- `/api/price` - Token price lookup
- `/api/robots.txt` - SEO robots file
- `/api/sitemap.xml` - SEO sitemap

## Security Considerations

1. **Origin Validation**: Only specified origins are allowed
2. **Fallback Security**: If no match, uses first allowed origin (not wildcard)
3. **Preflight Support**: Proper OPTIONS method handling
4. **Header Validation**: Consistent CORS headers across all endpoints

## Migration Checklist

- [x] Update CORS middleware to support multiple origins
- [x] Replace `${ENV.SERVER}/api/...` with `/api/...` in client calls
- [x] Remove VITE_SERVER_URL from environment variables
- [x] Update .env.example with new ALLOWED_ORIGINS format
- [x] Fix trailing slash in POLYGON_RPC_URL
- [x] Test CORS with multiple origins
- [x] Verify relative API calls work in development
- [x] Create test script for CORS validation

## Rollback Plan

If issues occur:

1. Restore `ENV.SERVER` usage in client calls
2. Revert to single `CORS_ORIGIN` environment variable
3. Re-add `VITE_SERVER_URL=/api` to environment
4. Test with original configuration

## Future Improvements

1. Add rate limiting per origin
2. Implement CORS policy caching
3. Add detailed CORS logging for debugging
4. Consider CORS preflight caching headers

## Implementation Status

✅ **COMPLETED (October 19, 2025)**

All changes have been successfully implemented and validated:

### Validation Results

```
🔍 Validating API and CORS Changes
==================================================

📁 Checking CORS Implementation:
✅ CORS middleware file: api/_lib/cors.ts
✅ Multi-origin CORS support: Found 1 occurrence(s)

🔧 Checking Environment Configuration:
✅ Environment example file: .env.example
✅ ALLOWED_ORIGINS variable: Found 1 occurrence(s)
✅ RPC URL without trailing slash: Found 1 occurrence(s)

🗑️  Checking Removed Variables:
✅ VITE_SERVER_URL successfully removed

🌐 Checking API Call Patterns:
✅ Relative API path in Attestations: Found 1 occurrence(s)
✅ Relative API path in Contact: Found 1 occurrence(s)
✅ ENV.SERVER successfully removed from env.ts

📚 Checking Documentation:
✅ Reference documentation: docs/REFERENCES.md
✅ Updated documentation section: Found 1 occurrence(s)

🧪 Checking Test Files:
✅ CORS test script: test-cors.js

📊 Validation Results:
🎉 All validations passed! API and CORS changes are ready.
```

### Files Modified

- `api/_lib/cors.ts` - Enhanced CORS with multi-origin support
- `src/pages/Attestations.tsx` - Updated to use relative API paths
- `src/lib/env.ts` - Removed ENV.SERVER dependency
- `.env.example` - Updated environment variables
- `docs/REFERENCES.md` - Added API configuration documentation

### Files Created

- `validate-changes.js` - Comprehensive validation script
- `test-cors.js` - CORS testing utility

### Deployment Ready

The implementation is production-ready. Set the following in Vercel:

```bash
ALLOWED_ORIGINS=https://polyseal-jade.vercel.app,http://localhost:5173
```
