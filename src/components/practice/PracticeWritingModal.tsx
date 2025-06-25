
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Mood } from '@/types';

interface PracticeWritingModalProps {
  isOpen: boolean;
  currentAffirmation: string;
  currentProgress: {
    completed: number;
    target: number;
  };
  periodColor: string;
  onSubmit: (text: string, mood: Mood) => void;
  onCancel: () => void;
}

export const PracticeWritingModal = ({
  isOpen,
  currentAffirmation,
  currentProgress,
  periodColor,
  onSubmit,
  onCancel
}: PracticeWritingModalProps) => {
  const [currentText, setCurrentText] = useState('');
  const [currentMood, setCurrentMood] = useState<Mood>('neutral');

  if (!isOpen) return null;

  const handleSubmit = () => {
    if (currentText.trim()) {
      onSubmit(currentText.trim(), currentMood);
      setCurrentText('');
    }
  };

  return (
    <Card className="mb-6 p-6 bg-white border-0 shadow-ios rounded-ios">
      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">当前肯定句</h4>
        <div className="bg-gray-50 p-4 rounded-ios">
          <p className="text-gray-700 leading-relaxed">{currentAffirmation}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          书写区域 ({currentProgress.completed + 1} / {currentProgress.target})
        </label>
        <Textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder="在这里书写您的肯定句..."
          className="rounded-ios border-ios-gray-medium min-h-[120px] text-lg leading-relaxed"
          autoFocus
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">心情状态</label>
        <select
          value={currentMood}
          onChange={(e) => setCurrentMood(e.target.value as Mood)}
          className="w-full p-3 border border-gray-200 rounded-ios focus:ring-2 focus:ring-ios-blue focus:border-transparent"
        >
          <option value="excellent">非常好</option>
          <option value="good">好</option>
          <option value="neutral">中性</option>
          <option value="poor">不好</option>
        </select>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={handleSubmit}
          disabled={!currentText.trim()}
          className={`flex-1 bg-gradient-to-r ${periodColor} hover:opacity-90 rounded-ios py-3 disabled:opacity-50`}
        >
          完成这次书写
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 rounded-ios border-gray-300"
        >
          取消
        </Button>
      </div>
    </Card>
  );
};
