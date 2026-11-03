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

  // Curated 4 Key Architectural Specimens
  const curatedSlugs = [
    'calacatta-greige',
    'stonecrest-smoke',
    'cirrus-white',
    'artista-sage',
  ];

  const displayMaterials = curatedSlugs
    .map((slug) => materials.find((m) => m.slug === slug))
    .filter(Boolean) as Material[];
  const finalMaterials = displayMaterials.length === 4 ? displayMaterials : materials.slice(0, 4);

  return (
    <>
      <section id="materials" className="materials section-pad">
        <ScrollReveal className="section-head" style={{ marginBottom: '44px' }}>
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
            <h2 style={{ fontSize: 'clamp(34px, 4.8vw, 60px)', lineHeight: 1.04, margin: 0 }}>
              Tactile minerals.
              <br />
              <i style={{ fontFamily: 'var(--serif, serif)', fontStyle: 'italic', fontWeight: 400 }}>Monolithic tones.</i>
            </h2>
          </div>
          <p style={{ fontSize: '15px', color: '#555e54', maxWidth: '380px', margin: 0, lineHeight: 1.65 }}>
            Through-body mineral compositions and non-porous architectural hues, calibrated in our Bengaluru stockyard.
          </p>
        </ScrollReveal>

        <div className="sequence-monograph-rail">
          {finalMaterials.map((m, idx) => {
            const inTray = isShortlisted(m.slug);
            const numStr = String(idx + 1).padStart(2, '0');
            const cleanName = m.name.replace(/^(DuPont™\s*Corian®|DuPont\s*Corian|Corian®|Corian)\s+/i, '');

            return (
              <article
                key={m.slug}
                className="sequence-step-item"
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedMaterial(m)}
              >
                {/* Header Track */}
                <div className="sequence-step-header">
                  <span className="sequence-step-num">{numStr}</span>
                  <span className="sequence-step-divider">—</span>
                  <span className="sequence-step-phase">{m.pattern.toUpperCase()}</span>
                  <div className="sequence-step-line" />
                </div>

                {/* Swatch Frame */}
                <div className="sequence-image-frame" style={{ aspectRatio: '1 / 1' }}>
                  {m.textureImage ? (
                    <Image
                      src={m.textureImage}
                      alt={m.name}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1100px) 50vw, 25vw"
                      quality={75}
                      decoding="async"
                      loading="lazy"
                      className="sequence-image"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: m.hexColor }} />
                  )}

                  <div className="sequence-image-spec">
                    <span>{m.finish || 'Satin'} · 12mm</span>
                  </div>
                </div>

                {/* Monograph Body */}
                <div className="sequence-step-body" style={{ paddingTop: '14px' }}>
                  <h3 className="sequence-step-title" style={{ fontSize: '18px', margin: '0 0 4px' }}>
                    {cleanName}
                  </h3>
                  <p className="sequence-step-desc" style={{ fontSize: '12.5px', margin: '0 0 12px' }}>
                    {m.collection || 'DuPont™ Corian®'}
                  </p>

                  <div className="sequence-step-footer">
                    <span
                      style={{
                        fontFamily: 'Urbanist, sans-serif',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: inTray ? '#2b6338' : 'var(--ink, #1e211d)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (inTray) {
                          removeSample(m.slug);
                        } else {
                          addSample(m);
                          handleRequestSample();
                        }
                      }}
                    >
                      {inTray ? 'In Sample Tray ✓' : '+ Sample Tray'}
                    </span>
                    <span style={{ fontSize: '12px', color: 'var(--muted)' }}>↗</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>

        {/* Minimalist Footnote Link */}
        <div
          style={{
            marginTop: '40px',
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
            Explore Palette <span>↗</span>
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

      <Toast show={showToast} message="Added to your sample tray" />
    </>
  );
}
