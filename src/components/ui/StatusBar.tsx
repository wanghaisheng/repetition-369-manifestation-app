
import React from 'react';
import { UserProfile } from '@/components/auth/UserProfile';

export const StatusBar = () => {
  return (
    <div className="flex justify-between items-center px-4 py-3 bg-background/90 backdrop-blur-sm border-b border-border">
      <div className="text-sm font-semibold text-foreground">
        显化369
      </div>
      <UserProfile variant="compact" />
    </div>
  );
};
