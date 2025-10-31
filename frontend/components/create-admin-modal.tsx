'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateModerator } from '@/hooks/use-admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const adminSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type AdminForm = z.infer<typeof adminSchema>;

interface CreateAdminModalProps {
  open: boolean;
  onClose: () => void;
}

export function CreateAdminModal({ open, onClose }: CreateAdminModalProps) {
  const createModeratorMutation = useCreateModerator();

  const form = useForm<AdminForm>({
    resolver: zodResolver(adminSchema),
  });

  const onSubmit = (data: AdminForm) => {
    createModeratorMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        onClose();
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create Admin</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <Input
                {...form.register('firstName')}
                placeholder="John"
                className="mt-1"
              />
              {form.formState.errors.firstName && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.firstName.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                {...form.register('lastName')}
                placeholder="Doe"
                className="mt-1"
              />
              {form.formState.errors.lastName && (
                <p className="text-sm text-red-600 mt-1">{form.formState.errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              {...form.register('email')}
              type="email"
              placeholder="john@example.com"
              className="mt-1"
            />
            {form.formState.errors.email && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.email.message}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              {...form.register('password')}
              type="password"
              placeholder="Enter password"
              className="mt-1"
            />
            {form.formState.errors.password && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.password.message}</p>
            )}
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createModeratorMutation.isPending}>
              {createModeratorMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Admin'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}