'use client';

import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { createPortal } from 'react-dom';
import Image from 'next/image';
import Link from 'next/link';
import { materials as defaultMaterials, Material } from '@/data/materials';
import { useSampleShortlist } from '@/context/SampleContext';
import SpecimenZoomViewer from '@/components/SpecimenZoomViewer';

interface MaterialModalProps {
  material: Material;
  onClose: () => void;
  materialsList?: Material[];
  onSelectMaterial?: (material: Material) => void;
}

export default function MaterialModal({
  material: initialMaterial,
  onClose,
  materialsList,
  onSelectMaterial,
}: MaterialModalProps) {
  const [mounted, setMounted] = useState(false);
  const [currentMaterial, setCurrentMaterial] = useState<Material>(initialMaterial);
  const { addSample, removeSample, isShortlisted } = useSampleShortlist();
  const cardRef = useRef<HTMLDivElement>(null);

  // Sync if parent updates initialMaterial
  useEffect(() => {
    setCurrentMaterial(initialMaterial);
  }, [initialMaterial]);

  // Master list of materials for pagination & recommendations
  const allMaterials = useMemo(() => {
    return materialsList && materialsList.length > 0 ? materialsList : defaultMaterials;
  }, [materialsList]);

  // Current active index (match by code first if available, otherwise slug)
  const currentIndex = useMemo(() => {
    const idx = allMaterials.findIndex((m) =>
      m.code && currentMaterial.code ? m.code === currentMaterial.code : m.slug === currentMaterial.slug
    );
    return idx >= 0 ? idx : 0;
  }, [allMaterials, currentMaterial.code, currentMaterial.slug]);

  // Select material handler
  const handleSelectMaterial = useCallback((newMat: Material) => {
    setCurrentMaterial(newMat);
    onSelectMaterial?.(newMat);
    if (cardRef.current) {
      cardRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [onSelectMaterial]);

  // Previous material handler
  const handlePrev = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allMaterials.length <= 1) return;
    const prevIdx = (currentIndex - 1 + allMaterials.length) % allMaterials.length;
    handleSelectMaterial(allMaterials[prevIdx]);
  }, [allMaterials, currentIndex, handleSelectMaterial]);

  // Next material handler
  const handleNext = useCallback((e?: React.MouseEvent) => {
    e?.stopPropagation();
    if (allMaterials.length <= 1) return;
    const nextIdx = (currentIndex + 1) % allMaterials.length;
    handleSelectMaterial(allMaterials[nextIdx]);
  }, [allMaterials, currentIndex, handleSelectMaterial]);

  // Compute exactly 4 similar materials based on color family, pattern, collection, and type
  const similarMaterials = useMemo(() => {
    const matches: Material[] = [];
    const seenCodes = new Set<string>();
    if (currentMaterial.code) seenCodes.add(currentMaterial.code);
    const seenSlugs = new Set<string>();
    seenSlugs.add(currentMaterial.slug);

    const scored = allMaterials
      .filter((m) => {
        if (!m) return false;
        if (m.code && currentMaterial.code) return m.code !== currentMaterial.code;
        return m.slug !== currentMaterial.slug;
      })
      .map((m) => {
        let score = 0;
        if (m.colorFamily === currentMaterial.colorFamily) score += 5;
        if (m.pattern === currentMaterial.pattern) score += 3;
        if (m.collection === currentMaterial.collection) score += 2;
        if (m.type === currentMaterial.type) score += 1;
        return { material: m, score };
      })
      .sort((a, b) => b.score - a.score);

    for (const item of scored) {
      const codeKey = item.material.code;
      const slugKey = item.material.slug;
      const alreadySeen = (codeKey && seenCodes.has(codeKey)) || seenSlugs.has(slugKey);
      if (!alreadySeen) {
        if (codeKey) seenCodes.add(codeKey);
        seenSlugs.add(slugKey);
        matches.push(item.material);
        if (matches.length === 4) break;
      }
    }

    return matches;
  }, [allMaterials, currentMaterial]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Keyboard navigation: Escape to close, ArrowLeft / ArrowRight to navigate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      }
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
  }, [onClose, handlePrev, handleNext]);

  if (!mounted || typeof document === 'undefined') return null;

  const inTray = isShortlisted(currentMaterial.slug);

  return createPortal(
    <div
      className="material-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      {/* Centered Modal Content Wrapper */}
      <div
        className="material-modal-content-wrapper"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Floating Left Navigation Button */}
        {allMaterials.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            className="modal-nav-floating modal-nav-prev"
            aria-label="Previous material (Left Arrow)"
            title="Previous Material (←)"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
          </button>
        )}

        {/* Floating Right Navigation Button */}
        {allMaterials.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            className="modal-nav-floating modal-nav-next"
            aria-label="Next material (Right Arrow)"
            title="Next Material (→)"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        )}

        {/* 1. PRIMARY SPECIMEN CARD (Self-Contained & Elegant) */}
        <div
          ref={cardRef}
          className="material-modal-card"
        >
          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            className="material-modal-close"
            aria-label="Close modal"
          >
            ×
          </button>

          {/* Left: Interactive Zoomable Macro Texture & In-Situ Application Viewer */}
          <div className="material-modal-media">
            <SpecimenZoomViewer
              textureImage={currentMaterial.textureImage}
              applicationImage={currentMaterial.image}
              materialName={currentMaterial.name}
              materialFinish={currentMaterial.finish}
              materialColour={currentMaterial.colour}
              fallbackBg={currentMaterial.hexColor}
              textureCss={currentMaterial.textureCss}
              minHeight="100%"
            />
          </div>

          {/* Right: Architectural Spec & Actions */}
          <div className="material-modal-body">
            <div className="modal-body-top">
              {/* Header Meta & Pagination Indicator */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px', gap: '8px', flexShrink: 0 }}>
                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                  {currentMaterial.code} • {currentMaterial.collection}
                </span>

                {/* In-Card Quick Left/Right Controls for Touch / Mobile */}
                {allMaterials.length > 1 && (
                  <div className="modal-inline-nav">
                    <button
                      type="button"
                      onClick={handlePrev}
                      className="inline-nav-btn"
                      aria-label="Previous material"
                      title="Previous (Left Arrow)"
                    >
                      ←
                    </button>
                    <span className="inline-nav-counter">
                      {currentIndex + 1} / {allMaterials.length}
                    </span>
                    <button
                      type="button"
                      onClick={handleNext}
                      className="inline-nav-btn"
                      aria-label="Next material"
                      title="Next (Right Arrow)"
                    >
                      →
                    </button>
                  </div>
                )}
              </div>

              <h2
                style={{
                  fontSize: 'clamp(20px, 2.1vw, 26px)',
                  lineHeight: 1.2,
                  margin: '0 0 4px',
                  letterSpacing: '-0.02em',
                  wordBreak: 'break-word',
                  minHeight: '30px',
                  flexShrink: 0,
                }}
              >
                {currentMaterial.name}
              </h2>

              <p
                style={{
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  color: 'var(--muted)',
                  margin: '0 0 8px',
                  letterSpacing: '0.04em',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  flexShrink: 0,
                }}
              >
                Tone: {currentMaterial.colour}
              </p>

              <p
                style={{
                  fontSize: '12.5px',
                  lineHeight: 1.45,
                  color: '#4a5249',
                  margin: '0 0 8px',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  minHeight: '36px',
                  flexShrink: 0,
                }}
              >
                {currentMaterial.description}
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
                  padding: '9px 0',
                  marginBottom: '8px',
                  flexShrink: 0,
                }}
              >
                <div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Light Transmission
                  </span>
                  <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                    {currentMaterial.lightTransmission}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Standard Sheet
                  </span>
                  <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                    {currentMaterial.dimensions}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Thickness Options
                  </span>
                  <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                    {currentMaterial.thicknessOptions && currentMaterial.thicknessOptions.length > 0
                      ? currentMaterial.thicknessOptions.join(', ')
                      : '12mm, 19mm'}
                  </strong>
                </div>
                <div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
                    Fire Performance
                  </span>
                  <strong style={{ fontSize: '11px', color: 'var(--ink)' }}>
                    {currentMaterial.fireRating || 'Class 1 / Class A'}
                  </strong>
                </div>
              </div>

              {/* Primary Applications Pills */}
              <div style={{ marginBottom: '4px', flexShrink: 0 }}>
                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '3px' }}>
                  Primary Applications
                </span>
                <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap', maxHeight: '28px', overflow: 'hidden' }}>
                  {(currentMaterial.applications && currentMaterial.applications.length > 0
                    ? currentMaterial.applications
                    : ['Architectural Surfaces', 'Interior Joinery']
                  ).map((app) => (
                    <span
                      key={app}
                      style={{
                        fontSize: '8.5px',
                        fontFamily: 'DM Mono, monospace',
                        padding: '2px 6px',
                        background: '#dcd7cd',
                        border: '1px solid var(--line)',
                        color: 'var(--ink)',
                        borderRadius: '1px',
                        whiteSpace: 'nowrap',
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
                    removeSample(currentMaterial.slug);
                  } else {
                    addSample(currentMaterial);
                  }
                }}
                style={{ flex: '1 1 auto', minWidth: '140px', padding: '10px 16px', fontSize: '11px', justifyContent: 'center' }}
              >
                {inTray ? 'In Sample Tray ✓' : '+ Add to Sample Box'}
              </button>
              <Link
                href={`/materials/${currentMaterial.slug}`}
                className="button"
                style={{ border: '1px solid var(--line)', background: 'transparent', padding: '10px 16px', fontSize: '11px', justifyContent: 'center' }}
              >
                Full Spec Sheet <span>↗</span>
              </Link>
            </div>
          </div>
        </div>

        {/* 2. SEPARATE RECOMMENDATIONS CARD (Positioned Below with Distinct Gap) */}
        {similarMaterials.length > 0 && (
          <div className="material-modal-recommendations-card">
            <div className="recommendations-card-header">
              <div>
                <span className="recommendations-eyebrow">Studio Recommendations</span>
                <h4 className="recommendations-title">Recommended Similar Materials</h4>
              </div>
              <span className="recommendations-badge">
                Matching {currentMaterial.colorFamily} &amp; {currentMaterial.pattern} palette
              </span>
            </div>

            <div className="recommendations-grid">
              {similarMaterials.slice(0, 4).map((sim, idx) => (
                <div
                  key={`${sim.slug}-${idx}`}
                  className="recommendation-item"
                  onClick={() => handleSelectMaterial(sim)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleSelectMaterial(sim);
                    }
                  }}
                  title={`Switch to: ${sim.name}`}
                >
                  <div
                    className="recommendation-swatch"
                    style={{ background: sim.textureCss || sim.hexColor }}
                  >
                    {sim.textureImage ? (
                      <Image
                        src={sim.textureImage}
                        alt={sim.name}
                        fill
                        sizes="180px"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                    ) : sim.swatch ? (
                      <Image
                        src={sim.swatch}
                        alt={sim.name}
                        fill
                        sizes="180px"
                        style={{ objectFit: 'contain' }}
                        loading="lazy"
                      />
                    ) : null}
                  </div>
                  <div className="recommendation-meta">
                    <span className="recommendation-code">{sim.code}</span>
                    <strong className="recommendation-name">{sim.name}</strong>
                    <span className="recommendation-tone">{sim.colour}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .material-modal-overlay {
          position: fixed;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 999999;
          background: rgba(15, 17, 14, 0.84);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 24px 16px;
          box-sizing: border-box;
          overflow-y: auto;
          animation: modalFadeIn 0.2s ease-out;
        }

        /* Centered Wrapper holding both distinct cards */
        .material-modal-content-wrapper {
          position: relative;
          width: 100%;
          max-width: 900px;
          display: flex;
          flex-direction: column;
          gap: 12px; /* Explicit separation between the two cards */
          margin: auto;
        }

        /* Floating Left & Right Navigation Buttons */
        .modal-nav-floating {
          position: absolute;
          top: 240px;
          transform: translateY(-50%);
          z-index: 10000;
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: rgba(240, 238, 233, 0.94);
          border: 1px solid var(--line);
          color: var(--ink);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }

        .modal-nav-prev {
          left: -64px;
        }

        .modal-nav-next {
          right: -64px;
        }

        .modal-nav-floating:hover {
          background: #ffffff;
          transform: translateY(-50%) scale(1.1);
          box-shadow: 0 12px 28px rgba(0, 0, 0, 0.4);
        }

        .modal-nav-floating:active {
          transform: translateY(-50%) scale(0.96);
        }

        /* 1. PRIMARY SPECIMEN CARD - LOCKED FRAME DIMENSIONS */
        .material-modal-card {
          background: var(--paper);
          width: 100%;
          height: 480px;
          min-height: 480px;
          max-height: 480px;
          border: 1px solid var(--line);
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
          position: relative;
          display: grid;
          grid-template-columns: 400px 1fr;
          border-radius: 2px;
          overflow: hidden;
        }

        .material-modal-media {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: 100%;
          max-height: 100%;
          overflow: hidden;
          background: #d8d4ca;
        }

        .material-modal-body {
          padding: 22px 26px 18px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          height: 100%;
          box-sizing: border-box;
          background: var(--paper);
          overflow: hidden;
        }

        .modal-body-top {
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          overflow-x: hidden;
          padding-right: 4px;
          flex: 1 1 auto;
        }

        .modal-body-top::-webkit-scrollbar {
          width: 3px;
        }

        .modal-body-top::-webkit-scrollbar-thumb {
          background: rgba(30, 33, 29, 0.2);
          border-radius: 2px;
        }

        /* Inline Header Navigation Controls */
        .modal-inline-nav {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: rgba(30, 33, 29, 0.05);
          padding: 2px 6px;
          border: 1px solid var(--line);
          border-radius: 2px;
        }

        .inline-nav-btn {
          background: none;
          border: none;
          cursor: pointer;
          font-size: 12px;
          padding: 2px 6px;
          color: var(--ink);
          font-weight: 600;
          transition: background 0.15s ease;
        }

        .inline-nav-btn:hover {
          background: rgba(0, 0, 0, 0.1);
        }

        .inline-nav-counter {
          font-family: 'DM Mono', monospace;
          font-size: 10px;
          color: var(--muted);
          padding: 0 4px;
        }

        .material-modal-close {
          position: absolute;
          top: 14px;
          right: 14px;
          z-index: 20;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 1px solid var(--line);
          background: rgba(233, 232, 226, 0.92);
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
          transform: scale(1.08);
          background: #fff;
        }

        .material-modal-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          border-top: 1px solid var(--line);
          padding-top: 12px;
        }

        /* 2. SEPARATE RECOMMENDATIONS CARD (Completely separate element below) */
        .material-modal-recommendations-card {
          background: var(--paper);
          width: 100%;
          border: 1px solid var(--line);
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35);
          border-radius: 2px;
          padding: 16px 20px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          box-sizing: border-box;
          overflow: visible;
          animation: slideUpFade 0.25s ease-out;
        }

        .recommendations-card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          flex-wrap: wrap;
          gap: 8px;
          border-bottom: 1px solid var(--line);
          padding-bottom: 10px;
          position: relative;
          z-index: 1;
        }

        .recommendations-eyebrow {
          display: block;
          font-family: 'DM Mono', monospace;
          font-size: 8.5px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--muted);
          margin-bottom: 2px;
        }

        .recommendations-title {
          font-size: 14px;
          font-weight: 600;
          margin: 0;
          color: var(--ink);
          letter-spacing: -0.02em;
        }

        .recommendations-badge {
          font-family: 'DM Mono', monospace;
          font-size: 9.5px;
          color: #5d665b;
          text-transform: capitalize;
        }

        .recommendations-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          grid-template-rows: 1fr;
          overflow: visible;
          gap: 12px;
          padding-top: 6px;
          padding-bottom: 6px;
          margin-top: -2px;
        }

        .recommendation-item {
          background: #e4dfd5;
          border: 1px solid var(--line);
          border-radius: 2px;
          cursor: pointer;
          overflow: hidden;
          transition: transform 0.22s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.22s ease, border-color 0.22s ease, background-color 0.22s ease;
          display: flex;
          flex-direction: column;
          position: relative;
          z-index: 1;
        }

        .recommendation-item:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.18);
          border-color: var(--ink);
          background: #ede9e1;
          z-index: 10;
        }

        .recommendation-swatch {
          position: relative;
          height: 58px;
          width: 100%;
          overflow: hidden;
          border-bottom: 1px solid var(--line);
        }

        .recommendation-meta {
          padding: 6px 8px 8px;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .recommendation-code {
          font-family: 'DM Mono', monospace;
          font-size: 8px;
          color: var(--muted);
          text-transform: uppercase;
        }

        .recommendation-name {
          font-size: 11.5px;
          font-weight: 600;
          color: var(--ink);
          line-height: 1.2;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .recommendation-tone {
          font-size: 9px;
          color: #6e766c;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        @keyframes modalFadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUpFade {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1060px) {
          .modal-nav-prev {
            left: 8px !important;
          }
          .modal-nav-next {
            right: 8px !important;
          }
        }

        @media (max-width: 768px) {
          .modal-nav-floating {
            display: none !important;
          }

          .material-modal-card {
            grid-template-columns: 1fr !important;
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
          }

          .material-modal-media {
            height: 250px !important;
            min-height: 250px !important;
            max-height: 250px !important;
            border-bottom: 1px solid var(--line) !important;
          }

          .material-modal-body {
            padding: 20px 16px !important;
            height: auto !important;
          }

          .modal-body-top {
            overflow: visible !important;
          }

          .recommendations-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 10px !important;
          }

          .material-modal-recommendations-card {
            height: auto !important;
            min-height: 0 !important;
            max-height: none !important;
            padding: 16px 14px !important;
          }
        }

        @media (max-width: 440px) {
          .recommendation-swatch {
            height: 60px !important;
          }
        }
      `}</style>
    </div>,
    document.body
  );
}
