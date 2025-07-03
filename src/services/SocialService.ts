
export interface ShareableContent {
  type: 'achievement' | 'streak' | 'progress' | 'wish';
  title: string;
  description: string;
  image?: string;
  url?: string;
  hashtags?: string[];
}

export interface ShareOptions {
  platform: 'wechat' | 'weibo' | 'twitter' | 'facebook' | 'copy';
  content: ShareableContent;
}

export class SocialService {
  static async shareContent(options: ShareOptions): Promise<boolean> {
    const { platform, content } = options;

    try {
      switch (platform) {
        case 'wechat':
          return this.shareToWeChat(content);
        case 'weibo':
          return this.shareToWeibo(content);
        case 'twitter':
          return this.shareToTwitter(content);
        case 'facebook':
          return this.shareToFacebook(content);
        case 'copy':
          return this.copyToClipboard(content);
        default:
          return false;
      }
    } catch (error) {
      console.error('Error sharing content:', error);
      return false;
    }
  }

  static createAchievementShare(achievement: string, description: string): ShareableContent {
    return {
      type: 'achievement',
      title: `🎉 我获得了新成就：${achievement}！`,
      description: `${description}\n\n通过369显化法，我正在实现自己的梦想！`,
      hashtags: ['显化法', '369练习', '成就解锁', '自我提升']
    };
  }

  static createStreakShare(days: number): ShareableContent {
    const milestones = [
      { days: 7, emoji: '🔥', message: '一周连击' },
      { days: 30, emoji: '💪', message: '一月坚持' },
      { days: 100, emoji: '🏆', message: '百日成就' },
      { days: 365, emoji: '👑', message: '年度大师' }
    ];

    const milestone = milestones.reverse().find(m => days >= m.days);
    const { emoji, message } = milestone || { emoji: '⭐', message: '坚持练习' };

    return {
      type: 'streak',
      title: `${emoji} ${days}天连续练习！`,
      description: `我已经连续${days}天坚持369显化练习，${message}达成！\n\n每天的坚持让我离梦想更近一步！`,
      hashtags: ['369显化法', '坚持', '连击', `${days}天挑战`]
    };
  }

  static createProgressShare(totalSessions: number, achievedWishes: number): ShareableContent {
    return {
      type: 'progress',
      title: `📈 我的显化之旅进展报告`,
      description: `✨ 总练习次数：${totalSessions}次\n🎯 实现愿望：${achievedWishes}个\n\n369显化法真的有效！持续练习让我的生活发生了积极的变化。`,
      hashtags: ['显化法', '进展分享', '梦想成真', '正能量']
    };
  }

  static createWishShare(wishTitle: string, isAchieved: boolean = false): ShareableContent {
    if (isAchieved) {
      return {
        type: 'wish',
        title: `🌟 我的愿望实现了！`,
        description: `"${wishTitle}"\n\n通过369显化法的持续练习，我成功实现了这个愿望！\n感谢宇宙的回应 🙏`,
        hashtags: ['愿望成真', '显化法', '梦想实现', '感恩']
      };
    } else {
      return {
        type: 'wish',
        title: `💫 我正在显化我的愿望`,
        description: `"${wishTitle}"\n\n每天通过369练习，我都在为这个愿望注入能量。\n相信它很快就会实现！`,
        hashtags: ['显化中', '369法则', '愿望显化', '积极能量']
      };
    }
  }

  private static async shareToWeChat(content: ShareableContent): Promise<boolean> {
    // WeChat sharing would require WeChat SDK integration
    // For now, we'll copy to clipboard as fallback
    const text = this.formatShareText(content);
    return this.copyTextToClipboard(text);
  }

  private static async shareToWeibo(content: ShareableContent): Promise<boolean> {
    const text = this.formatShareText(content);
    const url = `https://service.weibo.com/share/share.php?title=${encodeURIComponent(text)}`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    }
    return false;
  }

  private static async shareToTwitter(content: ShareableContent): Promise<boolean> {
    const text = this.formatShareText(content);
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    }
    return false;
  }

  private static async shareToFacebook(content: ShareableContent): Promise<boolean> {
    const text = this.formatShareText(content);
    const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}&quote=${encodeURIComponent(text)}`;
    
    if (typeof window !== 'undefined') {
      window.open(url, '_blank', 'width=600,height=400');
      return true;
    }
    return false;
  }

  private static async copyToClipboard(content: ShareableContent): Promise<boolean> {
    const text = this.formatShareText(content);
    return this.copyTextToClipboard(text);
  }

  private static async copyTextToClipboard(text: string): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        console.error('Failed to copy to clipboard:', error);
      }
    }
    return false;
  }

  private static formatShareText(content: ShareableContent): string {
    let text = `${content.title}\n\n${content.description}`;
    
    if (content.hashtags && content.hashtags.length > 0) {
      text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ');
    }
    
    return text;
  }

  static canShare(): boolean {
    return typeof navigator !== 'undefined' && 
           (navigator.share || navigator.clipboard);
  }

  static async nativeShare(content: ShareableContent): Promise<boolean> {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: content.title,
          text: content.description,
          url: content.url || window.location.href
        });
        return true;
      } catch (error) {
        console.error('Native share failed:', error);
        return false;
      }
    }
    return false;
  }
}
