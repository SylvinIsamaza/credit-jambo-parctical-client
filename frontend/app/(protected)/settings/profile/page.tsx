'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks/use-auth';
import { useUpdateProfile, useUploadProfileImage } from '@/hooks/use-profile';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Upload } from 'lucide-react';
import { toast } from 'sonner';

const profileSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),

  dateOfBirth: z.string().optional(),
});

type ProfileForm = z.infer<typeof profileSchema>;

export default function ProfilePage() {
  const { user } = useAuth();
  const updateProfileMutation = useUpdateProfile();
  const uploadImageMutation = useUploadProfileImage();

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      dateOfBirth: user?.dateOfBirth ? new Date(user.dateOfBirth).toISOString().split('T')[0] : '',
    },
  });

  const handleUpdateProfile = (data: ProfileForm) => {
    updateProfileMutation.mutate(data, {
      onSuccess: () => {
        toast.success('Profile updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to update profile');
      },
    });
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    uploadImageMutation.mutate(file, {
      onSuccess: () => {
        toast.success('Profile image updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.response?.data?.message || 'Failed to upload image');
      },
    });
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile Picture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <div className="h-20 w-20 rounded-full overflow-hidden bg-gray-200 relative">
                {user?.profileImage ? (
                  <img
                    src={user.profileImage}
                    alt="Profile"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fallback) fallback.classList.remove('hidden');
                    }}
                  />
                ) : null}
                <div className={`absolute inset-0 flex items-center justify-center text-lg font-medium text-gray-600 ${user?.profileImage ? 'hidden' : ''}`}>
                  {user?.firstName?.[0]?.toUpperCase()}{user?.lastName?.[0]?.toUpperCase()}
                </div>
              </div>
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="profile-image"
                />
                <label htmlFor="profile-image">
                  <Button variant="outline" disabled={uploadImageMutation.isPending} asChild>
                    <span>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadImageMutation.isPending ? 'Uploading...' : 'Change Picture'}
                    </span>
                  </Button>
                </label>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName">First Name</Label>
                  <Input
                    {...profileForm.register('firstName')}
                    className="mt-1"
                  />
                  {profileForm.formState.errors.firstName && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.firstName.message}
                    </p>
                  )}
                </div>
                <div>
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input
                    {...profileForm.register('lastName')}
                    className="mt-1"
                  />
                  {profileForm.formState.errors.lastName && (
                    <p className="mt-1 text-sm text-red-600">
                      {profileForm.formState.errors.lastName.message}
                    </p>
                  )}
                </div>
              </div>
             
              {user?.role === 'CLIENT' && (
                <div>
                <Label htmlFor="dateOfBirth">Date of Birth (Optional)</Label>
                <Input
                  {...profileForm.register('dateOfBirth')}
                  type="date"
                  className="mt-1"
                />
              </div>)}
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  value={user?.email}
                  disabled
                  className="mt-1 bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  To change your email, use the Security page
                </p>
              </div>
              <Button type="submit" disabled={updateProfileMutation.isPending} className="w-full">
                {updateProfileMutation.isPending ? 'Updating...' : 'Update Profile'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}