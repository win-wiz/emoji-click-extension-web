import React, { memo } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = memo(({ message, type = 'info' }) => {
  if (!message) return null;

  const bgColorClass = {
    success: 'bg-green-500',
    error: 'bg-red-500',
    info: 'bg-blue-500'
  }[type];

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className={`px-4 py-2 rounded-lg text-white shadow-lg ${bgColorClass}`}>
        <div className="flex items-center gap-2">
          {type === 'success' && '✅'}
          {type === 'error' && '❌'}
          {type === 'info' && 'ℹ️'}
          {message}
        </div>
      </div>
    </div>
  );
});

Toast.displayName = 'Toast'; 