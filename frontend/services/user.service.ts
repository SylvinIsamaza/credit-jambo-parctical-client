import { protectedApi } from '@/lib/axios';

export const userService = {
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await protectedApi.put('/users/profile', data);
    return response.data.data;
  },

  async uploadProfileImage(file: File): Promise<{ profileImage: string }> {
    const formData = new FormData();
    formData.append('profileImage', file);
    
    const response = await protectedApi.post('/users/profile/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data.data;
  },

  async getProfileImageUrl(): Promise<{ url: string }> {
    const response = await protectedApi.get('/users/profile/image-url');
    return response.data.data;
  },

  async getAllUsers(page = 1, limit = 10, search?: string): Promise<UsersResponse> {
    const response = await protectedApi.get('/users/all', {
      params: { page, limit, search }
    });
    return response.data.data;
  },

  async activateUser(userId: string): Promise<void> {
    await protectedApi.patch(`/users/${userId}/activate`);
  },

  async deactivateUser(userId: string): Promise<void> {
    await protectedApi.patch(`/users/${userId}/deactivate`);
  },
};