import React from 'react';

interface NotificationProps {
  message: string | null;
}

export const Notification: React.FC<NotificationProps> = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className="notification">
      {message}
    </div>
  );
};
