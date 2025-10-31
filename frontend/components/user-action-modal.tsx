'use client';

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle } from 'lucide-react';

interface UserActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  action: 'deactivate' | 'delete';
  userName: string;
  isLoading?: boolean;
}

export function UserActionModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  action, 
  userName,
  isLoading = false 
}: UserActionModalProps) {
  const [reason, setReason] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onConfirm(reason.trim());
      setReason('');
    }
  };

  const handleClose = () => {
    setReason('');
    onClose();
  };

  const isDelete = action === 'delete';

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            {isDelete ? 'Delete User' : 'Deactivate User'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <p className="text-sm text-orange-800">
                {isDelete 
                  ? `Are you sure you want to delete "${userName}"?`
                  : `Are you sure you want to deactivate "${userName}"? This will prevent them from logging in.`
                }
              </p>
            </div>

            <div>
              <Label htmlFor="reason">
                Reason for {action} <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Please provide a reason for ${action}ing this user...`}
                className="mt-1"
                rows={3}
                required
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button 
              type="submit" 
              variant={isDelete ? "destructive" : "default"}
              disabled={!reason.trim() || isLoading}
            >
              {isLoading ? 'Processing...' : (isDelete ? 'Delete User' : 'Deactivate User')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}