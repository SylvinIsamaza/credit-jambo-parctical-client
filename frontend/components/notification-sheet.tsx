'use client';

import { useState } from 'react';
import { useNotifications, useMarkAsRead, useMarkAllAsRead } from '@/hooks/use-notifications';
import { NotificationDetailModal } from '@/components/notification-detail-modal';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  Shield, 
  Mail, 
  Lock, 
  Key, 
  CheckCircle, 
  AlertTriangle,
  Info,
  X,
  Bell
} from 'lucide-react';
import { format } from 'date-fns';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'LOGIN_SUCCESS':
      return <Shield className="h-4 w-4 text-green-600" />;
    case 'PASSWORD_RESET':
    case 'ACCOUNT_PASSWORD_CHANGED':
      return <Lock className="h-4 w-4 text-blue-600" />;
    case 'EMAIL_CHANGED':
      return <Mail className="h-4 w-4 text-purple-600" />;
    case 'TRANSACTION_PIN_CHANGED':
      return <Key className="h-4 w-4 text-orange-600" />;
    case 'SUCCESS':
      return <CheckCircle className="h-4 w-4 text-green-600" />;
    case 'WARNING':
      return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    case 'ERROR':
      return <X className="h-4 w-4 text-red-600" />;
    default:
      return <Info className="h-4 w-4 text-blue-600" />;
  }
};

interface NotificationSheetProps {
  children: React.ReactNode;
}

export function NotificationSheet({ children }: NotificationSheetProps) {
  const [selectedNotification, setSelectedNotification] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [open, setOpen] = useState(false);

  const { data: notifications = [], isLoading } = useNotifications();
  const markAsReadMutation = useMarkAsRead();
  const markAllAsReadMutation = useMarkAllAsRead();

  const handleNotificationClick = (notification: any) => {
    // Mark as read if unread
    if (!notification.isRead) {
      markAsReadMutation.mutate(notification.id);
    }
    
    setSelectedNotification(notification);
    setShowDetailModal(true);
    // Don't close the sheet - remove setOpen(false)
  };

  const handleMarkAsRead = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    markAsReadMutation.mutate(id);
  };

  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          {children}
        </SheetTrigger>
        <SheetContent className="w-96">
          <SheetHeader>
            <SheetTitle className="flex mt-5 items-center justify-between">
              <div className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
                {unreadCount > 0 && (
                  <Badge variant="destructive" className="ml-2">
                    {unreadCount}
                  </Badge>
                )}
              </div>
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markAllAsReadMutation.mutate()}
                  disabled={markAllAsReadMutation.isPending}
                >
                  Mark All Read
                </Button>
              )}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-100px)] mt-4">
            {isLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-16 bg-gray-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12">
                <Bell className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 text-center">No notifications</p>
              </div>
            ) : (
              <div className="space-y-2">
                {notifications.map((notification: any) => (
                  <div
                    key={notification.id}
                    className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-sm ${
                      !notification.isRead ? 'border-blue-200 bg-blue-50/30' : 'border-gray-200'
                    }`}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium text-sm text-gray-900 truncate">
                            {notification.title}
                          </h4>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        
                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                          {notification.message}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-gray-500">
                            {format(new Date(notification.createdAt), 'MMM d, h:mm a')}
                          </span>
                          
                          {!notification.isRead && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={(e) => handleMarkAsRead(notification.id, e)}
                              className="text-xs h-6 px-2"
                            >
                              Mark read
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </SheetContent>
      </Sheet>

      <NotificationDetailModal
        notification={selectedNotification}
        open={showDetailModal}
        onClose={() => {
          setShowDetailModal(false);
          setSelectedNotification(null);
        }}
        onMarkAsRead={(id) => markAsReadMutation.mutate(id)}
      />
    </>
  );
}