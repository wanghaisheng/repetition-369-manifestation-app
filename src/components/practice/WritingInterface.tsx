
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation('app');
  const [currentText, setCurrentText] = useState('');
  const [selectedMood, setSelectedMood] = useState<Mood>('good');

  const moodOptions = [
    { value: 'excellent' as Mood, label: t('writingInterface.moods.excellent'), emoji: '😊', color: 'text-ios-green' },
    { value: 'good' as Mood, label: t('writingInterface.moods.good'), emoji: '🙂', color: 'text-ios-blue' },
    { value: 'neutral' as Mood, label: t('writingInterface.moods.neutral'), emoji: '😐', color: 'text-gray-500' },
    { value: 'poor' as Mood, label: t('writingInterface.moods.poor'), emoji: '😔', color: 'text-ios-orange' },
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
        <h3 className="text-lg font-semibold text-gray-800 mb-1">{t('writingInterface.focusWriting')}</h3>
        <p className="text-sm text-gray-600">
          {t('writingInterface.round').replace('次', '')} {currentCount + 1} / {targetCount} {t('writingInterface.round')}
        </p>
      </div>

      {/* Current Affirmation */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('writingInterface.currentAffirmation')}
        </label>
        <div className="bg-gradient-to-r from-manifest-warm-gold/10 to-manifest-lavender/10 p-4 rounded-ios border border-manifest-warm-gold/20">
          <p className="text-gray-700 leading-relaxed text-center font-medium">
            {affirmation}
          </p>
        </div>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {t('writingInterface.tip')}
        </p>
      </div>

      {/* Writing Area */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('writingInterface.writingArea')}
        </label>
        <Textarea
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          placeholder={t('writingInterface.placeholder')}
          className="rounded-ios border-ios-gray-medium min-h-[120px] text-base leading-relaxed resize-none"
          autoFocus
        />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500">
            {currentText.length} {t('writingInterface.characters')}
          </span>
          {currentText.toLowerCase().includes(affirmation.toLowerCase()) && (
            <div className="flex items-center text-ios-green text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t('writingInterface.containsAffirmation')}
            </div>
          )}
        </div>
      </div>

      {/* Mood Selection */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          {t('writingInterface.currentMood')}
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

      {/* Action Buttons */}
      <div className="flex space-x-3">
        <Button
          onClick={handleSubmit}
          disabled={!currentText.trim()}
          className="flex-1 bg-gradient-to-r from-manifest-warm-gold to-manifest-gold hover:opacity-90 rounded-ios py-3 disabled:opacity-50"
        >
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {t('writingInterface.completeWriting')}
        </Button>
        <Button
          onClick={onCancel}
          variant="outline"
          className="px-6 rounded-ios border-gray-300 text-gray-600 hover:bg-gray-50"
        >
          {t('writingInterface.cancel')}
        </Button>
      </div>

      {/* Tips */}
      <div className="mt-4 p-3 bg-manifest-lavender/10 rounded-ios">
        <p className="text-xs text-gray-600 text-center">
          {t('writingInterface.bottomTip')}
        </p>
      </div>
    </Card>
  );
};