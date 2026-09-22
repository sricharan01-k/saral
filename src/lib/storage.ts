import { get, set, del, keys } from 'idb-keyval';
import { ScanRecord, UserSettings } from '../types';

const SCANS_PREFIX = 'saral_scan_';
const SETTINGS_KEY = 'saral_user_settings';
const DEVICE_ID_KEY = 'saral_device_id';
const SYNC_BANNER_DISMISSED_KEY = 'saral_sync_dismissed_until';

// Unique anonymous device ID per installation
export function getOrCreateDeviceId(): string {
  try {
    let id = localStorage.getItem(DEVICE_ID_KEY);
    if (!id) {
      id = 'dev_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now().toString(36);
      localStorage.setItem(DEVICE_ID_KEY, id);
    }
    return id;
  } catch {
    return 'dev_fallback_' + Date.now();
  }
}

// 7-day dismissal helper for cloud sync banner
export function isCloudSyncBannerDismissed(): boolean {
  try {
    const until = localStorage.getItem(SYNC_BANNER_DISMISSED_KEY);
    if (!until) return false;
    return Date.now() < parseInt(until, 10);
  } catch {
    return false;
  }
}

export function dismissCloudSyncBannerFor7Days(): void {
  try {
    const sevenDaysLater = Date.now() + 7 * 24 * 60 * 60 * 1000;
    localStorage.setItem(SYNC_BANNER_DISMISSED_KEY, sevenDaysLater.toString());
  } catch (e) {
    console.warn('Failed to persist dismissal in localStorage', e);
  }
}

const DEFAULT_SETTINGS: UserSettings = {
  language: 'en',
  largeText: false,
};

// Settings
export async function getStoredSettings(): Promise<UserSettings> {
  try {
    const saved = await get<UserSettings>(SETTINGS_KEY);
    return saved ? { ...DEFAULT_SETTINGS, ...saved } : DEFAULT_SETTINGS;
  } catch (err) {
    console.warn('Error reading settings from IndexedDB, falling back:', err);
    return DEFAULT_SETTINGS;
  }
}

export async function saveStoredSettings(settings: UserSettings): Promise<void> {
  try {
    await set(SETTINGS_KEY, settings);
  } catch (err) {
    console.error('Error saving settings to IndexedDB:', err);
  }
}

// Scans
export async function saveScanRecord(scan: ScanRecord): Promise<void> {
  try {
    await set(`${SCANS_PREFIX}${scan.id}`, scan);
  } catch (err) {
    console.error('Error saving scan to IndexedDB:', err);
    throw err;
  }
}

export async function getScanRecord(id: string): Promise<ScanRecord | null> {
  try {
    const scan = await get<ScanRecord>(`${SCANS_PREFIX}${id}`);
    return scan || null;
  } catch (err) {
    console.error('Error loading scan from IndexedDB:', err);
    return null;
  }
}

export async function getAllScanRecords(): Promise<ScanRecord[]> {
  try {
    const allKeys = await keys();
    const scanKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith(SCANS_PREFIX));
    
    const scans: ScanRecord[] = [];
    for (const key of scanKeys) {
      const item = await get<ScanRecord>(key);
      if (item) {
        scans.push(item);
      }
    }

    // Sort newest first
    return scans.sort((a, b) => b.timestamp - a.timestamp);
  } catch (err) {
    console.error('Error retrieving all scans from IndexedDB:', err);
    return [];
  }
}

export async function deleteScanRecord(id: string): Promise<void> {
  try {
    await del(`${SCANS_PREFIX}${id}`);
  } catch (err) {
    console.error('Error deleting scan from IndexedDB:', err);
  }
}

export async function clearAllScanRecords(): Promise<void> {
  try {
    const allKeys = await keys();
    const scanKeys = allKeys.filter((k) => typeof k === 'string' && k.startsWith(SCANS_PREFIX));
    for (const key of scanKeys) {
      await del(key);
    }
  } catch (err) {
    console.error('Error clearing scans from IndexedDB:', err);
  }
}
