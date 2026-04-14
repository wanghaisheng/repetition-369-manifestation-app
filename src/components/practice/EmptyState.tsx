
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { BookOpen, Plus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PracticeViewSkeleton } from '@/components/skeletons/AppSkeletons';

interface EmptyStateProps {
  type: 'loading' | 'noWishes' | 'noPractices';
  onCreateWish?: () => void;
}

export const EmptyState = ({ type, onCreateWish }: EmptyStateProps) => {
  const { t } = useTranslation('app');
  if (type === 'loading') {
    return <PracticeViewSkeleton />;
  }

  if (type === 'noWishes') {
    return (
      <div className="flex-1 bg-secondary/30 flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-card border-0 shadow-storybook rounded-storybook-lg">
          <div className="w-16 h-16 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook-lg flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-storybook font-bold text-foreground mb-2">{t('auth.startJourney')}</h3>
          <Button 
            onClick={onCreateWish}
            className="bg-gradient-to-r from-storybook-honey to-storybook-coral text-white rounded-storybook px-6 py-3 shadow-storybook"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('wishes.create')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-secondary/30 flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md bg-card border-0 shadow-storybook rounded-storybook-lg">
        <div className="w-16 h-16 bg-muted rounded-storybook flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-muted-foreground" />
        </div>
        <p className="text-muted-foreground mb-4">{t('emptyState.selectWish')}</p>
      </Card>
    </div>
  );
};
