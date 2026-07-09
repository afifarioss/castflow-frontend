/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ipfs.io", "cloudflare-ipfs.com"],
  },
};

module.exports = nextConfig;