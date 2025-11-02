import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Clock, Star, Target, ArrowRight, Play, Pause, SkipForward } from 'lucide-react';
import { PracticeModeService, PracticeMode, ActiveSession, PracticePhase } from '@/services/PracticeModeService';
import { useToast } from '@/hooks/use-toast';

interface AdvancedPracticeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete?: (results: any) => void;
}

export const AdvancedPracticeModal = ({ isOpen, onClose, onComplete }: AdvancedPracticeModalProps) => {
  const { toast } = useToast();
  const { t } = useTranslation('app');
  const [selectedMode, setSelectedMode] = useState<PracticeMode | null>(null);
  const [activeSession, setActiveSession] = useState<ActiveSession | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [writingInput, setWritingInput] = useState('');
  const [writingCount, setWritingCount] = useState(0);

  const modes = PracticeModeService.getAllModes();

  const handleModeSelect = (mode: PracticeMode) => {
    setSelectedMode(mode);
  };

  const handleStartSession = () => {
    if (!selectedMode) return;
    
    const session = PracticeModeService.createSession(selectedMode.id);
    if (session) {
      setActiveSession(session);
      toast({
        title: t('advancedPractice.practiceStarted'),
        description: `${selectedMode.name} ${t('advancedPractice.practiceStarted')}`
      });
    }
  };

  const handlePhaseComplete = () => {
    if (!activeSession) return;

    const updatedSession = PracticeModeService.advancePhase(activeSession);
    setActiveSession(updatedSession);

    if (updatedSession.completed) {
      handleSessionComplete();
    } else {
      const nextPhase = PracticeModeService.getCurrentPhase(updatedSession);
      if (nextPhase) {
        toast({
          title: t('advancedPractice.phaseComplete'),
          description: `${t('advancedPractice.startPractice')} ${nextPhase.name}`
        });
      }
    }

    setWritingInput('');
    setWritingCount(0);
  };

  const handleSessionComplete = () => {
    if (!activeSession) return;

    const results = {
      totalDuration: PracticeModeService.getSessionDuration(activeSession),
      completedPhases: activeSession.mode.phases.length,
      writingCount: writingCount,
      mood: 'good' as const,
      notes: ''
    };

    const completedSession = PracticeModeService.completeSession(activeSession, results);
    
    toast({
      title: t('advancedPractice.practiceComplete'),
      description: `${t('advancedPractice.congratulations')} ${activeSession.mode.name}`
    });

    onComplete?.(results);
    handleReset();
  };

  const handleReset = () => {
    setSelectedMode(null);
    setActiveSession(null);
    setIsPaused(false);
    setWritingInput('');
    setWritingCount(0);
  };

  const handleWritingSubmit = () => {
    if (!writingInput.trim()) return;
    
    setWritingCount(prev => prev + 1);
    setWritingInput('');
    
    const currentPhase = activeSession ? PracticeModeService.getCurrentPhase(activeSession) : null;
    if (currentPhase && currentPhase.repetitions && writingCount + 1 >= currentPhase.repetitions) {
      setTimeout(handlePhaseComplete, 500);
    }
  };

  const currentPhase = activeSession ? PracticeModeService.getCurrentPhase(activeSession) : null;
  const sessionProgress = activeSession ? PracticeModeService.getSessionProgress(activeSession) : 0;
  const phaseProgress = activeSession ? PracticeModeService.getPhaseProgress(activeSession) : 0;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-600 bg-green-100';
      case 'intermediate': return 'text-yellow-600 bg-yellow-100';
      case 'advanced': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activeSession ? t('advancedPractice.inProgress') : t('advancedPractice.selectMode')}
          </DialogTitle>
        </DialogHeader>

        {/* Mode Selection */}
        {!activeSession && (
          <div className="space-y-4">
            {!selectedMode ? (
              <>
                <p className="text-gray-600 mb-4">{t('advancedPractice.selectModeDesc')}</p>
                <div className="grid gap-4">
                  {modes.map((mode) => (
                    <Card 
                      key={mode.id}
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => handleModeSelect(mode)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <span className="text-2xl">{mode.icon}</span>
                            <h3 className="font-semibold text-gray-800">{mode.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(mode.difficulty)}`}>
                              {t(`advancedPractice.${mode.difficulty}`)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{mode.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{mode.duration}{t('advancedPractice.duration')}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{mode.phases.length}{t('advancedPractice.stages')}</span>
                            </div>
                          </div>
                        </div>
                        <ArrowRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </Card>
                  ))}
                </div>
              </>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Button variant="outline" onClick={() => setSelectedMode(null)}>
                    ← {t('advancedPractice.back')}
                  </Button>
                  <span className="text-2xl">{selectedMode.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedMode.name}</h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{t('advancedPractice.benefits')}</h4>
                  <ul className="space-y-1">
                    {selectedMode.benefits.map((benefit, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                        <Star className="w-3 h-3 text-yellow-500" />
                        <span>{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">{t('advancedPractice.phases')}</h4>
                  <div className="space-y-2">
                    {selectedMode.phases.map((phase, index) => (
                      <div key={phase.id} className="flex items-center space-x-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{phase.name}</span>
                          <span className="text-gray-500 ml-2">({Math.round(phase.duration / 60)}{t('advancedPractice.duration')})</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleStartSession} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  {t('advancedPractice.startPractice')}
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Active Session */}
        {activeSession && currentPhase && (
          <div className="space-y-6">
            {/* Progress */}
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('advancedPractice.totalProgress')}</span>
                  <span className="text-sm text-gray-600">{Math.round(sessionProgress)}%</span>
                </div>
                <Progress value={sessionProgress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">{t('advancedPractice.currentPhase')}: {currentPhase.name}</span>
                  <span className="text-sm text-gray-600">{Math.round(phaseProgress)}%</span>
                </div>
                <Progress value={phaseProgress} className="h-2" />
              </div>
            </div>

            {/* Current Phase */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">{currentPhase.name}</h3>
              <p className="text-gray-600 mb-4">{currentPhase.instruction}</p>

              {/* Guidance */}
              {currentPhase.guidance && (
                <div className="bg-blue-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-blue-800 mb-2">{t('advancedPractice.practiceGuidance')}</h4>
                  <ul className="space-y-1">
                    {currentPhase.guidance.map((guide, index) => (
                      <li key={index} className="text-sm text-blue-700 flex items-start space-x-2">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Writing Interface */}
              {currentPhase.type === 'writing' && (
                <div className="space-y-4">
                  {currentPhase.repetitions && (
                    <div className="text-sm text-gray-600">
                      {t('advancedPractice.progress')}: {writingCount} / {currentPhase.repetitions}
                    </div>
                  )}
                  
                  <textarea
                    value={writingInput}
                    onChange={(e) => setWritingInput(e.target.value)}
                    placeholder={t('advancedPractice.writePlaceholder')}
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleWritingSubmit}
                      disabled={!writingInput.trim()}
                      className="flex-1"
                    >
                      {t('advancedPractice.submit')} ({writingCount + 1}/{currentPhase.repetitions || '∞'})
                    </Button>
                  </div>
                </div>
              )}

              {/* Other Phase Types */}
              {currentPhase.type !== 'writing' && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    {t('advancedPractice.followGuidance')}{currentPhase.type === 'meditation' ? t('advancedPractice.meditation') : 
                      currentPhase.type === 'breathing' ? t('advancedPractice.breathing') : t('advancedPractice.visualization')}
                  </p>
                  <Button onClick={handlePhaseComplete}>
                    <SkipForward className="w-4 h-4 mr-2" />
                    {t('advancedPractice.completePhase')}
                  </Button>
                </div>
              )}
            </Card>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleReset}>
                {t('advancedPractice.exitPractice')}
              </Button>
              
              <div className="text-sm text-gray-500">
                {t('advancedPractice.phase')} {activeSession.currentPhase + 1} / {activeSession.mode.phases.length}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
