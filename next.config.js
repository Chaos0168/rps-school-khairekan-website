/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable static export for traditional hosting
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true,
    domains: ['images.unsplash.com', 'via.placeholder.com'],
  },
  // Disable server-side features for static hosting
  experimental: {
    esmExternals: false,
  },
}

module.exports = nextConfig 