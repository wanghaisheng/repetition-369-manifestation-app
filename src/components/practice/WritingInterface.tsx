
import { useState } from 'react';
import { CheckCircle2, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Mood } from '@/types';

interface WritingInterfaceProps {
  affirmation: string;
  currentCount: number;
  targetCount: number;
  onSubmit: (text: string, mood: Mood) => void;
  onCancel: () => void;
}

export const WritingInterface = ({
  affirmation,
  currentCount,
  targetCount,
  onSubmit,
  onCancel
}: WritingInterfaceProps) => {
  const [currentText, setCurrentText] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('good');

  const moodOptions = [
    { value: 'excellent' as Mood, label: '非常好', emoji: '😊', color: 'text-ios-green' },
    { value: 'good' as Mood, label: '好', emoji: '🙂', color: 'text-ios-blue' },
    { value: 'neutral' as Mood, label: '中性', emoji: '😐', color: 'text-gray-500' },
    { value: 'poor' as Mood, label: '不好', emoji: '😔', color: 'text-ios-orange' },
  ];

  const handleSubmit = () => {
    if (currentText.trim()) {
      onSubmit(currentText.trim(), selectedMood);
      setCurrentText('');
    }
  };

  return (
    <Card className="p-6 bg-white border-0 shadow-ios rounded-ios">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-manifest-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 text-manifest-gold" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-1">专注书写</h3>
        <p className="text-sm text-gray-600">
          第 {currentCount + 1} / {targetCount} 次
        </p>
      </div>

      {/* 肯定句显示 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          当前肯定句
        </label>
        <div className="bg-gradient-to-r from-manifest-warm-gold/10 to-manifest-lavender/10 p-4 rounded-ios border border-manifest-warm-gold/20">
          <p className="text-gray-700 leading-relaxed text-center font-medium">
            {affirmation}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          💡 请用心书写这句话，感受它带来的正能量
        </p>
      </div>

      {/* 书写区域 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          书写区域
        </label>
        <Textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="请在这里重复书写上面的肯定句..."
          className="rounded-ios border-ios-gray-medium min-h-[120px] text-base leading-relaxed resize-none"
          autoFocus
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {currentText.length} 个字符
          </span>
          {currentText.toLowerCase().includes(affirmation.toLowerCase()) && (
            <div className="flex items-center text-ios-green text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              包含肯定句
            </div>
          )}
        </div>
      </div>

      {/* 心情选择 */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          当前心情
        </label>
        <div className="grid grid-cols-2 gap-3">
          {moodOptions.map((mood) => (
            <button
              key={mood.value}
              onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-ios border-2 transition-all ${
                selectedMood === mood.value
                  ? 'border-ios-blue bg-ios-blue/10'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className={`text-sm font-medium ${
                  selectedMood === mood.value ? 'text-ios-blue' : 'text-gray-600'
                }`}>
                  {mood.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex space-x-3">
        <Button
          onClick={handleSubmit}
          disabled={!currentText.trim()}
          className="flex-1 bg-gradient-to-r from-manifest-warm-gold to-manifest-gold hover:opacity-90 rounded-ios py-3 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          完成这次书写
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 rounded-ios border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          取消
        </Button>
      </div>

      {/* 温馨提示 */}
      <div className="mt-4 p-3 bg-manifest-lavender/10 rounded-ios">
        <p className="text-xs text-gray-600 text-center">
          🌟 书写时请保持专注和感恩的心态，相信您的愿望正在显化
        </p>
      </div>
    </Card>
  );
};
