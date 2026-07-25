```javascript
const axios = require('axios');

const MBD_API_KEY = process.env.MBD_API_KEY;
const MBD_API_URL = process.env.MBD_API_URL || 'https://api.mbd.xyz/v3/studio/moderate';

if (!MBD_API_KEY) {
  console.warn('⚠️ MBD_API_KEY not set – MBD service will stub responses');
}

const client = axios.create({
  baseURL: MBD_API_URL,
  headers: {
    'Authorization': `Bearer ${MBD_API_KEY || ''}`,
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

/**
 * Moderate an ad creative (image or video) for compliance
 * @param {string} creativeUrl – IPFS/Arweave URL
 * @returns {Promise<{ approved: boolean, reason?: string }>}
 */
async function moderateAd(creativeUrl) {
  if (!MBD_API_KEY) {
    // Stub – always approved
    console.log('[MBD stub] moderating:', creativeUrl);
    return { approved: true };
  }

  try {
    const res = await client.post('', { url: creativeUrl });
    // Adapt to MBD response format
    const data = res.data;
    return {
      approved: data.status === 'approved' || data.safe,
      reason: data.reason || null,
    };
  } catch (error) {
    console.error('MBD moderateAd error:', error.message);
    // Safe fallback: block if uncertain
    return { approved: false, reason: 'Service error' };
  }
}

module.exports = { moderateAd };
```