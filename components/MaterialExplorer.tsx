'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { materials, Material } from '@/data/materials';
import MaterialModal from '@/components/MaterialModal';
import { useSampleShortlist } from '@/context/SampleContext';

export default function MaterialExplorer() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalMaterial, setActiveModalMaterial] = useState<Material | null>(null);

  const { addSample, removeSample, isShortlisted, toggleTray } = useSampleShortlist();

  const tabs = [
    { id: 'all', label: 'All Collections' },
    { id: 'mineral', label: 'Noma Pure Solids' },
    { id: 'veined', label: 'Alto Veined & Flow' },
    { id: 'textured', label: 'Strata & Earth Textures' },
    { id: 'translucent', label: 'Lumen Backlit Translucent' },
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      const matchesTab = activeTab === 'all' || mat.type === activeTab;
      const matchesSearch =
        searchQuery.trim() === '' ||
        mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.colour.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.finish.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesTab && matchesSearch;
    });
  }, [activeTab, searchQuery]);

  return (
    <div className="material-explorer">
      {/* Search & Filter Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '20px',
          flexWrap: 'wrap',
          marginBottom: '40px',
          background: '#dcd7cd',
          padding: '20px 24px',
          border: '1px solid var(--line)',
        }}
      >
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '8px 16px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  border: '1px solid var(--line)',
                  background: isActive ? 'var(--ink)' : 'var(--paper)',
                  color: isActive ? '#fff' : 'var(--ink)',
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tone or finish..."
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--line)',
                padding: '10px 14px',
                paddingRight: '30px',
                fontSize: '12px',
                color: 'var(--ink)',
                width: '100%',
              }}
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                style={{
                  position: 'absolute',
                  right: '10px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '14px',
                  color: 'var(--muted)',
                  cursor: 'pointer',
                }}
              >
                ×
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={toggleTray}
            className="text-link"
            style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace' }}
          >
            Sample Tray <span>↗</span>
          </button>
        </div>
      </div>

      {/* Material Grid with Visible Macro Texture Imagery */}
      <div className="material-grid" style={{ marginBottom: '60px' }}>
        {filteredMaterials.map((material) => {
          const inTray = isShortlisted(material.slug);
          return (
            <div key={material.slug} className="material-card" style={{ position: 'relative' }}>
              <div
                className="swatch"
                onClick={() => setActiveModalMaterial(material)}
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: material.textureCss || material.hexColor,
                  overflow: 'hidden',
                }}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === 'Enter' && setActiveModalMaterial(material)}
              >
                {material.textureImage && (
                  <Image
                    src={material.textureImage}
                    alt={material.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 30vw"
                    style={{ objectFit: 'cover' }}
                    loading="lazy"
                  />
                )}
              </div>

              {/* Sample Shortlist Button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  if (inTray) {
                    removeSample(material.slug);
                  } else {
                    addSample(material);
                  }
                }}
                style={{
                  position: 'absolute',
                  top: '14px',
                  right: '14px',
                  zIndex: 3,
                  background: inTray ? 'var(--ink)' : 'rgba(255,255,255,0.92)',
                  color: inTray ? '#fff' : 'var(--ink)',
                  border: '1px solid rgba(0,0,0,0.15)',
                  padding: '6px 12px',
                  borderRadius: '100px',
                  fontSize: '10px',
                  fontFamily: 'DM Mono, monospace',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                }}
              >
                {inTray ? 'In Tray ✓' : '+ Sample'}
              </button>

              <div
                className="card-info"
                onClick={() => setActiveModalMaterial(material)}
                style={{ cursor: 'pointer', zIndex: 2 }}
              >
                <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.85)', fontSize: '9px', marginBottom: '2px', display: 'block' }}>
                  {material.code} • {material.collection}
                </span>
                <h3>{material.name}</h3>
                <p>{material.finish} / {material.colour}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Specimen Modal Inspector */}
      {activeModalMaterial && (
        <MaterialModal
          material={activeModalMaterial}
          onClose={() => setActiveModalMaterial(null)}
        />
      )}
    </div>
  );
}
