'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Material } from '@/data/materials';
import { useSampleShortlist } from '@/context/SampleContext';

interface MaterialModalProps {
  material: Material;
  onClose: () => void;
}

export default function MaterialModal({ material, onClose }: MaterialModalProps) {
  const [mounted, setMounted] = useState(false);
  const { addSample, removeSample, isShortlisted } = useSampleShortlist();
  const inTray = isShortlisted(material.slug);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Close on Escape key and lock background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    if (cardRef.current) {
      cardRef.current.scrollTop = 0;
    }

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  if (!mounted || typeof document === 'undefined') return null;

  return createPortal(
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: 'rgba(15, 17, 14, 0.8)',
        backdropFilter: 'blur(10px)',
        WebkitBackdropFilter: 'blur(10px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 'clamp(12px, 2.5vh, 24px)',
        boxSizing: 'border-box',
        animation: 'modalFadeIn 0.2s ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={cardRef}
        style={{
          background: 'var(--paper)',
          width: '100%',
          maxWidth: '880px',
          maxHeight: 'min(90vh, 590px)',
          overflowY: 'auto',
          border: '1px solid var(--line)',
          boxShadow: '0 25px 70px rgba(0,0,0,0.45)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(280px, 0.95fr) 1.2fr',
          borderRadius: '2px',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 20,
            width: '32px',
            height: '32px',
            borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'rgba(233, 232, 226, 0.95)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '18px',
            cursor: 'pointer',
            lineHeight: 1,
            color: 'var(--ink)',
            transition: 'transform 0.15s ease',
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Left Side: Macro Texture Display */}
        <div
          style={{
            background: material.textureCss || material.hexColor,
            position: 'relative',
            minHeight: '260px',
            overflow: 'hidden',
          }}
        >
          {(material.textureImage || material.image) && (
            <Image
              src={material.textureImage || material.image}
              alt={material.name}
              fill
              sizes="(max-width: 768px) 100vw, 420px"
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: '12px',
              left: '12px',
              background: 'rgba(233, 232, 226, 0.92)',
              backdropFilter: 'blur(8px)',
              padding: '4px 10px',
              border: '1px solid var(--line)',
              fontSize: '9px',
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
              color: 'var(--ink)',
            }}
          >
            {material.finish} • 1:1 Texture
          </div>
        </div>

        {/* Right Side: Architectural Spec & Actions */}
        <div
          style={{
            padding: 'clamp(18px, 2.4vw, 28px)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '10px',
          }}
        >
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                {material.code} • {material.collection}
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1.1, margin: '0 0 4px', letterSpacing: '-0.03em' }}>
              {material.name}
            </h2>

            <p style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', margin: '0 0 8px', letterSpacing: '0.04em' }}>
              Tone: {material.colour}
            </p>

            <p style={{ fontSize: '13px', lineHeight: 1.5, color: '#4a5249', margin: '0 0 12px' }}>
              {material.description}
            </p>

            {/* 2x2 Specs Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 12px',
                borderTop: '1px solid var(--line)',
                borderBottom: '1px solid var(--line)',
                padding: '10px 0',
                marginBottom: '10px',
              }}
            >
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                  Light Transmission
                </span>
                <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                  {material.lightTransmission}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                  Standard Sheet
                </span>
                <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                  {material.dimensions}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                  Thickness Options
                </span>
                <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                  {material.thicknessOptions && material.thicknessOptions.length > 0
                    ? material.thicknessOptions.join(', ')
                    : '12mm, 19mm'}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                  Fire Performance
                </span>
                <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                  {material.fireRating || 'Class 1 / Class A'}
                </strong>
              </div>
            </div>

            {/* Primary Applications Pills */}
            <div>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '6px' }}>
                Primary Applications
              </span>
              <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap' }}>
                {(material.applications && material.applications.length > 0
                  ? material.applications
                  : ['Architectural Surfaces', 'Interior Joinery']
                ).map((app) => (
                  <span
                    key={app}
                    style={{
                      fontSize: '9px',
                      fontFamily: 'DM Mono, monospace',
                      padding: '3px 7px',
                      background: '#dcd7cd',
                      border: '1px solid var(--line)',
                      color: 'var(--ink)',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: '10px' }}>
            <button
              type="button"
              className="button button-dark"
              onClick={() => {
                if (inTray) {
                  removeSample(material.slug);
                } else {
                  addSample(material);
                }
              }}
              style={{ flex: '1 1 auto', minWidth: '140px', padding: '9px 16px', fontSize: '11px', justifyContent: 'center' }}
            >
              {inTray ? 'In Sample Tray ✓' : '+ Add to Sample Box'}
            </button>
            <Link
              href={`/materials/${material.slug}`}
              className="button"
              style={{ border: '1px solid var(--line)', background: 'transparent', padding: '9px 16px', fontSize: '11px' }}
            >
              Full Spec Sheet <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
