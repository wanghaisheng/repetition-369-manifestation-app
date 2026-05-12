import { trackEvent } from '@/config/analytics';
import { TimeSlot, Mood, WishCategory } from '@/types';

/**
 * Centralized funnel events for the anonymous /try flow.
 * All events are namespaced with `try_` so they form a single funnel in GA4.
 */

const SESSION_KEY = 'try-session-id';

const getSessionId = (): string => {
  if (typeof window === 'undefined') return 'ssr';
  try {
    let id = sessionStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      sessionStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'unknown';
  }
};

const emit = (event: string, params: Record<string, unknown> = {}) => {
  trackEvent(event, { funnel: 'try', session_id: getSessionId(), ...params });
};

export const trialAnalytics = {
  view: () => emit('try_view'),
  selectCategory: (category: WishCategory) => emit('try_select_category', { category }),
  selectAffirmation: (source: 'suggestion' | 'custom', length: number) =>
    emit('try_select_affirmation', { source, length }),
  startPractice: (slot: TimeSlot, target: number, slotIndex: number) =>
    emit('try_start_practice', { slot, target, slot_index: slotIndex }),
  completeSlot: (slot: TimeSlot, completed: number, target: number, mood: Mood) =>
    emit('try_complete_slot', { slot, completed, target, mood, completion_rate: completed / target }),
  continueNext: (from: TimeSlot, to: TimeSlot) => emit('try_continue_next', { from, to }),
  signupClick: (completedSlots: number, totalEntries: number) =>
    emit('try_signup_click', { completed_slots: completedSlots, total_entries: totalEntries }),
  tryAgain: (completedSlots: number) => emit('try_again', { completed_slots: completedSlots }),
  migrated: (slotCount: number, entriesCount: number) =>
    emit('try_migrated', { slot_count: slotCount, entries_count: entriesCount }),
  migrationFailed: (error: string) => emit('try_migration_failed', { error }),
};

export const resetTrialAnalyticsSession = () => {
  try { sessionStorage.removeItem(SESSION_KEY); } catch { /* noop */ }
};
