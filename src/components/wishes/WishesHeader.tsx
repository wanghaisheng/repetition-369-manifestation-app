import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';

interface WishesHeaderProps {
  onAddWish: () => void;
}

export const WishesHeader = ({ onAddWish }: WishesHeaderProps) => {
  const { t } = useTranslation('app');

  return (
    <div className="flex justify-end items-center mb-5">
      <Button
        onClick={onAddWish}
        className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-5 py-2.5 shadow-md font-medium"
      >
        <Plus className="w-5 h-5 mr-2" />
        {t('wishes.addWish')}
      </Button>
    </div>
  );
};
