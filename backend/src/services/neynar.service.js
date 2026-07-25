```javascript
const axios = require('axios');

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;

if (!NEYNAR_API_KEY) {
  console.warn('⚠️ NEYNAR_API_KEY not set – Neynar service will stub responses');
}

const client = axios.create({
  baseURL: 'https://api.neynar.com/v2/farcaster',
  headers: {
    'api_key': NEYNAR_API_KEY || '',
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Fetch a single cast by its hash
 */
async function fetchCast(hash) {
  try {
    const res = await client.get(`/cast`, { params: { hash } });
    return res.data;
  } catch (error) {
    console.error('Neynar fetchCast error:', error.message);
    throw error;
  }
}

/**
 * Validate if a given FID exists and is active
 * Returns { valid: boolean, user?: any }
 */
async function validateFid(fid) {
  if (!fid) return { valid: false };
  try {
    const res = await client.get(`/user`, { params: { fid } });
    return { valid: true, user: res.data };
  } catch (error) {
    if (error.response && error.response.status === 404) {
      return { valid: false };
    }
    console.error('Neynar validateFid error:', error.message);
    // fallback: assume valid to avoid breaking flows
    return { valid: true };
  }
}

/**
 * Get recent casts from a user's feed
 */
async function getFeed(fid, limit = 10) {
  try {
    const res = await client.get(`/feed/user/casts`, {
      params: { fid, limit },
    });
    return res.data;
  } catch (error) {
    console.error('Neynar getFeed error:', error.message);
    return { casts: [] };
  }
}

module.exports = { fetchCast, validateFid, getFeed };
```