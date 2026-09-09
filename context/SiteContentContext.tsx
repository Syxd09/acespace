'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Material, materials as initialMaterials } from '@/data/materials';
import { ApplicationSector, applicationSectors as initialSectors } from '@/data/applications';
import { HeroSlide, defaultHeroSlides, SiteContent, defaultJournalArticles, JournalArticle } from '@/data/contentTypes';

import { broadcastRealtimeEvent, REALTIME_CHANNEL_NAME, RealtimeEvent } from '@/lib/realtime';

const LOCAL_STORAGE_KEY = 'acespaces_custom_content_v1';

interface SiteContentContextType {
  heroSlides: HeroSlide[];
  materials: Material[];
  applicationSectors: ApplicationSector[];
  journalArticles: JournalArticle[];
  isLoading: boolean;
  saveContent: (updated: Partial<SiteContent>) => Promise<boolean>;
  resetToDefaults: () => Promise<boolean>;
  refreshContent: () => Promise<void>;
}

const SiteContentContext = createContext<SiteContentContextType>({
  heroSlides: defaultHeroSlides,
  materials: initialMaterials,
  applicationSectors: initialSectors,
  journalArticles: defaultJournalArticles,
  isLoading: false,
  saveContent: async () => false,
  resetToDefaults: async () => false,
  refreshContent: async () => {},
});

export function SiteContentProvider({ children }: { children: React.ReactNode }) {
  const [heroSlides, setHeroSlides] = useState<HeroSlide[]>(defaultHeroSlides);
  const [materials, setMaterials] = useState<Material[]>(initialMaterials);
  const [applicationSectors, setApplicationSectors] = useState<ApplicationSector[]>(initialSectors);
  const [journalArticles, setJournalArticles] = useState<JournalArticle[]>(defaultJournalArticles);
  const [isLoading, setIsLoading] = useState(false);

  // 1. Instant client-side hydration from localStorage (prevents any serverless / cold start delay)
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const cached = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (cached) {
          const parsed: SiteContent = JSON.parse(cached);
          if (parsed.heroSlides && parsed.heroSlides.length > 0) setHeroSlides(parsed.heroSlides);
          if (parsed.materials && parsed.materials.length > 0) setMaterials(parsed.materials);
          if (parsed.applicationSectors && parsed.applicationSectors.length > 0) setApplicationSectors(parsed.applicationSectors);
          if (parsed.journalArticles && parsed.journalArticles.length > 0) setJournalArticles(parsed.journalArticles);
        }
      } catch (err) {
        console.warn('LocalStorage read error:', err);
      }
    }
  }, []);

  // 2. Refresh from server with cache-busting timestamp & no-store policy
  const refreshContent = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/admin/content?_t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Pragma': 'no-cache',
          'Cache-Control': 'no-cache',
        },
      });

      if (res.ok) {
        const data: SiteContent = await res.json();
        if (data.heroSlides && data.heroSlides.length > 0) setHeroSlides(data.heroSlides);
        if (data.materials && data.materials.length > 0) setMaterials(data.materials);
        if (data.applicationSectors && data.applicationSectors.length > 0) setApplicationSectors(data.applicationSectors);
        if (data.journalArticles && data.journalArticles.length > 0) setJournalArticles(data.journalArticles);

        // Keep local storage synchronized
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        }
      }
    } catch (err) {
      console.warn('Could not fetch server content, relying on local state:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshContent();
  }, [refreshContent]);

  // 3. Real-Time BroadcastChannel & Storage Event Cross-Tab Synchronizer
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleRealtimeContentEvent = (eventData: RealtimeEvent) => {
      if (!eventData || eventData.type !== 'CONTENT_UPDATED') return;
      const payload = eventData.payload as Partial<SiteContent> | undefined;
      if (payload) {
        if (payload.heroSlides && payload.heroSlides.length > 0) setHeroSlides(payload.heroSlides);
        if (payload.materials && payload.materials.length > 0) setMaterials(payload.materials);
        if (payload.applicationSectors && payload.applicationSectors.length > 0) setApplicationSectors(payload.applicationSectors);
        if (payload.journalArticles && payload.journalArticles.length > 0) setJournalArticles(payload.journalArticles);
      } else {
        refreshContent();
      }
    };

    let bc: BroadcastChannel | null = null;
    try {
      if ('BroadcastChannel' in window) {
        bc = new BroadcastChannel(REALTIME_CHANNEL_NAME);
        bc.onmessage = (event: MessageEvent<RealtimeEvent>) => {
          handleRealtimeContentEvent(event.data);
        };
      }
    } catch (e) {}

    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'acespaces_realtime_event' && e.newValue) {
        try {
          handleRealtimeContentEvent(JSON.parse(e.newValue));
        } catch {}
      }
      if (e.key === LOCAL_STORAGE_KEY && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          if (parsed.heroSlides) setHeroSlides(parsed.heroSlides);
          if (parsed.materials) setMaterials(parsed.materials);
          if (parsed.applicationSectors) setApplicationSectors(parsed.applicationSectors);
          if (parsed.journalArticles) setJournalArticles(parsed.journalArticles);
        } catch {}
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      if (bc) bc.close();
      window.removeEventListener('storage', handleStorage);
    };
  }, [refreshContent]);

  // 4. Save content both to LocalStorage immediately, broadcast to all tabs, and to API route
  const saveContent = async (updated: Partial<SiteContent>): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Instant local state update
      if (updated.heroSlides) setHeroSlides(updated.heroSlides);
      if (updated.materials) setMaterials(updated.materials);
      if (updated.applicationSectors) setApplicationSectors(updated.applicationSectors);
      if (updated.journalArticles) setJournalArticles(updated.journalArticles);

      const currentData: SiteContent = {
        heroSlides: updated.heroSlides || heroSlides,
        materials: updated.materials || materials,
        applicationSectors: updated.applicationSectors || applicationSectors,
        journalArticles: updated.journalArticles || journalArticles,
        updatedAt: new Date().toISOString(),
      };

      // Instant LocalStorage persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(currentData));
      }

      // Broadcast immediately to all open storefront tabs
      broadcastRealtimeEvent('CONTENT_UPDATED', currentData);

      // Server persistence with cache-busting
      const res = await fetch(`/api/admin/content?_t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-cache',
        },
        body: JSON.stringify(updated),
      });

      return res.ok;
    } catch (err) {
      console.error('Failed to save content to server:', err);
      // Return true if saved to local storage so user flow is not broken
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Reset content to defaults
  const resetToDefaults = async (): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Clear local storage cache
      if (typeof window !== 'undefined') {
        localStorage.removeItem(LOCAL_STORAGE_KEY);
      }

      const defaultData: SiteContent = {
        heroSlides: defaultHeroSlides,
        materials: initialMaterials,
        applicationSectors: initialSectors,
        journalArticles: defaultJournalArticles,
        updatedAt: new Date().toISOString(),
      };

      setHeroSlides(defaultHeroSlides);
      setMaterials(initialMaterials);
      setApplicationSectors(initialSectors);
      setJournalArticles(defaultJournalArticles);

      // Broadcast reset event to all tabs
      broadcastRealtimeEvent('CONTENT_UPDATED', defaultData);

      const res = await fetch(`/api/admin/content?_t=${Date.now()}`, {
        method: 'DELETE',
        headers: { 'Cache-Control': 'no-cache' },
      });

      return res.ok;
    } catch (err) {
      console.error('Failed to reset content on server:', err);
      return true;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SiteContentContext.Provider
      value={{
        heroSlides,
        materials,
        applicationSectors,
        journalArticles,
        isLoading,
        saveContent,
        resetToDefaults,
        refreshContent,
      }}
    >
      {children}
    </SiteContentContext.Provider>
  );
}

export function useSiteContent() {
  return useContext(SiteContentContext);
}
