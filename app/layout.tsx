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
  title: 'Ace Spaces — Material, made architectural',
  description:
    'Ace Spaces is the primary architectural raw material hub and authorized DuPont™ Corian® distributor in Bengaluru, India — providing through-body mineral surfaces, 5-axis CNC digital fabrication, and foundational materials powering Coro Collective.',
  keywords: [
    'architectural materials',
    'DuPont Corian',
    'solid surface slabs',
    'Coro Collective',
    'mineral surfaces',
    '5-axis CNC fabrication',
    'thermoforming',
    'Bengaluru',
    'interior architecture',
    'specifier sample box',
    'zero-silica countertops',
  ],
  authors: [{ name: 'Ace Spaces Material Foundry' }],
  creator: 'Ace Spaces',
  publisher: 'Ace Spaces',
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
      'Master architectural material hub and certified DuPont™ Corian® fabrication workshop in Bengaluru, India.',
    images: ['/assets/hero-ace.png'],
  },
  alternates: {
    canonical: 'https://acespacesindia.vercel.app',
  },
};

const jsonLdSchema = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Ace Spaces',
  alternateName: 'Ace Spaces Material Hub & DuPont Corian Partner',
  image: 'https://acespacesindia.vercel.app/assets/hero-ace.png',
  url: 'https://acespacesindia.vercel.app',
  telephone: '+919845012345',
  email: 'studio@acespaces.in',
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
  priceRange: '₹₹₹₹',
  description:
    'Primary architectural raw material hub, authorized DuPont™ Corian® solid surface distributor, and advanced fabrication workshop in Bengaluru, powering Coro Collective and leading spatial designers across India.',
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchema) }}
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
