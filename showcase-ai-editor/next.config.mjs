/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config, { webpack }) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        and: [/\.(js|ts)x?$/]
      },

      use: [{ loader: '@svgr/webpack' }]
    });
    // Temporary fix until the following fix is merged into our NextJS version: https://github.com/vercel/next.js/pull/65248
    // Should be included in NextJS >= 14.2.6
    config.plugins.push(
      new webpack.DefinePlugin({
        'process.env.NEXT_PUBLIC_URL': JSON.stringify(
          process.env.NEXT_PUBLIC_URL ?? ''
        )
      })
    );

    return config;
  }
};

export default nextConfig;
