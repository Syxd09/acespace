'use client';

import React, { useState } from 'react';

interface EdgeProfile {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  visualDetail: string;
  idealFor: string;
  shadowQuality: string;
}

const edgeProfiles: EdgeProfile[] = [
  {
    id: 'shark-nose',
    name: 'Mitred Shark-Nose',
    subtitle: 'Contemporary floating edge',
    description: 'An undercut 45-degree angle that creates the visual illusion of a delicate, razor-thin floating worktop while concealing a reinforced 50mm solid sub-structure.',
    visualDetail: '45° reverse chamfer undercut with 12mm visible leading edge',
    idealFor: 'Contemporary kitchen islands, monolithic reception bars, executive credenzas',
    shadowQuality: 'Deep underside linear shadow band that detaches the counter from base cabinetry'
  },
  {
    id: 'square-micro',
    name: 'Square Micro-Radius',
    subtitle: 'Pure architectural precision',
    description: 'A crisp, rectilinear 90-degree edge softened with a precision 1.5mm to 2mm micro-radius to eliminate sharpness while preserving pure volumetric geometry.',
    visualDetail: '90° square profile with CNC 2mm pencil round softening',
    idealFor: 'Minimalist bath vanities, vertical wall panelling, modular conference tables',
    shadowQuality: 'Sharp, clean shadow definition with subtle specular light catching the apex'
  },
  {
    id: 'waterfall-cascade',
    name: 'Waterfall Mitred Cascade',
    subtitle: 'Continuous volumetric flow',
    description: 'A precision 45-degree compound mitre join connecting horizontal countertops to vertical gable ends with unbroken grain alignment.',
    visualDetail: '45° precision laser-mitred seamless joinery',
    idealFor: 'Free-standing kitchen islands, reception desk ends, retail plinths',
    shadowQuality: 'Zero seam line; the plane transitions seamlessly around the corner'
  },
  {
    id: 'soft-chamfer',
    name: 'Soft Bevelled Chamfer',
    subtitle: 'Tactile architectural presence',
    description: 'A calibrated 3mm to 6mm top chamfer that introduces a subtle angled facet, catching ambient downlight and offering a soft, ergonomic resting touch for the arm.',
    visualDetail: '45° top facet bevel with hand-honed satin finish',
    idealFor: 'Café counters, hospitality bars, collaborative workbench edges',
    shadowQuality: 'Dual light-break: top facet reflects overhead light while body recedes'
  },
  {
    id: 'integrated-cove',
    name: 'Integrated Cove Transition',
    subtitle: 'Seamless hygienic curvature',
    description: 'A continuous internal radius curve joining horizontal countertops to vertical backsplashes, eliminating all right-angle corners and silicone joints.',
    visualDetail: '10mm internal concave radius without seams',
    idealFor: 'Commercial kitchens, healthcare vanities, wet areas',
    shadowQuality: 'Smooth, unbroken gradient with zero dirt traps or grout lines'
  }
];

export default function EdgeProfileCatalog() {
  const [selectedEdge, setSelectedEdge] = useState<EdgeProfile>(edgeProfiles[0]);

  return (
    <div className="edge-profile-catalog" style={{ marginTop: '50px', marginBottom: '80px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(280px, 1fr) 1.5fr', gap: '40px', alignItems: 'start' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {edgeProfiles.map((edge) => (
            <button
              key={edge.id}
              type="button"
              onClick={() => setSelectedEdge(edge)}
              style={{
                textAlign: 'left',
                padding: '20px 24px',
                border: '1px solid var(--line)',
                background: selectedEdge.id === edge.id ? 'var(--ink)' : 'transparent',
                color: selectedEdge.id === edge.id ? '#fff' : 'var(--ink)',
                transition: 'all 0.25s ease',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <strong style={{ display: 'block', fontSize: '16px', fontWeight: 500 }}>{edge.name}</strong>
                <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', opacity: 0.7, textTransform: 'uppercase' }}>
                  {edge.subtitle}
                </span>
              </div>
              <span style={{ fontSize: '18px', opacity: selectedEdge.id === edge.id ? 1 : 0.4 }}>→</span>
            </button>
          ))}
        </div>

        <div
          style={{
            background: '#dcd7cd',
            padding: '40px',
            border: '1px solid var(--line)',
            minHeight: '380px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <span className="eyebrow" style={{ color: '#667066', marginBottom: '12px', display: 'block' }}>
              Edge Specification / {selectedEdge.id}
            </span>
            <h3 style={{ fontSize: '32px', fontWeight: 400, letterSpacing: '-0.04em', margin: '0 0 16px' }}>
              {selectedEdge.name}
            </h3>
            <p style={{ fontSize: '15px', lineHeight: 1.7, color: '#4a5249', marginBottom: '28px' }}>
              {selectedEdge.description}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', borderTop: '1px solid rgba(30,33,29,0.15)', paddingTop: '24px' }}>
            <div>
              <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                Geometry & Detail
              </span>
              <strong style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                {selectedEdge.visualDetail}
              </strong>
            </div>

            <div>
              <span style={{ display: 'block', fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: '4px' }}>
                Shadow & Light Interaction
              </span>
              <strong style={{ fontSize: '13px', fontWeight: 500, color: 'var(--ink)' }}>
                {selectedEdge.shadowQuality}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
