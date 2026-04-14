import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Target, Briefcase, Heart, Smile, User, DollarSign, Play, Pause, PlayCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Wish, WishCategory } from '@/types';
import { cn } from '@/lib/utils';

interface WishCardProps {
  wish: Wish;
  onToggleStatus: (wish: Wish) => void;
}

const categoryConfig: Record<WishCategory, { 
  icon: React.ElementType; 
  gradient: string;
  bgLight: string;
}> = {
  career: { icon: Briefcase, gradient: 'from-storybook-honey to-storybook-honey/80', bgLight: 'bg-storybook-honey/10' },
  health: { icon: Heart, gradient: 'from-storybook-sage to-storybook-sage/80', bgLight: 'bg-storybook-sage/10' },
  relationship: { icon: Smile, gradient: 'from-storybook-coral to-storybook-coral/80', bgLight: 'bg-storybook-coral/10' },
  wealth: { icon: DollarSign, gradient: 'from-storybook-honey to-storybook-coral', bgLight: 'bg-storybook-honey/10' },
  personal: { icon: User, gradient: 'from-storybook-coral to-storybook-honey', bgLight: 'bg-storybook-blush' },
  other: { icon: Target, gradient: 'from-storybook-bark/50 to-storybook-bark/30', bgLight: 'bg-muted' }
};

export const WishCard = ({ wish, onToggleStatus }: WishCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('app');
  
  const config = categoryConfig[wish.category] || categoryConfig.other;
  const CategoryIcon = config.icon;
  const dateLocale = i18n.language === 'zh' ? 'zh-CN' : 'en-US';

  const categoryNames: Record<WishCategory, string> = {
    career: t('wishes.categories.career'), health: t('wishes.categories.health'),
    relationship: t('wishes.categories.relationship'), wealth: t('wishes.categories.wealth'),
    personal: t('wishes.categories.personal'), other: t('wishes.categories.other')
  };

  const handleStartPractice = () => { navigate({ to: `/app/practice?wishId=${wish.id}` } as any); };

  const formattedDate = new Date(wish.createdAt).toLocaleDateString(dateLocale, { month: 'short', day: 'numeric' });

  return (
    <Card className="group relative overflow-hidden bg-card border-0 shadow-storybook hover:shadow-storybook-hover transition-all duration-300 rounded-storybook-lg">
      <div className={cn("absolute top-0 left-0 right-0 h-1 bg-gradient-to-r", config.gradient)} />
      <div className="p-5">
        <div className="flex items-start gap-4">
          <div className={cn("w-14 h-14 rounded-storybook-lg flex items-center justify-center shrink-0 bg-gradient-to-br shadow-storybook", config.gradient)}>
            <CategoryIcon className="w-7 h-7 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-storybook font-semibold text-foreground text-lg truncate">{wish.title}</h3>
              <span className={cn("text-xs px-2.5 py-1 rounded-full font-medium shrink-0", config.bgLight, "text-foreground/70")}>
                {categoryNames[wish.category] || categoryNames.other}
              </span>
            </div>
            <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">{wish.affirmation}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{t('wishes.createdAt')} {formattedDate}</span>
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={handleStartPractice}
                  className={cn("rounded-storybook font-medium px-4 bg-gradient-to-r text-white shadow-storybook", config.gradient, "hover:opacity-90 transition-opacity")}>
                  <PlayCircle className="w-4 h-4 mr-1.5" />{t('wishes.startPractice')}
                </Button>
                <Button variant="outline" size="sm" onClick={() => onToggleStatus(wish)} className="rounded-storybook border-border/50 hover:bg-muted/50">
                  {wish.status === 'active' ? (<><Pause className="w-4 h-4 mr-1" />{t('wishes.pause')}</>) : (<><Play className="w-4 h-4 mr-1" />{t('wishes.activate')}</>)}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
