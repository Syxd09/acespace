'use client';

import React, { useState, useEffect, useRef } from 'react';
import { BasinConfiguration } from '@/data/basinConfiguratorData';
import { buildStandaloneBasinMesh } from '@/lib/configurator/basinMeshBuilder';
import { createGlbBlobUrl } from '@/lib/configurator/glbExporter';

interface BasinArViewerModalProps {
  config: BasinConfiguration;
  isOpen: boolean;
  onClose: () => void;
}

export const BasinArViewerModal: React.FC<BasinArViewerModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [localGlbUrl, setLocalGlbUrl] = useState<string | null>(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const modelViewerRef = useRef<any>(null);

  // Detect platform on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const ua = navigator.userAgent || '';
    const isIOS = /iPad|iPhone|iPod/.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);

    if (isIOS) setDeviceType('ios');
    else if (isAndroid) setDeviceType('android');
    else setDeviceType('desktop');
  }, []);

  // Dynamically load Google's model-viewer script
  useEffect(() => {
    if (typeof window === 'undefined' || !isOpen) return;
    if (document.querySelector('script#model-viewer-script')) {
      setModelViewerLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'model-viewer-script';
    script.type = 'module';
    script.src = 'https://ajax.googleapis.com/ajax/libs/model-viewer/3.5.0/model-viewer.min.js';
    script.onload = () => setModelViewerLoaded(true);
    script.onerror = () => {
      console.warn('model-viewer script could not be loaded from CDN.');
    };
    document.head.appendChild(script);
  }, [isOpen]);

  // Generate local GLB Blob when modal opens
  useEffect(() => {
    if (!isOpen) return;

    try {
      const mesh = buildStandaloneBasinMesh(config);
      const blobUrl = createGlbBlobUrl(mesh);
      setLocalGlbUrl(blobUrl);

      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } catch (e) {
      console.error('Failed to generate local GLB blob for basin:', e);
    }
  }, [isOpen, config]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://acespacesindia.com';
  const mobileViewerUrl = `${origin}/basin-configurator?model=${encodeURIComponent(config.modelId)}&material=${encodeURIComponent(config.materialSlug)}&drain=${encodeURIComponent(config.drainTypeId)}&launchAr=true`;
  const qrCodeImageSrc = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&margin=12&format=svg&data=${encodeURIComponent(
    mobileViewerUrl
  )}`;

  const handleCopyLink = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(mobileViewerUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 3000);
    }
  };

  const handleDownloadGlb = () => {
    if (!localGlbUrl) return;
    const a = document.createElement('a');
    a.href = localGlbUrl;
    a.download = `acespaces-basin-${config.modelCode || config.modelId}.glb`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(10, 12, 10, 0.78)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 99999,
        padding: '16px',
      }}
      onClick={onClose}
    >
      <div
        className="ar-modal-card"
        style={{
          maxWidth: '560px',
          width: '100%',
          maxHeight: '90vh',
          overflowY: 'auto',
          background: '#faf9f5',
          border: '1px solid rgba(30,33,29,0.18)',
          borderTop: '4px solid var(--brand-red, #d43833)',
          boxShadow: '0 32px 64px rgba(0,0,0,0.45)',
          padding: '32px',
          position: 'relative',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
              <span
                style={{
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: '#d43833',
                  fontWeight: 600,
                }}
              >
                1:1 Scale Spatial AR
              </span>
              <span
                style={{
                  background: '#1e211d',
                  color: '#fff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '9px',
                  padding: '2px 6px',
                  letterSpacing: '0.05em',
                }}
              >
                glTF 2.0
              </span>
            </div>
            <h2 style={{ margin: 0, fontSize: '22px', fontWeight: 600, color: '#1e211d' }}>
              View {config.modelName} in AR
            </h2>
          </div>
          <button
            onClick={onClose}
            aria-label="Close modal"
            style={{
              background: 'none',
              border: '1px solid rgba(30,33,29,0.15)',
              padding: '6px 12px',
              fontSize: '14px',
              cursor: 'pointer',
              color: '#1e211d',
              fontWeight: 500,
            }}
          >
            Close ✕
          </button>
        </div>

        {/* Product Spec Pill */}
        <div
          style={{
            background: 'rgba(30,33,29,0.04)',
            border: '1px solid rgba(30,33,29,0.08)',
            padding: '12px 16px',
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
          }}
        >
          <div>
            <div style={{ fontWeight: 600, color: '#1e211d' }}>Countertop Basin {config.modelName}</div>
            <div style={{ color: '#667066', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
              {config.width} × {config.depth} × {config.height} mm / {config.materialName}
            </div>
          </div>
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: 'var(--brand-red, #d43833)',
              fontWeight: 600,
              textAlign: 'right',
            }}
          >
            {config.drainName.split('(')[0].trim()}
          </div>
        </div>

        {/* MOBILE VIEW (iOS / Android) */}
        {(deviceType === 'ios' || deviceType === 'android') && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '16px' }}>
              Place this architectural solid surface countertop washbasin on your vanity surface with exact 1:1 metric scale.
            </p>

            {modelViewerLoaded && localGlbUrl && (
              <div style={{ marginBottom: '16px' }}>
                {React.createElement('model-viewer', {
                  ref: modelViewerRef,
                  src: localGlbUrl,
                  ar: true,
                  'ar-modes': 'quick-look scene-viewer webxr',
                  'ar-scale': 'fixed',
                  'camera-controls': true,
                  'touch-action': 'pan-y',
                  'shadow-intensity': '1',
                  'auto-rotate': true,
                  style: {
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#f0ede6',
                    border: '1px solid rgba(30,33,29,0.12)',
                    marginBottom: '12px',
                  },
                })}

                <button
                  type="button"
                  onClick={() => {
                    if (modelViewerRef.current && modelViewerRef.current.activateAR) {
                      modelViewerRef.current.activateAR();
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '16px',
                    background: '#1e211d',
                    color: '#faf9f5',
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '14px',
                    letterSpacing: '0.04em',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                  }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                  Place Basin in 1:1 AR
                </button>
              </div>
            )}
          </div>
        )}

        {/* DESKTOP VIEW — QR CODE */}
        {deviceType === 'desktop' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Scan this verified QR code with your iPhone, iPad, or Android camera to instantly place this <strong>1:1 scale</strong> countertop basin in your bathroom.
            </p>

            <div
              style={{
                display: 'inline-flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                padding: '20px',
                border: '1px solid rgba(30,33,29,0.15)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.06)',
                marginBottom: '16px',
              }}
            >
              <img
                src={qrCodeImageSrc}
                alt="AR Basin QR Code"
                width={200}
                height={200}
                style={{ display: 'block', imageRendering: 'pixelated' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={handleCopyLink}
                style={{
                  padding: '10px 18px',
                  background: copiedLink ? '#2e6930' : '#1e211d',
                  color: '#fff',
                  border: 'none',
                  fontSize: '12px',
                  fontFamily: 'DM Mono, monospace',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                {copiedLink ? 'Link Copied ✓' : 'Copy Mobile AR Link'}
              </button>

              <button
                type="button"
                onClick={handleDownloadGlb}
                style={{
                  padding: '10px 18px',
                  background: 'transparent',
                  color: '#1e211d',
                  border: '1px solid rgba(30,33,29,0.25)',
                  fontSize: '12px',
                  fontFamily: 'DM Mono, monospace',
                  cursor: 'pointer',
                  letterSpacing: '0.04em',
                }}
              >
                Download .GLB Model
              </button>
            </div>
          </div>
        )}

        {/* Specs footer */}
        <div
          style={{
            borderTop: '1px solid rgba(30,33,29,0.1)',
            paddingTop: '16px',
            fontSize: '11px',
            color: '#667066',
            lineHeight: 1.5,
          }}
        >
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div>
              <strong style={{ color: '#1e211d', display: 'block' }}>Scale</strong>
              1:1 True Metric
            </div>
            <div>
              <strong style={{ color: '#1e211d', display: 'block' }}>Format</strong>
              Binary glTF (.glb)
            </div>
            <div>
              <strong style={{ color: '#1e211d', display: 'block' }}>Surface</strong>
              DuPont™ Corian®
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
