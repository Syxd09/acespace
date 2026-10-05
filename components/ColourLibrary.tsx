'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import { materials as defaultMaterials, Material } from '@/data/materials';
import { useSiteContent } from '@/context/SiteContentContext';
import MaterialModal from '@/components/MaterialModal';
import { useSampleShortlist } from '@/context/SampleContext';

export default function ColourLibrary() {
  const searchParams = useSearchParams();
  const { materials: liveMaterials } = useSiteContent();
  const materials = (liveMaterials && liveMaterials.length >= defaultMaterials.length) ? liveMaterials : defaultMaterials;
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedColorFamily, setSelectedColorFamily] = useState<string>('all');
  const [selectedPattern, setSelectedPattern] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'compact' | 'list'>('grid');
  const [activeModalMaterial, setActiveModalMaterial] = useState<Material | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const PAGE_SIZE = 16;
  const [visibleCount, setVisibleCount] = useState<number>(PAGE_SIZE);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const handleLoadMore = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount((prev) => Math.min(prev + PAGE_SIZE, filteredMaterials.length));
      setIsLoadingMore(false);
    }, 750);
  };

  const handleViewAll = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleCount(filteredMaterials.length);
      setIsLoadingMore(false);
    }, 900);
  };

  const { addSample, removeSample, isShortlisted, toggleTray } = useSampleShortlist();

  useEffect(() => {
    if (!searchParams) return;
    const familyParam = searchParams.get('family');
    if (familyParam) {
      const validFamilies = ['all', 'white', 'cream', 'grey', 'earth', 'black', 'translucent'];
      if (validFamilies.includes(familyParam.toLowerCase())) {
        setSelectedColorFamily(familyParam.toLowerCase());
      }
    }
    const patternParam = searchParams.get('pattern');
    if (patternParam) {
      const validPatterns = ['all', 'solid', 'veined', 'particulate', 'translucent'];
      if (validPatterns.includes(patternParam.toLowerCase())) {
        setSelectedPattern(patternParam.toLowerCase());
      }
    }
    const queryParam = searchParams.get('q');
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

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
    { id: 'all', label: 'All Patterns', glyph: '✦' },
    { id: 'solid', label: 'Monolithic Solid', glyph: '■' },
    { id: 'veined', label: 'Veined & Flow', glyph: '∿' },
    { id: 'particulate', label: 'Particulate & Aggregate', glyph: '∴' },
    { id: 'translucent', label: 'Translucent Light', glyph: '✧' },
  ];

  // Dynamic count badges for each hue and pattern
  const filterCounts = useMemo(() => {
    const familyCounts: Record<string, number> = { all: materials.length };
    const patternCounts: Record<string, number> = { all: materials.length };

    materials.forEach((mat) => {
      const fam = (mat.colorFamily || '').toLowerCase();
      const pat = (mat.pattern || '').toLowerCase();
      if (fam) familyCounts[fam] = (familyCounts[fam] || 0) + 1;
      if (pat) patternCounts[pat] = (patternCounts[pat] || 0) + 1;
    });

    return { familyCounts, patternCounts };
  }, [materials]);

  const filteredMaterials = useMemo(() => {
    const rawQuery = searchQuery.trim().toLowerCase();

    return materials.filter((mat) => {
      // 1. Search filter: if query is present, check against material attributes
      const matchesSearch =
        !rawQuery ||
        (mat.code && mat.code.toLowerCase().includes(rawQuery)) ||
        (mat.name && mat.name.toLowerCase().includes(rawQuery)) ||
        (mat.colour && mat.colour.toLowerCase().includes(rawQuery)) ||
        (mat.finish && mat.finish.toLowerCase().includes(rawQuery)) ||
        (mat.collection && mat.collection.toLowerCase().includes(rawQuery)) ||
        (mat.colorFamily && mat.colorFamily.toLowerCase().includes(rawQuery)) ||
        (mat.pattern && mat.pattern.toLowerCase().includes(rawQuery)) ||
        (mat.description && mat.description.toLowerCase().includes(rawQuery)) ||
        (Array.isArray(mat.applications) && mat.applications.some((app) => app.toLowerCase().includes(rawQuery)));

      // 2. Color group filter (primary exact match with fallback)
      const matFamily = (mat.colorFamily || '').toLowerCase();
      const matColour = (mat.colour || '').toLowerCase();
      const matName = (mat.name || '').toLowerCase();

      let matchesFamily = false;
      if (selectedColorFamily === 'all') {
        matchesFamily = true;
      } else if (matFamily) {
        matchesFamily = matFamily === selectedColorFamily.toLowerCase();
      } else {
        if (selectedColorFamily === 'white') matchesFamily = matColour.includes('white') || matName.includes('white');
        else if (selectedColorFamily === 'cream') matchesFamily = matColour.includes('cream') || matColour.includes('linen') || matColour.includes('greige');
        else if (selectedColorFamily === 'grey') matchesFamily = matColour.includes('grey') || matColour.includes('gray') || matColour.includes('ash');
        else if (selectedColorFamily === 'earth') matchesFamily = matColour.includes('earth') || matColour.includes('terracotta') || matColour.includes('ochre');
        else if (selectedColorFamily === 'black') matchesFamily = matColour.includes('black') || matColour.includes('noir') || matColour.includes('charcoal');
        else if (selectedColorFamily === 'translucent') matchesFamily = mat.pattern === 'translucent' || mat.type === 'translucent';
      }

      // 3. Pattern / Texture filter (primary exact match with fallback)
      const matPattern = (mat.pattern || '').toLowerCase();
      const matType = (mat.type || '').toLowerCase();
      const matCollection = (mat.collection || '').toLowerCase();

      let matchesPattern = false;
      if (selectedPattern === 'all') {
        matchesPattern = true;
      } else if (matPattern) {
        matchesPattern = matPattern === selectedPattern.toLowerCase();
      } else {
        if (selectedPattern === 'solid') matchesPattern = matType === 'mineral' || matCollection.includes('solid');
        else if (selectedPattern === 'veined') matchesPattern = matType === 'veined' || matCollection.includes('veined');
        else if (selectedPattern === 'particulate') matchesPattern = matType === 'textured' || matCollection.includes('terrazzo') || matCollection.includes('aggregate');
        else if (selectedPattern === 'translucent') matchesPattern = matType === 'translucent' || matFamily === 'translucent';
      }

      return matchesSearch && matchesFamily && matchesPattern;
    });
  }, [materials, searchQuery, selectedColorFamily, selectedPattern]);

  // Reset pagination when search or filters change
  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [searchQuery, selectedColorFamily, selectedPattern]);

  const visibleMaterials = useMemo(() => {
    return filteredMaterials.slice(0, visibleCount);
  }, [filteredMaterials, visibleCount]);

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
        <div className="colour-controls-bar">
          <div className="colour-search-box" style={{ flex: 1 }}>
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

          <div className="colour-view-mode-wrap" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
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
                className="compact-col-btn"
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
              Filter by Colour Group:
            </span>
            {selectedColorFamily !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedColorFamily('all')}
                style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset Hue
              </button>
            )}
          </div>
          <div className="colour-filter-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {colorFamilies.map((fam) => {
              const isActive = selectedColorFamily === fam.id;
              const count = filterCounts.familyCounts[fam.id] ?? 0;
              return (
                <button
                  key={fam.id}
                  type="button"
                  onClick={() => {
                    if (fam.id === 'all') {
                      setSelectedColorFamily('all');
                    } else {
                      setSelectedColorFamily((prev) => (prev === fam.id ? 'all' : fam.id));
                    }
                  }}
                  title={isActive ? (fam.id === 'all' ? 'Showing all hues' : 'Click to deselect hue') : `Filter by ${fam.label}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    textTransform: 'uppercase',
                    border: isActive ? '1px solid var(--ink)' : '1px solid var(--line)',
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
                  <span
                    suppressHydrationWarning
                    style={{
                      fontSize: '9px',
                      opacity: isActive ? 0.75 : 0.55,
                      fontFamily: 'DM Mono, monospace',
                    }}
                  >
                    ({count})
                  </span>
                  {isActive && fam.id !== 'all' && (
                    <span style={{ fontSize: '10px', marginLeft: '2px', opacity: 0.85 }}>✕</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Pattern / Texture Filter */}
        <div style={{ marginTop: '18px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', display: 'block' }}>
              Filter by Pattern / Character:
            </span>
            {selectedPattern !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedPattern('all')}
                style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                Reset Pattern
              </button>
            )}
          </div>
          <div className="colour-filter-scroll" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {patterns.map((pat) => {
              const isActive = selectedPattern === pat.id;
              const count = filterCounts.patternCounts[pat.id] ?? 0;
              return (
                <button
                  key={pat.id}
                  type="button"
                  onClick={() => {
                    if (pat.id === 'all') {
                      setSelectedPattern('all');
                    } else {
                      setSelectedPattern((prev) => (prev === pat.id ? 'all' : pat.id));
                    }
                  }}
                  title={isActive ? (pat.id === 'all' ? 'Showing all patterns' : 'Click to deselect pattern') : `Filter by ${pat.label}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 14px',
                    fontSize: '11px',
                    fontFamily: 'DM Mono, monospace',
                    textTransform: 'uppercase',
                    border: isActive ? '1px solid var(--ink)' : '1px solid var(--line)',
                    background: isActive ? 'var(--ink)' : 'var(--paper)',
                    color: isActive ? '#fff' : 'var(--ink)',
                    transform: isActive ? 'translateY(-2px)' : 'none',
                    boxShadow: isActive ? '0 6px 14px rgba(0,0,0,0.12)' : 'none',
                    transition: 'all 0.25s cubic-bezier(0.16, 1, 0.3, 1)',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      opacity: isActive ? 1 : 0.65,
                      lineHeight: 1,
                    }}
                  >
                    {pat.glyph}
                  </span>
                  <span>{pat.label}</span>
                  <span
                    suppressHydrationWarning
                    style={{
                      fontSize: '9px',
                      opacity: isActive ? 0.75 : 0.55,
                      fontFamily: 'DM Mono, monospace',
                    }}
                  >
                    ({count})
                  </span>
                  {isActive && pat.id !== 'all' && (
                    <span style={{ fontSize: '10px', marginLeft: '2px', opacity: 0.85 }}>✕</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Active Filter Chips Bar (if any filter is engaged) */}
      {(selectedColorFamily !== 'all' || selectedPattern !== 'all' || searchQuery) && (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            flexWrap: 'wrap',
            marginBottom: '20px',
            padding: '10px 16px',
            background: '#e6e2d9',
            border: '1px solid var(--line)',
          }}
        >
          <span style={{ fontSize: '10px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)', letterSpacing: '0.06em' }}>
            Active:
          </span>

          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                background: 'var(--ink)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Query: &ldquo;{searchQuery}&rdquo;</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>✕</span>
            </button>
          )}

          {selectedColorFamily !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedColorFamily('all')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                background: 'var(--ink)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Hue: {colorFamilies.find((f) => f.id === selectedColorFamily)?.label}</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>✕</span>
            </button>
          )}

          {selectedPattern !== 'all' && (
            <button
              type="button"
              onClick={() => setSelectedPattern('all')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '4px 10px',
                fontSize: '11px',
                fontFamily: 'DM Mono, monospace',
                background: 'var(--ink)',
                color: '#fff',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span>Pattern: {patterns.find((p) => p.id === selectedPattern)?.label}</span>
              <span style={{ fontSize: '10px', opacity: 0.8 }}>✕</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedColorFamily('all');
              setSelectedPattern('all');
            }}
            style={{
              fontSize: '10px',
              fontFamily: 'DM Mono, monospace',
              color: 'var(--ink)',
              textDecoration: 'underline',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: 'auto',
            }}
          >
            Clear All
          </button>
        </div>
      )}

      {/* Results Header Counter */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <span suppressHydrationWarning style={{ fontSize: '12px', fontFamily: 'DM Mono, monospace', textTransform: 'uppercase', color: 'var(--muted)' }}>
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

      {/* Empty State when no materials match */}
      {filteredMaterials.length === 0 && (
        <div
          style={{
            background: '#dcd7cd',
            border: '1px solid var(--line)',
            padding: '50px 32px',
            textAlign: 'center',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              margin: '0 auto 16px',
              border: '1px solid var(--line)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              fontFamily: 'DM Mono, monospace',
              color: 'var(--muted)',
            }}
          >
            ∅
          </div>
          <h3 style={{ fontSize: '18px', fontWeight: 400, color: 'var(--ink)', marginBottom: '8px' }}>
            No Matching Architectural Colours
          </h3>
          <p style={{ fontSize: '13px', color: 'var(--muted)', maxWidth: '460px', margin: '0 auto 20px', lineHeight: 1.6 }}>
            No materials match your current criteria. Click any active filter chip or the button below to restore the full palette.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedColorFamily('all');
              setSelectedPattern('all');
            }}
            style={{
              padding: '11px 24px',
              fontSize: '11px',
              fontFamily: 'DM Mono, monospace',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              background: 'var(--ink)',
              color: '#ffffff',
              border: '1px solid var(--ink)',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.25s ease',
            }}
          >
            Reset Filters & View All Materials ({materials.length})
          </button>
        </div>
      )}

      {/* View Mode 1: Standard 4-Col Grid with Direct Click to Open Modal */}
      {viewMode === 'grid' && (
        <div className="material-grid" style={{ marginBottom: '40px' }}>
          {visibleMaterials.map((mat) => {
            const inTray = isShortlisted(mat.slug);
            return (
              <div
                key={mat.slug}
                className="material-card"
                role="button"
                tabIndex={0}
                aria-label={`View ${mat.name} (${mat.code}) material specifications`}
                data-agent-target="material-card"
                data-material-slug={mat.slug}
                data-material-code={mat.code}
                data-material-name={mat.name}
                data-material-collection={mat.collection}
                style={{ position: 'relative', cursor: 'pointer' }}
                onClick={() => setActiveModalMaterial(mat)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalMaterial(mat);
                  }
                }}
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
                      alt={`${mat.name} solid surface texture swatch`}
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
                  aria-label={inTray ? `Remove ${mat.name} sample from tray` : `Add ${mat.name} sample to tray`}
                  data-agent-action="sample-toggle"
                  data-material-slug={mat.slug}
                  data-material-code={mat.code}
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

                <div className="card-info" style={{ zIndex: 2 }} suppressHydrationWarning>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '6px' }}>
                    <h3 style={{ margin: 0, fontSize: '15px', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {mat.name.replace(/^(DuPont™\s*Corian®|DuPont\s*Corian|Corian®|Corian)\s+/i, '')}
                    </h3>
                    <span
                      style={{
                        width: '10px',
                        height: '10px',
                        borderRadius: '50%',
                        background: mat.hexColor,
                        border: '1px solid rgba(255,255,255,0.7)',
                        display: 'inline-block',
                        flexShrink: 0,
                      }}
                      title={`Hex: ${mat.hexColor}`}
                    />
                  </div>
                  <p style={{ marginTop: '2px' }}>
                    {mat.code} · {mat.finish}
                  </p>
                </div>
              </div>
            );
          })}

          {/* Shimmering Skeleton Cards during Load More */}
          {isLoadingMore &&
            Array.from({ length: 4 }).map((_, idx) => (
              <div key={`skeleton-grid-${idx}`} className="material-skeleton-card">
                <div className="skeleton-swatch shimmer">
                  <div
                    style={{
                      position: 'absolute',
                      top: '14px',
                      right: '14px',
                      width: '64px',
                      height: '24px',
                      background: 'rgba(30,33,29,0.06)',
                      borderRadius: '100px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <div className="skeleton-pulse-ring" />
                  </div>
                </div>
                <div className="skeleton-details">
                  <div className="skeleton-line shimmer" style={{ width: '40%', height: '10px', marginBottom: '8px' }} />
                  <div className="skeleton-line shimmer" style={{ width: '75%', height: '20px', marginBottom: '6px' }} />
                  <div className="skeleton-line shimmer" style={{ width: '50%', height: '12px' }} />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* View Mode 2: Compact 6-Col Grid */}
      {viewMode === 'compact' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
            gap: '14px',
            marginBottom: '40px',
          }}
        >
          {visibleMaterials.map((mat) => {
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
                    {(() => {
                      const match = mat.name.match(/^(DuPont™ Corian®|DuPont Corian|Corian®|Corian|Pattern Series|Ace Spaces)\s+(.*)$/i);
                      if (match) {
                        return (
                          <>
                            <span style={{ display: 'block', fontSize: '8px', fontWeight: 400, fontFamily: 'DM Mono, monospace', opacity: 0.65, textTransform: 'uppercase', marginBottom: '2px' }}>
                              {match[1]}
                            </span>
                            <span>{match[2]}</span>
                          </>
                        );
                      }
                      return mat.name;
                    })()}
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

          {/* Shimmering Skeleton Cards during Load More in Compact View */}
          {isLoadingMore &&
            Array.from({ length: 6 }).map((_, idx) => (
              <div
                key={`skeleton-compact-${idx}`}
                style={{
                  background: '#dcd7cd',
                  border: '1px solid var(--line)',
                  padding: '14px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  minHeight: '240px',
                }}
              >
                <div>
                  <div className="skeleton-swatch shimmer" style={{ height: '110px', marginBottom: '12px' }} />
                  <div className="skeleton-line shimmer" style={{ width: '45%', height: '9px', marginBottom: '6px' }} />
                  <div className="skeleton-line shimmer" style={{ width: '80%', height: '16px', marginBottom: '6px' }} />
                  <div className="skeleton-line shimmer" style={{ width: '60%', height: '10px' }} />
                </div>
                <div style={{ marginTop: '12px', borderTop: '1px solid rgba(30,33,29,0.1)', paddingTop: '10px' }}>
                  <div className="skeleton-line shimmer" style={{ width: '100%', height: '24px' }} />
                </div>
              </div>
            ))}
        </div>
      )}

      {/* View Mode 3: Detailed List Spec */}
      {viewMode === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '40px' }}>
          {visibleMaterials.map((mat) => {
            const inTray = isShortlisted(mat.slug);
            return (
              <div
                key={mat.slug}
                role="button"
                tabIndex={0}
                aria-label={`View ${mat.name} (${mat.code}) specifications`}
                data-agent-target="material-list-row"
                data-material-slug={mat.slug}
                data-material-code={mat.code}
                data-material-name={mat.name}
                data-material-collection={mat.collection}
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    setActiveModalMaterial(mat);
                  }
                }}
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
                    {(() => {
                      const match = mat.name.match(/^(DuPont™ Corian®|DuPont Corian|Corian®|Corian|Pattern Series|Ace Spaces)\s+(.*)$/i);
                      if (match) {
                        return (
                          <>
                            <span style={{ display: 'block', fontSize: '9px', fontWeight: 400, fontFamily: 'DM Mono, monospace', opacity: 0.65, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '2px' }}>
                              {match[1]}
                            </span>
                            <span>{match[2]}</span>
                          </>
                        );
                      }
                      return mat.name;
                    })()}
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

          {/* Shimmering Skeleton Rows during Load More in List View */}
          {isLoadingMore &&
            Array.from({ length: 3 }).map((_, idx) => (
              <div
                key={`skeleton-list-${idx}`}
                style={{
                  background: '#dcd7cd',
                  border: '1px solid var(--line)',
                  padding: '18px 24px',
                  display: 'grid',
                  gridTemplateColumns: '60px 1.2fr 1fr 1fr 120px',
                  alignItems: 'center',
                  gap: '20px',
                }}
              >
                <div className="shimmer" style={{ width: '60px', height: '60px', background: 'rgba(30, 33, 29, 0.08)' }} />
                <div>
                  <div className="skeleton-line shimmer" style={{ width: '60px', height: '8px', marginBottom: '6px' }} />
                  <div className="skeleton-line shimmer" style={{ width: '140px', height: '16px' }} />
                </div>
                <div className="skeleton-line shimmer" style={{ width: '100px', height: '12px' }} />
                <div className="skeleton-line shimmer" style={{ width: '80px', height: '12px' }} />
                <div className="skeleton-line shimmer" style={{ width: '90px', height: '28px', borderRadius: '4px' }} />
              </div>
            ))}
        </div>
      )}

      {/* Progressive Load More Section */}
      {filteredMaterials.length > 0 && (
        <div className="load-more-section" style={{ margin: '40px 0 80px', textAlign: 'center' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            {/* Progress Counter & Bar */}
            <div style={{ maxWidth: '340px', width: '100%' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', fontFamily: 'DM Mono, monospace', color: 'var(--muted)', marginBottom: '8px' }}>
                <span>Showing {Math.min(visibleCount, filteredMaterials.length)} of {filteredMaterials.length} materials</span>
                <span>{Math.round((Math.min(visibleCount, filteredMaterials.length) / filteredMaterials.length) * 100)}%</span>
              </div>
              <div style={{ height: '3px', background: 'rgba(30, 33, 29, 0.15)', width: '100%', overflow: 'hidden', borderRadius: '1px' }}>
                <div
                  style={{
                    height: '100%',
                    background: 'var(--ink)',
                    width: `${(Math.min(visibleCount, filteredMaterials.length) / filteredMaterials.length) * 100}%`,
                    transition: 'width 0.35s ease',
                  }}
                />
              </div>
            </div>

            {visibleCount < filteredMaterials.length ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <button
                    type="button"
                    onClick={handleLoadMore}
                    disabled={isLoadingMore}
                    style={{
                      padding: '10px 22px',
                      fontSize: '10.5px',
                      fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      cursor: isLoadingMore ? 'wait' : 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                      background: 'var(--ink)',
                      color: '#ffffff',
                      border: '1px solid var(--ink)',
                      opacity: isLoadingMore ? 0.9 : 1,
                      transition: 'all 0.25s ease',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    {isLoadingMore ? (
                      <>
                        <span className="spinner-loader" style={{ width: '11px', height: '11px' }} />
                        <span style={{ fontSize: '10.5px', fontFamily: 'DM Mono, monospace' }}>Retrieving Materials...</span>
                      </>
                    ) : (
                      <>
                        <span style={{ fontSize: '10.5px', fontFamily: 'DM Mono, monospace' }}>
                          Load More Materials (+{Math.min(PAGE_SIZE, filteredMaterials.length - visibleCount)})
                        </span>
                        <span style={{ fontSize: '11px', fontFamily: 'DM Mono, monospace', lineHeight: 1 }}>↓</span>
                      </>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleViewAll}
                    disabled={isLoadingMore}
                    style={{
                      padding: '10px 18px',
                      fontSize: '10.5px',
                      fontFamily: 'DM Mono, monospace',
                      letterSpacing: '0.06em',
                      textTransform: 'uppercase',
                      background: 'var(--paper)',
                      color: 'var(--ink)',
                      border: '1px solid var(--line)',
                      cursor: isLoadingMore ? 'wait' : 'pointer',
                      opacity: isLoadingMore ? 0.6 : 1,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      transition: 'all 0.25s ease',
                    }}
                  >
                    <span suppressHydrationWarning style={{ fontSize: '10.5px', fontFamily: 'DM Mono, monospace' }}>
                      {isLoadingMore ? 'Expanding Catalog...' : `View All (${filteredMaterials.length})`}
                    </span>
                  </button>
                </div>

                {isLoadingMore && (
                  <div className="loading-indicator-track">
                    <div className="loading-indicator-runner" />
                  </div>
                )}
              </div>
            ) : (
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: 'var(--muted)', letterSpacing: '0.04em' }}>
                ✓ All {filteredMaterials.length} architectural materials loaded · Custom blend required?{' '}
                <Link href="/contact" style={{ textDecoration: 'underline', color: 'var(--ink)' }}>
                  Consult our Studio Desk ↗
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Specimen Inspector with Left/Right Navigation and Similar Recommendations */}
      {activeModalMaterial && (
        <MaterialModal
          material={activeModalMaterial}
          materialsList={filteredMaterials}
          onSelectMaterial={(newMat) => setActiveModalMaterial(newMat)}
          onClose={() => setActiveModalMaterial(null)}
        />
      )}

      <style jsx>{`
        .spinner-loader {
          width: 14px;
          height: 14px;
          border: 2px solid rgba(255, 255, 255, 0.25);
          border-top-color: #ffffff;
          border-radius: 50%;
          animation: spinLoadMore 0.65s linear infinite;
          display: inline-block;
        }

        @keyframes spinLoadMore {
          to {
            transform: rotate(360deg);
          }
        }

        .skeleton-pulse-ring {
          width: 44px;
          height: 44px;
          border: 1.5px solid rgba(30, 33, 29, 0.2);
          border-radius: 50%;
          animation: pulseRing 1.3s ease-out infinite;
        }

        @keyframes pulseRing {
          0% {
            transform: scale(0.6);
            opacity: 0.8;
          }
          100% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        .loading-indicator-track {
          width: 260px;
          height: 3px;
          background: rgba(30, 33, 29, 0.1);
          overflow: hidden;
          position: relative;
          border-radius: 2px;
          margin-top: 4px;
        }

        .loading-indicator-runner {
          position: absolute;
          top: 0;
          height: 100%;
          width: 45%;
          background: var(--ink);
          border-radius: 2px;
          animation: runnerAnim 1.1s ease-in-out infinite alternate;
        }

        @keyframes runnerAnim {
          0% {
            left: 0%;
            width: 25%;
          }
          50% {
            width: 55%;
          }
          100% {
            left: 75%;
            width: 25%;
          }
        }

        .material-card {
          animation: cardEntrance 0.35s cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        @keyframes cardEntrance {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .material-skeleton-card {
          background: #dcd7cd;
          border: 1px solid var(--line);
          height: 380px;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          position: relative;
          animation: fadeInSkeleton 0.3s ease-out;
        }

        .skeleton-swatch {
          height: 250px;
          width: 100%;
          background: rgba(30, 33, 29, 0.08);
          position: relative;
          overflow: hidden;
        }

        .skeleton-details {
          padding: 16px;
          display: flex;
          flex-direction: column;
          gap: 6px;
        }

        .skeleton-line {
          background: rgba(30, 33, 29, 0.12);
          border-radius: 1px;
          position: relative;
          overflow: hidden;
        }

        .shimmer::after {
          content: '';
          position: absolute;
          top: 0;
          left: -150%;
          width: 150%;
          height: 100%;
          background: linear-gradient(
            90deg,
            transparent 0%,
            rgba(255, 255, 255, 0.45) 50%,
            transparent 100%
          );
          animation: shimmerSweep 1.25s infinite ease-in-out;
        }

        @keyframes shimmerSweep {
          0% {
            left: -150%;
          }
          100% {
            left: 150%;
          }
        }

        @keyframes fadeInSkeleton {
          from {
            opacity: 0;
            transform: translateY(8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}