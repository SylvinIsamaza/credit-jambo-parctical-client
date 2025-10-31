'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Smartphone, User, Calendar, Shield, Monitor } from 'lucide-react';
import { format } from 'date-fns';

interface DeviceViewModalProps {
  device: any;
  open: boolean;
  onClose: () => void;
}

export function DeviceViewModal({ device, open, onClose }: DeviceViewModalProps) {
  if (!device) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Smartphone className="h-5 w-5" />
            Device Details
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Device Information */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Device Name</label>
              <div className="flex items-center gap-2">
                <Monitor className="h-4 w-4 text-gray-400" />
                <p className="font-semibold">{device.deviceName || 'Unknown Device'}</p>
              </div>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Platform</label>
              <p>{device.platform}</p>
            </div>
            <div className='flex flex-col gap-2'>
              <label className="text-sm font-medium text-gray-600">Status</label>
              <Badge className='w-fit' variant={device.isVerified ? 'default' : 'secondary'}>
                {device.isVerified ? 'Verified' : 'Pending'}
              </Badge>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Device ID</label>
              <p className="font-mono text-sm w-full wrap-break-word text-gray-600">{device.deviceId}</p>
            </div>
          </div>

          {/* User Information */}
          {device.user && (
            <div>
              <label className="text-sm font-medium text-gray-600 mb-3 block">Device Owner</label>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="font-semibold">{device.user.firstName} {device.user.lastName}</p>
                    <p className="text-sm text-gray-500">{device.user.email}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className='flex flex-col gap-2'>
                    <label className="text-xs text-gray-500">Role</label>
                    <Badge className='w-fit' variant="outline">{device.user.role}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Usage Information */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-3 block">Usage Information</label>
            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-gray-500">Last Used</label>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <p className="text-sm">{format(new Date(device.lastUsed), 'PPp')}</p>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-gray-500">Created</label>
                  <p className="text-sm">{format(new Date(device.createdAt), 'PPP')}</p>
                </div>
              </div>
              
              {device.userAgent && (
                <div>
                  <label className="text-xs text-gray-500">User Agent</label>
                  <p className="text-xs text-gray-600 font-mono break-all">{device.userAgent}</p>
                </div>
              )}
            </div>
          </div>

          {/* Security Information */}
          <div>
            <label className="text-sm font-medium text-gray-600 mb-3 block">Security Information</label>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">Device Verification</span>
                </div>
                <Badge variant={device.isVerified ? 'default' : 'secondary'}>
                  {device.isVerified ? 'Verified' : 'Pending Verification'}
                </Badge>
              </div>
              {!device.isVerified && (
                <p className="text-xs text-gray-500 mt-2">
                  This device requires verification before the user can login.
                </p>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}