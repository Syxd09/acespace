'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSampleShortlist } from '@/context/SampleContext';
import { broadcastRealtimeEvent } from '@/lib/realtime';

export default function SampleTray() {
  const { shortlist, removeSample, clearShortlist, isTrayOpen, setIsTrayOpen } = useSampleShortlist();
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
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

  // Instant real-time draft capture ("also if he is entering")
  React.useEffect(() => {
    if (formSubmitted || shortlist.length === 0) return;
    if (!formData.name && !formData.email && !formData.phone && !formData.studio && !formData.address) return;

    // Fast 350ms debounce for immediate real-time sync
    const timer = setTimeout(async () => {
      try {
        const payload = {
          id: orderId || undefined,
          status: 'in-progress',
          customer: formData,
          items: shortlist.map((m) => ({
            materialSlug: m.slug,
            name: m.name,
            collection: m.collection,
            finish: m.finish,
            colour: m.colour,
            swatch: m.swatch,
            dimensions: '100mm × 100mm Specimen',
          })),
        };

        const res = await fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (res.ok) {
          const data = await res.json();
          if (data.orderId && !orderId) {
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
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [formData, shortlist, orderId, formSubmitted]);

  if (pathname?.startsWith('/admin') || !isTrayOpen) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (shortlist.length === 0) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const payload = {
        id: orderId || undefined,
        status: 'submitted',
        customer: formData,
        items: shortlist.map((m) => ({
          materialSlug: m.slug,
          name: m.name,
          collection: m.collection,
          finish: m.finish,
          colour: m.colour,
          swatch: m.swatch,
          dimensions: '100mm × 100mm Specimen',
        })),
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
          style={{
            padding: '24px 32px',
            borderBottom: '1px solid var(--line)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>
              Architectural Palette
            </span>
            <h2 style={{ fontSize: '20px', fontWeight: 500, margin: 0 }}>
              Sample Specimen Tray ({shortlist.length})
            </h2>
          </div>
          <button
            onClick={() => setIsTrayOpen(false)}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '50%',
              border: '1px solid var(--line)',
              background: 'transparent',
              color: 'var(--ink)',
              fontSize: '18px',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
              transition: 'background 0.2s ease',
            }}
            aria-label="Close Sample Tray"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '32px', display: 'flex', flexDirection: 'column' }}>
          {formSubmitted ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'center', padding: '20px 0' }}>
              <div
                style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: 'var(--ink)',
                  color: '#fff',
                  display: 'grid',
                  placeItems: 'center',
                  margin: '0 auto 20px',
                  fontSize: '24px',
                }}
              >
                ✓
              </div>
              <p className="eyebrow" style={{ color: 'var(--muted)' }}>Sample Order Dispatched</p>
              {orderNumber && (
                <div style={{ display: 'inline-block', margin: '0 auto 16px', background: '#dcd7cd', border: '1px solid var(--line)', padding: '6px 14px', fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  Reference: <strong>{orderNumber}</strong>
                </div>
              )}
              <h2 style={{ fontSize: '28px', fontWeight: 400, margin: '0 0 16px', lineHeight: 1.2 }}>
                Specimen box on its way to <i>{formData.studio || formData.name}.</i>
              </h2>
              <p style={{ fontSize: '14px', lineHeight: 1.65, color: '#5d665c', marginBottom: '32px' }}>
                We have logged your order for {shortlist.length} material specimens (100mm × 100mm). Our courier partner will deliver the sample box to <strong>{formData.address}, {formData.city}</strong> within 48–72 hours.
              </p>
              <button className="button button-dark" onClick={handleReset} style={{ justifyContent: 'center' }}>
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
                {shortlist.map((mat) => (
                  <div
                    key={mat.slug}
                    style={{
                      background: '#dcd7cd',
                      padding: '14px 16px',
                      border: '1px solid var(--line)',
                      display: 'grid',
                      gridTemplateColumns: '40px 1fr 24px',
                      alignItems: 'center',
                      gap: '14px',
                    }}
                  >
                    <div
                      className={`swatch ${mat.swatch}`}
                      style={{ width: '40px', height: '40px', border: '1px solid rgba(0,0,0,0.1)' }}
                    />
                    <div>
                      <strong style={{ display: 'block', fontSize: '14px', fontWeight: 500, color: 'var(--ink)' }}>
                        {mat.name}
                      </strong>
                      <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                        {mat.finish} · 12mm Specimen
                      </span>
                    </div>
                    <button
                      onClick={() => removeSample(mat.slug)}
                      style={{ fontSize: '18px', color: 'var(--muted)', cursor: 'pointer', background: 'none', border: 'none' }}
                      aria-label={`Remove ${mat.name}`}
                    >
                      ✕
                    </button>
                  </div>
                ))}
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
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
    </>
  );
}
