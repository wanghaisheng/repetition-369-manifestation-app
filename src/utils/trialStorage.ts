import { TimeSlot, Mood, WishCategory } from '@/types';

export const TRY_STORAGE_KEY = 'try-369-state';
export const TRY_DRAFT_KEY = 'try-369-draft';

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

export interface TrialDraft {
  category: WishCategory;
  affirmation: string;
  completedSlots: TrialSlotResult[];
  activeSlotIdx: number;
  currentSlot: TimeSlot;
  target: number;
  entries: string[];
  currentEntry: string;
  updatedAt: string;
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

export const readTrialDraft = (): TrialDraft | null => {
  try {
    const raw = localStorage.getItem(TRY_DRAFT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as TrialDraft;
    if (!parsed?.affirmation || !parsed?.currentSlot || !Array.isArray(parsed?.entries)) {
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
};

export const writeTrialDraft = (draft: Omit<TrialDraft, 'updatedAt'>) => {
  try {
    localStorage.setItem(
      TRY_DRAFT_KEY,
      JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })
    );
  } catch { /* noop */ }
};

export const clearTrialDraft = () => {
  try { localStorage.removeItem(TRY_DRAFT_KEY); } catch { /* noop */ }
};
