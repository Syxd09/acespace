import React from 'react';
import type { Metadata } from 'next';
import ProductConfigurator from '@/components/configurator/ProductConfigurator';
import JsonLd from '@/components/JsonLd';

export const metadata: Metadata = {
  title: 'Interactive 3D Product Configurator — Solid Surface Vanities, Sinks & Benchtops',
  description:
    'Visually configure bespoke architectural solid surface fixtures in real time: vanity consoles, integrated sinks, commercial washplanes, and DuPont™ Corian® benchtops with 5-axis CNC precision and instant fabrication quotes.',
  keywords: [
    '3D solid surface configurator',
    'Corian vanity 3D preview',
    'custom washplane configurator India',
    'integrated sink dimensions calculator',
    'architectural benchtop 3D quote',
    'seamless solid surface Bengaluru',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/configurator',
  },
  openGraph: {
    title: 'Interactive 3D Product Configurator | Ace Spaces India',
    description:
      'Configure millimetric dimensions, seamless coved basins, apron drops, and authentic DuPont™ Corian® materials with real-time 3D rendering.',
    url: 'https://acespacesindia.vercel.app/configurator',
    images: [
      {
        url: '/images/images/app_residential_artista_mist_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces 3D Product Configurator',
      },
    ],
  },
};

const configuratorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ace Spaces Interactive 3D Product Configurator',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires WebGL support',
  description:
    'Real-time parametric 3D configurator for architectural solid surface vanities, washplanes, integrated sinks, and bespoke monolithic benchtops.',
  provider: {
    '@type': 'Organization',
    name: 'Ace Spaces India',
    url: 'https://acespacesindia.vercel.app',
  },
};

interface ConfiguratorPageProps {
  searchParams: Promise<{ preset?: string; material?: string; id?: string }>;
}

export default async function ConfiguratorPage({ searchParams }: ConfiguratorPageProps) {
  const params = await searchParams;

  return (
    <main style={{ minHeight: '100vh', background: '#f5f4ee' }}>
      <JsonLd data={configuratorJsonLd} />
      <ProductConfigurator
        initialPresetId={params.preset || 'single-basin-vanity'}
        initialMaterialSlug={params.material}
      />
    </main>
  );
}
