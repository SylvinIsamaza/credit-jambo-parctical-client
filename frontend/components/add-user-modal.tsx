'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useCreateUser } from '@/hooks/use-admin';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, UserPlus } from 'lucide-react';

const userSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['CLIENT', 'ADMIN'], { required_error: 'Role is required' }),
  phoneNumber: z.string().optional(),
  dateOfBirth: z.string().optional(),
});

type UserForm = z.infer<typeof userSchema>;

interface AddUserModalProps {
  open: boolean;
  onClose: () => void;
}

export function AddUserModal({ open, onClose }: AddUserModalProps) {
  const [selectedRole, setSelectedRole] = useState<string>('');
  const createUserMutation = useCreateUser();

  const form = useForm<UserForm>({
    resolver: zodResolver(userSchema),
  });

  const onSubmit = (data: UserForm) => {
    createUserMutation.mutate(data, {
      onSuccess: () => {
        form.reset();
        setSelectedRole('');
        onClose();
      }
    });
  };

  const handleRoleChange = (role: string) => {
    setSelectedRole(role);
    form.setValue('role', role as 'CLIENT' | 'ADMIN');
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Add New User
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label htmlFor="role">User Role</Label>
            <Select value={selectedRole} onValueChange={handleRoleChange}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select user role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CLIENT">Customer</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
              </SelectContent>
            </Select>
            {form.formState.errors.role && (
              <p className="text-sm text-red-600 mt-1">{form.formState.errors.role.message}</p>
            )}
          </div>

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
            <Label htmlFor="email">Email Address</Label>
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

          {selectedRole === 'CLIENT' && (
            <>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  {...form.register('phoneNumber')}
                  placeholder="+250 xxx xxx xxx"
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="dateOfBirth">Date of Birth</Label>
                <Input
                  {...form.register('dateOfBirth')}
                  type="date"
                  className="mt-1"
                />
              </div>
            </>
          )}

          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-sm text-blue-800">
              {selectedRole === 'ADMIN' 
                ? 'An email will be sent to the admin with instructions to set their password.'
                : selectedRole === 'CLIENT'
                ? 'An email will be sent to the customer with instructions to set their password.'
                : 'Select a role to see email instructions.'
              }
            </p>
          </div>

          <div className="flex gap-2 justify-end pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={createUserMutation.isPending || !selectedRole}>
              {createUserMutation.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                'Add User'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}