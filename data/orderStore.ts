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

function writeDataSafe(filename: string, data: unknown): void {
  const payload = JSON.stringify(data, null, 2);
  const localPath = path.join(process.cwd(), 'data', filename);
  const tmpPath = path.join('/tmp', `acespaces-${filename}`);

  let written = false;
  try {
    fs.writeFileSync(localPath, payload, 'utf8');
    written = true;
  } catch {
    // Read-only filesystem on serverless
  }

  if (!written || process.env.VERCEL) {
    try {
      fs.writeFileSync(tmpPath, payload, 'utf8');
    } catch (err) {
      console.warn(`Failed to write /tmp backup for ${filename}:`, err);
    }
  }
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

export function saveSampleOrder(orderData: Partial<SampleOrder>): SampleOrder {
  const orders = getSampleOrders();
  const now = new Date().toISOString();

  if (orderData.id) {
    // Update existing order (e.g. from in-progress draft to submitted, or updating items/details)
    const index = orders.findIndex((o) => o.id === orderData.id);
    if (index !== -1) {
      const existing = orders[index];
      const updated: SampleOrder = {
        ...existing,
        ...orderData,
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
  const orderNum = `ACE-ORD-${Math.floor(1000 + Math.random() * 9000)}`;
  const newOrder: SampleOrder = {
    id: `ord_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    orderNumber: orderNum,
    status: orderData.status || 'submitted',
    createdAt: now,
    updatedAt: now,
    customer: {
      name: orderData.customer?.name || 'Anonymous Specifier',
      studio: orderData.customer?.studio || '',
      email: orderData.customer?.email || '',
      phone: orderData.customer?.phone || '',
      address: orderData.customer?.address || '',
      city: orderData.customer?.city || '',
      pincode: orderData.customer?.pincode || '',
      projectType: orderData.customer?.projectType || 'Residential',
    },
    items: orderData.items || [],
    itemCount: (orderData.items || []).length,
    notes: orderData.notes || '',
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
    name: inquiryData.name.trim(),
    email: inquiryData.email.trim(),
    phone: inquiryData.phone?.trim() || '',
    projectType: inquiryData.projectType.trim() || 'General Consultation',
    message: inquiryData.message.trim(),
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
    inquiries[index].notes = notes;
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
  const normalized = email.trim().toLowerCase();
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
    source,
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
