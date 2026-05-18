import { TimeSlot } from '@/types';
import { logger } from '@/utils/logger';

const PREFIX = 'practice-slot-draft';

export interface SlotDraft {
  entries: string[];
  currentEntry: string;
  updatedAt: string;
}

const todayKey = () => {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const buildKey = (userId: string, wishId: string, slot: TimeSlot) =>
  `${PREFIX}:${userId}:${wishId}:${slot}:${todayKey()}`;

export const readSlotDraft = (
  userId: string,
  wishId: string,
  slot: TimeSlot
): SlotDraft | null => {
  if (!userId || !wishId) return null;
  try {
    const raw = localStorage.getItem(buildKey(userId, wishId, slot));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SlotDraft;
    if (!Array.isArray(parsed?.entries) || typeof parsed?.currentEntry !== 'string') return null;
    return parsed;
  } catch (err) {
    logger.error('readSlotDraft failed', err);
    return null;
  }
};

export const writeSlotDraft = (
  userId: string,
  wishId: string,
  slot: TimeSlot,
  draft: Omit<SlotDraft, 'updatedAt'>
) => {
  if (!userId || !wishId) return;
  try {
    if (draft.entries.length === 0 && draft.currentEntry.trim().length === 0) {
      localStorage.removeItem(buildKey(userId, wishId, slot));
      return;
    }
    localStorage.setItem(
      buildKey(userId, wishId, slot),
      JSON.stringify({ ...draft, updatedAt: new Date().toISOString() })
    );
  } catch (err) {
    logger.error('writeSlotDraft failed', err);
  }
};

export const clearSlotDraft = (userId: string, wishId: string, slot: TimeSlot) => {
  if (!userId || !wishId) return;
  try {
    localStorage.removeItem(buildKey(userId, wishId, slot));
  } catch { /* noop */ }
};
