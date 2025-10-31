'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/use-auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Logo } from '@/components/ui/logo';
import { 
  Home, 
  CreditCard, 
  Users, 
  MessageSquare, 
  Settings, 
  FileText,
  LogOut,
  ChevronDown,
  ChevronRight,
  User,
  Shield,
  Monitor,
  Smartphone,
  Bell,
  X
} from 'lucide-react';
import { NotificationSheet } from '@/components/notification-sheet';
import { useNotifications } from '@/hooks/use-notifications';
import Image from 'next/image';
import { useState } from 'react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Home },
  { name: 'Transactions', href: '/transactions', icon: CreditCard },
  { name: 'Support', href: '/contacts', icon: MessageSquare },
];

const settingsNavigation = [
  { name: 'Profile', href: '/settings/profile', icon: User },
  { name: 'Security', href: '/settings/security', icon: Shield },
  { name: 'Active Sessions', href: '/settings/sessions', icon: Monitor },
  { name: 'Devices', href: '/settings/devices', icon: Smartphone },
];

const adminNavigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: Home },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'Transactions', href: '/admin/transactions', icon: CreditCard },
  { name: 'Devices', href: '/admin/devices', icon: Smartphone },
  { name: 'Contacts', href: '/admin/contacts', icon: MessageSquare },
  { name: 'Audit Logs', href: '/admin/audit-logs', icon: FileText },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const [settingsExpanded, setSettingsExpanded] = useState(pathname.startsWith('/settings'));
  const { data: notifications = [] } = useNotifications();
  
  const isAdmin = user?.role === 'ADMIN';
  const unreadCount = notifications.filter((n: any) => !n.isRead).length;

  return (
    <div className={`flex flex-col w-64 bg-primary border-r border-gray-200 h-full fixed md:relative z-50 transform transition-transform duration-300 ease-in-out ${
      isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
    }`}>
      <div className="flex items-center justify-between h-16 px-4 border-gray-200">
        <Image src="/logo-white.png" alt="Credit Ijambo" height={100} width={200} className="mx-auto" />
        <button
          onClick={onClose}
          className="md:hidden p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10"
        >
          <X className="h-5 w-5" />
        </button>
      </div>
      
      <nav className="flex-1 px-4 py-6 space-y-2">
        {!isAdmin&&navigation.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                pathname === item.href
                  ? 'bg-white/20 text-white border border-white/30'  
                  : 'text-white/80 hover:bg-white/10 hover:text-white'
              )}
            >
              <Icon className="mr-3 h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
        
        {/* Settings with submenu */}
      
        {isAdmin && (
          <>
            <div className=" pb-2">
            
            </div>
            {adminNavigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                    pathname === item.href
                      ? 'bg-white/20 text-white border border-white/30'
                      : 'text-white/80 hover:bg-white/10 hover:text-white'
                  )}
                >
                  <Icon className="mr-3 h-5 w-5" />
                  {item.name}
                </Link>
              );
            })}
          </>
        )}
          <div>
          <button
            onClick={() => setSettingsExpanded(!settingsExpanded)}
            className={cn(
              'flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-md transition-colors',
              pathname.startsWith('/settings')
                ? 'bg-white/20 text-white border border-white/30'
                : 'text-white/80 hover:bg-white/10 hover:text-white'
            )}
          >
            <div className="flex items-center">
              <Settings className="mr-3 h-5 w-5" />
              Settings
            </div>
            {settingsExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
          
          {settingsExpanded && (
            <div className="ml-6 mt-1 space-y-1">
              {settingsNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                      pathname === item.href
                        ? 'bg-white/20 text-white border border-white/30'
                        : 'text-white/70 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className="mr-3 h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </nav>
      
      <div className="p-4 border-t border-gray-200 space-y-2">
       
        
        <button
          onClick={logout}
          className="flex items-center w-full px-3 py-2 text-sm font-medium text-white/80 rounded-md hover:bg-white/10 hover:text-white transition-colors"
        >
          <LogOut className="mr-3 h-5 w-5" />
          Logout
        </button>
      </div>
    </div>
  );
}