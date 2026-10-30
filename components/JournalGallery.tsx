'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface JournalGalleryProps {
  images?: string[];
  articleTitle?: string;
}

export default function JournalGallery({ images, articleTitle = 'Journal Essay' }: JournalGalleryProps) {
  const [activePhotoIndex, setActivePhotoIndex] = useState<number | null>(null);

  if (!images || images.length === 0) return null;

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    if (activePhotoIndex === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActivePhotoIndex(null);
      if (e.key === 'ArrowRight') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0));
      }
      if (e.key === 'ArrowLeft') {
        setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePhotoIndex, images.length]);

  return (
    <section className="journal-gallery-section" style={{ marginTop: '56px', marginBottom: '40px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1px solid rgba(30,33,29,0.12)', paddingBottom: '12px' }}>
        <div>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#737e73', display: 'block' }}>
            Visual Monograph &amp; Documentation
          </span>
          <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 500, margin: '2px 0 0 0', color: 'var(--ink, #1e211d)' }}>
            Article Gallery ({images.length} {images.length === 1 ? 'Photograph' : 'Photographs'})
          </h3>
        </div>
        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>
          Click to expand ↗
        </span>
      </div>

      {/* Responsive Gallery Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: images.length === 1 ? '1fr' : images.length === 2 ? 'repeat(2, 1fr)' : 'repeat(auto-fill, minmax(260px, 1fr))',
          gap: '16px',
        }}
      >
        {images.map((imgSrc, idx) => {
          const isFeaturedSpan = images.length === 3 && idx === 0;

          return (
            <div
              key={`${imgSrc}-${idx}`}
              onClick={() => setActivePhotoIndex(idx)}
              style={{
                position: 'relative',
                height: isFeaturedSpan ? '320px' : '240px',
                gridColumn: isFeaturedSpan ? '1 / -1' : undefined,
                background: '#1c201b',
                borderRadius: '2px',
                overflow: 'hidden',
                cursor: 'pointer',
                border: '1px solid rgba(30,33,29,0.12)',
                boxShadow: '0 4px 16px rgba(0,0,0,0.04)',
                transition: 'transform 0.25s ease, box-shadow 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 12px 28px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none';
                e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.04)';
              }}
            >
              <Image
                src={imgSrc}
                alt={`${articleTitle} — Photo ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                style={{ objectFit: 'cover' }}
              />

              {/* Gradient Bottom Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(20,23,19,0.85) 0%, rgba(20,23,19,0) 45%)',
                  pointerEvents: 'none',
                }}
              />

              {/* Tag & Index Badge */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '12px',
                  left: '14px',
                  right: '14px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: '#fff',
                }}
              >
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    background: 'rgba(255,255,255,0.18)',
                    backdropFilter: 'blur(4px)',
                    padding: '3px 8px',
                    borderRadius: '2px',
                  }}
                >
                  FIG. {String(idx + 1).padStart(2, '0')}
                </span>
                <span
                  style={{
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    color: '#d0cfc7',
                    letterSpacing: '0.04em',
                  }}
                >
                  Expand ↗
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Fullscreen Modal */}
      {activePhotoIndex !== null && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setActivePhotoIndex(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,18,15,0.96)',
            backdropFilter: 'blur(10px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '24px clamp(16px, 4vw, 48px)',
          }}
        >
          {/* Header Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              color: '#fff',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#9ca59b', letterSpacing: '0.08em' }}>
                {articleTitle}
              </span>
              <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '14px', fontWeight: 600 }}>
                Photograph {activePhotoIndex + 1} of {images.length}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActivePhotoIndex(null)}
              aria-label="Close photo viewer"
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '8px 16px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                cursor: 'pointer',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              Close ✕
            </button>
          </div>

          {/* Main Full-Size Image Container */}
          <div
            style={{
              position: 'relative',
              width: '100%',
              flex: 1,
              margin: '20px 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '1200px', maxHeight: '80vh' }}>
              <Image
                src={images[activePhotoIndex]}
                alt={`${articleTitle} — Photo ${activePhotoIndex + 1}`}
                fill
                sizes="90vw"
                style={{ objectFit: 'contain' }}
                priority
              />
            </div>
          </div>

          {/* Navigation Controls Bar */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              zIndex: 10,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              disabled={images.length <= 1}
              onClick={() => setActivePhotoIndex((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : 0))}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '10px 20px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '12px',
                cursor: images.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: images.length <= 1 ? 0.4 : 1,
                borderRadius: '2px',
              }}
            >
              ← Previous
            </button>

            {/* Thumbnail Strip */}
            <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', maxWidth: '60vw', padding: '4px' }}>
              {images.map((thumbSrc, tIdx) => (
                <div
                  key={`thumb-${tIdx}`}
                  onClick={() => setActivePhotoIndex(tIdx)}
                  style={{
                    position: 'relative',
                    width: '44px',
                    height: '44px',
                    borderRadius: '2px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: tIdx === activePhotoIndex ? '2px solid var(--brand-red, #c4433d)' : '1px solid rgba(255,255,255,0.3)',
                    opacity: tIdx === activePhotoIndex ? 1 : 0.6,
                    flexShrink: 0,
                  }}
                >
                  <Image src={thumbSrc} alt={`Thumbnail ${tIdx + 1}`} fill sizes="44px" style={{ objectFit: 'cover' }} />
                </div>
              ))}
            </div>

            <button
              type="button"
              disabled={images.length <= 1}
              onClick={() => setActivePhotoIndex((prev) => (prev !== null ? (prev + 1) % images.length : 0))}
              style={{
                background: 'rgba(255,255,255,0.12)',
                border: '1px solid rgba(255,255,255,0.2)',
                color: '#fff',
                padding: '10px 20px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '12px',
                cursor: images.length <= 1 ? 'not-allowed' : 'pointer',
                opacity: images.length <= 1 ? 0.4 : 1,
                borderRadius: '2px',
              }}
            >
              Next →
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
