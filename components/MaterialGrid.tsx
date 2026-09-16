'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { materials as defaultMaterials, Material } from '@/data/materials';
import { useSiteContent } from '@/context/SiteContentContext';
import MaterialModal from './MaterialModal';
import Toast from './Toast';
import ScrollReveal from './ScrollReveal';
import { useSampleShortlist } from '@/context/SampleContext';

export default function MaterialGrid() {
  const { materials: liveMaterials } = useSiteContent();
  const materials = (liveMaterials && liveMaterials.length > 0) ? liveMaterials : defaultMaterials;
  const { addSample, removeSample, isShortlisted } = useSampleShortlist();
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showToast, setShowToast] = useState(false);

  const handleRequestSample = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  // Curated 4 Featured Material Substrates / Slabs
  const featuredMaterialSlugs = [
    'alto-bianco-vein',
    'noma-white-chalk',
    'strata-terrazzo-ash',
    'alto-fior-di-bosco',
  ];

  // Curated 4 Featured Color Swatches / Palette Hues
  const featuredColourSlugs = [
    'noma-linen',
    'terra-sienna',
    'obsidian-coal',
    'lumen-shell',
  ];

  const featuredMaterials = featuredMaterialSlugs
    .map((slug) => materials.find((m) => m.slug === slug))
    .filter(Boolean) as Material[];
  const displayMaterials = featuredMaterials.length >= 4 ? featuredMaterials : materials.slice(0, 4);

  const featuredColours = featuredColourSlugs
    .map((slug) => materials.find((m) => m.slug === slug))
    .filter(Boolean) as Material[];
  const displayColours = featuredColours.length >= 4 ? featuredColours : materials.slice(4, 8);

  const renderCard = (m: Material, badgeLabel?: string) => {
    const inTray = isShortlisted(m.slug);
    return (
      <article
        key={m.slug}
        className="material-card"
        tabIndex={0}
        onClick={() => setSelectedMaterial(m)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedMaterial(m);
          }
        }}
        style={{ position: 'relative', cursor: 'pointer' }}
      >
        <div
          className="swatch"
          style={{
            position: 'absolute',
            inset: 0,
            background: m.textureCss || m.hexColor,
            overflow: 'hidden',
          }}
        >
          {m.textureImage && (
            <Image
              src={m.textureImage}
              alt={m.name}
              fill
              sizes="(max-width: 768px) 100vw, 30vw"
              style={{ objectFit: 'cover' }}
              loading="lazy"
            />
          )}
        </div>

        {/* Sample Shortlist Quick Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            if (inTray) {
              removeSample(m.slug);
            } else {
              addSample(m);
              handleRequestSample();
            }
          }}
          style={{
            position: 'absolute',
            top: '14px',
            right: '14px',
            zIndex: 3,
            background: inTray ? 'var(--ink)' : 'rgba(255,255,255,0.94)',
            color: inTray ? '#fff' : 'var(--ink)',
            border: '1px solid rgba(0,0,0,0.15)',
            padding: '6px 12px',
            borderRadius: '100px',
            fontSize: '10px',
            fontFamily: 'DM Mono, monospace',
            textTransform: 'uppercase',
            cursor: 'pointer',
            transition: 'all 0.25s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          }}
          aria-label={inTray ? `Remove ${m.name} from sample tray` : `Add ${m.name} to sample tray`}
        >
          {inTray ? 'In Tray ✓' : '+ Sample'}
        </button>

        <div className="card-info">
          <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '9px', marginBottom: '2px', display: 'block' }}>
            {badgeLabel ? badgeLabel : `${m.code} • ${m.collection}`}
          </span>
          <h3>{m.name}</h3>
          <p>{m.finish} / {m.colour}</p>
        </div>
      </article>
    );
  };

  return (
    <>
      {/* 01. Featured Material Collections */}
      <section id="materials" className="materials section-pad">
        <ScrollReveal className="section-head">
          <div>
            <p className="eyebrow">Featured Collections · Materials</p>
            <h2>
              New material releases.
              <br />
              <i>Form, veining &amp; texture.</i>
            </h2>
          </div>
          <Link className="button button-dark" href="/materials">
            See More Materials <span>↗</span>
          </Link>
        </ScrollReveal>

        <div className="material-grid">
          {displayMaterials.map((m) => renderCard(m))}
        </div>

        <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
            16+ Architectural Slabs · 12mm &amp; 19mm Thicknesses · Custom CNC
          </span>
          <Link className="text-link dark" href="/materials">
            See more materials <span>↗</span>
          </Link>
        </div>
      </section>

      {/* 02. Curated Colour Spectrum */}
      <section id="colours" className="materials section-pad" style={{ borderTop: '1px solid var(--line)', background: '#dcd7cd' }}>
        <ScrollReveal className="section-head">
          <div>
            <p className="eyebrow">Featured Collections · Colours</p>
            <h2>
              Curated palette.
              <br />
              <i>Hues for quiet interiors.</i>
            </h2>
          </div>
          <Link className="button button-dark" href="/collections/colours">
            See More Colours <span>↗</span>
          </Link>
        </ScrollReveal>

        <div className="material-grid">
          {displayColours.map((m) => renderCard(m, `${m.colorFamily.toUpperCase()} PALETTE · ${m.code}`))}
        </div>

        <div style={{ marginTop: '36px', paddingTop: '24px', borderTop: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
            Curated Across 7 Color Families · Light Transmission &amp; Undertones
          </span>
          <Link className="text-link dark" href="/collections/colours">
            See more colours <span>↗</span>
          </Link>
        </div>
      </section>

      {selectedMaterial && (
        <MaterialModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      <Toast show={showToast} message="Added to your sample shortlist" />
    </>
  );
}
