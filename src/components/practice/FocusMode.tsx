
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { X, Play, Pause, RotateCcw } from 'lucide-react';
import { TimeSlot, Mood } from '@/types';

interface FocusModeProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (entries: string[], mood: Mood) => void;
  wish: {
    title: string;
    affirmation: string;
  };
  period: {
    title: string;
    target: number;
    color: string;
  };
}

export const FocusMode = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  wish, 
  period 
}: FocusModeProps) => {
  const [currentEntry, setCurrentEntry] = useState(0);
  const [entries, setEntries] = useState<string[]>([]);
  const [currentText, setCurrentText] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [timer, setTimer] = useState(0);
  const [mood, setMood] = useState<Mood>('neutral');
  const [showCompletion, setShowCompletion] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWriting && isOpen) {
      interval = setInterval(() => {
        setTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWriting, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setCurrentEntry(0);
      setEntries([]);
      setCurrentText('');
      setTimer(0);
      setIsWriting(false);
      setShowCompletion(false);
    }
  }, [isOpen]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartWriting = () => {
    setIsWriting(true);
  };

  const handlePauseWriting = () => {
    setIsWriting(false);
  };

  const handleCompleteEntry = () => {
    if (currentText.trim()) {
      const newEntries = [...entries, currentText.trim()];
      setEntries(newEntries);
      setCurrentText('');
      
      if (newEntries.length >= period.target) {
        setShowCompletion(true);
        setIsWriting(false);
      } else {
        setCurrentEntry(currentEntry + 1);
      }
    }
  };

  const handleFinalSubmit = () => {
    onComplete(entries, mood);
    onClose();
  };

  const handleReset = () => {
    setCurrentEntry(0);
    setEntries([]);
    setCurrentText('');
    setTimer(0);
    setIsWriting(false);
    setShowCompletion(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl bg-white rounded-ios shadow-2xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white p-6 border-b border-gray-100 rounded-t-ios">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">{period.title}</h2>
              <p className="text-sm text-gray-600">{wish.title}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="rounded-ios"
              >
                <RotateCcw className="w-4 h-4" />
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                size="sm"
                className="rounded-ios"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Progress */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">进度</span>
              <span className="font-medium">{entries.length} / {period.target}</span>
            </div>
            <Progress 
              value={(entries.length / period.target) * 100} 
              className="h-2"
            />
          </div>

          {/* Timer */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              <span className="text-2xl font-mono font-bold text-gray-800">
                {formatTime(timer)}
              </span>
              <Button
                onClick={isWriting ? handlePauseWriting : handleStartWriting}
                size="sm"
                className={`rounded-full w-8 h-8 p-0 ${period.color}`}
              >
                {isWriting ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </Button>
            </div>
            <div className="text-sm text-gray-500">
              第 {currentEntry + 1} 次书写
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {!showCompletion ? (
            <div className="space-y-6">
              {/* Affirmation Display */}
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 rounded-ios">
                <h3 className="text-sm font-medium text-gray-700 mb-2">肯定句</h3>
                <p className="text-lg text-gray-800 leading-relaxed font-medium">
                  {wish.affirmation}
                </p>
              </div>

              {/* Writing Area */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">
                  第 {currentEntry + 1} 次书写
                </label>
                <textarea
                  value={currentText}
                  onChange={(e) => setCurrentText(e.target.value)}
                  placeholder="专注地书写您的肯定句..."
                  className="w-full min-h-[200px] p-4 border border-gray-200 rounded-ios focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-lg leading-relaxed"
                  disabled={!isWriting}
                />
                
                <Button
                  onClick={handleCompleteEntry}
                  disabled={!currentText.trim() || !isWriting}
                  className={`w-full ${period.color} hover:opacity-90 rounded-ios py-3 disabled:opacity-50`}
                >
                  完成第 {currentEntry + 1} 次书写
                </Button>
              </div>

              {/* Previous Entries */}
              {entries.length > 0 && (
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-gray-700">已完成的书写</h4>
                  <div className="space-y-2">
                    {entries.map((entry, index) => (
                      <div key={index} className="bg-green-50 p-3 rounded-ios border border-green-200">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-green-600 font-medium">第 {index + 1} 次</span>
                          <span className="text-xs text-green-600">✓ 已完成</span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">{entry}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Completion Screen */
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                <div className="text-4xl">🎉</div>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">恭喜完成！</h3>
                <p className="text-gray-600">
                  您已经完成了 {period.target} 次 {period.title}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  总用时：{formatTime(timer)}
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    练习后的心情状态
                  </label>
                  <select
                    value={mood}
                    onChange={(e) => setMood(e.target.value as Mood)}
                    className="w-full p-3 border border-gray-200 rounded-ios focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="excellent">非常好 😊</option>
                    <option value="good">好 😌</option>
                    <option value="neutral">中性 😐</option>
                    <option value="poor">不好 😔</option>
                  </select>
                </div>

                <Button
                  onClick={handleFinalSubmit}
                  className={`w-full ${period.color} hover:opacity-90 rounded-ios py-3`}
                >
                  保存练习记录
                </Button>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};
