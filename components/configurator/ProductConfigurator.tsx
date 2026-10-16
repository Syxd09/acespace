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
  DRAIN_OPTIONS,
  TOP_EDGE_OPTIONS,
  TOWEL_HOLDER_OPTIONS,
  CORNER_TREATMENT_OPTIONS,
  SINK_INTEGRATION_OPTIONS,
  TAP_LOCATION_OPTIONS,
  DOWNSTAND_HEIGHT_OPTIONS,
  UPSTAND_MODE_OPTIONS,
  RO_SIZE_OPTIONS,
  WDT_DEPTH_OPTIONS,
  SINK_WIDTH_OPTIONS,
  SINK_DEPTH_OPTIONS,
} from '@/data/configuratorData';
import { Configurator3DEngine, DimensionCallout, CadDimensionData } from '@/lib/configurator/webglEngine';
import {
  TechnicalOptionCard,
  CornerProfileDiagram,
  SinkIntegrationDiagram,
  TapLocationDiagram,
  SinkModelDiagram,
  DownstandDiagram,
  UpstandDiagram,
  TowelHolderDiagram,
  EdgeFinishDiagram,
  DrainTypeThumbnail,
} from './TechnicalDiagrams';
import { ArViewerModal } from './ArViewerModal';
import ArchitecturalSelect from '@/components/ArchitecturalSelect';

interface ProductConfiguratorProps {
  initialPresetId?: string;
  initialMaterialSlug?: string;
  initialConfigId?: string;
  autoLaunchAr?: boolean;
}

export default function ProductConfigurator({
  initialPresetId = 'single-basin-vanity',
  initialMaterialSlug,
  initialConfigId,
  autoLaunchAr = false,
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
    if (!base.materialFinish) {
      base.materialFinish = 'Honed Satin Matte';
    }
    return base;
  });

  const [pricing, setPricing] = useState<PriceBreakdown>(() => calculateIndicativePrice(config));

  // Accordion Sections Open State (01 to 11)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    '01': false, // Studio Guidance
    '02': true,  // Dimensions
    '03': false, // Corner Treatments
    '04': true,  // Basin & Sink Integration
    '05': false, // Downstands & Aprons
    '06': false, // Upstands & Splashbacks
    '07': false, // Towel-Holder Cut-out
    '08': false, // Vanity Top Edge Finishing
    '09': false, // Waste & Drain System
    '10': true,  // Material & Colour
    '11': false, // Project Notes & Ref
  });

  // Material Palette Filter
  const [materialFilter, setMaterialFilter] = useState<'all' | 'white' | 'cream' | 'grey' | 'black' | 'translucent'>('all');

  // 3D Canvas & Engine References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Configurator3DEngine | null>(null);
  const [dimensionCallouts, setDimensionCallouts] = useState<DimensionCallout[]>([]);
  const [cadDimensions, setCadDimensions] = useState<CadDimensionData | null>(null);
  const [activeView, setActiveView] = useState<'isometric' | 'front' | 'top' | 'side'>('isometric');
  const [showDimensions, setShowDimensions] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isTurntable, setIsTurntable] = useState(false);
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
  const handleDimensionsUpdate = useCallback((callouts: DimensionCallout[], cad?: CadDimensionData) => {
    setDimensionCallouts(callouts);
    if (cad) setCadDimensions(cad);
  }, []);

  // Ensure document and body scroll is always free and clean
  useEffect(() => {
    if (typeof document !== 'undefined') {
      document.documentElement.classList.remove('configurator-active', 'lenis-stopped');
      document.body.classList.remove('configurator-active', 'lenis-stopped');
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }
  }, []);

  // Hydrate saved configuration or auto-launch mobile AR from URL query
  useEffect(() => {
    if (initialConfigId) {
      fetch(`/api/configurator?id=${encodeURIComponent(initialConfigId)}`)
        .then(res => res.json())
        .then(data => {
          if (data.success && data.configuration) {
            const rawCfg = data.configuration.config || data.configuration;
            const loaded: ProductConfiguration = {
              ...defaultPreset.defaultConfig,
              ...rawCfg,
            };
            if (!loaded.materialFinish) {
              const mat = CONFIGURATOR_MATERIALS.find(m => m.slug === loaded.materialSlug);
              loaded.materialFinish = mat?.finish || 'Honed Satin Matte';
            }
            if (!loaded.materialHex) {
              const mat = CONFIGURATOR_MATERIALS.find(m => m.slug === loaded.materialSlug);
              loaded.materialHex = mat?.hexColor || '#f3f2ee';
            }
            setConfig(loaded);
            if (autoLaunchAr) {
              setShowArModal(true);
            }
          }
        })
        .catch(err => {
          console.error('Error hydrating configuration from URL:', err);
          if (autoLaunchAr) setShowArModal(true);
        });
    } else if (autoLaunchAr) {
      setShowArModal(true);
    }
  }, [initialConfigId, autoLaunchAr]);

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

  const handleToggleTurntable = () => {
    if (engineRef.current) {
      const active = engineRef.current.toggleTurntable();
      setIsTurntable(active);
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
      <div className="configurator-grid">
        {/* ========================================================= */}
        {/* LEFT PANEL: 3D PRODUCT WORKSPACE                          */}
        {/* ========================================================= */}
        <div
          ref={workspaceContainerRef}
          className="configurator-viewport-panel"
          style={{
            position: 'relative',
            background: '#edeae3',
            borderRight: '1px solid var(--line, rgba(30,33,29,0.15))',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Top Viewport Header Bar (Minimal, Architectural, Non-Colliding) */}
          <div
            className="configurator-viewport-top-bar"
            style={{
              position: 'absolute',
              top: '12px',
              left: '14px',
              right: '14px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              zIndex: 10,
              pointerEvents: 'none',
              gap: '8px',
            }}
          >
            {/* Minimal Architectural Studio Badge */}
            <div
              className="configurator-model-badge"
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(30, 33, 29, 0.12)',
                borderRadius: '9999px',
                padding: '4px 10px',
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                flexShrink: 0,
              }}
            >
              <span
                style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: 'var(--brand-red, #d43833)',
                  boxShadow: '0 0 6px rgba(212, 56, 51, 0.6)',
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '9.5px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  color: '#1e211d',
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                }}
              >
                3D Studio · 1:1
              </span>
            </div>

            {/* Architectural Segmented Viewpoint Pill */}
            <div
              className="configurator-viewpoint-controls"
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(30, 33, 29, 0.12)',
                borderRadius: '9999px',
                padding: '2px',
                pointerEvents: 'auto',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '1px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
                flexShrink: 0,
              }}
            >
              {[
                { key: 'isometric', label: 'Iso' },
                { key: 'front', label: 'Front' },
                { key: 'top', label: 'Top' },
                { key: 'side', label: 'Side' },
              ].map(v => (
                <button
                  key={v.key}
                  type="button"
                  onClick={() => handleSetView(v.key as any)}
                  style={{
                    background: activeView === v.key ? '#1e211d' : 'transparent',
                    color: activeView === v.key ? '#ffffff' : '#636c63',
                    border: 'none',
                    borderRadius: '9999px',
                    padding: '3px 8px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '9.5px',
                    fontWeight: activeView === v.key ? 600 : 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    cursor: 'pointer',
                    transition: 'background 0.15s ease, color 0.15s ease',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {v.label}
                </button>
              ))}
            </div>
          </div>

          {/* Interactive WebGL Canvas */}
          <div className="configurator-canvas-wrapper" style={{ position: 'relative', width: '100%', height: '100%', flex: 1 }}>
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

            {/* Architectural CAD Dimensioning Wireframe Overlay (Matches User Reference Image) */}
            {showDimensions && cadDimensions && cadDimensions.lines.length > 0 && (
              <svg
                style={{
                  position: 'absolute',
                  inset: 0,
                  width: '100%',
                  height: '100%',
                  pointerEvents: 'none',
                  overflow: 'visible',
                  zIndex: 4,
                }}
              >
                {/* 1. Dimension & Extension Lines */}
                {cadDimensions.lines.map(line => (
                  <g key={line.id}>
                    <line
                      x1={line.start.x}
                      y1={line.start.y}
                      x2={line.end.x}
                      y2={line.end.y}
                      stroke="#d43833"
                      strokeWidth={line.isDashed ? '1' : '1.15'}
                      strokeDasharray={line.isDashed ? '3 3' : undefined}
                      strokeOpacity="0.88"
                    />
                    {line.label !== undefined && (
                      <text
                        x={line.mid.x}
                        y={line.mid.y}
                        textAnchor="middle"
                        dominantBaseline="central"
                        fill="#d43833"
                        stroke="#f5f4ee"
                        strokeWidth="3px"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                        fontFamily="DM Mono, monospace"
                        fontSize="10.5px"
                        fontWeight="500"
                        letterSpacing="0.02em"
                      >
                        {line.label}
                      </text>
                    )}
                  </g>
                ))}

                {/* 2. Precision CAD Nodes (Round Dots at Endpoints & Intersections) */}
                {cadDimensions.nodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.pos.x}
                      cy={node.pos.y}
                      r="2.5"
                      fill="#d43833"
                      stroke="#ffffff"
                      strokeWidth="0.75"
                    />
                    {node.label && (
                      <text
                        x={node.pos.x - 5}
                        y={node.pos.y + 5}
                        textAnchor="end"
                        dominantBaseline="hanging"
                        fill="#d43833"
                        fontFamily="DM Mono, monospace"
                        fontSize="9px"
                        fontWeight="500"
                        stroke="#f5f4ee"
                        strokeWidth="2px"
                        strokeLinejoin="round"
                        paintOrder="stroke fill"
                      >
                        {node.label}
                      </text>
                    )}
                  </g>
                ))}
              </svg>
            )}

            {/* Viewport Interaction Prompt */}
            <div
              className="configurator-touch-hint"
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

            {/* Viewport Floating Icon Toolbar (Sleek, Architectural, Responsive) */}
            <div
              className="configurator-viewport-toolbar"
              style={{
                position: 'absolute',
                bottom: '14px',
                right: '16px',
                display: 'flex',
                alignItems: 'center',
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(10px)',
                WebkitBackdropFilter: 'blur(10px)',
                border: '1px solid rgba(30, 33, 29, 0.16)',
                borderRadius: '4px',
                padding: '3px',
                gap: '3px',
                zIndex: 10,
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.1)',
              }}
            >
              {/* 1. Toggle Dimension Callouts */}
              <button
                type="button"
                onClick={handleToggleDimensions}
                title={showDimensions ? 'Hide Dimensions (mm)' : 'Show Dimensions (mm)'}
                aria-label="Toggle Millimeter Dimensions"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: showDimensions ? '#1e211d' : 'transparent',
                  color: showDimensions ? '#ffffff' : '#3c423c',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12h20M6 7v10M18 7v10M2 9v6M22 9v6" />
                  <path d="m4 12 2-2m-2 2 2 2m16-2-2-2m2 2-2 2" />
                </svg>
              </button>

              {/* 2. 360 Turntable Orbit */}
              <button
                type="button"
                onClick={handleToggleTurntable}
                title={isTurntable ? 'Stop 360° Auto-Rotate' : 'Start 360° Auto-Rotate'}
                aria-label="360° Turntable Auto-Rotate"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isTurntable ? 'var(--brand-red, #d43833)' : 'transparent',
                  color: isTurntable ? '#ffffff' : '#3c423c',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
                  <path d="M21 3v5h-5" />
                  <text x="12" y="14" fontSize="7" fontWeight="bold" fontFamily="DM Mono, monospace" textAnchor="middle" fill="currentColor" stroke="none">360</text>
                </svg>
              </button>

              {/* 3. Wireframe Inspection */}
              <button
                type="button"
                onClick={handleToggleWireframe}
                title={isWireframe ? 'Exit Wireframe' : 'View Wireframe Mesh'}
                aria-label="Toggle Wireframe Mesh"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: isWireframe ? '#1e211d' : 'transparent',
                  color: isWireframe ? '#ffffff' : '#3c423c',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m12 2 8.5 4.9v9.8L12 21.5 3.5 16.7V6.9L12 2z" />
                  <path d="m12 11.8 8.5-4.9M12 11.8v9.7M12 11.8 3.5 6.9" />
                </svg>
              </button>

              {/* 4. Capture High-Res Snapshot */}
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                title="Capture High-Res Snapshot"
                aria-label="Capture High-Res Snapshot"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  color: '#3c423c',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>

              {/* 5. Fullscreen Mode */}
              <button
                type="button"
                onClick={handleToggleFullscreen}
                title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                aria-label="Toggle Fullscreen"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'transparent',
                  color: '#3c423c',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {isFullscreen ? (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M8 3v3a2 2 0 0 1-2 2H3m18 0h-3a2 2 0 0 1-2-2V3m0 18v-3a2 2 0 0 1 2-2h3M3 16h3a2 2 0 0 1 2 2v3" />
                  </svg>
                ) : (
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M15 3h6v6M9 21H3v-6M21 15v6h-6M3 9V3h6" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT PANEL: CONFIGURATION SIDEBAR                       */}
        {/* ========================================================= */}
        <div
          className="configurator-sidebar-panel"
          style={{
            background: '#faf9f5',
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

            <ArchitecturalSelect
              value={config.presetId}
              onChange={handleSelectPreset}
              options={CONFIGURATOR_PRESETS.map(p => ({
                value: p.id,
                label: p.name,
                meta: `${p.defaultConfig.width}×${p.defaultConfig.depth}mm`,
              }))}
            />
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
                {/* Vanity Width Control matching Image 3 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                        VANITY WIDTH
                      </label>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #888', fontSize: '9px', fontFamily: 'serif', color: '#666', cursor: 'help' }}>i</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min={380}
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
                    min={380}
                    max={2200}
                    step={10}
                    value={Math.min(config.width, 2200)}
                    onChange={e => setConfig({ ...config, width: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#687268', marginTop: '3px' }}>
                    <span>380mm</span>
                    <span>2200mm</span>
                  </div>
                </div>

                {/* Vanity Depth Control matching Image 3 */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                        VANITY DEPTH
                      </label>
                      <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #888', fontSize: '9px', fontFamily: 'serif', color: '#666', cursor: 'help' }}>i</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <input
                        type="number"
                        min={270}
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
                    min={270}
                    max={700}
                    step={10}
                    value={Math.min(config.depth, 700)}
                    onChange={e => setConfig({ ...config, depth: Number(e.target.value) })}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                  />
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#687268', marginTop: '3px' }}>
                    <span>270mm</span>
                    <span>700mm</span>
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
          {/* SECTION 03: CORNER PROFILES (LEFT / RIGHT)              */}
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
                  Corner Profiles (Left / Right)
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['03'] ? '▲' : '▼'}</span>
            </button>

            {openSections['03'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#687268', lineHeight: 1.5 }}>
                  Configure independent CNC profiles for exposed countertop corners. Radius and chamfer adjustments render in real time.
                </p>

                {/* LEFT CORNER */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                      LEFT CORNER
                    </label>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <line x1="8" y1="8" x2="16" y2="8" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                      <line x1="8" y1="16" x2="12" y2="16" />
                    </svg>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
                    {CORNER_TREATMENT_OPTIONS.map(opt => {
                      const isAct = (config.cornerConfig?.leftType || 'sharp') === opt.id;
                      return (
                        <div
                          key={`left-${opt.id}`}
                          onClick={() => {
                            const prev = config.cornerConfig || {
                              leftType: 'sharp', leftRadius: 25, leftChamfer: 20, leftShift: 50,
                              rightType: 'sharp', rightRadius: 25, rightChamfer: 20, rightShift: 50,
                            };
                            const updated = { ...prev, leftType: opt.id as any };
                            setConfig({
                              ...config,
                              cornerConfig: updated,
                              cornerLeft: {
                                type: opt.id as any,
                                radiusMm: updated.leftRadius,
                                chamferMm: updated.leftChamfer,
                                shiftMm: updated.leftShift,
                              },
                            });
                          }}
                          style={{
                            border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                            background: '#fff',
                            padding: '8px 4px 6px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: '74px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <CornerProfileDiagram
                            type={opt.id as any}
                            side="left"
                            active={isAct}
                            radiusMm={config.cornerConfig?.leftRadius || 25}
                            chamferMm={config.cornerConfig?.leftChamfer || 20}
                            shiftMm={config.cornerConfig?.leftShift || 50}
                          />
                          <span style={{
                            display: 'block',
                            fontSize: '11px',
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: isAct ? 600 : 500,
                            color: isAct ? 'var(--brand-red, #d43833)' : '#444',
                            marginTop: '2px',
                          }}>
                            {opt.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic Active Slider matching Image 3 */}
                  {config.cornerConfig?.leftType === 'shift' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                          SHIFT LEFT CORNER
                        </span>
                        <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--brand-red, #d43833)' }}>
                          {config.cornerConfig.leftShift || 50}mm
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={-65}
                        max={700}
                        step={5}
                        value={config.cornerConfig.leftShift ?? 50}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const updated = { ...config.cornerConfig!, leftShift: val };
                          setConfig({
                            ...config,
                            cornerConfig: updated,
                            cornerLeft: {
                              type: 'shift',
                              radiusMm: updated.leftRadius,
                              chamferMm: updated.leftChamfer,
                              shiftMm: val,
                            },
                          });
                        }}
                        style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', marginTop: '2px' }}>
                        <span>-65mm</span>
                        <span>700mm</span>
                      </div>
                    </div>
                  )}

                  {config.cornerConfig?.leftType === 'fillet' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                          FILLET RADIUS
                        </span>
                        <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--brand-red, #d43833)' }}>
                          R{config.cornerConfig.leftRadius || 25} mm
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={config.cornerConfig.leftRadius || 25}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const updated = { ...config.cornerConfig!, leftRadius: val };
                          setConfig({
                            ...config,
                            cornerConfig: updated,
                            cornerLeft: {
                              type: 'fillet',
                              radiusMm: val,
                              chamferMm: updated.leftChamfer,
                              shiftMm: updated.leftShift,
                            },
                          });
                        }}
                        style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', marginTop: '2px' }}>
                        <span>5mm</span>
                        <span>100mm</span>
                      </div>
                    </div>
                  )}

                  {config.cornerConfig?.leftType === 'chamfer' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                          CHAMFER BEVEL
                        </span>
                        <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--brand-red, #d43833)' }}>
                          C{config.cornerConfig.leftChamfer || 20} mm
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={80}
                        step={5}
                        value={config.cornerConfig.leftChamfer || 20}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const updated = { ...config.cornerConfig!, leftChamfer: val };
                          setConfig({
                            ...config,
                            cornerConfig: updated,
                            cornerLeft: {
                              type: 'chamfer',
                              radiusMm: updated.leftRadius,
                              chamferMm: val,
                              shiftMm: updated.leftShift,
                            },
                          });
                        }}
                        style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', marginTop: '2px' }}>
                        <span>5mm</span>
                        <span>80mm</span>
                      </div>
                    </div>
                  )}
                </div>

                <hr style={{ border: 'none', borderTop: '1px solid #e8e6e1', margin: '6px 0' }} />

                {/* RIGHT CORNER */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                    <label style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                      RIGHT CORNER
                    </label>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="1.5">
                      <rect x="4" y="4" width="16" height="16" rx="2" />
                      <line x1="8" y1="8" x2="16" y2="8" />
                      <line x1="8" y1="12" x2="16" y2="12" />
                      <line x1="8" y1="16" x2="12" y2="16" />
                    </svg>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginBottom: '14px' }}>
                    {CORNER_TREATMENT_OPTIONS.map(opt => {
                      const isAct = (config.cornerConfig?.rightType || 'sharp') === opt.id;
                      return (
                        <div
                          key={`right-${opt.id}`}
                          onClick={() => {
                            const prev = config.cornerConfig || {
                              leftType: 'sharp', leftRadius: 25, leftChamfer: 20, leftShift: 50,
                              rightType: 'sharp', rightRadius: 25, rightChamfer: 20, rightShift: 50,
                            };
                            const updated = { ...prev, rightType: opt.id as any };
                            setConfig({
                              ...config,
                              cornerConfig: updated,
                              cornerRight: {
                                type: opt.id as any,
                                radiusMm: updated.rightRadius,
                                chamferMm: updated.rightChamfer,
                                shiftMm: updated.rightShift,
                              },
                            });
                          }}
                          style={{
                            border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                            background: '#fff',
                            padding: '8px 4px 6px',
                            cursor: 'pointer',
                            textAlign: 'center',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            minHeight: '74px',
                            boxSizing: 'border-box',
                          }}
                        >
                          <CornerProfileDiagram
                            type={opt.id as any}
                            side="right"
                            active={isAct}
                            radiusMm={config.cornerConfig?.rightRadius || 25}
                            chamferMm={config.cornerConfig?.rightChamfer || 20}
                            shiftMm={config.cornerConfig?.rightShift || 50}
                          />
                          <span style={{
                            display: 'block',
                            fontSize: '11px',
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: isAct ? 600 : 500,
                            color: isAct ? 'var(--brand-red, #d43833)' : '#444',
                            marginTop: '2px',
                          }}>
                            {opt.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Dynamic Active Slider matching Image 3 */}
                  {config.cornerConfig?.rightType === 'shift' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                          SHIFT RIGHT CORNER
                        </span>
                        <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--brand-red, #d43833)' }}>
                          {config.cornerConfig.rightShift || 50}mm
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={-65}
                        max={700}
                        step={5}
                        value={config.cornerConfig.rightShift ?? 50}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const updated = { ...config.cornerConfig!, rightShift: val };
                          setConfig({
                            ...config,
                            cornerConfig: updated,
                            cornerRight: {
                              type: 'shift',
                              radiusMm: updated.rightRadius,
                              chamferMm: updated.rightChamfer,
                              shiftMm: val,
                            },
                          });
                        }}
                        style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', marginTop: '2px' }}>
                        <span>-65mm</span>
                        <span>700mm</span>
                      </div>
                    </div>
                  )}

                  {config.cornerConfig?.rightType === 'fillet' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                          FILLET RADIUS
                        </span>
                        <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--brand-red, #d43833)' }}>
                          R{config.cornerConfig.rightRadius || 25} mm
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={100}
                        step={5}
                        value={config.cornerConfig.rightRadius || 25}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const updated = { ...config.cornerConfig!, rightRadius: val };
                          setConfig({
                            ...config,
                            cornerConfig: updated,
                            cornerRight: {
                              type: 'fillet',
                              radiusMm: val,
                              chamferMm: updated.rightChamfer,
                              shiftMm: updated.rightShift,
                            },
                          });
                        }}
                        style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', marginTop: '2px' }}>
                        <span>5mm</span>
                        <span>100mm</span>
                      </div>
                    </div>
                  )}

                  {config.cornerConfig?.rightType === 'chamfer' && (
                    <div style={{ marginTop: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.04em', color: '#1e211d', fontWeight: 600 }}>
                          CHAMFER BEVEL
                        </span>
                        <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--brand-red, #d43833)' }}>
                          C{config.cornerConfig.rightChamfer || 20} mm
                        </strong>
                      </div>
                      <input
                        type="range"
                        min={5}
                        max={80}
                        step={5}
                        value={config.cornerConfig.rightChamfer || 20}
                        onChange={e => {
                          const val = Number(e.target.value);
                          const updated = { ...config.cornerConfig!, rightChamfer: val };
                          setConfig({
                            ...config,
                            cornerConfig: updated,
                            cornerRight: {
                              type: 'chamfer',
                              radiusMm: updated.rightRadius,
                              chamferMm: val,
                              shiftMm: updated.rightShift,
                            },
                          });
                        }}
                        style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', cursor: 'pointer' }}
                      />
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', marginTop: '2px' }}>
                        <span>5mm</span>
                        <span>80mm</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 04: BASIN & SINK INTEGRATION                    */}
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
                  Basin &amp; Sink Integration
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['04'] ? '▲' : '▼'}</span>
            </button>

            {openSections['04'] && (
              <div style={{ padding: '14px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* 1. TAP LOCATION */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      TAP LOCATION
                    </label>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #bbb', fontSize: '9px', color: '#777', fontFamily: 'serif' }}>i</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
                    {[
                      { id: 'top-mounted', label: 'Top' },
                      { id: 'wall-mounted', label: 'Wall' },
                    ].map(item => {
                      const isAct = config.tapLocation === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setConfig({
                            ...config,
                            tapLocation: item.id as any,
                            tapHoles: item.id === 'top-mounted' ? (config.tapHoles && config.tapHoles > 0 ? config.tapHoles : 1) : 0,
                          })}
                          style={{
                            padding: '10px 8px 8px',
                            border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                            background: isAct ? '#ffffff' : '#fcfbfa',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'border-color 0.15s ease',
                          }}
                        >
                          <TapLocationDiagram location={item.id as any} active={isAct} />
                          <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 2. SINK INTEGRATION TYPE */}
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      SINK INTEGRATION TYPE
                    </label>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '14px', height: '14px', borderRadius: '50%', border: '1px solid #bbb', fontSize: '9px', color: '#777', fontFamily: 'serif' }}>i</span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px' }}>
                    {[
                      { id: 'integrated', label: 'IN', title: 'IN - Seamless Integrated Coved Basin (Flush into deck)' },
                      { id: 'topmount', label: 'TOP', title: 'TOP - Top-Mounted Semi-Inset Basin (Collar on deck, bowl inside)' },
                      { id: 'undermount', label: 'ON', title: 'ON - Sit-On Countertop Vessel Basin (Sits entirely on deck)' },
                      { id: 'none', label: 'no sink', title: 'Solid Surface Deck (No Basin)' },
                    ].map(item => {
                      const isAct = config.sinkIntegration === item.id;
                      return (
                        <div
                          key={item.id}
                          title={item.title}
                          onClick={() => {
                            const newIntegration = item.id as any;
                            const updates: Partial<ProductConfiguration> = { sinkIntegration: newIntegration };
                            if (newIntegration === 'none') {
                              updates.basinModelId = 'none';
                            } else if (config.basinModelId === 'none') {
                              updates.basinModelId = 'coved-oval';
                            }
                            setConfig({ ...config, ...updates });
                          }}
                          style={{
                            padding: '8px 4px',
                            border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                            background: isAct ? '#ffffff' : '#fcfbfa',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            gap: '6px',
                            transition: 'border-color 0.15s ease',
                          }}
                        >
                          <SinkIntegrationDiagram type={item.id as any} active={isAct} />
                          <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* 3. SINK MODEL */}
                {config.sinkIntegration !== 'none' && (
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                      SINK MODEL
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(68px, 1fr))', gap: '8px' }}>
                      {[
                        { id: 'round-bowl', code: 'RO', name: 'Round Bowl (RO)' },
                        { id: 'coved-oval', code: 'OV', name: 'Oval Basin (OV)' },
                        { id: 'crisp-rect', code: 'B', name: 'Rectangular Box (B)' },
                        { id: 'double-basin', code: 'DB', name: 'Double Basin (DB)' },
                        { id: 'undermount-box', code: 'UB', name: 'Undermount Box (UB)' },
                        { id: 'undermount-channel', code: 'UC', name: 'Undermount Channel (UC)' },
                        { id: 'washdesk-trough', code: 'WDT', name: 'Washdesk Trough (WDT)' },
                      ].map(item => {
                        const isAct = config.basinModelId === item.id ||
                          (item.code === 'RO' && (config.basinModelId === 'round-bowl' || config.basinModelId === 'RO')) ||
                          (item.code === 'OV' && (config.basinModelId === 'coved-oval' || config.basinModelId === 'OV')) ||
                          (item.code === 'B' && (config.basinModelId === 'crisp-rect' || config.basinModelId === 'B')) ||
                          (item.code === 'DB' && (config.basinModelId === 'double-basin' || config.basinModelId === 'DB')) ||
                          (item.code === 'UB' && (config.basinModelId === 'undermount-box' || config.basinModelId === 'UB')) ||
                          (item.code === 'UC' && (config.basinModelId === 'undermount-channel' || config.basinModelId === 'UC')) ||
                          (item.code === 'WDT' && (config.basinModelId === 'washdesk-trough' || config.basinModelId === 'WDT'));

                        return (
                          <div
                            key={item.id}
                            title={item.name}
                            onClick={() => {
                              const updates: Partial<ProductConfiguration> = { basinModelId: item.id };
                              if (config.sinkIntegration === 'none') {
                                updates.sinkIntegration = 'integrated';
                              }
                              if (item.code === 'RO') {
                                updates.basinWidthMm = config.basinWidthMm || 350;
                                updates.basinDepthMm = config.basinWidthMm || 350;
                                updates.basinHeightMm = 135;
                                updates.basinSizeCode = config.basinSizeCode || 'RO350';
                              } else if (item.code === 'WDT') {
                                updates.basinWidthMm = config.basinWidthMm || 600;
                                updates.basinDepthMm = config.basinDepthMm || 260;
                                updates.basinHeightMm = 120;
                                updates.basinSizeCode = config.basinSizeCode || 'WDT260';
                              } else if (item.code === 'B') {
                                updates.basinWidthMm = config.basinWidthMm || 500;
                                updates.basinDepthMm = config.basinDepthMm || 350;
                                updates.basinHeightMm = 130;
                              }
                              setConfig({ ...config, ...updates });
                            }}
                            style={{
                              padding: '8px 4px 6px',
                              border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                              background: isAct ? '#ffffff' : '#fcfbfa',
                              borderRadius: '2px',
                              cursor: 'pointer',
                              display: 'flex',
                              flexDirection: 'column',
                              alignItems: 'center',
                              gap: '4px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <SinkModelDiagram model={item.code as any} active={isAct} />
                            <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                              {item.code}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* 4. SINK SIZE / SINK DEPTH / SINK WIDTH OPTIONS (Exact matching reference images) */}
                {config.sinkIntegration !== 'none' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {/* CASE A: Round Bowl (RO) -> SINK SIZE (Image 2: RO250 - RO400) */}
                    {(config.basinModelId === 'round-bowl' || config.basinModelId === 'RO') && (
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                          SINK SIZE
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                          {RO_SIZE_OPTIONS.map(opt => {
                            const isAct = config.basinSizeCode === opt.code || (!config.basinSizeCode && config.basinWidthMm === opt.diameter) || (opt.code === 'RO350' && !config.basinSizeCode);
                            return (
                              <div
                                key={opt.code}
                                onClick={() => {
                                  setConfig({
                                    ...config,
                                    basinWidthMm: opt.diameter,
                                    basinDepthMm: opt.diameter,
                                    basinHeightMm: opt.height,
                                    basinSizeCode: opt.code,
                                  });
                                }}
                                style={{
                                  padding: '8px 2px 6px',
                                  border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                  background: isAct ? '#ffffff' : '#fcfbfa',
                                  borderRadius: '2px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <SinkModelDiagram model="RO" active={isAct} />
                                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                                  {opt.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* CASE B: Washdesk Trough (WDT) -> SINK DEPTH (Image 3: WDT180 - WDT400) */}
                    {(config.basinModelId === 'washdesk-trough' || config.basinModelId === 'WDT') && (
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                          SINK DEPTH (FRONT-TO-BACK)
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px', marginBottom: '10px' }}>
                          {WDT_DEPTH_OPTIONS.slice(0, 5).map(opt => {
                            const isAct = config.basinSizeCode === opt.code || (!config.basinSizeCode && config.basinDepthMm === opt.depth) || (opt.code === 'WDT260' && !config.basinSizeCode);
                            return (
                              <div
                                key={opt.code}
                                onClick={() => {
                                  setConfig({
                                    ...config,
                                    basinDepthMm: opt.depth,
                                    basinSizeCode: opt.code,
                                  });
                                }}
                                style={{
                                  padding: '8px 2px 6px',
                                  border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                  background: isAct ? '#ffffff' : '#fcfbfa',
                                  borderRadius: '2px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <SinkModelDiagram model="WDT" active={isAct} />
                                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                                  {opt.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                          {WDT_DEPTH_OPTIONS.slice(5).map(opt => {
                            const isAct = config.basinSizeCode === opt.code || (config.basinDepthMm === opt.depth);
                            return (
                              <div
                                key={opt.code}
                                onClick={() => {
                                  setConfig({
                                    ...config,
                                    basinDepthMm: opt.depth,
                                    basinSizeCode: opt.code,
                                  });
                                }}
                                style={{
                                  padding: '8px 2px 6px',
                                  border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                  background: isAct ? '#ffffff' : '#fcfbfa',
                                  borderRadius: '2px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  alignItems: 'center',
                                  gap: '4px',
                                  transition: 'all 0.15s ease',
                                }}
                              >
                                <SinkModelDiagram model="WDT" active={isAct} />
                                <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                                  {opt.label}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* WDT Trough Width */}
                        <div style={{ marginTop: '12px' }}>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                            SINK WIDTH (SPAN)
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                            {[500, 600, 700, 800, 900].map(w => {
                              const isAct = (config.basinWidthMm || 600) === w;
                              return (
                                <button
                                  key={w}
                                  type="button"
                                  onClick={() => setConfig({ ...config, basinWidthMm: w })}
                                  style={{
                                    padding: '8px 4px',
                                    background: isAct ? 'var(--brand-red, #d43833)' : '#f8f7f4',
                                    color: isAct ? '#fff' : '#1e211d',
                                    border: isAct ? '1px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    fontSize: '11px',
                                    fontFamily: 'DM Mono, monospace',
                                    cursor: 'pointer',
                                  }}
                                >
                                  {w} mm
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* CASE C: B, OV, DB, UB, UC -> SINK WIDTH & SINK DEPTH (Image 4) */}
                    {(config.basinModelId !== 'round-bowl' && config.basinModelId !== 'RO' &&
                      config.basinModelId !== 'washdesk-trough' && config.basinModelId !== 'WDT') && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                            SINK WIDTH (SPAN)
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                            {SINK_WIDTH_OPTIONS.map(w => {
                              const isAct = (config.basinWidthMm || 500) === w;
                              const modelCode = config.basinModelId === 'coved-oval' ? 'OV' : config.basinModelId === 'crisp-rect' ? 'B' : config.basinModelId === 'double-basin' ? 'DB' : config.basinModelId === 'undermount-box' ? 'UB' : config.basinModelId === 'undermount-channel' ? 'UC' : 'B';
                              return (
                                <div
                                  key={w}
                                  onClick={() => setConfig({ ...config, basinWidthMm: w })}
                                  style={{
                                    padding: '8px 2px 6px',
                                    border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    background: isAct ? '#ffffff' : '#fcfbfa',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <SinkModelDiagram model={modelCode} active={isAct} />
                                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                                    {w}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                            SINK LENGTH / DEPTH (FRONT-TO-BACK)
                          </label>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {SINK_DEPTH_OPTIONS.map(d => {
                              const isAct = (config.basinDepthMm || 350) === d;
                              const modelCode = config.basinModelId === 'coved-oval' ? 'OV' : config.basinModelId === 'crisp-rect' ? 'B' : config.basinModelId === 'double-basin' ? 'DB' : config.basinModelId === 'undermount-box' ? 'UB' : config.basinModelId === 'undermount-channel' ? 'UC' : 'B';
                              return (
                                <div
                                  key={d}
                                  onClick={() => setConfig({ ...config, basinDepthMm: d })}
                                  style={{
                                    padding: '8px 2px 6px',
                                    border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    background: isAct ? '#ffffff' : '#fcfbfa',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <SinkModelDiagram model={modelCode} active={isAct} />
                                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 600 : 400, color: isAct ? 'var(--brand-red, #d43833)' : '#444' }}>
                                    {d}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* BOWL INTERNAL DEPTH (HEIGHT) */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                              BOWL DEPTH (INTERNAL)
                            </label>
                            <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                              {config.basinHeightMm || 135} mm
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                            {[110, 130, 150, 170].map(h => {
                              const isAct = (config.basinHeightMm || 135) === h;
                              return (
                                <button
                                  key={h}
                                  type="button"
                                  onClick={() => setConfig({ ...config, basinHeightMm: h })}
                                  style={{
                                    padding: '8px 2px',
                                    border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    background: isAct ? 'var(--brand-red, #d43833)' : '#ffffff',
                                    color: isAct ? '#ffffff' : '#1e211d',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    textAlign: 'center',
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '11px',
                                    fontWeight: isAct ? 600 : 400,
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  {h} mm
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}


                {/* TAP HOLES DRILLING */}
                {config.tapLocation === 'top-mounted' && (
                  <div style={{ background: 'rgba(30,33,29,0.03)', padding: '12px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>Deck CNC Tap Holes (35mm Ø)</span>
                      <strong style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>{config.tapHoles} Holes</strong>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                      {[0, 1, 2, 3].map(count => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => setConfig({ ...config, tapHoles: count as 0 | 1 | 2 | 3 })}
                          style={{
                            padding: '8px',
                            background: config.tapHoles === count ? '#1e211d' : '#fff',
                            color: config.tapHoles === count ? '#fff' : '#1e211d',
                            border: '1px solid rgba(30,33,29,0.2)',
                            fontSize: '11px',
                            fontFamily: 'DM Mono, monospace',
                            cursor: 'pointer',
                          }}
                        >
                          {count === 0 ? 'None' : count === 1 ? '1 Hole' : `${count} Holes`}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 05: DOWNSTANDS & APRON DROPS                    */}
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
                  Downstands &amp; Apron Drops
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['05'] ? '▲' : '▼'}</span>
            </button>

            {openSections['05'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#687268', lineHeight: 1.5 }}>
                  Seamlessly folded Corian® fascia aprons create substantial architectural presence and conceal under-sink plumbing.
                </p>

                {/* INDEPENDENT SIDE TOGGLES */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Active Downstand Sides
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const cur = config.downstands || { front: true, left: true, right: true, height: config.frontApronHeight || 100 };
                        setConfig({ ...config, downstands: { ...cur, front: !cur.front } });
                      }}
                      style={{
                        padding: '10px 8px',
                        background: config.downstands?.front ? '#1e211d' : '#f0eee8',
                        color: config.downstands?.front ? '#fff' : '#1e211d',
                        border: '1px solid rgba(30,33,29,0.15)',
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Front Apron: {config.downstands?.front ? 'ON' : 'OFF'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const cur = config.downstands || { front: true, left: true, right: true, height: config.frontApronHeight || 100 };
                        setConfig({ ...config, downstands: { ...cur, left: !cur.left } });
                      }}
                      style={{
                        padding: '10px 8px',
                        background: config.downstands?.left ? '#1e211d' : '#f0eee8',
                        color: config.downstands?.left ? '#fff' : '#1e211d',
                        border: '1px solid rgba(30,33,29,0.15)',
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Left Side: {config.downstands?.left ? 'ON' : 'OFF'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const cur = config.downstands || { front: true, left: true, right: true, height: config.frontApronHeight || 100 };
                        setConfig({ ...config, downstands: { ...cur, right: !cur.right } });
                      }}
                      style={{
                        padding: '10px 8px',
                        background: config.downstands?.right ? '#1e211d' : '#f0eee8',
                        color: config.downstands?.right ? '#fff' : '#1e211d',
                        border: '1px solid rgba(30,33,29,0.15)',
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Right Side: {config.downstands?.right ? 'ON' : 'OFF'}
                    </button>
                  </div>
                </div>

                {/* HEIGHT PRESETS WITH DIAGRAMS */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      Downstand Fascia Height
                    </label>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 600 }}>
                      {config.downstands?.height || config.frontApronHeight || 100} mm
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginBottom: '12px' }}>
                    {DOWNSTAND_HEIGHT_OPTIONS.map(opt => (
                      <TechnicalOptionCard
                        key={opt.height}
                        title={opt.label}
                        subtitle={opt.description}
                        isActive={(config.downstands?.height || config.frontApronHeight) === opt.height}
                        onClick={() => {
                          const cur = config.downstands || { front: true, left: true, right: true, height: 100, heightMm: 100 };
                          setConfig({
                            ...config,
                            frontApronHeight: opt.height,
                            downstands: { ...cur, height: opt.height, heightMm: opt.height },
                          });
                        }}
                      >
                        <DownstandDiagram heightMm={opt.height} />
                      </TechnicalOptionCard>
                    ))}
                  </div>

                  {/* Continuous Height Slider */}
                  <div style={{ background: 'rgba(30,33,29,0.03)', padding: '10px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>
                      <span>Fine Custom Adjustment</span>
                      <strong>{config.downstands?.height || config.frontApronHeight || 100} mm</strong>
                    </div>
                    <input
                      type="range"
                      min={12}
                      max={350}
                      step={5}
                      value={config.downstands?.height || config.frontApronHeight || 100}
                      onChange={e => {
                        const val = Number(e.target.value);
                        const cur = config.downstands || { front: true, left: true, right: true, height: 100, heightMm: 100 };
                        setConfig({
                          ...config,
                          frontApronHeight: val,
                          downstands: { ...cur, height: val, heightMm: val },
                        });
                      }}
                      style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)' }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 06: UPSTANDS & SPLASHBACKS                      */}
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
                  Upstands &amp; Wall Splashbacks
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['06'] ? '▲' : '▼'}</span>
            </button>

            {openSections['06'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                {/* BACK UPSTAND MODE */}
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                      Rear Wall Upstand
                    </label>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: 'var(--brand-red, #d43833)' }}>
                      {config.upstands?.backMode || 'full'}
                    </span>
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                    {UPSTAND_MODE_OPTIONS.map(opt => (
                      <TechnicalOptionCard
                        key={`back-${opt.id}`}
                        title={opt.name}
                        subtitle={opt.description}
                        isActive={(config.upstands?.backMode || 'full') === opt.id}
                        onClick={() => {
                          const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, heightMm: 100, coved: true };
                          const targetH = opt.id === 'none' ? 0 : opt.id === 'standard' ? 80 : (cur.height && cur.height > 0 ? cur.height : 100);
                          setConfig({
                            ...config,
                            rearUpstandHeight: targetH,
                            upstands: {
                              ...cur,
                              backMode: opt.id as any,
                              height: targetH,
                              heightMm: targetH,
                            },
                          });
                        }}
                      >
                        <UpstandDiagram mode={opt.id as any} coved={config.upstands?.coved} />
                      </TechnicalOptionCard>
                    ))}
                  </div>
                </div>

                {/* RETURN SIDES */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Side Return Wall Upstands
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, coved: true };
                        setConfig({
                          ...config,
                          upstands: { ...cur, leftMode: cur.leftMode === 'full' ? 'none' : 'full' },
                        });
                      }}
                      style={{
                        padding: '10px 8px',
                        background: config.upstands?.leftMode === 'full' ? '#1e211d' : '#f0eee8',
                        color: config.upstands?.leftMode === 'full' ? '#fff' : '#1e211d',
                        border: '1px solid rgba(30,33,29,0.15)',
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Left Wall Return: {config.upstands?.leftMode === 'full' ? 'FULL' : 'NONE'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, coved: true };
                        setConfig({
                          ...config,
                          upstands: { ...cur, rightMode: cur.rightMode === 'full' ? 'none' : 'full' },
                        });
                      }}
                      style={{
                        padding: '10px 8px',
                        background: config.upstands?.rightMode === 'full' ? '#1e211d' : '#f0eee8',
                        color: config.upstands?.rightMode === 'full' ? '#fff' : '#1e211d',
                        border: '1px solid rgba(30,33,29,0.15)',
                        fontSize: '11px',
                        fontFamily: 'DM Mono, monospace',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      Right Wall Return: {config.upstands?.rightMode === 'full' ? 'FULL' : 'NONE'}
                    </button>
                  </div>
                </div>

                {/* UPSTAND HEIGHT SLIDER */}
                <div style={{ background: 'rgba(30,33,29,0.03)', padding: '10px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>
                    <span>Splashback Upstand Height</span>
                    <strong>{config.upstands?.height || config.upstands?.heightMm || config.rearUpstandHeight || 100} mm</strong>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={300}
                    step={10}
                    value={config.upstands?.height || config.upstands?.heightMm || config.rearUpstandHeight || 100}
                    onChange={e => {
                      const val = Number(e.target.value);
                      const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, heightMm: 100, coved: true, isCoved: true, type: 'standard', backLengthMm: config.width, leftLengthMm: 0, rightLengthMm: 0 };
                      const newBackMode = val <= 0 ? 'none' : (cur.backMode === 'none' ? (val === 80 ? 'standard' : 'full') : cur.backMode);
                      setConfig({ ...config, rearUpstandHeight: val, upstands: { ...cur, backMode: newBackMode, height: val, heightMm: val } });
                    }}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)' }}
                  />
                </div>

                {/* COVED FUSION TOGGLE */}
                <div
                  onClick={() => {
                    const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, heightMm: 100, coved: true, isCoved: true, type: 'standard', backLengthMm: config.width, leftLengthMm: 0, rightLengthMm: 0 };
                    const nextCoved = !Boolean(cur.coved ?? cur.isCoved);
                    setConfig({ ...config, isCovedUpstand: nextCoved, upstands: { ...cur, coved: nextCoved, isCoved: nextCoved } });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    border: (config.upstands?.coved ?? config.upstands?.isCoved) ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.15)',
                    background: (config.upstands?.coved ?? config.upstands?.isCoved) ? 'rgba(212,56,51,0.03)' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: '#1e211d' }}>Seamless 12mm Coved Wall Junction (R12)</strong>
                    <span style={{ fontSize: '10px', color: '#687268', lineHeight: 1.4 }}>
                      Molecular chemical fusion eliminates mold-collecting silicone joints between top and wall.
                    </span>
                  </div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>
                    {config.upstands?.coved ? 'Active ✓' : 'Standard Square'}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 07: TOWEL-HOLDER CUT-OUT                        */}
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
                  Towel-Holder Cut-out
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['07'] ? '▲' : '▼'}</span>
            </button>

            {openSections['07'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#687268', lineHeight: 1.5 }}>
                  Integrated CNC towel-rail slot routed directly through the front downstand apron with full return jamb walls.
                </p>

                {/* ENABLE / DISABLE TOGGLE */}
                <div
                  onClick={() => {
                    const cur = config.towelHolder || { enabled: false, length: 450, position: 'center', cornerRadius: 12 };
                    setConfig({
                      ...config,
                      towelHolder: { ...cur, enabled: !cur.enabled },
                    });
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '12px 14px',
                    border: config.towelHolder?.enabled ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.15)',
                    background: config.towelHolder?.enabled ? 'rgba(212,56,51,0.03)' : '#fff',
                    cursor: 'pointer',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '12px', display: 'block', color: '#1e211d' }}>
                      Integrated Front Apron Towel Slot
                    </strong>
                    <span style={{ fontSize: '10px', color: '#687268' }}>
                      5-axis CNC cut slot with smooth chamfered edges (+₹2,400 tooling)
                    </span>
                  </div>
                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>
                    {config.towelHolder?.enabled ? 'Enabled ✓' : 'Disabled'}
                  </span>
                </div>

                {config.towelHolder?.enabled && (
                  <>
                    {/* LENGTH SELECTION */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                        Slot Length
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                        {TOWEL_HOLDER_OPTIONS.lengths.map(len => (
                          <TechnicalOptionCard
                            key={len}
                            title={`${len} mm Slot`}
                            subtitle={len === 300 ? 'Guest / Hand Towel' : 'Standard Bath Towel'}
                            isActive={config.towelHolder?.length === len}
                            onClick={() => {
                              const cur = config.towelHolder || { enabled: true, length: 450, lengthMm: 450, position: 'center', cornerRadius: 12, filletMm: 12 };
                              setConfig({ ...config, towelHolder: { ...cur, length: len, lengthMm: len } });
                            }}
                          >
                            <TowelHolderDiagram lengthMm={len} position={config.towelHolder?.position || 'center'} cornerRadius={config.towelHolder?.cornerRadius || 12} />
                          </TechnicalOptionCard>
                        ))}
                      </div>
                    </div>

                    {/* POSITION SELECTION */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                        Slot Lateral Position
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {TOWEL_HOLDER_OPTIONS.positions.map(pos => (
                          <button
                            key={pos}
                            type="button"
                            onClick={() => {
                              const cur = config.towelHolder || { enabled: true, length: 450, position: 'center', cornerRadius: 12 };
                              setConfig({ ...config, towelHolder: { ...cur, position: pos } });
                            }}
                            style={{
                              padding: '10px 8px',
                              background: config.towelHolder?.position === pos ? '#1e211d' : '#f0eee8',
                              color: config.towelHolder?.position === pos ? '#fff' : '#1e211d',
                              border: '1px solid rgba(30,33,29,0.15)',
                              fontSize: '11px',
                              fontFamily: 'DM Mono, monospace',
                              textTransform: 'uppercase',
                              cursor: 'pointer',
                            }}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* CORNER FILLET SELECTION */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                        Slot Corner Fillet (Internal Tooling)
                      </label>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                        {TOWEL_HOLDER_OPTIONS.cornerRadii.map(rad => (
                          <button
                            key={rad}
                            type="button"
                            onClick={() => {
                              const cur = config.towelHolder || { enabled: true, length: 450, lengthMm: 450, position: 'center', cornerRadius: 12, filletMm: 12 };
                              setConfig({ ...config, towelHolder: { ...cur, cornerRadius: rad, filletMm: rad } });
                            }}
                            style={{
                              padding: '10px 8px',
                              background: config.towelHolder?.cornerRadius === rad ? '#1e211d' : '#f0eee8',
                              color: config.towelHolder?.cornerRadius === rad ? '#fff' : '#1e211d',
                              border: '1px solid rgba(30,33,29,0.15)',
                              fontSize: '11px',
                              fontFamily: 'DM Mono, monospace',
                              cursor: 'pointer',
                            }}
                          >
                            R{rad} mm
                          </button>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 08: TOP EDGE PROFILES & FINISHING               */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('08')}
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
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>08</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Top Edge Finishing
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['08'] ? '▲' : '▼'}</span>
            </button>

            {openSections['08'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                  {TOP_EDGE_OPTIONS.map(opt => {
                    const isActive =
                      (config.topEdge?.type || config.edgeProfileId || 'sharp') === opt.id ||
                      (opt.id === 'fillet' && config.edgeProfileId === 'rounded');
                    return (
                      <TechnicalOptionCard
                        key={opt.id}
                        title={opt.name}
                        subtitle={opt.description}
                        isActive={isActive}
                        onClick={() => {
                          const cur = config.topEdge || { type: 'sharp', radiusMm: 6, chamferMm: 3 };
                          const rVal = opt.id === 'fillet' ? (cur.radiusMm || 6) : (cur.radiusMm || 6);
                          const cVal = opt.id === 'chamfer' ? (cur.chamferMm || 3) : (cur.chamferMm || 3);
                          setConfig({
                            ...config,
                            topEdge: { ...cur, type: opt.id as any, radiusMm: rVal, chamferMm: cVal },
                            edgeProfileId: opt.id === 'fillet' ? 'rounded' : (opt.id as any),
                          });
                        }}
                      >
                        <EdgeFinishDiagram
                          type={opt.id as any}
                          radiusMm={config.topEdge?.radiusMm || 6}
                          chamferMm={config.topEdge?.chamferMm || 3}
                        />
                      </TechnicalOptionCard>
                    );
                  })}
                </div>

                {((config.topEdge?.type === 'fillet') || config.edgeProfileId === 'rounded') && (
                  <div style={{ background: 'rgba(30,33,29,0.03)', padding: '10px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>
                      <span>Round Fillet Radius</span>
                      <strong>R{config.topEdge?.radiusMm || 6} mm</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={12}
                      step={1}
                      value={config.topEdge?.radiusMm || 6}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setConfig({
                          ...config,
                          edgeProfileId: 'rounded',
                          topEdge: { ...(config.topEdge || { chamferMm: 3 }), type: 'fillet', radiusMm: val },
                        });
                      }}
                      style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)' }}
                    />
                  </div>
                )}

                {((config.topEdge?.type === 'chamfer') || config.edgeProfileId === 'chamfer') && (
                  <div style={{ background: 'rgba(30,33,29,0.03)', padding: '10px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginBottom: '6px' }}>
                      <span>Chamfer Bevel Dimension</span>
                      <strong>{config.topEdge?.chamferMm || 3} × 45° mm</strong>
                    </div>
                    <input
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={config.topEdge?.chamferMm || 3}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setConfig({
                          ...config,
                          edgeProfileId: 'chamfer',
                          topEdge: { ...(config.topEdge || { radiusMm: 6 }), type: 'chamfer', chamferMm: val },
                        });
                      }}
                      style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)' }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 09: WASTE & DRAIN SYSTEM                        */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('09')}
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
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>09</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Waste &amp; Drain System
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['09'] ? '▲' : '▼'}</span>
            </button>

            {openSections['09'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <p style={{ margin: 0, fontSize: '11px', color: '#687268', lineHeight: 1.5 }}>
                  Select precision drain hardware or an architectural color-matched Corian® waste disc.
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {DRAIN_OPTIONS.map(opt => (
                    <TechnicalOptionCard
                      key={opt.id}
                      title={opt.name}
                      subtitle={opt.description}
                      badge={(opt.priceModifier || 0) > 0 ? `+₹${(opt.priceModifier || 0).toLocaleString('en-IN')}` : 'Included'}
                      isActive={(config.drainOption || config.drainTypeId || 'click-clack-corian') === opt.id}
                      onClick={() => setConfig({ ...config, drainOption: opt.id, drainTypeId: opt.id })}
                    >
                      <DrainTypeThumbnail type={opt.id as any} colorHex={config.materialHex} />
                    </TechnicalOptionCard>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* ======================================================= */}
          {/* SECTION 10: MATERIAL & COLOUR PALETTE                   */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('10')}
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
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>10</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Corian® Material &amp; Tone Palette
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['10'] ? '▲' : '▼'}</span>
            </button>

            {openSections['10'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Active Material Header Card */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 14px',
                    background: '#f8f7f2',
                    border: '1px solid rgba(30,33,29,0.15)',
                  }}
                >
                  <div
                    style={{
                      width: '40px',
                      height: '40px',
                      backgroundColor: config.materialHex,
                      border: '1px solid rgba(30,33,29,0.2)',
                      boxShadow: 'inset 0 0 4px rgba(0,0,0,0.1)',
                      flexShrink: 0,
                    }}
                  />
                  <div>
                    <strong style={{ fontSize: '13px', color: '#1e211d', display: 'block' }}>
                      {config.materialName}
                    </strong>
                    <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#687268' }}>
                      DuPont Corian® • {(config.materialFinish || 'Honed Satin Matte').toUpperCase()} FINISH
                    </span>
                  </div>
                </div>

                {/* Filter Tabs */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(['all', 'white', 'cream', 'grey', 'black', 'translucent'] as const).map(tab => (
                    <button
                      key={tab}
                      type="button"
                      onClick={() => setMaterialFilter(tab)}
                      style={{
                        padding: '6px 10px',
                        background: materialFilter === tab ? '#1e211d' : 'transparent',
                        color: materialFilter === tab ? '#fff' : '#444',
                        border: '1px solid rgba(30,33,29,0.15)',
                        fontSize: '10px',
                        fontFamily: 'DM Mono, monospace',
                        textTransform: 'uppercase',
                        cursor: 'pointer',
                      }}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Swatches Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                  {CONFIGURATOR_MATERIALS.filter(m => materialFilter === 'all' || m.category === materialFilter).map(mat => {
                    const isSelected = config.materialSlug === mat.slug;
                    return (
                      <div
                        key={mat.id || mat.slug}
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
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '8px 10px',
                          border: isSelected ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.12)',
                          background: isSelected ? 'rgba(212,56,51,0.03)' : '#fdfdfc',
                          cursor: 'pointer',
                        }}
                      >
                        <div
                          style={{
                            width: '28px',
                            height: '28px',
                            backgroundColor: mat.hexColor,
                            border: '1px solid rgba(30,33,29,0.2)',
                            flexShrink: 0,
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
          {/* SECTION 11: PROJECT NOTES & SPECIFIER DETAILS           */}
          {/* ======================================================= */}
          <div className="accordion-card" style={{ background: '#fff', border: '1px solid var(--line, rgba(30,33,29,0.15))' }}>
            <button
              type="button"
              onClick={() => toggleSection('11')}
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
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>11</span>
                <span style={{ fontFamily: 'Manrope, sans-serif', fontSize: '13px', fontWeight: 600, letterSpacing: '0.02em' }}>
                  Project Notes &amp; Specifier Details
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['11'] ? '▲' : '▼'}</span>
            </button>

            {openSections['11'] && (
              <div style={{ padding: '16px 20px 22px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#667066', marginBottom: '4px' }}>
                    Project Name / Reference
                  </label>
                  <input
                    type="text"
                    value={config.projectName || ''}
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
                    value={config.clientStudio || ''}
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
                    value={config.specialInstructions || ''}
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
        onWheel={e => e.stopPropagation()}
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          background: '#1e211d',
          color: '#e9e8e2',
          borderTop: '1px solid rgba(255,255,255,0.12)',
          zIndex: 900,
          boxShadow: '0 -10px 30px rgba(0,0,0,0.35)',
        }}
      >
        {/* Left: Indicative Price & Breakdown Trigger */}
        <div className="configurator-action-bar-pricing">
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', color: '#9ca59b', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
                Indicative Estimate
              </span>
              <button
                type="button"
                onClick={() => setShowPriceBreakdown(true)}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--brand-red, #d43833)',
                  fontSize: '10.5px',
                  fontFamily: 'DM Mono, monospace',
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  padding: 0,
                  whiteSpace: 'nowrap',
                }}
              >
                Breakdown ↗
              </button>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
              <strong style={{ fontSize: '22px', fontFamily: 'Manrope, sans-serif', color: '#fff', letterSpacing: '-0.02em', whiteSpace: 'nowrap' }}>
                ₹{pricing.totalIndicative.toLocaleString('en-IN')}
              </strong>
              <span style={{ fontSize: '10px', color: '#889088', whiteSpace: 'nowrap' }}>+ GST</span>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="configurator-qty-selector" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#9ca59b', whiteSpace: 'nowrap' }}>Qty:</span>
            <button
              type="button"
              onClick={() => setConfig({ ...config, quantity: Math.max(1, config.quantity - 1) })}
              style={{
                width: '26px',
                height: '26px',
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              -
            </button>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', width: '18px', textAlign: 'center', color: '#fff' }}>
              {config.quantity}
            </span>
            <button
              type="button"
              onClick={() => setConfig({ ...config, quantity: config.quantity + 1 })}
              style={{
                width: '26px',
                height: '26px',
                background: 'rgba(255,255,255,0.12)',
                border: 'none',
                color: '#fff',
                cursor: 'pointer',
                fontFamily: 'DM Mono, monospace',
                borderRadius: '2px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              +
            </button>
          </div>
        </div>

        {/* Right: Export, AR & Primary Quote CTA */}
        <div className="configurator-action-bar-ctas">
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
            Spatial AR (1:1)
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
            padding: '16px',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
          }}
          onClick={() => setShowPriceBreakdown(false)}
        >
          <div
            style={{
              maxWidth: '480px',
              width: '100%',
              maxHeight: '88vh',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
              background: '#faf9f5',
              padding: '24px 20px',
              border: '1px solid rgba(30,33,29,0.18)',
              borderTop: '3px solid var(--brand-red, #d43833)',
              boxShadow: '0 24px 48px rgba(0,0,0,0.4)',
              borderRadius: '2px',
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10.5px', textTransform: 'uppercase', color: '#667066', letterSpacing: '0.08em' }}>
                Itemized Fabrication Breakdown
              </span>
              <button
                type="button"
                onClick={() => setShowPriceBreakdown(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '18px',
                  lineHeight: 1,
                  padding: '4px 6px',
                  cursor: 'pointer',
                  color: '#444',
                }}
              >
                ✕
              </button>
            </div>

            <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: 600, color: '#1e211d' }}>
              {config.title}
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '11px', fontSize: '12.5px', borderTop: '1px solid #e0ded6', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>Base Substrate ({config.materialName})</span>
                <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                  ₹{pricing.baseSubstrate.toLocaleString('en-IN')}
                </strong>
              </div>
              {pricing.thicknessSurcharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>Thickness Calibration ({config.thickness}mm)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                    ₹{pricing.thicknessSurcharge.toLocaleString('en-IN')}
                  </strong>
                </div>
              )}
              {pricing.apronDownstand > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>Mitred Apron Downstands ({config.frontApronHeight}mm)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                    ₹{pricing.apronDownstand.toLocaleString('en-IN')}
                  </strong>
                </div>
              )}
              {pricing.upstandSplashback > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>{config.isCovedUpstand ? '10mm Coved Splashback' : 'Standard Upstand'} ({config.rearUpstandHeight}mm)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                    ₹{pricing.upstandSplashback.toLocaleString('en-IN')}
                  </strong>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>CNC Edge Tooling &amp; Hand Polish</span>
                <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                  ₹{pricing.edgeTooling.toLocaleString('en-IN')}
                </strong>
              </div>
              {pricing.basinIntegration > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>Integrated Coved Washbowl(s)</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                    ₹{pricing.basinIntegration.toLocaleString('en-IN')}
                  </strong>
                </div>
              )}
              {pricing.tapCutouts > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                  <span style={{ flex: 1, minWidth: 0, color: '#333', lineHeight: 1.4 }}>CNC Tap Hole Cutouts ({config.tapHoles})</span>
                  <strong style={{ fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right', color: '#1e211d' }}>
                    ₹{pricing.tapCutouts.toLocaleString('en-IN')}
                  </strong>
                </div>
              )}

              <div style={{ borderTop: '2px solid #1e211d', marginTop: '14px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <div>
                  <strong style={{ fontSize: '15px', color: '#1e211d', display: 'block', lineHeight: 1.3 }}>Total Indicative Estimate</strong>
                  <span style={{ fontSize: '10px', color: '#777', fontFamily: 'DM Mono, monospace' }}>Qty: {config.quantity} Unit(s)</span>
                </div>
                <strong style={{ fontSize: '20px', color: 'var(--brand-red, #d43833)', fontFamily: 'DM Mono, monospace', whiteSpace: 'nowrap', flexShrink: 0, textAlign: 'right' }}>
                  ₹{pricing.totalIndicative.toLocaleString('en-IN')}
                </strong>
              </div>
            </div>

            <p style={{ marginTop: '16px', fontSize: '10.5px', color: '#7a8279', lineHeight: 1.5 }}>
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
      {/* REAL CROSS-PLATFORM AR MODAL                              */}
      {/* ========================================================= */}
      <ArViewerModal
        config={config}
        isOpen={showArModal}
        onClose={() => setShowArModal(false)}
      />
    </div>
  );
}

export { ProductConfigurator };
