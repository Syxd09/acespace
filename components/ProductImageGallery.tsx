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
      {/* Gallery Cards Grid — Clean Monograph Style */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '24px',
        }}
      >
        {images.map((img, i) => {
          const numStr = String(i + 1).padStart(2, '0');
          return (
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
              aria-label={`View photo ${i + 1}: ${img.caption}`}
              className="sequence-step-item"
              style={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
              }}
            >
              {/* Header Track */}
              <div className="sequence-step-header">
                <span className="sequence-step-num">{numStr}</span>
                <span className="sequence-step-divider">—</span>
                <span className="sequence-step-phase">INSTALLATION</span>
                <div className="sequence-step-line" />
              </div>

              {/* Clean Image Frame with Zoom */}
              <div className="sequence-image-frame" style={{ aspectRatio: '16 / 10' }}>
                <Image
                  src={img.src}
                  alt={img.alt || `${productName} installation photograph ${i + 1}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="sequence-image"
                  style={{ objectFit: 'cover' }}
                />
                <div className="sequence-image-spec">
                  <span>Photo {numStr} of {String(images.length).padStart(2, '0')}</span>
                </div>
              </div>

              {/* Caption & Clean Link */}
              <div className="sequence-step-body" style={{ paddingTop: '14px' }}>
                <p className="sequence-step-desc" style={{ fontSize: '14px', margin: '0 0 12px', color: '#3c423b', lineHeight: 1.55 }}>
                  {img.caption}
                </p>
                <div className="sequence-step-footer" style={{ borderTop: 'none', paddingTop: 0 }}>
                  <span style={{ fontSize: '11px', fontFamily: "'Urbanist', sans-serif", fontWeight: 600, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    View Fullscreen
                  </span>
                  <span style={{ fontSize: '12px', color: 'var(--muted)' }}>↗</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Lightbox Modal — Clean, Minimalist & Modern */}
      {activeIdx !== null && currentItem && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={closeModal}
          className="gallery-modal-overlay"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(14, 16, 14, 0.94)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            zIndex: 9999,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            padding: '20px clamp(16px, 3.5vw, 40px)',
            overflowY: 'auto',
            fontFamily: "'Urbanist', -apple-system, sans-serif",
          }}
        >
          {/* Top Bar: Product Context & Close Button */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              paddingBottom: '16px',
              marginBottom: '16px',
              zIndex: 10,
              gap: '16px',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div>
              <span
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.6)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '2px',
                  fontWeight: 600,
                }}
              >
                {productCode} · {categoryName}
              </span>
              <h3
                style={{
                  fontSize: 'clamp(18px, 2.2vw, 24px)',
                  fontWeight: 500,
                  color: '#ffffff',
                  margin: 0,
                  letterSpacing: '-0.02em',
                }}
              >
                {productName}
              </h3>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <span
                style={{
                  fontSize: '11px',
                  color: 'rgba(255, 255, 255, 0.7)',
                  letterSpacing: '0.06em',
                  background: 'rgba(255, 255, 255, 0.08)',
                  padding: '6px 12px',
                  borderRadius: '3px',
                  fontWeight: 500,
                }}
              >
                Photo {activeIdx + 1} of {images.length}
              </span>

              <button
                type="button"
                onClick={closeModal}
                aria-label="Close image viewer"
                style={{
                  background: 'rgba(255, 255, 255, 0.12)',
                  border: '1px solid rgba(255, 255, 255, 0.22)',
                  color: '#ffffff',
                  padding: '7px 16px',
                  borderRadius: '3px',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  transition: 'background 0.2s ease',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  fontFamily: "'Urbanist', -apple-system, sans-serif",
                }}
              >
                ✕ Close
              </button>
            </div>
          </div>

          {/* Main Stage: Image Viewport + Clean Architectural Details */}
          <div
            style={{
              flex: 1,
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 1.45fr) minmax(320px, 1fr)',
              gap: '28px',
              alignItems: 'center',
              minHeight: 0,
              margin: '10px 0',
            }}
            className="gallery-modal-stage"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Large Image Viewport */}
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '100%',
                minHeight: '440px',
                maxHeight: '72vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'rgba(0, 0, 0, 0.35)',
                borderRadius: '4px',
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
                  aria-label="Previous photo"
                  style={{
                    position: 'absolute',
                    left: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(20, 23, 20, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    backdropFilter: 'blur(8px)',
                    transition: 'background 0.2s ease',
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
                  aria-label="Next photo"
                  style={{
                    position: 'absolute',
                    right: '16px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'rgba(20, 23, 20, 0.75)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#ffffff',
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    fontSize: '18px',
                    backdropFilter: 'blur(8px)',
                    transition: 'background 0.2s ease',
                    zIndex: 4,
                  }}
                >
                  →
                </button>
              )}
            </div>

            {/* Right: Clean Details Card */}
            <div
              className="gallery-dossier-panel"
              style={{
                background: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '6px',
                padding: '24px 26px',
                color: '#e9e8e2',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                maxHeight: '74vh',
                overflowY: 'auto',
              }}
            >
              <div>
                {/* Photo Caption */}
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '14px', marginBottom: '16px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.55)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '6px',
                      fontWeight: 600,
                    }}
                  >
                    Installation Details
                  </span>
                  <h4
                    style={{
                      fontSize: '17px',
                      fontWeight: 500,
                      color: '#ffffff',
                      lineHeight: 1.45,
                      margin: 0,
                    }}
                  >
                    {currentItem.caption}
                  </h4>
                </div>

                {/* Key Material Facts */}
                <div style={{ marginBottom: '18px' }}>
                  <span
                    style={{
                      fontSize: '11px',
                      color: 'rgba(255, 255, 255, 0.55)',
                      letterSpacing: '0.08em',
                      textTransform: 'uppercase',
                      display: 'block',
                      marginBottom: '10px',
                      fontWeight: 600,
                    }}
                  >
                    Material &amp; Fabrication
                  </span>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#c4cdc4', paddingBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Material</span>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>DuPont™ Corian® Solid Surface</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#c4cdc4', paddingBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Joinery</span>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>Seamless invisible chemical bond</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#c4cdc4', paddingBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                      <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>Hygiene</span>
                      <span style={{ color: '#ffffff', fontWeight: 500 }}>100% Non-porous · Zero Silica</span>
                    </div>
                  </div>
                </div>

                {/* Product Specifications */}
                {specifications.length > 0 && (
                  <div style={{ marginBottom: '18px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.55)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '8px',
                        fontWeight: 600,
                      }}
                    >
                      Specifications
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '7px' }}>
                      {specifications.slice(0, 3).map((spec, sIdx) => (
                        <div key={sIdx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px', color: '#c4cdc4', paddingBottom: '6px', borderBottom: '1px solid rgba(255, 255, 255, 0.06)' }}>
                          <span style={{ color: 'rgba(255, 255, 255, 0.6)' }}>{spec.label}</span>
                          <span style={{ textAlign: 'right', color: '#ffffff', fontWeight: 500 }}>{spec.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Compatible Palette */}
                {compatibleMaterials.length > 0 && (
                  <div style={{ marginBottom: '16px' }}>
                    <span
                      style={{
                        fontSize: '11px',
                        color: 'rgba(255, 255, 255, 0.55)',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        display: 'block',
                        marginBottom: '6px',
                        fontWeight: 600,
                      }}
                    >
                      Color Finishes
                    </span>
                    <p style={{ margin: 0, fontSize: '12px', color: '#d0d8d0', lineHeight: 1.5 }}>
                      {compatibleMaterials.join(', ')}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <Link
                  href={`/contact?product=${encodeURIComponent(productName)}&source=gallery`}
                  style={{
                    background: '#ffffff',
                    color: '#141713',
                    padding: '12px 16px',
                    borderRadius: '4px',
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
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  Request a Quote <span>↗</span>
                </Link>

                <a
                  href={`https://wa.me/919741044776?text=${encodeURIComponent(
                    `Hello Ace Spaces Studio, I am viewing the ${productName} installation photo (${currentItem.caption}) and would like to ask a question.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    background: 'transparent',
                    color: '#e9e8e2',
                    border: '1px solid rgba(255, 255, 255, 0.25)',
                    padding: '11px 16px',
                    borderRadius: '4px',
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
                  Chat on WhatsApp ↗
                </a>
              </div>
            </div>
          </div>

          {/* Bottom Filmstrip Bar */}
          <div
            className="gallery-thumb-strip"
            style={{
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
              paddingTop: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              zIndex: 10,
              overflowX: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <span
              style={{
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.55)',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
                fontWeight: 600,
              }}
            >
              Photos ({images.length}):
            </span>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                overflowX: 'auto',
                padding: '4px 0',
              }}
            >
              {images.map((thumb, tIdx) => {
                const isSelected = tIdx === activeIdx;
                return (
                  <button
                    key={tIdx}
                    type="button"
                    onClick={() => setActiveIdx(tIdx)}
                    style={{
                      position: 'relative',
                      width: '72px',
                      height: '48px',
                      flexShrink: 0,
                      borderRadius: '3px',
                      overflow: 'hidden',
                      border: isSelected ? '2px solid #ffffff' : '1px solid rgba(255, 255, 255, 0.2)',
                      padding: 0,
                      background: '#1a1d19',
                      cursor: 'pointer',
                      opacity: isSelected ? 1 : 0.65,
                      transition: 'all 0.2s ease',
                    }}
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
                fontSize: '11px',
                color: 'rgba(255, 255, 255, 0.45)',
                whiteSpace: 'nowrap',
                display: 'inline-flex',
                gap: '8px',
              }}
              className="gallery-keyboard-hint"
            >
              <span>Esc to close</span>
              <span>·</span>
              <span>Arrow keys to navigate</span>
            </span>
          </div>
        </div>
      )}
    </>
  );
}
