import { Wish } from '@/types';
import { WishCard } from './WishCard';

interface WishesListProps {
  wishes: Wish[];
  onToggleStatus: (wish: Wish) => void;
}

export const WishesList = ({ wishes, onToggleStatus }: WishesListProps) => {
  return (
    <div className="space-y-4">
      {wishes.map((wish) => (
        <WishCard
          key={wish.id}
          wish={wish}
          onToggleStatus={onToggleStatus}
        />
      ))}
    </div>
  );
};
