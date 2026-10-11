'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSampleShortlist } from '@/context/SampleContext';
import { useSiteContent } from '@/context/SiteContentContext';
import { Material, materials as defaultMaterials } from '@/data/materials';
import MaterialModal from '@/components/MaterialModal';
import { broadcastRealtimeEvent } from '@/lib/realtime';

export default function SampleTray() {
  const { shortlist, removeSample, clearShortlist, isTrayOpen, setIsTrayOpen } = useSampleShortlist();
  const { materials: liveMaterials } = useSiteContent();
  const allMaterials = (liveMaterials && liveMaterials.length > 0) ? liveMaterials : defaultMaterials;

  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const orderIdRef = React.useRef<string | null>(null);
  const isSavingRef = React.useRef<boolean>(false);
  const [orderNumber, setOrderNumber] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    studio: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    projectType: 'Residential',
  });

  const pathname = usePathname();

  // Helper to ensure full up-to-date material specifications and image paths
  const getFullMaterial = (item: Material): Material => {
    const found = allMaterials.find((m) => m.slug === item.slug || m.code === item.code);
    if (found) {
      return {
        ...found,
        ...item,
        textureImage: found.textureImage || item.textureImage,
        image: found.image || item.image,
        hexColor: found.hexColor || item.hexColor,
        textureCss: found.textureCss || item.textureCss,
      };
    }
    return item;
  };

  // Safe real-time draft capture with race-condition prevention & reasonable debounce
  React.useEffect(() => {
    if (formSubmitted || shortlist.length === 0) return;
    if (!formData.name && !formData.email && !formData.phone && !formData.studio && !formData.address) return;

    // 1200ms debounce to prevent spamming server and hitting rate limits during typing
    const timer = setTimeout(async () => {
      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        const currentId = orderIdRef.current || orderId || undefined;
        const payload = {
          id: currentId,
          status: 'in-progress',
          customer: formData,
          items: shortlist.map((m) => {
            const full = getFullMaterial(m);
            return {
              materialSlug: full.slug,
              name: full.name,
              collection: full.collection,
              finish: full.finish,
              colour: full.colour,
              swatch: full.swatch,
              textureImage: full.textureImage,
              image: full.image,
              hexColor: full.hexColor,
              dimensions: '100mm × 100mm Specimen',
            };
          }),
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.orderId) {
            orderIdRef.current = data.orderId;
            setOrderId(data.orderId);
          }
          if (data.orderNumber) {
            setOrderNumber(data.orderNumber);
          }
          // Broadcast real-time event to Admin console immediately
          broadcastRealtimeEvent('ORDER_UPDATED', data.order || payload);
        }
      } catch (err) {
        console.warn('Draft auto-save sync error:', err);
      } finally {
        isSavingRef.current = false;
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [formData, shortlist, orderId, formSubmitted]);

  // Lock background body scroll when Sample Tray is open
  React.useEffect(() => {
    if (isTrayOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      document.documentElement.classList.add('lenis-stopped');
      const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
      if (lenis && typeof lenis.stop === 'function') {
        lenis.stop();
      }
      return () => {
        document.body.style.overflow = originalOverflow;
        document.documentElement.classList.remove('lenis-stopped');
        if (lenis && typeof lenis.start === 'function') {
          lenis.start();
        }
      };
    }
  }, [isTrayOpen]);

  if (pathname?.startsWith('/admin') || !isTrayOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shortlist.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const currentId = orderIdRef.current || orderId || undefined;
      const payload = {
        id: currentId,
        status: 'submitted',
        customer: formData,
        items: shortlist.map((m) => {
          const full = getFullMaterial(m);
          return {
            materialSlug: full.slug,
            name: full.name,
            collection: full.collection,
            finish: full.finish,
            colour: full.colour,
            swatch: full.swatch,
            textureImage: full.textureImage,
            image: full.image,
            hexColor: full.hexColor,
            dimensions: '100mm × 100mm Specimen',
          };
        }),
      };

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.success) {
        if (data.orderNumber) {
          setOrderNumber(data.orderNumber);
        }
        setFormSubmitted(true);
        // Instant broadcast to Admin Console
        broadcastRealtimeEvent('ORDER_SUBMITTED', data.order || payload);
      } else {
        setErrorMessage(data.error || 'Unable to place sample order. Please try again.');
      }
    } catch (err) {
      setErrorMessage((err as Error).message || 'Network error while submitting order.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormSubmitted(false);
    setOrderId(null);
    orderIdRef.current = null;
    setOrderNumber('');
    setErrorMessage(null);
    clearShortlist();
    setIsTrayOpen(false);
    setFormData({
      name: '',
      studio: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      pincode: '',
      projectType: 'Residential',
    });
  };

  return (
    <>
      {/* Sample Tray Drawer Backdrop Overlay */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(25, 28, 24, 0.65)',
          backdropFilter: 'blur(6px)',
          zIndex: 9998,
          transition: 'opacity 0.35s ease',
        }}
        onClick={() => setIsTrayOpen(false)}
      />

      {/* Side Slide-Over Panel */}
      <div
        id="sample-tray-drawer"
        data-lenis-prevent="true"
        role="dialog"
        aria-modal="true"
        aria-label="Sample Specimen Tray"
        className="sample-tray-panel"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '100%',
          maxWidth: '520px',
          background: 'var(--paper)',
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-10px 0 40px rgba(0,0,0,0.3)',
          borderLeft: '1px solid var(--line)',
          animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        {/* Header */}
        <div
          className="sample-tray-header"
          style={{
            padding: formSubmitted ? '16px 24px' : '24px 32px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '2px' }}>
              Architectural Palette
            </span>
            <h2 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>
              Sample Specimen Tray ({shortlist.length})
            </h2>
          </div>
          <button
            onClick={() => setIsTrayOpen(false)}
            className="sample-tray-close"
            aria-label="Close sample tray"
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              border: '1px solid var(--line)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '16px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div
          className="sample-tray-body"
          style={{
            flex: 1,
            overflowY: formSubmitted ? 'hidden' : 'auto',
            padding: formSubmitted ? '16px 24px' : '32px',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {formSubmitted ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%', minHeight: 0 }}>
              <div style={{ textAlign: 'center', marginBottom: '6px' }}>
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    background: 'var(--ink)',
                    color: '#fff',
                    display: 'grid',
                    placeItems: 'center',
                    margin: '0 auto 6px',
                    fontSize: '16px',
                  }}
                >
                  ✓
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                  <span className="eyebrow" style={{ color: 'var(--muted)', margin: 0 }}>Sample Order Dispatched</span>
                  {orderNumber && (
                    <span style={{ background: '#dcd7cd', border: '1px solid var(--line)', padding: '2px 8px', fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      Ref: <strong>{orderNumber}</strong>
                    </span>
                  )}
                </div>
                <h2 style={{ fontSize: '17px', fontWeight: 500, margin: '0 0 4px', lineHeight: 1.25 }}>
                  Specimen box on its way to <i>{((formData.studio && formData.studio.trim().toLowerCase() !== 'none') ? formData.studio.trim() : (formData.name && formData.name.trim().toLowerCase() !== 'none') ? formData.name.trim() : 'your studio')}.</i>
                </h2>
                <p style={{ fontSize: '11.5px', lineHeight: 1.4, color: '#5d665c', margin: '0 auto 6px', maxWidth: '440px' }}>
                  We have logged your order for {shortlist.length} specimen{shortlist.length > 1 ? 's' : ''} (100mm × 100mm). Delivery to <strong>{formData.address}, {formData.city}</strong> within 48–72h.
                </p>

                {/* Office Representative Reassurance Callout - Compact */}
                <div
                  style={{
                    margin: '6px 0 0',
                    background: 'rgba(255, 255, 255, 0.65)',
                    border: '1px solid var(--line)',
                    borderLeft: '3px solid var(--ink)',
                    padding: '6px 12px',
                    textAlign: 'left',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    borderRadius: '2px',
                  }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'var(--ink)',
                      color: '#fff',
                      display: 'grid',
                      placeItems: 'center',
                      fontSize: '9px',
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}>
                        Studio Concierge Follow-Up
                      </span>
                      <span style={{ fontSize: '9.5px', color: '#6e766c', fontFamily: 'DM Mono, monospace' }}>
                        +91 (80) 4122-8900
                      </span>
                    </div>
                    <p style={{ margin: '1px 0 0', fontSize: '10.5px', lineHeight: 1.3, color: 'var(--ink)', fontWeight: 500 }}>
                      An Ace Spaces representative will contact you shortly to verify dispatch and specifications.
                    </p>
                  </div>
                </div>
              </div>

              {/* Specimens list in confirmation screen - Compact rows */}
              {shortlist.length > 0 && (
                <div style={{ margin: '6px 0 8px', flex: '0 1 auto', minHeight: 0, overflow: 'hidden' }}>
                  <span style={{ fontSize: '9.5px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '5px', letterSpacing: '0.05em' }}>
                    Specimens in this dispatch ({shortlist.length}) · Click to inspect
                  </span>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '130px', overflowY: 'auto', paddingRight: '2px' }}>
                    {shortlist.map((mat) => {
                      const fullMat = getFullMaterial(mat);
                      const imageSrc = fullMat.textureImage || fullMat.image;
                      return (
                        <div
                          key={mat.slug}
                          onClick={() => setSelectedMaterial(fullMat)}
                          style={{
                            background: '#dcd7cd',
                            padding: '6px 10px',
                            border: '1px solid var(--line)',
                            display: 'grid',
                            gridTemplateColumns: '32px 1fr auto',
                            alignItems: 'center',
                            gap: '10px',
                            cursor: 'pointer',
                            transition: 'background 0.15s ease',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#d3cec2';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#dcd7cd';
                          }}
                          title={`Click to view ${fullMat.name} specifications`}
                        >
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              border: '1px solid rgba(0,0,0,0.18)',
                              borderRadius: '2px',
                              overflow: 'hidden',
                              background: fullMat.textureCss || fullMat.hexColor || '#e8e4dc',
                              position: 'relative',
                            }}
                          >
                            {imageSrc ? (
                              <img
                                src={imageSrc}
                                alt={fullMat.name}
                                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                              />
                            ) : null}
                          </div>
                          <div style={{ minWidth: 0 }}>
                            <strong style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: 'var(--ink)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {fullMat.name}
                            </strong>
                            <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                              {fullMat.finish} · 12mm Specimen
                            </span>
                          </div>
                          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                            Inspect ↗
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              <button className="button button-dark" onClick={handleReset} style={{ justifyContent: 'center', width: '100%', padding: '12px 20px', fontSize: '12px', marginTop: 'auto' }}>
                Done / Return to Palette <span>↗</span>
              </button>
            </div>
          ) : shortlist.length === 0 ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '40px 0' }}>
              <span className="eyebrow" style={{ color: 'var(--muted)' }}>Tray Empty</span>
              <h3 style={{ fontSize: '24px', fontWeight: 400, margin: '12px 0 16px' }}>
                No specimens added yet.
              </h3>
              <p style={{ fontSize: '14px', lineHeight: 1.6, color: '#5d665c', marginBottom: '30px' }}>
                Browse our mineral palette and click <strong>"+ Add to Sample Tray"</strong> on any material to compile your studio specimen box.
              </p>
              <Link
                className="button button-dark"
                href="/materials"
                onClick={() => setIsTrayOpen(false)}
                style={{ justifyContent: 'center' }}
              >
                Explore Materials <span>↗</span>
              </Link>
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: 'auto', paddingRight: '4px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Selected Specimens (100mm × 100mm)
                </span>
                <button
                  onClick={clearShortlist}
                  style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', textDecoration: 'underline', cursor: 'pointer', background: 'none', border: 'none' }}
                >
                  Clear All
                </button>
              </div>

              {/* Shortlist Items List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '30px' }}>
                {shortlist.map((mat) => {
                  const fullMat = getFullMaterial(mat);
                  const imageSrc = fullMat.textureImage || fullMat.image;
                  return (
                    <div
                      key={mat.slug}
                      style={{
                        background: '#dcd7cd',
                        padding: '12px 14px',
                        border: '1px solid var(--line)',
                        display: 'grid',
                        gridTemplateColumns: '48px 1fr 24px',
                        alignItems: 'center',
                        gap: '14px',
                        transition: 'background 0.2s ease',
                      }}
                    >
                      {/* Specimen Thumbnail - Clickable to open details modal */}
                      <button
                        type="button"
                        onClick={() => setSelectedMaterial(fullMat)}
                        title={`Click to view ${fullMat.name} details & specifications`}
                        style={{
                          width: '48px',
                          height: '48px',
                          padding: 0,
                          border: '1px solid rgba(0,0,0,0.18)',
                          borderRadius: '2px',
                          overflow: 'hidden',
                          background: fullMat.textureCss || fullMat.hexColor || '#e8e4dc',
                          cursor: 'pointer',
                          position: 'relative',
                          display: 'block',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                          transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'scale(1.06)';
                          e.currentTarget.style.boxShadow = '0 3px 8px rgba(0,0,0,0.18)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'scale(1)';
                          e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)';
                        }}
                        aria-label={`View ${fullMat.name} details`}
                      >
                        {imageSrc ? (
                          <img
                            src={imageSrc}
                            alt={fullMat.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />
                        ) : (
                          <div
                            style={{
                              width: '100%',
                              height: '100%',
                              display: 'grid',
                              placeItems: 'center',
                              fontFamily: 'DM Mono, monospace',
                              fontSize: '9px',
                              color: 'var(--muted)',
                              textTransform: 'uppercase',
                            }}
                          >
                            100mm
                          </div>
                        )}
                      </button>

                      {/* Info - Clickable to open details modal */}
                      <div
                        onClick={() => setSelectedMaterial(fullMat)}
                        title={`Click to view ${fullMat.name} details & specifications`}
                        style={{ cursor: 'pointer', minWidth: 0 }}
                      >
                        <strong
                          style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--ink)',
                            lineHeight: 1.25,
                            marginBottom: '3px',
                            transition: 'color 0.15s ease',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.color = '#353c34')}
                          onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        >
                          {fullMat.name}
                        </strong>
                        <span
                          style={{
                            fontSize: '11px',
                            fontFamily: 'DM Mono, monospace',
                            color: 'var(--muted)',
                            textTransform: 'uppercase',
                            display: 'block',
                          }}
                        >
                          {fullMat.finish} · 12mm Specimen
                        </span>
                      </div>

                      {/* Remove Button */}
                      <button
                        type="button"
                        className="sample-tray-remove-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeSample(mat.slug);
                        }}
                        style={{
                          fontSize: '18px',
                          color: 'var(--muted)',
                          cursor: 'pointer',
                          background: 'none',
                          border: 'none',
                          padding: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'color 0.15s ease',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--ink)')}
                        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--muted)')}
                        aria-label={`Remove ${fullMat.name}`}
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>

              {/* Sample Box Order Form */}
              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '24px' }}>
                <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '14px' }}>
                  Studio Dispatch Information
                </span>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <input
                      type="text"
                      placeholder="Your Name *"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      placeholder="Studio / Architectural Firm *"
                      required
                      value={formData.studio}
                      onChange={(e) => setFormData({ ...formData, studio: e.target.value })}
                    />
                  </div>
                  <div className="sample-tray-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="email"
                      placeholder="Studio Email *"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                    <input
                      type="tel"
                      placeholder="Phone / Mobile *"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                  </div>
                  <div>
                    <textarea
                      rows={2}
                      placeholder="Studio Delivery Address *"
                      required
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    />
                  </div>
                  <div className="sample-tray-form-2col" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <input
                      type="text"
                      placeholder="City *"
                      required
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    />
                    <input
                      type="text"
                      placeholder="Postal Code *"
                      required
                      value={formData.pincode}
                      onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                    />
                  </div>

                  {errorMessage && (
                    <div style={{ padding: '10px 14px', background: 'rgba(215, 65, 50, 0.1)', border: '1px solid rgba(215, 65, 50, 0.3)', color: '#b93222', fontSize: '12px', fontFamily: 'DM Mono, monospace' }}>
                      ⚠ {errorMessage}
                    </div>
                  )}

                  <div style={{ marginTop: '10px' }}>
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="button button-dark"
                      style={{ width: '100%', justifyContent: 'center', padding: '18px 24px', opacity: isSubmitting ? 0.7 : 1 }}
                    >
                      {isSubmitting ? 'Registering Order...' : `Order Complimentary Sample Box (${shortlist.length}) ↗`}
                    </button>
                    <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textAlign: 'center', marginTop: '10px', textTransform: 'uppercase' }}>
                      Free delivery to studios across India · 100mm × 100mm
                    </span>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Material Specification Modal when clicked */}
      {selectedMaterial && (
        <MaterialModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      {/* Sample Tray Mobile Responsiveness */}
      <style jsx global>{`
        @media (max-width: 600px) {
          .sample-tray-panel {
            width: 100vw !important;
            max-width: 100vw !important;
            border-left: none !important;
          }
          .sample-tray-header {
            padding: max(16px, env(safe-area-inset-top)) 18px 16px !important;
          }
          .sample-tray-close {
            width: 44px !important;
            height: 44px !important;
            font-size: 20px !important;
          }
          .sample-tray-body {
            padding: 20px 16px max(24px, env(safe-area-inset-bottom)) !important;
          }
          .sample-tray-form-2col {
            grid-template-columns: 1fr !important;
            gap: 14px !important;
          }
          .sample-tray-panel input,
          .sample-tray-panel textarea {
            font-size: 16px !important;
          }
          .sample-tray-remove-btn {
            min-width: 44px !important;
            min-height: 44px !important;
          }
        }
      `}</style>
    </>
  );
}
