/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // When NEXT_PUBLIC_BASE_PATH is set (GitHub Pages build), export as a static
  // site under that subpath. Local dev leaves it empty and works normally.
  output: process.env.NEXT_PUBLIC_BASE_PATH ? "export" : undefined,
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
};

export default nextConfig;
