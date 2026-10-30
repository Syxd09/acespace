'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export interface GalleryImageItem {
  src: string;
  alt: string;
  caption: string;
}

export interface ProductImageGalleryProps {
  productName: string;
  productCode: string;
  categoryName: string;
  tagline: string;
  specifications?: { label: string; value: string }[];
  compatibleMaterials?: string[];
  certifications?: string[];
  galleryImages: GalleryImageItem[];
  heroImage?: string;
}

export default function ProductImageGallery({
  productName,
  productCode,
  categoryName,
  tagline,
  specifications = [],
  compatibleMaterials = [],
  galleryImages,
  heroImage,
}: ProductImageGalleryProps) {
  // Ensure we have at least one image to show
  const images: GalleryImageItem[] =
    galleryImages && galleryImages.length > 0
      ? galleryImages
      : heroImage
      ? [{ src: heroImage, alt: productName, caption: tagline }]
      : [];

  const [activeIdx, setActiveIdx] = useState<number | null>(null);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Close modal
  const closeModal = useCallback(() => {
    setActiveIdx(null);
  }, []);

  // Navigate to previous image
  const prevImage = useCallback(() => {
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr - 1 + images.length) % images.length;
    });
  }, [images.length]);

  // Navigate to next image
  const nextImage = useCallback(() => {
    setActiveIdx((curr) => {
      if (curr === null) return 0;
      return (curr + 1) % images.length;
    });
  }, [images.length]);

  // Keyboard navigation
  useEffect(() => {
    if (activeIdx === null) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeModal();
      } else if (e.key === 'ArrowLeft') {
        prevImage();
      } else if (e.key === 'ArrowRight') {
        nextImage();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeIdx, closeModal, prevImage, nextImage]);

  // Body scroll lock
  useEffect(() => {
    if (activeIdx !== null) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [activeIdx]);

  // Touch swipe support for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const distance = touchStart - touchEnd;
    if (distance > 50) {
      nextImage();
    } else if (distance < -50) {
      prevImage();
    }
    setTouchStart(null);
  };

  if (images.length === 0) return null;

  const currentItem = activeIdx !== null ? images[activeIdx] : null;

  return (
    <>
      {/* Gallery Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {images.map((img, i) => (
          <div
            key={i}
            role="button"
            tabIndex={0}
            onClick={() => setActiveIdx(i)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setActiveIdx(i);
              }
            }}
            aria-label={`Open photo ${i + 1}: ${img.caption}`}
            className="product-gallery-card"
            style={{
              background: '#dcd7cd',
              border: '1px solid var(--line, rgba(30, 33, 29, 0.18))',
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              cursor: 'pointer',
              outline: 'none',
              textAlign: 'left',
              transition: 'transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s ease, border-color 0.25s ease',
            }}
          >
            {/* Image Container with hover overlay */}
            <div
              style={{
                position: 'relative',
                height: '300px',
                width: '100%',
                overflow: 'hidden',
                background: '#1a1d19',
              }}
            >
              <Image
                src={img.src}
                alt={img.alt || `${productName} installation photograph ${i + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{
                  objectFit: 'cover',
                  transition: 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
                className="gallery-card-img"
              />

              {/* Top Index Badge */}
              <div
                style={{
                  position: 'absolute',
                  top: '12px',
                  left: '12px',
                  background: 'rgba(20, 23, 20, 0.78)',
                  backdropFilter: 'blur(8px)',
                  color: '#e9e8e2',
                  padding: '4px 10px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  zIndex: 2,
                }}
              >
                PHOTO {String(i + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </div>


            </div>

            {/* Caption & Metadata Foot */}
            <div
              style={{
                padding: '18px 22px',
                background: 'var(--paper, #f5f4ee)',
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                borderTop: '1px solid var(--line, rgba(30, 33, 29, 0.18))',
              }}
            >
              <p
                style={{
                  margin: '0 0 12px',
                  fontSize: '13.5px',
                  color: '#343a33',
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                {img.caption}
              </p>

              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--muted, #667066)',
                  borderTop: '1px dashed rgba(30, 33, 29, 0.14)',
                  paddingTop: '10px',
                }}
              >
                <span>SPECIFICATION VIEW</span>
                <span style={{ color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                  Tap to expand →
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox Architectural Dossier Modal */}
      {activeIdx !== null && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
          className="gallery-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(12, 14, 12, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '16px clamp(16px, 3vw, 36px)',
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          {/* Top Bar: Product Context, Image Counter & Close Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.12)',
              paddingBottom: '14px',
              marginBottom: '14px',
              zIndex: 10,
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  color: 'var(--brand-red, #d43833)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '2px',
                }}
              >
                {productCode} / {categoryName}
              </span>
              <h3
                style={{
                  fontFamily: 'Manrope, sans-serif',
                  fontSize: 'clamp(16px, 2vw, 20px)',
                  fontWeight: 600,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {productName}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  color: '#9ba59b',
                  letterSpacing: '0.06em',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '5px 10px',
                  borderRadius: '2px',
                }}
              >
                IMAGE {String(activeIdx + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
              </span>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close image viewer"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.25)',
                  color: '#ffffff',
                  padding: '7px 14px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  transition: 'background 0.15s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Main Stage: Image Viewport + Architectural Dossier Drawer */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.4fr) minmax(320px, 1fr)',
              gap: '24px',
              alignItems: 'center',
              minHeight: 0,
              margin: '8px 0',
            }}
            className="gallery-modal-stage"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Large High-Res Image Viewport with Previous/Next Arrows */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '420px',
                maxHeight: '70vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.45)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                overflow: 'hidden',
              }}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                }}
              >
                <Image
                  src={currentItem.src}
                  alt={currentItem.alt || currentItem.caption}
                  fill
                  sizes="70vw"
                  style={{ objectFit: 'contain' }}
                  priority
                />
              </div>

              {/* Prev Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={prevImage}
                  aria-label="Previous image"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(15, 18, 15, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.15s ease',
                    zIndex: 4,
                  }}
                >
                  ←
                </button>
              )}

              {/* Next Arrow */}
              {images.length > 1 && (
                <button
                  type="button"
                  onClick={nextImage}
                  aria-label="Next image"
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(15, 18, 15, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    color: '#fff',
                    width: '42px',
                    height: '42px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    backdropFilter: 'blur(8px)',
                    transition: 'all 0.15s ease',
                    zIndex: 4,
                  }}
                >
                  →
                </button>
              )}
            </div>

            {/* Right: Architectural Dossier Panel ("all about this image") */}
            <div
              className="gallery-dossier-panel"
              style={{
                background: 'rgba(22, 25, 22, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                padding: '20px 20px',
                color: '#e9e8e2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                maxHeight: '74vh',
                overflowY: 'auto',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              <div>
                {/* Dossier Header */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.12)', paddingBottom: '10px', marginBottom: '12px' }}>
                  <span
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      color: '#73c991',
                      letterSpacing: '0.12em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '4px',
                    }}
                  >
                    Architectural Installation Dossier
                  </span>
                  <h4
                    style={{
                      fontFamily: 'Manrope, sans-serif',
                      fontSize: '15px',
                      fontWeight: 600,
                      color: '#ffffff',
                      lineHeight: 1.4,
                      margin: 0,
                    }}
                  >
                    {currentItem.caption}
                  </h4>
                </div>

                {/* Key Technical Matrix */}
                <div style={{ marginBottom: '14px' }}>
                  <span
                    style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      color: '#9ca59b',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '8px',
                    }}
                  >
                    Material &amp; Fabrication Protocols
                  </span>

                  <ul
                    style={{
                      listStyle: 'none',
                      padding: 0,
                      margin: 0,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '6px',
                    }}
                  >
                    <li style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c4cdc4', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.35 }}>
                      <span style={{ color: '#73c991' }}>✓</span>
                      <span><strong>Substrate:</strong> Authentic DuPont™ Corian® Solid Surface</span>
                    </li>
                    <li style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c4cdc4', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.35 }}>
                      <span style={{ color: '#73c991' }}>✓</span>
                      <span><strong>Jointing:</strong> Inconspicuous Seamless Chemical Fusion (0.00mm)</span>
                    </li>
                    <li style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c4cdc4', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.35 }}>
                      <span style={{ color: '#73c991' }}>✓</span>
                      <span><strong>Health:</strong> 100% Zero Respirable Crystalline Silica (0.00% RCS)</span>
                    </li>
                    <li style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#c4cdc4', display: 'flex', alignItems: 'flex-start', gap: '8px', lineHeight: 1.35 }}>
                      <span style={{ color: '#73c991' }}>✓</span>
                      <span><strong>Hygiene:</strong> NSF/ANSI 51 Food Zone &amp; Cleanroom Certified</span>
                    </li>
                  </ul>
                </div>

                {/* Product Specifications Preview */}
                {specifications.length > 0 && (
                  <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', marginBottom: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        color: '#9ca59b',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '6px',
                      }}
                    >
                      Typology Specifications
                    </span>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '5px' }}>
                      {specifications.slice(0, 3).map((spec, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#b5c0b5' }}>
                          <span style={{ color: '#788278' }}>{spec.label}:</span>
                          <span style={{ textAlign: 'right', color: '#ffffff' }}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compatible Materials */}
                {compatibleMaterials.length > 0 && (
                  <div style={{ marginBottom: '14px' }}>
                    <span
                      style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        color: '#9ca59b',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '4px',
                      }}
                    >
                      Architectural Palette Range
                    </span>
                    <p style={{ margin: 0, fontSize: '11px', color: '#c4cdc4', lineHeight: 1.45, fontFamily: 'DM Mono, monospace' }}>
                      {compatibleMaterials.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.12)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <Link
                  href={`/contact?product=${encodeURIComponent(productName)}&source=gallery`}
                  style={{
                    background: '#ffffff',
                    color: '#141713',
                    padding: '10px 14px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    transition: 'background 0.15s ease',
                  }}
                >
                  Request CAD &amp; Quotation Dossier <span>→</span>
                </Link>

                <a
                  href={`https://wa.me/919741044776?text=${encodeURIComponent(
                    `Hello Ace Spaces Studio, I am inspecting the ${productName} installation photograph (${currentItem.caption}) and would like to consult on material specification for an upcoming project.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'transparent',
                    color: '#e9e8e2',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '9px 14px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    fontWeight: 500,
                    letterSpacing: '0.06em',
                    textAlign: 'center',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                  }}
                >
                  Consult via WhatsApp Studio Line ↗
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Filmstrip Bar: "and also the images" */}
          <div
            className="gallery-thumb-strip"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
              paddingTop: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              zIndex: 10,
              overflowX: 'auto',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                color: '#9ca59b',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              ALL INSTALLATION PHOTOS ({images.length}):
            </span>

            <div
              className="gallery-thumb-strip"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                overflowX: 'auto',
                padding: '4px 0',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
              }}
            >
              {images.map((thumb, tIdx) => {
                const isSelected = tIdx === activeIdx;
                return (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => setActiveIdx(tIdx)}
                    className={`gallery-thumb-btn ${isSelected ? 'is-active' : ''}`}
                    aria-label={`View photo ${tIdx + 1}`}
                  >
                    <Image
                      src={thumb.src}
                      alt={thumb.caption}
                      fill
                      sizes="80px"
                      style={{ objectFit: 'cover' }}
                    />
                  </button>
                );
              })}
            </div>

            <span
              style={{
                marginLeft: 'auto',
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                color: '#788278',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                gap: '8px',
              }}
              className="gallery-keyboard-hint"
            >
              <span>[← / → Key to Navigate]</span>
              <span>[Esc to Close]</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
