
import { Achievement } from '@/services/AchievementService';
import { Card } from '@/components/ui/card';
import { AchievementService } from '@/services/AchievementService';

interface AchievementBadgeProps {
  achievement: Achievement;
  size?: 'small' | 'medium' | 'large';
  showDetails?: boolean;
}

export const AchievementBadge = ({ 
  achievement, 
  size = 'medium', 
  showDetails = false 
}: AchievementBadgeProps) => {
  const rarityColor = AchievementService.getRarityColor(achievement.rarity);
  
  const sizeClasses = {
    small: 'w-12 h-12 text-lg',
    medium: 'w-16 h-16 text-2xl',
    large: 'w-24 h-24 text-4xl'
  };

  const containerClasses = {
    small: 'p-2',
    medium: 'p-3',
    large: 'p-4'
  };

  return (
    <Card className={`${containerClasses[size]} ${!achievement.unlocked ? 'opacity-50 grayscale' : ''} border-2 ${rarityColor} transition-all duration-300`}>
      <div className="text-center">
        <div className={`${sizeClasses[size]} rounded-full bg-gradient-to-br from-white to-gray-100 flex items-center justify-center mx-auto mb-2 ${achievement.unlocked ? 'animate-pulse' : ''}`}>
          <span className={achievement.unlocked ? '' : 'filter grayscale'}>
            {achievement.icon}
          </span>
        </div>
        
        {showDetails && (
          <>
            <h4 className={`font-semibold ${size === 'small' ? 'text-xs' : size === 'medium' ? 'text-sm' : 'text-base'} mb-1`}>
              {achievement.name}
            </h4>
            <p className={`text-gray-600 ${size === 'small' ? 'text-xs' : 'text-sm'} mb-2`}>
              {achievement.description}
            </p>
            
            {achievement.unlocked && achievement.unlockedAt && (
              <div className="text-xs text-gray-500">
                {new Date(achievement.unlockedAt).toLocaleDateString()}
              </div>
            )}
            
            {achievement.reward.points > 0 && (
              <div className={`text-manifest-gold font-semibold ${size === 'small' ? 'text-xs' : 'text-sm'}`}>
                +{achievement.reward.points} 点数
              </div>
            )}
          </>
        )}
      </div>
    </Card>
  );
};
