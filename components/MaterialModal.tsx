'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Material } from '@/data/materials';
import { useSampleShortlist } from '@/context/SampleContext';

interface MaterialModalProps {
  material: Material;
  onClose: () => void;
}

export default function MaterialModal({ material, onClose }: MaterialModalProps) {
  const { addSample, removeSample, isShortlisted } = useSampleShortlist();
  const inTray = isShortlisted(material.slug);

  // Close on Escape key and prevent background scroll
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(19, 21, 18, 0.75)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
        opacity: 1,
        visibility: 'visible',
        animation: 'modalFadeIn 0.25s ease-out',
      }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        style={{
          background: 'var(--paper)',
          width: '100%',
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid var(--line)',
          boxShadow: '0 30px 80px rgba(0,0,0,0.35)',
          position: 'relative',
          display: 'grid',
          gridTemplateColumns: 'minmax(300px, 1fr) 1.2fr',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            zIndex: 10,
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            border: '1px solid var(--line)',
            background: 'var(--paper)',
            display: 'grid',
            placeItems: 'center',
            fontSize: '22px',
            cursor: 'pointer',
            lineHeight: 1,
          }}
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Left Side: Large Macro Texture Display */}
        <div
          style={{
            background: material.textureCss || material.hexColor,
            position: 'relative',
            minHeight: '400px',
            overflow: 'hidden',
          }}
        >
          {material.textureImage && (
            <Image
              src={material.textureImage}
              alt={material.name}
              fill
              sizes="(max-width: 768px) 100vw, 450px"
              style={{ objectFit: 'cover' }}
              priority
            />
          )}
          <div
            style={{
              position: 'absolute',
              bottom: '16px',
              left: '16px',
              background: 'rgba(233, 232, 226, 0.92)',
              backdropFilter: 'blur(8px)',
              padding: '6px 12px',
              border: '1px solid var(--line)',
              fontSize: '9px',
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              color: 'var(--ink)',
            }}
          >
            {material.finish} • 1:1 Scale Texture
          </div>
        </div>

        {/* Right Side: Architectural Spec & Actions */}
        <div style={{ padding: 'clamp(28px, 4vw, 48px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
              {material.code} • {material.collection}
            </span>
            <h2 style={{ fontSize: 'clamp(28px, 3.5vw, 42px)', lineHeight: 1.05, margin: '0 0 8px', letterSpacing: '-0.03em' }}>
              {material.name}
            </h2>
            <p style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '18px' }}>
              Tone: {material.colour}
            </p>
            <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#4a5249', marginBottom: '24px' }}>
              {material.description}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', borderTop: '1px solid var(--line)', borderBottom: '1px solid var(--line)', padding: '16px 0', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                  Light Transmission
                </span>
                <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>
                  {material.lightTransmission}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                  Standard Sheet
                </span>
                <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>
                  {material.dimensions}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                  Thickness Options
                </span>
                <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>
                  {material.thicknessOptions.join(', ')}
                </strong>
              </div>
              <div>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
                  Fire Performance
                </span>
                <strong style={{ fontSize: '12px', color: 'var(--ink)' }}>
                  {material.fireRating}
                </strong>
              </div>
            </div>

            <div style={{ marginBottom: '24px' }}>
              <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                Primary Applications
              </span>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {material.applications.map((app) => (
                  <span
                    key={app}
                    style={{
                      fontSize: '10px',
                      fontFamily: 'DM Mono, monospace',
                      padding: '4px 8px',
                      background: '#dcd7cd',
                      border: '1px solid var(--line)',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', borderTop: '1px solid var(--line)', paddingTop: '20px' }}>
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
              style={{ flex: '1 1 auto', minWidth: '160px', justifyContent: 'center' }}
            >
              {inTray ? 'In Sample Tray ✓' : '+ Add to Sample Box'}
            </button>
            <Link
              href={`/materials/${material.slug}`}
              className="button"
              style={{ border: '1px solid var(--line)', background: 'transparent', padding: '14px 18px' }}
            >
              Full Spec Sheet <span>↗</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
