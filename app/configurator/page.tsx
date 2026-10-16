import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';

const ProductConfigurator = dynamic(
  () => import('@/components/configurator/ProductConfigurator'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#687268' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(30,33,29,0.15)', borderTopColor: 'var(--brand-red, #d43833)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <span>Initializing 3D Parametric Studio...</span>
        </div>
      </div>
    ),
  }
);

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
  searchParams?: { preset?: string; material?: string; id?: string; launchAr?: string };
}

export default function ConfiguratorPage({ searchParams }: ConfiguratorPageProps) {
  const params = searchParams || {};

  return (
    <main suppressHydrationWarning style={{ minHeight: '100vh', background: '#f5f4ee' }}>
      <JsonLd data={configuratorJsonLd} />
      <Suspense
        fallback={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#687268' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(30,33,29,0.15)', borderTopColor: 'var(--brand-red, #d43833)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <span>Initializing 3D Parametric Studio...</span>
            </div>
          </div>
        }
      >
        <ProductConfigurator
          initialPresetId={params.preset || 'single-basin-vanity'}
          initialMaterialSlug={params.material}
          initialConfigId={params.id}
          autoLaunchAr={params.launchAr === 'true'}
        />
      </Suspense>
    </main>
  );
}
