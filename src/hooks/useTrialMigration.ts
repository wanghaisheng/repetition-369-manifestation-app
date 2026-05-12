import { useEffect, useRef } from 'react';
import { useNavigate, useSearch } from '@tanstack/react-router';
import { useAuth } from '@/contexts/AuthContext';
import { WishService } from '@/services/WishService';
import { PracticeService } from '@/services/PracticeService';
import { readTrialState, clearTrialState } from '@/utils/trialStorage';
import { logger } from '@/utils/logger';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

/**
 * After login, migrate any anonymous trial data into the real account:
 *   - create a wish from the trial affirmation
 *   - record one practice_session per completed time slot
 *   - clear localStorage and redirect to /app/practice with the wish selected
 *
 * Idempotent: only runs once per mount and only if trial data exists.
 */
export const useTrialMigration = (onMigrated?: () => void) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const search = useSearch({ strict: false }) as { resume?: string };
  const { toast } = useToast();
  const { t } = useTranslation('app');
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    if (!isAuthenticated || !user) return;

    const trial = readTrialState();
    if (!trial) return;

    hasRun.current = true;

    (async () => {
      try {
        const wish = await WishService.createWish({
          userId: user.id,
          title: trial.affirmation.slice(0, 40),
          description: '',
          category: (trial.category as any) || 'personal',
          status: 'active',
          priority: 'medium',
          affirmation: trial.affirmation,
          tags: [],
        });

        for (const s of trial.slots) {
          await PracticeService.recordPractice({
            userId: user.id,
            wishId: wish.id,
            timeSlot: s.slot,
            completedCount: s.entries.length,
            targetCount: s.target,
            duration: 0,
            affirmationText: s.entries.join('\n---\n'),
            mood: s.mood,
            date: new Date(s.completedAt),
          });
        }

        clearTrialState();

        toast({
          title: t('trialMigration.title', '体验进度已保存'),
          description: t('trialMigration.desc', '继续完成今日剩余时段吧'),
        });

        onMigrated?.();

        navigate({ to: '/app/$tab', params: { tab: 'practice' } as any, search: { wishId: wish.id } as any, replace: true });
      } catch (err) {
        logger.error('Trial migration failed', err);
        clearTrialState();
      }
    })();
  }, [isAuthenticated, user]);
};
