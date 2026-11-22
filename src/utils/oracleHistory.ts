import { EntropySourceType } from './entropyEngine';

export type OracleDecisionType = 'moneda' | 'dados' | 'ruleta' | 'tarot';

export interface OracleHistoryEntry {
  id: string;
  timestampIso: string;
  timeLabel: string;
  dateLabel: string;
  type: OracleDecisionType;
  question?: string;
  resultTitle: string;
  resultDetail?: string;
  source: EntropySourceType;
  sourceLabel: string;
  seedHex: string;
  latencyMs: number;
}

export interface SavedRuletaPreset {
  id: string;
  name: string;
  options: string[];
}

const HISTORY_STORAGE_KEY = 'grimorio_oracle_history_v1';
const PRESETS_STORAGE_KEY = 'grimorio_ruleta_custom_presets_v1';
const MAX_HISTORY_ITEMS = 50;

export function loadOracleHistory(): OracleHistoryEntry[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(HISTORY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function appendOracleHistory(entry: Omit<OracleHistoryEntry, 'id' | 'timestampIso' | 'timeLabel' | 'dateLabel'>): OracleHistoryEntry[] {
  const now = new Date();
  const newEntry: OracleHistoryEntry = {
    ...entry,
    id: `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`,
    timestampIso: now.toISOString(),
    timeLabel: now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    dateLabel: now.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' }),
  };

  const current = loadOracleHistory();
  const updated = [newEntry, ...current].slice(0, MAX_HISTORY_ITEMS);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore quota errors
    }
  }
  return updated;
}

export function clearOracleHistory(): OracleHistoryEntry[] {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }
  return [];
}

export function loadCustomRuletaPresets(): SavedRuletaPreset[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(PRESETS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveCustomRuletaPreset(name: string, options: string[]): SavedRuletaPreset[] {
  const current = loadCustomRuletaPresets();
  const cleanName = name.trim() || `Lista ${current.length + 1}`;
  const newPreset: SavedRuletaPreset = {
    id: `custom-${Date.now()}`,
    name: cleanName,
    options: [...options],
  };
  const updated = [newPreset, ...current.filter((p) => p.name !== cleanName)].slice(0, 8);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(PRESETS_STORAGE_KEY, JSON.stringify(updated));
    } catch {
      // Ignore
    }
  }
  return updated;
}
