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
    description:
      'Engineered for complex parametric CAD/BIM cutouts, deep undercut rebates, integral drainboards, flush cooktop recessing, and sub-surface inductive charging pockets.',
    parameters: [
      { label: 'Working Bed Envelope', value: '3700 mm × 1600 mm × 400 mm' },
      { label: 'Positional Tolerance', value: '±0.18 mm' },
      { label: 'Spindle Velocity', value: '24,000 RPM Liquid-Cooled' },
      { label: 'Tooling Library', value: '16-Station Auto Tool Changer' },
    ],
    architecturalBenefit:
      'Allows architects to specify compound fluting, organic tapers, and sub-millimeter sink rebates directly from 3D Rhino or Revit models without manual approximation.',
    image: '/images/images/app_residential_calacatta_greige_2.jpg',
  },
  {
    id: 'thermo',
    code: 'RIG-02',
    name: 'Dual-Platen Vacuum Membrane Thermoformer',
    category: 'Thermal Plasticization & 3D Bending',
    highlight: 'Homogeneous heating to 160°C for compound radii down to 25mm',
    description:
      'Uniform infrared platen heating softens acrylic-mineral sheets evenly throughout their cross-section. Industrial silicone vacuum membranes draw the pliable material over CNC timber bucks without surface blanching or tensile stress.',
    parameters: [
      { label: 'Operating Thermal Band', value: '155°C – 165°C Calibrated' },
      { label: 'Min Inside Radius (12mm)', value: '25 mm (1.0 inch)' },
      { label: 'Membrane Clamping Force', value: '9.2 Tonnes/m² Vacuum' },
      { label: 'Forming Envelope', value: '3600 mm × 1300 mm Dual-Bed' },
    ],
    architecturalBenefit:
      'Bends rigid mineral sheets into continuous organic flutes, circular bar plinths, and ergonomic curved reception monoliths without mechanical joints.',
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
  },
  {
    id: 'seam',
    code: 'RIG-03',
    name: 'Reactive Methacrylate Fusion Rig',
    category: 'Molecular Joint Chemistry',
    highlight: 'Chemical cross-linking that renders joints 100% invisible & homogeneous',
    description:
      'Color-matched two-component reactive adhesives dissolve the joint interface at the polymer level. Once cured, the joint exhibits identical density, thermal expansion, and mechanical strength as the virgin sheet.',
    parameters: [
      { label: 'Joint Seam Thickness', value: '0.00 mm (True Molecular Fusion)' },
      { label: 'Tensile Bond Strength', value: '> 32 MPa (Exceeds Substrate)' },
      { label: 'Adhesive Formulation', value: 'Color-Matched PMMA Methacrylate' },
      { label: 'Water & Bacterial Ingress', value: '0.00% (Hermetic Sealing)' },
    ],
    architecturalBenefit:
      'Assembles 10-meter continuous monolithic reception desks and massive kitchen island expanses that read as a single geological carving with zero visible seams.',
    image: '/images/images/app_residential_calacatta_greige_1.jpg',
  },
  {
    id: 'honing',
    code: 'RIG-04',
    name: '5-Stage Micro-Abrasive Diamond Honing Suite',
    category: 'Dust-Free Progressive Surface Finishing',
    highlight: 'Graduated 120 to 600-grit protocol for anti-glare velvety satin tactile touch',
    description:
      'Progressive orbital diamond abrasives refine the surface under HEPA extraction. Eliminates microscopic machining marks to yield an ultra-smooth, light-diffusing matte finish that repels fingerprints and resists ambient glare.',
    parameters: [
      { label: 'Abrasive Progression', value: '120 → 180 → 240 → 400 → 600 Grit' },
      { label: 'Surface Sheen Spec', value: 'Velvety Matte (12–18 Gloss Units)' },
      { label: 'In-Situ Renewability', value: '100% Through-Body Restorable' },
      { label: 'Dust Extraction Standard', value: 'H14 Class HEPA Multi-Point' },
    ],
    architecturalBenefit:
      'Guarantees a soothing, warm-to-the-touch surface that diffuses architectural downlighting evenly without specular hotspots.',
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
  description: string;
  capabilities: string[];
  image: string;
}

const typologies: Typology[] = [
  {
    id: 'islands',
    name: 'Monolithic Waterfall Islands & Integrated Basins',
    badge: 'Residential & Penthouse Luxury',
    specs: 'Seamless 45° Origami Mitres • Sub-Surface Induction • Integrated Coved Sinks',
    description:
      'We engineer massive horizontal worktops with vertical waterfall returns where the grain and material flow continuously over edges without joint interruptions. Undermount or thermoformed integral sinks seamlessly merge into the plane, eliminating silicone perimeter seals entirely.',
    capabilities: [
      'Compound 45° internal timber & aluminum reinforcement ribs',
      'Undermount flush cooktop rebates and concealed wire conduits',
      'Integrated sloping drainer grooves milled directly into slab',
      'Zero-step transitions from horizontal bench to vertical drop',
    ],
    image: '/images/images/app_residential_calacatta_greige_2.jpg',
  },
  {
    id: 'receptions',
    name: 'Sculptural Curved Reception Monoliths & Plinths',
    badge: 'Commercial & Hospitality Atriums',
    specs: 'Thermoformed Organic Compound Radii • 25mm Tight Bends • Cantilever Sub-Chassis',
    description:
      'Transforming static corporate lobbies into memorable architectural statements. Heated and shaped over CNC buck tooling, our mineral surfaces bend into compound curves, fluted tambours, and sculptural greeting monoliths.',
    capabilities: [
      'Internal structural steel space-frame calculation and fabrication',
      'Curved modesty panels with zero visual faceting or flat spots',
      'Concealed maintenance access hatches with magnetic push-latches',
      'White-glove sectioned site delivery and on-site invisible seam weld',
    ],
    image: '/images/images/app_commercial_bleached_nuwood.jpg',
  },
  {
    id: 'backlit',
    name: 'Lumen Translucent Reliefs & Backlit Feature Walls',
    badge: 'Nocturnal Lounges & Luxury Hospitality',
    specs: 'Variable CNC Relief Routing • Sub-Surface LED Cavities • Optical Diffusion',
    description:
      'By varying the CNC cut depth across the rear of Lumen Translucent sheets, we calibrate the light transmission percentage. When backlit by 3000K LED panels, the surface reveals bespoke geometric motifs or soft glowing ambient gradients without hotspot artifacts.',
    capabilities: [
      'Sub-surface relief milling leaving 4mm to 8mm calibrated skins',
      'Rear optical dispersion chambers engineered for heat dissipation',
      'Modular dry-hang French cleat sub-framing for rapid LED service',
      'Even chromatic temperature diffusion without LED diode spotting',
    ],
    image: '/images/images/coriansolidsurface-goldenonyx-application.jpg',
  },
  {
    id: 'clinical',
    name: 'Hermetic Surgical Sinks & Cleanroom Linings',
    badge: 'Healthcare & Diagnostic Facilities',
    specs: 'ISO 846 Class 0 • Seamless Coved Wall Transitions • Zero Silicone Joints',
    description:
      'Designed for surgical scrub rooms, diagnostic laboratories, and sterile compounding suites where silicone joints are prohibited due to microbial growth risks. All internal corners feature 10mm integral coving, allowing easy wipe-down sanitization.',
    capabilities: [
      'DIN 68861 & SEFA 8 chemical immunity against hospital reagents',
      'Integrated medical sensor spouts and hands-free drainage troughs',
      'Monolithic vertical wet-wall cladding up to ceiling soffits',
      'Certified 100% zero crystalline silica for worker and patient safety',
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
          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(320px, 1.15fr) minmax(280px, 1fr)',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9.5px', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.06em', display: 'block', marginBottom: '2px' }}>
                {currentMachine.code} · {currentMachine.category}
              </span>
              <h3 style={{ fontSize: 'clamp(17px, 1.7vw, 22px)', lineHeight: 1.15, letterSpacing: '-0.02em', margin: '0 0 6px', color: 'var(--ink)' }}>
                {currentMachine.name}
              </h3>
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
              minHeight: '240px',
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
          <p style={{ fontSize: '13.5px', lineHeight: 1.55, color: '#4a5249', margin: 0 }}>
            Natural stone, quartz, and porcelain inevitably rely on cold-curing silicone or epoxy joints that harbor grime and delaminate under movement. Our PMMA reactive adhesive physically dissolves and welds sheets into a single, homogeneous cross-section.
          </p>
        </div>

        {/* Comparison Table */}
        <div
          style={{
            border: '1px solid var(--line)',
            background: '#ffffff',
            overflowX: 'auto',
          }}
        >
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              textAlign: 'left',
              fontSize: '12px',
            }}
          >
            <thead>
              <tr style={{ background: '#f5f3ee', borderBottom: '1px solid var(--line)' }}>
                <th style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  Technical Parameter
                </th>
                <th style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#888' }}>
                  Traditional Marble & Quartz
                </th>
                <th style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--ink)', background: 'rgba(37,63,42,0.08)' }}>
                  ★ Ace Spaces Molecular Joint
                </th>
                <th style={{ padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: 'var(--muted)' }}>
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
                  <td style={{ padding: '10px 14px', fontWeight: 600, color: 'var(--ink)', whiteSpace: 'nowrap' }}>
                    {row.metric}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#7a7a7a', textDecoration: 'line-through' }}>
                    {row.traditional}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#1a3821', fontWeight: 600, background: 'rgba(37,63,42,0.05)' }}>
                    ✓ {row.aceSpaces}
                  </td>
                  <td style={{ padding: '10px 14px', color: '#555e54', fontSize: '11.5px' }}>
                    {row.advantage}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '8px',
            marginBottom: '16px',
          }}
        >
          {typologies.map((item) => {
            const isSelected = activeTypology === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTypology(item.id)}
                style={{
                  padding: '10px 12px',
                  textAlign: 'left',
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.45)',
                  border: isSelected ? '2px solid var(--ink)' : '1px solid var(--line)',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{ display: 'block', fontSize: '8.5px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '2px' }}>
                  {item.badge}
                </span>
                <strong style={{ display: 'block', fontSize: '12px', color: 'var(--ink)', lineHeight: 1.25 }}>
                  {item.name.split(' ')[0]} {item.name.split(' ')[1]}
                </strong>
              </button>
            );
          })}
        </div>

        {/* Detailed Typology Showcase Frame */}
        <div
          style={{
            border: '1px solid var(--line)',
            background: '#ffffff',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            overflow: 'hidden',
          }}
        >
          <div style={{ padding: '24px 22px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span style={{ display: 'inline-block', padding: '3px 6px', background: 'rgba(30,33,29,0.06)', fontFamily: 'DM Mono, monospace', fontSize: '9.5px', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '8px' }}>
                {currentTypology.badge}
              </span>
              <h3 style={{ fontSize: '20px', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 6px' }}>
                {currentTypology.name}
              </h3>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10.5px', color: '#7a8479', marginBottom: '10px' }}>
                {currentTypology.specs}
              </div>
              <p style={{ fontSize: '12.5px', lineHeight: 1.5, color: '#4a5249', marginBottom: '14px' }}>
                {currentTypology.description}
              </p>

              <span style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '6px' }}>
                Engineering & Fabrication Protocols:
              </span>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                {currentTypology.capabilities.map((cap, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'baseline', gap: '8px', fontSize: '12px', color: '#333' }}>
                    <span style={{ fontFamily: 'DM Mono, monospace', color: 'var(--ink)', fontSize: '10px' }}>0{i + 1}.</span>
                    <span>{cap}</span>
                  </div>
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
