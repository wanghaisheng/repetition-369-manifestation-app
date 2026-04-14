
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
    { value: 'excellent' as Mood, label: t('writingInterface.moods.excellent'), emoji: '😊', color: 'text-storybook-sage' },
    { value: 'good' as Mood, label: t('writingInterface.moods.good'), emoji: '🙂', color: 'text-storybook-honey' },
    { value: 'neutral' as Mood, label: t('writingInterface.moods.neutral'), emoji: '😐', color: 'text-muted-foreground' },
    { value: 'poor' as Mood, label: t('writingInterface.moods.poor'), emoji: '😔', color: 'text-storybook-coral' },
  ];

  const handleSubmit = () => {
    if (currentText.trim()) {
      onSubmit(currentText.trim(), selectedMood);
      setCurrentText('');
    }
  };

  return (
    <Card className="p-6 bg-card border-0 shadow-storybook rounded-storybook-lg">
      <div className="text-center mb-6">
        <div className="w-12 h-12 bg-storybook-honey/20 rounded-full flex items-center justify-center mx-auto mb-3">
          <Heart className="w-6 h-6 text-storybook-honey" />
        </div>
        <h3 className="text-lg font-storybook font-semibold text-foreground mb-1">{t('writingInterface.focusWriting')}</h3>
        <p className="text-sm text-muted-foreground">
          {t('writingInterface.round')} {currentCount + 1} / {targetCount}
        </p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-3">
          {t('writingInterface.currentAffirmation')}
        </label>
        <div className="bg-gradient-to-r from-storybook-honey/10 to-storybook-coral/10 p-4 rounded-storybook border border-storybook-honey/20">
          <p className="text-foreground leading-relaxed text-center font-medium">{affirmation}</p>
        </div>
        <p className="text-xs text-muted-foreground mt-2 text-center">{t('writingInterface.tip')}</p>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-3">{t('writingInterface.writingArea')}</label>
        <Textarea value={currentText} onChange={(e) => setCurrentText(e.target.value)}
          placeholder={t('writingInterface.placeholder')}
          className="rounded-storybook border-border min-h-[120px] text-base leading-relaxed resize-none"
          autoFocus />
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-muted-foreground">{currentText.length} {t('writingInterface.characters')}</span>
          {currentText.toLowerCase().includes(affirmation.toLowerCase()) && (
            <div className="flex items-center text-storybook-sage text-xs">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {t('writingInterface.containsAffirmation')}
            </div>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-muted-foreground mb-3">{t('writingInterface.currentMood')}</label>
        <div className="grid grid-cols-2 gap-3">
          {moodOptions.map((mood) => (
            <button key={mood.value} onClick={() => setSelectedMood(mood.value)}
              className={`p-3 rounded-storybook border-2 transition-all ${
                selectedMood === mood.value
                  ? 'border-storybook-honey bg-storybook-honey/10'
                  : 'border-border hover:border-storybook-honey/30'
              }`}>
              <div className="text-center">
                <div className="text-2xl mb-1">{mood.emoji}</div>
                <div className={`text-sm font-medium ${selectedMood === mood.value ? 'text-storybook-honey' : 'text-muted-foreground'}`}>
                  {mood.label}
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <Button onClick={handleSubmit} disabled={!currentText.trim()}
          className="flex-1 bg-gradient-to-r from-storybook-honey to-storybook-coral text-white hover:opacity-90 rounded-storybook py-3 disabled:opacity-50">
          <CheckCircle2 className="w-4 h-4 mr-2" />
          {t('writingInterface.completeWriting')}
        </Button>
        <Button onClick={onCancel} variant="outline" className="px-6 rounded-storybook border-border text-muted-foreground hover:bg-muted">
          {t('writingInterface.cancel')}
        </Button>
      </div>

      <div className="mt-4 p-3 bg-storybook-cream/50 rounded-storybook">
        <p className="text-xs text-muted-foreground text-center">{t('writingInterface.bottomTip')}</p>
      </div>
    </Card>
  );
};
