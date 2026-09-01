import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { materials } from '@/data/materials';

interface MaterialDetailPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return materials.map((m) => ({
    slug: m.slug,
  }));
}

export async function generateMetadata({ params }: MaterialDetailPageProps): Promise<Metadata> {
  const material = materials.find((m) => m.slug === params.slug);
  if (!material) return { title: 'Material Not Found — Ace Spaces' };
  return {
    title: `${material.name} — Ace Spaces`,
    description: material.description,
  };
}

export default function MaterialDetailPage({ params }: MaterialDetailPageProps) {
  const material = materials.find((m) => m.slug === params.slug);

  if (!material) {
    notFound();
  }

  const [nameMain, nameSub] = material.name.split(' / ');

  return (
    <main>
      <section className="detail-hero">
        <div>
          <p className="eyebrow" style={{ color: '#d5ddd4' }}>
            {material.collection} / {material.type}
          </p>
          <h1>
            {nameMain}
            <br />
            <i>{nameSub || 'Series'}</i>
          </h1>
        </div>
      </section>

      <div className="page-main">
        <section className="page-grid">
          <h2>
            Subtle movement,
            <br />
            <i>lasting calm.</i>
          </h2>
          <div className="page-copy">
            <p>{material.description}</p>
            <Link className="button" href="/contact">
              Request a sample <span>↗</span>
            </Link>
          </div>
        </section>

        <section className="spec-table">
          <div className="spec-row">
            <span>Collection</span>
            <div>{material.collection}</div>
          </div>
          <div className="spec-row">
            <span>Colour</span>
            <div>{material.colour}</div>
          </div>
          <div className="spec-row">
            <span>Finish</span>
            <div>{material.finish}</div>
          </div>
          <div className="spec-row">
            <span>Applications</span>
            <div>{material.applications.join(' / ')}</div>
          </div>
        </section>
      </div>
    </main>
  );
}
