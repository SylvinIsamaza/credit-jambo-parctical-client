'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { useNotifications } from '@/hooks/use-notifications';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Bell, LogOut, User, Menu } from 'lucide-react';
import { NotificationSheet } from '../notification-sheet';
import { useRouter } from 'next/navigation';



const getPageTitle = (pathname: string) => {

  if (pathname.startsWith('/users')) return 'Users';
  if (pathname.startsWith('/contacts')) return 'Contacts';
  if (pathname.startsWith('/audit-logs')) return 'Audit Logs';
  if (pathname.startsWith('/devices')) return 'Devices';
  if (pathname.startsWith('/transactions')) return 'Transactions';
  if(pathname.startsWith('/dashboard')) return 'Dashboard';
  return 'Settings';
};

interface NavbarProps {
  onMenuClick: () => void;
}

export function Navbar({ onMenuClick }: NavbarProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router=useRouter()
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  
  const { data: notifications = [], isLoading } = useNotifications();
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;
  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
  };
  

  return (
    <header className="bg-white border-b border-gray-200 px-4 md:px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        {/* Page Title */}
        <div className="flex-1 md:ml-0 ml-4">
          <h1 className="text-lg md:text-xl font-semibold text-gray-900">
            {getPageTitle(pathname)}
          </h1>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
        <NotificationSheet>
          <button className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors">
            <div className="flex relative items-center">
              <Bell className=" h-5 w-5" />
              
            {unreadCount > 0 && (
              <span className="bg-red-500 absolute top-[-8px] right-[-10px] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
            </div>
          </button>
        </NotificationSheet>

          {/* User Profile */}
          <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-3 h-auto p-2 hover:bg-gray-50">
                <div className="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                  {user?.profileImage ? (
                    <img
                      src={user.profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                        e.currentTarget.nextElementSibling?.classList.remove('hidden');
                      }}
                    />
                  ) : null}
                  <div className={`w-full h-full flex items-center justify-center text-sm font-medium text-gray-600 ${user?.profileImage ? 'hidden' : ''}`}>
                    {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                  </div>
                </div>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-0" align="end">
            
              <div className="p-2">
                <Button
                  variant="link"
                  className="w-full justify-start gap-2 text-left"
                  onClick={() => {
                    setIsProfileOpen(false);
                    router.push('/settings/profile');
                  }}
                >
                  <User className="h-4 w-4" />
                  Profile
                </Button>
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2 text-left text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
}