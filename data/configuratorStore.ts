import fs from 'fs';
import path from 'path';
import { ProductConfiguration, calculateIndicativePrice, PriceBreakdown } from './configuratorData';

export interface SavedConfigurationRecord {
  id: string;
  configNumber: string;
  createdAt: string;
  updatedAt: string;
  config: ProductConfiguration;
  pricing: PriceBreakdown;
  quoteRequest?: {
    customerName: string;
    email: string;
    phone?: string;
    studio?: string;
    notes?: string;
    status: 'inquiry' | 'quote-sent' | 'cad-in-review' | 'approved' | 'in-fabrication';
  };
}

const CONFIGS_FILE = path.join(process.cwd(), 'data', 'configurations.json');
const TMP_CONFIGS_FILE = path.join('/tmp', 'acespaces-configurations.json');

// Global in-memory cache for high-concurrency serverless execution (Vercel Lambda)
declare global {
  // eslint-disable-next-line no-var
  var __inMemoryConfigs: SavedConfigurationRecord[] | undefined;
}

if (!globalThis.__inMemoryConfigs) {
  globalThis.__inMemoryConfigs = [];
}

function readConfigurationsSafe(): SavedConfigurationRecord[] {
  // 1. Check in-memory store first
  if (globalThis.__inMemoryConfigs && globalThis.__inMemoryConfigs.length > 0) {
    return globalThis.__inMemoryConfigs;
  }

  // 2. Try reading from /tmp (Vercel serverless fallback)
  try {
    if (fs.existsSync(TMP_CONFIGS_FILE)) {
      const raw = fs.readFileSync(TMP_CONFIGS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        globalThis.__inMemoryConfigs = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  // 3. Try reading from local project data directory
  try {
    if (fs.existsSync(CONFIGS_FILE)) {
      const raw = fs.readFileSync(CONFIGS_FILE, 'utf8');
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        globalThis.__inMemoryConfigs = parsed;
        return parsed;
      }
    }
  } catch {
    // ignore
  }

  return globalThis.__inMemoryConfigs || [];
}

function writeConfigurationsSafe(configs: SavedConfigurationRecord[]): void {
  // 1. Update in-memory singleton immediately (instant zero-latency consistency)
  globalThis.__inMemoryConfigs = [...configs];

  const payload = JSON.stringify(configs, null, 2);

  // 2. Try writing to local project directory (development / persistent container)
  try {
    const localDir = path.join(process.cwd(), 'data');
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }
    fs.writeFileSync(CONFIGS_FILE, payload, 'utf8');
  } catch {
    // EROFS / read-only filesystem on Vercel is expected; fallback to /tmp
  }

  // 3. Write to /tmp on serverless environments
  try {
    fs.writeFileSync(TMP_CONFIGS_FILE, payload, 'utf8');
  } catch {
    // ignore
  }
}

export function getAllSavedConfigurations(): SavedConfigurationRecord[] {
  return readConfigurationsSafe();
}

export function getSavedConfigurationById(id: string): SavedConfigurationRecord | null {
  const configs = readConfigurationsSafe();
  return configs.find(c => c.id === id || c.configNumber.toLowerCase() === id.toLowerCase()) || null;
}

export function saveConfigurationRecord(
  config: ProductConfiguration,
  quoteRequest?: SavedConfigurationRecord['quoteRequest']
): SavedConfigurationRecord {
  const configs = [...readConfigurationsSafe()];

  const id = config.id || `cfg-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const configNumber = `ACE-CFG-${Math.floor(1000 + Math.random() * 9000)}`;
  const pricing = calculateIndicativePrice(config);

  const newRecord: SavedConfigurationRecord = {
    id,
    configNumber,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    config: { ...config, id },
    pricing,
    quoteRequest: quoteRequest ? { ...quoteRequest, status: quoteRequest.status || 'inquiry' } : undefined,
  };

  const existingIdx = configs.findIndex(c => c.id === id);
  if (existingIdx >= 0) {
    configs[existingIdx] = {
      ...configs[existingIdx],
      ...newRecord,
      createdAt: configs[existingIdx].createdAt,
      configNumber: configs[existingIdx].configNumber,
    };
  } else {
    configs.unshift(newRecord);
  }

  writeConfigurationsSafe(configs);
  return newRecord;
}

export function deleteSavedConfiguration(id: string): boolean {
  const configs = readConfigurationsSafe();
  const filtered = configs.filter(c => c.id !== id && c.configNumber !== id);
  if (filtered.length !== configs.length) {
    writeConfigurationsSafe(filtered);
    return true;
  }
  return false;
}
