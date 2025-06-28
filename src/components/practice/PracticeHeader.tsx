
import React from 'react';
import { Sparkles } from 'lucide-react';

interface PracticeHeaderProps {
  title: string;
  subtitle: string;
}

export const PracticeHeader = ({ title, subtitle }: PracticeHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <div className="flex items-center justify-center mb-3">
        <div className="w-12 h-12 bg-gradient-to-br from-manifest-warm-gold to-manifest-lavender rounded-ios flex items-center justify-center mr-3">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
      </div>
      <p className="text-gray-600">{subtitle}</p>
    </div>
  );
};
