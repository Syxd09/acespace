'use client';

import React, { useState, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Material } from '@/data/materials';
import { useSampleShortlist } from '@/context/SampleContext';

interface ApplicationMaterialGalleryProps {
  sectorTitle: string;
  sectorSlug: string;
  materials: Material[];
}

export default function ApplicationMaterialGallery({
  sectorTitle,
  sectorSlug,
  materials,
}: ApplicationMaterialGalleryProps) {
  const [selectedFamily, setSelectedFamily] = useState<string>('all');
  const [inspectingMaterial, setInspectingMaterial] = useState<Material | null>(null);
  const { addSample, removeSample, isShortlisted } = useSampleShortlist();

  // Distinct category filters based on materials available for this sector
  const families = useMemo(() => {
    const set = new Set<string>();
    materials.forEach((m) => {
      if (m.type) set.add(m.type);
    });
    return Array.from(set);
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    if (selectedFamily === 'all') return materials;
    return materials.filter((m) => m.type === selectedFamily);
  }, [materials, selectedFamily]);

  // Sector-tailored certification tags for cards
  const getSectorBadge = (mat: Material, index: number) => {
    if (sectorSlug.includes('health') || sectorSlug.includes('custom') || sectorSlug.includes('hospital')) {
      const badges = [
        'ISO 846 RATING 0 • ZERO BACTERIAL GROWTH',
        'NSF / ANSI 51 • CLEANROOM & SURGICAL CERTIFIED',
        'DIN 68861 • CHEMICAL & REAGENT IMMUNE',
        'HERMETIC WELD • ZERO SILICONE JOINTS',
        '100% NON-POROUS • ASTM D570 < 0.03%',
      ];
      return badges[index % badges.length];
    }
    if (sectorSlug.includes('resident')) {
      const badges = [
        'NSF 51 CERTIFIED • CULINARY FOOD SAFE',
        'SEAMLESS 45° MITRE • WATERFALL COMPLIANT',
        'ZERO-GROUT • INTEGRAL COVED BASINS',
        'ASTM D570 < 0.03% • ZERO OIL ABSORPTION',
      ];
      return badges[index % badges.length];
    }
    if (sectorSlug.includes('hospit')) {
      const badges = [
        'EN 13501-1 CLASS B-S1 • LOW FLAMMABILITY',
        'SEFA 8.1 • ETHANOL & MIXER RESISTANT',
        'FIELD RENEWABLE • SCRATCH REPAIRABLE',
        'OPTICAL DIFFUSION • SUB-SURFACE BACKLIT',
      ];
      return badges[index % badges.length];
    }
    return 'ARCHITECTURAL GRADE • SOLID THROUGH-BODY';
  };

  const getApplicationSuitability = (mat: Material) => {
    if (sectorSlug.includes('health') || sectorSlug.includes('custom') || sectorSlug.includes('hospital')) {
      return 'Specified for surgical scrub sinks, operatory countertops, diagnostic lab workbenches, and cleanroom wall linings.';
    }
    if (sectorSlug.includes('resident')) {
      return 'Engineered for monolithic kitchen islands, continuous water-shedding splashbacks, and integrated bathroom vanities.';
    }
    if (sectorSlug.includes('hospit')) {
      return 'Specified for sculptural reception monoliths, backlit cocktail bar counters, and high-traffic lobby cladding.';
    }
    if (sectorSlug.includes('comm')) {
      return 'Specified for collaboration review islands, flush-milled wireless charging desks, and seamless public washroom troughs.';
    }
    return 'Specified for bespoke monolithic counters, sculptural display plinths, and high-impact architectural elements.';
  };

  return (
    <section
      id="materials-gallery"
      style={{
        padding: '80px 0',
        borderBottom: '1px solid var(--line)',
      }}
    >
      {/* Header Block */}
      <div style={{ maxWidth: '780px', marginBottom: '40px' }}>
        <p className="eyebrow" style={{ color: 'var(--muted)', marginBottom: '14px' }}>
          Approved Architectural Surfaces / {sectorTitle}
        </p>
        <h2
          style={{
            fontSize: 'clamp(32px, 4.5vw, 56px)',
            lineHeight: 1.02,
            letterSpacing: '-0.04em',
            margin: '0 0 20px',
          }}
        >
          Specified Materials for
          <br />
          <i>{sectorTitle}.</i>
        </h2>
        <p
          style={{
            fontSize: '16px',
            lineHeight: 1.7,
            color: '#4a5249',
            margin: 0,
          }}
        >
          Explore our certified through-body architectural solid surface materials engineered for {sectorTitle.toLowerCase()}.
          Each substrate is non-porous, thermo-weldable with inconspicuous seams (&lt; 0.08mm), and backed by rigorous laboratory testing.
        </p>
      </div>

      {/* Category Filter Pills */}
      {families.length > 1 && (
        <div
          style={{
            display: 'flex',
            gap: '10px',
            flexWrap: 'wrap',
            marginBottom: '36px',
            borderBottom: '1px solid rgba(30, 33, 29, 0.12)',
            paddingBottom: '20px',
          }}
        >
          <button
            type="button"
            onClick={() => setSelectedFamily('all')}
            style={{
              padding: '8px 18px',
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              border: selectedFamily === 'all' ? '1px solid var(--ink)' : '1px solid rgba(30,33,29,0.18)',
              background: selectedFamily === 'all' ? 'var(--ink)' : 'transparent',
              color: selectedFamily === 'all' ? '#fff' : 'var(--ink)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            All Sector Materials ({materials.length})
          </button>
          {families.map((fam) => {
            const count = materials.filter((m) => m.type === fam).length;
            const labelMap: Record<string, string> = {
              mineral: 'Pure Mineral Solids',
              veined: 'Veined Marble Flow',
              textured: 'Particulate Systems',
              translucent: 'Optic & Backlit',
            };
            return (
              <button
                key={fam}
                type="button"
                onClick={() => setSelectedFamily(fam)}
                style={{
                  padding: '8px 18px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  border: selectedFamily === fam ? '1px solid var(--ink)' : '1px solid rgba(30,33,29,0.18)',
                  background: selectedFamily === fam ? 'var(--ink)' : 'transparent',
                  color: selectedFamily === fam ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {labelMap[fam] || fam} ({count})
              </button>
            );
          })}
        </div>
      )}

      {/* Material Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '30px',
        }}
      >
        {filteredMaterials.map((mat, idx) => {
          const inTray = isShortlisted(mat.slug);
          const badgeText = getSectorBadge(mat, idx);

          return (
            <article
              key={mat.slug}
              style={{
                border: '1px solid var(--line)',
                background: '#dcd7cd',
                display: 'flex',
                flexDirection: 'column',
                overflow: 'hidden',
                transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
              }}
              className="material-card-hover"
            >
              {/* Swatch & Texture Frame */}
              <div
                style={{
                  position: 'relative',
                  height: '260px',
                  width: '100%',
                  background: mat.hexColor || '#e0ded8',
                  overflow: 'hidden',
                  cursor: 'pointer',
                }}
                onClick={() => setInspectingMaterial(mat)}
                title="Click to inspect macro texture & specs"
              >
                {mat.textureImage ? (
                  <Image
                    src={mat.textureImage}
                    alt={`${mat.name} architectural solid surface macro texture`}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{
                      objectFit: 'cover',
                      transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                    className="gallery-zoom-img"
                  />
                ) : (
                  <div
                    style={{
                      width: '100%',
                      height: '100%',
                      background: mat.textureCss || mat.hexColor,
                    }}
                  />
                )}

                {/* Top Badge: Technical Certification */}
                <div
                  style={{
                    position: 'absolute',
                    top: '14px',
                    left: '14px',
                    right: '14px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(23, 26, 23, 0.85)',
                      backdropFilter: 'blur(8px)',
                      color: '#f5f4ef',
                      padding: '4px 10px',
                      fontSize: '9px',
                      fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                    }}
                  >
                    {badgeText}
                  </span>
                  <span
                    style={{
                      background: 'rgba(233, 232, 226, 0.92)',
                      backdropFilter: 'blur(8px)',
                      color: 'var(--ink)',
                      padding: '4px 8px',
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      border: '1px solid rgba(30, 33, 29, 0.2)',
                    }}
                  >
                    🔍
                  </span>
                </div>

                {/* Bottom Overlay Pill on Hover Hint */}
                <div
                  style={{
                    position: 'absolute',
                    bottom: '12px',
                    left: '14px',
                    right: '14px',
                    background: 'rgba(233, 232, 226, 0.94)',
                    backdropFilter: 'blur(8px)',
                    padding: '8px 14px',
                    border: '1px solid rgba(30, 33, 29, 0.15)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    color: 'var(--ink)',
                    textTransform: 'uppercase',
                  }}
                >
                  <span>Inspection Specimen</span>
                  <span>Click to Zoom &rarr;</span>
                </div>
              </div>

              {/* Card Meta & Spec Breakdown */}
              <div
                style={{
                  padding: '24px',
                  background: 'var(--paper)',
                  borderTop: '1px solid var(--line)',
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                      marginBottom: '8px',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '10px',
                        fontFamily: 'DM Mono, monospace',
                        color: 'var(--muted)',
                        textTransform: 'uppercase',
                        letterSpacing: '0.08em',
                      }}
                    >
                      {mat.collection}
                    </span>
                    <span
                      style={{
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        color: 'var(--ink)',
                        fontWeight: 600,
                      }}
                    >
                      {mat.code}
                    </span>
                  </div>

                  <h3
                    style={{
                      fontSize: '20px',
                      lineHeight: 1.15,
                      letterSpacing: '-0.02em',
                      margin: '0 0 10px',
                      color: 'var(--ink)',
                    }}
                  >
                    {mat.name}
                  </h3>

                  <p
                    style={{
                      fontSize: '13px',
                      lineHeight: 1.6,
                      color: '#4a5249',
                      marginBottom: '16px',
                    }}
                  >
                    {getApplicationSuitability(mat)}
                  </p>

                  {/* Surface Attributes */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '10px',
                      padding: '12px',
                      background: 'rgba(30, 33, 29, 0.04)',
                      marginBottom: '20px',
                      border: '1px solid rgba(30, 33, 29, 0.08)',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontFamily: 'DM Mono, monospace',
                          color: 'var(--muted)',
                          textTransform: 'uppercase',
                          display: 'block',
                        }}
                      >
                        Surface Finish
                      </span>
                      <strong
                        style={{
                          fontSize: '12px',
                          color: 'var(--ink)',
                          fontFamily: 'DM Mono, monospace',
                        }}
                      >
                        {mat.finish}
                      </strong>
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '9px',
                          fontFamily: 'DM Mono, monospace',
                          color: 'var(--muted)',
                          textTransform: 'uppercase',
                          display: 'block',
                        }}
                      >
                        Thickness
                      </span>
                      <strong
                        style={{
                          fontSize: '12px',
                          color: 'var(--ink)',
                          fontFamily: 'DM Mono, monospace',
                        }}
                      >
                        {mat.thicknessOptions ? mat.thicknessOptions.join(' / ') : '12mm / 19mm'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Actions: + Sample Tray & Full Spec Link */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(30, 33, 29, 0.1)',
                  }}
                >
                  <button
                    type="button"
                    onClick={() => (inTray ? removeSample(mat.slug) : addSample(mat))}
                    style={{
                      padding: '8px 16px',
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                      background: inTray ? '#253f2a' : 'var(--ink)',
                      color: inTray ? '#fff' : '#fff',
                      border: 'none',
                      cursor: 'pointer',
                      borderRadius: '100px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.25s ease',
                      boxShadow: inTray ? '0 4px 12px rgba(37,63,42,0.3)' : 'none',
                    }}
                  >
                    {inTray ? 'IN TRAY ✓' : '+ SAMPLE TRAY'}
                  </button>

                  <Link
                    href={`/materials/${mat.slug}`}
                    className="text-link"
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      letterSpacing: '0.06em',
                    }}
                  >
                    Spec Sheet <span>↗</span>
                  </Link>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Lightbox / High-Definition Specimen Modal */}
      {inspectingMaterial && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            background: 'rgba(23, 26, 23, 0.85)',
            backdropFilter: 'blur(16px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
          }}
          onClick={() => setInspectingMaterial(null)}
        >
          <div
            style={{
              maxWidth: '960px',
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              background: '#eeece6',
              border: '1px solid var(--line)',
              boxShadow: '0 30px 80px rgba(0, 0, 0, 0.4)',
              display: 'grid',
              gridTemplateColumns: '1.2fr 1fr',
            }}
            onClick={(e) => e.stopPropagation()}
            className="specimen-modal-grid"
          >
            {/* Left: Huge High-Res Material Texture */}
            <div
              style={{
                position: 'relative',
                minHeight: '420px',
                background: inspectingMaterial.hexColor || '#dcd7cd',
              }}
            >
              {inspectingMaterial.textureImage ? (
                <Image
                  src={inspectingMaterial.textureImage}
                  alt={inspectingMaterial.name}
                  fill
                  style={{ objectFit: 'cover' }}
                  priority
                />
              ) : (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: inspectingMaterial.textureCss || inspectingMaterial.hexColor,
                  }}
                />
              )}
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  left: '16px',
                  background: 'rgba(23, 26, 23, 0.9)',
                  color: '#fff',
                  padding: '6px 14px',
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                1:1 Architectural Macro Specimen
              </div>
            </div>

            {/* Right: Technical Spec Breakdown */}
            <div
              style={{
                padding: '36px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      color: 'var(--muted)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.08em',
                    }}
                  >
                    {inspectingMaterial.collection} • {inspectingMaterial.code}
                  </span>
                  <button
                    type="button"
                    onClick={() => setInspectingMaterial(null)}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      fontSize: '18px',
                      cursor: 'pointer',
                      color: 'var(--ink)',
                      padding: '4px 8px',
                    }}
                    aria-label="Close modal"
                  >
                    ✕
                  </button>
                </div>

                <h3
                  style={{
                    fontSize: '28px',
                    lineHeight: 1.1,
                    letterSpacing: '-0.03em',
                    margin: '0 0 16px',
                    color: 'var(--ink)',
                  }}
                >
                  {inspectingMaterial.name}
                </h3>

                <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', marginBottom: '24px' }}>
                  {inspectingMaterial.description}
                </p>

                {/* Technical Table */}
                <div
                  style={{
                    borderTop: '1px solid var(--line)',
                    borderBottom: '1px solid var(--line)',
                    padding: '16px 0',
                    marginBottom: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Composition</span>
                    <strong style={{ color: 'var(--ink)' }}>2/3 Natural ATH Mineral + 1/3 Acrylic</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Porosity</span>
                    <strong style={{ color: 'var(--ink)' }}>ASTM D570 &lt; 0.03% (Zero Absorption)</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Bacterial Defense</span>
                    <strong style={{ color: 'var(--ink)' }}>ISO 846 Method A &amp; C Rating 0</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Fire Rating</span>
                    <strong style={{ color: 'var(--ink)' }}>{inspectingMaterial.fireRating || 'Class 1 / Class A (ASTM E84)'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>Joint Seam</span>
                    <strong style={{ color: 'var(--ink)' }}>&lt; 0.08mm Chemical Thermo-Weld</strong>
                  </div>
                </div>
              </div>

              {/* Modal Buttons */}
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={() => {
                    if (isShortlisted(inspectingMaterial.slug)) {
                      removeSample(inspectingMaterial.slug);
                    } else {
                      addSample(inspectingMaterial);
                    }
                  }}
                  className="button button-dark"
                  style={{
                    padding: '12px 24px',
                    fontSize: '12px',
                    background: isShortlisted(inspectingMaterial.slug) ? '#253f2a' : 'var(--ink)',
                  }}
                >
                  {isShortlisted(inspectingMaterial.slug) ? 'In Sample Tray ✓' : '+ Add Sample to Tray'}
                </button>
                <Link
                  href={`/materials/${inspectingMaterial.slug}`}
                  className="button"
                  style={{
                    padding: '12px 20px',
                    fontSize: '12px',
                    fontFamily: 'DM Mono, monospace',
                    border: '1px solid var(--line)',
                    textTransform: 'uppercase',
                  }}
                  onClick={() => setInspectingMaterial(null)}
                >
                  Full Spec Sheet ↗
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
