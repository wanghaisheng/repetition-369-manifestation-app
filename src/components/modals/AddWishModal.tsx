
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
    title: z.string().trim().min(2, '标题至少需要2个字').max(60, '标题不超过60字'),
    category: z.enum(['career','health','relationship','wealth','personal','other'], { errorMap: () => ({ message: '请选择分类' }) }),
    affirmation: z.string().trim().min(10, '肯定句至少需要10个字').max(200, '肯定句不超过200字'),
  });

const categories = [
  { id: 'career', icon: Briefcase, name: '事业', color: 'bg-ios-blue' },
  { id: 'health', icon: Heart, name: '健康', color: 'bg-ios-green' },
  { id: 'relationship', icon: Smile, name: '感情', color: 'bg-ios-pink' },
  { id: 'wealth', icon: Target, name: '财富', color: 'bg-manifest-gold' },
  { id: 'personal', icon: HomeIcon, name: '个人成长', color: 'bg-ios-purple' }
];

const generateAffirmation = () => {
  // 简单的肯定句生成逻辑
  const templates = {
    career: '我正在吸引一份完美符合我技能和热情的工作，它带给我成就感和丰厚的回报。',
    health: '我的身体充满活力和健康，每一天我都感受到生命的美好和充沛的能量。',
    relationship: '我吸引着充满爱意和理解的关系，我们彼此支持，共同成长。',
    wealth: '财富以各种美好的方式流向我，我值得拥有丰盛和繁荣的生活。',
    personal: '我在持续成长并成为更好的自己，每一天都更有力量与清晰。'
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
    toast({ title: '请完善信息', description: '请检查标题、分类与肯定句的长度与完整性。' });
    return;
  }

  try {
    setSubmitting(true);
    await onAdd({ title: result.data.title, category: result.data.category as WishCategory, affirmation: result.data.affirmation });
    toast({ title: '创建成功', description: '愿望已创建并激活。' });

    // 重置表单
    setTitle('');
    setCategory('');
    setCustomAffirmation('');
    setGeneratedAffirmation('');
    setErrors({});
    setStep(1);
    onClose();
  } catch (e) {
    console.error('创建愿望失败:', e);
    toast({ title: '创建失败', description: '请稍后重试。', variant: 'destructive' });
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
          <h2 className="text-xl font-semibold text-gray-800">添加新愿望</h2>
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
    愿望标题
  </label>
  <Input
    value={title}
    onChange={(e) => {
      setTitle(e.target.value);
      if (errors.title) setErrors((prev) => ({ ...prev, title: undefined }));
    }}
    placeholder="例如：获得理想工作"
    className="rounded-ios border-ios-gray-medium"
  />
  {errors.title && (
    <p className="mt-1 text-sm text-destructive">{errors.title}</p>
  )}
</div>

<div>
  <label className="block text-sm font-medium text-gray-700 mb-3">
    选择分类
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

<Button
  onClick={() => {
    const result = schema.pick({ title: true, category: true }).safeParse({
      title: title.trim(),
      category: category || undefined,
    });
    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        if (i.path[0]) newErrors[i.path[0] as string] = i.message;
      });
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setStep(2);
  }}
  disabled={title.trim().length < 2 || !category}
  className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
>
  下一步
</Button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <Sparkles className="w-12 h-12 text-manifest-gold mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">生成肯定句</h3>
                <p className="text-gray-600">我们将为您的愿望生成积极的肯定句</p>
              </div>

              <div className="space-y-4">
                <Button
                  onClick={generateAffirmation}
                  className="w-full bg-manifest-gold hover:bg-manifest-warm-gold text-white rounded-ios py-3 font-medium"
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  AI生成肯定句
                </Button>

                <div className="text-center text-gray-500">或者</div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    自定义肯定句
                  </label>
                  <Textarea
                    value={customAffirmation}
                    onChange={(e) => setCustomAffirmation(e.target.value)}
                    placeholder="写下您的肯定句..."
                    className="rounded-ios border-ios-gray-medium min-h-[100px]"
                  />
                </div>

<Button
  onClick={() => setStep(3)}
  disabled={customAffirmation.trim().length < 10}
  variant="outline"
  className="w-full rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white font-medium py-3"
>
  使用自定义肯定句
</Button>
              </div>

              <Button
                onClick={() => setStep(1)}
                variant="ghost"
                className="w-full text-gray-600"
              >
                返回上一步
              </Button>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">确认您的愿望</h3>
                <div className="bg-gray-50 p-4 rounded-ios">
                  <div className="text-sm text-gray-600 mb-1">愿望标题</div>
                  <div className="font-medium text-gray-800 mb-3">{title}</div>
                  
                  <div className="text-sm text-gray-600 mb-1">肯定句</div>
                  <div className="text-gray-800 leading-relaxed">
                    {customAffirmation || generatedAffirmation}
                  </div>
                </div>
              </div>

              <div className="space-y-3">
<Button
  onClick={handleSubmit}
  disabled={submitting}
  className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
>
  {submitting ? '创建中…' : '创建愿望'}
</Button>
                
                <Button
                  onClick={() => setStep(2)}
                  variant="outline"
                  className="w-full rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white font-medium py-3"
                >
                  修改肯定句
                </Button>
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
               下一步
             </Button>
           )}

           {step === 2 && (
             <div className="flex items-center gap-3">
               <Button
                 onClick={() => setStep(3)}
                 disabled={!canProceedStep2}
                 className="flex-1 bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
               >
                 下一步
               </Button>
               <Button
                 onClick={() => setStep(1)}
                 variant="ghost"
                 className="flex-1 text-gray-700"
               >
                 返回上一步
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
                 {submitting ? '创建中…' : '创建愿望'}
               </Button>
               <Button
                 onClick={() => setStep(2)}
                 variant="outline"
                 className="flex-1 rounded-ios border-ios-blue text-ios-blue hover:bg-ios-blue hover:text-white font-medium py-3"
               >
                 修改肯定句
               </Button>
             </div>
           )}
         </div>
       </Card>
     </div>
  );
};
