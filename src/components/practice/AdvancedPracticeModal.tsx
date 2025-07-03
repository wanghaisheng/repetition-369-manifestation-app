import React, { useState } from 'react';
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
        title: '开始练习',
        description: `${selectedMode.name} 练习已开始`
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
          title: '阶段完成',
          description: `开始 ${nextPhase.name}`
        });
      }
    }

    // Reset writing state for next phase
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
      title: '练习完成！',
      description: `恭喜完成 ${activeSession.mode.name}`
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

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return '初级';
      case 'intermediate': return '中级';
      case 'advanced': return '高级';
      default: return '未知';
    }
  };

  if (!isOpen) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {activeSession ? '进行中的练习' : '选择练习模式'}
          </DialogTitle>
        </DialogHeader>

        {/* Mode Selection */}
        {!activeSession && (
          <div className="space-y-4">
            {!selectedMode ? (
              <>
                <p className="text-gray-600 mb-4">选择适合您的高级练习模式</p>
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
                              {getDifficultyText(mode.difficulty)}
                            </span>
                          </div>
                          <p className="text-gray-600 text-sm mb-3">{mode.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-4 h-4" />
                              <span>{mode.duration}分钟</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Target className="w-4 h-4" />
                              <span>{mode.phases.length}个阶段</span>
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
                    ← 返回
                  </Button>
                  <span className="text-2xl">{selectedMode.icon}</span>
                  <h3 className="text-xl font-semibold text-gray-800">{selectedMode.name}</h3>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-800 mb-2">练习益处：</h4>
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
                  <h4 className="font-medium text-gray-800 mb-2">练习阶段：</h4>
                  <div className="space-y-2">
                    {selectedMode.phases.map((phase, index) => (
                      <div key={phase.id} className="flex items-center space-x-3 text-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-200 text-blue-800 flex items-center justify-center font-medium">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{phase.name}</span>
                          <span className="text-gray-500 ml-2">({Math.round(phase.duration / 60)}分钟)</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Button onClick={handleStartSession} className="w-full">
                  <Play className="w-4 h-4 mr-2" />
                  开始练习
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
                  <span className="text-sm font-medium text-gray-700">总进度</span>
                  <span className="text-sm text-gray-600">{Math.round(sessionProgress)}%</span>
                </div>
                <Progress value={sessionProgress} className="h-2" />
              </div>
              
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-gray-700">当前阶段: {currentPhase.name}</span>
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
                  <h4 className="font-medium text-blue-800 mb-2">练习指导：</h4>
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
                      进度: {writingCount} / {currentPhase.repetitions}
                    </div>
                  )}
                  
                  <textarea
                    value={writingInput}
                    onChange={(e) => setWritingInput(e.target.value)}
                    placeholder="在这里书写您的愿望..."
                    className="w-full h-32 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  
                  <div className="flex space-x-2">
                    <Button 
                      onClick={handleWritingSubmit}
                      disabled={!writingInput.trim()}
                      className="flex-1"
                    >
                      提交 ({writingCount + 1}/{currentPhase.repetitions || '∞'})
                    </Button>
                  </div>
                </div>
              )}

              {/* Other Phase Types */}
              {currentPhase.type !== 'writing' && (
                <div className="text-center py-8">
                  <p className="text-gray-600 mb-4">
                    请按照指导进行{currentPhase.type === 'meditation' ? '冥想' : 
                      currentPhase.type === 'breathing' ? '呼吸练习' : '可视化练习'}
                  </p>
                  <Button onClick={handlePhaseComplete}>
                    <SkipForward className="w-4 h-4 mr-2" />
                    完成此阶段
                  </Button>
                </div>
              )}
            </Card>

            {/* Controls */}
            <div className="flex justify-between items-center">
              <Button variant="outline" onClick={handleReset}>
                退出练习
              </Button>
              
              <div className="text-sm text-gray-500">
                阶段 {activeSession.currentPhase + 1} / {activeSession.mode.phases.length}
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
