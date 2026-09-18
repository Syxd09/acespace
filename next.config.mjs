/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: process.env.NEXT_DIST_DIR || '.next',
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'acespacesindia.vercel.app',
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/colours',
        destination: '/materials',
        permanent: true,
      },
      {
        source: '/collections/colours',
        destination: '/materials',
        permanent: true,
      },
      {
        source: '/sample-box',
        destination: '/materials',
        permanent: false,
      },
      {
        source: '/applications/custom',
        destination: '/applications/healthcare',
        permanent: true,
      },
      {
        source: '/applications/hospital',
        destination: '/applications/healthcare',
        permanent: true,
      },
      {
        source: '/applications/hospitals',
        destination: '/applications/healthcare',
        permanent: true,
      },
      {
        source: '/applications/cultural',
        destination: '/applications',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
