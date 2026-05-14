/**
 * Zod schemas for runtime validation at Storage Adapter boundaries.
 * Validates raw DB rows before mapping to domain entities.
 */
import { z } from 'zod';

// ============ Domain enums ============

export const WishCategorySchema = z.enum([
  'career',
  'health',
  'relationship',
  'wealth',
  'personal',
  'other',
]);

export const TimeSlotSchema = z.enum(['morning', 'afternoon', 'evening']);

export const MoodSchema = z.enum(['excellent', 'good', 'neutral', 'poor']);

// ============ Wish ============

/** Raw row shape returned by storage adapter for `wishes` table */
export const WishRowSchema = z.object({
  id: z.string().uuid(),
  user_id: z.string().uuid(),
  title: z.string().min(1).max(200),
  affirmation: z.string().max(2000),
  category: z.string().nullable(),
  color: z.string().nullable(),
  is_active: z.boolean().nullable(),
  created_at: z.string(),
  updated_at: z.string(),
});
export type WishRow = z.infer<typeof WishRowSchema>;

/** Inputs accepted from UI before persisting */
export const WishInputSchema = z.object({
  title: z.string().trim().min(1, 'Title required').max(200),
  affirmation: z.string().trim().min(1, 'Affirmation required').max(2000),
  category: WishCategorySchema.optional(),
});
export type WishInput = z.infer<typeof WishInputSchema>;

// ============ Practice Session ============

export const PracticeRowSchema = z.object({
  id: z.string().uuid(),
  wish_id: z.string().uuid(),
  user_id: z.string().uuid(),
  date: z.string(),
  time_slot: TimeSlotSchema,
  completed_count: z.number().int().min(0).max(99),
  target_count: z.number().int().min(0).max(99),
  duration: z.number().int().min(0).nullable(),
  affirmation_text: z.string().max(2000).nullable(),
  mood: z.string().nullable(),
  created_at: z.string(),
});
export type PracticeRow = z.infer<typeof PracticeRowSchema>;

export const PracticeInputSchema = z.object({
  wishId: z.string().uuid(),
  timeSlot: TimeSlotSchema,
  completedCount: z.number().int().min(0).max(99),
  targetCount: z.number().int().min(0).max(99),
  duration: z.number().int().min(0).max(86400),
  affirmationText: z.string().trim().max(2000),
  mood: MoodSchema.optional(),
});
export type PracticeInput = z.infer<typeof PracticeInputSchema>;

// ============ Profile ============

export const ProfileRowSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email().nullable(),
  full_name: z.string().max(200).nullable(),
  avatar_url: z.string().url().nullable().or(z.literal('')).nullable(),
  created_at: z.string(),
});
export type ProfileRow = z.infer<typeof ProfileRowSchema>;

// ============ Auth credentials ============

export const SignUpInputSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(8, 'Password must be at least 8 characters').max(128),
  fullName: z.string().trim().max(200).optional(),
});
export type SignUpInput = z.infer<typeof SignUpInputSchema>;

export const SignInInputSchema = z.object({
  email: z.string().trim().email().max(255),
  password: z.string().min(1).max(128),
});
export type SignInInput = z.infer<typeof SignInInputSchema>;
