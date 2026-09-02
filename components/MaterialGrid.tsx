'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { materials, Material } from '@/data/materials';
import MaterialModal from './MaterialModal';
import Toast from './Toast';
import ScrollReveal from './ScrollReveal';

export default function MaterialGrid() {
  const [activeFilter, setActiveFilter] = useState<'all' | 'mineral' | 'veined' | 'textured' | 'translucent'>('all');
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null);
  const [showToast, setShowToast] = useState(false);

  const filteredMaterials = materials.filter(
    (m) => activeFilter === 'all' || m.type === activeFilter
  );

  const handleRequestSample = () => {
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2500);
  };

  return (
    <>
      <ScrollReveal className="filter-row" role="group" aria-label="Material filters">
        <button
          className={`filter ${activeFilter === 'all' ? 'active' : ''}`}
          onClick={() => setActiveFilter('all')}
        >
          All materials
        </button>
        <button
          className={`filter ${activeFilter === 'mineral' ? 'active' : ''}`}
          onClick={() => setActiveFilter('mineral')}
        >
          Mineral
        </button>
        <button
          className={`filter ${activeFilter === 'veined' ? 'active' : ''}`}
          onClick={() => setActiveFilter('veined')}
        >
          Veined
        </button>
        <button
          className={`filter ${activeFilter === 'textured' ? 'active' : ''}`}
          onClick={() => setActiveFilter('textured')}
        >
          Textured
        </button>
        <button
          className={`filter ${activeFilter === 'translucent' ? 'active' : ''}`}
          onClick={() => setActiveFilter('translucent')}
        >
          Translucent
        </button>
      </ScrollReveal>

      <div className="material-grid" id="material-grid">
        {filteredMaterials.map((m) => (
          <article
            key={m.slug}
            className="material-card"
            tabIndex={0}
            onClick={() => setSelectedMaterial(m)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedMaterial(m);
              }
            }}
            style={{ position: 'relative' }}
          >
            <div
              className="swatch"
              style={{
                position: 'absolute',
                inset: 0,
                background: m.textureCss || m.hexColor,
                overflow: 'hidden',
              }}
            >
              {m.textureImage && (
                <Image
                  src={m.textureImage}
                  alt={m.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  style={{ objectFit: 'cover' }}
                  loading="lazy"
                />
              )}
            </div>
            <span className="card-hover">+</span>
            <div className="card-info">
              <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '9px', marginBottom: '2px', display: 'block' }}>
                {m.code} • {m.collection}
              </span>
              <h3>{m.name}</h3>
              <p>{m.finish} / {m.colour}</p>
            </div>
          </article>
        ))}
      </div>

      {selectedMaterial && (
        <MaterialModal
          material={selectedMaterial}
          onClose={() => setSelectedMaterial(null)}
        />
      )}

      <Toast show={showToast} message="Added to your sample shortlist" />
    </>
  );
}
