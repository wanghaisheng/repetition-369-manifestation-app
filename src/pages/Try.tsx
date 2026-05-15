import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { Sparkles, ArrowRight, ArrowLeft, Heart, Briefcase, Coins, Activity, Star, Pencil, LayoutGrid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ImmersiveFocusMode } from '@/components/practice/ImmersiveFocusMode';
import { Wish, WishCategory, Mood, TimeSlot } from '@/types';
import { cn } from '@/lib/utils';
import {
  TRY_STORAGE_KEY,
  TrialSlotResult,
  readTrialDraft,
  writeTrialDraft,
  clearTrialDraft,
} from '@/utils/trialStorage';
import { trialAnalytics } from '@/utils/trialAnalytics';

type Step = 'category' | 'affirmation' | 'practice' | 'celebrate';

const SLOT_SEQUENCE: { slot: TimeSlot; target: number }[] = [
  { slot: 'morning', target: 3 },
  { slot: 'afternoon', target: 6 },
  { slot: 'evening', target: 9 },
];

const categoryIcons: Record<string, any> = {
  career: Briefcase,
  wealth: Coins,
  relationship: Heart,
  health: Activity,
};

const categoryGradients: Record<string, string> = {
  career: 'from-storybook-honey to-storybook-coral',
  wealth: 'from-storybook-honey to-storybook-sage',
  relationship: 'from-storybook-coral to-storybook-blush',
  health: 'from-storybook-sage to-storybook-honey',
};

export default function Try() {
  const { t } = useTranslation('landing');
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('category');
  const [category, setCategory] = useState<WishCategory | null>(null);
  const [affirmation, setAffirmation] = useState('');
  const [editing, setEditing] = useState(false);
  const [completedSlots, setCompletedSlots] = useState<TrialSlotResult[]>([]);
  const [resumeDraft, setResumeDraft] = useState<{ slot: string; entries: string[]; currentEntry: string } | null>(null);
  const [activeSlotIdx, setActiveSlotIdx] = useState(0);

  const categories: { key: WishCategory; label: string; desc: string }[] = [
    { key: 'career', label: t('try.cat.career.label'), desc: t('try.cat.career.desc') },
    { key: 'wealth', label: t('try.cat.wealth.label'), desc: t('try.cat.wealth.desc') },
    { key: 'relationship', label: t('try.cat.relationship.label'), desc: t('try.cat.relationship.desc') },
    { key: 'health', label: t('try.cat.health.label'), desc: t('try.cat.health.desc') },
  ];

  const getSuggestions = (cat: WishCategory): string[] => {
    const list = t(`try.suggestions.${cat}`, { returnObjects: true }) as unknown;
    return Array.isArray(list) ? (list as string[]) : [];
  };

  const persist = (slots: TrialSlotResult[]) => {
    try {
      localStorage.setItem(
        TRY_STORAGE_KEY,
        JSON.stringify({
          completedAt: new Date().toISOString(),
          category,
          affirmation,
          slots,
        })
      );
    } catch {
      // localStorage may be disabled
    }
  };

  // Funnel: page view (once on mount)
  useEffect(() => {
    trialAnalytics.view();
  }, []);

  // Restore in-progress draft (close/refresh resume)
  useEffect(() => {
    const draft = readTrialDraft();
    if (!draft) return;
    setCategory(draft.category);
    setAffirmation(draft.affirmation);
    setCompletedSlots(draft.completedSlots || []);
    setActiveSlotIdx(draft.activeSlotIdx ?? 0);
    setResumeDraft({
      slot: draft.currentSlot,
      entries: draft.entries || [],
      currentEntry: draft.currentEntry || '',
    });
    setStep('practice');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const suggestionSet = useMemo(
    () => (category ? new Set(getSuggestions(category)) : new Set<string>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [category]
  );

  const handlePickCategory = (c: WishCategory) => {
    setCategory(c);
    trialAnalytics.selectCategory(c);
    setStep('affirmation');
  };

  const handlePickAffirmation = (text: string) => {
    setAffirmation(text);
    trialAnalytics.selectAffirmation('suggestion', text.length);
  };

  const handleStartPractice = () => {
    if (!affirmation.trim()) return;
    if (editing) {
      // user wrote a custom one before starting
      trialAnalytics.selectAffirmation(
        suggestionSet.has(affirmation) ? 'suggestion' : 'custom',
        affirmation.length
      );
    }
    setActiveSlotIdx(0);
    trialAnalytics.startPractice(SLOT_SEQUENCE[0].slot, SLOT_SEQUENCE[0].target, 0);
    setStep('practice');
  };

  const trialWish: Wish = {
    id: 'trial-wish',
    userId: 'trial',
    title: category ? t(`try.cat.${category}.label`) : '',
    description: '',
    category: category || 'personal',
    status: 'active',
    priority: 'medium',
    affirmation,
    createdAt: new Date(),
    updatedAt: new Date(),
    tags: [],
  };

  const currentSlotConfig = SLOT_SEQUENCE[activeSlotIdx];
  const nextSlotConfig = SLOT_SEQUENCE[completedSlots.length];

  const handleComplete = async (entries: string[], mood: Mood) => {
    const result: TrialSlotResult = {
      slot: currentSlotConfig.slot,
      target: currentSlotConfig.target,
      entries,
      mood,
      completedAt: new Date().toISOString(),
    };
    const updated = [...completedSlots, result];
    setCompletedSlots(updated);
    persist(updated);
    trialAnalytics.completeSlot(result.slot, entries.length, result.target, mood);
    clearTrialDraft();
    setStep('celebrate');
  };

  // Persist mid-practice draft (entries + currentEntry) for refresh/close resume
  const handlePracticeProgress = (entries: string[], currentEntry: string) => {
    if (!category || !affirmation || !currentSlotConfig) return;
    writeTrialDraft({
      category,
      affirmation,
      completedSlots,
      activeSlotIdx,
      currentSlot: currentSlotConfig.slot,
      target: currentSlotConfig.target,
      entries,
      currentEntry,
    });
  };


  const handleContinueNextSlot = () => {
    if (!nextSlotConfig) return;
    trialAnalytics.continueNext(currentSlotConfig.slot, nextSlotConfig.slot);
    setResumeDraft(null);
    setActiveSlotIdx(SLOT_SEQUENCE.indexOf(nextSlotConfig));
    trialAnalytics.startPractice(
      nextSlotConfig.slot,
      nextSlotConfig.target,
      SLOT_SEQUENCE.indexOf(nextSlotConfig)
    );
    setStep('practice');
  };

  const handleSignupResume = () => {
    const totalEntries = completedSlots.reduce((sum, s) => sum + s.entries.length, 0);
    trialAnalytics.signupClick(completedSlots.length, totalEntries);
    navigate({ to: '/auth', search: { redirect: '/app/practice', resume: 'trial' } as any });
  };

  return (
    <div className="min-h-screen bg-background paper-texture">
      {/* Header */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-background/80 border-b border-border/50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-storybook-honey to-storybook-coral rounded-storybook flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-storybook font-bold text-foreground">{t('try.brand')}</span>
          </Link>
          <Link to="/auth">
            <Button variant="ghost" size="sm" className="rounded-storybook">
              {t('try.skipToSignup')}
            </Button>
          </Link>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-2xl">
        {/* STEP 1 — Category */}
        {step === 'category' && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center space-y-3">
              <div className="inline-flex items-center px-4 py-1.5 rounded-storybook bg-storybook-cream border border-storybook-honey/30">
                <span className="text-xs font-medium text-storybook-bark">{t('try.noSignup')}</span>
              </div>
              <h1 className="font-storybook text-3xl md:text-4xl font-bold text-storybook-bark leading-tight">
                {t('try.step1.title')}
              </h1>
              <p className="text-muted-foreground">{t('try.step1.subtitle')}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {categories.map(({ key, label, desc }) => {
                const Icon = categoryIcons[key] || Star;
                return (
                  <button key={key} onClick={() => handlePickCategory(key)} className="group text-left">
                    <Card className="p-5 rounded-storybook-lg border-2 border-transparent hover:border-storybook-honey/40 hover:shadow-storybook-hover transition-all duration-300 bg-card/80 backdrop-blur">
                      <div className={cn('w-12 h-12 rounded-storybook flex items-center justify-center mb-3 bg-gradient-to-br', categoryGradients[key])}>
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="font-storybook font-semibold text-foreground mb-1">{label}</div>
                      <div className="text-sm text-muted-foreground">{desc}</div>
                    </Card>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 2 — Affirmation */}
        {step === 'affirmation' && category && (
          <div className="space-y-6 animate-fade-in">
            <button onClick={() => setStep('category')} className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4 mr-1" /> {t('try.back')}
            </button>

            <div className="text-center space-y-2">
              <h2 className="font-storybook text-2xl md:text-3xl font-bold text-storybook-bark">{t('try.step2.title')}</h2>
              <p className="text-muted-foreground text-sm">{t('try.step2.subtitle')}</p>
            </div>

            {!editing ? (
              <>
                <div className="space-y-3">
                  {getSuggestions(category).map((s, i) => (
                    <button
                      key={i}
                      onClick={() => handlePickAffirmation(s)}
                      className={cn(
                        'w-full text-left p-4 rounded-storybook border-2 transition-all duration-300',
                        affirmation === s
                          ? 'border-storybook-honey bg-storybook-honey/10 shadow-storybook'
                          : 'border-border bg-card/60 hover:border-storybook-honey/40'
                      )}
                    >
                      <p className="font-storybook text-foreground leading-relaxed">{s}</p>
                    </button>
                  ))}
                </div>

                <button onClick={() => { setEditing(true); if (!affirmation) setAffirmation(''); }} className="inline-flex items-center text-sm text-storybook-coral hover:text-storybook-coral/80">
                  <Pencil className="w-4 h-4 mr-1" /> {t('try.step2.customize')}
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Textarea
                  value={affirmation}
                  onChange={(e) => setAffirmation(e.target.value)}
                  placeholder={t('try.step2.placeholder')}
                  className="min-h-[120px] rounded-storybook border-2 focus:border-storybook-honey font-storybook text-base leading-relaxed"
                  autoFocus
                />
                <button onClick={() => setEditing(false)} className="text-sm text-muted-foreground hover:text-foreground">
                  {t('try.step2.useSuggestions')}
                </button>
              </div>
            )}

            <Button
              onClick={handleStartPractice}
              disabled={!affirmation.trim()}
              size="lg"
              className="w-full rounded-storybook-lg bg-gradient-to-r from-storybook-honey to-storybook-coral hover:opacity-90 text-white font-storybook font-semibold py-6 text-base"
            >
              {t('try.step2.cta')} <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {/* STEP 4 — Celebrate */}
        {step === 'celebrate' && (
          <div className="space-y-6 animate-fade-in text-center pt-8">
            <div className="inline-flex w-24 h-24 rounded-full bg-gradient-to-br from-storybook-honey to-storybook-coral items-center justify-center mx-auto animate-scale-in">
              <Sparkles className="w-12 h-12 text-white" />
            </div>
            <h2 className="font-storybook text-3xl md:text-4xl font-bold text-storybook-bark">
              {t('try.step4.title')}
            </h2>
            <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">
              {t('try.step4.subtitle')}
            </p>

            {/* Progress recap */}
            <div className="flex items-center justify-center gap-2 max-w-md mx-auto">
              {SLOT_SEQUENCE.map(({ slot, target }, i) => {
                const done = i < completedSlots.length;
                return (
                  <div
                    key={slot}
                    className={cn(
                      'flex-1 px-3 py-2 rounded-storybook text-xs font-storybook border-2 transition-all',
                      done
                        ? 'border-storybook-honey bg-storybook-honey/10 text-storybook-bark'
                        : 'border-border bg-card/40 text-muted-foreground'
                    )}
                  >
                    <div className="font-semibold">{t(`try.slots.${slot}`)}</div>
                    <div className="opacity-70">{done ? `✓ ${target}` : `· ${target}`}</div>
                  </div>
                );
              })}
            </div>

            <Card className="p-5 rounded-storybook-lg bg-storybook-cream/50 border-storybook-honey/20 text-left max-w-md mx-auto">
              <p className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                {t('try.step4.yourAffirmation')}
              </p>
              <p className="font-storybook text-foreground leading-relaxed">{affirmation}</p>
            </Card>

            {/* Daily progress + next slot */}
            {(() => {
              const totalTarget = SLOT_SEQUENCE.reduce((s, x) => s + x.target, 0);
              const totalDone = completedSlots.reduce((s, x) => s + x.entries.length, 0);
              const pct = Math.min(100, Math.round((totalDone / totalTarget) * 100));
              const remaining = SLOT_SEQUENCE.length - completedSlots.length;
              return (
                <div className="max-w-md mx-auto space-y-3 text-left">
                  <div className="flex items-center justify-between text-xs text-muted-foreground font-storybook">
                    <span>{t('try.step4.totalProgress', { done: totalDone, total: totalTarget })}</span>
                    <span>
                      {nextSlotConfig
                        ? t('try.step4.slotsRemaining', { count: remaining })
                        : t('try.step4.allDone')}
                    </span>
                  </div>
                  <Progress value={pct} className="h-2 bg-storybook-cream" />
                  {nextSlotConfig && (
                    <Card className="p-4 rounded-storybook-lg border-2 border-storybook-honey/40 bg-gradient-to-br from-storybook-honey/10 to-storybook-coral/10">
                      <p className="text-xs uppercase tracking-wide text-storybook-bark/70 mb-1 font-storybook">
                        {t('try.step4.nextSlotLabel')}
                      </p>
                      <p className="font-storybook font-semibold text-storybook-bark">
                        {t('try.step4.nextSlotTarget', {
                          slot: t(`try.slots.${nextSlotConfig.slot}`),
                          count: nextSlotConfig.target,
                        })}
                      </p>
                    </Card>
                  )}
                </div>
              );
            })()}

            <div className="space-y-3 pt-2 max-w-md mx-auto">
              {nextSlotConfig ? (
                <>
                  <Button
                    onClick={handleContinueNextSlot}
                    size="lg"
                    className="w-full rounded-storybook-lg bg-gradient-to-r from-storybook-honey to-storybook-coral hover:opacity-90 text-white font-storybook font-semibold py-6 text-base shadow-storybook"
                  >
                    {t('try.step4.continueNext', {
                      slot: t(`try.slots.${nextSlotConfig.slot}`),
                      count: nextSlotConfig.target,
                    })}
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                  <Button
                    onClick={() => setStep('affirmation')}
                    size="lg"
                    variant="outline"
                    className="w-full rounded-storybook-lg border-2 border-storybook-honey/60 text-storybook-bark hover:bg-storybook-honey/10 font-storybook font-semibold py-6 text-base"
                  >
                    <LayoutGrid className="w-5 h-5 mr-2" />
                    {t('try.step4.backToOverview')}
                  </Button>
                  <Button
                    onClick={handleSignupResume}
                    variant="ghost"
                    className="w-full rounded-storybook text-storybook-bark hover:bg-storybook-honey/10 font-storybook"
                  >
                    {t('try.step4.saveAndContinue')} <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={handleSignupResume}
                  size="lg"
                  className="w-full rounded-storybook-lg bg-gradient-to-r from-storybook-honey to-storybook-coral hover:opacity-90 text-white font-storybook font-semibold py-6 text-base"
                >
                  {t('try.step4.signupCta')} <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              )}
              <button
                onClick={() => {
                  trialAnalytics.tryAgain(completedSlots.length);
                  setStep('category');
                  setCategory(null);
                  setAffirmation('');
                  setEditing(false);
                  setCompletedSlots([]);
                  setActiveSlotIdx(0);
                  setResumeDraft(null);
                  clearTrialDraft();
                  try { localStorage.removeItem(TRY_STORAGE_KEY); } catch { /* noop */ }
                }}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {t('try.step4.tryAgain')}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Immersive Practice (full-screen overlay) */}
      {step === 'practice' && category && currentSlotConfig && (
        <ImmersiveFocusMode
          isOpen
          onClose={() => setStep(completedSlots.length > 0 ? 'celebrate' : 'affirmation')}
          onComplete={handleComplete}
          wish={trialWish}
          timeSlot={currentSlotConfig.slot}
          target={currentSlotConfig.target}
          initialEntries={
            resumeDraft && resumeDraft.slot === currentSlotConfig.slot
              ? resumeDraft.entries
              : undefined
          }
          initialDraft={
            resumeDraft && resumeDraft.slot === currentSlotConfig.slot
              ? resumeDraft.currentEntry
              : undefined
          }
          onProgress={handlePracticeProgress}
        />
      )}
    </div>
  );
}
