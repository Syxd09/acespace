import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import dynamic from 'next/dynamic';
import JsonLd from '@/components/JsonLd';

const BasinConfigurator = dynamic(
  () => import('@/components/configurator/BasinConfigurator'),
  {
    ssr: false,
    loading: () => (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#687268' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid rgba(30,33,29,0.15)', borderTopColor: 'var(--brand-red, #d43833)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
          <span>Initializing 3D Basin Studio...</span>
        </div>
      </div>
    ),
  }
);

export const metadata: Metadata = {
  title: 'Interactive 3D Basin Configurator — Solid Surface Countertop Washbowls',
  description:
    'Visually configure bespoke architectural solid surface countertop basins in real time: Oval, Capsule, Round, and Square models with authentic DuPont™ Corian® materials, CAD dimensions, and 1:1 scale AR preview.',
  keywords: [
    '3D basin configurator',
    'Corian countertop basin 3D',
    'solid surface vessel sink India',
    'custom washbasin dimensions Bengaluru',
    'architectural washbowl 3D quote',
  ],
  alternates: {
    canonical: 'https://acespacesindia.vercel.app/basin-configurator',
  },
  openGraph: {
    title: 'Interactive 3D Basin Configurator | Ace Spaces India',
    description:
      'Configure millimetric dimensions, authentic DuPont™ Corian® finishes, pop-up drain fittings, and inspect in 1:1 Augmented Reality.',
    url: 'https://acespacesindia.vercel.app/basin-configurator',
    images: [
      {
        url: '/images/images/app_residential_artista_mist_1.jpg',
        width: 1200,
        height: 630,
        alt: 'Ace Spaces 3D Basin Configurator',
      },
    ],
  },
};

const basinConfiguratorJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'WebApplication',
  name: 'Ace Spaces Interactive 3D Basin Configurator',
  applicationCategory: 'DesignApplication',
  operatingSystem: 'All',
  browserRequirements: 'Requires WebGL support',
  description:
    'Real-time parametric 3D configurator for architectural solid surface countertop washbasins and vessel bowls.',
  provider: {
    '@type': 'Organization',
    name: 'Ace Spaces India',
    url: 'https://acespacesindia.vercel.app',
  },
};

interface BasinConfiguratorPageProps {
  searchParams?: { model?: string; material?: string; drain?: string; launchAr?: string };
}

export default function BasinConfiguratorPage({ searchParams }: BasinConfiguratorPageProps) {
  const params = searchParams || {};

  return (
    <main suppressHydrationWarning style={{ minHeight: '100vh', background: '#f5f4ee' }}>
      <JsonLd data={basinConfiguratorJsonLd} />
      <Suspense
        fallback={
          <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f4ee', fontFamily: 'DM Mono, monospace', fontSize: '13px', color: '#687268' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ width: '40px', height: '40px', border: '3px solid rgba(30,33,29,0.15)', borderTopColor: 'var(--brand-red, #d43833)', borderRadius: '50%', margin: '0 auto 16px', animation: 'spin 0.8s linear infinite' }} />
              <span>Initializing 3D Basin Studio...</span>
            </div>
          </div>
        }
      >
        <BasinConfigurator
          initialModelId={params.model || 'oval-5'}
          initialMaterialSlug={params.material}
          initialDrainId={params.drain}
          autoLaunchAr={params.launchAr === 'true'}
        />
      </Suspense>
    </main>
  );
}
