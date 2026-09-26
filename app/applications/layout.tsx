import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'Applications & Spatial Typologies — Residential, Hospitality & Commercial — Ace Spaces',
  description:
    'Discover Ace Spaces solid surface installations across architectural sectors: monolithic residential kitchen islands, curved hospitality reception desks, commercial washplane troughs, healthcare scrub rooms, and retail brand portals.',
  keywords: [
    'solid surface applications',
    'hospitality reception desk fabrication',
    'monolithic kitchen island India',
    'commercial washroom troughs',
    'healthcare zero-porosity surfaces',
    'DuPont Corian residential interior',
  ],
  openGraph: {
    title: 'Applications & Spatial Typologies — Ace Spaces',
    description:
      'Seamless monolithic surfaces engineered for high-traffic hospitality, refined residential, commercial workplace, and clinical healthcare architecture.',
    url: 'https://acespacesindia.vercel.app/applications',
    images: [
      {
        url: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces — Architectural Typology Applications',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Applications & Spatial Typologies — Ace Spaces',
    description:
      'Seamless solid surface installations across luxury residential, hospitality, commercial, and healthcare typologies in India.',
    images: ['/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg'],
  },
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/applications',
  },
};

export default function ApplicationsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
