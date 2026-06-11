import { m } from '@/paraglide/messages';
import { Zap, Plus, Target, ChevronRight } from 'lucide-react';
import { useNavigate } from '@tanstack/react-router';

interface QuickActionsProps {
  hasActiveWishes: boolean;
  onCreateWish: () => void;
}

export const QuickActions = ({ hasActiveWishes, onCreateWish }: QuickActionsProps) => {
  const navigate = useNavigate();
  return (
    <div className="bg-card rounded-2xl p-5 shadow-sm border border-border/50 mb-4">
      <h2 className="font-semibold text-foreground mb-4">{m.app_home_quickStart()}</h2>
      
      <div className="space-y-2.5">
        {hasActiveWishes ? (
          <ActionButton
            icon={Zap}
            label={m.app_home_startPractice()}
            sublabel={m.app_home_continuePractice()}
            onClick={() => navigate({ to: '/app/practice' })}
            variant="primary"
          />
        ) : (
          <ActionButton
            icon={Plus}
            label={m.app_home_createFirstWish()}
            sublabel={m.app_home_startJourney()}
            onClick={onCreateWish}
            variant="primary"
          />
        )}
        
        <ActionButton
          icon={Target}
          label={m.app_home_manageWishes()}
          sublabel={m.app_home_viewEditWishes()}
          onClick={() => navigate({ to: '/app/wishes' })}
          variant="secondary"
        />
      </div>
    </div>
  );
};

interface ActionButtonProps {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  sublabel: string;
  onClick: () => void;
  variant: 'primary' | 'secondary';
}

const ActionButton = ({ icon: Icon, label, sublabel, onClick, variant }: ActionButtonProps) => {
  const isPrimary = variant === 'primary';
  
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-200 active:scale-[0.98] ${
        isPrimary 
          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/25' 
          : 'bg-secondary/50 hover:bg-secondary text-foreground'
      }`}
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
        isPrimary ? 'bg-primary-foreground/20' : 'bg-background'
      }`}>
        <Icon className={`w-5 h-5 ${isPrimary ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
      </div>
      <div className="flex-1 text-left">
        <div className={`font-medium ${isPrimary ? '' : 'text-foreground'}`}>{label}</div>
        <div className={`text-xs ${isPrimary ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
          {sublabel}
        </div>
      </div>
      <ChevronRight className={`w-5 h-5 ${isPrimary ? 'text-primary-foreground/60' : 'text-muted-foreground'}`} />
    </button>
  );
};
