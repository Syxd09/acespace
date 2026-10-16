'use client';

import React, { useState, useEffect, useRef } from 'react';
import { ProductConfiguration } from '@/data/configuratorData';
import { buildProductMesh } from '@/lib/configurator/meshBuilder';
import { createGlbBlobUrl } from '@/lib/configurator/glbExporter';

interface ArViewerModalProps {
  config: ProductConfiguration;
  isOpen: boolean;
  onClose: () => void;
}

export const ArViewerModal: React.FC<ArViewerModalProps> = ({
  config,
  isOpen,
  onClose,
}) => {
  const [deviceType, setDeviceType] = useState<'ios' | 'android' | 'desktop'>('desktop');
  const [savedConfigId, setSavedConfigId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);
  const [localGlbUrl, setLocalGlbUrl] = useState<string | null>(null);
  const [modelViewerLoaded, setModelViewerLoaded] = useState(false);
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

  // Dynamically load Google's model-viewer web component script when AR modal opens
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

  // Generate local GLB Blob & Save remote configuration when modal opens
  useEffect(() => {
    if (!isOpen) return;

    // 1. Build local binary GLB blob immediately
    try {
      const mesh = buildProductMesh(config);
      const blobUrl = createGlbBlobUrl(mesh);
      setLocalGlbUrl(blobUrl);

      return () => {
        URL.revokeObjectURL(blobUrl);
      };
    } catch (e) {
      console.error('Failed to generate local GLB blob:', e);
    }
  }, [isOpen, config]);

  // Save configuration on server to obtain a stable cfg_ ID for remote mobile & Scene Viewer loading
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;
    setIsSaving(true);

    fetch('/api/configurator', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ config }),
    })
      .then(res => res.json())
      .then(data => {
        if (isMounted && data.success && data.configuration?.id) {
          setSavedConfigId(data.configuration.id);
        }
      })
      .catch(err => {
        console.warn('Could not persist configuration to server:', err);
      })
      .finally(() => {
        if (isMounted) setIsSaving(false);
      });

    return () => {
      isMounted = false;
    };
  }, [isOpen, config]);

  if (!isOpen) return null;

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://acespacesindia.com';
  const effectiveConfigId = savedConfigId || config.referenceCode || config.id || 'current';
  
  // URLs for remote consumption
  const mobileViewerUrl = `${origin}/configurator?id=${effectiveConfigId}&launchAr=true`;
  const remoteGlbUrl = `${origin}/api/configurator/model?id=${effectiveConfigId}`;
  const directGlbUrl = localGlbUrl || remoteGlbUrl;

  // Google Scene Viewer intent for Android Chrome / Samsung Internet
  const androidSceneViewerIntent = `intent://arvr.google.com/scene-viewer/1.0?file=${encodeURIComponent(
    remoteGlbUrl
  )}&mode=ar_only&resizable=false&title=${encodeURIComponent(
    `${config.title} (${config.width}x${config.depth}mm)`
  )}#Intent;scheme=https;package=com.google.ar.core;action=android.intent.action.VIEW;S.browser_fallback_url=${encodeURIComponent(
    mobileViewerUrl
  )};end;`;

  // QR Code URL using trusted generator with high error correction
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
    if (!directGlbUrl) return;
    const a = document.createElement('a');
    a.href = directGlbUrl;
    a.download = `acespaces-${config.referenceCode || config.id || 'vanity'}.glb`;
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
              View in Your Space
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
            <div style={{ fontWeight: 600, color: '#1e211d' }}>{config.title}</div>
            <div style={{ color: '#667066', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
              {config.width} × {config.depth} × {config.thickness} mm • {config.colorName || config.materialName}
            </div>
          </div>
          <div
            style={{
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              color: '#1e211d',
              textAlign: 'right',
            }}
          >
            Ref: {effectiveConfigId}
          </div>
        </div>

        {/* DEVICE SPECIFIC WORKFLOWS */}

        {/* CASE A: MOBILE ANDROID */}
        {deviceType === 'android' && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '20px' }}>
              Launch native Google Scene Viewer on your Android device to place this architectural washbasin directly on your floor or countertop with real metric 1:1 scale tracking.
            </p>

            <a
              href={androidSceneViewerIntent}
              onClick={(e) => {
                if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
                  if (!('ontouchstart' in window) && navigator.maxTouchPoints === 0) {
                    e.preventDefault();
                    alert('Google Scene Viewer requires a physical Android mobile device. On desktop, please use "Download .GLB" or scan the QR code with your phone.');
                  }
                }
              }}
              style={{
                display: 'block',
                width: '100%',
                padding: '16px',
                background: '#1e211d',
                color: '#faf9f5',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '14px',
                letterSpacing: '0.04em',
                marginBottom: '12px',
                textAlign: 'center',
                boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
              }}
            >
              Launch Google Scene Viewer (AR)
            </a>

            <div style={{ fontSize: '11px', color: '#777' }}>
              Requires Google Play Services for AR (ARCore) supported browser.
            </div>
          </div>
        )}

        {/* CASE B: MOBILE iOS (iPhone / iPad) */}
        {deviceType === 'ios' && (
          <div style={{ textAlign: 'center', marginBottom: '24px' }}>
            <p style={{ fontSize: '13px', color: '#444', lineHeight: 1.5, marginBottom: '16px' }}>
              Place this custom Corian® vanity unit in your bathroom using Apple AR Quick Look.
            </p>

            {/* Hidden / Inline model-viewer that provides native iOS Quick Look AR trigger */}
            {modelViewerLoaded && directGlbUrl && (
              <div style={{ marginBottom: '16px' }}>
                {React.createElement('model-viewer', {
                  ref: modelViewerRef,
                  src: directGlbUrl,
                  ar: true,
                  'ar-modes': 'quick-look scene-viewer webxr',
                  'camera-controls': true,
                  'touch-action': 'pan-y',
                  'shadow-intensity': '1',
                  style: {
                    width: '100%',
                    height: '240px',
                    backgroundColor: '#f0ede6',
                    border: '1px solid rgba(30,33,29,0.12)',
                    marginBottom: '12px',
                  },
                })}

                <button
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
                    cursor: 'pointer',
                    letterSpacing: '0.04em',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                  }}
                >
                  Activate Apple Quick Look AR
                </button>
              </div>
            )}
          </div>
        )}

        {/* CASE C: DESKTOP — HIGH FIDELITY QR CODE & LINK HANDOFF */}
        {deviceType === 'desktop' && (
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.5, margin: '0 0 20px 0' }}>
              Scan this verified QR code with your iPhone, iPad, or Android camera to instantly place this <strong>1:1 scale</strong> architectural solid surface product in your actual bathroom or site.
            </p>

            {/* QR Code Container */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: '#fff',
                padding: '20px',
                border: '1px solid rgba(30,33,29,0.15)',
                boxShadow: '0 12px 28px rgba(0,0,0,0.06)',
                marginBottom: '20px',
              }}
            >
              <img
                src={qrCodeImageSrc}
                alt="AR Configuration QR Code"
                width={200}
                height={200}
                style={{ display: 'block', imageRendering: 'pixelated' }}
              />
            </div>

            {/* Desktop Action Buttons */}
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
                  transition: 'background 0.2s ease',
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
                Download .GLB File
              </button>
            </div>
          </div>
        )}

        {/* Architectural Metadata & Instructions Footer */}
        <div
          style={{
            borderTop: '1px solid rgba(30,33,29,0.1)',
            paddingTop: '16px',
            fontSize: '11px',
            color: '#667066',
            lineHeight: 1.5,
          }}
        >
          <div className="ar-modal-specs-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
            <div>
              <strong style={{ color: '#1e211d', display: 'block' }}>Scale</strong>
              1 unit = 1000 mm (Exact 1:1)
            </div>
            <div>
              <strong style={{ color: '#1e211d', display: 'block' }}>Format</strong>
              glTF 2.0 Binary (.glb)
            </div>
            <div>
              <strong style={{ color: '#1e211d', display: 'block' }}>Compatibility</strong>
              iOS Quick Look / ARCore
            </div>
          </div>
          <div>
            Need custom architectural drawings or CAD files for site MEP planning? You can also export a complete technical quotation PDF with fabrication drawings directly from the main sidebar.
          </div>
        </div>
      </div>
    </div>
  );
};
