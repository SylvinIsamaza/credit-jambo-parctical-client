'use client';

import { useState } from 'react';
import { useChangeEmail } from '@/hooks/use-auth-mutations';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, EyeOff, Mail } from 'lucide-react';

export function ChangeEmailForm() {
  const { user, refreshUser } = useAuth();
  const [newEmail, setNewEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const changeEmailMutation = useChangeEmail();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    changeEmailMutation.mutate(
      { newEmail, password },
      {
        onSuccess: () => {
          setNewEmail('');
          setPassword('');
          refreshUser(); // Refresh user data to show new email
        }
      }
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Mail className="h-5 w-5" />
          Change Email Address
        </CardTitle>
        <CardDescription>
          Current email: {user?.email}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newEmail">New Email Address</Label>
            <Input
              id="newEmail"
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="Enter new email address"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Current Password</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your current password"
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={
              changeEmailMutation.isPending ||
              !newEmail ||
              !password ||
              newEmail === user?.email
            }
          >
            {changeEmailMutation.isPending ? 'Changing...' : 'Change Email'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}