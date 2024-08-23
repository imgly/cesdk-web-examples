/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/]
      },

      use: [{ loader: '@svgr/webpack' }]
    });
    return config;
  }
};

export default nextConfig;
