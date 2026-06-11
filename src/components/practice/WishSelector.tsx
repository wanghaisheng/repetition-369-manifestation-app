import { m } from '@/paraglide/messages';

import { Card } from '@/components/ui/card';
import { Wish } from '@/types';

interface WishSelectorProps {
  wishes: Wish[];
  selectedWishId: string;
  onWishChange: (wishId: string) => void;
}

export const WishSelector = ({ wishes, selectedWishId, onWishChange }: WishSelectorProps) => {
  return (
    <Card className="mb-6 p-4 bg-card border-0 shadow-storybook rounded-storybook-lg">
      <h3 className="font-storybook font-semibold text-foreground mb-3">{m.app_wishSelector_title()}</h3>
      <select
        value={selectedWishId}
        onChange={(e) => onWishChange(e.target.value)}
        className="w-full p-3 border border-border rounded-storybook bg-background text-foreground focus:ring-2 focus:ring-storybook-honey focus:border-transparent"
      >
        <option value="">{m.app_wishSelector_placeholder()}</option>
        {wishes.map(wish => (
          <option key={wish.id} value={wish.id}>{wish.title}</option>
        ))}
      </select>
    </Card>
  );
};
