'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { materials, Material } from '@/data/materials';
import MaterialModal from '@/components/MaterialModal';
import { useSampleShortlist } from '@/context/SampleContext';

export default function ColourLibrary() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [activeModalMaterial, setActiveModalMaterial] = useState<Material | null>(null);

  const { addSample, removeSample, isShortlisted, toggleTray } = useSampleShortlist();

  const colorFamilies = [
    { id: 'all', label: 'All Hues', color: '#1e211d' },
    { id: 'white', label: 'Whites & Chalk', color: '#f4f3ef' },
    { id: 'cream', label: 'Linen & Warm Creams', color: '#e9e4d8' },
    { id: 'grey', label: 'Greys & Ash Concrete', color: '#a6aba2' },
    { id: 'earth', label: 'Earth & Terracotta', color: '#b47b62' },
    { id: 'black', label: 'Obsidian Noir & Charcoal', color: '#1a1e1b' },
    { id: 'translucent', label: 'Translucent & Backlit', color: '#ede2cf' },
  ];

  const patterns = [
    { id: 'all', label: 'All Patterns' },
    { id: 'solid', label: 'Monolithic Solid' },
    { id: 'veined', label: 'Veined & Flow' },
    { id: 'particulate', label: 'Particulate & Aggregate' },
    { id: 'translucent', label: 'Translucent Light' },
  ];

  const filteredMaterials = useMemo(() => {
    return materials.filter((mat) => {
      const matchesSearch =
        searchQuery.trim() === '' ||
        mat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.colour.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.collection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        mat.applications.some((app) => app.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesFamily =
        selectedColorFamily === 'all' || mat.colorFamily === selectedColorFamily;

      const matchesPattern =
        selectedPattern === 'all' || mat.pattern === selectedPattern;

      return matchesSearch && matchesFamily && matchesPattern;
    });
  }, [searchQuery, selectedColorFamily, selectedPattern]);

  return (
    <div className="colour-library">
      {/* Top Search & Controls Bar */}
      <div
        style={{
          background: '#dcd7cd',
          padding: '28px 32px',
          border: '1px solid var(--line)',
          marginBottom: '40px',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(260px, 1.5fr) 1fr', gap: '24px', alignItems: 'center' }}>
          <div>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '8px' }}>
              Search Colour Library & Codes
            </span>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by colour name, code (e.g. AC-0101), hue, or application..."
                style={{
                  background: 'var(--paper)',
                  border: '1px solid var(--line)',
                  padding: '14px 18px',
                  paddingRight: '40px',
                  fontSize: '14px',
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
                    right: '12px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    fontSize: '16px',
                    color: 'var(--muted)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
            {/* View Mode Toggle */}
            <div style={{ display: 'flex', border: '1px solid var(--line)', background: 'var(--paper)' }}>
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                style={{
                  padding: '10px 14px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  background: viewMode === 'grid' ? 'var(--ink)' : 'transparent',
                  color: viewMode === 'grid' ? '#fff' : 'var(--ink)',
                  borderRight: '1px solid var(--line)',
                  borderTop: 'none',
                  borderBottom: 'none',
                  borderLeft: 'none',
                  cursor: 'pointer',
                }}
              >
                Grid (4-Col)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('compact')}
                style={{
                  padding: '10px 14px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  background: viewMode === 'compact' ? 'var(--ink)' : 'transparent',
                  color: viewMode === 'compact' ? '#fff' : 'var(--ink)',
                  borderRight: '1px solid var(--line)',
                  borderTop: 'none',
                  borderBottom: 'none',
                  borderLeft: 'none',
                  cursor: 'pointer',
                }}
              >
                Compact (6-Col)
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                style={{
                  padding: '10px 14px',
                  fontSize: '11px',
                  fontFamily: 'DM Mono, monospace',
                  background: viewMode === 'list' ? 'var(--ink)' : 'transparent',
                  color: viewMode === 'list' ? '#fff' : 'var(--ink)',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                List Spec
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTray}
              className="text-link"
              style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', background: 'none', border: 'none', cursor: 'pointer' }}
            >
              Open Sample Tray <span>↗</span>
            </button>
          </div>
        </div>

        {/* Color Family Filters with Color Swatch Dots */}
        <div style={{ marginTop: '24px', borderTop: '1px solid rgba(30,33,29,0.12)', paddingTop: '20px' }}>
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '10px' }}>
            Filter by Colour Group:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {colorFamilies.map((fam) => {
              const isActive = selectedColorFamily === fam.id;
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => setSelectedColorFamily(fam.id)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    textTransform: 'uppercase',
                    border: '1px solid var(--line)',
                    background: isActive ? 'var(--ink)' : 'var(--paper)',
                    color: isActive ? '#fff' : 'var(--ink)',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                    boxShadow: isActive ? '0 6px 14px rgba(0,0,0,0.12)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                >
                  {fam.id !== 'all' && (
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: fam.color,
                        border: '1px solid rgba(0,0,0,0.2)',
                        display: 'inline-block',
                      }}
                    />
                  )}
                  <span>{fam.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern / Texture Filter */}
        <div style={{ marginTop: '16px' }}>
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block', marginBottom: '10px' }}>
            Filter by Pattern / Character:
          </span>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {patterns.map((pat) => {
              const isActive = selectedPattern === pat.id;
              return (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => setSelectedPattern(pat.id)}
                  style={{
                    padding: '6px 12px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    textTransform: 'uppercase',
                    border: '1px solid var(--line)',
                    background: isActive ? 'var(--ink)' : 'transparent',
                    color: isActive ? '#fff' : 'var(--ink)',
                    transition: 'all 0.25s ease',
                    cursor: 'pointer',
                  }}
                >
                  {pat.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Results Header Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
          Showing {filteredMaterials.length} of {materials.length} Architectural Colours
        </span>
        {(searchQuery || selectedColorFamily !== 'all' || selectedPattern !== 'all') && (
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedColorFamily('all');
              setSelectedPattern('all');
            }}
            style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', textDecoration: 'underline', color: 'var(--ink)', cursor: 'pointer', background: 'none', border: 'none' }}
          >
            Reset Filters
          </button>
        )}
      </div>

      {/* View Mode 1: Standard 4-Col Grid with Direct Click to Open Modal */}
      {viewMode === 'grid' && (
        <div className="material-grid" style={{ marginBottom: '80px' }}>
          {filteredMaterials.map((mat) => {
            const inTray = isShortlisted(mat.slug);
            return (
              <div
                key={mat.slug}
                className="material-card"
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => setActiveModalMaterial(mat)}
              >
                <div
                  className="swatch"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: mat.textureCss || mat.hexColor,
                    overflow: 'hidden',
                  }}
                >
                  {mat.textureImage && (
                    <Image
                      src={mat.textureImage}
                      alt={mat.name}
                      fill
                      sizes="(max-width: 768px) 100vw, 30vw"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Sample Shortlist Quick Button */}
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
                    background: inTray ? 'var(--ink)' : 'rgba(255,255,255,0.94)',
                    color: inTray ? '#fff' : 'var(--ink)',
                    border: '1px solid rgba(0,0,0,0.15)',
                    padding: '6px 12px',
                    borderRadius: '100px',
                    fontSize: '10px',
                    fontFamily: 'DM Mono, monospace',
                    textTransform: 'uppercase',
                    cursor: 'pointer',
                    transition: 'all 0.25s ease',
                  }}
                >
                  {inTray ? 'In Tray ✓' : '+ Sample'}
                </button>

                <div className="card-info" style={{ zIndex: 2 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span className="eyebrow" style={{ color: 'rgba(255,255,255,0.9)', fontSize: '9px', margin: 0 }}>
                      {mat.code} · {mat.collection}
                    </span>
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '50%',
                        background: mat.hexColor,
                        border: '1px solid rgba(255,255,255,0.6)',
                        display: 'inline-block',
                      }}
                      title={`Hex: ${mat.hexColor}`}
                    />
                  </div>
                  <h3>{mat.name}</h3>
                  <p>{mat.finish} / {mat.colour}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 2: Compact 6-Col Grid */}
      {viewMode === 'compact' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '14px',
            marginBottom: '80px',
          }}
        >
          {filteredMaterials.map((mat) => {
            const inTray = isShortlisted(mat.slug);
            return (
              <div
                key={mat.slug}
                style={{
                  background: '#dcd7cd',
                  border: '1px solid var(--line)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '240px',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.35s ease, border-color 0.35s ease',
                }}
                onClick={() => setActiveModalMaterial(mat)}
              >
                <div>
                  <div
                    style={{
                      height: '110px',
                      background: mat.textureCss || mat.hexColor,
                      border: '1px solid rgba(0,0,0,0.1)',
                      marginBottom: '12px',
                      position: 'relative',
                      overflow: 'hidden',
                    }}
                  >
                    {mat.textureImage && (
                      <Image
                        src={mat.textureImage}
                        alt={mat.name}
                        fill
                        sizes="180px"
                        style={{ objectFit: 'cover' }}
                        loading="lazy"
                      />
                    )}
                  </div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block' }}>
                    {mat.code}
                  </span>
                  <strong style={{ fontSize: '14px', fontWeight: 500, color: 'var(--ink)', display: 'block', lineHeight: 1.2 }}>
                    {mat.name}
                  </strong>
                  <span style={{ fontSize: '10px', color: '#667066', display: 'block', marginTop: '2px' }}>
                    {mat.finish}
                  </span>
                </div>

                <div style={{ marginTop: '12px', borderTop: '1px solid rgba(30,33,29,0.1)', paddingTop: '10px' }}>
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
                      width: '100%',
                      padding: '6px 8px',
                      fontSize: '9px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      background: inTray ? 'var(--ink)' : 'transparent',
                      color: inTray ? '#fff' : 'var(--ink)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                    }}
                  >
                    {inTray ? 'In Tray ✓' : '+ Sample'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* View Mode 3: Detailed List Spec */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '80px' }}>
          {filteredMaterials.map((mat) => {
            const inTray = isShortlisted(mat.slug);
            return (
              <div
                key={mat.slug}
                style={{
                  background: '#dcd7cd',
                  border: '1px solid var(--line)',
                  padding: '18px 24px',
                  display: 'grid',
                  gridTemplateColumns: '60px 1.2fr 1fr 1fr 120px',
                  alignItems: 'center',
                  gap: '20px',
                  cursor: 'pointer',
                }}
                onClick={() => setActiveModalMaterial(mat)}
              >
                <div
                  style={{
                    width: '60px',
                    height: '60px',
                    background: mat.textureCss || mat.hexColor,
                    border: '1px solid rgba(0,0,0,0.15)',
                    position: 'relative',
                    overflow: 'hidden',
                  }}
                >
                  {mat.textureImage && (
                    <Image
                      src={mat.textureImage}
                      alt={mat.name}
                      fill
                      sizes="60px"
                      style={{ objectFit: 'cover' }}
                      loading="lazy"
                    />
                  )}
                </div>

                <div>
                  <span style={{ fontSize: '9px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', textTransform: 'uppercase' }}>
                    {mat.code} · {mat.collection}
                  </span>
                  <h4 style={{ fontSize: '18px', fontWeight: 400, margin: '2px 0 0', color: 'var(--ink)' }}>
                    {mat.name}
                  </h4>
                </div>

                <div>
                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                    Finish & Tone
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    {mat.finish} · {mat.colour}
                  </span>
                </div>

                <div>
                  <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', display: 'block', textTransform: 'uppercase' }}>
                    Translucency
                  </span>
                  <span style={{ fontSize: '13px', color: 'var(--ink)' }}>
                    {mat.lightTransmission}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
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
                      padding: '8px 12px',
                      fontSize: '10px',
                      fontFamily: 'DM Mono, monospace',
                      textTransform: 'uppercase',
                      background: inTray ? 'var(--ink)' : 'transparent',
                      color: inTray ? '#fff' : 'var(--ink)',
                      border: '1px solid var(--line)',
                      cursor: 'pointer',
                    }}
                  >
                    {inTray ? 'In Tray ✓' : '+ Sample'}
                  </button>
                  <Link
                    href={`/materials/${mat.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    style={{
                      padding: '8px 10px',
                      fontSize: '11px',
                      border: '1px solid var(--line)',
                      background: 'transparent',
                    }}
                  >
                    ↗
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal Specimen Inspector */}
      {activeModalMaterial && (
        <MaterialModal
          material={activeModalMaterial}
          onClose={() => setActiveModalMaterial(null)}
        />
      )}
    </div>
  );
}