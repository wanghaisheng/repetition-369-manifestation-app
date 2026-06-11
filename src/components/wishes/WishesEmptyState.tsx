import { m } from '@/paraglide/messages';
import { Sparkles, Plus, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface WishesEmptyStateProps {
  onAddWish: () => void;
}

export const WishesEmptyState = ({ onAddWish }: WishesEmptyStateProps) => {
  return (
    <Card className="relative overflow-hidden bg-gradient-to-br from-card via-card to-muted/30 border-0 shadow-storybook rounded-storybook-lg">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-storybook-honey/10 to-transparent rounded-blob blur-3xl" />
        <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-gradient-to-tr from-storybook-coral/10 to-transparent rounded-blob blur-2xl" />
      </div>
      
      <div className="relative py-16 px-8 text-center">
        <div className="relative inline-flex mb-6">
          <div className="w-20 h-20 rounded-storybook-lg bg-gradient-to-br from-storybook-honey/20 to-storybook-honey/5 flex items-center justify-center">
            <Sparkles className="w-10 h-10 text-storybook-honey" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-storybook bg-gradient-to-br from-storybook-honey to-storybook-coral flex items-center justify-center shadow-storybook">
            <Target className="w-4 h-4 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-storybook font-bold text-foreground mb-3">{m.app_wishes_emptyState_title()}</h3>
        <p className="text-muted-foreground mb-8 max-w-sm mx-auto leading-relaxed">{m.app_wishes_emptyState_description()}</p>

        <Button onClick={onAddWish} size="lg"
          className="bg-gradient-to-r from-storybook-honey to-storybook-coral hover:opacity-90 text-white rounded-storybook-lg px-8 py-6 shadow-storybook-hover font-storybook font-semibold text-base">
          <Plus className="w-5 h-5 mr-2" />{m.app_wishes_emptyState_cta()}
        </Button>
      </div>
    </Card>
  );
};
