import fs from 'fs';
import path from 'path';

export interface SampleOrderItem {
  materialSlug: string;
  name: string;
  collection: string;
  finish: string;
  colour: string;
  swatch: string;
  dimensions?: string;
}

export interface SampleOrderCustomer {
  name: string;
  studio: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  pincode: string;
  projectType: string;
}

export type OrderStatus = 'in-progress' | 'submitted' | 'dispatched' | 'delivered' | 'cancelled';

export interface SampleOrder {
  id: string;
  orderNumber: string;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
  customer: SampleOrderCustomer;
  items: SampleOrderItem[];
  itemCount: number;
  notes?: string;
}

export type InquiryStatus = 'new' | 'in-discussion' | 'sample-sent' | 'closed';

export interface ProjectInquiry {
  id: string;
  inquiryNumber: string;
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
  updatedAt: string;
  notes?: string;
}

export interface DispatchSubscriber {
  id: string;
  email: string;
  source: string;
  createdAt: string;
  status: 'active' | 'unsubscribed';
}

// Clean Real-Time Store (Zero Mock Data)
const defaultOrders: SampleOrder[] = [];
const defaultInquiries: ProjectInquiry[] = [];
const defaultSubscribers: DispatchSubscriber[] = [];

// Helper to determine persistent file paths with /tmp fallback on Vercel
function getFilePath(filename: string): string {
  const localDir = path.join(process.cwd(), 'data');
  const localFile = path.join(localDir, filename);
  const tmpFile = path.join('/tmp', `acespaces-${filename}`);

  if (process.env.VERCEL) {
    if (fs.existsSync(tmpFile)) return tmpFile;
    if (fs.existsSync(localFile)) return localFile;
    return tmpFile;
  }

  // Ensure local data dir exists
  if (!fs.existsSync(localDir)) {
    try {
      fs.mkdirSync(localDir, { recursive: true });
    } catch {
      // Ignore
    }
  }

  return localFile;
}

export function sanitizeString(str?: string, maxLength?: number): string {
  if (!str || typeof str !== 'string') return '';
  const cleaned = str.trim().replace(/[<>]/g, '');
  return typeof maxLength === 'number' && maxLength > 0 ? cleaned.slice(0, maxLength) : cleaned;
}

export function sanitizeEmail(email?: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

function writeDataSafe(filename: string, data: unknown): void {
  const payload = JSON.stringify(data, null, 2);
  const localDir = path.join(process.cwd(), 'data');
  const localPath = path.join(localDir, filename);
  const localTmp = path.join(localDir, `.${filename}.tmp.${Date.now()}`);
  const tmpPath = path.join('/tmp', `acespaces-${filename}`);

  let written = false;
  try {
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(localTmp, payload, 'utf8');
    fs.renameSync(localTmp, localPath);
    written = true;
  } catch {
    // Fallback if atomic rename fails or read-only filesystem
    try {
      if (fs.existsSync(localTmp)) fs.unlinkSync(localTmp);
      fs.writeFileSync(localPath, payload, 'utf8');
      written = true;
    } catch {
      // Serverless fallback
    }
  }

  if (!written || process.env.VERCEL) {
    try {
      fs.writeFileSync(tmpPath, payload, 'utf8');
    } catch (err) {
      console.warn(`Failed to write /tmp backup for ${filename}:`, err);
    }
  }
}

export interface StoreMetrics {
  totalOrders: number;
  submittedOrders: number;
  dispatchedOrders: number;
  totalInquiries: number;
  newInquiries: number;
  totalSubscribers: number;
  activeSubscribers: number;
  recentOrders24h: number;
  recentInquiries24h: number;
}

export function getStoreMetrics(): StoreMetrics {
  const orders = getSampleOrders();
  const inquiries = getInquiries();
  const subscribers = getDispatchSubscribers();
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;

  return {
    totalOrders: orders.length,
    submittedOrders: orders.filter(o => o.status === 'submitted').length,
    dispatchedOrders: orders.filter(o => o.status === 'dispatched').length,
    totalInquiries: inquiries.length,
    newInquiries: inquiries.filter(i => i.status === 'new').length,
    totalSubscribers: subscribers.length,
    activeSubscribers: subscribers.filter(s => s.status === 'active').length,
    recentOrders24h: orders.filter(o => new Date(o.createdAt).getTime() > oneDayAgo).length,
    recentInquiries24h: inquiries.filter(i => new Date(i.createdAt).getTime() > oneDayAgo).length,
  };
}

/* =========================================================================
   SAMPLE ORDERS
========================================================================= */

export function getSampleOrders(): SampleOrder[] {
  const filePath = getFilePath('orders.json');
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading orders.json, using defaults:', err);
  }
  return defaultOrders;
}

export function saveSampleOrder(orderData: Partial<SampleOrder>, isAdmin: boolean = false): SampleOrder {
  const orders = getSampleOrders();
  const now = new Date().toISOString();

  if (orderData.id) {
    // Update existing order (e.g. from in-progress draft to submitted, or updating items/details)
    const index = orders.findIndex((o) => o.id === orderData.id);
    if (index !== -1) {
      const existing = orders[index];

      // Security check: Unauthenticated users can only update 'in-progress' draft orders
      if (!isAdmin) {
        if (existing.status !== 'in-progress') {
          throw new Error('Submitted orders cannot be modified without administrative authorization.');
        }
        // Disallow setting privileged statuses like 'dispatched', 'delivered', or 'cancelled'
        if (orderData.status && !['in-progress', 'submitted'].includes(orderData.status)) {
          throw new Error('Unauthorized order status transition.');
        }
      }

      const updated: SampleOrder = {
        ...existing,
        ...orderData,
        status: orderData.status || existing.status,
        customer: {
          ...existing.customer,
          ...(orderData.customer || {}),
        },
        items: orderData.items || existing.items,
        itemCount: (orderData.items || existing.items).length,
        updatedAt: now,
      };
      orders[index] = updated;
      writeDataSafe('orders.json', orders);
      return updated;
    }
  }

  // Create new order
  // Unauthenticated users cannot create orders with privileged statuses
  const initialStatus = (!isAdmin && orderData.status && !['in-progress', 'submitted'].includes(orderData.status))
    ? 'submitted'
    : (orderData.status || 'submitted');

  const orderNum = `ACE-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: SampleOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    orderNumber: orderNum,
    status: initialStatus,
    createdAt: now,
    updatedAt: now,
    customer: {
      name: sanitizeString(orderData.customer?.name) || 'Anonymous Specifier',
      studio: sanitizeString(orderData.customer?.studio),
      email: sanitizeEmail(orderData.customer?.email),
      phone: sanitizeString(orderData.customer?.phone),
      address: sanitizeString(orderData.customer?.address),
      city: sanitizeString(orderData.customer?.city),
      pincode: sanitizeString(orderData.customer?.pincode),
      projectType: sanitizeString(orderData.customer?.projectType) || 'Residential',
    },
    items: (orderData.items || []).map((it) => ({
      materialSlug: sanitizeString(it.materialSlug),
      name: sanitizeString(it.name),
      collection: sanitizeString(it.collection),
      finish: sanitizeString(it.finish),
      colour: sanitizeString(it.colour),
      swatch: sanitizeString(it.swatch),
      dimensions: sanitizeString(it.dimensions) || '100mm × 100mm',
    })),
    itemCount: (orderData.items || []).length,
    notes: sanitizeString(orderData.notes),
  };

  // Prepend newest first
  orders.unshift(newOrder);
  writeDataSafe('orders.json', orders);
  return newOrder;
}

export function updateSampleOrderStatus(id: string, status: OrderStatus, notes?: string): SampleOrder | null {
  const orders = getSampleOrders();
  const index = orders.findIndex((o) => o.id === id);
  if (index === -1) return null;

  orders[index].status = status;
  orders[index].updatedAt = new Date().toISOString();
  if (notes !== undefined) {
    orders[index].notes = notes;
  }

  writeDataSafe('orders.json', orders);
  return orders[index];
}

export function deleteSampleOrder(id: string): boolean {
  const orders = getSampleOrders();
  const filtered = orders.filter((o) => o.id !== id);
  if (filtered.length !== orders.length) {
    writeDataSafe('orders.json', filtered);
    return true;
  }
  return false;
}

/* =========================================================================
   PROJECT INQUIRIES
========================================================================= */

export function getInquiries(): ProjectInquiry[] {
  const filePath = getFilePath('inquiries.json');
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading inquiries.json, using defaults:', err);
  }
  return defaultInquiries;
}

export function saveInquiry(inquiryData: {
  name: string;
  email: string;
  phone?: string;
  projectType: string;
  message: string;
}): ProjectInquiry {
  const inquiries = getInquiries();
  const now = new Date().toISOString();
  const inquiryNum = `ACE-INQ-${Math.floor(400 + Math.random() * 900)}`;

  const newInquiry: ProjectInquiry = {
    id: `inq_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    inquiryNumber: inquiryNum,
    name: sanitizeString(inquiryData.name, 120),
    email: sanitizeEmail(inquiryData.email),
    phone: inquiryData.phone ? sanitizeString(inquiryData.phone, 30) : '',
    projectType: sanitizeString(inquiryData.projectType, 80) || 'General Consultation',
    message: sanitizeString(inquiryData.message, 3000),
    status: 'new',
    createdAt: now,
    updatedAt: now,
  };

  inquiries.unshift(newInquiry);
  writeDataSafe('inquiries.json', inquiries);
  return newInquiry;
}

export function updateInquiryStatus(id: string, status: InquiryStatus, notes?: string): ProjectInquiry | null {
  const inquiries = getInquiries();
  const index = inquiries.findIndex((i) => i.id === id);
  if (index === -1) return null;

  inquiries[index].status = status;
  inquiries[index].updatedAt = new Date().toISOString();
  if (notes !== undefined) {
    inquiries[index].notes = sanitizeString(notes, 1000);
  }

  writeDataSafe('inquiries.json', inquiries);
  return inquiries[index];
}

export function deleteInquiry(id: string): boolean {
  const inquiries = getInquiries();
  const filtered = inquiries.filter((i) => i.id !== id);
  if (filtered.length !== inquiries.length) {
    writeDataSafe('inquiries.json', filtered);
    return true;
  }
  return false;
}

/* =========================================================================
   DISPATCH SUBSCRIBERS
========================================================================= */

export function getDispatchSubscribers(): DispatchSubscriber[] {
  const filePath = getFilePath('subscribers.json');
  try {
    if (fs.existsSync(filePath)) {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Error reading subscribers.json, using defaults:', err);
  }
  return defaultSubscribers;
}

export function addDispatchSubscriber(email: string, source = 'Footer Dispatch Box'): { subscriber: DispatchSubscriber; alreadySubscribed: boolean } {
  const subscribers = getDispatchSubscribers();
  const normalized = sanitizeEmail(email);
  const cleanSource = sanitizeString(source, 100) || 'Footer Dispatch Box';
  const now = new Date().toISOString();

  const existing = subscribers.find((s) => s.email.toLowerCase() === normalized);
  if (existing) {
    if (existing.status !== 'active') {
      existing.status = 'active';
      existing.createdAt = now;
      writeDataSafe('subscribers.json', subscribers);
    }
    return { subscriber: existing, alreadySubscribed: true };
  }

  const newSub: DispatchSubscriber = {
    id: `sub_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    email: normalized,
    source: cleanSource,
    createdAt: now,
    status: 'active',
  };

  subscribers.unshift(newSub);
  writeDataSafe('subscribers.json', subscribers);
  return { subscriber: newSub, alreadySubscribed: false };
}

export function removeDispatchSubscriber(id: string): boolean {
  const subscribers = getDispatchSubscribers();
  const filtered = subscribers.filter((s) => s.id !== id);
  if (filtered.length !== subscribers.length) {
    writeDataSafe('subscribers.json', filtered);
    return true;
  }
  return false;
}
