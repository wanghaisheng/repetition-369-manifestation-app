import { m } from '@/paraglide/messages';

import { useState } from 'react';
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
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<WishCategory | ''>('');
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; category?: string; affirmation?: string }>({});

  const schema = z.object({
    title: z.string().trim().min(2, m.app_addWishModal_validation_titleMin()).max(60, m.app_addWishModal_validation_titleMax()),
    category: z.enum(['career','health','relationship','wealth','personal','other'], { errorMap: () => ({ message: m.app_addWishModal_validation_categoryRequired() }) }),
    affirmation: z.string().trim().min(10, m.app_addWishModal_validation_affirmationMin()).max(200, m.app_addWishModal_validation_affirmationMax()),
  });

const categories = [
  { id: 'career', icon: Briefcase, name: m.app_addWishModal_categories_career(), color: 'bg-ios-blue' },
  { id: 'health', icon: Heart, name: m.app_addWishModal_categories_health(), color: 'bg-ios-green' },
  { id: 'relationship', icon: Smile, name: m.app_addWishModal_categories_relationship(), color: 'bg-ios-pink' },
  { id: 'wealth', icon: Target, name: m.app_addWishModal_categories_wealth(), color: 'bg-manifest-gold' },
  { id: 'personal', icon: HomeIcon, name: m.app_addWishModal_categories_personal(), color: 'bg-ios-purple' }
];

const generateAffirmation = () => {
  const templates = {
    career: m.app_addWishModal_categories_career() + ' - ' + m.app_addWishModal_generateAffirmation(),
    health: m.app_addWishModal_categories_health() + ' - ' + m.app_addWishModal_generateAffirmation(),
    relationship: m.app_addWishModal_categories_relationship() + ' - ' + m.app_addWishModal_generateAffirmation(),
    wealth: m.app_addWishModal_categories_wealth() + ' - ' + m.app_addWishModal_generateAffirmation(),
    personal: m.app_addWishModal_categories_personal() + ' - ' + m.app_addWishModal_generateAffirmation()
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
    toast({ title: m.app_addWishModal_toast_completeInfo(), description: m.app_addWishModal_validation_checkInfo() });
    return;
  }

  try {
    setSubmitting(true);
    await onAdd({ title: result.data.title, category: result.data.category as WishCategory, affirmation: result.data.affirmation });
    toast({ title: m.app_addWishModal_toast_createSuccess(), description: m.app_addWishModal_toast_wishCreated() });

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
    toast({ title: m.app_addWishModal_toast_createFailed(), description: m.app_addWishModal_toast_tryAgain(), variant: 'destructive' });
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
          <h2 className="text-xl font-semibold text-gray-800">{m.app_addWishModal_title()}</h2>
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
    {m.app_addWishModal_wishTitle()}
  </label>
  <Input
    value={title}
    onChange={(e) => {
      setTitle(e.target.value);
      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    }}
    placeholder={m.app_addWishModal_wishTitlePlaceholder()}
    className="rounded-ios border-ios-gray-medium"
  />
  {errors.title && (
    <p className="mt-1 text-sm text-destructive">{errors.title}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    {m.app_addWishModal_selectCategory()}
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
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{m.app_addWishModal_generateAffirmation()}</h3>
                <p className="text-gray-600">{m.app_addWishModal_generateAffirmation()}</p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={generateAffirmation}
                  className="w-full bg-manifest-gold hover:bg-manifest-warm-gold text-white rounded-ios py-3 font-medium"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  {m.app_addWishModal_aiGenerate()}
                </Button>

                <div className="text-center text-gray-500">{m.app_addWishModal_or()}</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {m.app_addWishModal_customAffirmation()}
                  </label>
                  <Textarea
                    value={customAffirmation}
                    onChange={(e) => setCustomAffirmation(e.target.value)}
                    placeholder={m.app_addWishModal_customAffirmationPlaceholder()}
                    className="rounded-ios border-ios-gray-medium min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{m.app_addWishModal_confirmWish()}</h3>
                <div className="bg-gray-50 p-4 rounded-ios">
                  <div className="text-sm text-gray-600 mb-1">{m.app_addWishModal_wishTitle()}</div>
                  <div className="font-medium text-gray-800 mb-3">{title}</div>
                  
                  <div className="text-sm text-gray-600 mb-1">{m.app_addWishModal_affirmation()}</div>
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
               {m.app_addWishModal_nextStep()}
             </Button>
           )}

           {step === 2 && (
             <div className="flex items-center gap-3">
               <Button
                 onClick={() => setStep(3)}
                 disabled={!canProceedStep2}
                 className="flex-1 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
               >
                 {m.app_addWishModal_nextStep()}
               </Button>
               <Button
                 onClick={() => setStep(1)}
                 variant="ghost"
                 className="flex-1 text-gray-700"
               >
                 {m.app_addWishModal_previousStep()}
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
                 {submitting ? m.app_addWishModal_creating() : m.app_addWishModal_createWish()}
               </Button>
               <Button
                 onClick={() => setStep(2)}
                 variant="outline"
                 className="flex-1 rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white font-medium py-3"
               >
                 {m.app_addWishModal_modifyAffirmation()}
               </Button>
             </div>
           )}
         </div>
       </Card>
     </div>
  );
};
