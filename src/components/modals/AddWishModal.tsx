
import { useState } from 'react';
import { X, Briefcase, Heart, Smile, Target, Home as HomeIcon, Sparkles } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface AddWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (wish: any) => void;
}

export const AddWishModal = ({ isOpen, onClose, onAdd }: AddWishModalProps) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [customAffirmation, setCustomAffirmation] = useState('');
  const [generatedAffirmation, setGeneratedAffirmation] = useState('');
  const [step, setStep] = useState(1);

  const categories = [
    { id: 'career', icon: Briefcase, name: '事业', color: 'bg-ios-blue' },
    { id: 'health', icon: Heart, name: '健康', color: 'bg-ios-green' },
    { id: 'relationship', icon: Smile, name: '感情', color: 'bg-ios-pink' },
    { id: 'wealth', icon: Target, name: '财富', color: 'bg-manifest-gold' },
    { id: 'home', icon: HomeIcon, name: '家庭', color: 'bg-ios-purple' }
  ];

  const generateAffirmation = () => {
    // 简单的肯定句生成逻辑
    const templates = {
      career: '我正在吸引一份完美符合我技能和热情的工作，它带给我成就感和丰厚的回报。',
      health: '我的身体充满活力和健康，每一天我都感受到生命的美好和充沛的能量。',
      relationship: '我吸引着充满爱意和理解的关系，我们彼此支持，共同成长。',
      wealth: '财富以各种美好的方式流向我，我值得拥有丰盛和繁荣的生活。',
      home: '我拥有一个充满爱、和谐与平静的家，这里是我和家人的温暖港湾。'
    };

    const baseTemplate = templates[category as keyof typeof templates];
    setGeneratedAffirmation(baseTemplate);
    setStep(3);
  };

  const handleSubmit = () => {
    const finalAffirmation = customAffirmation || generatedAffirmation;
    
    onAdd({
      title,
      category,
      affirmation: finalAffirmation
    });

    // 重置表单
    setTitle('');
    setCategory('');
    setCustomAffirmation('');
    setGeneratedAffirmation('');
    setStep(1);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-md bg-white rounded-ios max-h-[80vh] overflow-hidden">
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

        <div className="p-6 overflow-y-auto">
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  愿望标题
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="例如：获得理想工作"
                  className="rounded-ios border-ios-gray-medium"
                />
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
                        onClick={() => setCategory(cat.id)}
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
              </div>

              <Button
                onClick={() => setStep(2)}
                disabled={!title || !category}
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
                  disabled={!customAffirmation}
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
                  className="w-full bg-ios-blue hover:bg-ios-blue/90 text-white rounded-ios py-3 font-medium"
                >
                  创建愿望
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
      </Card>
    </div>
  );
};
