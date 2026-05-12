import { TimeSlot, Mood } from '@/types';

export const TRY_STORAGE_KEY = 'try-369-state';

export interface TrialSlotResult {
  slot: TimeSlot;
  target: number;
  entries: string[];
  mood: Mood;
  completedAt: string;
}

export interface TrialState {
  completedAt: string;
  category: string | null;
  affirmation: string;
  slots: TrialSlotResult[];
}

export const readTrialState = (): TrialState | null => {
  try {
    const raw = localStorage.getItem(TRY_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TrialState;
    if (!parsed?.affirmation || !Array.isArray(parsed?.slots) || parsed.slots.length === 0) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const clearTrialState = () => {
  try { localStorage.removeItem(TRY_STORAGE_KEY); } catch { /* noop */ }
};
