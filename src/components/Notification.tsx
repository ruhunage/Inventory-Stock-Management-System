import React from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';
import { Notification as NotificationType } from '../types';
import { useApp } from '../context/AppContext';

interface NotificationProps {
  notification: NotificationType;
}

export default function Notification({ notification }: NotificationProps) {
  const { dispatch } = useApp();

  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      case 'info':
        return 'text-blue-800';
    }
  };

  return (
    <div className={`border rounded-lg p-4 shadow-sm ${getBackgroundColor()} animate-slide-in`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${getTextColor()}`}>
            {notification.message}
          </p>
        </div>
        <button
          className={`ml-4 inline-flex text-gray-400 hover:text-gray-600 focus:outline-none`}
          onClick={() => dispatch({ type: 'REMOVE_NOTIFICATION', payload: notification.id })}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}