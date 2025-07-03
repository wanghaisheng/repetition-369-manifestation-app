
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { SocialService, ShareableContent } from '@/services/SocialService';
import { useToast } from '@/hooks/use-toast';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareableContent;
}

export const ShareModal = ({ isOpen, onClose, content }: ShareModalProps) => {
  const { toast } = useToast();
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform: 'wechat' | 'weibo' | 'twitter' | 'facebook' | 'copy') => {
    setIsSharing(true);
    try {
      const success = await SocialService.shareContent({ platform, content });
      
      if (success) {
        toast({
          title: '分享成功',
          description: platform === 'copy' ? '内容已复制到剪贴板' : '分享窗口已打开'
        });
        
        if (platform !== 'copy') {
          onClose();
        }
      } else {
        toast({
          title: '分享失败',
          description: '请稍后重试',
          variant: 'destructive'
        });
      }
    } catch (error) {
      console.error('Share error:', error);
      toast({
        title: '分享失败',
        description: '请稍后重试',
        variant: 'destructive'
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleNativeShare = async () => {
    setIsSharing(true);
    try {
      const success = await SocialService.nativeShare(content);
      if (success) {
        toast({
          title: '分享成功',
          description: '内容已成功分享'
        });
        onClose();
      } else {
        // Fallback to copy
        await handleShare('copy');
      }
    } catch (error) {
      console.error('Native share error:', error);
      await handleShare('copy');
    } finally {
      setIsSharing(false);
    }
  };

  const formatPreviewText = (content: ShareableContent) => {
    let text = `${content.title}\n\n${content.description}`;
    if (content.hashtags && content.hashtags.length > 0) {
      text += '\n\n' + content.hashtags.map(tag => `#${tag}`).join(' ');
    }
    return text;
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-2">
            <Share2 className="w-5 h-5" />
            <span>分享成就</span>
          </DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">预览内容：</div>
          <div className="text-sm text-gray-800 whitespace-pre-line">
            {formatPreviewText(content)}
          </div>
        </div>

        {/* Share Options */}
        <div className="space-y-3">
          {/* Native Share (if supported) */}
          {SocialService.canShare() && (
            <Button
              onClick={handleNativeShare}
              disabled={isSharing}
              className="w-full justify-start space-x-3"
              variant="outline"
            >
              <Share2 className="w-5 h-5" />
              <span>系统分享</span>
            </Button>
          )}

          {/* WeChat */}
          <Button
            onClick={() => handleShare('wechat')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <MessageCircle className="w-5 h-5 text-green-600" />
            <span>微信</span>
          </Button>

          {/* Weibo */}
          <Button
            onClick={() => handleShare('weibo')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <div className="w-5 h-5 bg-red-500 rounded text-white flex items-center justify-center text-xs font-bold">
              微
            </div>
            <span>微博</span>
          </Button>

          {/* Twitter */}
          <Button
            onClick={() => handleShare('twitter')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Twitter className="w-5 h-5 text-blue-500" />
            <span>Twitter</span>
          </Button>

          {/* Facebook */}
          <Button
            onClick={() => handleShare('facebook')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>Facebook</span>
          </Button>

          {/* Copy to Clipboard */}
          <Button
            onClick={() => handleShare('copy')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Copy className="w-5 h-5" />
            <span>复制文本</span>
          </Button>

          {/* Cancel */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            取消
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
