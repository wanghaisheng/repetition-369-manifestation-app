import { m } from '@/paraglide/messages';

import React, { useState } from 'react';
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
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async (platform: 'wechat' | 'weibo' | 'twitter' | 'facebook' | 'copy') => {
    setIsSharing(true);
    try {
      const success = await SocialService.shareContent({ platform, content });
      
      if (success) {
        toast({
          title: m.app_shareModal_toast_shareSuccess(),
          description: platform === 'copy' ? m.app_shareModal_toast_contentCopied() : m.app_shareModal_toast_shareWindowOpened()
        });
        
        if (platform !== 'copy') {
          onClose();
        }
      } else {
        toast({
          title: m.app_shareModal_toast_shareFailed(),
          description: m.app_shareModal_toast_tryAgain(),
          variant: 'destructive'
        });
      }
    } catch (error) {
      logger.error('Share error', error);
      toast({
        title: m.app_shareModal_toast_shareFailed(),
        description: m.app_shareModal_toast_tryAgain(),
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
          title: m.app_shareModal_toast_shareSuccess(),
          description: m.app_shareModal_toast_shareComplete()
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
            <span>{m.app_shareModal_title()}</span>
          </DialogTitle>
        </DialogHeader>

        {/* Preview */}
        <div className="bg-gray-50 rounded-lg p-4 mb-4">
          <div className="text-sm text-gray-600 mb-2">{m.app_shareModal_preview()}</div>
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
              <span>{m.app_shareModal_systemShare()}</span>
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
            <span>{m.app_shareModal_wechat()}</span>
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
            <span>{m.app_shareModal_weibo()}</span>
          </Button>

          {/* Twitter */}
          <Button
            onClick={() => handleShare('twitter')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Twitter className="w-5 h-5 text-blue-500" />
            <span>{m.app_shareModal_twitter()}</span>
          </Button>

          {/* Facebook */}
          <Button
            onClick={() => handleShare('facebook')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Facebook className="w-5 h-5 text-blue-600" />
            <span>{m.app_shareModal_facebook()}</span>
          </Button>

          {/* Copy to Clipboard */}
          <Button
            onClick={() => handleShare('copy')}
            disabled={isSharing}
            className="w-full justify-start space-x-3"
            variant="outline"
          >
            <Copy className="w-5 h-5" />
            <span>{m.app_shareModal_copyText()}</span>
          </Button>

          {/* Cancel */}
          <Button
            onClick={onClose}
            variant="outline"
            className="w-full"
          >
            {m.app_shareModal_cancel()}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};