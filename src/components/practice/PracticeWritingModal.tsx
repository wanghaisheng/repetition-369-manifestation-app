
import { m } from '@/paraglide/messages';
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
        <h4 className="font-semibold text-gray-800 mb-2">{m.app_practiceWritingModal_currentAffirmation()}</h4>
        <div className="bg-gray-50 p-4 rounded-ios">
          <p className="text-gray-700 leading-relaxed">{currentAffirmation}</p>
        </div>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {m.app_practiceWritingModal_writingArea()} ({currentProgress.completed + 1} / {currentProgress.target})
        </label>
        <Textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder={m.app_practiceWritingModal_placeholder()}
          className="rounded-ios border-ios-gray-medium min-h-[120px] text-lg leading-relaxed"
          autoFocus
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">{m.app_practiceWritingModal_moodStatus()}</label>
        <select
          value={currentMood}
          onChange={(e) => setCurrentMood(e.target.value as Mood)}
          className="w-full p-3 border border-gray-200 rounded-ios focus:ring-2 focus:ring-ios-blue focus:border-transparent"
        >
          <option value="excellent">{m.app_writingInterface_moods_excellent()}</option>
          <option value="good">{m.app_writingInterface_moods_good()}</option>
          <option value="neutral">{m.app_writingInterface_moods_neutral()}</option>
          <option value="poor">{m.app_writingInterface_moods_poor()}</option>
        </select>
      </div>

      <div className="flex space-x-3">
        <Button
          onClick={handleSubmit}
          disabled={!currentText.trim()}
          className={`flex-1 bg-gradient-to-r ${periodColor} hover:opacity-90 rounded-ios py-3 disabled:opacity-50`}
        >
          {m.app_practiceWritingModal_completeWriting()}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 rounded-ios border-gray-300"
        >
          {m.app_practiceWritingModal_cancel()}
        </Button>
      </div>
    </Card>
  );
};