
import { useTranslation } from 'react-i18next';
import { Card } from '@/components/ui/card';
import { Wish } from '@/types';

interface WishSelectorProps {
  wishes: Wish[];
  selectedWishId: string;
  onWishChange: (wishId: string) => void;
}

export const WishSelector = ({ wishes, selectedWishId, onWishChange }: WishSelectorProps) => {
  const { t } = useTranslation('app');
  
  return (
    <Card className="mb-6 p-4 bg-white border-0 shadow-ios rounded-ios">
      <h3 className="font-semibold text-gray-800 mb-3">{t('wishSelector.title')}</h3>
      <select
        value={selectedWishId}
        onChange={(e) => onWishChange(e.target.value)}
        className="w-full p-3 border border-gray-200 rounded-ios focus:ring-2 focus:ring-ios-blue focus:border-transparent"
      >
        <option value="">{t('wishSelector.placeholder')}</option>
        {wishes.map(wish => (
          <option key={wish.id} value={wish.id}>{wish.title}</option>
        ))}
      </select>
    </Card>
  );
};
