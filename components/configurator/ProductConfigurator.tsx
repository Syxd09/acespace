'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  ProductConfiguration,
  CONFIGURATOR_PRESETS,
  CONFIGURATOR_MATERIALS,
  AVAILABLE_BASINS,
  EDGE_PROFILES,
  CORNER_PROFILES,
  calculateIndicativePrice,
  PriceBreakdown,
  ConfiguratorMaterialSwatch,
} from '@/data/configuratorData';
import { Configurator3DEngine, DimensionCallout } from '@/lib/configurator/webglEngine';

interface ProductConfiguratorProps {
  initialPresetId?: string;
  initialMaterialSlug?: string;
}

export default function ProductConfigurator({
  initialPresetId = 'single-basin-vanity',
  initialMaterialSlug,
}: ProductConfiguratorProps) {
  // Preset & Configuration State
  const defaultPreset = CONFIGURATOR_PRESETS.find(p => p.id === initialPresetId) || CONFIGURATOR_PRESETS[0];

  const [config, setConfig] = useState<ProductConfiguration>(() => {
    const base = { ...defaultPreset.defaultConfig };
    if (initialMaterialSlug) {
      const mat = CONFIGURATOR_MATERIALS.find(m => m.slug === initialMaterialSlug);
      if (mat) {
        base.materialSlug = mat.slug;
        base.materialName = mat.name;
        base.materialHex = mat.hexColor;
        base.materialFinish = mat.finish;
      }
    }
    return base;
  });

  const [pricing, setPricing] = useState<PriceBreakdown>(() => calculateIndicativePrice(config));

  // Accordion Sections Open State
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    '01': false, // Tutorial
    '02': true,  // Dimensions
    '03': true,  // Basin
    '04': false, // Edges & Aprons
    '05': false, // Upstands
    '06': true,  // Material & Colour
    '07': false, // Project Notes
  });

  // Material Palette Filter
  const [materialFilter, setMaterialFilter] = useState<'all' | 'white' | 'cream' | 'grey' | 'black' | 'translucent'>('all');

  // 3D Canvas & Engine References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Configurator3DEngine | null>(null);
  const [dimensionCallouts, setDimensionCallouts] = useState<DimensionCallout[]>([]);
  const [activeView, setActiveView] = useState<'isometric' | 'front' | 'top' | 'side'>('isometric');
  const [showDimensions, setShowDimensions] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);

  // Modals
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showArModal, setShowArModal] = useState(false);
  const [quoteSuccessData, setQuoteSuccessData] = useState<{ quoteNumber: string; inquiryNumber: string } | null>(null);
  const [isSubmittingQuote, setIsSubmittingQuote] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);

  // Quote Form State
  const [customerName, setCustomerName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [studio, setStudio] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [projectNotes, setProjectNotes] = useState('');
  const [honeypot, setHoneypot] = useState('');

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Dimension Callouts Callback
  const handleDimensionsUpdate = useCallback((callouts: DimensionCallout[]) => {
    setDimensionCallouts(callouts);
  }, []);

  // Isolate page scrolling while in 3D Configurator Studio
  useEffect(() => {
    document.documentElement.classList.add('configurator-active');
    document.body.classList.add('configurator-active');
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    if (lenis && typeof lenis.stop === 'function') {
      lenis.stop();
    }

    return () => {
      document.documentElement.classList.remove('configurator-active');
      document.body.classList.remove('configurator-active');
      if (lenis && typeof lenis.start === 'function') {
        lenis.start();
      }
    };
  }, []);

  // Initialize 3D Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Configurator3DEngine(canvasRef.current, handleDimensionsUpdate);
    engineRef.current = engine;
    engine.updateConfiguration(config);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleDimensionsUpdate]);

  // Sync config updates with 3D engine and pricing
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfiguration(config);
    }
    setPricing(calculateIndicativePrice(config));
  }, [config]);

  // Section Toggle Handler
  const toggleSection = (id: string) => {
    setOpenSections(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Preset Change Handler
  const handleSelectPreset = (presetId: string) => {
    const selected = CONFIGURATOR_PRESETS.find(p => p.id === presetId);
    if (!selected) return;
    setConfig({ ...selected.defaultConfig });
    setActiveView('isometric');
    if (engineRef.current) {
      engineRef.current.setViewpoint('isometric');
    }
    showToast(`Loaded preset: ${selected.name}`);
  };

  // Reset to Current Preset
  const handleResetPreset = () => {
    const curPreset = CONFIGURATOR_PRESETS.find(p => p.id === config.presetId) || defaultPreset;
    setConfig({ ...curPreset.defaultConfig });
    if (engineRef.current) {
      engineRef.current.resetCamera();
    }
    showToast('Reset specifications to preset defaults.');
  };

  // Camera Control Handlers
  const handleSetView = (view: 'isometric' | 'front' | 'top' | 'side') => {
    setActiveView(view);
    if (engineRef.current) {
      engineRef.current.setViewpoint(view);
    }
  };

  const handleToggleDimensions = () => {
    if (engineRef.current) {
      const active = engineRef.current.toggleDimensions();
      setShowDimensions(active);
    }
  };

  const handleToggleWireframe = () => {
    if (engineRef.current) {
      const active = engineRef.current.toggleWireframe();
      setIsWireframe(active);
    }
  };

  const handleToggleFullscreen = () => {
    if (!workspaceContainerRef.current) return;
    if (!document.fullscreenElement) {
      workspaceContainerRef.current.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Export 3D Snapshot
  const handleCaptureSnapshot = () => {
    if (!engineRef.current) return;
    const dataUrl = engineRef.current.getCanvasDataURL();
    const link = document.createElement('a');
    link.download = `AceSpaces_${config.presetId}_${config.width}x${config.depth}.png`;
    link.href = dataUrl;
    link.click();
    showToast('✓ 3D architectural snapshot downloaded.');
  };

  // Save Configuration JSON
  const handleSaveJson = () => {
    const payload = {
      reference: `ACE-CFG-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      configuration: config,
      indicativePricing: pricing,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${payload.reference}_Specification.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('✓ Specification file (.json) downloaded.');
  };

  // Quote Submission Handler
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);
    setQuoteError(null);

    try {
      const res = await fetch('/api/configurator/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config,
          customerName,
          email,
          phone,
          studio,
          city,
          projectNotes,
          firm_url: honeypot,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setQuoteSuccessData({
          quoteNumber: data.quoteNumber,
          inquiryNumber: data.inquiryNumber,
        });
        showToast('✓ Specification quote submitted successfully!');
      } else {
        setQuoteError(data.error || 'Failed to submit quote request. Please try again.');
      }
    } catch {
      setQuoteError('Connection error. Please retry or contact the studio desk.');
    } finally {
      setIsSubmittingQuote(false);
    }
  };

  // Filtered Materials
  const filteredMaterials = CONFIGURATOR_MATERIALS.filter(m => {
    if (materialFilter === 'all') return true;
    return m.colorFamily === materialFilter;
  });

  return (
    <div className="configurator-root" style={{ minHeight: '100vh', background: '#f5f4ee', color: '#1e211d' }}>
      {/* Toast Notification */}
      {toastMessage && (
        <div
          style={{
            position: 'fixed',
            top: '96px',
            left: '50%',
            transform: 'translateX(-50%)',
            background: '#1e211d',
            color: '#e9e8e2',
            padding: '12px 24px',
            borderRadius: '2px',
            fontFamily: 'DM Mono, monospace',
            fontSize: '12px',
            letterSpacing: '0.04em',
            zIndex: 99999,
            boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
            borderLeft: '3px solid var(--brand-red, #d43833)',
          }}
        >
          {toastMessage}
        </div>
      )}

      {/* Main Two-Panel Layout */}
      <div
        className="configurator-grid"
        data-lenis-prevent="true"
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.45fr) minmax(420px, 1fr)',
          height: 'calc(100vh - 84px - 80px)',
          maxHeight: 'calc(100vh - 84px - 80px)',
          minHeight: 'calc(100vh - 84px - 80px)',
          marginTop: '84px',
          overflow: 'hidden',
        }}
      >
        {/* ========================================================= */}
        {/* LEFT PANEL: 3D PRODUCT WORKSPACE                          */}
        {/* ========================================================= */}
        <div
          ref={workspaceContainerRef}
          className="configurator-viewport-panel"
          data-lenis-prevent="true"
          style={{
            position: 'relative',
            background: '#edeae3',
            borderRight: '1px solid var(--line, rgba(30,33,29,0.15))',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            height: '100%',
            maxHeight: '100%',
          }}
        >
          {/* Top Viewport Header Bar */}
          <div
            style={{
              position: 'absolute',
              top: '16px',
              left: '18px',
              right: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              pointerEvents: 'none',
            }}
          >
            {/* Model Badge */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(30, 33, 29, 0.12)',
                padding: '8px 16px',
                pointerEvents: 'auto',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
              }}
            >
              <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--brand-red, #d43833)' }} />
              <div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#667066', display: 'block' }}>
                  Interactive 3D Engine · 1:1 Scale
                </span>
                <strong style={{ fontSize: '13px', color: '#1e211d', fontWeight: 600 }}>
                  {config.title}
                </strong>
              </div>
            </div>

            {/* Viewpoint Controls */}
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.88)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(30, 33, 29, 0.12)',
                padding: '4px',
                pointerEvents: 'auto',
                display: 'flex',
                gap: '4px',
              }}
            >
              {(['isometric', 'front', 'top', 'side'] as const).map(v => (
                <button
                  key={v}
                  type="button"
                  onClick={() => handleSetView(v)}
                  style={{
                    background: activeView === v ? '#1e211d' : 'transparent',
                    color: activeView === v ? '#fff' : '#4a5249',
                    border: 'none',
                    padding: '6px 12px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive WebGL Canvas */}
          <div style={{ position: 'relative', width: '100%', height: '100%', minHeight: '520px', flex: 1 }}>
            <canvas
              ref={canvasRef}
              style={{
                width: '100%',
                height: '100%',
                display: 'block',
                cursor: 'grab',
                outline: 'none',
              }}
            />

            {/* Floating 3D Dimension Callouts Overlay */}
            {showDimensions && dimensionCallouts.length > 0 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
                {dimensionCallouts.map(callout => (
                  <div
                    key={callout.id}
                    style={{
                      position: 'absolute',
                      left: `${callout.screenMid.x}px`,
                      top: `${callout.screenMid.y}px`,
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(30, 33, 29, 0.88)',
                      color: '#f5f4ee',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }}
                  >
                    {callout.label}
                  </div>
                ))}
              </div>
            )}

            {/* Viewport Interaction Prompt */}
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                left: '20px',
                pointerEvents: 'none',
                fontFamily: 'DM Mono, monospace',
                fontSize: '10px',
                color: '#7a857a',
                letterSpacing: '0.04em',
                background: 'rgba(237, 234, 227, 0.75)',
                padding: '4px 10px',
                backdropFilter: 'blur(6px)',
              }}
            >
              Left Drag: Orbit · Right Drag: Pan · Scroll: Zoom
            </div>

            {/* Bottom-Right Toolbar Buttons */}
            <div
              style={{
                position: 'absolute',
                bottom: '18px',
                right: '20px',
                display: 'flex',
                gap: '8px',
                zIndex: 10,
              }}
            >
              <button
                type="button"
                onClick={handleToggleDimensions}
                title="Toggle Millimeter Dimension Lines"
                style={{
                  background: showDimensions ? '#1e211d' : 'rgba(255,255,255,0.9)',
                  color: showDimensions ? '#fff' : '#1e211d',
                  border: '1px solid rgba(30,33,29,0.15)',
                  padding: '7px 12px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {showDimensions ? '✓ Dims (mm)' : 'Dims (mm)'}
              </button>

              <button
                type="button"
                onClick={handleToggleWireframe}
                title="Toggle Wireframe Inspection"
                style={{
                  background: isWireframe ? '#1e211d' : 'rgba(255,255,255,0.9)',
                  color: isWireframe ? '#fff' : '#1e211d',
                  border: '1px solid rgba(30,33,29,0.15)',
                  padding: '7px 12px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                Wireframe
              </button>

              <button
                type="button"
                onClick={handleCaptureSnapshot}
                title="Capture High-Res Snapshot"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#1e211d',
                  border: '1px solid rgba(30,33,29,0.15)',
                  padding: '7px 12px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                📷 Snapshot
              </button>

              <button
                type="button"
                onClick={handleToggleFullscreen}
                title="Toggle Fullscreen"
                style={{
                  background: 'rgba(255,255,255,0.9)',
                  color: '#1e211d',
                  border: '1px solid rgba(30,33,29,0.15)',
                  padding: '7px 12px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                {isFullscreen ? 'Exit Fullscreen' : '⛶ Fullscreen'}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: CONFIGURATION SIDEBAR                       */}
        {/* ========================================================= */}
        <div
          className="configurator-sidebar-panel"
          data-lenis-prevent="true"
          onWheel={(e) => {
            // Prevent wheel events inside configuration sidebar from bubbling to window or Lenis
            e.stopPropagation();
          }}
          style={{
            background: '#faf9f5',
            overflowY: 'auto',
            overscrollBehavior: 'contain',
            overscrollBehaviorY: 'contain',
            WebkitOverflowScrolling: 'touch',
            height: '100%',
            maxHeight: '100%',
            padding: '24px 28px 48px',
            display: 'flex',
            flexDirection: 'column',
            gap: '18px',
          }}
        >
          {/* Preset Selector Banner */}
          <div
            style={{
              background: '#f0eee8',
              border: '1px solid var(--line, rgba(30,33,29,0.15))',
              borderLeft: '3px solid var(--brand-red, #d43833)',
              padding: '16px 20px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#737e73' }}>
                Architectural Preset
              </span>
              <button
                type="button"
                onClick={handleResetPreset}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#737e73',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                }}
              >
                Reset Preset
              </button>
            </div>

            <select
              value={config.presetId}
              onChange={e => handleSelectPreset(e.target.value)}
              style={{
                width: '100%',
                padding: '9px 12px',
                background: '#fff',
                border: '1px solid rgba(30,33,29,0.2)',
                fontFamily: 'Manrope, sans-serif',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1e211d',
                cursor: 'pointer',
                outline: 'none',
              }}
            >
              {CONFIGURATOR_PRESETS.map(p => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
            <p style={{ margin: '8px 0 0 0', fontSize: '11px', color: '#687268', lineHeight: 1.45 }}>
              {CONFIGURATOR_PRESETS.find(p => p.id === config.presetId)?.description}
            </p>
          </div>

          {/* ======================================================= */}
          {/* SECTION 01: TUTORIAL & STUDIO GUIDANCE                  */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('01')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>01</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Studio Navigation &amp; Fabrication Tolerances
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['01'] ? '▲' : '▼'}</span>
            </button>

            {openSections['01'] && (
              <div style={{ padding: '0 20px 20px', borderTop: '1px solid #f0eee8', fontSize: '12px', color: '#525a51', lineHeight: 1.65 }}>
                <p style={{ marginTop: '12px' }}>
                  • <strong>3D Interaction:</strong> Drag anywhere with left-click to orbit in 360°. Right-click (or two fingers) pans the spatial coordinates. Scroll or pinch to zoom.
                </p>
                <p>
                  • <strong>CNC Calibration:</strong> Solid surface benchtops are CNC cut with ±0.5mm precision and molecularly welded with invisible chemical seams.
                </p>
                <p>
                  • <strong>Quotation Flow:</strong> Displayed prices are real-time engineering estimates. Final quotations include CAD shop drawings and factory review.
                </p>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 02: PRODUCT DIMENSIONS                          */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('02')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>02</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Product Dimensions &amp; Slab Thickness
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['02'] ? '▲' : '▼'}</span>
            </button>

            {openSections['02'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Width Control */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      Overall Width (mm)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min={500}
                        max={3600}
                        step={10}
                        value={config.width}
                        onChange={e => setConfig({ ...config, width: Number(e.target.value) })}
                        style={{
                          width: '75px',
                          textAlign: 'right',
                          padding: '4px 6px',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '12px',
                          border: '1px solid rgba(30,33,29,0.2)',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={500}
                    max={3600}
                    step={10}
                    value={config.width}
                    onChange={e => setConfig({ ...config, width: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#999', marginTop: '2px' }}>
                    <span>Min: 500 mm</span>
                    <span>Standard Slab: 3660 mm</span>
                  </div>
                </div>

                {/* Depth Control */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      Overall Depth (mm)
                    </label>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min={350}
                        max={1000}
                        step={10}
                        value={config.depth}
                        onChange={e => setConfig({ ...config, depth: Number(e.target.value) })}
                        style={{
                          width: '75px',
                          textAlign: 'right',
                          padding: '4px 6px',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '12px',
                          border: '1px solid rgba(30,33,29,0.2)',
                          outline: 'none',
                        }}
                      />
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#888' }}>mm</span>
                    </div>
                  </div>
                  <input
                    type="range"
                    min={350}
                    max={1000}
                    step={10}
                    value={config.depth}
                    onChange={e => setConfig({ ...config, depth: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#999', marginTop: '2px' }}>
                    <span>Min: 350 mm</span>
                    <span>Max: 1000 mm</span>
                  </div>
                </div>

                {/* Slab Thickness Selection */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Solid Body Thickness
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {([12, 19, 24, 60] as const).map(t => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setConfig({ ...config, thickness: t })}
                        style={{
                          background: config.thickness === t ? '#1e211d' : '#f0eee8',
                          color: config.thickness === t ? '#fff' : '#1e211d',
                          border: '1px solid rgba(30,33,29,0.15)',
                          padding: '8px 4px',
                          textAlign: 'center',
                          cursor: 'pointer',
                        }}
                      >
                        <strong style={{ display: 'block', fontSize: '12px' }}>{t} mm</strong>
                        <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', opacity: 0.8 }}>
                          {t === 12 ? 'Standard' : t === 19 ? 'Heavy' : t === 24 ? 'Commercial' : 'Built-Up'}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 03: BASIN AND SINK                              */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('03')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>03</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Basin &amp; Integrated Washbowl
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['03'] ? '▲' : '▼'}</span>
            </button>

            {openSections['03'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Basin Model Selection Cards */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Compatible Basin Models
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {AVAILABLE_BASINS.map(b => (
                      <div
                        key={b.id}
                        onClick={() => setConfig({ ...config, basinModelId: b.id })}
                        style={{
                          display: 'flex',
                          alignItems: 'flex-start',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          border: config.basinModelId === b.id ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.15)',
                          background: config.basinModelId === b.id ? 'rgba(212,56,51,0.03)' : '#fdfdfc',
                          cursor: 'pointer',
                          transition: 'border-color 0.2s ease',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '12px', display: 'block', color: '#1e211d' }}>{b.name}</strong>
                          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#7a857a' }}>
                            {b.width > 0 ? `${b.width} × ${b.depth} × ${b.height} mm` : 'Continuous Surface'}
                          </span>
                        </div>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                          {b.priceModifier > 0 ? `+₹${b.priceModifier.toLocaleString('en-IN')}` : 'Included'}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basin Placement */}
                {config.basinModelId !== 'none' && (
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                      Basin Placement
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {(['center', 'left', 'right', 'dual'] as const).map(pos => (
                        <button
                          key={pos}
                          type="button"
                          onClick={() => setConfig({ ...config, basinPlacement: pos })}
                          style={{
                            padding: '8px 4px',
                            background: config.basinPlacement === pos ? '#1e211d' : '#f0eee8',
                            color: config.basinPlacement === pos ? '#fff' : '#1e211d',
                            border: '1px solid rgba(30,33,29,0.15)',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '11px',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          {pos}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Taphole Configuration */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    CNC Taphole Cutouts
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {([0, 1, 3] as const).map(th => (
                      <button
                        key={th}
                        type="button"
                        onClick={() => setConfig({ ...config, tapHoles: th })}
                        style={{
                          padding: '8px 4px',
                          background: config.tapHoles === th ? '#1e211d' : '#f0eee8',
                          color: config.tapHoles === th ? '#fff' : '#1e211d',
                          border: '1px solid rgba(30,33,29,0.15)',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {th === 0 ? '0 (Wall Tap)' : th === 1 ? '1 (Single Hole)' : '3 (3-Piece Tap)'}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 04: EDGES AND DOWNSTANDS                        */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('04')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>04</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Edge Profiles &amp; Apron Drops
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['04'] ? '▲' : '▼'}</span>
            </button>

            {openSections['04'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Edge Profile Choice */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Front &amp; Perimeter Edge Profile
                  </label>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {EDGE_PROFILES.map(ep => (
                      <div
                        key={ep.id}
                        onClick={() => setConfig({ ...config, edgeProfileId: ep.id })}
                        style={{
                          padding: '10px 14px',
                          border: config.edgeProfileId === ep.id ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.15)',
                          background: config.edgeProfileId === ep.id ? 'rgba(212,56,51,0.03)' : '#fdfdfc',
                          cursor: 'pointer',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <div>
                          <strong style={{ fontSize: '12px', display: 'block' }}>{ep.name}</strong>
                          <span style={{ fontSize: '10px', color: '#777', lineHeight: 1.4 }}>{ep.description}</span>
                        </div>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#667066' }}>
                          ₹{ep.pricePerMeter}/m
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Corner Profile Detail */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Exposed Outer Corner Detail
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                    {CORNER_PROFILES.map(cp => (
                      <button
                        key={cp.id}
                        type="button"
                        onClick={() => setConfig({ ...config, cornerProfileId: cp.id })}
                        style={{
                          padding: '8px 4px',
                          background: config.cornerProfileId === cp.id ? '#1e211d' : '#f0eee8',
                          color: config.cornerProfileId === cp.id ? '#fff' : '#1e211d',
                          border: '1px solid rgba(30,33,29,0.15)',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '11px',
                          cursor: 'pointer',
                        }}
                      >
                        {cp.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Front Apron Drop Height Slider */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      Front Apron Drop Fascia (mm)
                    </label>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
                      {config.frontApronHeight} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={200}
                    step={10}
                    value={config.frontApronHeight}
                    onChange={e => setConfig({ ...config, frontApronHeight: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                  />
                </div>

                {/* Return Apron Toggles */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.hasLeftApron}
                      onChange={e => setConfig({ ...config, hasLeftApron: e.target.checked })}
                      style={{ accentColor: 'var(--brand-red, #d43833)', width: '16px', height: '16px' }}
                    />
                    <span>Left Return Apron</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.hasRightApron}
                      onChange={e => setConfig({ ...config, hasRightApron: e.target.checked })}
                      style={{ accentColor: 'var(--brand-red, #d43833)', width: '16px', height: '16px' }}
                    />
                    <span>Right Return Apron</span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 05: UPSTANDS AND SPLASHBACKS                    */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('05')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>05</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Upstands &amp; Coved Splashbacks
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['05'] ? '▲' : '▼'}</span>
            </button>

            {openSections['05'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* Rear Upstand Height */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      Rear Upstand Height (mm)
                    </label>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
                      {config.rearUpstandHeight} mm
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={250}
                    step={10}
                    value={config.rearUpstandHeight}
                    onChange={e => setConfig({ ...config, rearUpstandHeight: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                  />
                </div>

                {/* Side Upstands */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.hasLeftUpstand}
                      onChange={e => setConfig({ ...config, hasLeftUpstand: e.target.checked })}
                      style={{ accentColor: 'var(--brand-red, #d43833)', width: '16px', height: '16px' }}
                    />
                    <span>Left Return Upstand</span>
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={config.hasRightUpstand}
                      onChange={e => setConfig({ ...config, hasRightUpstand: e.target.checked })}
                      style={{ accentColor: 'var(--brand-red, #d43833)', width: '16px', height: '16px' }}
                    />
                    <span>Right Return Upstand</span>
                  </label>
                </div>

                {/* 10mm Coved Hygiene Transition */}
                <div style={{ background: '#f8f7f2', padding: '12px', border: '1px solid rgba(30,33,29,0.1)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>
                    <input
                      type="checkbox"
                      checked={config.isCovedUpstand}
                      onChange={e => setConfig({ ...config, isCovedUpstand: e.target.checked })}
                      style={{ accentColor: 'var(--brand-red, #d43833)', width: '16px', height: '16px' }}
                    />
                    <span>Seamless 10mm Coved Hygiene Junction (Zero Silicone)</span>
                  </label>
                  <p style={{ margin: '6px 0 0 26px', fontSize: '11px', color: '#687268', lineHeight: 1.4 }}>
                    Permanently fuses the vertical splashback into the horizontal top with a curved 10mm inner radius. Eliminates black mould lines forever.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 06: MATERIAL AND COLOUR                         */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('06')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>06</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Material &amp; Solid Surface Palette
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['06'] ? '▲' : '▼'}</span>
            </button>

            {openSections['06'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Palette Filter Pills */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['all', 'white', 'cream', 'grey', 'black', 'translucent'] as const).map(f => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setMaterialFilter(f)}
                      style={{
                        padding: '4px 10px',
                        background: materialFilter === f ? '#1e211d' : '#f0eee8',
                        color: materialFilter === f ? '#fff' : '#1e211d',
                        border: 'none',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                      }}
                    >
                      {f}
                    </button>
                  ))}
                </div>

                {/* Swatch Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {filteredMaterials.map(mat => {
                    const isSelected = config.materialSlug === mat.slug;
                    return (
                      <div
                        key={mat.slug}
                        onClick={() => {
                          setConfig({
                            ...config,
                            materialSlug: mat.slug,
                            materialName: mat.name,
                            materialHex: mat.hexColor,
                            materialFinish: mat.finish,
                          });
                        }}
                        style={{
                          border: isSelected ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.15)',
                          background: '#fff',
                          cursor: 'pointer',
                          padding: '6px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '6px',
                          transition: 'border-color 0.15s ease',
                        }}
                      >
                        {/* Color swatch block */}
                        <div
                          style={{
                            height: '48px',
                            width: '100%',
                            backgroundColor: mat.hexColor,
                            border: '1px solid rgba(0,0,0,0.08)',
                            boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.2)',
                          }}
                        />
                        <div>
                          <strong style={{ fontSize: '11px', display: 'block', color: '#1e211d', lineHeight: 1.2 }}>
                            {mat.name}
                          </strong>
                          <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#7a857a' }}>
                            {mat.collection}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 07: PROJECT NOTES & REFERENCE                   */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('07')}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: 'none',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>07</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Project Notes &amp; Specifier Details
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['07'] ? '▲' : '▼'}</span>
            </button>

            {openSections['07'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#667066', marginBottom: '4px' }}>
                    Project Name / Reference
                  </label>
                  <input
                    type="text"
                    value={config.projectName}
                    onChange={e => setConfig({ ...config, projectName: e.target.value })}
                    placeholder="e.g. Indiranagar Residence En-Suite"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#667066', marginBottom: '4px' }}>
                    Architecture Studio / Firm Name
                  </label>
                  <input
                    type="text"
                    value={config.clientStudio}
                    onChange={e => setConfig({ ...config, clientStudio: e.target.value })}
                    placeholder="e.g. Studio Lotus / Morphogenesis"
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#667066', marginBottom: '4px' }}>
                    Special CNC Cutouts / Fabrication Notes
                  </label>
                  <textarea
                    rows={3}
                    value={config.specialInstructions}
                    onChange={e => setConfig({ ...config, specialInstructions: e.target.value })}
                    placeholder="e.g. Provide 35mm waste chute on left, under-mount soap dispenser..."
                    style={{ width: '100%', padding: '8px 10px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '12px', outline: 'none' }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* BOTTOM STICKY ACTION BAR                                  */}
      {/* ========================================================= */}
      <div
        className="configurator-action-bar"
        data-lenis-prevent="true"
        onWheel={(e) => {
          e.stopPropagation();
        }}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '80px',
          background: '#1e211d',
          color: '#e9e8e2',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 32px',
          zIndex: 900,
          boxShadow: '0 -10px 30px rgba(0,0,0,0.3)',
        }}
      >
        {/* Left: Indicative Price & Breakdown Trigger */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#9ca59b', letterSpacing: '0.08em' }}>
                Indicative Estimate
              </span>
              <button
                type="button"
                onClick={() => setShowPriceBreakdown(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-red, #d43833)',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                }}
              >
                View Breakdown ↗
              </button>
            </div>
            <strong style={{ fontSize: '24px', fontFamily: 'Manrope, sans-serif', color: '#fff', letterSpacing: '-0.02em' }}>
              ₹{pricing.totalIndicative.toLocaleString('en-IN')}
            </strong>
            <span style={{ fontSize: '10px', color: '#889088', marginLeft: '6px' }}>+ GST</span>
          </div>

          {/* Quantity Selector */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderLeft: '1px solid rgba(255,255,255,0.12)', paddingLeft: '18px' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#9ca59b' }}>Qty:</span>
            <button
              type="button"
              onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })}
              style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
              }}
            >
              -
            </button>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', width: '20px', textAlign: 'center' }}>
              {config.quantity}
            </span>
            <button
              type="button"
              onClick={() => setConfig({ ...config, quantity: config.quantity + 1 })}
              style={{
                width: '28px',
                height: '28px',
                background: 'rgba(255,255,255,0.1)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Right: Export, AR & Primary Quote CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            type="button"
            onClick={handleSaveJson}
            title="Download JSON Spec File"
            style={{
              background: 'transparent',
              color: '#dcdad2',
              border: '1px solid rgba(255,255,255,0.22)',
              padding: '11px 18px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            Export JSON
          </button>

          <button
            type="button"
            onClick={() => setShowArModal(true)}
            style={{
              background: 'transparent',
              color: '#dcdad2',
              border: '1px solid rgba(255,255,255,0.22)',
              padding: '11px 18px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              letterSpacing: '0.04em',
              textTransform: 'uppercase',
              cursor: 'pointer',
            }}
          >
            AR Preview (QR)
          </button>

          <button
            type="button"
            onClick={() => setShowQuoteModal(true)}
            style={{
              background: 'var(--brand-red, #d43833)',
              color: '#ffffff',
              border: 'none',
              padding: '12px 28px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(212,56,51,0.4)',
              transition: 'opacity 0.2s ease',
            }}
            onMouseEnter={e => (e.currentTarget.style.opacity = '0.92')}
            onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
          >
            Request Specification Quote →
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: PRICE BREAKDOWN SPECIFICATION                    */}
      {/* ========================================================= */}
      {showPriceBreakdown && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.65)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowPriceBreakdown(false)}
        >
          <div
            style={{
              maxWidth: '520px',
              width: '100%',
              background: '#faf9f5',
              padding: '32px',
              border: '1px solid rgba(30,33,29,0.18)',
              borderTop: '3px solid var(--brand-red, #d43833)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#667066', letterSpacing: '0.08em' }}>
                Itemized Fabrication Breakdown
              </span>
              <button onClick={() => setShowPriceBreakdown(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <h3 style={{ margin: '0 0 18px 0', fontSize: '20px', fontWeight: 600 }}>
              {config.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '13px', borderTop: '1px solid #e0ded6', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Base Substrate ({config.materialName})</span>
                <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.baseSubstrate.toLocaleString('en-IN')}</strong>
              </div>
              {pricing.thicknessSurcharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Thickness Calibration ({config.thickness}mm)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.thicknessSurcharge.toLocaleString('en-IN')}</strong>
                </div>
              )}
              {pricing.apronDownstand > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Mitred Apron Downstands ({config.frontApronHeight}mm)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.apronDownstand.toLocaleString('en-IN')}</strong>
                </div>
              )}
              {pricing.upstandSplashback > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>{config.isCovedUpstand ? '10mm Coved Splashback' : 'Standard Upstand'} ({config.rearUpstandHeight}mm)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.upstandSplashback.toLocaleString('en-IN')}</strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>CNC Edge Tooling &amp; Hand Polish</span>
                <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.edgeTooling.toLocaleString('en-IN')}</strong>
              </div>
              {pricing.basinIntegration > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Integrated Coved Washbowl(s)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.basinIntegration.toLocaleString('en-IN')}</strong>
                </div>
              )}
              {pricing.tapCutouts > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>CNC Tap Hole Cutouts ({config.tapHoles})</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace' }}>₹{pricing.tapCutouts.toLocaleString('en-IN')}</strong>
                </div>
              )}

              <div style={{ borderTop: '2px solid #1e211d', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <div>
                  <strong style={{ fontSize: '16px' }}>Total Indicative Estimate</strong>
                  <div style={{ fontSize: '10px', color: '#777', fontFamily: 'DM Mono, monospace' }}>Qty: {config.quantity} Unit(s)</div>
                </div>
                <strong style={{ fontSize: '22px', color: 'var(--brand-red, #d43833)', fontFamily: 'DM Mono, monospace' }}>
                  ₹{pricing.totalIndicative.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <p style={{ marginTop: '18px', fontSize: '11px', color: '#7a8279', lineHeight: 1.5 }}>
              * Indicative factory estimate based on raw sheet yield and 5-axis CNC digital tooling in Bengaluru. Final binding quotation issued after engineering shop-drawing validation.
            </p>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: REQUEST SPECIFICATION QUOTE                     */}
      {/* ========================================================= */}
      {showQuoteModal && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => {
            if (!isSubmittingQuote) setShowQuoteModal(false);
          }}
        >
          <div
            style={{
              maxWidth: '560px',
              width: '100%',
              background: '#faf9f5',
              padding: '36px',
              border: '1px solid rgba(30,33,29,0.18)',
              borderTop: '3px solid var(--brand-red, #d43833)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {quoteSuccessData ? (
              <div style={{ textAlign: 'center', padding: '20px 0' }}>
                <span style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#73c991', color: '#fff', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '16px' }}>
                  ✓
                </span>
                <h3 style={{ fontSize: '22px', margin: '0 0 10px 0', fontWeight: 600 }}>
                  Specification Brief Received
                </h3>
                <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.6, maxWidth: '440px', margin: '0 auto 20px' }}>
                  Your 3D product configuration has been recorded under reference code:
                </p>
                <div
                  style={{
                    display: 'inline-block',
                    background: '#1e211d',
                    color: '#e9e8e2',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '18px',
                    padding: '8px 20px',
                    letterSpacing: '0.1em',
                    marginBottom: '24px',
                  }}
                >
                  {quoteSuccessData.quoteNumber}
                </div>
                <p style={{ fontSize: '12px', color: '#777', lineHeight: 1.5, marginBottom: '28px' }}>
                  An Ace Spaces architectural technical advisor will review your dimensions ({config.width}×{config.depth}mm), material ({config.materialName}), and provide formal CAD shop drawings within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setShowQuoteModal(false);
                    setQuoteSuccessData(null);
                  }}
                  style={{
                    background: '#1e211d',
                    color: '#fff',
                    border: 'none',
                    padding: '12px 28px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                  }}
                >
                  Close &amp; Return to 3D View
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#667066', letterSpacing: '0.08em' }}>
                    Ace Spaces Technical Desk
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <h3 style={{ margin: '0 0 6px 0', fontSize: '20px', fontWeight: 600 }}>
                  Request Specification Quotation
                </h3>
                <p style={{ margin: '0 0 20px 0', fontSize: '12px', color: '#667066' }}>
                  {config.title} · {config.width}mm × {config.depth}mm · {config.materialName} · Est: ₹{pricing.totalIndicative.toLocaleString('en-IN')}
                </p>

                {quoteError && (
                  <div style={{ background: 'rgba(212,56,51,0.1)', border: '1px solid var(--brand-red, #d43833)', color: '#b93222', padding: '10px', fontSize: '12px', marginBottom: '16px' }}>
                    ⚠ {quoteError}
                  </div>
                )}

                {/* Honeypot anti-spam */}
                <div style={{ display: 'none', position: 'absolute', left: '-9999px' }} aria-hidden="true">
                  <input
                    type="text"
                    name="firm_url"
                    tabIndex={-1}
                    value={honeypot}
                    onChange={e => setHoneypot(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#687268', marginBottom: '4px' }}>
                        Specifier Name *
                      </label>
                      <input
                        required
                        type="text"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        placeholder="Ar. Vikram Seth"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#687268', marginBottom: '4px' }}>
                        Architecture Studio / Firm
                      </label>
                      <input
                        type="text"
                        value={studio}
                        onChange={e => setStudio(e.target.value)}
                        placeholder="Studio Lotus"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#687268', marginBottom: '4px' }}>
                        Corporate Email *
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="architect@firm.com"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#687268', marginBottom: '4px' }}>
                        Mobile / WhatsApp Phone
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#687268', marginBottom: '4px' }}>
                      Delivery / Site Location City
                    </label>
                    <input
                      type="text"
                      value={city}
                      onChange={e => setCity(e.target.value)}
                      placeholder="Bengaluru, Mumbai, Hyderabad..."
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#687268', marginBottom: '4px' }}>
                      Additional Notes / Installation Timeline
                    </label>
                    <textarea
                      rows={3}
                      value={projectNotes}
                      onChange={e => setProjectNotes(e.target.value)}
                      placeholder="Tender stage, target completion date, requirement for physical sample swatches..."
                      style={{ width: '100%', padding: '9px 12px', border: '1px solid rgba(30,33,29,0.2)', fontSize: '12px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ marginTop: '12px' }}>
                    <button
                      type="submit"
                      disabled={isSubmittingQuote}
                      style={{
                        width: '100%',
                        padding: '14px',
                        background: 'var(--brand-red, #d43833)',
                        color: '#fff',
                        border: 'none',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '12px',
                        fontWeight: 600,
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        cursor: isSubmittingQuote ? 'not-allowed' : 'pointer',
                        opacity: isSubmittingQuote ? 0.7 : 1,
                      }}
                    >
                      {isSubmittingQuote ? 'Submitting to Factory Desk...' : 'Submit Specification Quote →'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: AR AUGMENTED REALITY QR MODAL                   */}
      {/* ========================================================= */}
      {showArModal && (
        <div
          role="dialog"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '20px',
            backdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowArModal(false)}
        >
          <div
            style={{
              maxWidth: '460px',
              width: '100%',
              background: '#faf9f5',
              padding: '36px',
              border: '1px solid rgba(30,33,29,0.18)',
              borderTop: '3px solid var(--brand-red, #d43833)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
              textAlign: 'center',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#667066', letterSpacing: '0.08em' }}>
                Spatial Mobile Viewing
              </span>
              <button onClick={() => setShowArModal(false)} style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}>✕</button>
            </div>

            <h3 style={{ margin: '0 0 10px 0', fontSize: '20px', fontWeight: 600 }}>
              View in Your Space (AR)
            </h3>
            <p style={{ fontSize: '12px', color: '#555', lineHeight: 1.5, marginBottom: '20px' }}>
              Scan this QR code with an iPhone or Android mobile camera to load your customized <strong>{config.title} ({config.width}×{config.depth}mm)</strong> directly in WebXR / QuickLook.
            </p>

            {/* Simulated Clean SVG QR Code Representation */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                padding: '16px',
                border: '1px solid rgba(30,33,29,0.15)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
                marginBottom: '18px',
              }}
            >
              <svg width="180" height="180" viewBox="0 0 180 180" xmlns="http://www.w3.org/2000/svg">
                {/* QR Position Squares */}
                <rect x="10" y="10" width="45" height="45" fill="#1e211d" />
                <rect x="18" y="18" width="29" height="29" fill="#fff" />
                <rect x="25" y="25" width="15" height="15" fill="#d43833" />

                <rect x="125" y="10" width="45" height="45" fill="#1e211d" />
                <rect x="133" y="18" width="29" height="29" fill="#fff" />
                <rect x="140" y="25" width="15" height="15" fill="#d43833" />

                <rect x="10" y="125" width="45" height="45" fill="#1e211d" />
                <rect x="18" y="133" width="29" height="29" fill="#fff" />
                <rect x="25" y="140" width="15" height="15" fill="#d43833" />

                {/* QR Data Grid Matrix */}
                <g fill="#1e211d">
                  <rect x="65" y="15" width="10" height="10" />
                  <rect x="85" y="15" width="10" height="10" />
                  <rect x="105" y="15" width="10" height="10" />
                  <rect x="65" y="35" width="10" height="10" />
                  <rect x="95" y="35" width="10" height="10" />
                  <rect x="75" y="55" width="10" height="10" />
                  <rect x="105" y="55" width="10" height="10" />
                  <rect x="20" y="75" width="10" height="10" />
                  <rect x="40" y="75" width="10" height="10" />
                  <rect x="60" y="75" width="10" height="10" />
                  <rect x="80" y="75" width="10" height="10" />
                  <rect x="100" y="75" width="10" height="10" />
                  <rect x="120" y="75" width="10" height="10" />
                  <rect x="140" y="75" width="10" height="10" />
                  <rect x="75" y="95" width="10" height="10" />
                  <rect x="95" y="95" width="10" height="10" />
                  <rect x="135" y="95" width="10" height="10" />
                  <rect x="65" y="115" width="10" height="10" />
                  <rect x="85" y="115" width="10" height="10" />
                  <rect x="115" y="115" width="10" height="10" />
                  <rect x="65" y="135" width="10" height="10" />
                  <rect x="95" y="135" width="10" height="10" />
                  <rect x="145" y="135" width="10" height="10" />
                  <rect x="85" y="155" width="10" height="10" />
                  <rect x="105" y="155" width="10" height="10" />
                  <rect x="135" y="155" width="10" height="10" />
                </g>
              </svg>
            </div>

            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#687268', margin: '0 0 20px 0' }}>
              Compatible with iOS QuickLook (.usdz) &amp; Android Scene Viewer (.glb)
            </p>

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                showToast('✓ Link copied to clipboard.');
              }}
              style={{
                background: '#1e211d',
                color: '#fff',
                border: 'none',
                padding: '10px 20px',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Copy Mobile Link
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
