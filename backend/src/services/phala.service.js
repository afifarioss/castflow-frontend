```javascript
const axios = require('axios');

const PHALA_API_KEY = process.env.PHALA_CLOUD_API_KEY;
const PHALA_API_URL = process.env.PHALA_API_URL || 'https://cloud-api.phala.network/api/v1/tee/run';

if (!PHALA_API_KEY) {
  console.warn('⚠️ PHALA_CLOUD_API_KEY not set – Phala service will stub responses');
}

const client = axios.create({
  baseURL: PHALA_API_URL,
  headers: {
    'Authorization': `Bearer ${PHALA_API_KEY || ''}`,
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

/**
 * Label content using Phala TEE – returns a label/tag for ad targeting
 * @param {string} content – e.g., text or cast data
 * @returns {Promise<{ label: string, confidence: number }>}
 */
async function labelContent(content) {
  if (!PHALA_API_KEY) {
    // Stub response for development
    console.log('[Phala stub] labeling content:', content?.substring(0, 30));
    return { label: 'general', confidence: 0.8 };
  }

  try {
    const payload = {
      input: content,
      model: 'llama3-8b', // example; adjust to Phala's model
    };
    const res = await client.post('', payload);
    // Adapt to actual Phala response shape
    return {
      label: res.data.label || 'general',
      confidence: res.data.confidence || 0.5,
    };
  } catch (error) {
    console.error('Phala labelContent error:', error.message);
    return { label: 'general', confidence: 0.5 };
  }
}

module.exports = { labelContent };
```