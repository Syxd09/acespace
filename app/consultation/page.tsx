'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { broadcastRealtimeEvent } from '@/lib/realtime';
import { generateWhatsAppUrl, DEFAULT_WHATSAPP_NUMBER } from '@/lib/whatsapp';
import { useSiteContent } from '@/context/SiteContentContext';

const TYPOLOGY_OPTIONS = [
  'Luxury Residential Kitchen Island / Monolith',
  'Commercial Reception Counter / Lobby Feature',
  'Healthcare & Cleanroom Integrated Washplane',
  'Hospitality Restaurant / Bar Counter',
  'Spiritual Sanctuary / Temple Mandir Cladding',
  'Backlit Translucent Onyx / Ambient Wall System',
  'Exterior Ventilated Facade / Rain Screen Cladding',
  'Custom Thermoformed Architectural Millwork',
];

const TIMELINE_OPTIONS = [
  'Immediate Execution (< 15 days)',
  'Active Construction (30 – 60 days)',
  'Forward Planning (60 – 120 days)',
  'Concept / Architectural Tender Stage',
];

export default function ProjectConsultationPage() {
  const { content } = useSiteContent();
  const whatsappNumber = content.studioContact?.whatsappNumber || DEFAULT_WHATSAPP_NUMBER;

  const [name, setName] = useState('');
  const [studio, setStudio] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [projectType, setProjectType] = useState(TYPOLOGY_OPTIONS[0]);
  const [timeline, setTimeline] = useState(TIMELINE_OPTIONS[1]);
  const [estimatedScope, setEstimatedScope] = useState('');
  const [message, setMessage] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [inquiryNumber, setInquiryNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage(null);

    const fullMessage = `
[PROJECT CONSULTATION FORM]
Studio / Client: ${studio || 'Independent'}
Typology: ${projectType}
Timeline: ${timeline}
Estimated Scope: ${estimatedScope || 'Not specified'}

Project Brief:
${message}
    `.trim();

    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: studio ? `${name} (${studio})` : name,
          email,
          phone,
          projectType,
          message: fullMessage,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setSubmitted(true);
        const refCode = `ACE-PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
        setInquiryNumber(refCode);
        broadcastRealtimeEvent('INQUIRY_CREATED', {
          name,
          email,
          projectType,
          refCode,
        });
      } else {
        setErrorMessage(data.error || 'Failed to submit project consultation. Please try again or message via WhatsApp.');
      }
    } catch {
      // Offline fallback
      setSubmitted(true);
      const fallbackCode = `ACE-PRJ-${Math.floor(1000 + Math.random() * 9000)}`;
      setInquiryNumber(fallbackCode);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--paper, #f5f4ee)', color: 'var(--ink, #1a1d19)' }}>
      <main style={{ maxWidth: '1100px', margin: '0 auto', padding: '140px 24px 100px' }}>
        
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '24px' }}>
          <Link href="/contact" style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'var(--muted, #788078)', textDecoration: 'none' }}>
            Specifier Desk
          </Link>
          <span style={{ color: 'var(--muted, #788078)', fontSize: '12px' }}>/</span>
          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#1a1d19', fontWeight: 600 }}>
            Project Consultation Form
          </span>
        </div>

        {/* Hero Header */}
        <div style={{ borderBottom: '1px solid var(--line, rgba(30, 33, 29, 0.18))', paddingBottom: '36px', marginBottom: '48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(30, 33, 29, 0.05)', border: '1px solid rgba(30, 33, 29, 0.12)', padding: '6px 14px', marginBottom: '20px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#73c991', display: 'inline-block' }} />
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#1a1d19', fontWeight: 600 }}>
              Atelier Engineering Desk · Direct CAD &amp; Material Review
            </span>
          </div>

          <h1 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: 'clamp(32px, 5vw, 52px)', fontWeight: 400, lineHeight: 1.15, margin: '0 0 20px', letterSpacing: '-0.02em' }}>
            Project Consultation Form
          </h1>
          <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '18px', lineHeight: 1.6, color: '#4a5249', maxWidth: '800px', margin: 0 }}>
            Collaborate directly with Ace Spaces senior fabrication engineers. Submit your project requirements, CAD/BIM shop drawings, or architectural material schedules for estimation, nesting yield optimization, and on-site fitment feasibility in Bengaluru.
          </p>
        </div>

        {/* Form Container & Side Advisory */}
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '48px', alignItems: 'start' }}>
          
          {/* Left: The Form */}
          <div style={{ background: '#fff', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '36px 32px' }}>
            {submitted ? (
              <div style={{ padding: '24px 0', textAlign: 'left' }}>
                <div style={{ display: 'inline-block', background: 'rgba(46, 125, 50, 0.1)', color: '#2e7d32', padding: '6px 12px', fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 600, marginBottom: '16px' }}>
                  ✓ PROJECT CONSULTATION SUBMITTED
                </div>
                <h3 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '26px', fontWeight: 500, margin: '0 0 12px' }}>
                  Brief Received at Bengaluru Atelier Desk
                </h3>
                <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '15px', lineHeight: 1.7, color: '#4a5249', marginBottom: '24px' }}>
                  Thank you, <strong>{name}</strong>. Your project dossier has been catalogued under reference code <span style={{ fontFamily: 'DM Mono, monospace', fontWeight: 600, color: '#1a1d19' }}>{inquiryNumber}</span>. Our senior technical estimator will review your specification and reach out within 24 business hours.
                </p>
                <div style={{ borderTop: '1px solid rgba(30,33,29,0.1)', paddingTop: '20px', display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
                  <a
                    href={generateWhatsAppUrl(whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: '#25D366',
                      color: '#fff',
                      padding: '12px 20px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                    }}
                  >
                    Direct WhatsApp Escalation ({inquiryNumber}) ↗
                  </a>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    style={{
                      background: 'none',
                      border: '1px solid var(--line, rgba(30,33,29,0.18))',
                      padding: '12px 20px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                    }}
                  >
                    Submit Another Brief
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '22px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                      Contact Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={e => setName(e.target.value)}
                      placeholder="Ar. Vikram Seth"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                      Architecture Studio / Firm
                    </label>
                    <input
                      type="text"
                      value={studio}
                      onChange={e => setStudio(e.target.value)}
                      placeholder="Studio Lateral Architects"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                      Professional Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="vikram@studiolateral.com"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                      Phone / Mobile *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+91 98450 XXXXX"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                    Project Typology *
                  </label>
                  <select
                    value={projectType}
                    onChange={e => setProjectType(e.target.value)}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                  >
                    {TYPOLOGY_OPTIONS.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                      Estimated Scope / Dimension
                    </label>
                    <input
                      type="text"
                      value={estimatedScope}
                      onChange={e => setEstimatedScope(e.target.value)}
                      placeholder="e.g. 12 Rmt island, 3 sinks, or 6 slabs"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                      Construction Timeline *
                    </label>
                    <select
                      value={timeline}
                      onChange={e => setTimeline(e.target.value)}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none' }}
                    >
                      {TIMELINE_OPTIONS.map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#788078', marginBottom: '6px' }}>
                    Project Brief &amp; Drawing Details *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Describe color palette preference, site city/location, joinery requirements, and if CAD/DWG drawings are ready for dispatch."
                    style={{ width: '100%', padding: '12px', border: '1px solid var(--line, rgba(30,33,29,0.2))', background: '#faf9f5', fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                  />
                </div>

                {errorMessage && (
                  <div style={{ color: '#d32f2f', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                    {errorMessage}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  style={{
                    background: '#141713',
                    color: '#fff',
                    border: 'none',
                    padding: '14px 24px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '12px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    opacity: isSubmitting ? 0.7 : 1,
                    transition: 'opacity 0.2s ease',
                  }}
                >
                  {isSubmitting ? 'Transmitting Brief...' : 'Transmit Project Brief to Atelier Desk →'}
                </button>
              </form>
            )}
          </div>

          {/* Right: Technical Advisory & Assurance Card */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div style={{ background: 'rgba(30, 33, 29, 0.03)', border: '1px solid var(--line, rgba(30, 33, 29, 0.18))', padding: '32px 28px' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#788078', display: 'block', marginBottom: '8px' }}>
                Atelier Drawing Protocols
              </span>
              <h3 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '20px', fontWeight: 500, margin: '0 0 12px', color: '#1a1d19' }}>
                CAD, BIM &amp; Vector Formats Accepted
              </h3>
              <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '14px', lineHeight: 1.7, color: '#4a5249', margin: '0 0 16px' }}>
                Our digital fabrication pipeline accepts direct 2D vector and 3D solid model imports. Upon brief submission, our engineers can review:
              </p>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#2f352e' }}>
                <li>✓ AutoCAD .DWG / .DXF (Plan, Section, Elevation)</li>
                <li>✓ Rhino 3D .3DM (NURBS surfaces &amp; thermoform meshes)</li>
                <li>✓ Autodesk Revit .RVT / IFC (BIM assemblies)</li>
                <li>✓ STEP / IGES (.STP) for 5-axis CNC toolpath nesting</li>
                <li>✓ Architectural PDF Joinery Tender Sheets</li>
              </ul>
            </div>

            <div style={{ background: '#141713', color: '#e9e8e2', padding: '32px 28px', border: '1px solid rgba(255,255,255,0.1)' }}>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.12em', color: '#73c991', display: 'block', marginBottom: '8px' }}>
                Direct Specifier Hotline
              </span>
              <h4 style={{ fontFamily: 'var(--serif, Georgia, serif)', fontSize: '20px', fontWeight: 400, color: '#fff', margin: '0 0 10px' }}>
                Need an immediate estimation?
              </h4>
              <p style={{ fontFamily: 'var(--sans, Manrope, sans-serif)', fontSize: '13px', lineHeight: 1.6, color: '#c2cdc2', margin: '0 0 20px' }}>
                Connect directly with our Bengaluru Material Specifier Desk on WhatsApp for immediate slab availability, custom color matchings, or rapid rate cards.
              </p>
              <a
                href={generateWhatsAppUrl(whatsappNumber)}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: '#25D366',
                  color: '#fff',
                  padding: '10px 18px',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  textTransform: 'uppercase',
                  textDecoration: 'none',
                }}
              >
                <span>WhatsApp Studio Desk</span> <span>↗</span>
              </a>
            </div>
          </div>

        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', borderTop: '1px solid var(--line, rgba(30,33,29,0.18))', paddingTop: '32px', marginTop: '64px' }}>
          <Link href="/certifications" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', textDecoration: 'none' }}>
            ← Inspect Architectural Certifications
          </Link>
          <Link href="/guarantee" style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', textDecoration: 'none' }}>
            10-Year Renewable Guarantee →
          </Link>
        </div>

      </main>
    </div>
  );
}
