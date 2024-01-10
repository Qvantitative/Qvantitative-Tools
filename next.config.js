module.exports = {
  future: {
    webpack5: true,
  },
  basePath: '/myapp',
  images: {
    domains: ['https://ipfs.io/ipfs/', 'https://ipfs.io/ipfs/', 'https://ipfs.nftworlds.com', 'https://minion-silhouete.s3.us-east-1.amazonaws.com']
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
    };

    return config;
  },
  rewrites: async () => [
    {
      source: "/public/myfile.html",
      destination: "/pages/api/myfile.js",
    },
  ],
};