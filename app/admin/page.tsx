'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSiteContent } from '@/context/SiteContentContext';
import { HeroSlide } from '@/data/contentTypes';
import { Material } from '@/data/materials';
import { ApplicationSector, ApplicationImage } from '@/data/applications';
import { JournalArticle } from '@/data/contentTypes';
import {
  SampleOrder,
  ProjectInquiry,
  DispatchSubscriber,
  OrderStatus,
  InquiryStatus,
} from '@/data/orderStore';

type TabKey = 'overview' | 'hero' | 'materials' | 'colors' | 'applications' | 'journal' | 'media' | 'orders' | 'inquiries' | 'dispatch';

export default function AdminPage() {
  const {
    heroSlides: contextHeroSlides,
    materials: contextMaterials,
    applicationSectors: contextSectors,
    journalArticles: contextJournals,
    isLoading: isContextLoading,
    saveContent,
    resetToDefaults,
  } = useSiteContent();

  // Authentication
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passkeyInput, setPasskeyInput] = useState<string>('');
  const [authError, setAuthError] = useState<string>('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<TabKey>('overview');

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

  // New item modal states
  const [isAddingColor, setIsAddingColor] = useState(false);
  const [isAddingSectorPhoto, setIsAddingSectorPhoto] = useState(false);

  // New item forms
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
  }, [contextHeroSlides, contextMaterials, contextSectors, contextJournals, selectedMaterialSlug, selectedJournalSlug]);

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

  // Fetch orders, inquiries, and dispatch subscribers
  const fetchOrders = async () => {
    setIsLoadingOrders(true);
    try {
      const res = await fetch('/api/orders');
      if (res.ok) {
        const data = await res.json();
        if (data.orders) setOrders(data.orders);
      }
    } catch (err) {
      console.warn('Error loading orders:', err);
    } finally {
      setIsLoadingOrders(false);
    }
  };

  const fetchInquiries = async () => {
    setIsLoadingInquiries(true);
    try {
      const res = await fetch('/api/inquiries');
      if (res.ok) {
        const data = await res.json();
        if (data.inquiries) setInquiries(data.inquiries);
      }
    } catch (err) {
      console.warn('Error loading inquiries:', err);
    } finally {
      setIsLoadingInquiries(false);
    }
  };

  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    try {
      const res = await fetch('/api/dispatch');
      if (res.ok) {
        const data = await res.json();
        if (data.subscribers) setSubscribers(data.subscribers);
      }
    } catch (err) {
      console.warn('Error loading subscribers:', err);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const fetchAllLeads = () => {
    fetchOrders();
    fetchInquiries();
    fetchSubscribers();
  };

  // Auto-fetch leads when authenticated and setup polling every 12 seconds for immediate visibility
  useEffect(() => {
    if (isAuthenticated) {
      fetchAllLeads();
      const interval = setInterval(() => {
        fetchAllLeads();
      }, 12000);
      return () => clearInterval(interval);
    }
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
    });
    if (success) {
      showToast('✓ All changes saved to custom-content.json & active on site!', 'success');
      loadMedia();
    } else {
      showToast('Error saving changes. Please check server log.', 'error');
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

  const deleteMaterial = (slug: string) => {
    if (window.confirm(`Delete material slab "${slug}"?`)) {
      setLocalMaterials(prev => prev.filter(m => m.slug !== slug));
      const remaining = localMaterials.filter(m => m.slug !== slug);
      if (remaining[0]) setSelectedMaterialSlug(remaining[0].slug);
      showToast(`Material ${slug} deleted.`, 'info');
    }
  };

  // Add Color Swatch
  const handleCreateColor = (e: React.FormEvent) => {
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
    setLocalMaterials(prev => [newMaterial, ...prev]);
    setSelectedMaterialSlug(newMaterial.slug);
    setIsAddingColor(false);
    showToast(`✓ Colour swatch "${newMaterial.name}" added successfully!`, 'success');
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
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

      {/* Main Console Navigation Tabs */}
      <nav style={{
        background: '#ecebe4',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '0 28px',
        display: 'flex',
        gap: '2px',
        overflowX: 'auto',
      }}>
        {[
          { key: 'overview', label: '01 Overview' },
          { key: 'hero', label: '02 Hero Slider & Images' },
          { key: 'materials', label: '03 Materials & Slabs' },
          { key: 'colors', label: '04 Colours & Swatches' },
          { key: 'applications', label: '05 Applications Photography' },
          { key: 'journal', label: '06 Journal Essays & Articles' },
          { key: 'media', label: '07 Media Asset Library & Upload' },
          {
            key: 'orders',
            label: `08 Sample Orders (${orders.filter((o) => o.status === 'submitted' || o.status === 'in-progress').length})`,
          },
          {
            key: 'inquiries',
            label: `09 Enquiries (${inquiries.filter((i) => i.status === 'new').length})`,
          },
          {
            key: 'dispatch',
            label: `10 Dispatch (${subscribers.length})`,
          },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as TabKey)}
            style={{
              padding: '14px 20px',
              background: activeTab === tab.key ? '#f5f4ee' : 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.key ? '2px solid #1a1d19' : '2px solid transparent',
              color: activeTab === tab.key ? '#1a1d19' : '#6d746d',
              fontFamily: 'DM Mono, monospace',
              fontSize: '11px',
              fontWeight: activeTab === tab.key ? '600' : '400',
              letterSpacing: '0.05em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content Workspace */}
      <main style={{ flex: 1, padding: '32px 28px', maxWidth: '1440px', width: '100%', margin: '0 auto' }}>
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
                { title: 'Dispatch Readers', count: subscribers.length, desc: `${subscribers.filter(s => s.status === 'active').length} active subscribers`, tab: 'dispatch' },
                { title: 'Hero Slides', count: localHeroSlides.length, desc: 'Active carousel sequences', tab: 'hero' },
                { title: 'Materials & Slabs', count: localMaterials.length, desc: 'Curated solid surfaces & slabs', tab: 'materials' },
                { title: 'Colours & Swatches', count: localMaterials.length, desc: 'Honed, matte & veined chips', tab: 'colors' },
                { title: 'Application Sectors', count: localSectors.length, desc: 'Residential, commercial, etc.', tab: 'applications' },
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
                  + Add New Material Slab
                </button>
              </div>
            </div>

            {/* Two column: List of Materials & Full Material Editor */}
            <div className="admin-two-col" style={{ display: 'grid', gridTemplateColumns: '380px 1fr', gap: '24px' }}>
              {/* Materials Filter and List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '750px', overflowY: 'auto', paddingRight: '4px' }}>
                {localMaterials
                  .filter(m => {
                    const q = materialSearchQuery.toLowerCase();
                    return !q || m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q) || m.collection.toLowerCase().includes(q);
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
                    <div style={{ display: 'flex', gap: '8px' }}>
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

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Slab Dimensions & Standard Thicknesses
                      </label>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <input
                          type="text"
                          placeholder="Dimensions (e.g. 3660 × 760 mm)"
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
                        Primary Image URL / Texture Specimen
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
                          <option value="">Pick from Media...</option>
                          {mediaAssets.map(img => (
                            <option key={img} value={img}>{img.split('/').pop()}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div style={{ gridColumn: '1 / -1' }}>
                      <label style={{ display: 'block', fontFamily: 'DM Mono, monospace', fontSize: '10px', textTransform: 'uppercase', color: '#788078', marginBottom: '4px' }}>
                        Architectural Description
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
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px\\' }}>
              {localMaterials.map(mat => (
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
                </div>
              </div>
            )}
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
                  ↻ {isLoadingOrders ? 'Refreshing...' : 'Refresh Orders'}
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
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  No Orders Found
                </div>
                <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 400, margin: '8px 0 12px 0' }}>
                  No sample orders matching filter &quot;{orderFilter}&quot;
                </h3>
                <p style={{ fontFamily: 'DM Mono, monospace', fontSize: '12px', color: '#889088', maxWidth: '420px', margin: '0 auto' }}>
                  When specifiers add items to their sample tray or begin typing their delivery address, records will appear here immediately.
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
                                <div
                                  className={`swatch ${it.swatch}`}
                                  style={{
                                    width: '38px',
                                    height: '38px',
                                    flexShrink: 0,
                                    border: '1px solid rgba(0,0,0,0.12)',
                                  }}
                                />
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

              <button
                onClick={fetchInquiries}
                style={{
                  padding: '8px 16px',
                  background: '#ffffff',
                  border: '1px solid rgba(0,0,0,0.15)',
                  fontFamily: 'DM Mono, monospace',
                  fontSize: '11px',
                  cursor: 'pointer',
                }}
              >
                ↻ {isLoadingInquiries ? 'Refreshing...' : 'Refresh Enquiries'}
              </button>
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
                <div style={{ fontFamily: 'DM Mono, monospace', fontSize: '11px', color: '#788078', textTransform: 'uppercase' }}>
                  No Enquiries Found
                </div>
                <h3 style={{ fontFamily: 'var(--serif, serif)', fontSize: '20px', fontWeight: 400, margin: '8px 0 12px 0' }}>
                  No customer consultations matching filter &quot;{inquiryFilter}&quot;
                </h3>
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

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
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

            {/* Subscribers Table */}
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
          </div>
        )}
      </main>

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
