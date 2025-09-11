import { useContext } from 'react';
import { NotificationContext } from '@/contexts/NotificationContext';

// NotificationContextから値を取得しやすくするためのカスタムフック
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
