import { Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { RegisterDto, LoginDto } from '../dtos/auth.dto';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/serverResponse';
import { DeviceService } from '../services/device.service';
import { AuditService } from '../services/audit.service';

export class AuthController {
  static async register(req: Request, res: Response) {
    try {
      const data: RegisterDto = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'];
      
      const result = await AuthService.register({ ...data, ipAddress, userAgent });
      return ServerResponse.created(res, 'Registration successful', result);
    } catch (error: any) {
      if (error.code === 'P2002') {
        return ServerResponse.error(res, 'Email already registered');
      }
      return ServerResponse.error(res, error.message);
    }
  }

  static async login(req: Request, res: Response) {
    try {
      const data: LoginDto = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'];
      
      const result = await AuthService.login({ ...data, ipAddress, userAgent });
      return ServerResponse.success(res, 'Login successful', result);
    } catch (error: any) {
      return ServerResponse.unauthenticated(res, error.message);
    }
  }

  static async refreshToken(req: Request, res: Response) {
    try {
      const refreshToken = req.body?.refreshToken;
      if (!refreshToken) {
        return ServerResponse.unauthenticated(res, 'Refresh token not found');
      }
      const result = await AuthService.refreshToken(refreshToken, res);
      return ServerResponse.success(res, 'Token refreshed successfully', result);
    } catch (error: any) {
      return ServerResponse.unauthenticated(res, error.message);
    }
  }

  static async logout(req: AuthRequest, res: Response) {
    try {
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'];
      
      await AuthService.logout(req.user!.sessionId, req.user!.id, ipAddress, userAgent, res);
      return ServerResponse.success(res, 'Logged out successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getDevices(req: AuthRequest, res: Response) {
    try {
      const { isVerified, platform, dateFrom, dateTo } = req.query;
      
      const filters: any = {};
      if (isVerified !== undefined) {
        filters.isVerified = isVerified === 'true';
      }
      if (platform) {
        filters.platform = platform as string;
      }
      if (dateFrom) {
        filters.dateFrom = new Date(dateFrom as string);
      }
      if (dateTo) {
        const toDate = new Date(dateTo as string);
        toDate.setHours(23, 59, 59, 999);
        filters.dateTo = toDate;
      }
      
      const devices = await DeviceService.getUserDevices(req.user!.id, filters);
      return ServerResponse.success(res, 'Devices retrieved successfully', devices);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getActiveSessions(req: AuthRequest, res: Response) {
    try {
      const { isActive, dateFrom, dateTo } = req.query;
      
      const filters: any = {};
      if (isActive !== undefined) {
        filters.isActive = isActive === 'true';
      }
      if (dateFrom) {
        filters.dateFrom = new Date(dateFrom as string);
      }
      if (dateTo) {
        const toDate = new Date(dateTo as string);
        toDate.setHours(23, 59, 59, 999);
        filters.dateTo = toDate;
      }
      
      const sessions = await DeviceService.getActiveSessions(req.user!.id, filters);
      return ServerResponse.success(res, 'Active sessions retrieved successfully', sessions);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async revokeSession(req: AuthRequest, res: Response) {
    try {
      const { sessionId } = req.params;
      await DeviceService.revokeSession(sessionId, req.user!.id);
      return ServerResponse.success(res, 'Session revoked successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async revokeAllSessions(req: AuthRequest, res: Response) {
    try {
      await DeviceService.revokeAllSessions(req.user!.id, req.user!.sessionId);
      return ServerResponse.success(res, 'All other sessions revoked successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async forgotPassword(req: Request, res: Response) {
    try {
      const { email } = req.body;
      await AuthService.forgotPassword(email);
      return ServerResponse.success(res, 'Password reset email sent successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async resetPassword(req: Request, res: Response) {
    try {
      const { token, password } = req.body;
      await AuthService.resetPassword(token, password);
      return ServerResponse.success(res, 'Password reset successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async verifyDevice(req: AuthRequest, res: Response) {
    try {
      const { deviceId } = req.params;
      await DeviceService.verifyDevice(deviceId, req.user!.id);
      return ServerResponse.success(res, 'Device verified successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getProfile(req: AuthRequest, res: Response) {
    try {
      const profile = await AuthService.getProfile(req.user!.id);
      return ServerResponse.success(res, 'Profile retrieved successfully', profile);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async changePassword(req: AuthRequest, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'];
      
      await AuthService.changePassword(req.user!.id, currentPassword, newPassword, ipAddress, userAgent);
      return ServerResponse.success(res, 'Password changed successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async changeEmail(req: AuthRequest, res: Response) {
    try {
      const { newEmail, password } = req.body;
      const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
      const userAgent = req.headers['user-agent'];
      
      await AuthService.changeEmail(req.user!.id, newEmail, password, ipAddress, userAgent);
      return ServerResponse.success(res, 'Email changed successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async verifyEmail(req: Request, res: Response) {
    try {
      const { userId, otp } = req.body;
      await AuthService.verifyEmail(userId, otp);
      return ServerResponse.success(res, 'Email verified successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async resendVerification(req: Request, res: Response) {
    try {
      const { userId } = req.body;
      await AuthService.resendVerification(userId);
      return ServerResponse.success(res, 'Verification email sent');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async validateWithdrawal(req: AuthRequest, res: Response) {
    try {
      const { amount, pin, password } = req.body;
      const result = await AuthService.validateWithdrawal(req.user!.id, amount, pin, password);
      return ServerResponse.success(res, 'Withdrawal validated', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }
}