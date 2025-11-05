
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { X, Briefcase, Heart, Smile, Target, Home as HomeIcon, Sparkles } from 'lucide-react';
import { z } from 'zod';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import type { WishCategory } from '@/types';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (wish: { title: string; category: WishCategory; affirmation: string }) => Promise<void> | void;
}

export const AddWishModal = ({ isOpen, onClose, onAdd }: AddWishModalProps) => {
  const { toast } = useToast();
  const { t } = useTranslation('app');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WishCategory | ''>('');
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string; affirmation?: string }>({});

  const schema = z.object({
    title: z.string().trim().min(2, t('addWishModal.validation.titleMin')).max(60, t('addWishModal.validation.titleMax')),
    category: z.enum(['career','health','relationship','wealth','personal','other'], { errorMap: () => ({ message: t('addWishModal.validation.categoryRequired') }) }),
    affirmation: z.string().trim().min(10, t('addWishModal.validation.affirmationMin')).max(200, t('addWishModal.validation.affirmationMax')),
  });

const categories = [
  { id: 'career', icon: Briefcase, name: t('addWishModal.categories.career'), color: 'bg-ios-blue' },
  { id: 'health', icon: Heart, name: t('addWishModal.categories.health'), color: 'bg-ios-green' },
  { id: 'relationship', icon: Smile, name: t('addWishModal.categories.relationship'), color: 'bg-ios-pink' },
  { id: 'wealth', icon: Target, name: t('addWishModal.categories.wealth'), color: 'bg-manifest-gold' },
  { id: 'personal', icon: HomeIcon, name: t('addWishModal.categories.personal'), color: 'bg-ios-purple' }
];

const generateAffirmation = () => {
  const templates = {
    career: t('addWishModal.categories.career') + ' - ' + t('addWishModal.generateAffirmation'),
    health: t('addWishModal.categories.health') + ' - ' + t('addWishModal.generateAffirmation'),
    relationship: t('addWishModal.categories.relationship') + ' - ' + t('addWishModal.generateAffirmation'),
    wealth: t('addWishModal.categories.wealth') + ' - ' + t('addWishModal.generateAffirmation'),
    personal: t('addWishModal.categories.personal') + ' - ' + t('addWishModal.generateAffirmation')
  } as const;

  const baseTemplate = templates[(category as WishCategory) || 'personal'];
  setGeneratedAffirmation(baseTemplate);
  setStep(3);
};

const handleSubmit = async () => {
  const finalAffirmation = (customAffirmation || generatedAffirmation).trim();

  const result = schema.safeParse({
    title: title.trim(),
    category: category || undefined,
    affirmation: finalAffirmation,
  });

  if (!result.success) {
    const newErrors: Record<string, string> = {};
    result.error.issues.forEach((i) => {
      if (i.path[0]) newErrors[i.path[0] as string] = i.message;
    });
    setErrors(newErrors);
    toast({ title: t('addWishModal.toast.completeInfo'), description: t('addWishModal.validation.checkInfo') });
    return;
  }

  try {
    setSubmitting(true);
    await onAdd({ title: result.data.title, category: result.data.category as WishCategory, affirmation: result.data.affirmation });
    toast({ title: t('addWishModal.toast.createSuccess'), description: t('addWishModal.toast.wishCreated') });

    // Reset form
    setTitle('');
    setCategory('');
    setCustomAffirmation('');
    setGeneratedAffirmation('');
    setErrors({});
    setStep(1);
    onClose();
  } catch (e) {
    // Error already handled by showing toast
    toast({ title: t('addWishModal.toast.createFailed'), description: t('addWishModal.toast.tryAgain'), variant: 'destructive' });
  } finally {
    setSubmitting(false);
  }
};

  const canProceedStep1 = title.trim().length >= 2 && !!category;
  const canProceedStep2 = customAffirmation.trim().length >= 10 || generatedAffirmation.trim().length > 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white rounded-ios max-h-[80vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-gray-800">{t('addWishModal.title')}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-6">
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2">
    {t('addWishModal.wishTitle')}
  </label>
  <Input
    value={title}
    onChange={(e) => {
      setTitle(e.target.value);
      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    }}
    placeholder={t('addWishModal.wishTitlePlaceholder')}
    className="rounded-ios border-ios-gray-medium"
  />
  {errors.title && (
    <p className="mt-1 text-sm text-destructive">{errors.title}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    {t('addWishModal.selectCategory')}
  </label>
  <div className="grid grid-cols-2 gap-3">
    {categories.map((cat) => {
      const Icon = cat.icon;
      return (
        <button
          key={cat.id}
          onClick={() => {
            setCategory(cat.id as WishCategory);
            if (errors.category) setErrors((prev) => ({ ...prev, category: undefined }));
          }}
          className={`p-4 rounded-ios border-2 transition-all ${
            category === cat.id
              ? 'border-ios-blue bg-ios-blue/10'
              : 'border-gray-200 hover:border-gray-300'
          }`}
        >
          <div className={`w-10 h-10 rounded-ios mx-auto mb-2 flex items-center justify-center ${cat.color}`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <span className="text-sm font-medium text-gray-700">{cat.name}</span>
        </button>
      );
    })}
  </div>
  {errors.category && (
    <p className="mt-2 text-sm text-destructive">{errors.category}</p>
  )}
</div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-manifest-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('addWishModal.generateAffirmation')}</h3>
                <p className="text-gray-600">{t('addWishModal.generateAffirmation')}</p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={generateAffirmation}
                  className="w-full bg-manifest-gold hover:bg-manifest-warm-gold text-white rounded-ios py-3 font-medium"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {t('addWishModal.aiGenerate')}
                </Button>

                <div className="text-center text-gray-500">{t('addWishModal.or')}</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {t('addWishModal.customAffirmation')}
                  </label>
                  <Textarea
                    value={customAffirmation}
                    onChange={(e) => setCustomAffirmation(e.target.value)}
                    placeholder={t('addWishModal.customAffirmationPlaceholder')}
                    className="rounded-ios border-ios-gray-medium min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{t('addWishModal.confirmWish')}</h3>
                <div className="bg-gray-50 p-4 rounded-ios">
                  <div className="text-sm text-gray-600 mb-1">{t('addWishModal.wishTitle')}</div>
                  <div className="font-medium text-gray-800 mb-3">{title}</div>
                  
                  <div className="text-sm text-gray-600 mb-1">{t('addWishModal.affirmation')}</div>
                  <div className="text-gray-800 leading-relaxed">
                    {customAffirmation || generatedAffirmation}
                  </div>
                </div>
              </div>

            </div>
           )}
         </div>

         {/* Sticky Footer Actions */}
         <div className="p-4 border-t border-gray-100 bg-white">
           {step === 1 && (
             <Button
               onClick={() => {
                 if (!canProceedStep1) return;
                 setErrors({});
                 setStep(2);
               }}
               disabled={!canProceedStep1}
               className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
             >
               {t('addWishModal.nextStep')}
             </Button>
           )}

           {step === 2 && (
             <div className="flex items-center gap-3">
               <Button
                 onClick={() => setStep(3)}
                 disabled={!canProceedStep2}
                 className="flex-1 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
               >
                 {t('addWishModal.nextStep')}
               </Button>
               <Button
                 onClick={() => setStep(1)}
                 variant="ghost"
                 className="flex-1 text-gray-700"
               >
                 {t('addWishModal.previousStep')}
               </Button>
             </div>
           )}

           {step === 3 && (
             <div className="flex items-center gap-3">
               <Button
                 onClick={handleSubmit}
                 disabled={submitting}
                 className="flex-1 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
               >
                 {submitting ? t('addWishModal.creating') : t('addWishModal.createWish')}
               </Button>
               <Button
                 onClick={() => setStep(2)}
                 variant="outline"
                 className="flex-1 rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white font-medium py-3"
               >
                 {t('addWishModal.modifyAffirmation')}
               </Button>
             </div>
           )}
         </div>
       </Card>
     </div>
  );
};
