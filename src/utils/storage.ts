import { Track, DownloadCode, PaymentConfig, PaymentSubmission, DownloadLog } from '../types';
import { INITIAL_TRACKS, INITIAL_DOWNLOAD_CODES, INITIAL_PAYMENT_CONFIG, INITIAL_SUBMISSIONS } from '../data/initialData';

const STORAGE_KEYS = {
  TRACKS: 'soundvault_tracks_v1',
  CODES: 'soundvault_codes_v1',
  PAYMENT_CONFIG: 'soundvault_payment_config_v2',
  SUBMISSIONS: 'soundvault_submissions_v1',
  ADMIN_PIN: 'soundvault_admin_pin_v1',
  UNIVERSAL_CODE: 'soundvault_universal_code_v2',
  DOWNLOAD_LOGS: 'soundvault_download_logs_v1',
};

export const getStoredTracks = (): Track[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TRACKS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(INITIAL_TRACKS));
      return INITIAL_TRACKS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_TRACKS;
  }
};

export const saveTracks = (tracks: Track[]): void => {
  localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(tracks));
};

export const getStoredCodes = (): DownloadCode[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.CODES);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(INITIAL_DOWNLOAD_CODES));
      return INITIAL_DOWNLOAD_CODES;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DOWNLOAD_CODES;
  }
};

export const saveCodes = (codes: DownloadCode[]): void => {
  localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(codes));
};

export const getStoredPaymentConfig = (): PaymentConfig => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.PAYMENT_CONFIG);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(INITIAL_PAYMENT_CONFIG));
      return INITIAL_PAYMENT_CONFIG;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.catalogTitle || parsed.catalogTitle === 'Official Music Catalog') {
      parsed.catalogTitle = 'LUCKY JAAY MUSIC CATALOG';
    }
    if (!parsed.artistName || parsed.artistName === 'Lucky Elisha' || parsed.artistName === 'Ezirim lucky Elisha') {
      parsed.artistName = 'Lucky Jaay';
    }
    return {
      ...INITIAL_PAYMENT_CONFIG,
      ...parsed,
      socialLinks: {
        ...INITIAL_PAYMENT_CONFIG.socialLinks,
        ...(parsed.socialLinks || {}),
      },
      globalPricing: {
        ...INITIAL_PAYMENT_CONFIG.globalPricing,
        ...(parsed.globalPricing || {}),
      },
      usdtPayment: {
        ...INITIAL_PAYMENT_CONFIG.usdtPayment,
        ...(parsed.usdtPayment || {}),
      },
      btcPayment: {
        ...INITIAL_PAYMENT_CONFIG.btcPayment,
        ...(parsed.btcPayment || {}),
      },
      bnbPayment: {
        ...INITIAL_PAYMENT_CONFIG.bnbPayment,
        ...(parsed.bnbPayment || {}),
      },
      aboutTitle: parsed.aboutTitle || INITIAL_PAYMENT_CONFIG.aboutTitle,
      aboutBio: parsed.aboutBio || INITIAL_PAYMENT_CONFIG.aboutBio,
      masterArtworkUrl: parsed.masterArtworkUrl || INITIAL_PAYMENT_CONFIG.masterArtworkUrl,
    };
  } catch {
    return INITIAL_PAYMENT_CONFIG;
  }
};

export const savePaymentConfig = (config: PaymentConfig): void => {
  localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(config));
};

const INITIAL_DOWNLOAD_LOGS: DownloadLog[] = [
  {
    id: 'log-01',
    trackId: 'track-01',
    trackTitle: 'Crown of the Sun',
    artist: 'Lucky Jaay',
    codeUsed: 'LUCKY2026',
    timestamp: '2026-10-25 10:14',
  },
  {
    id: 'log-02',
    trackId: 'track-02',
    trackTitle: 'Lagos Nights (Midnight Groove)',
    artist: 'Lucky Jaay',
    codeUsed: 'LUCKY2026',
    timestamp: '2026-10-25 14:32',
  },
  {
    id: 'log-03',
    trackId: 'track-01',
    trackTitle: 'Crown of the Sun',
    artist: 'Lucky Jaay',
    codeUsed: 'LUCKY2026',
    timestamp: '2026-10-25 16:05',
  },
];

export const getStoredDownloadLogs = (): DownloadLog[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.DOWNLOAD_LOGS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.DOWNLOAD_LOGS, JSON.stringify(INITIAL_DOWNLOAD_LOGS));
      return INITIAL_DOWNLOAD_LOGS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_DOWNLOAD_LOGS;
  }
};

export const saveDownloadLogs = (logs: DownloadLog[]): void => {
  localStorage.setItem(STORAGE_KEYS.DOWNLOAD_LOGS, JSON.stringify(logs));
};

export const addDownloadLog = (entry: Omit<DownloadLog, 'id' | 'timestamp'>): DownloadLog => {
  const current = getStoredDownloadLogs();
  const dateStr = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const newLog: DownloadLog = {
    ...entry,
    id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    timestamp: dateStr,
  };
  const updated = [newLog, ...current];
  saveDownloadLogs(updated);
  return newLog;
};

export const getStoredSubmissions = (): PaymentSubmission[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
    if (!raw) {
      localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
      return INITIAL_SUBMISSIONS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_SUBMISSIONS;
  }
};

export const saveSubmissions = (submissions: PaymentSubmission[]): void => {
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));
};

export const getAdminPin = (): string => {
  return localStorage.getItem(STORAGE_KEYS.ADMIN_PIN) || '8080';
};

export const saveAdminPin = (pin: string): void => {
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, pin);
};

export const getStoredUniversalCode = (): string => {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.UNIVERSAL_CODE);
    if (!raw || !raw.trim()) {
      localStorage.setItem(STORAGE_KEYS.UNIVERSAL_CODE, 'LUCKY2026');
      return 'LUCKY2026';
    }
    return raw.trim().toUpperCase();
  } catch {
    return 'LUCKY2026';
  }
};

export const saveUniversalCode = (code: string): void => {
  const clean = (code || 'LUCKY2026').trim().toUpperCase();
  localStorage.setItem(STORAGE_KEYS.UNIVERSAL_CODE, clean);
};

export const resetAllDataToDefault = (): void => {
  localStorage.setItem(STORAGE_KEYS.TRACKS, JSON.stringify(INITIAL_TRACKS));
  localStorage.setItem(STORAGE_KEYS.CODES, JSON.stringify(INITIAL_DOWNLOAD_CODES));
  localStorage.setItem(STORAGE_KEYS.PAYMENT_CONFIG, JSON.stringify(INITIAL_PAYMENT_CONFIG));
  localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
  localStorage.setItem(STORAGE_KEYS.ADMIN_PIN, '8080');
  localStorage.setItem(STORAGE_KEYS.UNIVERSAL_CODE, 'LUCKY2026');
  localStorage.setItem(STORAGE_KEYS.DOWNLOAD_LOGS, JSON.stringify(INITIAL_DOWNLOAD_LOGS));
};

/**
 * Normalizes any phone number into standard international WhatsApp format for wa.me links.
 * Handles '+234...', '080...', '80...', dashes, brackets, and spaces.
 */
export const normalizeWhatsAppNumber = (phone: string): string => {
  if (!phone) return '';
  let cleaned = phone.replace(/[^0-9]/g, '');
  // Nigerian 11-digit starting with 0 (e.g. 08063270422 -> 2348063270422)
  if (cleaned.startsWith('0') && cleaned.length === 11) {
    cleaned = '234' + cleaned.slice(1);
  } else if (cleaned.length === 10 && (cleaned.startsWith('80') || cleaned.startsWith('70') || cleaned.startsWith('81') || cleaned.startsWith('90') || cleaned.startsWith('91'))) {
    cleaned = '234' + cleaned;
  }
  return cleaned;
};

