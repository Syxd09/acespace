'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  BasinConfiguration,
  DEFAULT_BASIN_CONFIG,
  STANDALONE_BASIN_MODELS,
  CONFIGURATOR_MATERIALS,
  DRAIN_OPTIONS,
  calculateBasinIndicativePrice,
  BasinPriceBreakdown,
  BasinModel,
} from '@/data/basinConfiguratorData';
import { Basin3DEngine, ScaleFigureScreenPos } from '@/lib/configurator/basinWebglEngine';
import { DimensionCallout, CadDimensionData } from '@/lib/configurator/webglEngine';
import { SinkModelDiagram, DrainTypeThumbnail } from './TechnicalDiagrams';
import { BasinArViewerModal } from './BasinArViewerModal';
import { ArchitecturalHumanScaleFigure } from './ArchitecturalHumanScaleFigure';

interface BasinConfiguratorProps {
  initialModelId?: string;
  initialMaterialSlug?: string;
  initialDrainId?: string;
  autoLaunchAr?: boolean;
}

export default function BasinConfigurator({
  initialModelId = 'oval-5',
  initialMaterialSlug,
  initialDrainId,
  autoLaunchAr = false,
}: BasinConfiguratorProps) {
  // Initialize state from model
  const defaultModel = STANDALONE_BASIN_MODELS.find(m => m.id === initialModelId) || STANDALONE_BASIN_MODELS[0];

  const [config, setConfig] = useState<BasinConfiguration>(() => {
    const base: BasinConfiguration = {
      ...DEFAULT_BASIN_CONFIG,
      modelId: defaultModel.id,
      modelName: defaultModel.name,
      modelCode: defaultModel.code,
      shape: (defaultModel.shape === 'rectangular' || defaultModel.shape === 'round' || defaultModel.shape === 'capsule') ? defaultModel.shape : 'oval',
      width: defaultModel.width,
      depth: defaultModel.depth,
      height: defaultModel.height,
      covedRadius: defaultModel.covedRadius || 12,
    };

    if (initialMaterialSlug) {
      const mat = CONFIGURATOR_MATERIALS.find(m => m.slug === initialMaterialSlug);
      if (mat) {
        base.materialSlug = mat.slug;
        base.materialName = mat.name;
        base.materialHex = mat.hexColor;
        base.materialFinish = mat.finish;
      }
    }

    if (initialDrainId) {
      const drn = DRAIN_OPTIONS.find(d => d.id === initialDrainId);
      if (drn) {
        base.drainTypeId = drn.id;
        base.drainName = drn.name;
      }
    }

    return base;
  });

  const [pricing, setPricing] = useState<BasinPriceBreakdown>(() => calculateBasinIndicativePrice(config));

  // Accordion Sections (only one open at a time)
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    '01': true,  // SINK SIZE / MODEL
    '02': false, // MATERIAL & COLOUR
    '03': false, // DRAIN TYPE
    '04': false, // PRODUCT NOTES
  });

  // Category filter inside Model section (all, oval, circular, square)
  const [modelCategoryTab, setModelCategoryTab] = useState<'all' | 'oval' | 'circular' | 'square'>('all');

  // Material filters
  const [materialFilter, setMaterialFilter] = useState<'all' | 'white' | 'cream' | 'grey' | 'dark' | 'translucent'>('all');
  const [materialSearch, setMaterialSearch] = useState('');

  // 3D Canvas References & Viewport controls
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<Basin3DEngine | null>(null);
  const [dimensionCallouts, setDimensionCallouts] = useState<DimensionCallout[]>([]);
  const [cadDimensions, setCadDimensions] = useState<CadDimensionData | null>(null);
  const [scaleFigurePos, setScaleFigurePos] = useState<ScaleFigureScreenPos | null>(null);
  const [activeView, setActiveView] = useState<'isometric' | 'front' | 'top' | 'side' | 'bottom'>('isometric');
  const [showDimensions, setShowDimensions] = useState(true);
  const [isWireframe, setIsWireframe] = useState(false);
  const [isTurntable, setIsTurntable] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showScaleFigure, setShowScaleFigure] = useState(true);
  const workspaceContainerRef = useRef<HTMLDivElement | null>(null);

  // Modals
  const [showQuoteModal, setShowQuoteModal] = useState(false);
  const [showArModal, setShowArModal] = useState(autoLaunchAr);
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

  // Toast feedback
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3800);
  };

  // Dimension Callback
  const handleDimensionsUpdate = useCallback((callouts: DimensionCallout[], cad?: CadDimensionData) => {
    setDimensionCallouts(callouts);
    if (cad) setCadDimensions(cad);
  }, []);

  // Scale Figure Callback
  const handleScaleFigureUpdate = useCallback((pos: ScaleFigureScreenPos | null) => {
    setScaleFigurePos(pos);
  }, []);

  // Initialize 3D WebGL Engine
  useEffect(() => {
    if (!canvasRef.current) return;
    const engine = new Basin3DEngine(canvasRef.current, handleDimensionsUpdate, handleScaleFigureUpdate);
    engineRef.current = engine;
    engine.updateConfiguration(config);

    return () => {
      engine.destroy();
      engineRef.current = null;
    };
  }, [handleDimensionsUpdate, handleScaleFigureUpdate]);

  // Sync state updates with 3D engine & pricing
  useEffect(() => {
    if (engineRef.current) {
      engineRef.current.updateConfiguration(config);
    }
    setPricing(calculateBasinIndicativePrice(config));
  }, [config]);

  // Toggle Accordion section
  const toggleSection = (id: string) => {
    setOpenSections(prev => {
      const isCurrentlyOpen = !!prev[id];
      return isCurrentlyOpen ? {} : { [id]: true };
    });
  };

  // Model Selection
  const handleSelectModel = (model: BasinModel) => {
    const shape = (model.shape === 'rectangular' || model.shape === 'round' || model.shape === 'capsule') ? model.shape : 'oval';
    setConfig(prev => ({
      ...prev,
      modelId: model.id,
      modelName: model.name,
      modelCode: model.code,
      shape,
      width: model.width,
      depth: model.depth,
      height: model.height,
      covedRadius: model.covedRadius || 12,
    }));
    showToast(`Selected Model: ${model.name} (${model.width} × ${model.depth} × ${model.height} mm)`);
  };

  // Viewpoint controls
  const handleSetView = (view: 'isometric' | 'front' | 'top' | 'side' | 'bottom') => {
    setActiveView(view);
    if (engineRef.current) {
      engineRef.current.setViewpoint(view);
    }
  };

  const handleResetCamera = () => {
    setActiveView('isometric');
    if (engineRef.current) {
      engineRef.current.resetCamera();
    }
    showToast('Reset camera view');
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

  const handleCaptureSnapshot = () => {
    if (!engineRef.current) return;
    const dataUrl = engineRef.current.getCanvasDataURL();
    const link = document.createElement('a');
    link.download = `AceSpaces_CountertopBasin_${config.modelCode}_${config.width}x${config.depth}.png`;
    link.href = dataUrl;
    link.click();
    showToast('✓ 3D architectural basin snapshot downloaded.');
  };

  const handleSaveJson = () => {
    const payload = {
      productType: 'Countertop Basin',
      reference: `ACE-BASIN-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: new Date().toISOString(),
      configuration: config,
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

  // Submit quote request
  const handleQuoteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmittingQuote(true);
    setQuoteError(null);

    try {
      const res = await fetch('/api/configurator/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            title: `Countertop Basin ${config.modelName}`,
            presetId: 'countertop-basin',
            width: config.width,
            depth: config.depth,
            thickness: 12,
            basinModelId: config.modelId,
            materialSlug: config.materialSlug,
            materialName: config.materialName,
            materialHex: config.materialHex,
            materialFinish: config.materialFinish,
            drainTypeId: config.drainTypeId,
            quantity: config.quantity,
          },
          customerName,
          email,
          phone,
          studio,
          city,
          projectNotes: `${projectNotes} [Basin Model: ${config.modelName} ${config.width}x${config.depth}x${config.height}mm, Drain: ${config.drainName}]`,
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

  // Filtered models
  const filteredModels = STANDALONE_BASIN_MODELS.filter(m => {
    if (modelCategoryTab === 'all') return true;
    return m.category === modelCategoryTab;
  });

  // Filtered materials
  const filteredMaterials = CONFIGURATOR_MATERIALS.filter(m => {
    if (materialFilter !== 'all' && m.colorFamily !== materialFilter) return false;
    if (materialSearch.trim() && !m.name.toLowerCase().includes(materialSearch.toLowerCase()) && !m.collection.toLowerCase().includes(materialSearch.toLowerCase())) {
      return false;
    }
    return true;
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
        {/* LEFT PANEL: 3D BASIN WORKSPACE                             */}
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
          {/* Top Viewport Header Bar */}
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
            {/* 3D Studio Badge */}
            <div
              className="configurator-model-badge"
              style={{
                background: 'rgba(255, 255, 255, 0.94)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: '1px solid rgba(30, 33, 29, 0.12)',
                borderRadius: '9999px',
                padding: '4px 12px',
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

            {/* Viewpoint Controls (Matching user reference: Iso / Front / Top / Side / Bottom) */}
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
                { key: 'bottom', label: 'Bottom' },
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

          {/* Canvas Wrapper */}
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

            {/* Architectural Human Scale Reference Silhouette (Scales & zooms with 3D model in 1:1 proportion, hand at left basin rim) */}
            {showScaleFigure && activeView !== 'top' && scaleFigurePos && scaleFigurePos.isVisible && (
              <ArchitecturalHumanScaleFigure
                x={scaleFigurePos.hand.x}
                bottomY={scaleFigurePos.feet.y}
                heightPx={scaleFigurePos.scaleHeightPx}
                opacity={0.30}
                showAnnotations={true}
              />
            )}

            {/* CAD Dimensioning Wireframe Overlay (Length, Width, Height) */}
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
                      strokeWidth={line.isDashed ? '1' : '1.2'}
                      strokeDasharray={line.isDashed ? '3 3' : undefined}
                      strokeOpacity="0.92"
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
                        fontWeight="600"
                        letterSpacing="0.02em"
                      >
                        {line.label}
                      </text>
                    )}
                  </g>
                ))}

                {/* 2. Precision CAD Nodes */}
                {cadDimensions.nodes.map(node => (
                  <g key={node.id}>
                    <circle
                      cx={node.pos.x}
                      cy={node.pos.y}
                      r="2.6"
                      fill="#d43833"
                      stroke="#ffffff"
                      strokeWidth="0.8"
                    />
                  </g>
                ))}
              </svg>
            )}

            {/* Viewport Touch / Mouse Hint */}
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

            {/* Viewport Floating Toolbar */}
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
              {/* Toggle Dimensions */}
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M2 12h20M6 7v10M18 7v10M2 9v6M22 9v6" />
                  <path d="m4 12 2-2m-2 2 2 2m16-2-2-2m2 2-2 2" />
                </svg>
              </button>

              {/* 360 Turntable Auto-Rotate */}
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 12a9 9 0 1 1-2.64-6.36L21 8" />
                  <path d="M21 3v5h-5" />
                  <text x="12" y="14" fontSize="7" fontWeight="bold" fontFamily="DM Mono, monospace" textAnchor="middle" fill="currentColor" stroke="none">360</text>
                </svg>
              </button>

              {/* Wireframe */}
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="m12 2 8.5 4.9v9.8L12 21.5 3.5 16.7V6.9L12 2z" />
                  <path d="m12 11.8 8.5-4.9M12 11.8v9.7M12 11.8 3.5 6.9" />
                </svg>
              </button>

              {/* Snapshot */}
              <button
                type="button"
                onClick={handleCaptureSnapshot}
                title="Capture Snapshot"
                aria-label="Capture Snapshot"
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                  <circle cx="12" cy="13" r="4" />
                </svg>
              </button>

              {/* Scale Reference Figure Toggle */}
              <button
                type="button"
                onClick={() => setShowScaleFigure(prev => !prev)}
                title={showScaleFigure ? 'Hide 1:1 Scale Figure' : 'Show 1:1 Scale Figure'}
                aria-label="Toggle Scale Figure"
                style={{
                  width: '32px',
                  height: '32px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: showScaleFigure ? '#1e211d' : 'transparent',
                  color: showScaleFigure ? '#ffffff' : '#3c423c',
                  border: 'none',
                  borderRadius: '2px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </button>

              {/* Reset Camera View */}
              <button
                type="button"
                onClick={handleResetCamera}
                title="Reset Camera View"
                aria-label="Reset Camera View"
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
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                  <path d="M3 3v5h5" />
                </svg>
              </button>

              {/* Fullscreen */}
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
          {/* Base Model Selector Banner */}
          <div
            style={{
              background: '#f0eee8',
              border: '1px solid var(--line, rgba(30,33,29,0.15))',
              borderLeft: '3px solid var(--brand-red, #d43833)',
              padding: '14px 18px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#737e73', fontWeight: 600 }}>
                Base Model
              </span>
              <button
                type="button"
                onClick={handleResetCamera}
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
                Reset Camera
              </button>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontFamily: 'Manrope, sans-serif', fontSize: '16px', fontWeight: 700, color: '#1e211d' }}>
                  Countertop Basin {config.modelName}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#687268', marginTop: '2px' }}>
                  {config.width} × {config.depth} × {config.height} mm
                </div>
              </div>
              <span
                style={{
                  padding: '4px 8px',
                  background: 'rgba(212,56,51,0.08)',
                  border: '1px solid rgba(212,56,51,0.2)',
                  color: 'var(--brand-red, #d43833)',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                }}
              >
                {config.shape}
              </span>
            </div>
          </div>

          {/* ======================================================= */}
          {/* SECTION 01: SINK SIZE / BASIN MODEL                    */}
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
                  Sink Size &amp; Model
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['01'] ? '▲' : '▼'}</span>
            </button>

            <div className={`accordion-collapse-wrapper ${openSections['01'] ? 'is-open' : ''}`}>
              <div className="accordion-collapse-inner">
                <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {/* Category Filter Tabs */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'All Models (12)' },
                      { key: 'oval', label: 'Oval & Capsule (5)' },
                      { key: 'circular', label: 'Circular (2)' },
                      { key: 'square', label: 'Square & Rect (5)' },
                    ].map(tab => (
                      <button
                        key={tab.key}
                        type="button"
                        onClick={() => setModelCategoryTab(tab.key as any)}
                        style={{
                          padding: '6px 12px',
                          border: modelCategoryTab === tab.key ? '1px solid #1e211d' : '1px solid #e0ded8',
                          background: modelCategoryTab === tab.key ? '#1e211d' : '#f8f7f4',
                          color: modelCategoryTab === tab.key ? '#fff' : '#4a5249',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10.5px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>

                  {/* Model Cards Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '8px' }}>
                    {filteredModels.map(model => {
                      const isAct = config.modelId === model.id;
                      return (
                        <div
                          key={model.id}
                          onClick={() => handleSelectModel(model)}
                          style={{
                            padding: '10px 8px',
                            border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                            background: isAct ? '#ffffff' : '#fcfbfa',
                            borderRadius: '2px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '6px',
                            transition: 'all 0.15s ease',
                            boxShadow: isAct ? '0 4px 12px rgba(212,56,51,0.12)' : 'none',
                          }}
                        >
                          <SinkModelDiagram model={model.code} active={isAct} />
                          <div>
                            <strong style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: isAct ? 'var(--brand-red, #d43833)' : '#1e211d' }}>
                              {model.name}
                            </strong>
                            <span style={{ display: 'block', fontSize: '9.5px', fontFamily: 'DM Mono, monospace', color: '#687268', marginTop: '2px' }}>
                              {model.width} × {model.depth} × {model.height} mm
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Active Model Specification Summary Table */}
                  <div style={{ background: '#f8f7f4', border: '1px solid rgba(30,33,29,0.08)', padding: '14px', borderRadius: '3px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid rgba(30,33,29,0.08)', paddingBottom: '8px' }}>
                      <strong style={{ fontSize: '12px', fontFamily: 'Manrope, sans-serif', color: '#1e211d' }}>
                        {config.modelName} Dimensions &amp; Geometry
                      </strong>
                      <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', background: 'var(--brand-red, #d43833)', color: '#fff', padding: '2px 6px', borderRadius: '2px' }}>
                        Fixed Model
                      </span>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                      <div>
                        <span style={{ color: '#7a857a', display: 'block', fontSize: '9.5px' }}>LENGTH (W)</span>
                        <strong style={{ color: '#1e211d' }}>{config.width} mm</strong>
                      </div>
                      <div>
                        <span style={{ color: '#7a857a', display: 'block', fontSize: '9.5px' }}>WIDTH (D)</span>
                        <strong style={{ color: '#1e211d' }}>{config.depth} mm</strong>
                      </div>
                      <div>
                        <span style={{ color: '#7a857a', display: 'block', fontSize: '9.5px' }}>HEIGHT (H)</span>
                        <strong style={{ color: '#1e211d' }}>{config.height} mm</strong>
                      </div>
                      <div>
                        <span style={{ color: '#7a857a', display: 'block', fontSize: '9.5px' }}>WALL RIM</span>
                        <strong style={{ color: '#1e211d' }}>12 mm Solid</strong>
                      </div>
                      <div>
                        <span style={{ color: '#7a857a', display: 'block', fontSize: '9.5px' }}>COVED RADIUS</span>
                        <strong style={{ color: '#1e211d' }}>R{config.covedRadius} mm</strong>
                      </div>
                      <div>
                        <span style={{ color: '#7a857a', display: 'block', fontSize: '9.5px' }}>MOUNTING</span>
                        <strong style={{ color: '#1e211d' }}>Vessel / Deck</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* SECTION 02: MATERIAL & COLOUR                           */}
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
                  Material &amp; Colour
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['02'] ? '▲' : '▼'}</span>
            </button>

            <div className={`accordion-collapse-wrapper ${openSections['02'] ? 'is-open' : ''}`}>
              <div className="accordion-collapse-inner">
                <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  {/* Active Swatch Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8f7f4', padding: '10px 14px', border: '1px solid rgba(30,33,29,0.08)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          background: config.materialHex,
                          border: '2px solid #ffffff',
                          boxShadow: '0 2px 6px rgba(0,0,0,0.18)',
                        }}
                      />
                      <div>
                        <strong style={{ fontSize: '12px', fontFamily: 'Manrope, sans-serif', color: '#1e211d', display: 'block' }}>
                          {config.materialName}
                        </strong>
                        <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: '#687268' }}>
                          {config.materialFinish}
                        </span>
                      </div>
                    </div>
                    <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', background: '#1e211d', color: '#fff', padding: '2px 8px', borderRadius: '2px' }}>
                      DuPont™ Corian®
                    </span>
                  </div>

                  {/* Search and Filters */}
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    {[
                      { key: 'all', label: 'All Tones' },
                      { key: 'white', label: 'Whites' },
                      { key: 'cream', label: 'Creams' },
                      { key: 'grey', label: 'Greys' },
                      { key: 'dark', label: 'Darks' },
                      { key: 'translucent', label: 'Translucent' },
                    ].map(f => (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setMaterialFilter(f.key as any)}
                        style={{
                          padding: '5px 10px',
                          border: materialFilter === f.key ? '1px solid #1e211d' : '1px solid #e0ded8',
                          background: materialFilter === f.key ? '#1e211d' : '#f8f7f4',
                          color: materialFilter === f.key ? '#fff' : '#4a5249',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          borderRadius: '2px',
                          cursor: 'pointer',
                        }}
                      >
                        {f.label}
                      </button>
                    ))}
                  </div>

                  {/* Search Bar */}
                  <input
                    type="text"
                    placeholder="Search Corian® color or collection..."
                    value={materialSearch}
                    onChange={e => setMaterialSearch(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      fontSize: '11px',
                      fontFamily: 'DM Mono, monospace',
                      border: '1px solid #ddd9d2',
                      borderRadius: '2px',
                      outline: 'none',
                    }}
                  />

                  {/* Swatches Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '8px' }}>
                    {filteredMaterials.map(mat => {
                      const isAct = config.materialSlug === mat.slug;
                      return (
                        <div
                          key={mat.slug}
                          onClick={() => setConfig(prev => ({
                            ...prev,
                            materialSlug: mat.slug,
                            materialName: mat.name,
                            materialHex: mat.hexColor,
                            materialFinish: mat.finish,
                          }))}
                          title={`${mat.name} (${mat.collection})`}
                          style={{
                            border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #ddd9d2',
                            background: '#fff',
                            borderRadius: '3px',
                            padding: '6px 4px',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            textAlign: 'center',
                            gap: '4px',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div
                            style={{
                              width: '28px',
                              height: '28px',
                              borderRadius: '50%',
                              background: mat.hexColor,
                              border: '1px solid rgba(0,0,0,0.12)',
                              boxShadow: isAct ? '0 0 0 2px var(--brand-red, #d43833)' : 'none',
                            }}
                          />
                          <span style={{ fontSize: '9.5px', fontFamily: 'DM Mono, monospace', color: isAct ? 'var(--brand-red, #d43833)' : '#222', lineHeight: 1.1, wordBreak: 'break-word' }}>
                            {mat.name}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* SECTION 03: DRAIN TYPE                                  */}
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
                  Drain System
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['03'] ? '▲' : '▼'}</span>
            </button>

            <div className={`accordion-collapse-wrapper ${openSections['03'] ? 'is-open' : ''}`}>
              <div className="accordion-collapse-inner">
                <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {DRAIN_OPTIONS.map(drn => {
                    const isAct = config.drainTypeId === drn.id;
                    return (
                      <div
                        key={drn.id}
                        onClick={() => setConfig(prev => ({
                          ...prev,
                          drainTypeId: drn.id,
                          drainName: drn.name,
                        }))}
                        style={{
                          padding: '12px 14px',
                          border: isAct ? '2px solid var(--brand-red, #d43833)' : '1px solid #e0ded8',
                          background: isAct ? '#ffffff' : '#fcfbfa',
                          borderRadius: '3px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '12px',
                          transition: 'all 0.15s ease',
                          boxShadow: isAct ? '0 3px 10px rgba(212,56,51,0.08)' : 'none',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '48px', height: '36px', flexShrink: 0 }}>
                            <DrainTypeThumbnail type={drn.id} colorHex={config.materialHex} active={isAct} />
                          </div>
                          <div>
                            <strong style={{ fontSize: '12px', fontFamily: 'Manrope, sans-serif', color: isAct ? 'var(--brand-red, #d43833)' : '#1e211d', display: 'block' }}>
                              {drn.name}
                            </strong>
                            <span style={{ fontSize: '10.5px', fontFamily: 'DM Mono, monospace', color: '#687268' }}>
                              {drn.finish}
                            </span>
                          </div>
                        </div>

                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 600, color: isAct ? 'var(--brand-red, #d43833)' : '#888', textTransform: 'uppercase' }}>
                            {isAct ? 'Selected' : 'Available'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* ======================================================= */}
          {/* SECTION 04: PRODUCT NOTES & SPECIFICATION              */}
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
                  Product Notes &amp; Specification
                </span>
              </div>
              <span style={{ fontSize: '12px', color: '#888' }}>{openSections['04'] ? '▲' : '▼'}</span>
            </button>

            <div className={`accordion-collapse-wrapper ${openSections['04'] ? 'is-open' : ''}`}>
              <div className="accordion-collapse-inner">
                <div style={{ padding: '16px 20px 20px', borderTop: '1px solid #f0eee8', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: '#687268', marginBottom: '6px' }}>
                      Project Reference / Title
                    </label>
                    <input
                      type="text"
                      value={config.projectName}
                      onChange={e => setConfig(prev => ({ ...prev, projectName: e.target.value }))}
                      placeholder="e.g. Master En-Suite Villa Project"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: 'DM Mono, monospace',
                        border: '1px solid #ddd9d2',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: '#687268', marginBottom: '6px' }}>
                      Architecture Studio / Client
                    </label>
                    <input
                      type="text"
                      value={config.clientStudio}
                      onChange={e => setConfig(prev => ({ ...prev, clientStudio: e.target.value }))}
                      placeholder="e.g. Design Atelier Bengaluru"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: 'DM Mono, monospace',
                        border: '1px solid #ddd9d2',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: '#687268', marginBottom: '6px' }}>
                      Location / City
                    </label>
                    <input
                      type="text"
                      value={config.locationCity}
                      onChange={e => setConfig(prev => ({ ...prev, locationCity: e.target.value }))}
                      placeholder="Bengaluru"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: 'DM Mono, monospace',
                        border: '1px solid #ddd9d2',
                        outline: 'none',
                      }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: '#687268', marginBottom: '6px' }}>
                      Special Fabrication Instructions
                    </label>
                    <textarea
                      rows={3}
                      value={config.specialInstructions}
                      onChange={e => setConfig(prev => ({ ...prev, specialInstructions: e.target.value }))}
                      placeholder="Special waste alignment, custom packaging, or commercial project notes..."
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        fontSize: '12px',
                        fontFamily: 'DM Mono, monospace',
                        border: '1px solid #ddd9d2',
                        outline: 'none',
                        resize: 'vertical',
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
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
        {/* Left: Bespoke Specification & Quote Trigger */}
        <div className="configurator-action-bar-pricing">
          <div style={{ minWidth: 0, flex: 1 }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', color: '#9ca59b', letterSpacing: '0.06em', whiteSpace: 'nowrap' }}>
              BESPOKE SPECIFICATION
            </span>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginTop: '2px' }}>
              <strong style={{ fontSize: '18px', fontFamily: 'Manrope, sans-serif', color: '#fff', letterSpacing: '-0.01em', whiteSpace: 'nowrap' }}>
                Price on Request
              </strong>
            </div>
          </div>

          {/* Quantity Selector */}
          <div className="configurator-qty-selector" style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#9ca59b', whiteSpace: 'nowrap' }}>Qty:</span>
            <button
              type="button"
              onClick={() => setConfig(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
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
              onClick={() => setConfig(prev => ({ ...prev, quantity: prev.quantity + 1 }))}
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

        {/* Right: Export JSON, AR & Primary Quote CTA */}
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
              borderRadius: '2px',
            }}
          >
            View in AR
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
              borderRadius: '2px',
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

      {/* AR Modal */}
      {showArModal && (
        <BasinArViewerModal
          config={config}
          isOpen={showArModal}
          onClose={() => setShowArModal(false)}
        />
      )}



      {/* Quote Request Modal */}
      {showQuoteModal && (
        <div
          role="dialog"
          aria-modal="true"
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(10, 12, 10, 0.78)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 99999,
            padding: '16px',
          }}
          onClick={() => setShowQuoteModal(false)}
        >
          <div
            style={{
              maxWidth: '540px',
              width: '100%',
              background: '#faf9f5',
              borderTop: '4px solid var(--brand-red, #d43833)',
              padding: '32px',
              boxShadow: '0 32px 64px rgba(0,0,0,0.4)',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={e => e.stopPropagation()}
          >
            {quoteSuccessData ? (
              <div style={{ textAlign: 'center', padding: '24px 0' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#2e6930', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '24px' }}>
                  ✓
                </div>
                <h3 style={{ fontSize: '22px', margin: '0 0 8px' }}>Quote Inquiry Registered</h3>
                <p style={{ fontSize: '13px', color: '#555', marginBottom: '16px' }}>
                  Reference No: <strong>{quoteSuccessData.quoteNumber}</strong>
                </p>
                <p style={{ fontSize: '12px', color: '#777', lineHeight: 1.5, marginBottom: '24px' }}>
                  Our senior fabrication desk will prepare official trade pricing and submittal drawings for Countertop Basin {config.modelName}.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setQuoteSuccessData(null);
                    setShowQuoteModal(false);
                  }}
                  style={{
                    padding: '12px 24px',
                    background: '#1e211d',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleQuoteSubmit}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--brand-red, #d43833)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                      Architectural Quotation Request
                    </span>
                    <h2 style={{ margin: '4px 0 0', fontSize: '20px', fontWeight: 600 }}>
                      Countertop Basin {config.modelName}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowQuoteModal(false)}
                    style={{ background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ background: '#f0eee8', padding: '10px 14px', marginBottom: '18px', fontSize: '11px', fontFamily: 'DM Mono, monospace' }}>
                  {config.width} × {config.depth} × {config.height} mm · {config.materialName} · Qty: {config.quantity} Unit(s)
                </div>

                {quoteError && (
                  <div style={{ padding: '8px 12px', background: '#fde8e8', color: '#9e2521', fontSize: '11px', fontFamily: 'DM Mono, monospace', marginBottom: '14px' }}>
                    {quoteError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      placeholder="Ar. Rajesh Kumar"
                      style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #ccc', outline: 'none' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Email Address *
                      </label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="rajesh@studio.in"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #ccc', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Phone / WhatsApp *
                      </label>
                      <input
                        type="tel"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        placeholder="+91 98450 12345"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #ccc', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Studio / Practice
                      </label>
                      <input
                        type="text"
                        value={studio}
                        onChange={e => setStudio(e.target.value)}
                        placeholder="Studio Architecture"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #ccc', outline: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                        Location / City
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={e => setCity(e.target.value)}
                        placeholder="Bengaluru"
                        style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #ccc', outline: 'none' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', marginBottom: '4px' }}>
                      Additional Project Notes
                    </label>
                    <textarea
                      rows={2}
                      value={projectNotes}
                      onChange={e => setProjectNotes(e.target.value)}
                      placeholder="Special requirements, multiple units, delivery deadline..."
                      style={{ width: '100%', padding: '8px 12px', fontSize: '12px', border: '1px solid #ccc', outline: 'none', resize: 'vertical' }}
                    />
                  </div>

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
                      fontSize: '11px',
                      fontWeight: 700,
                      cursor: isSubmittingQuote ? 'wait' : 'pointer',
                      marginTop: '8px',
                      letterSpacing: '0.06em',
                    }}
                  >
                    {isSubmittingQuote ? 'TRANSMITTING SPECIFICATION...' : 'SUBMIT SPECIFICATION QUOTE →'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
