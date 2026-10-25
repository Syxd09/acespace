'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// ── 1. MACHINERY FLEET DATA ──────────────────────────────────────────
interface MachineSpec {
  id: string;
  code: string;
  name: string;
  category: string;
  highlight: string;
  quote: string;
  description: string;
  parameters: { label: string; value: string }[];
  architecturalBenefit: string;
  image: string;
}

const machineryFleet: MachineSpec[] = [
  {
    id: 'cnc',
    code: 'RIG-01',
    name: '5-Axis High-Speed Industrial CNC Router',
    category: 'Sub-Millimeter Robotic Milling',
    highlight: '< 0.2mm positional repeatability across full 3660mm beds',
    quote: 'Robotic precision to under 0.2mm. Direct from 3D CAD to cut.',
    description:
      'Nested CAD/BIM cutouts, undercut rebates, integral drainboards, and flush cooktop recessing.',
    parameters: [
      { label: 'Working Bed Envelope', value: '3700 × 1600 × 400 mm' },
      { label: 'Positional Tolerance', value: '±0.18 mm' },
      { label: 'Spindle Velocity', value: '24,000 RPM Liquid-Cooled' },
      { label: 'Tooling Library', value: '16-Station Auto Changer' },
    ],
    architecturalBenefit:
      'Direct specification from 3D Rhino or Revit models with zero manual approximation.',
    image: '/images/images/app_residential_calacatta_greige_2.jpg',
  },
  {
    id: 'thermo',
    code: 'RIG-02',
    name: 'Dual-Platen Vacuum Membrane Thermoformer',
    category: 'Thermal Plasticization & 3D Bending',
    highlight: 'Homogeneous heating to 160°C for compound radii down to 25mm',
    quote: 'Curvature born at 160°C. 25mm tight compound radii without blanching.',
    description:
      'Uniform infrared platen heating draws pliable mineral sheets over CNC timber formwork.',
    parameters: [
      { label: 'Thermal Band', value: '155°C – 165°C Calibrated' },
      { label: 'Min Inside Radius', value: '25 mm (1.0 inch)' },
      { label: 'Vacuum Pressure', value: '9.2 Tonnes/m²' },
      { label: 'Forming Envelope', value: '3600 × 1300 mm Dual-Bed' },
    ],
    architecturalBenefit:
      'Continuous organic flutes, curved plinths, and ergonomic reception monoliths.',
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
  },
  {
    id: 'seam',
    code: 'RIG-03',
    name: 'Reactive Methacrylate Fusion Rig',
    category: 'Molecular Joint Chemistry',
    highlight: 'Chemical cross-linking that renders joints 100% invisible & homogeneous',
    quote: 'Two mineral sheets. One continuous body. Zero visible joint lines.',
    description:
      'Color-matched reactive adhesives dissolve the joint interface into a single geological cross-section.',
    parameters: [
      { label: 'Joint Thickness', value: '0.00 mm (True Fusion)' },
      { label: 'Tensile Strength', value: '> 32 MPa (Exceeds Slab)' },
      { label: 'Formulation', value: 'Color-Matched PMMA' },
      { label: 'Bacterial Ingress', value: '0.00% (Hermetic Seal)' },
    ],
    architecturalBenefit:
      'Massive 10-meter continuous monolithic expanses that read as a single carving.',
    image: '/images/images/app_residential_calacatta_greige_1.jpg',
  },
  {
    id: 'honing',
    code: 'RIG-04',
    name: '5-Stage Micro-Abrasive Diamond Honing Suite',
    category: 'Dust-Free Progressive Surface Finishing',
    highlight: 'Graduated 120 to 600-grit protocol for anti-glare velvety satin tactile touch',
    quote: 'A light-absorbing, velvety touch honed from 120 to 600-grit.',
    description:
      'Orbital diamond abrasives yield an ultra-smooth, matte finish that diffuses light evenly.',
    parameters: [
      { label: 'Progression', value: '120 → 240 → 400 → 600 Grit' },
      { label: 'Surface Sheen', value: 'Velvety Matte (12–18 GU)' },
      { label: 'In-Situ Renewability', value: '100% Restorable' },
      { label: 'Dust Extraction', value: 'H14 Class HEPA Multi-Point' },
    ],
    architecturalBenefit:
      'A warm-to-touch surface that diffuses architectural downlighting without specular glare.',
    image: '/assets/material-macro.png',
  },
];

// ── 2. SEAM COMPARISON DATA ──────────────────────────────────────────
const seamComparisons = [
  {
    metric: 'Visible Seam Width',
    traditional: '2.0 mm to 3.5 mm grout or silicone line',
    aceSpaces: '0.0 mm (Molecularly fused invisible join)',
    advantage: 'Eliminates visible grid lines and spatial fragmentation',
  },
  {
    metric: 'Bacterial Ingress & Porosity',
    traditional: 'Porous grout traps mildew, grease, and bacteria',
    aceSpaces: 'ISO 846 Class 0 (Zero bacterial or mold growth)',
    advantage: 'Hermetic hygiene certified for surgical & culinary use',
  },
  {
    metric: 'Thermal Movement Behavior',
    traditional: 'Differential movement causes brittle joint cracking',
    aceSpaces: 'Uniform homogeneous coefficient across the seam',
    advantage: 'Zero delamination or seam pop-off over decades',
  },
  {
    metric: 'Edge Mitres & Waterfalls',
    traditional: 'Vulnerable razor-sharp edges prone to chipping',
    aceSpaces: '45° thermo-welded origami mitres with eased apex',
    advantage: 'Impact-resistant and soft to human contact',
  },
  {
    metric: 'Long-Term Renewal',
    traditional: 'Damaged stone seams require slab replacement',
    aceSpaces: '100% renewable on-site in minutes via micro-honing',
    advantage: 'Permanent day-one restoration without demolition',
  },
];

// ── 3. ARCHITECTURAL TYPOLOGIES DATA ─────────────────────────────────
interface Typology {
  id: string;
  name: string;
  badge: string;
  specs: string;
  quote: string;
  description: string;
  capabilities: string[];
  image: string;
}

const typologies: Typology[] = [
  {
    id: 'islands',
    name: 'Monolithic Waterfall Islands',
    badge: 'Residential & Penthouse',
    specs: 'Seamless 45° Origami Mitres • Sub-Surface Induction • Integrated Coved Sinks',
    quote: 'Horizontal worktops and vertical waterfall returns flow as one uninterrupted plane.',
    description:
      'Eliminates perimeter silicone joints entirely with integrated coved basins and flush appliances.',
    capabilities: [
      '45° origami internal aluminum reinforcement',
      'Undermount cooktop rebates & wireless Qi charging',
      'Sloping drainer grooves milled into slab',
      'Zero-step transition over mitred edge drops',
    ],
    image: '/images/images/app_residential_calacatta_greige_2.jpg',
  },
  {
    id: 'receptions',
    name: 'Curved Reception Monoliths',
    badge: 'Commercial & Hospitality',
    specs: 'Thermoformed Organic Compound Radii • 25mm Tight Bends • Cantilever Sub-Chassis',
    quote: 'Heated and shaped over custom CNC bucks into fluid, compound curves and flutes.',
    description:
      'Transforms corporate atriums and hotel lobbies into sculptural architectural statements.',
    capabilities: [
      'Internal structural steel space-frame engineering',
      'Curved modesty panels with zero visual faceting',
      'Concealed magnetic push-latch service panels',
      'White-glove sectioned site delivery & seamless weld',
    ],
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
  },
  {
    id: 'backlit',
    name: 'Backlit Reliefs & Feature Walls',
    badge: 'Lounges & Luxury Clubs',
    specs: 'Variable CNC Relief Routing • Sub-Surface LED Cavities • Optical Diffusion',
    quote: 'Calibrated relief depth controls translucent light transmission across the slab.',
    description:
      'Warm ambient 3000K illumination reveals bespoke geometric reliefs with zero LED diode hot spots.',
    capabilities: [
      '4mm to 8mm calibrated relief milling',
      'Rear optical dispersion chambers for heat control',
      'Modular dry-hang French cleat sub-framing',
      'Even chromatic diffusion without hotspot glare',
    ],
    image: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
  },
  {
    id: 'clinical',
    name: 'Hermetic Cleanroom Linings',
    badge: 'Healthcare & Sterile Suites',
    specs: 'ISO 846 Class 0 • Seamless Coved Wall Transitions • Zero Silicone Joints',
    quote: '10mm coved transitions that eliminate silicone joints and microbial harborage.',
    description:
      'Certified non-porous and chemical-immune for surgical suites, scrub stations, and diagnostic labs.',
    capabilities: [
      'DIN 68861 chemical immunity against harsh reagents',
      'Hands-free surgical troughs & sensor spouts',
      'Monolithic vertical wet-walls up to ceiling soffits',
      'Certified 100% zero crystalline silica',
    ],
    image: '/images/images/coriansolidsurface-silverlinear-hospitality-application.jpg',
  },
];

// ── 4. TECHNICAL FEASIBILITY MATRIX / CALCULATOR ────────────────────
export default function FabricationExplorer() {
  const [activeMachine, setActiveMachine] = useState<string>('cnc');
  const [activeTypology, setActiveTypology] = useState<string>('islands');

  const currentMachine = machineryFleet.find((m) => m.id === activeMachine) || machineryFleet[0];
  const currentTypology = typologies.find((t) => t.id === activeTypology) || typologies[0];

  return (
    <div style={{ width: '100%' }}>
      {/* ── SECTION A: INTERACTIVE MACHINERY FLEET (COMPACT ONE-SCREEN CONSOLE) ── */}
      <section
        id="capabilities"
        className="fabrication-console-section"
        style={{
          marginBottom: '50px',
          padding: '20px 26px',
          background: 'rgba(255, 255, 255, 0.88)',
          border: '1px solid var(--line)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {/* Top Header & Tabs Bar in Single Row */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '12px',
            paddingBottom: '12px',
            marginBottom: '16px',
            borderBottom: '1px solid var(--line)',
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--ink)' }} />
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.08em' }}>
                Atelier Equipment Fleet · Bengaluru
              </span>
            </div>
            <h2 style={{ fontSize: 'clamp(19px, 2.2vw, 26px)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: 0 }}>
              The industrial machinery <i>behind the seamless plane.</i>
            </h2>
          </div>

          {/* Compact Machinery Selection Tabs */}
          <div className="fabrication-machine-tabs">
            {machineryFleet.map((machine) => {
              const isSelected = activeMachine === machine.id;
              return (
                <button
                  key={machine.id}
                  type="button"
                  onClick={() => setActiveMachine(machine.id)}
                  style={{
                    padding: '7px 11px',
                    background: isSelected ? 'var(--ink)' : 'rgba(30, 33, 29, 0.04)',
                    color: isSelected ? '#ffffff' : 'var(--ink)',
                    border: isSelected ? '1px solid var(--ink)' : '1px solid var(--line)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <span style={{ opacity: isSelected ? 0.85 : 0.5 }}>{machine.code}</span>
                  <span>{machine.name.split(' ')[0]} {machine.name.split(' ')[1]}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Machine Detailed Card (Tight 2-Column Console) */}
        <div className="fabrication-machine-card">
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>
                {currentMachine.code} · {currentMachine.category}
              </span>
              <h3 style={{ fontSize: 'clamp(17px, 1.7vw, 22px)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--ink)' }}>
                {currentMachine.name}
              </h3>
              <blockquote style={{ fontSize: '14px', fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.45, color: '#1e211d', margin: '0 0 8px', paddingLeft: '8px', borderLeft: '2px solid var(--brand-red, #d43833)' }}>
                “{currentMachine.quote}”
              </blockquote>
              <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#4a5249', margin: '0 0 10px' }}>
                {currentMachine.description}
              </p>

              {/* Technical Parameter Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, 1fr)',
                  gap: '6px 12px',
                  padding: '10px 12px',
                  background: 'rgba(30, 33, 29, 0.03)',
                  border: '1px solid var(--line)',
                  marginBottom: '10px',
                }}
              >
                {currentMachine.parameters.map((param, idx) => (
                  <div key={idx}>
                    <span style={{ display: 'block', fontSize: '8px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1px' }}>
                      {param.label}
                    </span>
                    <strong style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--ink)' }}>
                      {param.value}
                    </strong>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ borderLeft: '2px solid var(--ink)', paddingLeft: '10px', background: 'rgba(30, 33, 29, 0.02)', padding: '6px 10px' }}>
              <span style={{ display: 'block', fontSize: '8.5px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '1px' }}>
                Architectural Specifier Benefit
              </span>
              <p style={{ fontSize: '11px', lineHeight: 1.4, color: '#555e54', margin: 0 }}>
                {currentMachine.architecturalBenefit}
              </p>
            </div>
          </div>

          {/* Machine Specimen Frame (Controlled Compact Height) */}
          <div
            style={{
              position: 'relative',
              minHeight: '220px',
              height: '255px',
              width: '100%',
              border: '1px solid var(--line)',
              overflow: 'hidden',
              background: '#e0ded8',
            }}
          >
            <Image
              src={currentMachine.image}
              alt={currentMachine.name}
              fill
              sizes="(max-width: 768px) 100vw, 45vw"
              quality={75}
              style={{ objectFit: 'cover' }}
            />
            <div
              style={{
                position: 'absolute',
                bottom: '6px',
                left: '6px',
                right: '6px',
                background: 'rgba(23, 26, 23, 0.90)',
                backdropFilter: 'blur(8px)',
                padding: '6px 10px',
                color: '#fff',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontFamily: 'DM Mono, monospace',
                fontSize: '9px',
              }}
            >
              <span>{currentMachine.code} FABRICATION OUTPUT</span>
              <span>CERTIFIED ATELIER TOLERANCE ✓</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION B: SEAM TECHNOLOGY COMPARISON MATRIX ── */}
      <section
        id="joint-chemistry"
        style={{
          marginBottom: '50px',
        }}
      >
        <div style={{ maxWidth: '800px', marginBottom: '20px' }}>
          <p className="eyebrow" style={{ marginBottom: '6px' }}>0.0mm Molecular Fusion vs. Traditional Stone</p>
          <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
            Why seams fail in stone,
            <br />
            <i>and why ours never do.</i>
          </h2>
          <blockquote style={{ fontSize: '16px', fontStyle: 'italic', fontFamily: 'serif', color: '#1e211d', margin: '0 0 12px', paddingLeft: '10px', borderLeft: '2px solid var(--brand-red, #d43833)' }}>
            “Traditional stone fractures at the grout line. Ace Spaces chemically welds sheets into a single, continuous geological body.”
          </blockquote>
        </div>

        {/* Visual Seam Comparison Cards (Instant Contrast) */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '24px' }}>
          <div style={{ padding: '16px 18px', background: '#ffffff', border: '1px solid var(--line)', borderTop: '3px solid var(--brand-red, #d43833)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>01 / Seam Width</span>
            <div style={{ margin: '8px 0 4px', fontSize: '20px', fontWeight: 600, color: 'var(--ink)' }}>0.00 mm</div>
            <p style={{ fontSize: '12px', color: '#687268', margin: 0 }}>Molecular fusion dissolves joint line entirely vs. 2.5mm traditional grout line.</p>
          </div>
          <div style={{ padding: '16px 18px', background: '#ffffff', border: '1px solid var(--line)', borderTop: '3px solid #22c55e', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>02 / Hygiene Barrier</span>
            <div style={{ margin: '8px 0 4px', fontSize: '20px', fontWeight: 600, color: 'var(--ink)' }}>ISO 846 Class 0</div>
            <p style={{ fontSize: '12px', color: '#687268', margin: 0 }}>Zero bacterial, fungal or mold growth. 100% hermetic culinary &amp; surgical surface.</p>
          </div>
          <div style={{ padding: '16px 18px', background: '#ffffff', border: '1px solid var(--line)', borderTop: '3px solid var(--ink)', boxShadow: '0 2px 10px rgba(0,0,0,0.03)' }}>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', color: 'var(--muted)' }}>03 / Longevity</span>
            <div style={{ margin: '8px 0 4px', fontSize: '20px', fontWeight: 600, color: 'var(--ink)' }}>100% Renewable</div>
            <p style={{ fontSize: '12px', color: '#687268', margin: 0 }}>On-site micro-honing restores day-one stillness without demolition.</p>
          </div>
        </div>

        {/* Comparison Table with Mobile Scroll Container */}
        <div className="fabrication-table-scroll-container">
          <div className="fabrication-scroll-hint">
            <span>← Swipe horizontally to inspect full molecular specification matrix →</span>
          </div>
          <div className="fabrication-table-scroll-inner">
            <table className="fabrication-seam-table">
              <thead>
                <tr style={{ background: '#f5f3ee', borderBottom: '1px solid var(--line)' }}>
                  <th style={{ padding: '12px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    Technical Parameter
                  </th>
                  <th style={{ padding: '12px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#888', whiteSpace: 'nowrap' }}>
                    Traditional Marble &amp; Quartz
                  </th>
                  <th style={{ padding: '12px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink)', background: 'rgba(37,63,42,0.08)', whiteSpace: 'nowrap' }}>
                    ★ Ace Spaces Molecular Joint
                  </th>
                  <th style={{ padding: '12px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    Architectural Impact
                  </th>
                </tr>
              </thead>
              <tbody>
                {seamComparisons.map((row, idx) => (
                  <tr
                    key={idx}
                    style={{
                      borderBottom: '1px solid var(--line)',
                      background: idx % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)',
                    }}
                  >
                    <td style={{ padding: '12px 14px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                      {row.metric}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#7a7a7a', textDecoration: 'line-through' }}>
                      {row.traditional}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#1a3821', fontWeight: 600, background: 'rgba(37,63,42,0.05)' }}>
                      ✓ {row.aceSpaces}
                    </td>
                    <td style={{ padding: '12px 14px', color: '#555e54', fontSize: '11.5px' }}>
                      {row.advantage}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ── SECTION C: ARCHITECTURAL FABRICATION TYPOLOGIES ── */}
      <section
        id="typologies"
        style={{
          marginBottom: '50px',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '12px', marginBottom: '18px' }}>
          <div>
            <p className="eyebrow" style={{ marginBottom: '4px' }}>Atelier Specialization Typologies</p>
            <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', margin: 0 }}>
              Engineered spatial <i>assemblies.</i>
            </h2>
          </div>
          <p style={{ maxWidth: '380px', fontSize: '13px', color: '#5d665c', lineHeight: 1.5, margin: 0 }}>
            Select an architectural typology to inspect how custom sub-framing, laser templating, and precision joinery converge.
          </p>
        </div>

        {/* Typology Selector Tabs */}
        <div className="fabrication-typology-selector">
          {typologies.map((item) => {
            const isSelected = activeTypology === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTypology(item.id)}
                className="fabrication-typology-btn"
                style={{
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                }}
              >
                <span className="fabrication-typology-badge">
                  {item.badge}
                </span>
                <strong className="fabrication-typology-name">
                  {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Detailed Typology Showcase Frame */}
        <div className="fabrication-typology-showcase">
          <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '3px 6px', background: 'rgba(30,33,29,0.06)', fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                {currentTypology.badge}
              </span>
              <h3 style={{ fontSize: '20px', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 8px' }}>
                {currentTypology.name}
              </h3>
              <blockquote style={{ fontSize: '14.5px', fontStyle: 'italic', fontFamily: 'serif', lineHeight: 1.45, color: '#1e211d', margin: '0 0 10px', paddingLeft: '8px', borderLeft: '2px solid var(--brand-red, #d43833)' }}>
                “{currentTypology.quote}”
              </blockquote>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10.5px', color: '#7a8479', marginBottom: '10px' }}>
                {currentTypology.specs}
              </div>
              <p style={{ fontSize: '12px', lineHeight: 1.5, color: '#4a5249', marginBottom: '14px' }}>
                {currentTypology.description}
              </p>

              <span style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '8px' }}>
                Key Engineering Highlights:
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {currentTypology.capabilities.map((cap, i) => (
                  <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '4px 8px', background: '#f5f3ee', border: '1px solid rgba(30,33,29,0.1)', fontSize: '11px', color: '#2e352d', borderRadius: '2px' }}>
                    <strong style={{ color: 'var(--brand-red, #d43833)', fontSize: '10px' }}>✓</strong> {cap}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--line)' }}>
              <Link className="button button-dark" href="/contact" style={{ padding: '9px 18px', fontSize: '11px' }}>
                Consult on {currentTypology.name.split(' ')[0]} <span>↗</span>
              </Link>
            </div>
          </div>

          <div style={{ position: 'relative', minHeight: '260px', maxHeight: '320px', background: '#ece8df' }}>
            <Image
              src={currentTypology.image}
              alt={currentTypology.name}
              fill
              sizes="(max-width: 800px) 100vw, 50vw"
              quality={75}
              style={{ objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      {/* ── SECTION D: 5-STAGE PROTOCOL & CHAIN OF CUSTODY ── */}
      <section style={{ marginBottom: '60px' }}>
        <p className="eyebrow" style={{ marginBottom: '8px' }}>Chain of Custody &amp; Site Protocol</p>
        <h2 style={{ fontSize: 'clamp(24px, 3vw, 38px)', lineHeight: 1.1, letterSpacing: '-0.02em', margin: '0 0 20px' }}>
          From digital 3D model <i>to white-glove site delivery.</i>
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '12px' }}>
          {[
            {
              step: '01',
              title: '3D CAD & Unfolding',
              desc: 'Architectural models (Rhino, Revit, AutoCAD) are digitized and nested to optimize yield and align veining.',
            },
            {
              step: '02',
              title: 'On-Site 3D Scanning',
              desc: 'Laser coordinate templating maps wall plumbness, floor dips, and column reveals with millimeter fidelity.',
            },
            {
              step: '03',
              title: 'Trial Pre-Assembly',
              desc: 'Every complex volume is pre-clamped, dry-fitted, and inspected under studio raking light before dispatch.',
            },
            {
              step: '04',
              title: 'Crated Logistics',
              desc: 'Suspended in custom timber crates with protective micro-foam to eliminate transport vibration risks across India.',
            },
            {
              step: '05',
              title: 'Master Installation',
              desc: 'Certified joiners execute on-site seamless chemical welding, silicone-free coving, and final progressive honing.',
            },
          ].map((item, index) => (
            <div
              key={index}
              style={{
                padding: '18px 16px',
                background: '#ffffff',
                border: '1px solid var(--line)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '15px', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
                  {item.step}
                </span>
                <h4 style={{ fontSize: '13.5px', fontWeight: 600, margin: '0 0 6px', color: 'var(--ink)' }}>
                  {item.title}
                </h4>
                <p style={{ fontSize: '11.5px', lineHeight: 1.5, color: '#555e54', margin: 0 }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
