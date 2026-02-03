/** @type {import('next').NextConfig} */
const nextConfig = {
  // Ensure Turbopack uses this package folder as the workspace root
  turbopack: {
    root: '.',
  },
};

export default nextConfig;

