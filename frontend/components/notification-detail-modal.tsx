'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Shield, 
  Mail, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle,
  Info,
  X
} from 'lucide-react';
import { format } from 'date-fns';

interface NotificationDetailModalProps {
  notification: {
    id: string;
    title: string;
    message: string;
    type: string;
    metadata?: any;
    isRead: boolean;
    createdAt: string;
  } | null;
  open: boolean;
  onClose: () => void;
  onMarkAsRead?: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'LOGIN_SUCCESS':
      return <Shield className="h-5 w-5 text-green-600" />;
    case 'PASSWORD_RESET':
    case 'ACCOUNT_PASSWORD_CHANGED':
      return <Lock className="h-5 w-5 text-blue-600" />;
    case 'EMAIL_CHANGED':
      return <Mail className="h-5 w-5 text-purple-600" />;
    case 'TRANSACTION_PIN_CHANGED':
      return <Key className="h-5 w-5 text-orange-600" />;
    case 'SUCCESS':
      return <CheckCircle className="h-5 w-5 text-green-600" />;
    case 'WARNING':
      return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
    case 'ERROR':
      return <X className="h-5 w-5 text-red-600" />;
    default:
      return <Info className="h-5 w-5 text-blue-600" />;
  }
};

const getNotificationColor = (type: string) => {
  switch (type) {
    case 'LOGIN_SUCCESS':
    case 'SUCCESS':
      return 'bg-green-50 border-green-200';
    case 'PASSWORD_RESET':
    case 'ACCOUNT_PASSWORD_CHANGED':
    case 'INFO':
      return 'bg-blue-50 border-blue-200';
    case 'EMAIL_CHANGED':
      return 'bg-purple-50 border-purple-200';
    case 'TRANSACTION_PIN_CHANGED':
      return 'bg-orange-50 border-orange-200';
    case 'WARNING':
      return 'bg-yellow-50 border-yellow-200';
    case 'ERROR':
      return 'bg-red-50 border-red-200';
    default:
      return 'bg-gray-50 border-gray-200';
  }
};

export function NotificationDetailModal({ 
  notification, 
  open, 
  onClose, 
  onMarkAsRead 
}: NotificationDetailModalProps) {
  if (!notification) return null;

  const handleMarkAsRead = () => {
    if (!notification.isRead && onMarkAsRead) {
      onMarkAsRead(notification.id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {getNotificationIcon(notification.type)}
            {notification.title}
           
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Main Message */}
          <div className={`p-4 rounded-lg border ${getNotificationColor(notification.type)}`}>
            <p className="text-gray-700">{notification.message}</p>
          </div>

          {/* Metadata */}
          {notification.metadata && (
            <div className="space-y-3">
              <h4 className="font-medium text-gray-900">Details</h4>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                {notification.metadata.ipAddress && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">IP Address:</span>
                    <span className="text-sm font-mono">{notification.metadata.ipAddress}</span>
                  </div>
                )}
                {notification.metadata.userAgent && (
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Device:</span>
                    <span className="text-sm">{notification.metadata.deviceName || 'Unknown Device'}</span>
                  </div>
                )}
                {notification.metadata.oldEmail && notification.metadata.newEmail && (
                  <>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Previous Email:</span>
                      <span className="text-sm">{notification.metadata.oldEmail}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">New Email:</span>
                      <span className="text-sm">{notification.metadata.newEmail}</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Action Type:</span>
                  <span className="text-sm font-medium">{notification.metadata.actionType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Timestamp:</span>
                  <span className="text-sm">
                    {format(new Date(notification.createdAt), 'PPpp')}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4">
            <div className="text-sm text-gray-500">
              {format(new Date(notification.createdAt), 'PPpp')}
            </div>
        
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}