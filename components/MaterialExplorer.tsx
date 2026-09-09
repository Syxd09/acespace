'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { materials as defaultMaterials, Material } from '@/data/materials';
import { useSiteContent } from '@/context/SiteContentContext';
import MaterialModal from '@/components/MaterialModal';
import { useSampleShortlist } from '@/context/SampleContext';

export default function MaterialExplorer() {
  const { materials: liveMaterials } = useSiteContent();
  const materials = (liveMaterials && liveMaterials.length > 0) ? liveMaterials : defaultMaterials;
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
    const rawQuery = searchQuery.trim().toLowerCase();

    return materials.filter((mat) => {
      const matchesSearch =
        !rawQuery ||
        (mat.code && mat.code.toLowerCase().includes(rawQuery)) ||
        (mat.name && mat.name.toLowerCase().includes(rawQuery)) ||
        (mat.colour && mat.colour.toLowerCase().includes(rawQuery)) ||
        (mat.finish && mat.finish.toLowerCase().includes(rawQuery)) ||
        (mat.collection && mat.collection.toLowerCase().includes(rawQuery)) ||
        (mat.colorFamily && mat.colorFamily.toLowerCase().includes(rawQuery)) ||
        (mat.pattern && mat.pattern.toLowerCase().includes(rawQuery)) ||
        (mat.type && mat.type.toLowerCase().includes(rawQuery)) ||
        (mat.description && mat.description.toLowerCase().includes(rawQuery)) ||
        (Array.isArray(mat.applications) && mat.applications.some((app) => app.toLowerCase().includes(rawQuery)));

      // When searching by text, search globally across all collections so an architect typing a code or name never gets false zero results
      const matchesTab = rawQuery ? true : (activeTab === 'all' || mat.type === activeTab);

      return matchesTab && matchesSearch;
    });
  }, [materials, activeTab, searchQuery]);

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

      {/* Material Grid or Zero Results Callout */}
      {filteredMaterials.length === 0 ? (
        <div style={{
          background: '#dcd7cd',
          padding: '64px 24px',
          textAlign: 'center',
          border: '1px solid var(--line)',
          marginBottom: '60px',
        }}>
          <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Foundry Search Query: &quot;{searchQuery}&quot;
          </span>
          <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', margin: '12px 0 16px', fontWeight: 400 }}>
            No Architectural Specimens Found
          </h3>
          <p style={{ fontSize: '13px', color: '#6d746d', maxWidth: '460px', margin: '0 auto 24px', lineHeight: 1.6 }}>
            No solid surface slabs match &quot;{searchQuery}&quot;. Search by code (e.g. AC-101), collection name, finish, or hue.
          </p>
          <button
            type="button"
            onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
            className="button button-dark"
            style={{ display: 'inline-flex' }}
          >
            Clear Search & Show All Collections ↺
          </button>
        </div>
      ) : (
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
      )}

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
