import type { Metadata } from 'next';
import './globals.css';
import SiteHeader from '@/components/SiteHeader';
import SiteFooter from '@/components/SiteFooter';
import { SampleProvider } from '@/context/SampleContext';
import { SiteContentProvider } from '@/context/SiteContentContext';
import SampleTray from '@/components/SampleTray';
import ArchitecturalAIBot from '@/components/ArchitecturalAIBot';
import PageTransition from '@/components/PageTransition';

export const metadata: Metadata = {
  metadataBase: new URL('https://acespacesindia.vercel.app'),
  title: {
    default: 'Ace Spaces — Material, made architectural',
    template: '%s | Ace Spaces',
  },
  description:
    'Ace Spaces is the primary architectural raw material hub and authorized DuPont™ Corian® solid surface distributor in Bengaluru, India. Supplying calibrated mineral slabs (3660×760mm, 12mm & 19mm), 5-axis CNC digital fabrication, thermoforming, and foundational materials powering Coro Collective.',
  keywords: [
    'architectural materials',
    'DuPont Corian',
    'DuPont Corian Bangalore',
    'solid surface slabs India',
    'Coro Collective',
    'through-body mineral surfaces',
    '5-axis CNC fabrication',
    'vacuum thermoforming',
    'Bengaluru architectural foundry',
    'specifier sample box',
    'zero-silica countertops',
    'zero crystalline silica solid surface',
    'monolithic kitchen island',
    'commercial washplane troughs',
    'seamless integrated sinks',
    'hospitality reception desk fabrication',
  ],
  authors: [{ name: 'Ace Spaces Architectural Foundry', url: 'https://acespacesindia.vercel.app' }],
  creator: 'Ace Spaces Private Limited',
  publisher: 'Ace Spaces Private Limited',
  category: 'Architecture & Building Materials',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.svg',
  },
  openGraph: {
    title: 'Ace Spaces — The Source of Material, Where Spaces Begin',
    description:
      'The primary raw material hub for architects, interior designers, and bespoke builders — supplying certified DuPont™ Corian® solid surfaces, mineral slabs, and digital fabrication in Bengaluru, India.',
    url: 'https://acespacesindia.vercel.app',
    siteName: 'Ace Spaces',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/assets/hero-ace.png',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces — Architectural Solid Surfaces & Material Foundry',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ace Spaces — Material, made architectural',
    description:
      'Master architectural material hub and certified DuPont™ Corian® fabrication workshop in Bengaluru, India. Powering Coro Collective with zero-silica solid surfaces.',
    images: ['/assets/hero-ace.png'],
  },
  alternates: {
    canonical: 'https://acespacesindia.vercel.app',
    types: {
      'text/markdown': 'https://acespacesindia.vercel.app/llms.txt',
      'application/rss+xml': 'https://acespacesindia.vercel.app/journal/feed.xml',
    },
  },
};

const jsonLdGraph = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'HomeAndConstructionBusiness',
      '@id': 'https://acespacesindia.vercel.app/#organization',
      name: 'Ace Spaces',
      legalName: 'Ace Spaces Private Limited',
      alternateName: [
        'Ace Spaces Architectural Materials',
        'Ace Spaces DuPont Corian Partner',
        'Ace Spaces Material Hub Bengaluru',
      ],
      image: 'https://acespacesindia.vercel.app/assets/hero-ace.png',
      logo: 'https://acespacesindia.vercel.app/favicon.svg',
      url: 'https://acespacesindia.vercel.app',
      telephone: '+919845012345',
      email: 'studio@acespaces.in',
      priceRange: '₹₹₹₹',
      description:
        'Primary architectural raw material hub, authorized DuPont™ Corian® solid surface master distributor, and 5-axis digital fabrication workshop in Bengaluru, India. Supplying calibrated through-body mineral slabs, thermoformed surfaces, and monolithic systems powering Coro Collective and leading spatial designers.',
      address: {
        '@type': 'PostalAddress',
        streetAddress: '#42/1, 100 Feet Road, HAL 2nd Stage, Indiranagar',
        addressLocality: 'Bengaluru',
        addressRegion: 'Karnataka',
        postalCode: '560038',
        addressCountry: 'IN',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: 12.9716,
        longitude: 77.6412,
      },
      areaServed: [
        { '@type': 'City', name: 'Bengaluru' },
        { '@type': 'AdministrativeArea', name: 'Karnataka' },
        { '@type': 'Country', name: 'India' },
      ],
      subOrganization: {
        '@type': 'Organization',
        name: 'Coro Collective',
        description: 'Bespoke collectible spatial furniture and monolithic interior systems fabricated by Ace Spaces.',
      },
      knowsAbout: [
        'DuPont™ Corian® Solid Surface Distribution',
        'Zero Crystalline Silica Mineral Substrates',
        '5-Axis CNC Digital Fabrication',
        'Vacuum Membrane Thermoforming (down to 25mm radius)',
        'Inconspicuous Molecular Seam Chemistry',
        'Monolithic Kitchen Islands & 45° Mitred Waterfalls',
        'Integrated Zero-Silicone Washplane Basins',
      ],
      hasOfferCatalog: {
        '@type': 'OfferCatalog',
        name: 'Ace Spaces Architectural Catalog',
        itemListElement: [
          {
            '@type': 'OfferCatalog',
            name: 'Through-Body Mineral Slabs (3660 × 760mm, 12mm & 19mm)',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Architectural Systems (Benchtops, Sinks, Washplanes, Vanities, EOT, Bespoke)',
          },
          {
            '@type': 'OfferCatalog',
            name: 'Digital Fabrication Services (5-Axis CNC & Thermoforming)',
          },
        ],
      },
      openingHoursSpecification: [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
          opens: '09:00',
          closes: '19:00',
        },
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: ['Saturday'],
          opens: '09:00',
          closes: '17:00',
        },
      ],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://acespacesindia.vercel.app/#website',
      url: 'https://acespacesindia.vercel.app',
      name: 'Ace Spaces',
      publisher: {
        '@id': 'https://acespacesindia.vercel.app/#organization',
      },
      potentialAction: {
        '@type': 'SearchAction',
        target: {
          '@type': 'EntryPoint',
          urlTemplate: 'https://acespacesindia.vercel.app/materials?q={search_term_string}',
        },
        'query-input': 'required name=search_term_string',
      },
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@400;500&family=Manrope:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        {/* Agentic Browsing & AI Crawler Specification */}
        <link
          rel="alternate"
          type="text/markdown"
          title="Ace Spaces Studio Intelligence (LLM Specs)"
          href="/llms.txt"
        />
        {/* RSS / Syndication Feed */}
        <link
          rel="alternate"
          type="application/rss+xml"
          title="Ace Spaces Architectural Journal Feed"
          href="/journal/feed.xml"
        />
        {/* Rich Structured Data (Schema.org Graph) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdGraph) }}
        />
      </head>
      <body suppressHydrationWarning>
        <SiteContentProvider>
          <SampleProvider>
            <SiteHeader />
            <PageTransition>
              {children}
            </PageTransition>
            <SiteFooter />
            <SampleTray />
            <ArchitecturalAIBot />
          </SampleProvider>
        </SiteContentProvider>
      </body>
    </html>
  );
}
