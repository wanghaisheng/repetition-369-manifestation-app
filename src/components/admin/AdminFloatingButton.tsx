import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Settings } from 'lucide-react';
import { Link } from '@tanstack/react-router';
import { supabase } from '@/integrations/supabase/client';

export const AdminFloatingButton = () => {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const checkAdminStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user && user.email) {
        const adminEmails = ['admin@heymanifestation.com', 'wanghaisheng@gmail.com'];
        setIsAdmin(adminEmails.includes(user.email));
      }
    };

    checkAdminStatus();
  }, []);

  if (!isAdmin) {
    return null;
  }

  return (
    <Link to="/admin-stats">
      <Button
        size="icon"
        className="fixed bottom-20 right-4 z-40 h-12 w-12 rounded-full shadow-lg bg-gradient-to-r from-primary to-accent hover:opacity-90"
        title="管理统计数据"
      >
        <Settings className="h-5 w-5" />
      </Button>
    </Link>
  );
};
