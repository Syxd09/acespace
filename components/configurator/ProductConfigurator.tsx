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
  WDT_DEPTH_OPTIONS,
  CUSTOM_BASIN_WIDTH_OPTIONS,
  CUSTOM_BASIN_DEPTH_OPTIONS,
  CUSTOM_BASIN_HEIGHT_OPTIONS,
} from '@/data/configuratorData';
import { Configurator3DEngine, DimensionCallout, CadDimensionData } from '@/lib/configurator/webglEngine';
import { decodeUrlParamsToConfig } from '@/lib/configurator/urlParams';
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

  // Material Palette Filter & Search
  const [materialFilter, setMaterialFilter] = useState<'all' | 'white' | 'cream' | 'grey' | 'black' | 'translucent'>('all');
  const [materialSearch, setMaterialSearch] = useState('');

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
    // 1. Instant zero-DB hydration from URL search params (guarantees phone loads even if DB is asleep)
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const decoded = decodeUrlParamsToConfig(searchParams);
      if (decoded && decoded.width) {
        setConfig(prev => ({
          ...prev,
          ...decoded,
        }));
        if (autoLaunchAr) {
          setShowArModal(true);
        }
        return; // Successfully hydrated without any network/database dependency!
      }
    }

    // 2. Fallback to server ID fetch if available
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
  }, [initialConfigId, autoLaunchAr, defaultPreset.defaultConfig]);

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

            {/* Floating 3D Dimension Callouts Overlay */}
            {showDimensions && dimensionCallouts.length > 0 && (
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden', zIndex: 6 }}>
                {dimensionCallouts.map(callout => (
                  <div
                    key={callout.id}
                    style={{
                      position: 'absolute',
                      left: `${callout.screenMid.x}px`,
                      top: `${callout.screenMid.y}px`,
                      transform: 'translate(-50%, -50%)',
                      background: 'rgba(30, 33, 29, 0.90)',
                      color: '#f5f4ee',
                      padding: '3px 8px',
                      borderRadius: '2px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10.5px',
                      letterSpacing: '0.04em',
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 6px rgba(0, 0, 0, 0.25)',
                    }}
                  >
                    {callout.label}
                  </div>
                ))}
              </div>
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

                {/* Standard Slab Thickness (12mm Standard - Non-customizable) */}
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                    Solid Body Thickness
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 14px', background: '#f8f7f4', border: '1px solid rgba(30,33,29,0.12)', borderRadius: '2px' }}>
                    <div>
                      <div style={{ fontSize: '14px', fontWeight: 600, fontFamily: 'DM Mono, monospace', color: '#1e211d' }}>
                        12 mm
                      </div>
                      <div style={{ fontSize: '11px', color: '#666', marginTop: '2px' }}>
                        Standard architectural calibrated solid surface for all sinks &amp; countertops
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', background: '#1e211d', color: '#fff', padding: '3px 8px', borderRadius: '2px', letterSpacing: '0.04em' }}>
                      STANDARD FIXED
                    </span>
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
                              updates.basinModelId = 'oval-5';
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

                {/* 3. SINK MODEL SELECTION (Store inventory + Customizable troughs) */}
                {config.sinkIntegration !== 'none' && (() => {
                  const currentBasin = AVAILABLE_BASINS.find(b => b.id === config.basinModelId) ||
                    AVAILABLE_BASINS.find(b => b.code.toLowerCase() === (config.basinModelId || '').toLowerCase()) ||
                    AVAILABLE_BASINS[0];
                  const isCustom = Boolean(currentBasin?.isCustomizable);

                  const selectModel = (item: typeof AVAILABLE_BASINS[number]) => {
                    const updates: Partial<ProductConfiguration> = {
                      basinModelId: item.id,
                    };
                    if (config.sinkIntegration === 'none') {
                      updates.sinkIntegration = 'integrated';
                    }
                    if (!item.isCustomizable) {
                      // Store model dimensions are fixed and cannot be customized
                      updates.basinWidthMm = item.width;
                      updates.basinDepthMm = item.depth;
                      updates.basinHeightMm = item.height;
                      updates.basinSizeCode = item.code;
                    } else {
                      updates.basinWidthMm = config.basinWidthMm || item.width;
                      updates.basinDepthMm = config.basinDepthMm || item.depth;
                      updates.basinHeightMm = config.basinHeightMm || item.height;
                      updates.basinSizeCode = item.code;
                    }
                    setConfig({ ...config, ...updates });
                  };

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                          <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                            SINK MODEL SELECTION
                          </label>
                          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888' }}>
                            12 Store Models • 3 Customizable
                          </span>
                        </div>

                        {/* STORE MODELS: Oval & Capsule */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            Store Inventory — Oval &amp; Capsule
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                            {AVAILABLE_BASINS.filter(b => b.category === 'oval').map(item => {
                              const isAct = config.basinModelId === item.id || config.basinModelId === item.code;
                              return (
                                <div
                                  key={item.id}
                                  title={`${item.name} (${item.width} × ${item.depth} × ${item.height} mm)`}
                                  onClick={() => selectModel(item)}
                                  style={{
                                    padding: '8px 4px 6px',
                                    border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    background: isAct ? '#ffffff' : '#fcfbfa',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '3px',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <SinkModelDiagram model={item.code} active={isAct} />
                                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 700 : 500, color: isAct ? 'var(--brand-red, #d43833)' : '#222' }}>
                                    {item.code}
                                  </span>
                                  <span style={{ fontSize: '8px', fontFamily: 'DM Mono, monospace', color: '#777' }}>
                                    {item.width}×{item.depth}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* STORE MODELS: Circular */}
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            Store Inventory — Circular
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
                            {AVAILABLE_BASINS.filter(b => b.category === 'circular').map(item => {
                              const isAct = config.basinModelId === item.id || config.basinModelId === item.code;
                              return (
                                <div
                                  key={item.id}
                                  title={`${item.name} (${item.width} × ${item.depth} × ${item.height} mm)`}
                                  onClick={() => selectModel(item)}
                                  style={{
                                    padding: '8px 6px 6px',
                                    border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    background: isAct ? '#ffffff' : '#fcfbfa',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '3px',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <SinkModelDiagram model={item.code} active={isAct} />
                                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 700 : 500, color: isAct ? 'var(--brand-red, #d43833)' : '#222' }}>
                                    {item.code}
                                  </span>
                                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#777' }}>
                                    Ø {item.width} × {item.height} mm
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* STORE MODELS: Square & Rectangular */}
                        <div style={{ marginBottom: '14px' }}>
                          <div style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                            Store Inventory — Square &amp; Rectangular
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                            {AVAILABLE_BASINS.filter(b => b.category === 'square').map(item => {
                              const isAct = config.basinModelId === item.id || config.basinModelId === item.code;
                              return (
                                <div
                                  key={item.id}
                                  title={`${item.name} (${item.width} × ${item.depth} × ${item.height} mm)`}
                                  onClick={() => selectModel(item)}
                                  style={{
                                    padding: '8px 4px 6px',
                                    border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                    background: isAct ? '#ffffff' : '#fcfbfa',
                                    borderRadius: '2px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '3px',
                                    transition: 'all 0.15s ease',
                                  }}
                                >
                                  <SinkModelDiagram model={item.code} active={isAct} />
                                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 700 : 500, color: isAct ? 'var(--brand-red, #d43833)' : '#222' }}>
                                    {item.code}
                                  </span>
                                  <span style={{ fontSize: '8px', fontFamily: 'DM Mono, monospace', color: '#777' }}>
                                    {item.width}×{item.depth}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* CUSTOMIZABLE TROUGHS: WDT, UC, UB */}
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--brand-red, #d43833)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                              Customizable Architectural Troughs (Custom H, W, D)
                            </span>
                            <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', background: 'rgba(212,56,51,0.08)', color: 'var(--brand-red, #d43833)', padding: '1px 5px', borderRadius: '2px' }}>
                              Parametric
                            </span>
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {AVAILABLE_BASINS.filter(b => b.category === 'custom').map(item => {
                              const isAct = config.basinModelId === item.id || config.basinModelId === item.code;
                              return (
                                <div
                                  key={item.id}
                                  title={`${item.name} (Customizable)`}
                                  onClick={() => selectModel(item)}
                                  style={{
                                    padding: '10px 6px 8px',
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
                                  <SinkModelDiagram model={item.code} active={isAct} />
                                  <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', fontWeight: isAct ? 700 : 600, color: isAct ? 'var(--brand-red, #d43833)' : '#222' }}>
                                    {item.code}
                                  </span>
                                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: isAct ? 'var(--brand-red, #d43833)' : '#666' }}>
                                    Custom W / D / H
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 4. SINK SPECIFICATION / SIZE DISPLAY */}
                      {/* CASE 1: FIXED STORE MODEL (Depth & Size CANNOT be customized) */}
                      {!isCustom && (
                        <div style={{ background: '#f8f7f4', border: '1px solid rgba(30,33,29,0.12)', padding: '14px 16px', borderRadius: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                              STORE MODEL SPECIFICATIONS ({currentBasin.name})
                            </span>
                            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', background: '#1e211d', color: '#fff', padding: '2px 8px', borderRadius: '2px', letterSpacing: '0.04em' }}>
                              FIXED STORE MODEL
                            </span>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '10px' }}>
                            <div style={{ background: '#ffffff', border: '1px solid #e0ded7', padding: '10px 8px', textAlign: 'center' }}>
                              <div style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#777', textTransform: 'uppercase' }}>WIDTH</div>
                              <div style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#1e211d', marginTop: '2px' }}>
                                {currentBasin.width} mm
                              </div>
                            </div>
                            <div style={{ background: '#ffffff', border: '1px solid #e0ded7', padding: '10px 8px', textAlign: 'center' }}>
                              <div style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#777', textTransform: 'uppercase' }}>DEPTH (F-B)</div>
                              <div style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#1e211d', marginTop: '2px' }}>
                                {currentBasin.depth} mm
                              </div>
                            </div>
                            <div style={{ background: '#ffffff', border: '1px solid #e0ded7', padding: '10px 8px', textAlign: 'center' }}>
                              <div style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#777', textTransform: 'uppercase' }}>BOWL DEPTH (H)</div>
                              <div style={{ fontSize: '15px', fontFamily: 'DM Mono, monospace', fontWeight: 700, color: '#1e211d', marginTop: '2px' }}>
                                {currentBasin.height} mm
                              </div>
                            </div>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid #e8e5dc', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: '#555' }}>
                            <span>Thickness: 12mm Standard</span>
                            <span style={{ color: '#888' }}>Pre-molded Store Inventory</span>
                          </div>
                          <div style={{ marginTop: '6px', fontSize: '11px', color: '#888', fontStyle: 'italic', lineHeight: 1.4 }}>
                            * Depth and dimensions are fixed factory standards for this model and cannot be customized.
                          </div>
                        </div>
                      )}

                      {/* CASE 2: CUSTOMIZABLE SINK MODELS (WDT, UC, UB) */}
                      {isCustom && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', background: '#faf9f6', padding: '14px', border: '1px solid rgba(212,56,51,0.2)', borderRadius: '2px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                              CUSTOM DIMENSION CONTROLS ({currentBasin.code})
                            </span>
                            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', background: 'var(--brand-red, #d43833)', color: '#fff', padding: '2px 8px', borderRadius: '2px' }}>
                              CUSTOMIZABLE H / W / D
                            </span>
                          </div>

                          {/* WIDTH (SPAN) CUSTOMIZATION */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                                SINK WIDTH (SPAN)
                              </label>
                              <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                                {config.basinWidthMm || currentBasin.width} mm
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                              {[500, 600, 700, 800, 900].map(w => {
                                const isAct = (config.basinWidthMm || currentBasin.width) === w;
                                return (
                                  <button
                                    key={w}
                                    type="button"
                                    onClick={() => setConfig({ ...config, basinWidthMm: w })}
                                    style={{
                                      padding: '8px 4px',
                                      background: isAct ? 'var(--brand-red, #d43833)' : '#ffffff',
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

                          {/* DEPTH (FRONT-TO-BACK) CUSTOMIZATION */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                                SINK DEPTH (FRONT-TO-BACK)
                              </label>
                              <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                                {config.basinDepthMm || currentBasin.depth} mm
                              </span>
                            </div>
                            {currentBasin.id === 'wdt' ? (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                                {WDT_DEPTH_OPTIONS.slice(0, 5).map(opt => {
                                  const isAct = (config.basinDepthMm || 260) === opt.depth;
                                  return (
                                    <button
                                      key={opt.code}
                                      type="button"
                                      onClick={() => setConfig({ ...config, basinDepthMm: opt.depth, basinSizeCode: opt.code })}
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
                                      }}
                                    >
                                      {opt.depth} mm
                                    </button>
                                  );
                                })}
                              </div>
                            ) : (
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                                {[260, 300, 350, 400, 450].map(d => {
                                  const isAct = (config.basinDepthMm || currentBasin.depth) === d;
                                  return (
                                    <button
                                      key={d}
                                      type="button"
                                      onClick={() => setConfig({ ...config, basinDepthMm: d })}
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
                                      }}
                                    >
                                      {d} mm
                                    </button>
                                  );
                                })}
                              </div>
                            )}
                          </div>

                          {/* BOWL DEPTH / HEIGHT (H) CUSTOMIZATION */}
                          <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                              <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                                BOWL INTERNAL DEPTH / FALL HEIGHT (H)
                              </label>
                              <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', color: 'var(--brand-red, #d43833)', fontWeight: 600 }}>
                                {config.basinHeightMm || currentBasin.height} mm
                              </span>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '6px' }}>
                              {[100, 120, 140, 160, 180].map(h => {
                                const isAct = (config.basinHeightMm || currentBasin.height) === h;
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
                                    }}
                                  >
                                    {h} mm
                                  </button>
                                );
                              })}
                            </div>
                          </div>

                          {/* WDT SPECIFIC: SLOPE ORIENTATION & INCLINE ANGLE */}
                          {currentBasin.id === 'wdt' && (
                            <>
                              <div style={{ marginTop: '4px' }}>
                                <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268', marginBottom: '8px' }}>
                                  WDT TROUGH SLOPE ORIENTATION
                                </label>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                                  <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, wdtSlopeDirection: 'right-to-left' })}
                                    style={{
                                      padding: '8px 6px',
                                      background: (config.wdtSlopeDirection || 'right-to-left') === 'right-to-left' ? '#1e211d' : '#f8f7f4',
                                      color: (config.wdtSlopeDirection || 'right-to-left') === 'right-to-left' ? '#fff' : '#1e211d',
                                      border: '1px solid rgba(30,33,29,0.15)',
                                      fontSize: '11px',
                                      fontFamily: 'DM Mono, monospace',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Slopes Right ↘ Left (Deep Left)
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setConfig({ ...config, wdtSlopeDirection: 'left-to-right' })}
                                    style={{
                                      padding: '8px 6px',
                                      background: config.wdtSlopeDirection === 'left-to-right' ? '#1e211d' : '#f8f7f4',
                                      color: config.wdtSlopeDirection === 'left-to-right' ? '#fff' : '#1e211d',
                                      border: '1px solid rgba(30,33,29,0.15)',
                                      fontSize: '11px',
                                      fontFamily: 'DM Mono, monospace',
                                      cursor: 'pointer',
                                    }}
                                  >
                                    Slopes Left ↙ Right (Deep Right)
                                  </button>
                                </div>
                              </div>

                              <div style={{ background: '#fff', padding: '12px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                  <label style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.06em', color: '#687268' }}>
                                    WDT SLOPE INCLINE ANGLE
                                  </label>
                                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 600, color: 'var(--brand-red, #d43833)' }}>
                                    {(config.wdtSlopeAngleDeg || 8).toFixed(1)}° ({Math.round((config.basinWidthMm || 600) * Math.tan(((config.wdtSlopeAngleDeg || 8) * Math.PI) / 180))} mm fall)
                                  </span>
                                </div>

                                <input
                                  type="range"
                                  min={2}
                                  max={20}
                                  step={0.5}
                                  value={config.wdtSlopeAngleDeg || 8}
                                  onChange={e => setConfig({ ...config, wdtSlopeAngleDeg: Number(e.target.value) })}
                                  style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)', marginBottom: '8px' }}
                                />

                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                                  {[
                                    { deg: 4, label: '4° Subtle' },
                                    { deg: 8, label: '8° Standard' },
                                    { deg: 12, label: '12° Fast' },
                                    { deg: 16, label: '16° Steep' },
                                  ].map(p => {
                                    const isCur = Math.abs((config.wdtSlopeAngleDeg || 8) - p.deg) < 0.3;
                                    return (
                                      <button
                                        key={p.deg}
                                        type="button"
                                        onClick={() => setConfig({ ...config, wdtSlopeAngleDeg: p.deg })}
                                        style={{
                                          padding: '6px 2px',
                                          background: isCur ? 'var(--brand-red, #d43833)' : '#f8f7f4',
                                          color: isCur ? '#ffffff' : '#333333',
                                          border: isCur ? '1px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                                          fontSize: '10px',
                                          fontFamily: 'DM Mono, monospace',
                                          cursor: 'pointer',
                                        }}
                                      >
                                        {p.label}
                                      </button>
                                    );
                                  })}
                                </div>
                              </div>
                            </>
                          )}

                          <div style={{ fontSize: '11px', color: '#687268', fontFamily: 'DM Mono, monospace', paddingTop: '4px' }}>
                            Standard 12mm solid surface thickness applied to all trough facets.
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })()}


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
                          const targetH = opt.id === 'none' ? 0 : opt.id === 'standard' ? 80 : ((cur.height && cur.height > 80) ? cur.height : 150);
                          setConfig({
                            ...config,
                            rearUpstandHeight: targetH,
                            upstands: {
                              ...cur,
                              backMode: opt.id as any,
                              type: opt.id === 'standard' ? 'standard' : opt.id === 'none' ? 'none' : 'full',
                              height: targetH,
                              heightMm: targetH,
                              backLengthMm: opt.id === 'none' ? 0 : config.width,
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
                        const nextMode = cur.leftMode === 'full' ? 'none' : 'full';
                        const isEnabled = nextMode === 'full';
                        setConfig({
                          ...config,
                          hasLeftUpstand: isEnabled,
                          upstands: {
                            ...cur,
                            leftMode: nextMode,
                            leftLengthMm: isEnabled ? config.depth : 0,
                          },
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
                        const nextMode = cur.rightMode === 'full' ? 'none' : 'full';
                        const isEnabled = nextMode === 'full';
                        setConfig({
                          ...config,
                          hasRightUpstand: isEnabled,
                          upstands: {
                            ...cur,
                            rightMode: nextMode,
                            rightLengthMm: isEnabled ? config.depth : 0,
                          },
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
                    <strong>{config.upstands?.backMode === 'none' ? '0 mm (Disabled)' : `${config.upstands?.height || config.upstands?.heightMm || config.rearUpstandHeight || 80} mm`}</strong>
                  </div>
                  <input
                    type="range"
                    min={50}
                    max={300}
                    step={10}
                    value={config.upstands?.height || config.upstands?.heightMm || config.rearUpstandHeight || 80}
                    onChange={e => {
                      const val = Number(e.target.value);
                      const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, heightMm: 100, coved: true, isCoved: true, type: 'standard', backLengthMm: config.width, leftLengthMm: 0, rightLengthMm: 0 };
                      const newBackMode = val === 80 ? 'standard' : 'full';
                      setConfig({
                        ...config,
                        rearUpstandHeight: val,
                        upstands: {
                          ...cur,
                          backMode: cur.backMode === 'none' ? 'full' : newBackMode,
                          type: val === 80 ? 'standard' : 'custom',
                          height: val,
                          heightMm: val,
                          backLengthMm: config.width,
                        },
                      });
                    }}
                    style={{ width: '100%', accentColor: 'var(--brand-red, #d43833)' }}
                  />
                </div>

                {/* COVED FUSION TOGGLE */}
                <div
                  onClick={() => {
                    const cur = config.upstands || { backMode: 'full', leftMode: 'none', rightMode: 'none', height: 100, heightMm: 100, coved: true, isCoved: true, type: 'standard', backLengthMm: config.width, leftLengthMm: 0, rightLengthMm: 0 };
                    const nextCoved = !Boolean(cur.coved ?? cur.isCoved ?? config.isCovedUpstand);
                    setConfig({
                      ...config,
                      isCovedUpstand: nextCoved,
                      upstands: {
                        ...cur,
                        coved: nextCoved,
                        isCoved: nextCoved,
                      },
                    });
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
                <p style={{ margin: 0, fontSize: '11px', color: '#687268', lineHeight: 1.5 }}>
                  Select from 25 authentic DuPont™ Corian® mineral formulations. Each through-body tone wraps seamlessly across all 3D architectural planes.
                </p>

                {/* Active Material Architectural Specimen Hero */}
                {(() => {
                  const activeMat = CONFIGURATOR_MATERIALS.find(m => m.slug === config.materialSlug) || CONFIGURATOR_MATERIALS[1];
                  const cleanSlug = (config.materialSlug || 'corian-glacier-white').replace(/^corian-/, '').toLowerCase().trim();
                  const swatchSrc = activeMat?.swatchImage || `/materials/swatches/${cleanSlug}.jpg`;

                  return (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '14px',
                        padding: '12px 14px',
                        background: '#faf9f5',
                        border: '1px solid rgba(30,33,29,0.18)',
                        borderRadius: '4px',
                        position: 'relative',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                      }}
                    >
                      {/* Specimen Texture Tile */}
                      <div
                        style={{
                          width: '52px',
                          height: '52px',
                          borderRadius: '4px',
                          backgroundColor: config.materialHex,
                          backgroundImage: `url(${swatchSrc})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          border: '1px solid rgba(30,33,29,0.22)',
                          boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.4), 0 2px 6px rgba(0,0,0,0.12)',
                          flexShrink: 0,
                          position: 'relative',
                        }}
                      >
                        <span
                          style={{
                            position: 'absolute',
                            bottom: '2px',
                            right: '3px',
                            fontSize: '8px',
                            fontFamily: 'DM Mono, monospace',
                            fontWeight: 600,
                            background: 'rgba(30,33,29,0.85)',
                            color: '#ffffff',
                            padding: '1px 3px',
                            borderRadius: '2px',
                            letterSpacing: '0.04em',
                          }}
                        >
                          {activeMat?.code || 'CORIAN'}
                        </span>
                      </div>

                      {/* Specimen Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px', flexWrap: 'wrap' }}>
                          <span
                            style={{
                              fontSize: '8.5px',
                              fontFamily: 'DM Mono, monospace',
                              textTransform: 'uppercase',
                              letterSpacing: '0.06em',
                              padding: '2px 5px',
                              borderRadius: '2px',
                              background: 'rgba(212,56,51,0.08)',
                              color: 'var(--brand-red, #d43833)',
                              fontWeight: 600,
                            }}
                          >
                            {activeMat?.collection?.toUpperCase() || 'SOLID SERIES'}
                          </span>
                          <span
                            style={{
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                              fontSize: '9px',
                              fontFamily: 'DM Mono, monospace',
                              color: '#497349',
                            }}
                          >
                            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#497349', display: 'inline-block' }} />
                            Live on 3D Model
                          </span>
                        </div>

                        <strong
                          style={{
                            fontSize: '14px',
                            fontFamily: 'Manrope, sans-serif',
                            fontWeight: 700,
                            color: 'var(--ink, #1e211d)',
                            display: 'block',
                            letterSpacing: '-0.02em',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {config.materialName}
                        </strong>

                        <div style={{ fontSize: '10.5px', fontFamily: 'DM Mono, monospace', color: '#687268', marginTop: '2px' }}>
                          DuPont™ Corian® • {(config.materialFinish || activeMat?.finish || 'Honed Satin Matte').toUpperCase()}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Filter Tabs & Search Bar */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {/* Category Pills */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: 'All', count: CONFIGURATOR_MATERIALS.length },
                      { id: 'white', label: 'Whites', count: CONFIGURATOR_MATERIALS.filter(m => m.category === 'white').length },
                      { id: 'cream', label: 'Creams', count: CONFIGURATOR_MATERIALS.filter(m => m.category === 'cream').length },
                      { id: 'grey', label: 'Greys', count: CONFIGURATOR_MATERIALS.filter(m => m.category === 'grey').length },
                      { id: 'black', label: 'Noir & Dark', count: CONFIGURATOR_MATERIALS.filter(m => m.category === 'black').length },
                    ].map(tab => {
                      const isActive = materialFilter === tab.id;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={() => setMaterialFilter(tab.id as any)}
                          style={{
                            padding: '6px 10px',
                            background: isActive ? 'var(--ink, #1e211d)' : '#faf9f5',
                            color: isActive ? '#ffffff' : 'var(--ink, #1e211d)',
                            border: isActive ? '1px solid var(--ink, #1e211d)' : '1px solid rgba(30,33,29,0.16)',
                            fontSize: '10px',
                            fontFamily: 'DM Mono, monospace',
                            textTransform: 'uppercase',
                            letterSpacing: '0.04em',
                            borderRadius: '3px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '5px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <span>{tab.label}</span>
                          <span
                            style={{
                              fontSize: '8.5px',
                              opacity: isActive ? 0.75 : 0.55,
                            }}
                          >
                            ({tab.count})
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Search Input */}
                  <div style={{ position: 'relative', width: '100%' }}>
                    <input
                      type="text"
                      value={materialSearch}
                      onChange={e => setMaterialSearch(e.target.value)}
                      placeholder="Search by name, series, or code (e.g. Terrazzo, Carrara, GW)..."
                      style={{
                        width: '100%',
                        padding: '7px 28px 7px 10px',
                        background: '#ffffff',
                        border: '1px solid rgba(30,33,29,0.16)',
                        borderRadius: '3px',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '11px',
                        color: 'var(--ink, #1e211d)',
                        outline: 'none',
                        transition: 'border-color 0.15s ease',
                      }}
                      onFocus={e => e.currentTarget.style.borderColor = 'var(--ink, #1e211d)'}
                      onBlur={e => e.currentTarget.style.borderColor = 'rgba(30,33,29,0.16)'}
                    />
                    {materialSearch && (
                      <button
                        type="button"
                        onClick={() => setMaterialSearch('')}
                        style={{
                          position: 'absolute',
                          right: '8px',
                          top: '50%',
                          transform: 'translateY(-50%)',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#888',
                          fontSize: '12px',
                          padding: '2px',
                        }}
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Swatches Grid */}
                {(() => {
                  const filtered = CONFIGURATOR_MATERIALS.filter(m => {
                    const matchesCategory = materialFilter === 'all' || m.category === materialFilter;
                    const query = materialSearch.trim().toLowerCase();
                    const matchesSearch = !query ||
                      m.name.toLowerCase().includes(query) ||
                      (m.code && m.code.toLowerCase().includes(query)) ||
                      (m.collection && m.collection.toLowerCase().includes(query)) ||
                      (m.finish && m.finish.toLowerCase().includes(query));
                    return matchesCategory && matchesSearch;
                  });

                  if (filtered.length === 0) {
                    return (
                      <div
                        style={{
                          padding: '24px 16px',
                          textAlign: 'center',
                          background: '#faf9f5',
                          border: '1px dashed rgba(30,33,29,0.2)',
                          borderRadius: '4px',
                        }}
                      >
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#687268', marginBottom: '8px' }}>
                          No materials matching &ldquo;{materialSearch}&rdquo;
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setMaterialSearch('');
                            setMaterialFilter('all');
                          }}
                          style={{
                            padding: '6px 12px',
                            background: 'var(--ink, #1e211d)',
                            color: '#ffffff',
                            border: 'none',
                            borderRadius: '2px',
                            fontSize: '10px',
                            fontFamily: 'DM Mono, monospace',
                            textTransform: 'uppercase',
                            cursor: 'pointer',
                          }}
                        >
                          Reset Filters
                        </button>
                      </div>
                    );
                  }

                  return (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                      {filtered.map(mat => {
                        const isSelected = config.materialSlug === mat.slug;
                        return (
                          <div
                            key={mat.id || mat.slug}
                            role="button"
                            tabIndex={0}
                            onClick={() => {
                              setConfig({
                                ...config,
                                materialSlug: mat.slug,
                                materialName: mat.name,
                                materialHex: mat.hexColor,
                                materialFinish: mat.finish,
                              });
                            }}
                            onKeyDown={e => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                setConfig({
                                  ...config,
                                  materialSlug: mat.slug,
                                  materialName: mat.name,
                                  materialHex: mat.hexColor,
                                  materialFinish: mat.finish,
                                });
                              }
                            }}
                            title={`${mat.name} (${mat.code}) • ${mat.collection} • ${mat.finish}`}
                            style={{
                              display: 'flex',
                              flexDirection: 'column',
                              padding: '6px',
                              border: isSelected ? '2px solid var(--brand-red, #d43833)' : '1px solid rgba(30,33,29,0.14)',
                              borderRadius: '4px',
                              background: isSelected ? '#ffffff' : '#faf9f5',
                              cursor: 'pointer',
                              position: 'relative',
                              transition: 'all 0.15s ease',
                              boxShadow: isSelected
                                ? '0 0 0 1px var(--brand-red, #d43833), 0 3px 10px rgba(212,56,51,0.14)'
                                : '0 1px 3px rgba(0,0,0,0.02)',
                              outline: 'none',
                              userSelect: 'none',
                            }}
                            onMouseEnter={e => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = 'rgba(30,33,29,0.36)';
                                e.currentTarget.style.background = '#ffffff';
                                e.currentTarget.style.transform = 'translateY(-1px)';
                              }
                            }}
                            onMouseLeave={e => {
                              if (!isSelected) {
                                e.currentTarget.style.borderColor = 'rgba(30,33,29,0.14)';
                                e.currentTarget.style.background = '#faf9f5';
                                e.currentTarget.style.transform = 'none';
                              }
                            }}
                          >
                            {/* Swatch Specimen Image */}
                            <div
                              style={{
                                width: '100%',
                                aspectRatio: '1 / 1',
                                borderRadius: '3px',
                                backgroundColor: mat.hexColor,
                                backgroundImage: mat.swatchImage ? `url(${mat.swatchImage})` : undefined,
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                border: '1px solid rgba(0,0,0,0.06)',
                                boxShadow: 'inset 0 0 0 1px rgba(0,0,0,0.05)',
                                marginBottom: '6px',
                                position: 'relative',
                                overflow: 'hidden',
                              }}
                            >
                              {/* Specimen Code Pill (Top-Left) */}
                              <span
                                style={{
                                  position: 'absolute',
                                  top: '4px',
                                  left: '4px',
                                  fontFamily: 'DM Mono, monospace',
                                  fontSize: '7.5px',
                                  fontWeight: 600,
                                  background: 'rgba(255,255,255,0.92)',
                                  color: '#1e211d',
                                  padding: '1.5px 4px',
                                  borderRadius: '2px',
                                  letterSpacing: '0.04em',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                                  pointerEvents: 'none',
                                }}
                              >
                                {mat.code}
                              </span>

                              {/* Selected Checkmark Badge (Top-Right) */}
                              {isSelected && (
                                <div
                                  style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    width: '16px',
                                    height: '16px',
                                    borderRadius: '50%',
                                    background: 'var(--brand-red, #d43833)',
                                    color: '#ffffff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '9px',
                                    fontWeight: 'bold',
                                    boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                                    pointerEvents: 'none',
                                  }}
                                >
                                  ✓
                                </div>
                              )}
                            </div>

                            {/* Swatch Title in Clean Manrope Typography */}
                            <div style={{ textAlign: 'left', width: '100%' }}>
                              <div
                                style={{
                                  fontFamily: 'Manrope, sans-serif',
                                  fontSize: '11px',
                                  fontWeight: isSelected ? 700 : 600,
                                  color: isSelected ? 'var(--brand-red, #d43833)' : 'var(--ink, #1e211d)',
                                  letterSpacing: '-0.01em',
                                  lineHeight: 1.25,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {mat.name}
                              </div>

                              {/* Collection / Series Monospace Subtitle */}
                              <div
                                style={{
                                  fontFamily: 'DM Mono, monospace',
                                  fontSize: '8px',
                                  color: '#8b948b',
                                  marginTop: '2px',
                                  letterSpacing: '0.03em',
                                  textTransform: 'uppercase',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {mat.collection || mat.finish}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
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
