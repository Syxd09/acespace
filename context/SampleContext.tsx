'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Material, materials } from '@/data/materials';

interface SampleContextType {
  shortlist: Material[];
  addSample: (material: Material) => void;
  removeSample: (slug: string) => void;
  clearShortlist: () => void;
  isShortlisted: (slug: string) => boolean;
  isTrayOpen: boolean;
  setIsTrayOpen: (open: boolean) => void;
  toggleTray: () => void;
}

const SampleContext = createContext<SampleContextType | undefined>(undefined);

export function SampleProvider({ children }: { children: React.ReactNode }) {
  const [shortlist, setShortlist] = useState<Material[]>([]);
  const [isTrayOpen, setIsTrayOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const saved = localStorage.getItem('ace_sample_shortlist');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          // Backward compatibility: If array contains full objects ({ slug: '...' }), extract slugs
          const slugs: string[] = parsed.map((item) =>
            typeof item === 'string' ? item : item?.slug
          ).filter(Boolean);

          // Dynamically hydrate full material specifications from current catalog
          const hydrated = slugs
            .map((slug) => materials.find((m) => m.slug === slug))
            .filter((m): m is Material => Boolean(m));

          setShortlist(hydrated);
        }
      }
    } catch (e) {
      console.error('Error loading sample shortlist:', e);
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      try {
        // Store ONLY material slugs to ensure zero cache drift and minimal storage footprint
        const slugs = shortlist.map((m) => m.slug);
        localStorage.setItem('ace_sample_shortlist', JSON.stringify(slugs));
      } catch (e) {
        console.error('Error saving sample shortlist:', e);
      }
    }
  }, [shortlist, mounted]);

  const addSample = (material: Material) => {
    setShortlist((prev) => {
      if (prev.some((m) => m.slug === material.slug)) return prev;
      return [...prev, material];
    });
    setIsTrayOpen(true);
  };

  const removeSample = (slug: string) => {
    setShortlist((prev) => prev.filter((m) => m.slug !== slug));
  };

  const clearShortlist = () => {
    setShortlist([]);
  };

  const isShortlisted = (slug: string) => {
    return shortlist.some((m) => m.slug === slug);
  };

  const toggleTray = () => {
    setIsTrayOpen((prev) => !prev);
  };

  return (
    <SampleContext.Provider
      value={{
        shortlist,
        addSample,
        removeSample,
        clearShortlist,
        isShortlisted,
        isTrayOpen,
        setIsTrayOpen,
        toggleTray,
      }}
    >
      {children}
    </SampleContext.Provider>
  );
}

export function useSampleShortlist() {
  const context = useContext(SampleContext);
  if (!context) {
    throw new Error('useSampleShortlist must be used within a SampleProvider');
  }
  return context;
}
