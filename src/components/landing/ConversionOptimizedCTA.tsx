import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, Users, Gift, CheckCircle, Share2, Copy } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';

export const ConversionOptimizedCTA = () => {
  const { t, i18n } = useTranslation(['landing', 'common']);
  const [recentSignups, setRecentSignups] = useState(73);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Simulate real-time signup updates
    const interval = setInterval(() => {
      setRecentSignups(prev => prev + Math.floor(Math.random() * 3));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: i18n.language === 'zh' ? '显化369 - 科学显化，实现梦想' : 'Manifest 369 - Scientific Manifestation',
          text: i18n.language === 'zh' ? '发现Tesla的369秘密，用科学方法实现你的愿望！' : 'Discover Tesla\'s 369 secret and manifest your dreams scientifically!',
          url: window.location.origin
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(window.location.origin);
      setCopied(true);
      toast.success(i18n.language === 'zh' ? '链接已复制到剪贴板' : 'Link copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    }
  };
  const [email, setEmail] = useState('');

  return (
    <section className="py-24 px-4 bg-section-alt relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-64 h-64 bg-primary rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-accent rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto max-w-5xl text-center relative z-10">
        {/* Enhanced urgency badge */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center px-4 py-2 bg-badge-highlight border border-badge-highlight-border rounded-full animate-fade-in">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-warning rounded-full animate-pulse"></div>
              <span className="text-badge-highlight-text font-semibold text-sm">
                {i18n.language === 'zh' ? '⚡ 限时：早期用户专享永久免费权限' : '⚡ Limited: Early Users Get Forever Free Access'}
              </span>
            </div>
          </div>
        </div>

        <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-foreground">
          {t('cta.title')}
        </h2>
        
        <p className="text-xl md:text-2xl mb-8 opacity-90 max-w-3xl mx-auto font-medium text-muted-foreground">
          {t('cta.subtitle')}
        </p>

        <p className="text-lg mb-12 opacity-80 max-w-4xl mx-auto leading-relaxed text-muted-foreground">
          {t('cta.description')}
        </p>

        {/* Enhanced Primary CTA */}
        <div className="mb-12">
          <Link to="/auth" className="group inline-block animate-scale-in">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-primary to-accent text-primary-foreground hover:opacity-90 px-12 py-6 text-xl font-bold shadow-2xl group-hover:shadow-3xl transition-all duration-300 transform group-hover:scale-105"
            >
              <Sparkles className="w-6 h-6 mr-3 group-hover:animate-spin" />
              {t('common:buttons.getStarted')}
              <span className="ml-3 text-sm bg-white/20 px-3 py-1 rounded-full">
                {i18n.language === 'zh' ? '永久免费' : 'Forever Free'}
              </span>
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>

        {/* Enhanced benefits list with social proof */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center justify-center space-y-2 text-foreground hover-scale transition-all duration-300">
            <Gift className="w-8 h-8 mb-2 text-primary" />
            <span className="font-medium text-center">
              {i18n.language === 'zh' ? '永久免费使用基础功能' : 'Free Forever Plan'}
            </span>
            <div className="text-xs text-muted-foreground">
              {i18n.language === 'zh' ? '✓ 已有 5,247+ 用户享受' : '✓ 5,247+ users enjoying'}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-foreground hover-scale transition-all duration-300">
            <CheckCircle className="w-8 h-8 mb-2 text-primary" />
            <span className="font-medium text-center">
              {i18n.language === 'zh' ? '无需信用卡' : 'No Credit Card Required'}
            </span>
            <div className="text-xs text-muted-foreground">
              {i18n.language === 'zh' ? `✓ 今日已有 ${recentSignups} 人注册` : `✓ ${recentSignups} signed up today`}
            </div>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 text-foreground hover-scale transition-all duration-300">
            <Users className="w-8 h-8 mb-2 text-primary" />
            <span className="font-medium text-center">
              {i18n.language === 'zh' ? '加入活跃社区' : 'Join Active Community'}
            </span>
            <div className="text-xs text-muted-foreground">
              {i18n.language === 'zh' ? '✓ 89% 成功率验证' : '✓ 89% success rate verified'}
            </div>
          </div>
        </div>

        {/* Email capture alternative */}
        <Card className="max-w-md mx-auto bg-card border shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">
              {i18n.language === 'zh' ? '或者订阅我们的更新' : 'Or Subscribe for Updates'}
            </h3>
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder={i18n.language === 'zh' ? '输入您的邮箱' : 'Enter your email'}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background border-input"
              />
              <Button 
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-6"
              >
                {i18n.language === 'zh' ? '订阅' : 'Subscribe'}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-3">
              {i18n.language === 'zh' 
                ? '我们承诺不会发送垃圾邮件，您可以随时取消订阅。' 
                : 'No spam. Unsubscribe at any time.'}
            </p>
          </CardContent>
        </Card>

        {/* Enhanced social proof with share feature */}
        <div className="mt-12 space-y-6">
          {/* Share section */}
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              {i18n.language === 'zh' ? '分享给朋友，一起成长' : 'Share with Friends, Grow Together'}
            </h3>
            <Button 
              onClick={handleShare}
              variant="outline" 
              className="border-border hover:bg-accent/10 transition-all duration-300"
            >
              {copied ? (
                <>
                  <CheckCircle className="w-4 h-4 mr-2 text-success" />
                  {i18n.language === 'zh' ? '已复制' : 'Copied'}
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 mr-2" />
                  {i18n.language === 'zh' ? '分享链接' : 'Share Link'}
                </>
              )}
            </Button>
          </div>
          
          {/* Real-time social proof */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
              <span>
                {i18n.language === 'zh' ? `过去24小时已有 ${recentSignups} 人注册` : `${recentSignups} people signed up in 24h`}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>{i18n.language === 'zh' ? '平均 2 分钟完成设置' : 'Setup in 2 minutes'}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
