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
  compress: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    formats: ['image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
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
        source: '/_next/static/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/assets/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/images/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/materials/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/fonts/(.*)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
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
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(self), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://ajax.googleapis.com https://unpkg.com https://cdn.jsdelivr.net; script-src-elem 'self' 'unsafe-eval' 'unsafe-inline' https://ajax.googleapis.com https://unpkg.com https://cdn.jsdelivr.net; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' https: data: blob:; connect-src 'self' https: blob:; worker-src 'self' blob:; frame-src 'self' https://www.google.com https://maps.google.com; object-src 'none'; base-uri 'self';",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/assets/materials/css-calacatta-greige-sheet.jpg',
        destination: '/materials/pattern_calacatta_greige.jpg',
      },
      {
        source: '/assets/materials/css-stonecrest-smoke-sheet.jpg',
        destination: '/materials/pattern_stonecrest_smoke.jpg',
      },
      {
        source: '/assets/materials/css-artista-sage-sheet.jpg',
        destination: '/materials/pattern_artista_sage.jpg',
      },
      {
        source: '/assets/materials/css-stonique-sheet.jpg',
        destination: '/materials/pattern_grinds_stonique.jpg',
      },
      {
        source: '/assets/materials/css-laguna-terrazzo-sheet.jpg',
        destination: '/materials/pattern_terrazzo_laguna.jpg',
      },
      {
        source: '/assets/materials/css-excavage-sheet.jpg',
        destination: '/materials/pattern_grinds_excavage.jpg',
      },
      {
        source: '/assets/materials/:path*',
        destination: '/materials/:path*',
      },
    ];
  },
  async redirects() {
    return [
      {
        source: '/materials/css-calacatta-greige-sheet',
        destination: '/materials/pattern-calacatta-greige',
        permanent: true,
      },
      {
        source: '/materials/calacatta-greige',
        destination: '/materials/pattern-calacatta-greige',
        permanent: true,
      },
      {
        source: '/materials/css-stonecrest-smoke-sheet',
        destination: '/materials/pattern-stonecrest-smoke',
        permanent: true,
      },
      {
        source: '/materials/stonecrest-smoke',
        destination: '/materials/pattern-stonecrest-smoke',
        permanent: true,
      },
      {
        source: '/materials/css-artista-sage-sheet',
        destination: '/materials/pattern-artista-sage',
        permanent: true,
      },
      {
        source: '/materials/artista-sage',
        destination: '/materials/pattern-artista-sage',
        permanent: true,
      },
      {
        source: '/materials/css-stonique-sheet',
        destination: '/materials/pattern-grinds-stonique',
        permanent: true,
      },
      {
        source: '/materials/stonique',
        destination: '/materials/pattern-grinds-stonique',
        permanent: true,
      },
      {
        source: '/materials/css-laguna-terrazzo-sheet',
        destination: '/materials/pattern-terrazzo-laguna',
        permanent: true,
      },
      {
        source: '/materials/laguna-terrazzo',
        destination: '/materials/pattern-terrazzo-laguna',
        permanent: true,
      },
      {
        source: '/materials/css-excavage-sheet',
        destination: '/materials/pattern-grinds-excavage',
        permanent: true,
      },
      {
        source: '/materials/excavage',
        destination: '/materials/pattern-grinds-excavage',
        permanent: true,
      },
      {
        source: '/about-us',
        destination: '/about',
        permanent: true,
      },
      {
        source: '/colours',
        destination: '/materials#library',
        permanent: true,
      },
      {
        source: '/collections/colours',
        destination: '/materials#library',
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
      {
        source: '/certifications/greenguard',
        destination: '/certifications/greenguard-gold',
        permanent: true,
      },
      {
        source: '/certifications/nsf',
        destination: '/certifications/nsf-ansi-51',
        permanent: true,
      },
      {
        source: '/certifications/astm',
        destination: '/certifications/astm-fire-rated',
        permanent: true,
      },
      {
        source: '/warranty',
        destination: '/guarantee',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
