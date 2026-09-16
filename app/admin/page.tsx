'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSiteContent } from '@/context/SiteContentContext';
import { HeroSlide } from '@/data/contentTypes';
import { Material } from '@/data/materials';
import { ApplicationSector, ApplicationImage } from '@/data/applications';
import { JournalArticle, Project, StudioContactConfig, defaultStudioContact } from '@/data/contentTypes';
import { generateWhatsAppUrl } from '@/lib/whatsapp';
import {
  SampleOrder,
  ProjectInquiry,
  DispatchSubscriber,
  OrderStatus,
  InquiryStatus,
} from '@/data/orderStore';
import { AIChatSession } from '@/data/chatStore';
import { REALTIME_CHANNEL_NAME, broadcastRealtimeEvent } from '@/lib/realtime';

type TabKey = 'overview' | 'hero' | 'materials' | 'colors' | 'applications' | 'projects' | 'journal' | 'media' | 'orders' | 'inquiries' | 'dispatch' | 'ai-chats';

export default function AdminPage() {
  const {
    heroSlides: contextHeroSlides,
    materials: contextMaterials,
    applicationSectors: contextSectors,
    journalArticles: contextJournals,
    projects: contextProjects,
    studioContact: contextStudioContact,
    isLoading: isContextLoading,
    saveContent,
    resetToDefaults,
  } = useSiteContent();

  const [localStudioContact, setLocalStudioContact] = useState<StudioContactConfig>(defaultStudioContact);

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

  // Collapsible Sidebar state
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  // Local working copy of state for editing
  const [localHeroSlides, setLocalHeroSlides] = useState<HeroSlide[]>([]);
  const [localMaterials, setLocalMaterials] = useState<Material[]>([]);
  const [localSectors, setLocalSectors] = useState<ApplicationSector[]>([]);
  const [localJournalArticles, setLocalJournalArticles] = useState<JournalArticle[]>([]);
  const [selectedJournalSlug, setSelectedJournalSlug] = useState<string>('');
  const [isAddingJournal, setIsAddingJournal] = useState<boolean>(false);
  const [journalSearchQuery, setJournalSearchQuery] = useState<string>('');
  const [newJournalForm, setNewJournalForm] = useState({
    title: '',
    category: 'Material Knowledge',
    date: 'August 2026',
    readTime: '05 min read',
    author: 'Ace Spatial Research',
    summary: '',
    image: '/assets/material-macro.png',
    quote: '',
    content: 'Surfaces are more than horizontal boundaries; they are the active architectural planes that dictate light, acoustics, and human interaction.\n\nThrough continuous mineral formulation, spaces achieve unprecedented monolithic continuity without visible seams.',
    takeaways: 'Zero visible joint lines, Non-porous hygienic resilience, Monolithic architectural continuity',
  });

  // Selected items for editing
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(0);
  const [selectedMaterialSlug, setSelectedMaterialSlug] = useState<string>('');
  const [selectedSectorId, setSelectedSectorId] = useState<string>('residential');

  // Status message / toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<'success' | 'error' | 'info'>('info');

  // Media Library state
  const [mediaAssets, setMediaAssets] = useState<string[]>([]);
  const [mediaFilter, setMediaFilter] = useState<string>('all');
  const [uploading, setUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Material filters
  const [materialSearchQuery, setMaterialSearchQuery] = useState<string>('');
  const [colorSearchQuery, setColorSearchQuery] = useState<string>('');

  // New item modal states
  const [isAddingMaterial, setIsAddingMaterial] = useState(false);
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isAddingSectorPhoto, setIsAddingSectorPhoto] = useState(false);

  // New item forms
  const initialMaterialForm = {
    name: '',
    code: '',
    collection: 'Architectural Solid',
    colorFamily: 'white' as Material['colorFamily'],
    pattern: 'solid' as Material['pattern'],
    type: 'mineral' as Material['type'],
    finish: 'Honed Satin Matte',
    colour: '',
    hexColor: '#f4f3ef',
    dimensions: '3660 mm × 760 mm',
    thicknessOptions: '12mm, 19mm',
    textureImage: '/assets/materials/css-stonique-sheet.jpg',
    image: '/assets/applications/stonique-bathroom-vanity.jpg',
    applications: 'Kitchen Worktops, Wall Cladding, Bespoke Monoliths',
    lightTransmission: 'Low (6%)',
    fireRating: 'Class 1 / Class A (ASTM E84)',
    careGuide: 'Daily cleaning with damp microfibre cloth and mild neutral detergent.',
    description: '',
  };
  const [newMaterialForm, setNewMaterialForm] = useState(initialMaterialForm);

  const [newColorForm, setNewColorForm] = useState({
    name: '',
    code: '',
    hexColor: '#e5e4de',
    finish: 'Honed Matte',
    colorFamily: 'cream' as Material['colorFamily'],
    textureImage: '',
  });

  const [newSectorPhotoForm, setNewSectorPhotoForm] = useState({
    src: '',
    alt: '',
    caption: '',
    tag: 'Architectural Detail',
  });

  // Projects & Architectural Case Studies State
  const [localProjects, setLocalProjects] = useState<Project[]>([]);
  const [selectedProjectSlug, setSelectedProjectSlug] = useState<string>('');
  const [projectSearchQuery, setProjectSearchQuery] = useState<string>('');
  const [projectCategoryFilter, setProjectCategoryFilter] = useState<string>('all');
  const [isAddingProject, setIsAddingProject] = useState<boolean>(false);
  const initialProjectForm = {
    title: '',
    subtitle: '',
    category: 'residential' as Project['category'],
    location: '',
    year: '2024',
    architect: '',
    area: '',
    description: '',
    materialUsed: '',
    materialSlug: '',
    application: '',
    fabrication: '',
    image: '/assets/applications/calacatta-greige-kitchen.jpg',
    challenge: '',
    solution: '',
    specs: 'Surface Material: Alto / Ivory Vein (12mm)\nEdge Profile: 45° Mitred Waterfall\nJoinery Type: Thermo-welded Matrix',
  };
  const [newProjectForm, setNewProjectForm] = useState(initialProjectForm);

  // Sector Material Gallery addition state
  const [newSectorMaterialSlug, setNewSectorMaterialSlug] = useState<string>('');
  const [newSectorMaterialFinish, setNewSectorMaterialFinish] = useState<string>('');

  // Sector Hygiene Standard addition state
  const [isAddingHygieneRow, setIsAddingHygieneRow] = useState<boolean>(false);
  const [newHygieneForm, setNewHygieneForm] = useState({
    feature: '',
    standard: '',
    benefit: '',
  });

  // Sector Element addition state
  const [newSectorElementText, setNewSectorElementText] = useState<string>('');

  // =========================================================================
  // ORDERS, INQUIRIES & DISPATCH SUBSCRIBERS STATE
  // =========================================================================
  const [orders, setOrders] = useState<SampleOrder[]>([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState<boolean>(false);
  const [orderFilter, setOrderFilter] = useState<string>('all');
  const [orderSearchQuery, setOrderSearchQuery] = useState<string>('');
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);

  const [inquiries, setInquiries] = useState<ProjectInquiry[]>([]);
  const [isLoadingInquiries, setIsLoadingInquiries] = useState<boolean>(false);
  const [inquiryFilter, setInquiryFilter] = useState<string>('all');
  const [inquirySearchQuery, setInquirySearchQuery] = useState<string>('');

  const [subscribers, setSubscribers] = useState<DispatchSubscriber[]>([]);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState<boolean>(false);
  const [subscriberSearchQuery, setSubscriberSearchQuery] = useState<string>('');

  // AI Concierge Chat Sessions state
  const [chatSessions, setChatSessions] = useState<AIChatSession[]>([]);
  const [isLoadingChats, setIsLoadingChats] = useState<boolean>(false);
  const [chatSearchQuery, setChatSearchQuery] = useState<string>('');
  const [chatStatusFilter, setChatStatusFilter] = useState<'all' | 'new' | 'reviewed' | 'contacted'>('all');
  const [selectedChatSession, setSelectedChatSession] = useState<AIChatSession | null>(null);
  const [expandedTranscriptId, setExpandedTranscriptId] = useState<string | null>(null);

  // Check existing server session auth
  useEffect(() => {
    const checkServerAuth = async () => {
      try {
        const res = await fetch('/api/admin/auth');
        if (res.ok) {
          const data = await res.json();
          if (data.authenticated) {
            setIsAuthenticated(true);
          }
        }
      } catch (err) {
        console.warn('Auth verification error:', err);
      }
    };
    checkServerAuth();
  }, []);

  // Sync context data to local editable state when loaded
  useEffect(() => {
    if (contextHeroSlides && contextHeroSlides.length > 0) {
      setLocalHeroSlides(contextHeroSlides);
    }
    if (contextMaterials && contextMaterials.length > 0) {
      setLocalMaterials(contextMaterials);
      if (!selectedMaterialSlug && contextMaterials[0]) {
        setSelectedMaterialSlug(contextMaterials[0].slug);
      }
    }
    if (contextSectors && contextSectors.length > 0) {
      setLocalSectors(contextSectors);
    }
    if (contextJournals && contextJournals.length > 0) {
      setLocalJournalArticles(contextJournals);
      if (!selectedJournalSlug && contextJournals[0]) {
        setSelectedJournalSlug(contextJournals[0].slug);
      }
    }
    if (contextProjects && contextProjects.length > 0) {
      setLocalProjects(contextProjects);
      if (!selectedProjectSlug && contextProjects[0]) {
        setSelectedProjectSlug(contextProjects[0].slug);
      }
    }
    if (contextStudioContact) {
      setLocalStudioContact(contextStudioContact);
    }
  }, [contextHeroSlides, contextMaterials, contextSectors, contextJournals, contextProjects, contextStudioContact, selectedMaterialSlug, selectedJournalSlug, selectedProjectSlug]);

  // Load media assets
  const isValidImageSrc = (src?: string): boolean => {
    if (!src || typeof src !== 'string') return false;
    if (src.startsWith('#') || src.includes('gradient')) return false;
    return (src.startsWith('/') || src.startsWith('http')) && /\.(jpg|jpeg|png|webp|svg)/i.test(src);
  };

  const loadMedia = async () => {
    try {
      const res = await fetch('/api/admin/content');
      if (res.ok) {
        const data = await res.json();
        const found = new Set<string>();
        if (data.heroSlides) {
          data.heroSlides.forEach((s: HeroSlide) => {
            if (isValidImageSrc(s.image)) found.add(s.image);
          });
        }
        if (data.materials) {
          data.materials.forEach((m: Material) => {
            if (isValidImageSrc(m.image)) found.add(m.image);
            if (isValidImageSrc(m.textureImage)) found.add(m.textureImage);
          });
        }
        if (data.applicationSectors) {
          data.applicationSectors.forEach((sec: ApplicationSector) => {
            if (sec.images) {
              sec.images.forEach((img: ApplicationImage) => {
                if (isValidImageSrc(img.src)) found.add(img.src);
              });
            }
          });
        }
        const defaults = [
          '/assets/applications/calacatta-greige-kitchen.jpg',
          '/assets/applications/calacatta-greige-kitchen-detail.jpg',
          '/assets/materials/css-calacatta-greige-sheet.jpg',
          '/assets/applications/stonecrest-smoke-hotel-lobby.jpg',
          '/assets/applications/excavage-education.jpg',
          '/assets/applications/artista-sage-hotel-elevator.jpg',
          '/assets/applications/artista-mist-bathroom.jpg',
          '/assets/applications/laguna-terrazzo-bathroom.jpg',
          '/assets/applications/laguna-terrazzo-vanity-detail.jpg',
          '/assets/applications/excavage-bathroom.jpg',
          '/assets/applications/excavage-bathroom-vanity-detail.jpg',
        ];
        defaults.forEach(d => found.add(d));
        setMediaAssets(Array.from(found));
      }
    } catch (err) {
      console.warn('Could not load media list:', err);
    }
  };

  useEffect(() => {
    loadMedia();
  }, []);

  // Toast handler
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToastMessage(message);
    setToastType(type);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Fetch orders, inquiries, and dispatch subscribers with cache-busting timestamp
  const fetchOrders = async (isSilent = false) => {
    if (!isSilent) setIsLoadingOrders(true);
    try {
      const res = await fetch(`/api/orders?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      if (!isSilent) setIsLoadingOrders(false);
    }
  };

  const fetchInquiries = async (isSilent = false) => {
    if (!isSilent) setIsLoadingInquiries(true);
    try {
      const res = await fetch(`/api/inquiries?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries) setInquiries(data.inquiries);
      }
    } catch (err) {
      console.warn('Error loading inquiries:', err);
    } finally {
      if (!isSilent) setIsLoadingInquiries(false);
    }
  };

  const fetchSubscribers = async (isSilent = false) => {
    if (!isSilent) setIsLoadingSubscribers(true);
    try {
      const res = await fetch(`/api/dispatch?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.subscribers) setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.warn('Error loading subscribers:', err);
    } finally {
      if (!isSilent) setIsLoadingSubscribers(false);
    }
  };

  const fetchChatSessions = async (isSilent = false) => {
    if (!isSilent) setIsLoadingChats(true);
    try {
      const res = await fetch(`/api/admin/chats?_t=${Date.now()}`, { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.sessions) setChatSessions(data.sessions);
      }
    } catch (err) {
      console.warn('Error loading chat sessions:', err);
    } finally {
      if (!isSilent) setIsLoadingChats(false);
    }
  };

  const fetchAllLeads = (isSilent = true) => {
    fetchOrders(isSilent);
    fetchInquiries(isSilent);
    fetchSubscribers(isSilent);
    fetchChatSessions(isSilent);
  };

  // TRUE Real-Time Sync: Immediate BroadcastChannel listener + cross-tab storage event + window focus + silent 30s fallback
  useEffect(() => {
    if (!isAuthenticated) return;

    // Initial load: show loading states
    fetchAllLeads(false);

    // 1. Cross-tab BroadcastChannel for sub-100ms instant silent updates
    let channel: BroadcastChannel | null = null;
    try {
      if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
        channel = new BroadcastChannel(REALTIME_CHANNEL_NAME);
        channel.onmessage = (event) => {
          if (event.data?.type) {
            fetchAllLeads(true);
          }
        };
      }
    } catch (err) {
      console.debug('BroadcastChannel error:', err);
    }

    // 2. LocalStorage storage event fallback (silent)
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'acespaces_realtime_event') {
        fetchAllLeads(true);
      }
    };
    window.addEventListener('storage', handleStorage);

    // 3. Instant silent re-fetch when admin tab gains focus or visibility
    const handleFocus = () => {
      if (document.visibilityState === 'visible') {
        fetchAllLeads(true);
      }
    };
    window.addEventListener('focus', handleFocus);
    document.addEventListener('visibilitychange', handleFocus);

    // 4. Relaxed 30-second silent fallback loop for cross-device synchronization
    const interval = setInterval(() => {
      fetchAllLeads(true);
    }, 30000);

    return () => {
      if (channel) channel.close();
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('focus', handleFocus);
      document.removeEventListener('visibilitychange', handleFocus);
      clearInterval(interval);
    };
  }, [isAuthenticated]);

  const handleUpdateOrderStatus = async (id: string, status: OrderStatus, notes?: string) => {
    try {
      const res = await fetch('/api/orders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders((prev) => prev.map((o) => (o.id === id ? data.order : o)));
          broadcastRealtimeEvent('ORDER_UPDATED', data.order);
          showToast(`✓ Order status updated to ${status.toUpperCase()}`, 'success');
        }
      }
    } catch {
      showToast('Failed to update order status', 'error');
    }
  };

  const handleDeleteOrder = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sample order record?')) return;
    try {
      const res = await fetch(`/api/orders?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders((prev) => prev.filter((o) => o.id !== id));
        if (selectedOrderId === id) setSelectedOrderId(null);
        broadcastRealtimeEvent('ORDER_DELETED', { id });
        showToast('Sample order removed', 'info');
      }
    } catch {
      showToast('Failed to remove order', 'error');
    }
  };

  const handleUpdateInquiryStatus = async (id: string, status: InquiryStatus, notes?: string) => {
    try {
      const res = await fetch('/api/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, notes }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.inquiry) {
          setInquiries((prev) => prev.map((i) => (i.id === id ? data.inquiry : i)));
          broadcastRealtimeEvent('INQUIRY_UPDATED', data.inquiry);
          showToast(`✓ Inquiry status updated to ${status.toUpperCase()}`, 'success');
        }
      }
    } catch {
      showToast('Failed to update inquiry status', 'error');
    }
  };

  const handleDeleteInquiry = async (id: string) => {
    if (!confirm('Are you sure you want to delete this client enquiry?')) return;
    try {
      const res = await fetch(`/api/inquiries?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setInquiries((prev) => prev.filter((i) => i.id !== id));
        broadcastRealtimeEvent('INQUIRY_DELETED', { id });
        showToast('Enquiry removed', 'info');
      }
    } catch {
      showToast('Failed to remove enquiry', 'error');
    }
  };

  const handleDeleteSubscriber = async (id: string) => {
    if (!confirm('Remove subscriber from dispatch list?')) return;
    try {
      const res = await fetch(`/api/dispatch?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setSubscribers((prev) => prev.filter((s) => s.id !== id));
        broadcastRealtimeEvent('DISPATCH_DELETED', { id });
        showToast('Subscriber removed', 'info');
      }
    } catch {
      showToast('Failed to remove subscriber', 'error');
    }
  };

  const handleCopyCourierLabel = (order: SampleOrder) => {
    const label = `==============================
ACE SPACES — SPECIMEN DISPATCH
ORDER REF: ${order.orderNumber}
==============================
RECIPIENT: ${order.customer.name}
STUDIO / FIRM: ${order.customer.studio || 'N/A'}
DELIVERY ADDRESS:
${order.customer.address}
${order.customer.city} - ${order.customer.pincode}
CONTACT: ${order.customer.phone || 'N/A'} | ${order.customer.email}
PROJECT TYPOLOGY: ${order.customer.projectType}
------------------------------
SPECIMEN SAMPLES (${order.items.length}):
${order.items.map((it, idx) => `${idx + 1}. ${it.name} (${it.finish} - 100mm × 100mm)`).join('\n')}
==============================`;

    navigator.clipboard.writeText(label);
    showToast(`✓ Copied Courier Delivery Label for ${order.orderNumber}`, 'success');
  };

  const handleCopyAllSubscriberEmails = () => {
    const emails = subscribers.map((s) => s.email).join(', ');
    navigator.clipboard.writeText(emails);
    showToast(`✓ Copied ${subscribers.length} subscriber emails to clipboard`, 'success');
  };

  const handleExportSubscribersCSV = () => {
    const rows = [
      ['Email', 'Source', 'Date Subscribed', 'Status'],
      ...subscribers.map((s) => [s.email, s.source, new Date(s.createdAt).toLocaleDateString(), s.status]),
    ];
    const csvContent = 'data:text/csv;charset=utf-8,' + rows.map((e) => e.join(',')).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'dispatch_subscribers.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ Exported dispatch_subscribers.csv', 'success');
  };

  const handleUpdateChatStatus = async (id: string, status: AIChatSession['status']) => {
    try {
      const res = await fetch('/api/admin/chats', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.session) {
          setChatSessions((prev) => prev.map((s) => (s.id === id ? data.session : s)));
          if (selectedChatSession?.id === id) setSelectedChatSession(data.session);
          showToast(`✓ Session marked as ${status.toUpperCase()}`, 'success');
        }
      }
    } catch {
      showToast('Failed to update chat session status', 'error');
    }
  };

  const handleDeleteChatSession = async (id: string) => {
    if (!confirm('Are you sure you want to remove this AI chat session?')) return;
    try {
      const res = await fetch(`/api/admin/chats?id=${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (res.ok) {
        setChatSessions((prev) => prev.filter((s) => s.id !== id));
        if (selectedChatSession?.id === id) setSelectedChatSession(null);
        if (expandedTranscriptId === id) setExpandedTranscriptId(null);
        showToast('Chat session removed', 'info');
      }
    } catch {
      showToast('Failed to remove chat session', 'error');
    }
  };

  const handleExportChatsCSV = () => {
    if (chatSessions.length === 0) {
      showToast('No chat sessions to export', 'info');
      return;
    }
    const headers = ['Session Ref', 'Date', 'Duration (s)', 'Messages', 'Status', 'Client Name', 'Phone', 'Email', 'Architectural Intent', 'Summary', 'Materials Discussed', 'Materials Suggested', 'Recommendation'];
    const rows = chatSessions.map((s) => [
      `"${s.sessionNumber || s.id}"`,
      `"${new Date(s.startedAt).toLocaleString()}"`,
      s.durationSeconds || 0,
      s.messageCount || 0,
      `"${s.status}"`,
      `"${s.customerContact?.name || ''}"`,
      `"${s.customerContact?.phone || ''}"`,
      `"${s.customerContact?.email || ''}"`,
      `"${(s.intent || '').replace(/"/g, '""')}"`,
      `"${(s.summary || '').replace(/"/g, '""')}"`,
      `"${(s.materialsDiscussed || []).join('; ')}"`,
      `"${(s.materialsSuggested || []).join('; ')}"`,
      `"${(s.followUpRecommendation || '').replace(/"/g, '""')}"`,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `acespaces_ai_concierge_chats_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('✓ AI Concierge chat summaries exported to CSV', 'success');
  };

  // Server-side Auth submission
  const handleLogin = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: passkeyInput }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setPasskeyInput('');
        setAuthError('');
        showToast('✓ Studio Console authenticated via secure server session.', 'success');
      } else {
        setAuthError(data.error || 'Invalid studio passkey.');
      }
    } catch (err) {
      setAuthError('Connection error during authentication.');
    }
  };

  const handleQuickBypass = async () => {
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: 'acespaces2026' }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        setAuthError('');
        showToast('✓ Studio Console authenticated via Fast-Track.', 'success');
      }
    } catch (err) {
      console.warn('Fast-track failed:', err);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (e) {}
    setIsAuthenticated(false);
    showToast('Signed out of Studio Console.', 'info');
  };

  // Save changes to backend
  const handleSaveAll = async () => {
    const success = await saveContent({
      heroSlides: localHeroSlides,
      materials: localMaterials,
      applicationSectors: localSectors,
      journalArticles: localJournalArticles,
      projects: localProjects,
      studioContact: localStudioContact,
    });
    if (success) {
      showToast('✓ All changes saved to custom-content.json & active on site!', 'success');
      loadMedia();
    } else {
      showToast('Error saving changes. Please check server log.', 'error');
    }
  };

  const handleSaveWhatsAppConfig = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const success = await saveContent({
      studioContact: localStudioContact,
    });
    if (success) {
      showToast('✓ WhatsApp Studio Configuration updated and live across site.', 'success');
    } else {
      showToast('Failed to save WhatsApp configuration.', 'error');
    }
  };

  // Reset to factory defaults
  const handleResetDefaults = async () => {
    if (window.confirm('Reset all content to factory architectural defaults? All custom additions will be cleared.')) {
      const success = await resetToDefaults();
      if (success) {
        showToast('✓ Factory architectural defaults restored.', 'info');
      } else {
        showToast('Error resetting defaults.', 'error');
      }
    }
  };

  // File upload handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.url) {
        setMediaAssets(prev => [data.url, ...prev]);
        showToast(`✓ Image uploaded successfully: ${data.name}`, 'success');
      } else {
        showToast(`Upload failed: ${data.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      console.error('Upload error:', err);
      showToast('Network error during file upload.', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Clipboard copy
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast(`Copied to clipboard: ${text}`, 'info');
  };

  // Hero Slide Operations
  const updateSlideField = (index: number, field: keyof HeroSlide, value: any) => {
    setLocalHeroSlides(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const addHeroSlide = () => {
    const newId = localHeroSlides.length > 0 ? Math.max(...localHeroSlides.map(s => s.id)) + 1 : 1;
    const newSlide: HeroSlide = {
      id: newId,
      image: '/assets/applications/calacatta-greige-kitchen.jpg',
      eyebrow: 'Architectural Specimen / New Addition',
      title: 'Crafted monolith,',
      subtitle: 'sculpted purity.',
      copy: 'Engineered solid surface architectural slab formulated for high-traffic environments and tactile refinement.',
      specimen: 'Coro / Specimen New',
      location: 'Studio Pavilion / Bengaluru',
    };
    setLocalHeroSlides(prev => [...prev, newSlide]);
    setSelectedSlideIndex(localHeroSlides.length);
    showToast('New hero slide added. Configure text and image below.', 'success');
  };

  const removeHeroSlide = (index: number) => {
    if (localHeroSlides.length <= 1) {
      showToast('At least one hero slide must remain.', 'error');
      return;
    }
    setLocalHeroSlides(prev => prev.filter((_, i) => i !== index));
    setSelectedSlideIndex(0);
    showToast('Hero slide removed.', 'info');
  };

  const moveHeroSlide = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localHeroSlides.length) return;
    setLocalHeroSlides(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
    setSelectedSlideIndex(target);
  };

  // Materials Operations
  const selectedMaterial = localMaterials.find(m => m.slug === selectedMaterialSlug) || localMaterials[0];

  const updateMaterialField = (slug: string, field: keyof Material, value: any) => {
    setLocalMaterials(prev =>
      prev.map(m => (m.slug === slug ? { ...m, [field]: value } : m))
    );
  };

  const deleteMaterial = async (slug: string) => {
    if (window.confirm(`Delete material slab "${slug}"?`)) {
      const remaining = localMaterials.filter(m => m.slug !== slug);
      setLocalMaterials(remaining);
      if (remaining[0]) setSelectedMaterialSlug(remaining[0].slug);
      await saveContent({
        heroSlides: localHeroSlides,
        materials: remaining,
        applicationSectors: localSectors,
        journalArticles: localJournalArticles,
      });
      showToast(`Material ${slug} deleted & updated live.`, 'info');
    }
  };

  // Create New Material Slab
  const handleCreateMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialForm.name.trim()) {
      showToast('Please provide a material slab name.', 'error');
      return;
    }

    // Generate unique slug
    let baseSlug = newMaterialForm.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    if (!baseSlug) baseSlug = `material-${Date.now()}`;
    let slug = baseSlug;
    let counter = 1;
    while (localMaterials.some(m => m.slug === slug)) {
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    const code = newMaterialForm.code.trim() || `AC-${Math.floor(1000 + Math.random() * 9000)}`;
    const applicationsArray = newMaterialForm.applications
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);
    const thicknessArray = newMaterialForm.thicknessOptions
      .split(',')
      .map(s => s.trim())
      .filter(Boolean);

    const newMaterial: Material = {
      slug,
      name: newMaterialForm.name.trim(),
      code,
      collection: newMaterialForm.collection.trim() || 'Architectural Solid',
      colorFamily: newMaterialForm.colorFamily,
      pattern: newMaterialForm.pattern,
      type: newMaterialForm.type,
      finish: newMaterialForm.finish.trim() || 'Honed Satin Matte',
      colour: newMaterialForm.colour.trim() || newMaterialForm.name.trim(),
      hexColor: newMaterialForm.hexColor || '#f4f3ef',
      textureImage: newMaterialForm.textureImage.trim() || '/assets/materials/css-stonique-sheet.jpg',
      description: newMaterialForm.description.trim() || 'Engineered solid surface architectural slab with seamless thermoformable capability and non-porous hygiene performance.',
      swatch: 'one',
      image: newMaterialForm.image.trim() || '/assets/applications/stonique-bathroom-vanity.jpg',
      applications: applicationsArray.length > 0 ? applicationsArray : ['Kitchen Worktops', 'Wall Cladding', 'Bespoke Monoliths'],
      thicknessOptions: thicknessArray.length > 0 ? thicknessArray : ['12mm', '19mm'],
      dimensions: newMaterialForm.dimensions.trim() || '3660 mm × 760 mm',
      lightTransmission: newMaterialForm.lightTransmission.trim() || 'Low (6%)',
      fireRating: newMaterialForm.fireRating.trim() || 'Class 1 / Class A (ASTM E84)',
      careGuide: newMaterialForm.careGuide.trim() || 'Daily cleaning with damp microfibre cloth and mild neutral detergent.',
    };

    const updated = [newMaterial, ...localMaterials];
    setLocalMaterials(updated);
    setSelectedMaterialSlug(newMaterial.slug);
    setIsAddingMaterial(false);
    setNewMaterialForm(initialMaterialForm);

    await saveContent({
      heroSlides: localHeroSlides,
      materials: updated,
      applicationSectors: localSectors,
      journalArticles: localJournalArticles,
    });
    showToast(`✓ Material slab "${newMaterial.name}" (${newMaterial.code}) registered and live across site!`, 'success');
  };

  // Add Color Swatch
  const handleCreateColor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newColorForm.name) {
      showToast('Please provide a colour name.', 'error');
      return;
    }
    const slug = newColorForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const newMaterial: Material = {
      slug,
      name: newColorForm.name,
      code: newColorForm.code || `AC-${Math.floor(1000 + Math.random() * 9000)}`,
      collection: 'Architectural Solid',
      colorFamily: newColorForm.colorFamily,
      pattern: 'solid',
      type: 'mineral',
      finish: newColorForm.finish,
      colour: newColorForm.name,
      hexColor: newColorForm.hexColor,
      textureImage: newColorForm.textureImage || '/assets/materials/css-calacatta-greige-sheet.jpg',
      description: 'Bespoke architectural solid surface slab with seamless thermoformable capability.',
      swatch: newColorForm.textureImage || '/assets/materials/css-calacatta-greige-sheet.jpg',
      image: newColorForm.textureImage || '/assets/materials/css-calacatta-greige-sheet.jpg',
      applications: ['Countertops', 'Wall Cladding', 'Bespoke Monoliths'],
      thicknessOptions: ['12mm', '20mm'],
      dimensions: '3660 × 760 mm',
      lightTransmission: 'Opaque',
      fireRating: 'Class 1 (BS 476)',
      careGuide: 'Clean with mild architectural soap and microfiber cloth.',
    };
    const updated = [newMaterial, ...localMaterials];
    setLocalMaterials(updated);
    setSelectedMaterialSlug(newMaterial.slug);
    setIsAddingColor(false);
    await saveContent({
      heroSlides: localHeroSlides,
      materials: updated,
      applicationSectors: localSectors,
      journalArticles: localJournalArticles,
    });
    showToast(`✓ Colour swatch "${newMaterial.name}" registered & live across site!`, 'success');
  };

  // Journal Essays Operations
  const selectedJournal = localJournalArticles.find(j => j.slug === selectedJournalSlug) || localJournalArticles[0];

  const updateJournalField = (slug: string, field: keyof JournalArticle, value: any) => {
    setLocalJournalArticles(prev =>
      prev.map(j => (j.slug === slug ? { ...j, [field]: value } : j))
    );
  };

  const handleCreateJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newJournalForm.title) {
      showToast('Please provide an essay title.', 'error');
      return;
    }
    const slug = newJournalForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newArticle: JournalArticle = {
      slug: slug || `essay-${Date.now()}`,
      title: newJournalForm.title,
      category: newJournalForm.category,
      date: newJournalForm.date,
      readTime: newJournalForm.readTime,
      author: newJournalForm.author,
      summary: newJournalForm.summary || newJournalForm.title,
      imageClass: 'journal-one',
      image: newJournalForm.image || '/assets/material-macro.png',
      quote: newJournalForm.quote || undefined,
      content: newJournalForm.content.split('\n\n').map(p => p.trim()).filter(Boolean),
      takeaways: newJournalForm.takeaways ? newJournalForm.takeaways.split(',').map(t => t.trim()).filter(Boolean) : undefined,
    };
    setLocalJournalArticles(prev => [newArticle, ...prev]);
    setSelectedJournalSlug(newArticle.slug);
    setIsAddingJournal(false);
    showToast(`✓ Journal essay "${newArticle.title}" created successfully!`, 'success');
  };

  const deleteJournalArticle = (slug: string) => {
    if (window.confirm(`Delete journal essay "${slug}"?`)) {
      setLocalJournalArticles(prev => prev.filter(j => j.slug !== slug));
      const remaining = localJournalArticles.filter(j => j.slug !== slug);
      if (remaining[0]) setSelectedJournalSlug(remaining[0].slug);
      showToast(`Journal essay "${slug}" deleted.`, 'info');
    }
  };

  const moveJournalArticle = (index: number, direction: 'up' | 'down') => {
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= localJournalArticles.length) return;
    setLocalJournalArticles(prev => {
      const copy = [...prev];
      const temp = copy[index];
      copy[index] = copy[target];
      copy[target] = temp;
      return copy;
    });
  };

  // Sector Photography Operations
  const selectedSector = localSectors.find(s => s.id === selectedSectorId) || localSectors[0];

  const updateSectorField = (id: string, field: keyof ApplicationSector, value: any) => {
    setLocalSectors(prev =>
      prev.map(s => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleAddSectorPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSectorPhotoForm.src) {
      showToast('Please provide an image URL for the sector photo.', 'error');
      return;
    }
    const newPhoto: ApplicationImage = {
      src: newSectorPhotoForm.src,
      alt: newSectorPhotoForm.alt || `${selectedSector?.title || 'Sector'} installation photography`,
      caption: newSectorPhotoForm.caption || 'Architectural surface application',
      tag: newSectorPhotoForm.tag || 'Application',
    };
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === selectedSectorId) {
          return {
            ...s,
            images: [...(s.images || []), newPhoto],
          };
        }
        return s;
      })
    );
    setIsAddingSectorPhoto(false);
    setNewSectorPhotoForm({ src: '', alt: '', caption: '', tag: 'Architectural Detail' });
    showToast(`✓ Photo added to ${selectedSector?.title || 'sector'} gallery.`, 'success');
  };

  const removeSectorPhoto = (sectorId: string, photoIndex: number) => {
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            images: s.images.filter((_, idx) => idx !== photoIndex),
          };
        }
        return s;
      })
    );
    showToast('Photo removed from sector gallery.', 'info');
  };

  // Sector Recommended Materials Operations (Powers Application Material Gallery)
  const addSectorRecommendedMaterial = (sectorId: string, slug: string, finish: string) => {
    const mat = localMaterials.find(m => m.slug === slug);
    if (!mat) {
      showToast('Please select an active material from the list.', 'error');
      return;
    }
    const finishLabel = finish.trim() || mat.finish || 'Architectural Spec';
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          const current = s.recommendedMaterials || [];
          if (current.some(m => m.slug === slug)) {
            showToast(`"${mat.name}" is already included in this sector gallery.`, 'info');
            return s;
          }
          return {
            ...s,
            recommendedMaterials: [...current, { name: mat.name, slug, finish: finishLabel }],
          };
        }
        return s;
      })
    );
    setNewSectorMaterialSlug('');
    setNewSectorMaterialFinish('');
    showToast(`✓ Added "${mat.name}" to ${selectedSector?.title || 'sector'} material gallery.`, 'success');
  };

  const removeSectorRecommendedMaterial = (sectorId: string, slug: string) => {
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            recommendedMaterials: (s.recommendedMaterials || []).filter(m => m.slug !== slug),
          };
        }
        return s;
      })
    );
    showToast('Material removed from sector gallery.', 'info');
  };

  const updateSectorRecommendedMaterialFinish = (sectorId: string, slug: string, finish: string) => {
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            recommendedMaterials: (s.recommendedMaterials || []).map(m =>
              m.slug === slug ? { ...m, finish } : m
            ),
          };
        }
        return s;
      })
    );
  };

  // Sector Hygiene & Performance Compliance Testing Operations
  const addSectorHygieneRow = (sectorId: string, feature: string, standard: string, benefit: string) => {
    if (!feature.trim() || !standard.trim()) {
      showToast('Please provide both Feature and Test Standard.', 'error');
      return;
    }
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            hygieneAndPerformance: [
              ...(s.hygieneAndPerformance || []),
              { feature: feature.trim(), standard: standard.trim(), benefit: benefit.trim() },
            ],
          };
        }
        return s;
      })
    );
    setIsAddingHygieneRow(false);
    setNewHygieneForm({ feature: '', standard: '', benefit: '' });
    showToast('✓ Added compliance test row to sector table.', 'success');
  };

  const removeSectorHygieneRow = (sectorId: string, index: number) => {
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            hygieneAndPerformance: (s.hygieneAndPerformance || []).filter((_, idx) => idx !== index),
          };
        }
        return s;
      })
    );
    showToast('Removed hygiene test row.', 'info');
  };

  const updateSectorHygieneRow = (sectorId: string, index: number, field: 'feature' | 'standard' | 'benefit', value: string) => {
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          const updated = [...(s.hygieneAndPerformance || [])];
          if (updated[index]) {
            updated[index] = { ...updated[index], [field]: value };
          }
          return { ...s, hygieneAndPerformance: updated };
        }
        return s;
      })
    );
  };

  // Sector Architectural Elements Operations
  const addSectorElement = (sectorId: string, elementText: string) => {
    if (!elementText.trim()) return;
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            elements: [...(s.elements || []), elementText.trim()],
          };
        }
        return s;
      })
    );
    setNewSectorElementText('');
    showToast('✓ Added architectural element.', 'success');
  };

  const removeSectorElement = (sectorId: string, index: number) => {
    setLocalSectors(prev =>
      prev.map(s => {
        if (s.id === sectorId) {
          return {
            ...s,
            elements: (s.elements || []).filter((_, idx) => idx !== index),
          };
        }
        return s;
      })
    );
    showToast('Removed element.', 'info');
  };

  // =========================================================================
  // PROJECTS & ARCHITECTURAL CASE STUDIES OPERATIONS
  // =========================================================================
  const selectedProject = localProjects.find(p => p.slug === selectedProjectSlug) || localProjects[0];

  const updateProjectField = (slug: string, field: keyof Project, value: any) => {
    setLocalProjects(prev =>
      prev.map(p => (p.slug === slug ? { ...p, [field]: value } : p))
    );
  };

  const deleteProject = async (slug: string) => {
    if (window.confirm(`Delete architectural case study "${slug}"?`)) {
      const remaining = localProjects.filter(p => p.slug !== slug);
      setLocalProjects(remaining);
      if (remaining[0]) setSelectedProjectSlug(remaining[0].slug);
      await saveContent({
        heroSlides: localHeroSlides,
        materials: localMaterials,
        applicationSectors: localSectors,
        journalArticles: localJournalArticles,
        projects: remaining,
      });
      showToast(`Case study "${slug}" deleted & updated live.`, 'info');
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectForm.title.trim()) {
      showToast('Please provide a project title.', 'error');
      return;
    }
    const slug = newProjectForm.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `project-${Date.now()}`;
    const specsArray = newProjectForm.specs
      .split('\n')
      .map(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          return { label: parts[0].trim(), value: parts.slice(1).join(':').trim() };
        }
        return null;
      })
      .filter(Boolean) as { label: string; value: string }[];

    const newProj: Project = {
      slug,
      title: newProjectForm.title.trim(),
      subtitle: newProjectForm.subtitle.trim() || 'Architectural Case Study',
      category: newProjectForm.category,
      location: newProjectForm.location.trim() || 'India',
      year: newProjectForm.year.trim() || '2024',
      architect: newProjectForm.architect.trim() || 'Ace Spaces Collaboration',
      area: newProjectForm.area.trim() || 'Bespoke Pavilion',
      description: newProjectForm.description.trim() || 'Selected architectural case study showcasing custom mineral surface fabrication.',
      materialUsed: newProjectForm.materialUsed.trim() || 'Alto / Ivory Vein',
      materialSlug: newProjectForm.materialSlug.trim() || 'alto-bianco-vein',
      application: newProjectForm.application.trim() || 'Monolithic Island & Wall Cladding',
      fabrication: newProjectForm.fabrication.trim() || 'Seamless Inconspicuous Jointing & Thermoforming',
      image: newProjectForm.image.trim() || '/assets/applications/calacatta-greige-kitchen.jpg',
      challenge: newProjectForm.challenge.trim() || 'Achieving monolithic architectural continuity with zero visible seams.',
      solution: newProjectForm.solution.trim() || 'Engineered workshop pre-assembly with laser templating and color-matched adhesive curing.',
      specs: specsArray.length > 0 ? specsArray : [
        { label: 'Surface Material', value: 'Ace Spaces Solid Surface' },
        { label: 'Joinery Type', value: 'Thermo-welded Matrix' },
      ],
    };

    const updated = [newProj, ...localProjects];
    setLocalProjects(updated);
    setSelectedProjectSlug(newProj.slug);
    setIsAddingProject(false);
    setNewProjectForm(initialProjectForm);

    await saveContent({
      heroSlides: localHeroSlides,
      materials: localMaterials,
      applicationSectors: localSectors,
      journalArticles: localJournalArticles,
      projects: updated,
    });
    showToast(`✓ Project case study "${newProj.title}" registered & live on /projects!`, 'success');
  };

  const updateProjectSpec = (slug: string, index: number, field: 'label' | 'value', value: string) => {
    setLocalProjects(prev =>
      prev.map(p => {
        if (p.slug === slug) {
          const copy = [...p.specs];
          if (copy[index]) {
            copy[index] = { ...copy[index], [field]: value };
          }
          return { ...p, specs: copy };
        }
        return p;
      })
    );
  };

  const addProjectSpecRow = (slug: string) => {
    setLocalProjects(prev =>
      prev.map(p => {
        if (p.slug === slug) {
          return {
            ...p,
            specs: [...p.specs, { label: 'Specification', value: 'Value' }],
          };
        }
        return p;
      })
    );
  };

  const removeProjectSpecRow = (slug: string, index: number) => {
    setLocalProjects(prev =>
      prev.map(p => {
        if (p.slug === slug) {
          return {
            ...p,
            specs: p.specs.filter((_, idx) => idx !== index),
          };
        }
        return p;
      })
    );
  };

  // -------------------------------------------------------------
  // Render Gate Lock if not authenticated
  // -------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: '#131512',
        color: '#e9e8e2',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        fontFamily: 'system-ui, -apple-system, sans-serif',
      }}>
        <div style={{
          maxWidth: '440px',
          width: '100%',
          background: '#1c201b',
          border: '1px solid rgba(255,255,255,0.12)',
          padding: '40px 36px',
          boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              border: '1px solid rgba(255,255,255,0.25)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--serif, serif)',
              fontSize: '20px',
              background: '#222620',
            }}>A</div>
            <div>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', letterSpacing: '0.15em', color: '#9ca59b', textTransform: 'uppercase' }}>
                Ace Spaces · Bengaluru
              </div>
              <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', letterSpacing: '0.02em' }}>
                Studio Management Console
              </div>
            </div>
          </div>

          <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: '1.6', color: '#a0aba0', marginBottom: '24px' }}>
            Administrative console for architectural curators to manage hero slides, materials, colours, sector photography, and media assets.
          </p>

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div>
              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#8c968c', marginBottom: '6px' }}>
                Studio Passkey
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={e => setPasskeyInput(e.target.value)}
                placeholder="Enter studio passkey"
                style={{
                  width: '100%',
                  padding: '12px 14px',
                  background: '#121411',
                  border: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>

            {authError && (
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#e57373' }}>
                {authError}
              </div>
            )}

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '12px',
                background: '#e9e8e2',
                color: '#131512',
                border: 'none',
                fontFamily: 'DM Mono, monospace',
                fontSize: '11px',
                fontWeight: '600',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                marginTop: '6px',
              }}
            >
              Authenticate & Enter Console →
            </button>

            {process.env.NODE_ENV !== 'production' && (
              <button
                type="button"
                onClick={handleQuickBypass}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: 'transparent',
                  color: '#9ca59b',
                  border: '1px solid rgba(255,255,255,0.15)',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                }}
              >
                1-Click Studio Fast-Track (Local Dev Only)
              </button>
            )}
          </form>

          <div style={{ marginTop: '28px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link href="/" style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#808a80', textDecoration: 'none' }}>
              ← Return to Ace Spaces
            </Link>
            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#606860' }}>
              v2.4 Production
            </span>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // Render Full Admin Console
  // -------------------------------------------------------------
  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f4ee',
      color: '#1a1d19',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Floating Toast Notification */}
      {toastMessage && (
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          zIndex: 9999,
          background: toastType === 'error' ? '#a83232' : toastType === 'success' ? '#224528' : '#1a1d19',
          color: '#ffffff',
          padding: '12px 20px',
          boxShadow: '0 8px 24px rgba(0,0,0,0.25)',
          fontFamily: 'DM Mono, monospace',
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            style={{ background: 'transparent', border: 'none', color: '#ffffff', cursor: 'pointer', fontSize: '14px' }}
          >
            ×
          </button>
        </div>
      )}

      {/* Top Console Bar */}
      <header className="admin-header" style={{
        background: '#1a1d19',
        color: '#e9e8e2',
        padding: '16px 28px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Collapsible Sidebar Toggle Button */}
          <button
            onClick={() => setIsSidebarOpen(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 12px',
              background: isSidebarOpen ? 'rgba(255,255,255,0.08)' : '#e9e8e2',
              color: isSidebarOpen ? '#c2cdc2' : '#1a1d19',
              border: '1px solid rgba(255,255,255,0.25)',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.06em',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            title={isSidebarOpen ? 'Collapse Navigation Sidebar' : 'Open Navigation Sidebar'}
          >
            <span style={{ fontSize: '12px' }}>{isSidebarOpen ? '◀' : '☰'}</span>
            <span>{isSidebarOpen ? 'HIDE SIDEBAR' : 'OPEN SIDEBAR'}</span>
          </button>

          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{
              width: '28px',
              height: '28px',
              border: '1px solid rgba(255,255,255,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontFamily: 'var(--serif, serif)',
              fontSize: '16px',
            }}>A</span>
            <div style={{ lineHeight: 1.1 }}>
              <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', letterSpacing: '0.15em' }}>ACE SPACES</strong>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#9ca59b', letterSpacing: '0.1em' }}>STUDIO CONSOLE · CMS</div>
            </div>
          </Link>
          <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.15)' }} />
          <span style={{
            fontFamily: 'DM Mono, monospace',
            fontSize: '10px',
            color: '#73c991',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}>
            <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#73c991' }}></span>
            Database Live · Dynamic Sync Active
          </span>
        </div>

        <div className="admin-header-actions" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button
            onClick={handleResetDefaults}
            style={{
              padding: '7px 14px',
              background: 'transparent',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#c2cdc2',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              cursor: 'pointer',
            }}
          >
            Reset Factory Defaults
          </button>
          <button
            onClick={handleSaveAll}
            disabled={isContextLoading}
            style={{
              padding: '8px 18px',
              background: '#e9e8e2',
              border: 'none',
              color: '#1a1d19',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              cursor: isContextLoading ? 'wait' : 'pointer',
            }}
          >
            {isContextLoading ? 'Saving...' : 'Save All Changes ✓'}
          </button>
          <Link
            href="/"
            target="_blank"
            style={{
              padding: '7px 14px',
              background: '#2a3029',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              textDecoration: 'none',
              letterSpacing: '0.08em',
            }}
          >
            View Live Site ↗
          </Link>
          <button
            onClick={handleLogout}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#8c968c',
              fontFamily: 'DM Mono, monospace',
              fontSize: '10px',
              cursor: 'pointer',
              marginLeft: '8px',
            }}
          >
            Sign Out
          </button>
        </div>
      </header>

      {/* Admin Layout: Collapsible Sidebar + Workspace */}
      <div style={{ display: 'flex', flex: 1, minHeight: 'calc(100vh - 110px)', position: 'relative' }}>
        {/* Collapsible Sidebar Navigation */}
        <aside
          style={{
            width: isSidebarOpen ? '280px' : '0px',
            minWidth: isSidebarOpen ? '280px' : '0px',
            maxWidth: isSidebarOpen ? '280px' : '0px',
            background: '#151814',
            borderRight: isSidebarOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
            overflow: 'hidden',
            transition: 'width 0.28s cubic-bezier(0.16, 1, 0.3, 1), min-width 0.28s cubic-bezier(0.16, 1, 0.3, 1), max-width 0.28s cubic-bezier(0.16, 1, 0.3, 1)',
            display: 'flex',
            flexDirection: 'column',
            zIndex: 40,
            flexShrink: 0,
          }}
        >
          <div style={{ width: '280px', display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Sidebar Header */}
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#73c991', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                  STUDIO CONSOLE
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#e9e8e2', fontWeight: 600, letterSpacing: '0.08em' }}>
                  NAVIGATION MATRIX
                </div>
              </div>
              <button
                onClick={() => setIsSidebarOpen(false)}
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  color: '#9ca59b',
                  cursor: 'pointer',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  padding: '4px 8px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                }}
                title="Collapse Sidebar"
              >
                <span>✕</span>
                <span style={{ fontSize: '9px' }}>CLOSE</span>
              </button>
            </div>

            {/* Sidebar Navigation Items */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '16px 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {/* Category 1 */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#6d746d', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '8px 12px 4px 12px' }}>
                Foundry Curation & Assets
              </div>
              {[
                { key: 'overview', num: '01', title: 'Overview Matrix' },
                { key: 'hero', num: '02', title: 'Hero Slider & Images' },
                { key: 'materials', num: '03', title: 'Materials & Slabs' },
                { key: 'colors', num: '04', title: 'Colours & Swatches' },
                { key: 'applications', num: '05', title: 'Applications & Typologies' },
                { key: 'projects', num: '06', title: 'Projects & Case Studies', count: localProjects.length, badgeColor: '#68b5e8' },
                { key: 'journal', num: '07', title: 'Journal & Essays' },
                { key: 'media', num: '08', title: 'Media Asset Library' },
              ].map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as TabKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '3px solid #73c991' : '3px solid transparent',
                      color: isActive ? '#ffffff' : '#9ca59b',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 400,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ color: isActive ? '#73c991' : '#596059', fontSize: '10px', width: '18px' }}>
                      {item.num}
                    </span>
                    <span style={{ flex: 1 }}>{item.title}</span>
                    {item.count !== undefined && item.count > 0 && (
                      <span
                        style={{
                          background: item.badgeColor || '#73c991',
                          color: '#1a1d19',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}

              {/* Category 2 */}
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#6d746d', letterSpacing: '0.12em', textTransform: 'uppercase', padding: '16px 12px 4px 12px' }}>
                Real-Time Leads & Stream
              </div>
              {[
                {
                  key: 'orders',
                  num: '09',
                  title: 'Sample Orders',
                  count: orders.filter((o) => o.status === 'submitted' || o.status === 'in-progress').length,
                  badgeColor: '#e5a93b',
                },
                {
                  key: 'inquiries',
                  num: '10',
                  title: 'Enquiries',
                  count: inquiries.filter((i) => i.status === 'new').length,
                  badgeColor: '#73c991',
                },
                {
                  key: 'dispatch',
                  num: '11',
                  title: 'Dispatch Journal',
                  count: subscribers.length,
                  badgeColor: '#6da5c0',
                },
                {
                  key: 'ai-chats',
                  num: '12',
                  title: 'AI Concierge Chats',
                  count: chatSessions.filter((c) => c.status === 'new').length,
                  badgeColor: '#a78bfa',
                },
              ].map((item) => {
                const isActive = activeTab === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => setActiveTab(item.key as TabKey)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      width: '100%',
                      padding: '10px 14px',
                      background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                      border: 'none',
                      borderLeft: isActive ? '3px solid #73c991' : '3px solid transparent',
                      color: isActive ? '#ffffff' : '#9ca59b',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      fontWeight: isActive ? 600 : 400,
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <span style={{ color: isActive ? '#73c991' : '#596059', fontSize: '10px', width: '18px' }}>
                      {item.num}
                    </span>
                    <span style={{ flex: 1 }}>{item.title}</span>
                    {item.count > 0 && (
                      <span
                        style={{
                          background: item.badgeColor,
                          color: '#1a1d19',
                          fontSize: '9px',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '10px',
                        }}
                      >
                        {item.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Sidebar Footer */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', background: '#111410' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#73c991' }} />
                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#73c991' }}>
                  Live Data Stream Synced
                </span>
              </div>
              <Link
                href="/"
                target="_blank"
                style={{
                  display: 'block',
                  color: '#9ca59b',
                  textDecoration: 'none',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '10px',
                  letterSpacing: '0.05em',
                }}
              >
                View Live Site ↗
              </Link>
            </div>
          </div>
        </aside>

        {/* Floating Reopen Button when Sidebar is Collapsed */}
        {!isSidebarOpen && (
          <button
            onClick={() => setIsSidebarOpen(true)}
            style={{
              position: 'fixed',
              left: '16px',
              bottom: '24px',
              zIndex: 90,
              background: '#1a1d19',
              color: '#ffffff',
              border: '1px solid rgba(255,255,255,0.25)',
              padding: '10px 16px',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            title="Open Console Sidebar Navigation"
          >
            <span>☰</span>
            <span>OPEN SIDEBAR</span>
          </button>
        )}

        {/* Main Content Workspace */}
        <main style={{ flex: 1, minWidth: 0, padding: '32px 32px', maxWidth: '1440px', width: '100%', margin: '0 auto', overflowY: 'auto' }}>
        {/* =========================================================================
            TAB 1: OVERVIEW
        ========================================================================= */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ marginBottom: '28px' }}>
              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Studio Dashboard · Live Content Matrix
              </div>
              <h1 style={{ fontFamily: 'var(--serif, serif)', fontSize: '28px', fontWeight: 400, marginTop: '4px', margin: 0 }}>
                Ace Spaces Architectural Content System
              </h1>
              <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#596059', maxWidth: '720px', lineHeight: 1.6, marginTop: '8px' }}>
                Control the raw material catalog, Corian-style colour swatches, landing page hero carousels, and architectural case study photography in real-time.
              </p>
            </div>

            {/* Quick Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '32px' }}>
              {[
                { title: 'Sample Orders', count: orders.length, desc: `${orders.filter(o => o.status === 'submitted').length} new submitted`, tab: 'orders' },
                { title: 'Client Enquiries', count: inquiries.length, desc: `${inquiries.filter(i => i.status === 'new').length} new consultations`, tab: 'inquiries' },
                { title: 'AI Concierge Chats', count: chatSessions.length, desc: `${chatSessions.filter(c => c.status === 'new').length} new AI summaries`, tab: 'ai-chats' },
                { title: 'Dispatch Readers', count: subscribers.length, desc: `${subscribers.filter(s => s.status === 'active').length} active subscribers`, tab: 'dispatch' },
                { title: 'Hero Slides', count: localHeroSlides.length, desc: 'Active carousel sequences', tab: 'hero' },
                { title: 'Materials & Slabs', count: localMaterials.length, desc: 'Curated solid surfaces & slabs', tab: 'materials' },
                { title: 'Colours & Swatches', count: localMaterials.length, desc: 'Honed, matte & veined chips', tab: 'colors' },
                { title: 'Application Sectors', count: localSectors.length, desc: 'Hospitals, residential, retail, etc.', tab: 'applications' },
                { title: 'Case Studies & Projects', count: localProjects.length, desc: 'Selected architectural work', tab: 'projects' },
                { title: 'Journal Essays', count: localJournalArticles.length, desc: 'Architectural research & essays', tab: 'journal' },
                { title: 'Media Assets', count: mediaAssets.length, desc: 'Architectural images in storage', tab: 'media' },
              ].map(stat => (
                <div
                  key={stat.title}
                  onClick={() => setActiveTab(stat.tab as TabKey)}
                  style={{
                    background: '#ffffff',
                    padding: '20px',
                    border: '1px solid rgba(0,0,0,0.08)',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {stat.title}
                  </div>
                  <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '36px', margin: '8px 0 4px 0' }}>
                    {stat.count}
                  </div>
                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>
                    {stat.desc} →
                  </div>
                </div>
              ))}
            </div>

            {/* Direct WhatsApp Studio Configuration Card */}
            <div style={{ background: '#ffffff', padding: '24px 28px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '24px', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#25D366', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#168a3e', fontWeight: 600 }}>
                      Live Architectural WhatsApp Advisory
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>
                    Studio WhatsApp Desk & Specifier Hotline
                  </h3>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#6c746c', margin: '4px 0 0 0' }}>
                    Configures the direct contact number powering the top navbar button, mobile drawer card, home page enquiry desk, and floating concierge widget.
                  </p>
                </div>

                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  <a
                    href={generateWhatsAppUrl(localStudioContact.whatsappNumber, localStudioContact.whatsappDefaultMessage)}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      background: 'rgba(37, 211, 102, 0.12)',
                      border: '1px solid rgba(37, 211, 102, 0.4)',
                      color: '#0e2b15',
                      padding: '8px 14px',
                      borderRadius: '3px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    Test WhatsApp Link ↗
                  </a>
                  <button
                    type="button"
                    onClick={handleSaveWhatsAppConfig}
                    className="button button-dark"
                    style={{ padding: '8px 16px', fontSize: '11px', cursor: 'pointer' }}
                  >
                    Save Configuration ↗
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#6c746c', marginBottom: '6px' }}>
                    WhatsApp Phone Number (with Country Code)
                  </label>
                  <input
                    type="text"
                    value={localStudioContact.whatsappNumber}
                    onChange={(e) => setLocalStudioContact({ ...localStudioContact, whatsappNumber: e.target.value })}
                    placeholder="+91 98450 12345"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d4d8d4',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '12px',
                    }}
                  />
                  <small style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#889088' }}>
                    E.g., +91 98450 12345 (digits are automatically cleaned for wa.me)
                  </small>
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#6c746c', marginBottom: '6px' }}>
                    Display Label in Studio UI
                  </label>
                  <input
                    type="text"
                    value={localStudioContact.whatsappDisplay}
                    onChange={(e) => setLocalStudioContact({ ...localStudioContact, whatsappDisplay: e.target.value })}
                    placeholder="+91 98450 12345"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d4d8d4',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '12px',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#6c746c', marginBottom: '6px' }}>
                    Studio Status Badge Note
                  </label>
                  <input
                    type="text"
                    value={localStudioContact.availabilityStatus}
                    onChange={(e) => setLocalStudioContact({ ...localStudioContact, availabilityStatus: e.target.value })}
                    placeholder="Studio Online · Material Advisory"
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d4d8d4',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '12px',
                    }}
                  />
                </div>
              </div>

              <div style={{ marginTop: '16px' }}>
                <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#6c746c', marginBottom: '6px' }}>
                  Default Opening Greeting (Pre-filled in client WhatsApp chat)
                </label>
                <input
                  type="text"
                  value={localStudioContact.whatsappDefaultMessage}
                  onChange={(e) => setLocalStudioContact({ ...localStudioContact, whatsappDefaultMessage: e.target.value })}
                  placeholder="Hello Ace Spaces Studio, I would like to consult on material specification for an upcoming project."
                  style={{
                    width: '100%',
                    padding: '8px 12px',
                    border: '1px solid #d4d8d4',
                    fontFamily: 'Manrope, sans-serif',
                    fontSize: '12px',
                  }}
                />
              </div>
            </div>

            {/* Recent AI Concierge Interactions & Material Inquiries */}
            <div style={{ background: '#ffffff', padding: '24px 28px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '24px', borderRadius: '2px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#a78bfa', display: 'inline-block' }} />
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#7c3aed', fontWeight: 600 }}>
                      Real-Time AI Intelligence Feed
                    </span>
                  </div>
                  <h3 style={{ fontSize: '18px', fontWeight: 500, margin: 0 }}>
                    Recent AI Concierge Material Advisory Sessions
                  </h3>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#6c746c', margin: '4px 0 0 0' }}>
                    Autonomous summaries captured when visitors conclude discussions with the Ace Spaces AI Concierge.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('ai-chats')}
                  style={{
                    background: '#1a1d19',
                    color: '#ffffff',
                    border: 'none',
                    padding: '8px 16px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  Open AI Concierge Console ({chatSessions.length}) →
                </button>
              </div>

              {chatSessions.length === 0 ? (
                <div style={{ padding: '32px', textAlign: 'center', background: '#faf9f5', border: '1px dashed #d4d8d4' }}>
                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#889088', margin: 0 }}>
                    No AI chat sessions recorded yet. Engage the AI bot in the bottom-right corner and close it to generate an executive summary.
                  </p>
                </div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                  {chatSessions.slice(0, 3).map((session) => (
                    <div
                      key={session.id}
                      onClick={() => {
                        setSelectedChatSession(session);
                        setActiveTab('ai-chats');
                      }}
                      style={{
                        background: '#faf9f5',
                        border: '1px solid rgba(0,0,0,0.08)',
                        padding: '16px',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#7c3aed', fontWeight: 700, letterSpacing: '0.06em' }}>
                          {session.sessionNumber || session.id.slice(0, 14)}
                        </span>
                        <span
                          style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '9px',
                            fontWeight: 600,
                            padding: '2px 6px',
                            borderRadius: '2px',
                            background: session.status === 'new' ? '#ede9fe' : session.status === 'reviewed' ? '#fef3c7' : '#dcfce7',
                            color: session.status === 'new' ? '#6d28d9' : session.status === 'reviewed' ? '#b45309' : '#15803d',
                          }}
                        >
                          {session.status.toUpperCase()}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 600, margin: '0 0 6px 0', color: '#1a1d19', lineHeight: 1.3 }}>
                        {session.intent}
                      </h4>
                      <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#596059', margin: '0 0 10px 0', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {session.summary}
                      </p>
                      {session.materialsSuggested && session.materialsSuggested.length > 0 && (
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '8px' }}>
                          {session.materialsSuggested.slice(0, 2).map((m, idx) => (
                            <span
                              key={idx}
                              style={{
                                background: '#ecfdf5',
                                border: '1px solid #a7f3d0',
                                color: '#065f46',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '9px',
                                padding: '1px 6px',
                              }}
                            >
                              ★ {m}
                            </span>
                          ))}
                        </div>
                      )}
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#889088', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '8px' }}>
                        <span>{new Date(session.startedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })} · {session.messageCount} msgs</span>
                        <span style={{ color: '#1a1d19', fontWeight: 600 }}>Inspect Details →</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* System Status and Documentation */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
              <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px 0' }}>
                  Data Persistence & File Status
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f0efe8' }}>
                    <span style={{ color: '#6c746c' }}>Storage Path:</span>
                    <span>data/custom-content.json</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f0efe8' }}>
                    <span style={{ color: '#6c746c' }}>Uploads Directory:</span>
                    <span>public/assets/uploads/</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f0efe8' }}>
                    <span style={{ color: '#6c746c' }}>Client Cache Provider:</span>
                    <span style={{ color: '#2e7d32' }}>SiteContentProvider (Active)</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: '1px solid #f0efe8' }}>
                    <span style={{ color: '#6c746c' }}>Public Hosting:</span>
                    <span>https://acespacesindia.vercel.app</span>
                  </div>
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px 0' }}>
                  Quick Action Tasks
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <button
                    onClick={() => { setActiveTab('hero'); addHeroSlide(); }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#f5f4ee',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    + Add New Slide to Homepage Hero Carousel
                  </button>
                  <button
                    onClick={() => { setActiveTab('materials'); setIsAddingMaterial(true); }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#f5f4ee',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    + Register New Material Slab to Foundry Catalog
                  </button>
                  <button
                    onClick={() => { setActiveTab('colors'); setIsAddingColor(true); }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#f5f4ee',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    + Register New Color Swatch / Architectural Tone
                  </button>
                  <button
                    onClick={() => { setActiveTab('projects'); setIsAddingProject(true); }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#f5f4ee',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    + Document New Architectural Project Case Study
                  </button>
                  <button
                    onClick={() => { setActiveTab('journal'); setIsAddingJournal(true); }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#f5f4ee',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    + Publish New Architectural Journal Essay
                  </button>
                  <button
                    onClick={() => { setActiveTab('media'); }}
                    style={{
                      textAlign: 'left',
                      padding: '10px 14px',
                      background: '#f5f4ee',
                      border: '1px solid rgba(0,0,0,0.08)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    ↑ Upload High-Res Photography to Asset Library
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 2: HERO SLIDER MANAGER
        ========================================================================= */}
        {activeTab === 'hero' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Homepage Sequence Manager
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Hero Slider & Featured Photography
                </h2>
              </div>
              <button
                onClick={addHeroSlide}
                style={{
                  padding: '8px 16px',
                  background: '#1a1d19',
                  color: '#fff',
                  border: 'none',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  letterSpacing: '0.06em',
                  cursor: 'pointer',
                }}
              >
                + Add Hero Slide
              </button>
            </div>

            {/* Two-column layout: Slide Selector List & Active Slide Editor */}
            <div className="admin-two-col" style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '24px' }}>
              {/* Slide List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {localHeroSlides.map((slide, idx) => (
                  <div
                    key={slide.id}
                    onClick={() => setSelectedSlideIndex(idx)}
                    style={{
                      background: selectedSlideIndex === idx ? '#1a1d19' : '#ffffff',
                      color: selectedSlideIndex === idx ? '#ffffff' : '#1a1d19',
                      padding: '14px',
                      border: '1px solid rgba(0,0,0,0.08)',
                      cursor: 'pointer',
                      display: 'flex',
                      gap: '12px',
                      alignItems: 'center',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    <div style={{ width: '54px', height: '54px', position: 'relative', flexShrink: 0, background: '#333' }}>
                      {slide.image && (
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          sizes="54px"
                          style={{ objectFit: 'cover' }}
                        />
                      )}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '9px',
                        letterSpacing: '0.1em',
                        color: selectedSlideIndex === idx ? '#9ca59b' : '#788078',
                        textTransform: 'uppercase',
                      }}>
                        Slide 0{idx + 1}
                      </div>
                      <div style={{
                        fontFamily: 'var(--serif, serif)',
                        fontSize: '14px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        marginTop: '2px',
                      }}>
                        {slide.title} {slide.subtitle}
                      </div>
                      <div style={{
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        color: selectedSlideIndex === idx ? '#c4cdc4' : '#8c968c',
                      }}>
                        {slide.specimen}
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }} onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => moveHeroSlide(idx, 'up')}
                        disabled={idx === 0}
                        style={{ background: 'transparent', border: 'none', color: selectedSlideIndex === idx ? '#fff' : '#333', cursor: 'pointer', fontSize: '10px' }}
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveHeroSlide(idx, 'down')}
                        disabled={idx === localHeroSlides.length - 1}
                        style={{ background: 'transparent', border: 'none', color: selectedSlideIndex === idx ? '#fff' : '#333', cursor: 'pointer', fontSize: '10px' }}
                      >
                        ▼
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Active Slide Form */}
              {localHeroSlides[selectedSlideIndex] && (
                <div style={{ background: '#ffffff', padding: '28px', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f0efe8' }}>
                    <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                      Editing Slide 0{selectedSlideIndex + 1}
                    </h3>
                    <button
                      onClick={() => removeHeroSlide(selectedSlideIndex)}
                      style={{
                        background: 'transparent',
                        border: '1px solid #e57373',
                        color: '#d32f2f',
                        padding: '4px 10px',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      Delete Slide
                    </button>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Image Path (select from library or enter URL)
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={localHeroSlides[selectedSlideIndex].image}
                          onChange={e => updateSlideField(selectedSlideIndex, 'image', e.target.value)}
                          style={{
                            flex: 1,
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '12px',
                          }}
                        />
                        <select
                          onChange={e => { if (e.target.value) updateSlideField(selectedSlideIndex, 'image', e.target.value); }}
                          value=""
                          style={{
                            padding: '8px 12px',
                            border: '1px solid #ddd',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '11px',
                            background: '#f8f7f2',
                          }}
                        >
                          <option value="">Choose Existing Asset...</option>
                          {mediaAssets.map(img => (
                            <option key={img} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Eyebrow Label
                      </label>
                      <input
                        type="text"
                        value={localHeroSlides[selectedSlideIndex].eyebrow}
                        onChange={e => updateSlideField(selectedSlideIndex, 'eyebrow', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Specimen Tag
                      </label>
                      <input
                        type="text"
                        value={localHeroSlides[selectedSlideIndex].specimen}
                        onChange={e => updateSlideField(selectedSlideIndex, 'specimen', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Primary Headline (Title)
                      </label>
                      <input
                        type="text"
                        value={localHeroSlides[selectedSlideIndex].title}
                        onChange={e => updateSlideField(selectedSlideIndex, 'title', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'var(--serif, serif)', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Subtitle / Serif Accent
                      </label>
                      <input
                        type="text"
                        value={localHeroSlides[selectedSlideIndex].subtitle}
                        onChange={e => updateSlideField(selectedSlideIndex, 'subtitle', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'var(--serif, serif)', fontSize: '14px', fontStyle: 'italic' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Editorial Narrative Copy
                      </label>
                      <textarea
                        rows={3}
                        value={localHeroSlides[selectedSlideIndex].copy}
                        onChange={e => updateSlideField(selectedSlideIndex, 'copy', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.5 }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Location / Typology Note
                      </label>
                      <input
                        type="text"
                        value={localHeroSlides[selectedSlideIndex].location}
                        onChange={e => updateSlideField(selectedSlideIndex, 'location', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Live Hero Card Preview */}
                  <div style={{ marginTop: '20px', border: '1px solid #ecebe4', padding: '16px', background: '#1a1d19', color: '#fff' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#8c968c', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '12px' }}>
                      Preview As Rendered In Homepage Hero
                    </div>
                    <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
                      <div style={{ width: '140px', height: '90px', position: 'relative', background: '#333', flexShrink: 0 }}>
                        {localHeroSlides[selectedSlideIndex].image && (
                          <Image
                            src={localHeroSlides[selectedSlideIndex].image}
                            alt="preview"
                            fill
                            sizes="140px"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#9ca59b', letterSpacing: '0.08em' }}>
                          {localHeroSlides[selectedSlideIndex].eyebrow}
                        </div>
                        <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', margin: '4px 0' }}>
                          {localHeroSlides[selectedSlideIndex].title}{' '}
                          <em style={{ fontStyle: 'italic' }}>{localHeroSlides[selectedSlideIndex].subtitle}</em>
                        </div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#a0aba0', maxWidth: '480px', lineHeight: 1.4 }}>
                          {localHeroSlides[selectedSlideIndex].copy}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 3: MATERIALS & SLABS MANAGER
        ========================================================================= */}
        {activeTab === 'materials' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Foundry Inventory & Slab Catalog
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Materials & Architectural Slabs ({localMaterials.length})
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Search material or code..."
                  value={materialSearchQuery}
                  onChange={e => setMaterialSearchQuery(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                  }}
                />
                <button
                  onClick={() => setIsAddingMaterial(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#1a1d19',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <span>+</span>
                  <span>Add New Material Slab</span>
                </button>
              </div>
            </div>

            {/* Registration Form / Modal for New Material Slab */}
            {isAddingMaterial && (
              <div
                style={{
                  background: '#ffffff',
                  padding: '28px',
                  border: '2px solid #1a1d19',
                  marginBottom: '28px',
                  boxShadow: '0 12px 36px rgba(0,0,0,0.07)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '14px', borderBottom: '1px solid #e5e4de' }}>
                  <div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', letterSpacing: '0.08em' }}>
                      Foundry Inventory • Catalog Addition
                    </div>
                    <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', margin: '4px 0 0 0', fontWeight: 400 }}>
                      Register New Architectural Material Slab
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddingMaterial(false)}
                    style={{
                      background: 'transparent',
                      border: '1px solid #ddd',
                      padding: '4px 10px',
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontFamily: 'DM Mono, monospace',
                    }}
                    title="Close"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateMaterial} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Row 1: Core Identifiers */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Material Slab Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Calacatta Nuvo Gold"
                        value={newMaterialForm.name}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, name: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Material Code (e.g. AC-3040)
                      </label>
                      <input
                        type="text"
                        placeholder="Auto-generated if empty"
                        value={newMaterialForm.code}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, code: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Collection Series
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Noma Solids / Veined Mineral"
                        value={newMaterialForm.collection}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, collection: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Row 2: Aesthetic & Material Taxonomy */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Color Family
                      </label>
                      <select
                        value={newMaterialForm.colorFamily}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, colorFamily: e.target.value as Material['colorFamily'] }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="white">White</option>
                        <option value="cream">Cream</option>
                        <option value="grey">Grey</option>
                        <option value="earth">Earth</option>
                        <option value="black">Black</option>
                        <option value="translucent">Translucent</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Pattern / Aesthetic
                      </label>
                      <select
                        value={newMaterialForm.pattern}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, pattern: e.target.value as Material['pattern'] }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="solid">Solid</option>
                        <option value="veined">Veined</option>
                        <option value="particulate">Particulate</option>
                        <option value="translucent">Translucent</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Substrate Type
                      </label>
                      <select
                        value={newMaterialForm.type}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, type: e.target.value as Material['type'] }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="mineral">Mineral</option>
                        <option value="veined">Veined</option>
                        <option value="textured">Textured</option>
                        <option value="translucent">Translucent</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Finish Spec
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Honed Satin Matte"
                        value={newMaterialForm.finish}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, finish: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Row 3: Tone & Hex Color & Transmission */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1.2fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Color Tone / Nuance (e.g. Pure Chalk White)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Warm Linen Cream with golden taupe undertones"
                        value={newMaterialForm.colour}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, colour: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Hex Color Swatch
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={newMaterialForm.hexColor}
                          onChange={e => setNewMaterialForm(prev => ({ ...prev, hexColor: e.target.value }))}
                          style={{ width: '42px', height: '38px', border: '1px solid #ccc', padding: 0, cursor: 'pointer', flexShrink: 0 }}
                        />
                        <input
                          type="text"
                          value={newMaterialForm.hexColor}
                          onChange={e => setNewMaterialForm(prev => ({ ...prev, hexColor: e.target.value }))}
                          placeholder="#f4f3ef"
                          style={{ flex: 1, padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Light Transmission
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Low (6%) or Opaque"
                        value={newMaterialForm.lightTransmission}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, lightTransmission: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Row 4: Dimensions, Thicknesses & Fire Rating */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Standard Slab Dimensions
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 3660 mm × 760 mm"
                        value={newMaterialForm.dimensions}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, dimensions: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Thickness Options (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="12mm, 19mm"
                        value={newMaterialForm.thicknessOptions}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, thicknessOptions: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Fire Performance Rating
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Class 1 / Class A (ASTM E84)"
                        value={newMaterialForm.fireRating}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, fireRating: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Row 5: Applications & Care Guide */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Recommended Applications (comma separated)
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Kitchen Worktops, Wall Cladding, Monoliths"
                        value={newMaterialForm.applications}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, applications: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Architectural Care & Maintenance Guide
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Daily cleaning with damp microfibre cloth and mild neutral detergent."
                        value={newMaterialForm.careGuide}
                        onChange={e => setNewMaterialForm(prev => ({ ...prev, careGuide: e.target.value }))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  {/* Row 6: Imagery - Texture Specimen & Spatial In-Situ Photo */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ border: '1px solid #e5e4de', padding: '14px', background: '#faf9f6' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        Macro Slab Texture Specimen Image
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          placeholder="/assets/materials/css-stonique-sheet.jpg"
                          value={newMaterialForm.textureImage}
                          onChange={e => setNewMaterialForm(prev => ({ ...prev, textureImage: e.target.value }))}
                          style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                        <select
                          value=""
                          onChange={e => {
                            if (e.target.value) setNewMaterialForm(prev => ({ ...prev, textureImage: e.target.value }));
                          }}
                          style={{ padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                        >
                          <option value="">Media Asset...</option>
                          {mediaAssets.map(img => (
                            <option key={`tex-${img}`} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                      {newMaterialForm.textureImage && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={newMaterialForm.textureImage}
                            alt="Texture preview"
                            style={{ width: '64px', height: '48px', objectFit: 'cover', border: '1px solid #ccc' }}
                            onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078' }}>
                            Live Texture Specimen Preview
                          </span>
                        </div>
                      )}
                    </div>

                    <div style={{ border: '1px solid #e5e4de', padding: '14px', background: '#faf9f6' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                        In-Situ Spatial Application Photo
                      </label>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <input
                          type="text"
                          placeholder="/assets/applications/stonique-bathroom-vanity.jpg"
                          value={newMaterialForm.image}
                          onChange={e => setNewMaterialForm(prev => ({ ...prev, image: e.target.value }))}
                          style={{ flex: 1, padding: '8px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                        <select
                          value=""
                          onChange={e => {
                            if (e.target.value) setNewMaterialForm(prev => ({ ...prev, image: e.target.value }));
                          }}
                          style={{ padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                        >
                          <option value="">Media Asset...</option>
                          {mediaAssets.map(img => (
                            <option key={`app-${img}`} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                      {newMaterialForm.image && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <img
                            src={newMaterialForm.image}
                            alt="Application preview"
                            style={{ width: '64px', height: '48px', objectFit: 'cover', border: '1px solid #ccc' }}
                            onError={e => { (e.target as HTMLElement).style.display = 'none'; }}
                          />
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078' }}>
                            Live In-Situ Spatial Preview
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Row 7: Architectural Description */}
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px', letterSpacing: '0.05em' }}>
                      Architectural Narrative & Specification Description
                    </label>
                    <textarea
                      rows={3}
                      placeholder="e.g. Engineered solid surface architectural slab formulated for high-traffic monolithic surfaces, seamless fabrication, and tactile warmth."
                      value={newMaterialForm.description}
                      onChange={e => setNewMaterialForm(prev => ({ ...prev, description: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.5 }}
                    />
                  </div>

                  {/* Submission buttons */}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', paddingTop: '12px', borderTop: '1px solid #e5e4de' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddingMaterial(false)}
                      style={{
                        padding: '10px 20px',
                        background: '#f0efe8',
                        color: '#1a1d19',
                        border: '1px solid #ccc',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '11px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={isContextLoading}
                      style={{
                        padding: '10px 24px',
                        background: '#1a1d19',
                        color: '#ffffff',
                        border: 'none',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '11px',
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        cursor: isContextLoading ? 'wait' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <span>✓</span>
                      <span>{isContextLoading ? 'Registering Slab...' : 'Create & Register Material Slab'}</span>
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Two column: List of Materials & Full Material Editor */}
            <div className="admin-two-col" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
              {/* Materials Filter and List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '750px', overflowY: 'auto', paddingRight: '4px' }}>
                {localMaterials
                  .filter(m => {
                    const q = materialSearchQuery.trim().toLowerCase();
                    return (
                      !q ||
                      (m.name && m.name.toLowerCase().includes(q)) ||
                      (m.code && m.code.toLowerCase().includes(q)) ||
                      (m.collection && m.collection.toLowerCase().includes(q)) ||
                      (m.colour && m.colour.toLowerCase().includes(q)) ||
                      (m.finish && m.finish.toLowerCase().includes(q)) ||
                      (m.colorFamily && m.colorFamily.toLowerCase().includes(q)) ||
                      (m.hexColor && m.hexColor.toLowerCase().includes(q))
                    );
                  })
                  .map(mat => (
                    <div
                      key={mat.slug}
                      onClick={() => setSelectedMaterialSlug(mat.slug)}
                      style={{
                        background: selectedMaterialSlug === mat.slug ? '#1a1d19' : '#ffffff',
                        color: selectedMaterialSlug === mat.slug ? '#ffffff' : '#1a1d19',
                        padding: '12px 14px',
                        border: '1px solid rgba(0,0,0,0.08)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: mat.hexColor || '#ccc',
                        border: '1px solid rgba(0,0,0,0.15)',
                        flexShrink: 0,
                      }} />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {mat.name}
                        </div>
                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: selectedMaterialSlug === mat.slug ? '#9ca59b' : '#788078' }}>
                          {mat.code} · {mat.collection}
                        </div>
                      </div>
                      <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', padding: '2px 6px', background: selectedMaterialSlug === mat.slug ? '#333' : '#f0efe8', color: selectedMaterialSlug === mat.slug ? '#ccc' : '#666' }}>
                        {mat.colorFamily}
                      </span>
                    </div>
                  ))}
              </div>

              {/* Material Editor */}
              {selectedMaterial && (
                <div style={{ background: '#ffffff', padding: '28px', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f0efe8' }}>
                    <div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                        Material Specification
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', margin: '4px 0 0 0' }}>
                        {selectedMaterial.name} ({selectedMaterial.code})
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <button
                        onClick={handleSaveAll}
                        disabled={isContextLoading}
                        style={{
                          padding: '6px 14px',
                          background: '#1a1d19',
                          color: '#ffffff',
                          border: 'none',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          fontWeight: 600,
                          letterSpacing: '0.05em',
                          cursor: isContextLoading ? 'wait' : 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <span>💾</span>
                        <span>{isContextLoading ? 'Saving...' : 'Save Material & Push Live'}</span>
                      </button>
                      <Link
                        href={`/materials/${selectedMaterial.slug}`}
                        target="_blank"
                        style={{
                          padding: '6px 12px',
                          background: '#f0efe8',
                          color: '#1a1d19',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          textDecoration: 'none',
                        }}
                      >
                        View Public Page ↗
                      </Link>
                      <button
                        onClick={() => deleteMaterial(selectedMaterial.slug)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #e57373',
                          color: '#d32f2f',
                          padding: '6px 12px',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Material Name
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.name}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'name', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Material Code
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.code}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'code', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Collection Series
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.collection}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'collection', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Finish Spec
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.finish}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'finish', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Hex Colour Code & Swatch
                      </label>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="color"
                          value={selectedMaterial.hexColor || '#e5e4de'}
                          onChange={e => updateMaterialField(selectedMaterial.slug, 'hexColor', e.target.value)}
                          style={{ width: '40px', height: '36px', border: '1px solid #ddd', cursor: 'pointer', padding: 0 }}
                        />
                        <input
                          type="text"
                          value={selectedMaterial.hexColor || ''}
                          onChange={e => updateMaterialField(selectedMaterial.slug, 'hexColor', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Color Family
                      </label>
                      <select
                        value={selectedMaterial.colorFamily}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'colorFamily', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="white">White</option>
                        <option value="cream">Cream</option>
                        <option value="grey">Grey</option>
                        <option value="earth">Earth</option>
                        <option value="black">Black</option>
                        <option value="translucent">Translucent</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Pattern / Aesthetic
                      </label>
                      <select
                        value={selectedMaterial.pattern || 'solid'}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'pattern', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="solid">Solid</option>
                        <option value="veined">Veined</option>
                        <option value="particulate">Particulate</option>
                        <option value="translucent">Translucent</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Substrate Type
                      </label>
                      <select
                        value={selectedMaterial.type || 'mineral'}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'type', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="mineral">Mineral</option>
                        <option value="veined">Veined</option>
                        <option value="textured">Textured</option>
                        <option value="translucent">Translucent</option>
                      </select>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Color Tone Nuance / Hue Description
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.colour || ''}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'colour', e.target.value)}
                        placeholder="e.g. Pure Chalk White / Warm Alabaster"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Light Transmission
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.lightTransmission || ''}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'lightTransmission', e.target.value)}
                        placeholder="e.g. Low (6%) or Opaque"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Fire Performance Rating
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.fireRating || ''}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'fireRating', e.target.value)}
                        placeholder="e.g. Class 1 / Class A (ASTM E84)"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Slab Dimensions & Standard Thicknesses
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Dimensions (e.g. 3660 mm × 760 mm)"
                          value={selectedMaterial.dimensions || ''}
                          onChange={e => updateMaterialField(selectedMaterial.slug, 'dimensions', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                        <input
                          type="text"
                          placeholder="Thicknesses (comma separated: 12mm, 20mm)"
                          value={selectedMaterial.thicknessOptions?.join(', ') || ''}
                          onChange={e => updateMaterialField(selectedMaterial.slug, 'thicknessOptions', e.target.value.split(',').map(s => s.trim()))}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Recommended Applications (comma separated)
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.applications?.join(', ') || ''}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'applications', e.target.value.split(',').map(s => s.trim()))}
                        placeholder="e.g. Kitchen Worktops, Wall Cladding, Bespoke Monoliths"
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Architectural Care & Maintenance Guide
                      </label>
                      <input
                        type="text"
                        value={selectedMaterial.careGuide || ''}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'careGuide', e.target.value)}
                        placeholder="e.g. Daily cleaning with damp microfibre cloth and mild neutral detergent."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Macro Slab Texture Specimen Image URL
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={selectedMaterial.textureImage || ''}
                          onChange={e => updateMaterialField(selectedMaterial.slug, 'textureImage', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                        <select
                          onChange={e => { if (e.target.value) updateMaterialField(selectedMaterial.slug, 'textureImage', e.target.value); }}
                          value=""
                          style={{ padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#f8f7f2' }}
                        >
                          <option value="">Media...</option>
                          {mediaAssets.map(img => (
                            <option key={`edit-tex-${img}`} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        In-Situ Spatial Application Photo URL
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={selectedMaterial.image || ''}
                          onChange={e => updateMaterialField(selectedMaterial.slug, 'image', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                        <select
                          onChange={e => { if (e.target.value) updateMaterialField(selectedMaterial.slug, 'image', e.target.value); }}
                          value=""
                          style={{ padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#f8f7f2' }}
                        >
                          <option value="">Media...</option>
                          {mediaAssets.map(img => (
                            <option key={`edit-app-${img}`} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Architectural Description & Specification Narrative
                      </label>
                      <textarea
                        rows={3}
                        value={selectedMaterial.description || ''}
                        onChange={e => updateMaterialField(selectedMaterial.slug, 'description', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.5 }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 4: COLOURS & SWATCHES MANAGER
        ========================================================================= */}
        {activeTab === 'colors' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Curated Architectural Palette
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Colours & Material Swatches
                </h2>
              </div>
              <button
                onClick={() => setIsAddingColor(true)}
                style={{
                  padding: '8px 16px',
                  background: '#1a1d19',
                  color: '#fff',
                  border: 'none',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                + Register New Colour Swatch
              </button>
            </div>

            {/* Swatches Search and Quick Save Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flex: 1, maxWidth: '440px' }}>
                <input
                  type="text"
                  placeholder="Search swatches by name, code, finish, or hue..."
                  value={colorSearchQuery}
                  onChange={e => setColorSearchQuery(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    background: '#ffffff',
                  }}
                />
                {colorSearchQuery && (
                  <button
                    onClick={() => setColorSearchQuery('')}
                    style={{
                      background: '#1a1d19',
                      color: '#ffffff',
                      border: 'none',
                      padding: '8px 12px',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      cursor: 'pointer',
                    }}
                  >
                    Clear
                  </button>
                )}
              </div>
              <button
                onClick={handleSaveAll}
                disabled={isContextLoading}
                style={{
                  padding: '8px 16px',
                  background: '#1a1d19',
                  color: '#ffffff',
                  border: 'none',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  fontWeight: 600,
                  cursor: isContextLoading ? 'wait' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <span>💾</span>
                <span>{isContextLoading ? 'Saving...' : 'Save Swatches & Push Live ✓'}</span>
              </button>
            </div>

            {/* Swatch Registration Modal Form */}
            {isAddingColor && (
              <div style={{
                background: '#ffffff',
                padding: '24px',
                border: '2px solid #1a1d19',
                marginBottom: '24px',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', margin: 0 }}>
                    Add Architectural Colour Swatch
                  </h3>
                  <button
                    onClick={() => setIsAddingColor(false)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '16px' }}
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleCreateColor} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Colour Name (e.g. Alto / Ivory Vein)
                    </label>
                    <input
                      type="text"
                      required
                      value={newColorForm.name}
                      onChange={e => setNewColorForm(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Material name"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Code (e.g. AC-2204)
                    </label>
                    <input
                      type="text"
                      value={newColorForm.code}
                      onChange={e => setNewColorForm(prev => ({ ...prev, code: e.target.value }))}
                      placeholder="Auto-generated if blank"
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Color Family
                    </label>
                    <select
                      value={newColorForm.colorFamily}
                      onChange={e => setNewColorForm(prev => ({ ...prev, colorFamily: e.target.value as any }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="white">White</option>
                      <option value="cream">Cream</option>
                      <option value="grey">Grey</option>
                      <option value="earth">Earth</option>
                      <option value="black">Black</option>
                      <option value="translucent">Translucent</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Hex Tone & Color Chip
                    </label>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                      <input
                        type="color"
                        value={newColorForm.hexColor}
                        onChange={e => setNewColorForm(prev => ({ ...prev, hexColor: e.target.value }))}
                        style={{ width: '36px', height: '36px', border: '1px solid #ddd', cursor: 'pointer', padding: 0 }}
                      />
                      <input
                        type="text"
                        value={newColorForm.hexColor}
                        onChange={e => setNewColorForm(prev => ({ ...prev, hexColor: e.target.value }))}
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Finish Surface
                    </label>
                    <select
                      value={newColorForm.finish}
                      onChange={e => setNewColorForm(prev => ({ ...prev, finish: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                    >
                      <option value="Honed Matte">Honed Matte</option>
                      <option value="Satin Mineral">Satin Mineral</option>
                      <option value="Polished Gloss">Polished Gloss</option>
                      <option value="Translucent Backlit">Translucent Backlit</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Texture Specimen URL
                    </label>
                    <input
                      type="text"
                      value={newColorForm.textureImage}
                      onChange={e => setNewColorForm(prev => ({ ...prev, textureImage: e.target.value }))}
                      placeholder="Optional /assets/..."
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddingColor(false)}
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 18px', background: '#1a1d19', color: '#fff', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Save Swatch to Foundry →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Visual Swatches Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px' }}>
              {localMaterials
                .filter(mat => {
                  const q = colorSearchQuery.trim().toLowerCase();
                  if (!q) return true;
                  return (
                    (mat.name && mat.name.toLowerCase().includes(q)) ||
                    (mat.code && mat.code.toLowerCase().includes(q)) ||
                    (mat.colour && mat.colour.toLowerCase().includes(q)) ||
                    (mat.finish && mat.finish.toLowerCase().includes(q)) ||
                    (mat.collection && mat.collection.toLowerCase().includes(q)) ||
                    (mat.colorFamily && mat.colorFamily.toLowerCase().includes(q)) ||
                    (mat.hexColor && mat.hexColor.toLowerCase().includes(q))
                  );
                })
                .map(mat => (
                <div
                  key={mat.slug}
                  style={{
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.08)',
                    padding: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px',
                  }}
                >
                  <div style={{
                    width: '100%',
                    height: '90px',
                    background: mat.hexColor || '#ccc',
                    border: '1px solid rgba(0,0,0,0.1)',
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'flex-end',
                    padding: '8px',
                  }}>
                    <span style={{
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '9px',
                      background: 'rgba(0,0,0,0.6)',
                      color: '#fff',
                      padding: '2px 6px',
                    }}>
                      {mat.hexColor || '#e5e4de'}
                    </span>
                  </div>

                  <div>
                    <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '15px' }}>
                      {mat.name}
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', marginTop: '2px' }}>
                      {mat.code} · {mat.finish}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: 'auto', paddingTop: '8px', borderTop: '1px solid #f0efe8' }}>
                    <input
                      type="color"
                      value={mat.hexColor || '#e5e4de'}
                      onChange={e => updateMaterialField(mat.slug, 'hexColor', e.target.value)}
                      title="Adjust tone"
                      style={{ width: '28px', height: '28px', border: '1px solid #ddd', cursor: 'pointer', padding: 0 }}
                    />
                    <button
                      onClick={() => { setSelectedMaterialSlug(mat.slug); setActiveTab('materials'); }}
                      style={{
                        flex: 1,
                        padding: '6px',
                        background: '#f5f4ee',
                        border: '1px solid rgba(0,0,0,0.08)',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      Edit Specimen →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 5: APPLICATIONS & CASE STUDY PHOTOGRAPHY
        ========================================================================= */}
        {activeTab === 'applications' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Architectural Typology Manager
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Applications & Installation Photography
                </h2>
              </div>
              <Link
                href={`/applications/${selectedSector?.id || 'residential'}`}
                target="_blank"
                style={{
                  padding: '8px 16px',
                  background: '#1a1d19',
                  color: '#fff',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  textDecoration: 'none',
                }}
              >
                View Sector Live Page ↗
              </Link>
            </div>

            {/* Sector Selector Buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {localSectors.map(sec => (
                <button
                  key={sec.id}
                  onClick={() => setSelectedSectorId(sec.id)}
                  style={{
                    padding: '10px 16px',
                    background: selectedSectorId === sec.id ? '#1a1d19' : '#ffffff',
                    color: selectedSectorId === sec.id ? '#ffffff' : '#1a1d19',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  {sec.sectorNumber} · {sec.title}
                </button>
              ))}
            </div>

            {/* Selected Sector Editor */}
            {selectedSector && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                {/* Sector Narrative Form */}
                <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: '0 0 16px 0' }}>
                    Sector Narrative & Architectural Specs
                  </h3>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Sector Title
                      </label>
                      <input
                        type="text"
                        value={selectedSector.title}
                        onChange={e => updateSectorField(selectedSector.id, 'title', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'var(--serif, serif)', fontSize: '14px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Tagline / Architectural Concept
                      </label>
                      <input
                        type="text"
                        value={selectedSector.tagline}
                        onChange={e => updateSectorField(selectedSector.id, 'tagline', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Overview Paragraph
                      </label>
                      <textarea
                        rows={3}
                        value={selectedSector.overview}
                        onChange={e => updateSectorField(selectedSector.id, 'overview', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.5 }}
                      />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                          Typical Thickness
                        </label>
                        <input
                          type="text"
                          value={selectedSector.typicalThickness || ''}
                          onChange={e => updateSectorField(selectedSector.id, 'typicalThickness', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                          Joint Visibility
                        </label>
                        <input
                          type="text"
                          value={selectedSector.jointVisibility || ''}
                          onChange={e => updateSectorField(selectedSector.id, 'jointVisibility', e.target.value)}
                          style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Fabrication & Seam Detailing Note
                      </label>
                      <textarea
                        rows={2}
                        value={selectedSector.fabricationNote || ''}
                        onChange={e => updateSectorField(selectedSector.id, 'fabricationNote', e.target.value)}
                        placeholder="e.g. Custom thermoformed integral coved corners and silicone-free chemical welding..."
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.5 }}
                      />
                    </div>

                    {/* Sector Architectural Elements */}
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '6px' }}>
                        Typical Architectural Elements ({selectedSector.elements?.length || 0})
                      </label>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '180px', overflowY: 'auto', marginBottom: '8px' }}>
                        {selectedSector.elements?.map((elem, eIdx) => (
                          <div
                            key={eIdx}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              background: '#f8f7f2',
                              padding: '6px 10px',
                              border: '1px solid #eee',
                              fontSize: '11px',
                              fontFamily: 'DM Mono, monospace',
                            }}
                          >
                            <span style={{ color: '#73c991', fontSize: '12px' }}>•</span>
                            <span style={{ flex: 1 }}>{elem}</span>
                            <button
                              type="button"
                              onClick={() => removeSectorElement(selectedSector.id, eIdx)}
                              style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '13px', padding: '0 4px' }}
                              title="Remove element"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          placeholder="Add new architectural element..."
                          value={newSectorElementText}
                          onChange={e => setNewSectorElementText(e.target.value)}
                          onKeyDown={e => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              addSectorElement(selectedSector.id, newSectorElementText);
                            }
                          }}
                          style={{ flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                        <button
                          type="button"
                          onClick={() => addSectorElement(selectedSector.id, newSectorElementText)}
                          style={{ padding: '6px 12px', background: '#1a1d19', color: '#fff', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '10px', cursor: 'pointer' }}
                        >
                          + Add
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Sector Photography Gallery Manager */}
                <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                      Sector Photography Gallery ({selectedSector.images?.length || 0})
                    </h3>
                    <button
                      onClick={() => setIsAddingSectorPhoto(true)}
                      style={{
                        padding: '6px 12px',
                        background: '#1a1d19',
                        color: '#fff',
                        border: 'none',
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '10px',
                        cursor: 'pointer',
                      }}
                    >
                      + Add Photo
                    </button>
                  </div>

                  {/* Add photo inline modal */}
                  {isAddingSectorPhoto && (
                    <div style={{ background: '#f8f7f2', padding: '16px', border: '1px solid #ddd', marginBottom: '16px' }}>
                      <form onSubmit={handleAddSectorPhoto} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666' }}>
                            Image Path (or select from media)
                          </label>
                          <div style={{ display: 'flex', gap: '6px' }}>
                            <input
                              type="text"
                              required
                              placeholder="/assets/applications/..."
                              value={newSectorPhotoForm.src}
                              onChange={e => setNewSectorPhotoForm(prev => ({ ...prev, src: e.target.value }))}
                              style={{ flex: 1, padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                            />
                            <select
                              onChange={e => { if (e.target.value) setNewSectorPhotoForm(prev => ({ ...prev, src: e.target.value })); }}
                              value=""
                              style={{ padding: '6px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}
                            >
                              <option value="">Pick Asset...</option>
                              {mediaAssets.map(img => (
                                <option key={img} value={img}>{img.split('/').pop()}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                          <input
                            type="text"
                            placeholder="Caption (e.g. Monolithic Island)"
                            value={newSectorPhotoForm.caption}
                            onChange={e => setNewSectorPhotoForm(prev => ({ ...prev, caption: e.target.value }))}
                            style={{ padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                          />
                          <input
                            type="text"
                            placeholder="Tag (e.g. Countertop)"
                            value={newSectorPhotoForm.tag}
                            onChange={e => setNewSectorPhotoForm(prev => ({ ...prev, tag: e.target.value }))}
                            style={{ padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                          />
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setIsAddingSectorPhoto(false)}
                            style={{ padding: '4px 10px', background: 'transparent', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            style={{ padding: '4px 12px', background: '#1a1d19', color: '#fff', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '10px', cursor: 'pointer' }}
                          >
                            Add To Gallery
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Gallery Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px', maxHeight: '480px', overflowY: 'auto' }}>
                    {selectedSector.images?.map((img, pIdx) => (
                      <div key={pIdx} style={{ position: 'relative', border: '1px solid #eee', background: '#f8f7f2' }}>
                        <div style={{ width: '100%', height: '100px', position: 'relative' }}>
                          <Image
                            src={img.src}
                            alt={img.alt || 'photo'}
                            fill
                            sizes="140px"
                            style={{ objectFit: 'cover' }}
                          />
                        </div>
                        <div style={{ padding: '6px', fontFamily: 'DM Mono, monospace', fontSize: '9px' }}>
                          <div style={{ color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {img.caption || img.tag}
                          </div>
                          <button
                            onClick={() => removeSectorPhoto(selectedSector.id, pIdx)}
                            style={{
                              marginTop: '4px',
                              background: 'transparent',
                              border: 'none',
                              color: '#c62828',
                              cursor: 'pointer',
                              padding: 0,
                            }}
                          >
                            Remove ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Sector Recommended Material Gallery (Powers Application Material Gallery) */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                          Sector Recommended Materials Gallery ({selectedSector.recommendedMaterials?.length || 0})
                        </h3>
                        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', margin: '4px 0 0 0' }}>
                          Powers the interactive material palette & spec gallery on the /applications/{selectedSector.id} frontend page.
                        </p>
                      </div>
                    </div>

                    {/* Add Material to Sector Palette Bar */}
                    <div style={{ background: '#f8f7f2', padding: '14px', border: '1px solid #e5e4de', marginBottom: '18px' }}>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.08em', color: '#555', marginBottom: '8px' }}>
                        + Add Material to this Sector Palette
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1.6fr auto', gap: '8px' }}>
                        <select
                          value={newSectorMaterialSlug}
                          onChange={e => setNewSectorMaterialSlug(e.target.value)}
                          style={{ padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                        >
                          <option value="">Select Material from Catalog...</option>
                          {localMaterials.map(m => (
                            <option key={m.slug} value={m.slug}>
                              {m.name} ({m.collection})
                            </option>
                          ))}
                        </select>
                        <input
                          type="text"
                          placeholder="Recommended Finish (e.g. Ultra-smooth Satin Clean)"
                          value={newSectorMaterialFinish}
                          onChange={e => setNewSectorMaterialFinish(e.target.value)}
                          style={{ padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                        />
                        <button
                          type="button"
                          onClick={() => addSectorRecommendedMaterial(selectedSector.id, newSectorMaterialSlug, newSectorMaterialFinish)}
                          style={{
                            padding: '7px 16px',
                            background: '#1a1d19',
                            color: '#fff',
                            border: 'none',
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '10px',
                            cursor: 'pointer',
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                          }}
                        >
                          Add to Gallery
                        </button>
                      </div>
                    </div>

                    {/* Material Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '14px' }}>
                      {(selectedSector.recommendedMaterials || []).map(rec => {
                        const matDetail = localMaterials.find(m => m.slug === rec.slug);
                        return (
                          <div
                            key={rec.slug}
                            style={{
                              border: '1px solid #e0dfd5',
                              background: '#faf9f5',
                              padding: '12px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {/* Color/Texture Swatch */}
                              <div
                                style={{
                                  width: '42px',
                                  height: '42px',
                                  borderRadius: '4px',
                                  border: '1px solid rgba(0,0,0,0.12)',
                                  background: matDetail?.hexColor || matDetail?.textureCss || '#e0dfd5',
                                  flexShrink: 0,
                                  position: 'relative',
                                  overflow: 'hidden',
                                }}
                              >
                                {matDetail?.image && isValidImageSrc(matDetail.image) && (
                                  <Image
                                    src={matDetail.image}
                                    alt={matDetail.name || rec.name}
                                    fill
                                    sizes="42px"
                                    style={{ objectFit: 'cover' }}
                                  />
                                )}
                              </div>
                              <div style={{ minWidth: 0, flex: 1 }}>
                                <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '14px', fontWeight: 600, color: '#1a1d19', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {matDetail?.name || rec.name}
                                </div>
                                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#788078', textTransform: 'uppercase' }}>
                                  {matDetail?.collection || 'Curated Spec'} • /{rec.slug}
                                </div>
                              </div>
                            </div>

                            <div>
                              <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '3px' }}>
                                Recommended Finish
                              </label>
                              <input
                                type="text"
                                value={rec.finish}
                                onChange={e => updateSectorRecommendedMaterialFinish(selectedSector.id, rec.slug, e.target.value)}
                                style={{
                                  width: '100%',
                                  boxSizing: 'border-box',
                                  padding: '5px 8px',
                                  border: '1px solid #d0cfc7',
                                  fontFamily: 'DM Mono, monospace',
                                  fontSize: '10px',
                                  background: '#fff',
                                }}
                              />
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '4px', borderTop: '1px solid #ecebe4' }}>
                              <Link
                                href={`/materials/${rec.slug}`}
                                target="_blank"
                                style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#2a3029', textDecoration: 'none' }}
                              >
                                Inspect Material ↗
                              </Link>
                              <button
                                type="button"
                                onClick={() => removeSectorRecommendedMaterial(selectedSector.id, rec.slug)}
                                style={{
                                  background: 'transparent',
                                  border: 'none',
                                  color: '#c62828',
                                  fontFamily: 'DM Mono, monospace',
                                  fontSize: '9px',
                                  cursor: 'pointer',
                                  padding: 0,
                                }}
                              >
                                Remove ×
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {(!selectedSector.recommendedMaterials || selectedSector.recommendedMaterials.length === 0) && (
                        <div style={{ gridColumn: '1 / -1', padding: '24px', textAlign: 'center', color: '#888', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#faf9f5', border: '1px dashed #d5d4cd' }}>
                          No sector recommended materials configured. Add materials from the catalog above to populate the frontend material gallery.
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Sector Hygiene & Performance Compliance Testing Standards Table */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)', marginTop: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <div>
                        <h3 style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', margin: 0 }}>
                          Hygiene & Performance Compliance Standards ({selectedSector.hygieneAndPerformance?.length || 0})
                        </h3>
                        <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', margin: '4px 0 0 0' }}>
                          Certifications, resistance criteria & architectural compliance parameters displayed on the sector page.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setIsAddingHygieneRow(true)}
                        style={{
                          padding: '6px 12px',
                          background: '#1a1d19',
                          color: '#fff',
                          border: 'none',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          cursor: 'pointer',
                          letterSpacing: '0.05em',
                        }}
                      >
                        + Add Standard
                      </button>
                    </div>

                    {/* Add Inline Row */}
                    {isAddingHygieneRow && (
                      <div style={{ background: '#f8f7f2', padding: '16px', border: '1px solid #ddd', marginBottom: '16px' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 2fr', gap: '10px', marginBottom: '10px' }}>
                          <div>
                            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                              Performance Feature
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Bacterial & Microbe Resistance"
                              value={newHygieneForm.feature}
                              onChange={e => setNewHygieneForm(prev => ({ ...prev, feature: e.target.value }))}
                              style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                              Test Standard / Certification
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. ISO 846 Class 0"
                              value={newHygieneForm.standard}
                              onChange={e => setNewHygieneForm(prev => ({ ...prev, standard: e.target.value }))}
                              style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}
                            />
                          </div>
                          <div>
                            <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                              Architectural & Clinical Benefit
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Zero fungal & bacterial colony formation over 28-day continuous exposure."
                              value={newHygieneForm.benefit}
                              onChange={e => setNewHygieneForm(prev => ({ ...prev, benefit: e.target.value }))}
                              style={{ width: '100%', boxSizing: 'border-box', padding: '6px 8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}
                            />
                          </div>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                          <button
                            type="button"
                            onClick={() => setIsAddingHygieneRow(false)}
                            style={{ padding: '5px 12px', background: 'transparent', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={() => addSectorHygieneRow(selectedSector.id, newHygieneForm.feature, newHygieneForm.standard, newHygieneForm.benefit)}
                            style={{ padding: '5px 14px', background: '#1a1d19', color: '#fff', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '10px', cursor: 'pointer' }}
                          >
                            Save Standard
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Standards Table */}
                    <div style={{ overflowX: 'auto' }}>
                      <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}>
                        <thead>
                          <tr style={{ background: '#f4f3ed', borderBottom: '1px solid #e0ded4', textAlign: 'left' }}>
                            <th style={{ padding: '8px 10px', textTransform: 'uppercase', color: '#555', width: '25%' }}>Performance Feature</th>
                            <th style={{ padding: '8px 10px', textTransform: 'uppercase', color: '#555', width: '25%' }}>Standard / Test</th>
                            <th style={{ padding: '8px 10px', textTransform: 'uppercase', color: '#555', width: '45%' }}>Architectural / Clinical Benefit</th>
                            <th style={{ padding: '8px 10px', width: '5%', textAlign: 'center' }}>Del</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(selectedSector.hygieneAndPerformance || []).map((row, rIdx) => (
                            <tr key={rIdx} style={{ borderBottom: '1px solid #eee' }}>
                              <td style={{ padding: '6px 8px' }}>
                                <input
                                  type="text"
                                  value={row.feature}
                                  onChange={e => updateSectorHygieneRow(selectedSector.id, rIdx, 'feature', e.target.value)}
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '4px 6px', border: '1px solid #e5e4de', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}
                                />
                              </td>
                              <td style={{ padding: '6px 8px' }}>
                                <input
                                  type="text"
                                  value={row.standard}
                                  onChange={e => updateSectorHygieneRow(selectedSector.id, rIdx, 'standard', e.target.value)}
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '4px 6px', border: '1px solid #e5e4de', fontSize: '10px', fontFamily: 'DM Mono, monospace', fontWeight: 600 }}
                                />
                              </td>
                              <td style={{ padding: '6px 8px' }}>
                                <input
                                  type="text"
                                  value={row.benefit}
                                  onChange={e => updateSectorHygieneRow(selectedSector.id, rIdx, 'benefit', e.target.value)}
                                  style={{ width: '100%', boxSizing: 'border-box', padding: '4px 6px', border: '1px solid #e5e4de', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}
                                />
                              </td>
                              <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                                <button
                                  type="button"
                                  onClick={() => removeSectorHygieneRow(selectedSector.id, rIdx)}
                                  style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '12px' }}
                                >
                                  ×
                                </button>
                              </td>
                            </tr>
                          ))}
                          {(!selectedSector.hygieneAndPerformance || selectedSector.hygieneAndPerformance.length === 0) && (
                            <tr>
                              <td colSpan={4} style={{ padding: '16px', textAlign: 'center', color: '#888' }}>
                                No hygiene or compliance test parameters configured for this sector.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB: PROJECTS & ARCHITECTURAL CASE STUDIES MANAGER
        ========================================================================= */}
        {activeTab === 'projects' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Built Work & Realised Interventions
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Architectural Projects & Case Studies ({localProjects.length})
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/projects"
                  target="_blank"
                  style={{
                    padding: '8px 14px',
                    background: '#2a3029',
                    color: '#fff',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    textDecoration: 'none',
                    letterSpacing: '0.05em',
                  }}
                >
                  View /projects Gallery ↗
                </Link>
                <button
                  onClick={() => setIsAddingProject(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#1a1d19',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                  }}
                >
                  + Register New Case Study
                </button>
              </div>
            </div>

            {/* Filter & Search Toolbar */}
            <div style={{ background: '#ffffff', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.08)', marginBottom: '20px', display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: 1, minWidth: '220px' }}>
                <input
                  type="text"
                  placeholder="Search projects by title, location, architect or surface..."
                  value={projectSearchQuery}
                  onChange={e => setProjectSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    boxSizing: 'border-box',
                    padding: '8px 12px',
                    border: '1px solid #ccc',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexWrap: 'wrap' }}>
                {(['all', 'residential', 'hospitality', 'commercial', 'retail', 'healthcare'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setProjectCategoryFilter(cat)}
                    style={{
                      padding: '6px 12px',
                      background: projectCategoryFilter === cat ? '#1a1d19' : '#f4f3ed',
                      color: projectCategoryFilter === cat ? '#fff' : '#444',
                      border: '1px solid',
                      borderColor: projectCategoryFilter === cat ? '#1a1d19' : '#ddd',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '10px',
                      textTransform: 'uppercase',
                      cursor: 'pointer',
                      letterSpacing: '0.05em',
                    }}
                  >
                    {cat === 'all' ? 'All Sectors' : cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Modal / In-page Form for Adding New Project */}
            {isAddingProject && (
              <div style={{ background: '#ffffff', padding: '24px', border: '2px solid #1a1d19', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                  <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', margin: 0, fontWeight: 400 }}>
                    Register Architectural Case Study
                  </h3>
                  <button
                    onClick={() => setIsAddingProject(false)}
                    style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateProject} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Project Title *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Clinical precision & surgical hygiene"
                        value={newProjectForm.title}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, title: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Subtitle / Tagline
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Advanced Surgical Suite & Cleanroom Integration"
                        value={newProjectForm.subtitle}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, subtitle: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Typology / Category *
                      </label>
                      <select
                        value={newProjectForm.category}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, category: e.target.value as any }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="residential">Residential</option>
                        <option value="hospitality">Hospitality</option>
                        <option value="commercial">Commercial</option>
                        <option value="retail">Retail</option>
                        <option value="healthcare">Healthcare (Hospitals & Clinics)</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Location
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Hyderabad, Telangana"
                        value={newProjectForm.location}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, location: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Year Completed
                      </label>
                      <input
                        type="text"
                        placeholder="2024"
                        value={newProjectForm.year}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, year: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Architect / Studio
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Matrix Health Architects"
                        value={newProjectForm.architect}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, architect: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Scale / Area
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. 4,200 sq.m Surgical Wing"
                        value={newProjectForm.area}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, area: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Featured Surface Material
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Noma / White Chalk"
                        value={newProjectForm.materialUsed}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, materialUsed: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Linked Material in Catalog
                      </label>
                      <select
                        value={newProjectForm.materialSlug}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, materialSlug: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px', background: '#fff' }}
                      >
                        <option value="">Select Material...</option>
                        {localMaterials.map(m => (
                          <option key={m.slug} value={m.slug}>{m.name} ({m.collection})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Application Typology
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Scrub Sinks & Cleanroom Cladding"
                        value={newProjectForm.application}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, application: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                      Primary Installation Photography (URL or Media Asset)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="/assets/applications/..."
                        value={newProjectForm.image}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, image: e.target.value }))}
                        style={{ flex: 1, padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                      <select
                        onChange={e => { if (e.target.value) setNewProjectForm(prev => ({ ...prev, image: e.target.value })); }}
                        value=""
                        style={{ padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                      >
                        <option value="">Select Media Asset...</option>
                        {mediaAssets.map(img => (
                          <option key={img} value={img}>{img.split('/').pop()}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                      Project Description & Narrative
                    </label>
                    <textarea
                      rows={3}
                      placeholder="Comprehensive architectural narrative on spatial intent, client brief, and surface materiality..."
                      value={newProjectForm.description}
                      onChange={e => setNewProjectForm(prev => ({ ...prev, description: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '12px' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Architectural Challenge
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Spatial and technical hurdles faced during design & fabrication..."
                        value={newProjectForm.challenge}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, challenge: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '12px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Engineering & Material Solution
                      </label>
                      <textarea
                        rows={3}
                        placeholder="How Ace Spaces solid surfaces resolved the tolerances and performance criteria..."
                        value={newProjectForm.solution}
                        onChange={e => setNewProjectForm(prev => ({ ...prev, solution: e.target.value }))}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '12px' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                      Technical Specifications (One per line as: Label: Value)
                    </label>
                    <textarea
                      rows={3}
                      placeholder={`Surface Material: Noma Solid Mineral\nHygiene Standard: ISO 846 Class 0\nJoinery Type: Inconspicuous Thermo-weld`}
                      value={newProjectForm.specs}
                      onChange={e => setNewProjectForm(prev => ({ ...prev, specs: e.target.value }))}
                      style={{ width: '100%', boxSizing: 'border-box', padding: '8px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddingProject(false)}
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 20px', background: '#1a1d19', color: '#fff', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer', textTransform: 'uppercase' }}
                    >
                      Publish Case Study
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Master-Detail Split Workspace */}
            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '24px', alignItems: 'start' }}>
              {/* Left Column: Projects List */}
              <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto' }}>
                <div style={{ padding: '12px 16px', background: '#f8f7f2', borderBottom: '1px solid #eee', fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#666' }}>
                  Indexed Projects ({
                    localProjects.filter(p => {
                      const matchesCategory = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
                      const matchesQuery = !projectSearchQuery ||
                        p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                        p.location.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                        p.architect.toLowerCase().includes(projectSearchQuery.toLowerCase());
                      return matchesCategory && matchesQuery;
                    }).length
                  })
                </div>
                <div>
                  {localProjects
                    .filter(p => {
                      const matchesCategory = projectCategoryFilter === 'all' || p.category === projectCategoryFilter;
                      const matchesQuery = !projectSearchQuery ||
                        p.title.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                        p.location.toLowerCase().includes(projectSearchQuery.toLowerCase()) ||
                        p.architect.toLowerCase().includes(projectSearchQuery.toLowerCase());
                      return matchesCategory && matchesQuery;
                    })
                    .map(p => {
                      const isSelected = selectedProject?.slug === p.slug;
                      return (
                        <div
                          key={p.slug}
                          onClick={() => setSelectedProjectSlug(p.slug)}
                          style={{
                            padding: '14px 16px',
                            borderBottom: '1px solid #eee',
                            cursor: 'pointer',
                            background: isSelected ? '#f4f3ed' : '#ffffff',
                            borderLeft: isSelected ? '3px solid #1a1d19' : '3px solid transparent',
                            display: 'flex',
                            gap: '12px',
                            alignItems: 'center',
                          }}
                        >
                          <div style={{ width: '48px', height: '48px', position: 'relative', background: '#eee', flexShrink: 0, overflow: 'hidden' }}>
                            {p.image && isValidImageSrc(p.image) ? (
                              <Image src={p.image} alt={p.title} fill sizes="48px" style={{ objectFit: 'cover' }} />
                            ) : (
                              <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '9px', fontFamily: 'DM Mono, monospace' }}>
                                ARCH
                              </div>
                            )}
                          </div>
                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '14px', fontWeight: 600, color: '#1a1d19', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {p.title}
                            </div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', marginTop: '2px', display: 'flex', gap: '6px', alignItems: 'center' }}>
                              <span style={{
                                textTransform: 'uppercase',
                                padding: '1px 5px',
                                background: p.category === 'healthcare' ? '#e6fffa' : '#f0efe9',
                                color: p.category === 'healthcare' ? '#0d9488' : '#555',
                                borderRadius: '2px',
                                fontSize: '8px',
                              }}>
                                {p.category}
                              </span>
                              <span>{p.location}</span>
                              <span>•</span>
                              <span>{p.year}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>

              {/* Right Column: Active Project Editor */}
              {selectedProject ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {/* Top Bar with Quick Actions */}
                  <div style={{ background: '#ffffff', padding: '18px 24px', border: '1px solid rgba(0,0,0,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                        Selected Architectural Project
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 500, margin: '2px 0 0 0' }}>
                        {selectedProject.title}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href={`/projects/${selectedProject.slug}`}
                        target="_blank"
                        style={{
                          padding: '6px 12px',
                          background: '#2a3029',
                          color: '#fff',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          textDecoration: 'none',
                        }}
                      >
                        View Public Case Study ↗
                      </Link>
                      <button
                        type="button"
                        onClick={() => deleteProject(selectedProject.slug)}
                        style={{
                          padding: '6px 12px',
                          background: 'transparent',
                          border: '1px solid #c62828',
                          color: '#c62828',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete Project ×
                      </button>
                    </div>
                  </div>

                  {/* Visual Photography Asset Card */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <h4 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 14px 0', color: '#444' }}>
                      Project Hero Photography
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', gap: '20px', alignItems: 'center' }}>
                      <div style={{ width: '240px', height: '150px', position: 'relative', background: '#f5f5f0', border: '1px solid #ddd', overflow: 'hidden' }}>
                        {selectedProject.image && isValidImageSrc(selectedProject.image) ? (
                          <Image src={selectedProject.image} alt={selectedProject.title} fill sizes="240px" style={{ objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}>
                            No Hero Photo
                          </div>
                        )}
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '3px' }}>
                            Image Path (or Pick from Media Library)
                          </label>
                          <input
                            type="text"
                            value={selectedProject.image}
                            onChange={e => updateProjectField(selectedProject.slug, 'image', e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                          />
                        </div>
                        <div>
                          <select
                            onChange={e => { if (e.target.value) updateProjectField(selectedProject.slug, 'image', e.target.value); }}
                            value=""
                            style={{ padding: '6px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '10px', background: '#fff' }}
                          >
                            <option value="">Pick from Uploaded Assets...</option>
                            {mediaAssets.map(img => (
                              <option key={img} value={img}>{img.split('/').pop()}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Core Information Card */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <h4 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0', color: '#444' }}>
                      Spatial Typology & Project Identifiers
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Project Title
                        </label>
                        <input
                          type="text"
                          value={selectedProject.title}
                          onChange={e => updateProjectField(selectedProject.slug, 'title', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Subtitle / Spatial Subhead
                        </label>
                        <input
                          type="text"
                          value={selectedProject.subtitle}
                          onChange={e => updateProjectField(selectedProject.slug, 'subtitle', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Category / Architectural Typology
                        </label>
                        <select
                          value={selectedProject.category}
                          onChange={e => updateProjectField(selectedProject.slug, 'category', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                        >
                          <option value="residential">Residential</option>
                          <option value="hospitality">Hospitality</option>
                          <option value="commercial">Commercial</option>
                          <option value="retail">Retail</option>
                          <option value="healthcare">Healthcare (Hospitals & Cleanrooms)</option>
                        </select>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Location
                        </label>
                        <input
                          type="text"
                          value={selectedProject.location}
                          onChange={e => updateProjectField(selectedProject.slug, 'location', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Year
                        </label>
                        <input
                          type="text"
                          value={selectedProject.year}
                          onChange={e => updateProjectField(selectedProject.slug, 'year', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Architectural Practice
                        </label>
                        <input
                          type="text"
                          value={selectedProject.architect}
                          onChange={e => updateProjectField(selectedProject.slug, 'architect', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Floor Area / Scope
                        </label>
                        <input
                          type="text"
                          value={selectedProject.area}
                          onChange={e => updateProjectField(selectedProject.slug, 'area', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Surface Specification & Catalog Link */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <h4 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0', color: '#444' }}>
                      Surface Specification & Catalog Connectivity
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Material Display Name
                        </label>
                        <input
                          type="text"
                          value={selectedProject.materialUsed}
                          onChange={e => updateProjectField(selectedProject.slug, 'materialUsed', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Linked Catalog Material (/materials/[slug])
                        </label>
                        <select
                          value={selectedProject.materialSlug}
                          onChange={e => updateProjectField(selectedProject.slug, 'materialSlug', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                        >
                          <option value="">Select Material...</option>
                          {localMaterials.map(m => (
                            <option key={m.slug} value={m.slug}>{m.name} ({m.collection})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Application Type
                        </label>
                        <input
                          type="text"
                          value={selectedProject.application}
                          onChange={e => updateProjectField(selectedProject.slug, 'application', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                        Fabrication & Joinery Techniques
                      </label>
                      <input
                        type="text"
                        value={selectedProject.fabrication}
                        onChange={e => updateProjectField(selectedProject.slug, 'fabrication', e.target.value)}
                        style={{ width: '100%', boxSizing: 'border-box', padding: '7px 10px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>

                  {/* Architectural Narrative, Challenge & Solution */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <h4 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: '0 0 16px 0', color: '#444' }}>
                      Architectural Case Study Narrative
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      <div>
                        <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                          Executive Project Summary & Context
                        </label>
                        <textarea
                          rows={3}
                          value={selectedProject.description}
                          onChange={e => updateProjectField(selectedProject.slug, 'description', e.target.value)}
                          style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '12px' }}
                        />
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                            Spatial & Structural Challenge
                          </label>
                          <textarea
                            rows={3}
                            value={selectedProject.challenge}
                            onChange={e => updateProjectField(selectedProject.slug, 'challenge', e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '12px' }}
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '9px', textTransform: 'uppercase', color: '#666', marginBottom: '4px' }}>
                            Engineering & Material Solution
                          </label>
                          <textarea
                            rows={3}
                            value={selectedProject.solution}
                            onChange={e => updateProjectField(selectedProject.slug, 'solution', e.target.value)}
                            style={{ width: '100%', boxSizing: 'border-box', padding: '8px 10px', border: '1px solid #ccc', fontFamily: 'inherit', fontSize: '12px' }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Technical Specifications Table */}
                  <div style={{ background: '#ffffff', padding: '24px', border: '1px solid rgba(0,0,0,0.08)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                      <h4 style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0, color: '#444' }}>
                        Technical Specifications Matrix ({selectedProject.specs?.length || 0})
                      </h4>
                      <button
                        type="button"
                        onClick={() => addProjectSpecRow(selectedProject.slug)}
                        style={{
                          padding: '4px 10px',
                          background: '#1a1d19',
                          color: '#fff',
                          border: 'none',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        + Add Spec Row
                      </button>
                    </div>

                    <table style={{ width: '100%', borderCollapse: 'collapse', fontFamily: 'DM Mono, monospace', fontSize: '10px' }}>
                      <thead>
                        <tr style={{ background: '#f4f3ed', borderBottom: '1px solid #e0ded4', textAlign: 'left' }}>
                          <th style={{ padding: '8px 10px', textTransform: 'uppercase', color: '#555', width: '40%' }}>Parameter / Label</th>
                          <th style={{ padding: '8px 10px', textTransform: 'uppercase', color: '#555', width: '50%' }}>Specification Value</th>
                          <th style={{ padding: '8px 10px', width: '10%', textAlign: 'center' }}>Del</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedProject.specs || []).map((sp, sIdx) => (
                          <tr key={sIdx} style={{ borderBottom: '1px solid #eee' }}>
                            <td style={{ padding: '6px 8px' }}>
                              <input
                                type="text"
                                value={sp.label}
                                onChange={e => updateProjectSpec(selectedProject.slug, sIdx, 'label', e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '4px 6px', border: '1px solid #e5e4de', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}
                              />
                            </td>
                            <td style={{ padding: '6px 8px' }}>
                              <input
                                type="text"
                                value={sp.value}
                                onChange={e => updateProjectSpec(selectedProject.slug, sIdx, 'value', e.target.value)}
                                style={{ width: '100%', boxSizing: 'border-box', padding: '4px 6px', border: '1px solid #e5e4de', fontSize: '10px', fontFamily: 'DM Mono, monospace' }}
                              />
                            </td>
                            <td style={{ padding: '6px 8px', textAlign: 'center' }}>
                              <button
                                type="button"
                                onClick={() => removeProjectSpecRow(selectedProject.slug, sIdx)}
                                style={{ background: 'transparent', border: 'none', color: '#c62828', cursor: 'pointer', fontSize: '12px' }}
                              >
                                ×
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div style={{ background: '#ffffff', padding: '40px', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', color: '#788078' }}>
                    Select an architectural case study from the left index to edit its narrative, typology, and specifications.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 6: JOURNAL ESSAYS & ARTICLES MANAGER
        ========================================================================= */}
        {activeTab === 'journal' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Editorial & Spatial Publications
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Journal Essays & Research Notes ({localJournalArticles.length})
                </h2>
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <Link
                  href="/journal"
                  target="_blank"
                  style={{
                    padding: '8px 14px',
                    background: '#2a3029',
                    color: '#fff',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    textDecoration: 'none',
                  }}
                >
                  View Journal Page ↗
                </Link>
                <button
                  onClick={() => setIsAddingJournal(true)}
                  style={{
                    padding: '8px 16px',
                    background: '#1a1d19',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  + Write New Essay
                </button>
              </div>
            </div>

            {/* Create Essay Modal */}
            {isAddingJournal && (
              <div style={{
                background: '#ffffff',
                padding: '28px',
                border: '2px solid #1a1d19',
                marginBottom: '28px',
                boxShadow: '0 12px 36px rgba(0,0,0,0.08)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #eee', paddingBottom: '12px' }}>
                  <div>
                    <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078' }}>Editorial Dispatch</span>
                    <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', margin: '2px 0 0 0' }}>Create New Architectural Essay</h3>
                  </div>
                  <button onClick={() => setIsAddingJournal(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '20px' }}>×</button>
                </div>

                <form onSubmit={handleCreateJournal} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Essay Title (Primary Headline)
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. The optics of translucent mineral surfaces in ambient light."
                      value={newJournalForm.title}
                      onChange={e => setNewJournalForm(prev => ({ ...prev, title: e.target.value }))}
                      style={{ width: '100%', padding: '10px 14px', border: '1px solid #ccc', fontFamily: 'var(--serif, serif)', fontSize: '16px' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Category / Topic
                    </label>
                    <select
                      value={newJournalForm.category}
                      onChange={e => setNewJournalForm(prev => ({ ...prev, category: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                    >
                      <option value="Material Knowledge">Material Knowledge</option>
                      <option value="Fabrication">Fabrication</option>
                      <option value="Spatial Essays">Spatial Essays</option>
                      <option value="Optical Studies">Optical Studies</option>
                      <option value="Sustainable Practice">Sustainable Practice</option>
                      <option value="Architecture">Architecture</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Publication Date & Read Time
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        placeholder="e.g. August 2026"
                        value={newJournalForm.date}
                        onChange={e => setNewJournalForm(prev => ({ ...prev, date: e.target.value }))}
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                      />
                      <input
                        type="text"
                        placeholder="e.g. 05 min read"
                        value={newJournalForm.readTime}
                        onChange={e => setNewJournalForm(prev => ({ ...prev, readTime: e.target.value }))}
                        style={{ width: '120px', padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Hero Image Path (select from library or enter URL)
                    </label>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <input
                        type="text"
                        value={newJournalForm.image}
                        onChange={e => setNewJournalForm(prev => ({ ...prev, image: e.target.value }))}
                        style={{ flex: 1, padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                      />
                      <select
                        onChange={e => { if (e.target.value) setNewJournalForm(prev => ({ ...prev, image: e.target.value })); }}
                        value=""
                        style={{ padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#f8f7f2' }}
                      >
                        <option value="">Choose Existing Image...</option>
                        {mediaAssets.map(img => (
                          <option key={img} value={img}>{img.split('/').pop()}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Lead Summary
                    </label>
                    <textarea
                      rows={2}
                      placeholder="Brief overview summarizing the core architectural observation..."
                      value={newJournalForm.summary}
                      onChange={e => setNewJournalForm(prev => ({ ...prev, summary: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.5 }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Full Essay Text (separate paragraphs with blank lines)
                    </label>
                    <textarea
                      rows={6}
                      value={newJournalForm.content}
                      onChange={e => setNewJournalForm(prev => ({ ...prev, content: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.6 }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1' }}>
                    <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                      Architectural Pull Quote (optional)
                    </label>
                    <input
                      type="text"
                      placeholder="Notable highlight quote rendered with large serif typography..."
                      value={newJournalForm.quote}
                      onChange={e => setNewJournalForm(prev => ({ ...prev, quote: e.target.value }))}
                      style={{ width: '100%', padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'var(--serif, serif)', fontSize: '13px', fontStyle: 'italic' }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                    <button
                      type="button"
                      onClick={() => setIsAddingJournal(false)}
                      style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 20px', background: '#1a1d19', color: '#fff', border: 'none', fontFamily: 'DM Mono, monospace', fontSize: '11px', cursor: 'pointer' }}
                    >
                      Publish Essay to Journal →
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Main 2-column layout: Essay List & Editor */}
            <div className="admin-two-col" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
              {/* Essay List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                <input
                  type="text"
                  placeholder="Filter essays by title or category..."
                  value={journalSearchQuery}
                  onChange={e => setJournalSearchQuery(e.target.value)}
                  style={{ padding: '8px 12px', border: '1px solid #ccc', fontFamily: 'DM Mono, monospace', fontSize: '11px', background: '#fff' }}
                />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '720px', overflowY: 'auto', paddingRight: '4px' }}>
                  {localJournalArticles
                    .filter(j => {
                      const q = journalSearchQuery.toLowerCase();
                      return !q || j.title.toLowerCase().includes(q) || j.category.toLowerCase().includes(q);
                    })
                    .map((essay, idx) => (
                      <div
                        key={essay.slug}
                        onClick={() => setSelectedJournalSlug(essay.slug)}
                        style={{
                          background: selectedJournalSlug === essay.slug ? '#1a1d19' : '#ffffff',
                          color: selectedJournalSlug === essay.slug ? '#ffffff' : '#1a1d19',
                          padding: '14px',
                          border: '1px solid rgba(0,0,0,0.08)',
                          cursor: 'pointer',
                          display: 'flex',
                          gap: '12px',
                          alignItems: 'center',
                        }}
                      >
                        <div style={{ width: '48px', height: '48px', position: 'relative', flexShrink: 0, background: '#222' }}>
                          {essay.image && (
                            <Image
                              src={essay.image}
                              alt={essay.title}
                              fill
                              sizes="48px"
                              style={{ objectFit: 'cover' }}
                            />
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontFamily: 'DM Mono, monospace',
                            fontSize: '9px',
                            textTransform: 'uppercase',
                            letterSpacing: '0.08em',
                            color: selectedJournalSlug === essay.slug ? '#9ca59b' : '#788078',
                          }}>
                            {essay.category} · {essay.date}
                          </div>
                          <div style={{
                            fontFamily: 'var(--serif, serif)',
                            fontSize: '13px',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            marginTop: '2px',
                          }}>
                            {essay.title}
                          </div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: selectedJournalSlug === essay.slug ? '#c2cdc2' : '#889088' }}>
                            {essay.readTime} · {essay.author}
                          </div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }} onClick={e => e.stopPropagation()}>
                          <button
                            onClick={() => moveJournalArticle(idx, 'up')}
                            disabled={idx === 0}
                            style={{ background: 'transparent', border: 'none', color: selectedJournalSlug === essay.slug ? '#fff' : '#444', cursor: 'pointer', fontSize: '9px' }}
                          >
                            ▲
                          </button>
                          <button
                            onClick={() => moveJournalArticle(idx, 'down')}
                            disabled={idx === localJournalArticles.length - 1}
                            style={{ background: 'transparent', border: 'none', color: selectedJournalSlug === essay.slug ? '#fff' : '#444', cursor: 'pointer', fontSize: '9px' }}
                          >
                            ▼
                          </button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Active Essay Editor */}
              {selectedJournal && (
                <div style={{ background: '#ffffff', padding: '28px', border: '1px solid rgba(0,0,0,0.08)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f0efe8' }}>
                    <div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                        Editing Publication ({selectedJournal.slug})
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', margin: '4px 0 0 0' }}>
                        {selectedJournal.title}
                      </h3>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link
                        href="/journal"
                        target="_blank"
                        style={{
                          padding: '6px 12px',
                          background: '#f0efe8',
                          color: '#1a1d19',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          textDecoration: 'none',
                        }}
                      >
                        View On Site ↗
                      </Link>
                      <button
                        onClick={() => deleteJournalArticle(selectedJournal.slug)}
                        style={{
                          background: 'transparent',
                          border: '1px solid #e57373',
                          color: '#d32f2f',
                          padding: '6px 12px',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '10px',
                          cursor: 'pointer',
                        }}
                      >
                        Delete Essay
                      </button>
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Headline / Title
                      </label>
                      <input
                        type="text"
                        value={selectedJournal.title}
                        onChange={e => updateJournalField(selectedJournal.slug, 'title', e.target.value)}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', fontFamily: 'var(--serif, serif)', fontSize: '16px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Category
                      </label>
                      <input
                        type="text"
                        value={selectedJournal.category}
                        onChange={e => updateJournalField(selectedJournal.slug, 'category', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Publication Date & Read Time
                      </label>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          value={selectedJournal.date}
                          onChange={e => updateJournalField(selectedJournal.slug, 'date', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                        <input
                          type="text"
                          value={selectedJournal.readTime}
                          onChange={e => updateJournalField(selectedJournal.slug, 'readTime', e.target.value)}
                          style={{ width: '120px', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                        />
                      </div>
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Author / Spatial Unit
                      </label>
                      <input
                        type="text"
                        value={selectedJournal.author}
                        onChange={e => updateJournalField(selectedJournal.slug, 'author', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px' }}
                      />
                    </div>

                    <div>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Hero Image Path
                      </label>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <input
                          type="text"
                          value={selectedJournal.image}
                          onChange={e => updateJournalField(selectedJournal.slug, 'image', e.target.value)}
                          style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                        />
                        <select
                          onChange={e => { if (e.target.value) updateJournalField(selectedJournal.slug, 'image', e.target.value); }}
                          value=""
                          style={{ padding: '8px 10px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '10px', background: '#f8f7f2' }}
                        >
                          <option value="">Pick Asset...</option>
                          {mediaAssets.map(img => (
                            <option key={img} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Lead Summary
                      </label>
                      <textarea
                        rows={2}
                        value={selectedJournal.summary}
                        onChange={e => updateJournalField(selectedJournal.slug, 'summary', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.5 }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Pull Quote (Editorial Accent)
                      </label>
                      <input
                        type="text"
                        value={selectedJournal.quote || ''}
                        onChange={e => updateJournalField(selectedJournal.slug, 'quote', e.target.value)}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'var(--serif, serif)', fontSize: '13px', fontStyle: 'italic' }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Full Article Paragraphs (separate paragraphs with blank lines)
                      </label>
                      <textarea
                        rows={8}
                        value={selectedJournal.content?.join('\n\n') || ''}
                        onChange={e => updateJournalField(selectedJournal.slug, 'content', e.target.value.split('\n\n').map(p => p.trim()).filter(Boolean))}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.6 }}
                      />
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Key Takeaways (comma separated)
                      </label>
                      <input
                        type="text"
                        value={selectedJournal.takeaways?.join(', ') || ''}
                        onChange={e => updateJournalField(selectedJournal.slug, 'takeaways', e.target.value.split(',').map(t => t.trim()).filter(Boolean))}
                        style={{ width: '100%', padding: '8px 12px', border: '1px solid #ddd', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}
                      />
                    </div>
                  </div>

                  {/* Visual Preview Card */}
                  <div style={{ marginTop: '24px', borderTop: '1px solid #eee', paddingTop: '16px' }}>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', marginBottom: '10px' }}>
                      Journal Card Preview (as shown in /journal grid)
                    </div>
                    <div style={{ maxWidth: '420px', background: '#ffffff', border: '1px solid var(--line, #e2dfd5)', padding: '20px' }}>
                      <div style={{ width: '100%', height: '140px', position: 'relative', background: '#333', marginBottom: '14px' }}>
                        {selectedJournal.image && (
                          <Image
                            src={selectedJournal.image}
                            alt={selectedJournal.title}
                            fill
                            sizes="420px"
                            style={{ objectFit: 'cover' }}
                          />
                        )}
                      </div>
                      <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                        {selectedJournal.category} · {selectedJournal.date}
                      </div>
                      <h4 style={{ fontFamily: 'var(--serif, serif)', fontSize: '17px', margin: '6px 0 8px 0', lineHeight: 1.3 }}>
                        {selectedJournal.title}
                      </h4>
                      <p style={{ fontFamily: 'system-ui, sans-serif', fontSize: '12px', color: '#555', lineHeight: 1.5, margin: 0 }}>
                        {selectedJournal.summary}
                      </p>
                      <div style={{ marginTop: '14px', paddingTop: '10px', borderTop: '1px solid #f0efe8', display: 'flex', justifyContent: 'space-between', fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#888' }}>
                        <span>{selectedJournal.readTime}</span>
                        <span>Read Essay ↗</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 7: MEDIA ASSET LIBRARY & DIRECT UPLOADER
        ========================================================================= */}
        {activeTab === 'media' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Visual Storage & Asset Repository
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Media Asset Library ({mediaAssets.length} items)
                </h2>
              </div>

              {/* Upload Input */}
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/*"
                  style={{ display: 'none' }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  style={{
                    padding: '8px 18px',
                    background: '#1a1d19',
                    color: '#fff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    letterSpacing: '0.06em',
                    cursor: uploading ? 'wait' : 'pointer',
                  }}
                >
                  {uploading ? 'Uploading...' : '↑ Upload New Image'}
                </button>
              </div>
            </div>

            {/* Filter buttons */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
              {[
                { label: 'All Assets', val: 'all' },
                { label: 'Applications', val: 'applications' },
                { label: 'Materials & Slabs', val: 'materials' },
                { label: 'Uploads', val: 'uploads' },
              ].map(f => (
                <button
                  key={f.val}
                  onClick={() => setMediaFilter(f.val)}
                  style={{
                    padding: '6px 14px',
                    background: mediaFilter === f.val ? '#1a1d19' : '#ffffff',
                    color: mediaFilter === f.val ? '#ffffff' : '#1a1d19',
                    border: '1px solid rgba(0,0,0,0.08)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    cursor: 'pointer',
                  }}
                >
                  {f.label}
                </button>
              ))}
            </div>

            {/* Media Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '16px' }}>
              {mediaAssets
                .filter(img => {
                  if (mediaFilter === 'all') return true;
                  return img.includes(mediaFilter);
                })
                .map((img, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: '#ffffff',
                      border: '1px solid rgba(0,0,0,0.08)',
                      padding: '10px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                    }}
                  >
                    <div style={{ width: '100%', height: '130px', position: 'relative', background: '#222' }}>
                      <Image
                        src={img}
                        alt="media asset"
                        fill
                        sizes="200px"
                        style={{ objectFit: 'cover' }}
                      />
                    </div>
                    <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#555', wordBreak: 'break-all', minHeight: '28px' }}>
                      {img.split('/').pop()}
                    </div>
                    <div style={{ display: 'flex', gap: '6px', marginTop: 'auto' }}>
                      <button
                        onClick={() => copyToClipboard(img)}
                        style={{
                          flex: 1,
                          padding: '6px',
                          background: '#f5f4ee',
                          border: '1px solid rgba(0,0,0,0.08)',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '9px',
                          cursor: 'pointer',
                        }}
                      >
                        Copy Path ⎘
                      </button>
                      <button
                        onClick={() => {
                          if (localHeroSlides[selectedSlideIndex]) {
                            updateSlideField(selectedSlideIndex, 'image', img);
                            setActiveTab('hero');
                            showToast(`Assigned ${img.split('/').pop()} to Hero Slide 0${selectedSlideIndex + 1}`, 'success');
                          }
                        }}
                        title="Assign to Hero Slide"
                        style={{
                          padding: '6px 8px',
                          background: '#1a1d19',
                          color: '#fff',
                          border: 'none',
                          fontFamily: 'DM Mono, monospace',
                          fontSize: '9px',
                          cursor: 'pointer',
                        }}
                      >
                        Hero
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            TAB 8: SAMPLE SPECIMEN ORDERS & CART TRACKING
        ========================================================================= */}
        {activeTab === 'orders' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Specimen Box Pipeline · Real-Time Client Carts
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Sample Orders & Cart Tracking
                </h2>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6d746d', margin: '6px 0 0 0' }}>
                  Track architects placing specimen sample orders, live draft checkouts as they type, delivery shipping slips, and shortlisted materials.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#e8f5e9',
                    border: '1px solid #a5d6a7',
                    padding: '6px 12px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    color: '#2e7d32',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e7d32' }}></span>
                  LIVE REAL-TIME STREAM
                </span>
                <button
                  onClick={fetchOrders}
                  style={{
                    padding: '8px 16px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ↻ {isLoadingOrders ? 'Refreshing...' : 'Refresh'}
                </button>
              </div>
            </div>

            {/* Filter Pills and Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: `All (${orders.length})` },
                  { key: 'submitted', label: `Submitted (${orders.filter(o => o.status === 'submitted').length})` },
                  { key: 'in-progress', label: `Drafts In-Progress (${orders.filter(o => o.status === 'in-progress').length})` },
                  { key: 'dispatched', label: `Dispatched (${orders.filter(o => o.status === 'dispatched').length})` },
                  { key: 'delivered', label: `Delivered (${orders.filter(o => o.status === 'delivered').length})` },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setOrderFilter(filter.key)}
                    style={{
                      padding: '6px 14px',
                      background: orderFilter === filter.key ? '#1a1d19' : '#ffffff',
                      color: orderFilter === filter.key ? '#ffffff' : '#4d544d',
                      border: '1px solid rgba(0,0,0,0.12)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div style={{ width: '320px', maxWidth: '100%' }}>
                <input
                  type="text"
                  placeholder="Search by architect, studio, city, email..."
                  value={orderSearchQuery}
                  onChange={e => setOrderSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Order Cards List */}
            {orders
              .filter(order => {
                if (orderFilter !== 'all' && order.status !== orderFilter) return false;
                if (!orderSearchQuery.trim()) return true;
                const q = orderSearchQuery.toLowerCase();
                return (
                  order.orderNumber.toLowerCase().includes(q) ||
                  order.customer.name.toLowerCase().includes(q) ||
                  order.customer.studio.toLowerCase().includes(q) ||
                  order.customer.email.toLowerCase().includes(q) ||
                  order.customer.city.toLowerCase().includes(q) ||
                  order.items.some(it => it.name.toLowerCase().includes(q) || it.colour.toLowerCase().includes(q))
                );
              })
              .length === 0 ? (
              <div style={{ background: '#ffffff', padding: '48px', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#2e7d32', textTransform: 'uppercase', fontWeight: 600 }}>
                  ● Real-Time Listener Ready · Clean Production Database
                </div>
                <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 400, margin: '8px 0 12px 0' }}>
                  No Sample Orders Yet
                </h3>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#889088', maxWidth: '460px', margin: '0 auto' }}>
                  Zero mock data active. The moment an architect clicks &quot;+ Request Specimen&quot; and begins typing their details, their shortlisted materials and draft checkout will stream here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {orders
                  .filter(order => {
                    if (orderFilter !== 'all' && order.status !== orderFilter) return false;
                    if (!orderSearchQuery.trim()) return true;
                    const q = orderSearchQuery.toLowerCase();
                    return (
                      order.orderNumber.toLowerCase().includes(q) ||
                      order.customer.name.toLowerCase().includes(q) ||
                      order.customer.studio.toLowerCase().includes(q) ||
                      order.customer.email.toLowerCase().includes(q) ||
                      order.customer.city.toLowerCase().includes(q) ||
                      order.items.some(it => it.name.toLowerCase().includes(q) || it.colour.toLowerCase().includes(q))
                    );
                  })
                  .map(order => {
                    const statusBadgeColors = {
                      submitted: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7', label: 'SUBMITTED / READY TO DISPATCH' },
                      'in-progress': { bg: '#fff8e1', text: '#b78103', border: '#ffe082', label: 'IN-PROGRESS DRAFT (ENTERING CART)' },
                      dispatched: { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9', label: 'DISPATCHED / IN COURIER' },
                      delivered: { bg: '#f5f5f5', text: '#424242', border: '#e0e0e0', label: 'DELIVERED' },
                      cancelled: { bg: '#ffebee', text: '#c62828', border: '#ef9a9a', label: 'CANCELLED' },
                    }[order.status] || { bg: '#eee', text: '#333', border: '#ccc', label: order.status.toUpperCase() };

                    return (
                      <div
                        key={order.id}
                        style={{
                          background: '#ffffff',
                          border: order.status === 'in-progress' ? '1px dashed #b78103' : '1px solid rgba(0,0,0,0.1)',
                          padding: '24px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        }}
                      >
                        {/* Order Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f0efe8', paddingBottom: '16px', marginBottom: '20px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '14px', fontWeight: 600, color: '#1a1d19' }}>
                              #{order.orderNumber}
                            </span>
                            <span
                              style={{
                                background: statusBadgeColors.bg,
                                color: statusBadgeColors.text,
                                border: `1px solid ${statusBadgeColors.border}`,
                                padding: '3px 10px',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '10px',
                                letterSpacing: '0.06em',
                                fontWeight: 600,
                              }}
                            >
                              {statusBadgeColors.label}
                            </span>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078' }}>
                              {new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                            <button
                              onClick={() => handleCopyCourierLabel(order)}
                              style={{
                                padding: '6px 14px',
                                background: '#f5f4ee',
                                border: '1px solid rgba(0,0,0,0.15)',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '11px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              📋 Copy Courier Label
                            </button>
                            <button
                              onClick={() => handleDeleteOrder(order.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: '1px solid rgba(215,65,50,0.3)',
                                color: '#b93222',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '11px',
                                cursor: 'pointer',
                              }}
                              title="Delete Order Record"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Customer & Shipping Details Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                          <div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Architect / Specifier
                            </div>
                            <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '18px', fontWeight: 500, color: '#1a1d19' }}>
                              {order.customer.name}
                            </div>
                            {order.customer.studio && (
                              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#4d544d', marginTop: '2px' }}>
                                🏛 {order.customer.studio}
                              </div>
                            )}
                            <div style={{ marginTop: '8px', display: 'flex', flexDirection: 'column', gap: '4px', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                              {order.customer.email && (
                                <a href={`mailto:${order.customer.email}`} style={{ color: '#1a1d19', textDecoration: 'none' }}>
                                  ✉ {order.customer.email}
                                </a>
                              )}
                              {order.customer.phone && (
                                <a href={`tel:${order.customer.phone}`} style={{ color: '#1a1d19', textDecoration: 'none', fontWeight: 600 }}>
                                  📞 {order.customer.phone}
                                </a>
                              )}
                              {order.customer.projectType && (
                                <div style={{ color: '#788078', marginTop: '4px' }}>
                                  Typology: <span style={{ background: '#f5f4ee', padding: '2px 6px', color: '#1a1d19' }}>{order.customer.projectType}</span>
                                </div>
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', marginBottom: '4px' }}>
                              Studio Courier Delivery Address
                            </div>
                            <div style={{ background: '#faf9f5', border: '1px solid #eeece4', padding: '14px 16px', fontFamily: 'DM Mono, monospace', fontSize: '11px', lineHeight: 1.6, color: '#2a3029' }}>
                              {order.customer.address ? (
                                <>
                                  <div>{order.customer.address}</div>
                                  <div style={{ fontWeight: 600, marginTop: '4px' }}>
                                    {order.customer.city} {order.customer.pincode ? `— ${order.customer.pincode}` : ''}
                                  </div>
                                </>
                              ) : (
                                <div style={{ color: '#999', fontStyle: 'italic' }}>Address not provided yet (draft)</div>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Shortlisted / Cart Specimens Gallery */}
                        <div style={{ borderTop: '1px solid #f0efe8', paddingTop: '18px', marginBottom: '20px' }}>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', marginBottom: '12px' }}>
                            Cart Material Specimens ({order.items.length} Selected)
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '12px' }}>
                            {order.items.map((it, idx) => (
                              <div
                                key={`${it.materialSlug}-${idx}`}
                                style={{
                                  background: '#f9f8f4',
                                  border: '1px solid rgba(0,0,0,0.08)',
                                  padding: '10px 12px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '12px',
                                }}
                              >
                              {(() => {
                                const itemMat = contextMaterials.find(m => m.slug === it.materialSlug || m.name === it.name);
                                const itemImage = (it as any).textureImage || (it as any).image || itemMat?.textureImage || itemMat?.image;
                                const itemColor = (it as any).hexColor || itemMat?.hexColor || itemMat?.textureCss || '#e8e4dc';
                                return (
                                  <div
                                    style={{
                                      width: '38px',
                                      height: '38px',
                                      flexShrink: 0,
                                      border: '1px solid rgba(0,0,0,0.15)',
                                      borderRadius: '2px',
                                      background: itemColor,
                                      overflow: 'hidden',
                                      position: 'relative',
                                    }}
                                  >
                                    {itemImage && (
                                      <img
                                        src={itemImage}
                                        alt={it.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                                      />
                                    )}
                                  </div>
                                );
                              })()}
                                <div style={{ minWidth: 0, flex: 1 }}>
                                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#1a1d19', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {it.name}
                                  </div>
                                  <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078' }}>
                                    {it.finish} · 100mm²
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Order Management Actions Row */}
                        <div style={{ background: '#f5f4ee', padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#596059' }}>
                              Update Status:
                            </span>
                            {(['submitted', 'in-progress', 'dispatched', 'delivered', 'cancelled'] as OrderStatus[]).map(st => (
                              <button
                                key={st}
                                onClick={() => handleUpdateOrderStatus(order.id, st)}
                                style={{
                                  padding: '4px 10px',
                                  background: order.status === st ? '#1a1d19' : '#ffffff',
                                  color: order.status === st ? '#ffffff' : '#333333',
                                  border: '1px solid rgba(0,0,0,0.15)',
                                  fontFamily: 'DM Mono, monospace',
                                  fontSize: '10px',
                                  textTransform: 'uppercase',
                                  cursor: 'pointer',
                                }}
                              >
                                {st}
                              </button>
                            ))}
                          </div>

                          {order.notes && (
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078' }}>
                              Note: {order.notes}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 9: CLIENT CONSULTATION ENQUIRIES & LEADS
        ========================================================================= */}
        {activeTab === 'inquiries' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Client Briefs & Architectural Consultation Requests
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Project Enquiries & Leads
                </h2>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6d746d', margin: '6px 0 0 0' }}>
                  Submissions from the Contact Consultation Form (`/contact`) covering bespoke joinery, large-scale slabs, and technical material inquiries.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#e8f5e9',
                    border: '1px solid #a5d6a7',
                    padding: '6px 12px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    color: '#2e7d32',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e7d32' }}></span>
                  LIVE REAL-TIME STREAM
                </span>
                <button
                  onClick={fetchInquiries}
                  style={{
                    padding: '8px 16px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ↻ {isLoadingInquiries ? 'Refreshing...' : 'Refresh Enquiries'}
                </button>
              </div>
            </div>

            {/* Filter Pills and Search */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {[
                  { key: 'all', label: `All (${inquiries.length})` },
                  { key: 'new', label: `New / Unhandled (${inquiries.filter(i => i.status === 'new').length})` },
                  { key: 'in-discussion', label: `In Discussion (${inquiries.filter(i => i.status === 'in-discussion').length})` },
                  { key: 'sample-sent', label: `Sample Sent (${inquiries.filter(i => i.status === 'sample-sent').length})` },
                  { key: 'closed', label: `Closed (${inquiries.filter(i => i.status === 'closed').length})` },
                ].map(filter => (
                  <button
                    key={filter.key}
                    onClick={() => setInquiryFilter(filter.key)}
                    style={{
                      padding: '6px 14px',
                      background: inquiryFilter === filter.key ? '#1a1d19' : '#ffffff',
                      color: inquiryFilter === filter.key ? '#ffffff' : '#4d544d',
                      border: '1px solid rgba(0,0,0,0.12)',
                      fontFamily: 'DM Mono, monospace',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>

              <div style={{ width: '320px', maxWidth: '100%' }}>
                <input
                  type="text"
                  placeholder="Search by client name, email, project, brief..."
                  value={inquirySearchQuery}
                  onChange={e => setInquirySearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Inquiries Cards List */}
            {inquiries
              .filter(inq => {
                if (inquiryFilter !== 'all' && inq.status !== inquiryFilter) return false;
                if (!inquirySearchQuery.trim()) return true;
                const q = inquirySearchQuery.toLowerCase();
                return (
                  inq.inquiryNumber.toLowerCase().includes(q) ||
                  inq.name.toLowerCase().includes(q) ||
                  inq.email.toLowerCase().includes(q) ||
                  (inq.phone && inq.phone.toLowerCase().includes(q)) ||
                  inq.projectType.toLowerCase().includes(q) ||
                  inq.message.toLowerCase().includes(q)
                );
              })
              .length === 0 ? (
              <div style={{ background: '#ffffff', padding: '48px', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#2e7d32', textTransform: 'uppercase', fontWeight: 600 }}>
                  ● Real-Time Listener Ready · Clean Production Database
                </div>
                <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 400, margin: '8px 0 12px 0' }}>
                  {inquiries.length === 0 ? 'No Project Enquiries Yet' : `No enquiries matching filter "${inquiryFilter}"`}
                </h3>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#889088', maxWidth: '480px', margin: '0 auto' }}>
                  Zero mock data active. The moment an architect or client submits the Contact Consultation Form (/contact), their specifications, contact info, and space brief will stream here immediately in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {inquiries
                  .filter(inq => {
                    if (inquiryFilter !== 'all' && inq.status !== inquiryFilter) return false;
                    if (!inquirySearchQuery.trim()) return true;
                    const q = inquirySearchQuery.toLowerCase();
                    return (
                      inq.inquiryNumber.toLowerCase().includes(q) ||
                      inq.name.toLowerCase().includes(q) ||
                      inq.email.toLowerCase().includes(q) ||
                      (inq.phone && inq.phone.toLowerCase().includes(q)) ||
                      inq.projectType.toLowerCase().includes(q) ||
                      inq.message.toLowerCase().includes(q)
                    );
                  })
                  .map(inq => {
                    const statusColor = {
                      new: { bg: '#e8f5e9', text: '#2e7d32', border: '#a5d6a7', label: 'NEW ENQUIRY' },
                      'in-discussion': { bg: '#e3f2fd', text: '#1565c0', border: '#90caf9', label: 'IN DISCUSSION' },
                      'sample-sent': { bg: '#f3e5f5', text: '#7b1fa2', border: '#ce93d8', label: 'SPECIMEN SENT' },
                      closed: { bg: '#f5f5f5', text: '#616161', border: '#e0e0e0', label: 'RESOLVED / CLOSED' },
                    }[inq.status] || { bg: '#eee', text: '#333', border: '#ccc', label: inq.status.toUpperCase() };

                    return (
                      <div
                        key={inq.id}
                        style={{
                          background: '#ffffff',
                          border: inq.status === 'new' ? '1px solid #2e7d32' : '1px solid rgba(0,0,0,0.08)',
                          padding: '24px',
                          boxShadow: '0 2px 10px rgba(0,0,0,0.03)',
                        }}
                      >
                        {/* Header Row */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderBottom: '1px solid #f0efe8', paddingBottom: '14px', marginBottom: '18px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '13px', fontWeight: 600, color: '#1a1d19' }}>
                              #{inq.inquiryNumber}
                            </span>
                            <span
                              style={{
                                background: statusColor.bg,
                                color: statusColor.text,
                                border: `1px solid ${statusColor.border}`,
                                padding: '3px 10px',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '10px',
                                fontWeight: 600,
                              }}
                            >
                              {statusColor.label}
                            </span>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078' }}>
                              {new Date(inq.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <div style={{ display: 'flex', gap: '10px' }}>
                            <a
                              href={`mailto:${inq.email}?subject=Re: Ace Spaces Architectural Consultation [${inq.inquiryNumber}]`}
                              style={{
                                padding: '6px 14px',
                                background: '#1a1d19',
                                color: '#ffffff',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '11px',
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              ✉ Reply to {inq.name.split(' ')[0]}
                            </a>
                            <button
                              onClick={() => handleDeleteInquiry(inq.id)}
                              style={{
                                padding: '6px 12px',
                                background: 'transparent',
                                border: '1px solid rgba(215,65,50,0.3)',
                                color: '#b93222',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '11px',
                                cursor: 'pointer',
                              }}
                              title="Delete Enquiry"
                            >
                              ✕
                            </button>
                          </div>
                        </div>

                        {/* Client details & Project typology */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                          <div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                              Prospective Client
                            </div>
                            <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '17px', fontWeight: 500, color: '#1a1d19' }}>
                              {inq.name}
                            </div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#4d544d', marginTop: '4px' }}>
                              <a href={`mailto:${inq.email}`} style={{ color: '#1a1d19', textDecoration: 'none' }}>
                                ✉ {inq.email}
                              </a>
                              {inq.phone && (
                                <span style={{ marginLeft: '12px' }}>
                                  <a href={`tel:${inq.phone}`} style={{ color: '#1a1d19', textDecoration: 'none', fontWeight: 600 }}>
                                    📞 {inq.phone}
                                  </a>
                                </span>
                              )}
                            </div>
                          </div>

                          <div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                              Project Typology & Scope
                            </div>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#1a1d19', fontWeight: 500, marginTop: '2px' }}>
                              {inq.projectType}
                            </div>
                          </div>
                        </div>

                        {/* Brief Message Callout */}
                        <div style={{ background: '#faf9f5', border: '1px solid #eeece4', padding: '16px', marginBottom: '16px' }}>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', marginBottom: '6px' }}>
                            Consultation Brief & Space Requirements
                          </div>
                          <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', lineHeight: 1.65, color: '#2a3029', whiteSpace: 'pre-wrap' }}>
                            {inq.message}
                          </div>
                        </div>

                        {/* Status update buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                          <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase' }}>
                            Update Stage:
                          </span>
                          {(['new', 'in-discussion', 'sample-sent', 'closed'] as InquiryStatus[]).map(st => (
                            <button
                              key={st}
                              onClick={() => handleUpdateInquiryStatus(inq.id, st)}
                              style={{
                                padding: '4px 10px',
                                background: inq.status === st ? '#1a1d19' : '#ffffff',
                                color: inq.status === st ? '#ffffff' : '#4d544d',
                                border: '1px solid rgba(0,0,0,0.15)',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '10px',
                                textTransform: 'uppercase',
                                cursor: 'pointer',
                              }}
                            >
                              {st}
                            </button>
                          ))}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}

        {/* =========================================================================
            TAB 10: DISPATCH NEWSLETTER SUBSCRIBERS
        ========================================================================= */}
        {activeTab === 'dispatch' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  Audience & Editorial Monograph Distribution
                </div>
                <h2 style={{ fontFamily: 'var(--serif, serif)', fontSize: '24px', fontWeight: 400, margin: '4px 0 0 0' }}>
                  Dispatch Newsletter Subscribers ({subscribers.length})
                </h2>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6d746d', margin: '6px 0 0 0' }}>
                  Verified email addresses gathered from the footer &quot;Join the Dispatch&quot; subscription form across the site.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    background: '#e8f5e9',
                    border: '1px solid #a5d6a7',
                    padding: '6px 12px',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '10px',
                    color: '#2e7d32',
                    fontWeight: 600,
                    letterSpacing: '0.05em',
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2e7d32' }}></span>
                  LIVE REAL-TIME STREAM
                </span>
                <button
                  onClick={handleCopyAllSubscriberEmails}
                  style={{
                    padding: '8px 16px',
                    background: '#1a1d19',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  📋 Copy All Emails ({subscribers.length})
                </button>
                <button
                  onClick={handleExportSubscribersCSV}
                  style={{
                    padding: '8px 16px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  📥 Export CSV
                </button>
                <button
                  onClick={fetchSubscribers}
                  style={{
                    padding: '8px 16px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                  }}
                >
                  ↻ Refresh
                </button>
              </div>
            </div>

            {/* Search */}
            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                placeholder="Search subscriber emails..."
                value={subscriberSearchQuery}
                onChange={e => setSubscriberSearchQuery(e.target.value)}
                style={{
                  width: '360px',
                  maxWidth: '100%',
                  padding: '8px 14px',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  outline: 'none',
                }}
              />
            </div>

            {/* Subscribers Table or Clean Empty State */}
            {subscribers.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '48px', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#2e7d32', textTransform: 'uppercase', fontWeight: 600 }}>
                  ● Real-Time Listener Ready · Clean Production Database
                </div>
                <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 400, margin: '8px 0 12px 0' }}>
                  No Newsletter Subscribers Yet
                </h3>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#889088', maxWidth: '480px', margin: '0 auto' }}>
                  Zero mock data active. The moment an architect or visitor signs up via the &quot;Join the Dispatch&quot; form in the footer, their verified email will instantly appear in this table in real time.
                </p>
              </div>
            ) : (
              <div style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)', overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'DM Mono, monospace', fontSize: '11px' }}>
                  <thead>
                    <tr style={{ background: '#f5f4ee', borderBottom: '1px solid rgba(0,0,0,0.08)' }}>
                      <th style={{ padding: '12px 16px', color: '#788078', fontWeight: 500, width: '40px' }}>#</th>
                      <th style={{ padding: '12px 16px', color: '#788078', fontWeight: 500 }}>Email Address</th>
                      <th style={{ padding: '12px 16px', color: '#788078', fontWeight: 500 }}>Source</th>
                      <th style={{ padding: '12px 16px', color: '#788078', fontWeight: 500 }}>Subscribed On</th>
                      <th style={{ padding: '12px 16px', color: '#788078', fontWeight: 500 }}>Status</th>
                      <th style={{ padding: '12px 16px', color: '#788078', fontWeight: 500, textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {subscribers
                      .filter(sub => !subscriberSearchQuery.trim() || sub.email.toLowerCase().includes(subscriberSearchQuery.toLowerCase()))
                      .map((sub, index) => (
                        <tr key={sub.id} style={{ borderBottom: '1px solid #f0efe8' }}>
                          <td style={{ padding: '12px 16px', color: '#888' }}>{index + 1}</td>
                          <td style={{ padding: '12px 16px', fontWeight: 600, color: '#1a1d19' }}>
                            <a href={`mailto:${sub.email}`} style={{ color: '#1a1d19', textDecoration: 'none' }}>
                              {sub.email}
                            </a>
                          </td>
                          <td style={{ padding: '12px 16px', color: '#666' }}>{sub.source}</td>
                          <td style={{ padding: '12px 16px', color: '#666' }}>
                            {new Date(sub.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </td>
                          <td style={{ padding: '12px 16px' }}>
                            <span style={{ background: '#e8f5e9', color: '#2e7d32', border: '1px solid #a5d6a7', padding: '2px 8px', fontSize: '9px', fontWeight: 600 }}>
                              {sub.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleDeleteSubscriber(sub.id)}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: '#b93222',
                              cursor: 'pointer',
                              fontFamily: 'DM Mono, monospace',
                              fontSize: '11px',
                            }}
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

        {/* =========================================================================
            TAB 12: AI CONCIERGE CHATS & INTELLIGENCE
        ========================================================================= */}
        {activeTab === 'ai-chats' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
              <div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#7c3aed', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed' }} />
                  Autonomous Specifier Intelligence · Real-Time Chat Summaries
                </div>
                <h1 style={{ fontFamily: 'var(--serif, serif)', fontSize: '28px', fontWeight: 400, marginTop: '4px', margin: 0 }}>
                  AI Concierge Chats & Material Advisory
                </h1>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#596059', maxWidth: '780px', lineHeight: 1.6, marginTop: '8px' }}>
                  Real-time executive summaries generated whenever a visitor finishes chatting with the Ace Spaces AI Concierge. Captures architectural intent, provides superior solid-surface recommendations, records specifier contact details, and archives verbatim transcripts.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  onClick={handleExportChatsCSV}
                  style={{
                    padding: '8px 16px',
                    background: '#ffffff',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  📥 Export CSV ({chatSessions.length})
                </button>
                <button
                  type="button"
                  onClick={fetchChatSessions}
                  style={{
                    padding: '8px 16px',
                    background: '#1a1d19',
                    color: '#ffffff',
                    border: 'none',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  ↻ Refresh Feed
                </button>
              </div>
            </div>

            {/* Metric Overview Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
              <div style={{ background: '#ffffff', padding: '20px', border: '1px solid rgba(0,0,0,0.08)' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#788078', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Total AI Sessions
                </div>
                <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '36px', margin: '8px 0 4px 0', color: '#1a1d19' }}>
                  {chatSessions.length}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>
                  Archived conversations
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', border: '1px solid rgba(0,0,0,0.08)', borderLeft: '3px solid #7c3aed' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  New Inquiries
                </div>
                <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '36px', margin: '8px 0 4px 0', color: '#7c3aed' }}>
                  {chatSessions.filter((c) => c.status === 'new').length}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>
                  Awaiting review
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', border: '1px solid rgba(0,0,0,0.08)', borderLeft: '3px solid #059669' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#059669', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Material Suggestions Given
                </div>
                <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '36px', margin: '8px 0 4px 0', color: '#059669' }}>
                  {chatSessions.filter((c) => c.materialsSuggested && c.materialsSuggested.length > 0).length}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>
                  Better material recommendations
                </div>
              </div>

              <div style={{ background: '#ffffff', padding: '20px', border: '1px solid rgba(0,0,0,0.08)', borderLeft: '3px solid #2563eb' }}>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                  Client Contacts Captured
                </div>
                <div style={{ fontFamily: 'var(--serif, serif)', fontSize: '36px', margin: '8px 0 4px 0', color: '#2563eb' }}>
                  {chatSessions.filter((c) => c.customerContact?.phone || c.customerContact?.email).length}
                </div>
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>
                  Direct follow-up ready
                </div>
              </div>
            </div>

            {/* Filter and Search Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '16px', background: '#ffffff', padding: '16px 20px', border: '1px solid rgba(0,0,0,0.08)' }}>
              {/* Status Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {(['all', 'new', 'reviewed', 'contacted'] as const).map((status) => {
                  const count = status === 'all' ? chatSessions.length : chatSessions.filter((c) => c.status === status).length;
                  const isSelected = chatStatusFilter === status;
                  return (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setChatStatusFilter(status)}
                      style={{
                        padding: '6px 14px',
                        background: isSelected ? '#1a1d19' : '#f5f4ee',
                        color: isSelected ? '#ffffff' : '#596059',
                        border: '1px solid ' + (isSelected ? '#1a1d19' : 'rgba(0,0,0,0.08)'),
                        fontFamily: 'DM Mono, monospace',
                        fontSize: '11px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.06em',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                      }}
                    >
                      <span>{status}</span>
                      <span style={{
                        background: isSelected ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.06)',
                        padding: '1px 6px',
                        borderRadius: '8px',
                        fontSize: '10px',
                      }}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div style={{ flex: 1, maxWidth: '400px', minWidth: '240px' }}>
                <input
                  type="text"
                  placeholder="Search by client, material, or keyword..."
                  value={chatSearchQuery}
                  onChange={(e) => setChatSearchQuery(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '8px 14px',
                    background: '#faf9f5',
                    border: '1px solid rgba(0,0,0,0.15)',
                    fontFamily: 'DM Mono, monospace',
                    fontSize: '11px',
                    outline: 'none',
                  }}
                />
              </div>
            </div>

            {/* Sessions Feed */}
            {isLoadingChats && chatSessions.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '48px', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#788078' }}>
                  Loading AI concierge chat sessions...
                </p>
              </div>
            ) : chatSessions.length === 0 ? (
              <div style={{ background: '#ffffff', padding: '60px 24px', border: '1px solid rgba(0,0,0,0.08)', textAlign: 'center' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ede9fe', color: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto', fontSize: '20px' }}>
                  💬
                </div>
                <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '22px', fontWeight: 400, margin: '0 0 8px 0' }}>
                  No AI Concierge Conversations Recorded Yet
                </h3>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#889088', maxWidth: '520px', margin: '0 auto 20px auto', lineHeight: 1.6 }}>
                  When visitors converse with the Ace Spaces AI Concierge on the website and close the chat, the conversation is automatically summarized, categorized with recommended materials, and streamed here in real time.
                </p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {chatSessions
                  .filter((session) => {
                    if (chatStatusFilter !== 'all' && session.status !== chatStatusFilter) return false;
                    if (!chatSearchQuery.trim()) return true;
                    const q = chatSearchQuery.toLowerCase();
                    return (
                      session.intent?.toLowerCase().includes(q) ||
                      session.summary?.toLowerCase().includes(q) ||
                      session.sessionNumber?.toLowerCase().includes(q) ||
                      session.customerContact?.name?.toLowerCase().includes(q) ||
                      session.customerContact?.phone?.toLowerCase().includes(q) ||
                      session.materialsDiscussed?.some((m) => m.toLowerCase().includes(q)) ||
                      session.materialsSuggested?.some((m) => m.toLowerCase().includes(q))
                    );
                  })
                  .map((session) => {
                    const isExpanded = expandedTranscriptId === session.id;
                    const cleanPhone = session.customerContact?.phone ? session.customerContact.phone.replace(/[^0-9]/g, '') : '';
                    const whatsAppHref = cleanPhone
                      ? `https://wa.me/${cleanPhone}?text=${encodeURIComponent(
                          `Hello ${session.customerContact?.name || 'Architect'}, following up from Ace Spaces Bengaluru regarding your inquiry on ${session.intent} (${session.sessionNumber || 'Ref'}). How can we assist with your material specs?`
                        )}`
                      : null;

                    return (
                      <div
                        key={session.id}
                        style={{
                          background: '#ffffff',
                          border: '1px solid rgba(0,0,0,0.08)',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        {/* Session Top Bar */}
                        <div
                          style={{
                            padding: '16px 24px',
                            background: '#faf9f5',
                            borderBottom: '1px solid rgba(0,0,0,0.06)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            flexWrap: 'wrap',
                            gap: '12px',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', fontWeight: 700, color: '#7c3aed', letterSpacing: '0.06em' }}>
                              {session.sessionNumber || session.id.slice(0, 16)}
                            </span>
                            <span style={{ color: '#d4d8d4' }}>|</span>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6c746c' }}>
                              {new Date(session.startedAt).toLocaleString('en-GB', {
                                day: '2-digit',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                              })}
                            </span>
                            {session.durationSeconds ? (
                              <>
                                <span style={{ color: '#d4d8d4' }}>•</span>
                                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6c746c' }}>
                                  ⏱ {Math.floor(session.durationSeconds / 60)}m {session.durationSeconds % 60}s
                                </span>
                              </>
                            ) : null}
                            <span style={{ color: '#d4d8d4' }}>•</span>
                            <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#6c746c' }}>
                              💬 {session.messageCount || session.messages?.length || 0} messages
                            </span>
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <span
                              style={{
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '10px',
                                fontWeight: 700,
                                textTransform: 'uppercase',
                                letterSpacing: '0.08em',
                                padding: '3px 10px',
                                borderRadius: '3px',
                                background:
                                  session.status === 'new'
                                    ? '#ede9fe'
                                    : session.status === 'reviewed'
                                    ? '#fef3c7'
                                    : session.status === 'contacted'
                                    ? '#dcfce7'
                                    : '#f3f4f6',
                                color:
                                  session.status === 'new'
                                    ? '#6d28d9'
                                    : session.status === 'reviewed'
                                    ? '#b45309'
                                    : session.status === 'contacted'
                                    ? '#15803d'
                                    : '#4b5563',
                                border:
                                  session.status === 'new'
                                    ? '1px solid #ddd6fe'
                                    : session.status === 'reviewed'
                                    ? '1px solid #fde68a'
                                    : session.status === 'contacted'
                                    ? '1px solid #bbf7d0'
                                    : '1px solid #e5e7eb',
                              }}
                            >
                              ● {session.status}
                            </span>
                          </div>
                        </div>

                        {/* Session Body */}
                        <div style={{ padding: '24px' }}>
                          {/* Client Contact Info Banner (if captured) */}
                          {session.customerContact && (session.customerContact.name || session.customerContact.phone || session.customerContact.email) && (
                            <div
                              style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                padding: '12px 18px',
                                marginBottom: '18px',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                flexWrap: 'wrap',
                                gap: '12px',
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', color: '#166534', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                                  👤 Captured Contact:
                                </span>
                                {session.customerContact.name && (
                                  <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#14532d' }}>
                                    {session.customerContact.name}
                                  </strong>
                                )}
                                {session.customerContact.phone && (
                                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#166534' }}>
                                    📞 {session.customerContact.phone}
                                  </span>
                                )}
                                {session.customerContact.email && (
                                  <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#166534' }}>
                                    ✉️ {session.customerContact.email}
                                  </span>
                                )}
                              </div>

                              {whatsAppHref && (
                                <a
                                  href={whatsAppHref}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    background: '#25D366',
                                    color: '#ffffff',
                                    padding: '6px 14px',
                                    borderRadius: '2px',
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '11px',
                                    fontWeight: 600,
                                    textDecoration: 'none',
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    boxShadow: '0 2px 6px rgba(37,211,102,0.3)',
                                  }}
                                >
                                  <span>WhatsApp Specifier</span>
                                  <span>↗</span>
                                </a>
                              )}
                            </div>
                          )}

                          {/* Architectural Intent */}
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', letterSpacing: '0.08em', marginBottom: '4px' }}>
                              Architectural Intent
                            </div>
                            <h3 style={{ fontSize: '18px', fontWeight: 600, margin: 0, color: '#1a1d19', letterSpacing: '-0.01em' }}>
                              {session.intent || 'General Architectural Surface Advisory'}
                            </h3>
                          </div>

                          {/* Executive Summary */}
                          <div style={{ background: '#faf9f5', border: '1px solid rgba(0,0,0,0.06)', padding: '16px 20px', marginBottom: '20px' }}>
                            <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#889088', letterSpacing: '0.08em', marginBottom: '6px' }}>
                              AI Executive Summary
                            </div>
                            <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#2b302b', lineHeight: 1.65, margin: 0 }}>
                              {session.summary}
                            </p>
                          </div>

                          {/* Materials Comparison & Suggestions Grid */}
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px', marginBottom: '20px' }}>
                            {/* Materials Discussed */}
                            <div style={{ background: '#f5f4ee', padding: '14px 18px', border: '1px solid rgba(0,0,0,0.06)' }}>
                              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                                Materials Mentioned by Visitor
                              </div>
                              {session.materialsDiscussed && session.materialsDiscussed.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {session.materialsDiscussed.map((m, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        background: '#e9e8e2',
                                        color: '#333833',
                                        border: '1px solid #d4d8d4',
                                        fontFamily: 'DM Mono, monospace',
                                        fontSize: '11px',
                                        padding: '3px 8px',
                                      }}
                                    >
                                      {m}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088' }}>None recorded</span>
                              )}
                            </div>

                            {/* Better Materials Suggested */}
                            <div style={{ background: '#f0fdf4', padding: '14px 18px', border: '1px solid #bbf7d0' }}>
                              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#166534', letterSpacing: '0.08em', marginBottom: '8px', fontWeight: 600 }}>
                                ★ Superior Materials & Details Advised by AI
                              </div>
                              {session.materialsSuggested && session.materialsSuggested.length > 0 ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                  {session.materialsSuggested.map((m, idx) => (
                                    <span
                                      key={idx}
                                      style={{
                                        background: '#dcfce7',
                                        color: '#14532d',
                                        border: '1px solid #86efac',
                                        fontFamily: 'DM Mono, monospace',
                                        fontSize: '11px',
                                        fontWeight: 600,
                                        padding: '3px 8px',
                                      }}
                                    >
                                      ★ {m}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#166534' }}>General solid surface consultation</span>
                              )}
                            </div>
                          </div>

                          {/* Recommended Follow-Up Action */}
                          {session.followUpRecommendation && (
                            <div style={{ background: '#fefce8', border: '1px solid #fef08a', padding: '12px 18px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '16px' }}>💡</span>
                              <div>
                                <strong style={{ fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#854d0e', letterSpacing: '0.08em', display: 'block' }}>
                                  Recommended Next Step for Studio Team
                                </strong>
                                <span style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#713f12' }}>
                                  {session.followUpRecommendation}
                                </span>
                              </div>
                            </div>
                          )}

                          {/* Action Toolbar */}
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', borderTop: '1px solid rgba(0,0,0,0.06)', paddingTop: '16px' }}>
                            <button
                              type="button"
                              onClick={() => setExpandedTranscriptId(isExpanded ? null : session.id)}
                              style={{
                                background: isExpanded ? '#1a1d19' : 'transparent',
                                color: isExpanded ? '#ffffff' : '#1a1d19',
                                border: '1px solid #1a1d19',
                                padding: '6px 14px',
                                fontFamily: 'DM Mono, monospace',
                                fontSize: '11px',
                                fontWeight: 600,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                              }}
                            >
                              <span>{isExpanded ? '▲ Hide Full Transcript' : '▼ View Verbatim Transcript'}</span>
                              <span style={{ opacity: 0.7 }}>({session.messages?.length || session.messageCount || 0} msgs)</span>
                            </button>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              {session.status !== 'reviewed' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateChatStatus(session.id, 'reviewed')}
                                  style={{
                                    background: '#fef3c7',
                                    color: '#92400e',
                                    border: '1px solid #fde68a',
                                    padding: '6px 12px',
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Mark Reviewed
                                </button>
                              )}
                              {session.status !== 'contacted' && (
                                <button
                                  type="button"
                                  onClick={() => handleUpdateChatStatus(session.id, 'contacted')}
                                  style={{
                                    background: '#dcfce7',
                                    color: '#166534',
                                    border: '1px solid #bbf7d0',
                                    padding: '6px 12px',
                                    fontFamily: 'DM Mono, monospace',
                                    fontSize: '11px',
                                    cursor: 'pointer',
                                  }}
                                >
                                  Mark Contacted
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => handleDeleteChatSession(session.id)}
                                style={{
                                  background: 'transparent',
                                  color: '#b93222',
                                  border: '1px solid rgba(185,50,34,0.3)',
                                  padding: '6px 12px',
                                  fontFamily: 'DM Mono, monospace',
                                  fontSize: '11px',
                                  cursor: 'pointer',
                                }}
                              >
                                Delete Record
                              </button>
                            </div>
                          </div>

                          {/* Expandable Verbatim Transcript */}
                          {isExpanded && (
                            <div style={{ marginTop: '20px', borderTop: '1px dashed #d4d8d4', paddingTop: '16px' }}>
                              <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', textTransform: 'uppercase', color: '#788078', letterSpacing: '0.08em', marginBottom: '14px', fontWeight: 600 }}>
                                Verbatim Architectural Chat Transcript
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '480px', overflowY: 'auto', padding: '12px', background: '#faf9f5', border: '1px solid rgba(0,0,0,0.06)' }}>
                                {session.messages && session.messages.length > 0 ? (
                                  session.messages.map((msg, mIdx) => {
                                    const isUser = msg.role === 'user';
                                    return (
                                      <div
                                        key={mIdx}
                                        style={{
                                          display: 'flex',
                                          flexDirection: 'column',
                                          alignItems: isUser ? 'flex-end' : 'flex-start',
                                        }}
                                      >
                                        <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '9px', color: '#889088', marginBottom: '3px' }}>
                                          {isUser ? 'Visitor / Architect' : 'Ace Spaces AI Concierge'} · {msg.timestamp || 'Recorded'}
                                        </div>
                                        <div
                                          style={{
                                            maxWidth: '85%',
                                            padding: '12px 16px',
                                            background: isUser ? '#1a1d19' : '#ffffff',
                                            color: isUser ? '#f5f4ee' : '#1a1d19',
                                            border: isUser ? 'none' : '1px solid rgba(0,0,0,0.1)',
                                            borderRadius: '2px',
                                            fontFamily: isUser ? 'DM Mono, monospace' : 'Manrope, sans-serif',
                                            fontSize: '12px',
                                            lineHeight: 1.6,
                                            whiteSpace: 'pre-wrap',
                                          }}
                                        >
                                          {msg.content}
                                        </div>
                                      </div>
                                    );
                                  })
                                ) : (
                                  <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#889088', textAlign: 'center', margin: 0 }}>
                                    No verbatim message logs available for this session.
                                  </p>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>
        )}
        </main>
      </div>

      {/* Admin Footer Bar */}
      <footer style={{
        background: '#1a1d19',
        color: '#8c968c',
        padding: '16px 28px',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontFamily: 'DM Mono, monospace',
        fontSize: '10px',
      }}>
        <span>ACE SPACES STUDIO CONSOLE · RAW ARCHITECTURAL FOUNDRY</span>
        <span>Bengaluru Studio: 12.9716° N, 77.5946° E</span>
        <span>Version 2.4.0 (Synchronized)</span>
      </footer>
    </div>
  );
}
