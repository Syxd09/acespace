'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { materials, Material } from '@/data/materials';
import MaterialModal from '@/components/MaterialModal';

export default function MaterialExplorer() {
  const [selectedType, setSelectedType] = useState<string>('all');
  const [activeModalMaterial, setActiveModalMaterial] = useState<Material | null>(null);

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
      <div className="filter-row" style={{ marginBottom: '40px' }}>
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

      <div className="material-grid" style={{ marginBottom: '60px' }}>
        {filteredMaterials.map((mat) => (
          <div
            key={mat.slug}
            className="material-card"
            onClick={() => setActiveModalMaterial(mat)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === 'Enter' && setActiveModalMaterial(mat)}
          >
            <div className={`swatch ${mat.swatch}`} />
            <div className="card-hover">↗</div>
            <div className="card-info">
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.7)', fontSize: '9px', marginBottom: '4px', display: 'block' }}>
                {mat.collection}
              </span>
              <h3>{mat.name}</h3>
              <p>{mat.finish} / {mat.colour}</p>
            </div>
          </div>
        ))}
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
