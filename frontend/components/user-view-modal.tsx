'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Mail, Phone, Calendar, CreditCard, Shield } from 'lucide-react';
import { format } from 'date-fns';

interface UserViewModalProps {
  user: any;
  open: boolean;
  onClose: () => void;
}

export function UserViewModal({ user, open, onClose }: UserViewModalProps) {
  if (!user) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Full Name</label>
              <p className="font-semibold">{user.firstName} {user.lastName}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <div className="flex items-center gap-2">
                
                <p>{user.email}</p>
              </div>
            </div>
            <div className='flex flex-col gap-2 '>
              <label className="text-sm font-medium text-gray-600">Role</label>
              <Badge className='w-fit' variant="outline">{user.role}</Badge>
            </div>
            <div className='flex flex-col gap-2'>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge className='w-fit' variant={user.isActive ? 'default' : 'secondary'}>
                {user.isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>

          {/* Contact Information */}
          {user.phoneNumber && (
            <div>
              <label className="text-sm font-medium text-gray-600">Phone Number</label>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-gray-400" />
                <p>{user.phoneNumber}</p>
              </div>
            </div>
          )}

          {user.dateOfBirth && (
            <div>
              <label className="text-sm font-medium text-gray-600">Date of Birth</label>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-400" />
                <p>{format(new Date(user.dateOfBirth), 'PPP')}</p>
              </div>
            </div>
          )}

          {/* Account Information */}
          {user.accounts && user.accounts.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">Account Information</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-gray-500">Account Number</label>
                    <div className="flex items-center gap-2">
                      <CreditCard className="h-4 w-4 text-gray-400" />
                      <p className="font-mono text-sm">{user.accounts[0].accountNumber}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500">Balance</label>
                    <p className="font-semibold text-lg">${user.accounts[0].balance}</p>
                  </div>
                 
                </div>
              </div>
            </div>
          )}

          {/* Security Information */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-3 block">Security Information</label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Email Verified</span>
                <Badge variant={user.isVerified ? 'default' : 'secondary'}>
                  {user.isVerified ? 'Verified' : 'Not Verified'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Account Created</span>
                <span className="text-sm text-gray-600">
                  {format(new Date(user.createdAt), 'PPP')}
                </span>
              </div>
            </div>
          </div>

          {/* Deactivation Information */}
          {!user.isActive && user.deactivatedReason && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-2 block">Deactivation Information</label>
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <p className="text-sm text-red-800">{user.deactivatedReason}</p>
                {user.deactivatedAt && (
                  <p className="text-xs text-red-600 mt-1">
                    Deactivated on {format(new Date(user.deactivatedAt), 'PPP')}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}