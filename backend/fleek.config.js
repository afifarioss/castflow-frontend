```javascript
// Fleek Functions config for relayer deployment
module.exports = {
  functions: [
    {
      name: 'castflow-relayer',
      path: './src/services/relayer.service.js',
      entry: 'injectAd',
      env: {
        NEYNAR_API_KEY: process.env.NEYNAR_API_KEY,
        PHALA_CLOUD_API_KEY: process.env.PHALA_CLOUD_API_KEY,
        MBD_API_KEY: process.env.MBD_API_KEY,
        DATABASE_URL: process.env.DATABASE_URL,
        BASE_RPC_URL: process.env.BASE_RPC_URL,
      },
    },
  ],
};
```