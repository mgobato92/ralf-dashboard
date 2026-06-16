/** @type {import('next').NextConfig} */
const nextConfig = {
  // Dashboard reads local files at request time; no caching of API routes.
  reactStrictMode: true,
};

export default nextConfig;
