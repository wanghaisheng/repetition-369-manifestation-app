import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WelcomeHeroProps {
  onCreateWish: () => void;
}

export const WelcomeHero = ({ onCreateWish }: WelcomeHeroProps) => {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[hsl(var(--manifest-glow)/0.15)] via-background to-[hsl(var(--manifest-aura)/0.1)] p-6 mb-6">
      {/* Decorative elements */}
      <div className="absolute top-4 right-4 w-20 h-20 rounded-full bg-gradient-to-br from-[hsl(var(--manifest-glow)/0.3)] to-transparent blur-2xl" />
      <div className="absolute bottom-4 left-4 w-16 h-16 rounded-full bg-gradient-to-tr from-[hsl(var(--manifest-aura)/0.2)] to-transparent blur-xl" />
      
      <div className="relative z-10">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 mb-4">
          <Sparkles className="w-7 h-7 text-primary" />
        </div>
        
        {/* Content */}
        <h1 className="text-2xl font-bold text-foreground mb-2">
          开启显化之旅
        </h1>
        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
          每天书写3次、6次、9次，用专注的意念将愿望注入宇宙能量场
        </p>
        
        {/* CTA */}
        <Button 
          onClick={onCreateWish}
          className="group bg-foreground hover:bg-foreground/90 text-background rounded-xl px-5 py-2.5 h-auto font-medium shadow-lg shadow-foreground/10"
        >
          创建第一个愿望
          <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </div>
    </div>
  );
};
