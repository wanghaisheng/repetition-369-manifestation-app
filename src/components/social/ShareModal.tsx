
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Share2, Copy, MessageCircle, Twitter, Facebook } from 'lucide-react';
import { SocialService, ShareableContent } from '@/services/SocialService';
import { useToast } from '@/hooks/use-toast';
import { logger } from '@/utils/logger';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  content: ShareableContent;
}

export const ShareModal = ({ isOpen, onClose, content }: ShareModalProps) => {
  const { toast } = useToast();
  const { t } = useTranslation('app');
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform: 'wechat' | 'weibo' | 'twitter' | 'facebook' | 'copy') => {
    setIsSharing(true);
    try {
      const success = await SocialService.shareContent({ platform, content });
      
      if (success) {
        toast({
          title: t('shareModal.toast.shareSuccess'),
          description: platform === 'copy' ? t('shareModal.toast.contentCopied') : t('shareModal.toast.shareWindowOpened')
        });
        
        if (platform !== 'copy') {
          onClose();
        }
      } else {
        toast({
          title: t('shareModal.toast.shareFailed'),
          description: t('shareModal.toast.tryAgain'),
          variant: 'destructive'
        });
      }
    } catch (error) {
      logger.error('Share error', error);
      toast({
        title: t('shareModal.toast.shareFailed'),
        description: t('shareModal.toast.tryAgain'),
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
          title: t('shareModal.toast.shareSuccess'),
          description: t('shareModal.toast.shareComplete')
        });
        onClose();
      } else {
        await handleShare('copy');
      }
    } catch (error) {
      logger.error('Native share error', error);
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
            <span>{t('shareModal.title')}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">{t('shareModal.preview')}</div>
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
              <span>{t('shareModal.systemShare')}</span>
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
            <span>{t('shareModal.wechat')}</span>
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
            <span>{t('shareModal.weibo')}</span>
          </Button>

          {/* Twitter */}
          <Button
            onClick={() => handleShare('twitter')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Twitter className="w-5 h-5 text-blue-500" />
            <span>{t('shareModal.twitter')}</span>
          </Button>

          {/* Facebook */}
          <Button
            onClick={() => handleShare('facebook')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>{t('shareModal.facebook')}</span>
          </Button>

          {/* Copy to Clipboard */}
          <Button
            onClick={() => handleShare('copy')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Copy className="w-5 h-5" />
            <span>{t('shareModal.copyText')}</span>
          </Button>

          {/* Cancel */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            {t('shareModal.cancel')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};