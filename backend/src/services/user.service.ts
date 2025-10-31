import prisma from '../config/prisma-client';
import { UpdateProfileDto } from '../dtos/user-profile.dto';
import { FileService } from './file.service';

export class UserService {
  static async getAllUsers(page: number = 1, limit: number = 10, search?: string) {
    const skip = (page - 1) * limit;
    const maxLimit = Math.min(limit, 100);
    
    const whereClause: any = {};
    if (search) {
      whereClause.OR = [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ];
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
       
          dateOfBirth: true,
          profileImage: true,
          role: true,
          isVerified: true,
          isActive: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: maxLimit
      }),
      prisma.user.count({ where: whereClause })
    ]);

    const pages = Math.ceil(total / maxLimit);

    return { users, total, pages, currentPage: page };
  }

  static async updateProfile(userId: string, data: UpdateProfileDto) {
    return await prisma.user.update({
      where: { id: userId },
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
      
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
       
        dateOfBirth: true,
        profileImage: true,
        isVerified: true,
        createdAt: true
      }
    });
  }

  static async uploadProfileImage(userId: string, buffer: Buffer, originalName: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new Error('User not found');

    // Delete old image if exists
    if (user.profileImage) {
      await FileService.deleteFile(user.profileImage);
    }

    const fileName = await FileService.uploadProfileImage(buffer, originalName);
    
    await prisma.user.update({
      where: { id: userId },
      data: { profileImage: fileName }
    });

    return { profileImage: fileName };
  }

  static async getProfileImageUrl(userId: string) {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user?.profileImage) return null;

    return await FileService.getFileUrl(user.profileImage);
  }

  static async updateUserStatus(userId: string, isActive: boolean) {
    return await prisma.user.update({
      where: { id: userId },
      data: { isActive }
    });
  }
}