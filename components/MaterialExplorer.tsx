'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { materials, Material } from '@/data/materials';
import MaterialModal from '@/components/MaterialModal';
import { useSampleShortlist } from '@/context/SampleContext';

export default function MaterialExplorer() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeModalMaterial, setActiveModalMaterial] = useState<Material | null>(null);
  const { addSample, isShortlisted, removeSample, toggleTray } = useSampleShortlist();

  const filteredMaterials = selectedType === 'all'
    ? materials
    : materials.filter((m) => m.type === selectedType);

  const filterTabs = [
    { id: 'all', label: 'All Materials', count: materials.length },
    { id: 'mineral', label: 'Mineral Field', count: materials.filter((m) => m.type === 'mineral').length },
    { id: 'veined', label: 'Veined & Movement', count: materials.filter((m) => m.type === 'veined').length },
    { id: 'textured', label: 'Textured & Earth', count: materials.filter((m) => m.type === 'textured').length },
    { id: 'translucent', label: 'Translucent & Backlit', count: materials.filter((m) => m.type === 'translucent').length },
  ];

  return (
    <div className="material-explorer">
      <div className="filter-row" style={{ marginBottom: '40px', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '9px', flexWrap: 'wrap' }}>
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={selectedType === tab.id ? 'filter active' : 'filter'}
              onClick={() => setSelectedType(tab.id)}
            >
              {tab.label} <span style={{ opacity: 0.6, marginLeft: '6px' }}>({tab.count})</span>
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={toggleTray}
          className="text-link"
          style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}
        >
          View Sample Tray <span>↗</span>
        </button>
      </div>

      <div className="material-grid" style={{ marginBottom: '60px' }}>
        {filteredMaterials.map((mat) => {
          const inTray = isShortlisted(mat.slug);
          return (
            <div
              key={mat.slug}
              className="material-card"
              style={{ position: 'relative' }}
            >
              <div
                className={`swatch ${mat.swatch}`}
                onClick={() => setActiveModalMaterial(mat)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveModalMaterial(mat)}
              />

              {/* Quick Add Sample Badge */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (inTray) {
                    removeSample(mat.slug);
                  } else {
                    addSample(mat);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  zIndex: 3,
                  background: inTray ? 'var(--ink)' : 'rgba(255,255,255,0.85)',
                  color: inTray ? '#fff' : 'var(--ink)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                {inTray ? 'In Tray ✓' : '+ Sample'}
              </button>

              <div
                className="card-info"
                onClick={() => setActiveModalMaterial(mat)}
                style={{ cursor: 'pointer' }}
              >
                <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', marginBottom: '4px', display: 'block' }}>
                  {mat.collection}
                </span>
                <h3>{mat.name}</h3>
                <p>{mat.finish} / {mat.colour}</p>
              </div>
            </div>
          );
        })}
      </div>

      {activeModalMaterial && (
        <MaterialModal
          material={activeModalMaterial}
          onClose={() => setActiveModalMaterial(null)}
        />
      )}
    </div>
  );
}
