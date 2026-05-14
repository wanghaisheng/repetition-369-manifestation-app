/**
 * Validation helper bridging Zod and the Result Pattern used by Storage Adapter.
 */
import type { ZodSchema } from 'zod';
import { err, ok, type Result, type StorageError } from '@/adapters';
import { logger } from '@/utils/logger';

/**
 * Run a Zod schema against unknown data and return a Result.
 * On failure, logs the issues and returns a StorageError with code VALIDATION_ERROR.
 */
export function validate<T>(schema: ZodSchema<T>, data: unknown, context?: string): Result<T> {
  const parsed = schema.safeParse(data);
  if (!parsed.success) {
    const issues = parsed.error.issues
      .map((i) => `${i.path.join('.') || '<root>'}: ${i.message}`)
      .join('; ');
    const error: StorageError = {
      message: context ? `Validation failed (${context}): ${issues}` : `Validation failed: ${issues}`,
      code: 'VALIDATION_ERROR',
      details: JSON.stringify(parsed.error.issues),
    };
    logger.error('Schema validation failed', { context, issues });
    return err(error);
  }
  return ok(parsed.data);
}

/**
 * Validate every item in an array. Drops invalid rows but logs them.
 * Useful at the adapter boundary where one corrupt row should not poison the whole list.
 */
export function validateMany<T>(schema: ZodSchema<T>, items: unknown[], context?: string): T[] {
  const out: T[] = [];
  for (const item of items) {
    const r = schema.safeParse(item);
    if (r.success) {
      out.push(r.data);
    } else {
      logger.error('Schema validation dropped row', {
        context,
        issues: r.error.issues,
      });
    }
  }
  return out;
}
