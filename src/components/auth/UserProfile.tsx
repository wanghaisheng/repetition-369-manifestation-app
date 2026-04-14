
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { User, LogOut, Settings } from 'lucide-react';

interface UserProfileProps {
  variant?: 'full' | 'compact';
}

export const UserProfile = ({ variant = 'compact' }: UserProfileProps) => {
  const { user, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  if (!user) return null;

  const handleSignOut = async () => {
    await signOut();
    setShowMenu(false);
  };

  if (variant === 'compact') {
    return (
      <div className="relative">
        <button
          onClick={() => setShowMenu(!showMenu)}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-storybook-honey to-storybook-coral flex items-center justify-center text-white font-semibold shadow-storybook"
        >
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </button>

        {showMenu && (
          <div className="absolute top-12 right-0 bg-card rounded-storybook shadow-storybook-hover border p-2 min-w-48 z-50">
            <div className="px-3 py-2 border-b border-border">
              <p className="font-semibold text-foreground">{user.fullName || '用户'}</p>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
            <button
              onClick={() => setShowMenu(false)}
              className="w-full flex items-center px-3 py-2 text-foreground hover:bg-muted rounded-storybook"
            >
              <Settings className="w-4 h-4 mr-2" />
              设置
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-destructive hover:bg-destructive/10 rounded-storybook"
            >
              <LogOut className="w-4 h-4 mr-2" />
              退出登录
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-card rounded-storybook-lg p-6 shadow-storybook">
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-storybook-honey to-storybook-coral flex items-center justify-center text-white text-xl font-semibold">
          {user.fullName ? user.fullName.charAt(0).toUpperCase() : user.email.charAt(0).toUpperCase()}
        </div>
        <div>
          <h3 className="font-semibold text-foreground">{user.fullName || '用户'}</h3>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </div>
      <Button
        onClick={handleSignOut}
        variant="outline"
        className="w-full rounded-storybook"
      >
        <LogOut className="w-4 h-4 mr-2" />
        退出登录
      </Button>
    </div>
  );
};
