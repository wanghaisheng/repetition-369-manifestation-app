import { Sparkles, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useTranslation } from 'react-i18next';

interface WishesEmptyStateProps {
  onAddWish: () => void;
}

export const WishesEmptyState = ({ onAddWish }: WishesEmptyStateProps) => {
  const { t } = useTranslation('app');

  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-0 shadow-lg rounded-3xl">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-2xl" />
      </div>
      
      <div className="relative py-16 px-8 text-center">
        {/* Icon */}
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-primary" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg">
            <Target className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-xl font-bold text-foreground mb-3">
          {t('wishes.emptyState.title')}
        </h3>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">
          {t('wishes.emptyState.description')}
        </p>

        {/* CTA Button */}
        <Button
          onClick={onAddWish}
          size="lg"
          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-primary-foreground rounded-2xl px-8 py-6 shadow-lg font-semibold text-base"
        >
          <Plus className="w-5 h-5 mr-2" />
          {t('wishes.emptyState.cta')}
        </Button>
      </div>
    </Card>
  );
};
