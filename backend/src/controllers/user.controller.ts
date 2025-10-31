import { Request, Response } from 'express';
import { UserService } from '../services/user.service';
import { UpdateProfileDto } from '../dtos/user-profile.dto';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/serverResponse';
import multer from 'multer';

const upload = multer({ storage: multer.memoryStorage() });

export class UserController {
  static async getAllUsers(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const search = req.query.search as string;

      const result = await UserService.getAllUsers(page, limit, search);
      return ServerResponse.success(res, 'Users retrieved successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async updateProfile(req: AuthRequest, res: Response) {
    try {
      const data: UpdateProfileDto = req.body;
      const userId = req.user!.id;

      const result = await UserService.updateProfile(userId, data);
      return ServerResponse.success(res, 'Profile updated successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async uploadProfileImage(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const file = req.file;

      if (!file) {
        return ServerResponse.error(res, 'No file uploaded');
      }

      const result = await UserService.uploadProfileImage(userId, file.buffer, file.originalname);
      return ServerResponse.success(res, 'Profile image uploaded successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getProfileImageUrl(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const url = await UserService.getProfileImageUrl(userId);
      
      if (!url) {
        return ServerResponse.error(res, 'No profile image found', 404);
      }

      return ServerResponse.success(res, 'Profile image URL retrieved', { url });
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async activateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      await UserService.updateUserStatus(userId, true);
      return ServerResponse.success(res, 'User activated successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async deactivateUser(req: Request, res: Response) {
    try {
      const { userId } = req.params;
      
      await UserService.updateUserStatus(userId, false);
      return ServerResponse.success(res, 'User deactivated successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static uploadMiddleware = upload.single('profileImage');
}