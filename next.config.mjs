/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack(config) {
    // Ensure Next.js resolves .esm.js files correctly
    config.resolve.extensions.push('.ts', '.tsx', '.js', '.jsx');
    
    // Add rules for handling .mjs (ES module) files if needed
    config.module.rules.push({
      test: /\.mjs$/,
      type: 'javascript/auto',
      resolve: {
        fullySpecified: false,
      },
    });

    return config;
  },
};

export default nextConfig;
