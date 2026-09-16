'use client';

import React, { useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { Material } from '@/data/materials';
import { useSampleShortlist } from '@/context/SampleContext';
import SpecimenZoomViewer from '@/components/SpecimenZoomViewer';

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
      className="material-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        ref={cardRef}
        className="material-modal-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="material-modal-close"
          aria-label="Close modal"
        >
          ×
        </button>

        {/* Top/Left: Interactive Zoomable Macro Texture & In-Situ Application Viewer */}
        <div className="material-modal-media">
          <SpecimenZoomViewer
            textureImage={material.textureImage}
            applicationImage={material.image}
            materialName={material.name}
            materialFinish={material.finish}
            materialColour={material.colour}
            fallbackBg={material.hexColor}
            textureCss={material.textureCss}
            minHeight="100%"
          />
        </div>

        {/* Bottom/Right: Architectural Spec & Actions */}
        <div className="material-modal-body">
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
              <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                {material.code} • {material.collection}
              </span>
            </div>

            <h2 style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', lineHeight: 1.15, margin: '0 0 4px', letterSpacing: '-0.02em', wordBreak: 'break-word' }}>
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
              className="material-modal-specs-grid"
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '8px 14px',
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
            <div style={{ marginBottom: '12px' }}>
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
                      borderRadius: '1px',
                    }}
                  >
                    {app}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="material-modal-actions">
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
              style={{ flex: '1 1 auto', minWidth: '140px', padding: '10px 16px', fontSize: '11px', justifyContent: 'center' }}
            >
              {inTray ? 'In Sample Tray ✓' : '+ Add to Sample Box'}
            </button>
            <Link
              href={`/materials/${material.slug}`}
              className="button"
              style={{ border: '1px solid var(--line)', background: 'transparent', padding: '10px 16px', fontSize: '11px', justifyContent: 'center' }}
            >
              Full Spec Sheet <span>↗</span>
            </Link>
          </div>
        </div>
      </div>

      <style jsx>{`
        .material-modal-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 999999;
          background: rgba(15, 17, 14, 0.82);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: clamp(12px, 3vh, 24px);
          box-sizing: border-box;
          animation: modalFadeIn 0.2s ease-out;
        }

        .material-modal-card {
          background: var(--paper);
          width: 100%;
          max-width: 880px;
          max-height: min(90vh, 600px);
          margin: auto;
          overflow-y: auto;
          border: 1px solid var(--line);
          box-shadow: 0 25px 70px rgba(0, 0, 0, 0.45);
          position: relative;
          display: grid;
          grid-template-columns: minmax(280px, 0.95fr) 1.2fr;
          border-radius: 2px;
        }

        .material-modal-media {
          position: relative;
          min-height: 280px;
          height: 100%;
          overflow: hidden;
        }

        .material-modal-body {
          padding: clamp(18px, 2.4vw, 28px);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          gap: 12px;
        }

        .material-modal-close {
          position: absolute;
          top: 12px;
          right: 12px;
          z-index: 20;
          width: 34px;
          height: 34px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: rgba(233, 232, 226, 0.95);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: grid;
          place-items: center;
          font-size: 18px;
          cursor: pointer;
          line-height: 1;
          color: var(--ink);
          transition: transform 0.15s ease, background 0.15s ease;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        .material-modal-close:hover {
          transform: scale(1.06);
          background: #fff;
        }

        .material-modal-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          border-top: 1px solid var(--line);
          padding-top: 12px;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
            transform: scale(0.98);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @media (max-width: 768px) {
          .material-modal-overlay {
            padding: 14px 10px !important;
            align-items: center !important;
          }

          .material-modal-card {
            grid-template-columns: 1fr !important;
            max-height: 90dvh !important;
            max-width: 480px !important;
            border-radius: 3px !important;
          }

          .material-modal-media {
            height: 250px !important;
            min-height: 250px !important;
            max-height: 260px !important;
            border-bottom: 1px solid var(--line) !important;
          }

          .material-modal-body {
            padding: 18px 16px 20px !important;
            gap: 12px !important;
          }

          .material-modal-close {
            top: 10px !important;
            right: 10px !important;
            z-index: 30 !important;
          }
        }

        @media (max-width: 440px) {
          .material-modal-media {
            height: 220px !important;
            min-height: 220px !important;
          }

          .material-modal-body {
            padding: 16px 14px 18px !important;
          }

          .material-modal-actions {
            flex-direction: column !important;
            gap: 8px !important;
          }

          .material-modal-actions button,
          .material-modal-actions a {
            width: 100% !important;
            justify-content: center !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
