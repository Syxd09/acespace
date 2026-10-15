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

function ensureConfigFile() {
  if (!fs.existsSync(CONFIGS_FILE)) {
    try {
      fs.writeFileSync(CONFIGS_FILE, JSON.stringify([], null, 2), 'utf8');
    } catch (e) {
      console.warn('Could not initialize configurations.json file:', e);
    }
  }
}

export function getAllSavedConfigurations(): SavedConfigurationRecord[] {
  ensureConfigFile();
  try {
    const raw = fs.readFileSync(CONFIGS_FILE, 'utf8');
    return JSON.parse(raw) as SavedConfigurationRecord[];
  } catch (e) {
    console.error('Error reading configurations:', e);
    return [];
  }
}

export function getSavedConfigurationById(id: string): SavedConfigurationRecord | null {
  const configs = getAllSavedConfigurations();
  return configs.find(c => c.id === id || c.configNumber.toLowerCase() === id.toLowerCase()) || null;
}

export function saveConfigurationRecord(
  config: ProductConfiguration,
  quoteRequest?: SavedConfigurationRecord['quoteRequest']
): SavedConfigurationRecord {
  ensureConfigFile();
  const configs = getAllSavedConfigurations();

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

  try {
    fs.writeFileSync(CONFIGS_FILE, JSON.stringify(configs, null, 2), 'utf8');
  } catch (e) {
    console.error('Error saving configuration:', e);
  }

  return newRecord;
}

export function deleteSavedConfiguration(id: string): boolean {
  ensureConfigFile();
  const configs = getAllSavedConfigurations();
  const filtered = configs.filter(c => c.id !== id && c.configNumber !== id);
  if (filtered.length !== configs.length) {
    try {
      fs.writeFileSync(CONFIGS_FILE, JSON.stringify(filtered, null, 2), 'utf8');
      return true;
    } catch {
      return false;
    }
  }
  return false;
}
