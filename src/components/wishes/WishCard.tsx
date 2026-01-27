import { useNavigate } from 'react-router-dom';
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
  career: { 
    icon: Briefcase, 
    gradient: 'from-blue-500 to-blue-600',
    bgLight: 'bg-blue-50'
  },
  health: { 
    icon: Heart, 
    gradient: 'from-emerald-500 to-emerald-600',
    bgLight: 'bg-emerald-50'
  },
  relationship: { 
    icon: Smile, 
    gradient: 'from-pink-500 to-rose-500',
    bgLight: 'bg-pink-50'
  },
  wealth: { 
    icon: DollarSign, 
    gradient: 'from-amber-500 to-orange-500',
    bgLight: 'bg-amber-50'
  },
  personal: { 
    icon: User, 
    gradient: 'from-violet-500 to-purple-600',
    bgLight: 'bg-violet-50'
  },
  other: { 
    icon: Target, 
    gradient: 'from-slate-500 to-slate-600',
    bgLight: 'bg-slate-50'
  }
};

export const WishCard = ({ wish, onToggleStatus }: WishCardProps) => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation('app');
  
  const config = categoryConfig[wish.category] || categoryConfig.other;
  const CategoryIcon = config.icon;
  const isZh = i18n.language?.startsWith('zh');

  const categoryNames: Record<WishCategory, string> = {
    career: t('wishes.categories.career'),
    health: t('wishes.categories.health'),
    relationship: t('wishes.categories.relationship'),
    wealth: t('wishes.categories.wealth'),
    personal: t('wishes.categories.personal'),
    other: t('wishes.categories.other')
  };

  const handleStartPractice = () => {
    navigate(`/app/practice?wishId=${wish.id}`);
  };

  const formattedDate = new Date(wish.createdAt).toLocaleDateString(
    isZh ? 'zh-CN' : 'en-US',
    { month: 'short', day: 'numeric' }
  );

  return (
    <Card className="group relative overflow-hidden bg-card border-0 shadow-md hover:shadow-lg transition-all duration-300 rounded-2xl">
      {/* Gradient accent bar */}
      <div className={cn(
        "absolute top-0 left-0 right-0 h-1 bg-gradient-to-r",
        config.gradient
      )} />
      
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Category Icon */}
          <div className={cn(
            "w-14 h-14 rounded-2xl flex items-center justify-center shrink-0",
            "bg-gradient-to-br shadow-sm",
            config.gradient
          )}>
            <CategoryIcon className="w-7 h-7 text-white" />
          </div>
          
          {/* Content */}
          <div className="flex-1 min-w-0">
            {/* Title & Category Badge */}
            <div className="flex items-center gap-2 mb-2 flex-wrap">
              <h3 className="font-semibold text-foreground text-lg truncate">
                {wish.title}
              </h3>
              <span className={cn(
                "text-xs px-2.5 py-1 rounded-full font-medium shrink-0",
                config.bgLight,
                "text-foreground/70"
              )}>
                {categoryNames[wish.category] || categoryNames.other}
              </span>
            </div>
            
            {/* Affirmation */}
            <p className="text-muted-foreground leading-relaxed line-clamp-2 mb-4">
              {wish.affirmation}
            </p>
            
            {/* Footer */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {t('wishes.createdAt')} {formattedDate}
              </span>
              
              <div className="flex items-center gap-2">
                {/* Practice Button */}
                <Button 
                  size="sm"
                  onClick={handleStartPractice}
                  className={cn(
                    "rounded-xl font-medium px-4",
                    "bg-gradient-to-r text-white shadow-sm",
                    config.gradient,
                    "hover:opacity-90 transition-opacity"
                  )}
                >
                  <PlayCircle className="w-4 h-4 mr-1.5" />
                  {t('wishes.startPractice')}
                </Button>
                
                {/* Toggle Status Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onToggleStatus(wish)}
                  className="rounded-xl border-border/50 hover:bg-muted/50"
                >
                  {wish.status === 'active' ? (
                    <>
                      <Pause className="w-4 h-4 mr-1" />
                      {t('wishes.pause')}
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 mr-1" />
                      {t('wishes.activate')}
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
