
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { BookOpen, Plus, Loader2, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  type: 'loading' | 'noWishes' | 'noPractices';
  onCreateWish?: () => void;
}

export const EmptyState = ({ type, onCreateWish }: EmptyStateProps) => {
  const { t } = useTranslation('app');
  if (type === 'loading') {
    return (
      <div className="flex-1 bg-ios-secondary-background flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-ios-blue mx-auto mb-4" />
          <p className="text-gray-600">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (type === 'noWishes') {
    return (
      <div className="flex-1 bg-ios-secondary-background flex items-center justify-center p-4">
        <Card className="p-8 text-center max-w-md bg-white border-0 shadow-ios rounded-ios">
          <div className="w-16 h-16 bg-gradient-to-br from-manifest-warm-gold to-manifest-lavender rounded-ios flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">{t('auth.startJourney')}</h3>
          <Button 
            onClick={onCreateWish}
            className="bg-gradient-to-r from-manifest-warm-gold to-manifest-lavender text-white rounded-ios px-6 py-3 shadow-ios"
          >
            <Plus className="w-4 h-4 mr-2" />
            {t('wishes.create')}
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-ios-secondary-background flex items-center justify-center p-4">
      <Card className="p-8 text-center max-w-md bg-white border-0 shadow-ios rounded-ios">
        <div className="w-16 h-16 bg-gray-100 rounded-ios flex items-center justify-center mx-auto mb-4">
          <BookOpen className="w-8 h-8 text-gray-400" />
        </div>
        <p className="text-gray-600 mb-4">{t('emptyState.selectWish')}</p>
      </Card>
    </div>
  );
};
