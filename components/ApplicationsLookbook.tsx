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
              fontFamily: 'Urbanist, sans-serif',
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

      {/* Visual Lookbook Editorial Grid — Frameless Architectural Monograph */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '32px 28px',
        }}
      >
        {filteredItems.map((item, idx) => (
          <article
            key={`${item.sectorId}-${idx}`}
            className="lookbook-monograph-item"
          >
            {/* Top Index Rail */}
            <div className="lookbook-monograph-header">
              <span className="lookbook-monograph-num">{item.sectorNumber}</span>
              <span className="lookbook-monograph-divider">—</span>
              <span className="lookbook-monograph-sector">{item.sectorTitle}</span>
              <div className="lookbook-monograph-line" />
            </div>

            {/* Visual Image Viewport */}
            <div className="lookbook-monograph-frame">
              <Image
                src={item.src}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="lookbook-monograph-img"
              />

              {item.tag && (
                <div style={{ position: 'absolute', bottom: '12px', left: '12px', pointerEvents: 'none' }}>
                  <span
                    style={{
                      background: 'rgba(18, 21, 18, 0.78)',
                      backdropFilter: 'blur(8px)',
                      color: '#f7f6f2',
                      fontFamily: 'Urbanist, sans-serif',
                      fontSize: '10px',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      border: '1px solid rgba(255, 255, 255, 0.14)',
                    }}
                  >
                    {item.tag}
                  </span>
                </div>
              )}
            </div>

            {/* Caption & Clean Spec Footer — Minimal Text */}
            <div className="lookbook-monograph-body">
              <h3 className="lookbook-monograph-title">{item.caption}</h3>

              <div className="lookbook-monograph-footer">
                {item.material ? (
                  <Link
                    href={`/materials/${item.material.slug}`}
                    style={{
                      fontFamily: 'Urbanist, sans-serif',
                      fontSize: '11px',
                      color: 'var(--muted, #6f786d)',
                      textDecoration: 'none',
                      textTransform: 'uppercase',
                      letterSpacing: '0.04em',
                    }}
                  >
                    {item.material.name}
                  </Link>
                ) : (
                  <span />
                )}

                <Link
                  href={`/applications/${item.sectorId}`}
                  style={{
                    fontFamily: 'Urbanist, sans-serif',
                    fontSize: '11px',
                    color: 'var(--ink, #1e211d)',
                    textDecoration: 'none',
                    fontWeight: 600,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  Explore <span>↗</span>
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
