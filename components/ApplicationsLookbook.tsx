'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ApplicationSector } from '@/data/applications';

interface Props {
  sectors: ApplicationSector[];
}

export default function ApplicationsLookbook({ sectors }: Props) {
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const allItems = sectors.flatMap((sector) =>
    sector.images.map((img, idx) => ({
      ...img,
      sectorId: sector.id,
      sectorNumber: sector.sectorNumber,
      sectorTitle: sector.title,
      material: sector.recommendedMaterials[idx % sector.recommendedMaterials.length],
      spec: sector.specifications[idx % sector.specifications.length],
    }))
  );

  const filteredItems = activeFilter === 'all'
    ? allItems
    : allItems.filter((item) => item.sectorId === activeFilter);

  const filters = [
    { id: 'all', label: 'All Typologies', count: allItems.length },
    ...sectors.map((s) => ({
      id: s.id,
      label: s.title,
      count: s.images.length,
    })),
  ];

  return (
    <div>
      {/* Category Filter Pills */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          alignItems: 'center',
          marginBottom: '40px',
          paddingBottom: '20px',
          borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.14))',
        }}
      >
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setActiveFilter(f.id)}
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              padding: '8px 16px',
              border: activeFilter === f.id ? '1px solid var(--ink, #1e211d)' : '1px solid var(--line, rgba(30, 33, 29, 0.12))', borderRadius: '4px',
              background: activeFilter === f.id ? 'var(--ink, #1e211d)' : 'transparent',
              color: activeFilter === f.id ? '#ffffff' : 'var(--ink, #1e211d)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            {f.label} <span style={{ opacity: 0.6, marginLeft: '4px' }}>({f.count})</span>
          </button>
        ))}
      </div>

      {/* Visual Lookbook Editorial Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
          gap: '32px',
        }}
      >
        {filteredItems.map((item, idx) => (
          <article
            key={`${item.sectorId}-${idx}`}
            style={{
              background: 'var(--paper, #f5f4ee)',
              border: '1px solid var(--line, rgba(30, 33, 29, 0.09))', borderRadius: '6px',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease',
            }}
            className="lookbook-card"
          >
            {/* Visual Image Viewport */}
            <div
              style={{
                position: 'relative',
                height: '340px',
                width: '100%',
                background: '#1a1d19',
                overflow: 'hidden',
              }}
            >
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="lookbook-card-image"
              />

              {/* Architectural Tag Overlays */}
              <div
                style={{
                  position: 'absolute',
                  top: '14px',
                  left: '14px',
                  display: 'flex',
                  gap: '6px',
                  zIndex: 2,
                }}
              >
                <span
                  style={{
                    background: 'rgba(20, 23, 20, 0.82)',
                    backdropFilter: 'blur(8px)',
                    color: '#ffffff',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '9.5px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    padding: '4px 8px', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: '3px',
                  }}
                >
                  {item.sectorNumber} / {item.sectorTitle}
                </span>
              </div>

              {item.tag && (
                <div
                  style={{
                    position: 'absolute',
                    bottom: '14px',
                    left: '14px',
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(20, 23, 20, 0.88)',
                      backdropFilter: 'blur(8px)',
                      color: '#e9e8e2',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      padding: '4px 10px', border: '1px solid rgba(255, 255, 255, 0.2)', borderRadius: '3px',
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Editorial Caption & Material Reference */}
            <div
              style={{
                padding: '20px 22px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                flex: 1,
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: '16px',
                    fontWeight: 500,
                    margin: '0 0 10px',
                    color: 'var(--ink, #1e211d)',
                    lineHeight: 1.35,
                    letterSpacing: '-0.01em',
                  }}
                >
                  {item.caption}
                </h3>

                {item.spec && (
                  <p
                    style={{
                      fontSize: '12.5px',
                      lineHeight: 1.55,
                      color: '#5d665c',
                      margin: '0 0 16px',
                    }}
                  >
                    {item.spec.description}
                  </p>
                )}
              </div>

              <div
                style={{
                  paddingTop: '14px',
                  borderTop: '1px dashed rgba(30, 33, 29, 0.14)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                {item.material && (
                  <Link
                    href={`/materials/${item.material.slug}`}
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      color: 'var(--ink, #1e211d)',
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                    }}
                  >
                    <span style={{ color: 'var(--muted, #687268)' }}>Spec:</span> {item.material.name} <span>↗</span>
                  </Link>
                )}

                <Link
                  href={`/applications/${item.sectorId}`}
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    color: 'var(--ink, #1e211d)',
                    textDecoration: 'none',
                    fontWeight: 600,
                  }}
                >
                  Sector Guide →
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

      <style jsx>{`
        .lookbook-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 16px 36px rgba(0, 0, 0, 0.08);
        }
        .lookbook-card:hover .lookbook-card-image {
          transform: scale(1.03);
        }
      `}</style>
    </div>
  );
}

