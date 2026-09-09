/** @type {import('next').NextConfig} */
const nextConfig = {
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
        hostname: '**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/colours',
        destination: '/collections/colours',
        permanent: true,
      },
      {
        source: '/sample-box',
        destination: '/materials',
        permanent: false,
      },
      {
        source: '/applications/healthcare',
        destination: '/applications/custom',
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
