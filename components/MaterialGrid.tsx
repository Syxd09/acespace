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

  // 1. Newly Came Materials (Artista Series)
  const newArrivalSlugs = [
    'corian-artista-beige',
    'corian-artista-canvas',
    'corian-artista-dust',
    'corian-artista-gray',
  ];

  // 2. Featured Materials (Curated Architectural Monoliths)
  const featuredMaterialSlugs = [
    'pattern-calacatta-greige',
    'pattern-stonecrest-smoke',
    'pattern-grinds-stonique',
    'corian-bleached-nuwood',
  ];

  const newArrivalMaterials = newArrivalSlugs
    .map((slug) => materials.find((m) => m.slug === slug))
    .filter(Boolean) as Material[];
  const displayNewArrivals = newArrivalMaterials.length === 4 ? newArrivalMaterials : materials.slice(0, 4);

  const featuredMaterials = featuredMaterialSlugs
    .map((slug) => materials.find((m) => m.slug === slug))
    .filter(Boolean) as Material[];
  const displayFeatured = featuredMaterials.length === 4 ? featuredMaterials : materials.slice(4, 8);

  const renderCard = (m: Material, badgeLabel?: string, delay: number = 0) => {
    const inTray = isShortlisted(m.slug);
    const cleanName = m.name.replace(/^(?:DuPont™\s*Corian®|DuPont\s*Corian|Corian®|Corian|Pattern\s+Series\s+Grinds|Pattern\s+Series)\s+/i, '');
    const finishLabel = badgeLabel || `${m.code} / ${(m.finish || 'Satin Smooth').toUpperCase()}`;

    return (
      <ScrollReveal
        key={m.slug}
        variant="image"
        delay={delay}
        style={{ height: '100%', display: 'flex', flexDirection: 'column' }}
      >
        <article
          className="material-card"
          tabIndex={0}
          onClick={() => setSelectedMaterial(m)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              setSelectedMaterial(m);
            }
          }}
          style={{ position: 'relative', cursor: 'pointer', flex: 1, minHeight: '340px' }}
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
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                quality={75}
                decoding="async"
                loading="lazy"
                style={{ objectFit: 'cover' }}
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
            className="card-sample-btn"
            style={{
              position: 'absolute',
              top: '14px',
              right: '14px',
              zIndex: 3,
              background: inTray ? 'var(--ink, #1e211d)' : 'rgba(255,255,255,0.94)',
              color: inTray ? '#fff' : 'var(--ink, #1e211d)',
              border: '1px solid rgba(0,0,0,0.15)',
              padding: '6px 12px',
              borderRadius: '0px',
              fontSize: '10px',
              fontFamily: 'Urbanist, sans-serif',
              textTransform: 'uppercase',
              fontWeight: 600,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
            }}
            aria-label={inTray ? `Remove ${cleanName} from sample tray` : `Add ${cleanName} to sample tray`}
          >
            {inTray ? 'In Tray ✓' : '+ Sample'}
          </button>

          <div className="card-info">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
              <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {cleanName}
              </h3>
              <span
                style={{
                  display: 'block',
                  width: '10px',
                  height: '10px',
                  minWidth: '10px',
                  minHeight: '10px',
                  maxWidth: '10px',
                  maxHeight: '10px',
                  aspectRatio: '1 / 1',
                  borderRadius: '50%',
                  background: m.hexColor,
                  boxShadow: '0 0 0 1px rgba(255, 255, 255, 0.85)',
                  flexShrink: 0,
                }}
                title={`Hex: ${m.hexColor}`}
              />
            </div>
            <p style={{ marginTop: '2px' }}>
              {finishLabel}
            </p>
          </div>
        </article>
      </ScrollReveal>
    );
  };

  return (
    <>
      <section id="materials" className="materials section-pad">
        {/* Section 02 Head: New Material Releases */}
        <ScrollReveal className="section-head" style={{ marginBottom: '36px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
              <span
                style={{
                  fontFamily: 'Urbanist, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'var(--muted, #6f786d)',
                  fontWeight: 600,
                }}
              >
                02 — Materials &amp; Palette
              </span>
              <div style={{ flex: 1, maxWidth: '140px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
            </div>
            <h2 style={{ fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.04, margin: 0 }} suppressHydrationWarning>
              Tactile minerals.
              <br />
              <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>Monolithic tones.</i>
            </h2>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '14px', maxWidth: '380px' }}>
            <p style={{ fontSize: '15px', color: '#555e54', margin: 0, lineHeight: 1.65 }}>
              Through-body mineral compositions and non-porous architectural hues, calibrated in our Bengaluru stockyard.
            </p>
            <Link className="button button-dark" href="/materials">
              Explore All Materials <span>↗</span>
            </Link>
          </div>
        </ScrollReveal>

        {/* Row 1: 4 Cards of Newly Came Materials */}
        <div className="material-grid">
          {displayNewArrivals.map((m, idx) => renderCard(m, undefined, idx * 60))}
        </div>

        {/* Row 2 Head: 4 Cards of Featured Materials */}
        <div style={{ marginTop: '64px', marginBottom: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '10px' }}>
                <span
                  style={{
                    fontFamily: 'Urbanist, sans-serif',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    textTransform: 'uppercase',
                    color: 'var(--muted, #6f786d)',
                    fontWeight: 600,
                  }}
                >
                  Featured Architectural Slabs
                </span>
                <div style={{ width: '80px', height: '1px', background: 'var(--line, rgba(30, 33, 29, 0.14))' }} />
              </div>
              <h3 style={{ fontSize: 'clamp(24px, 3.2vw, 38px)', lineHeight: 1.12, margin: 0, fontWeight: 500 }} suppressHydrationWarning>
                Curated architectural slabs.
                <br />
                <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>Veined &amp; textured monoliths.</i>
              </h3>
            </div>
            <Link className="text-link dark" href="/materials" style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}>
              View Complete Palette <span>↗</span>
            </Link>
          </div>
        </div>

        {/* Row 2: 4 Cards of Featured Materials */}
        <div className="material-grid">
          {displayFeatured.map((m, idx) => renderCard(m, undefined, idx * 60))}
        </div>

        {/* Minimalist Footnote Link */}
        <div
          style={{
            marginTop: '48px',
            paddingTop: '20px',
            borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.12))',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <span style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '11px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>
            40+ Through-Body Swatches · 12mm &amp; 19mm Calibrated Slabs
          </span>
          <Link
            className="text-link dark"
            href="/materials"
            style={{ fontFamily: 'Urbanist, sans-serif', fontSize: '11px', letterSpacing: '0.06em', textTransform: 'uppercase', fontWeight: 600 }}
          >
            Explore Full Palette <span>↗</span>
          </Link>
        </div>
      </section>

      {selectedMaterial && (
        <MaterialModal
          material={selectedMaterial}
          materialsList={materials}
          onSelectMaterial={(mat) => setSelectedMaterial(mat)}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      <Toast show={showToast} message="Added to your sample shortlist" />
    </>
  );
}
