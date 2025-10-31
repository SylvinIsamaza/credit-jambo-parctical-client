import { Request, Response } from 'express';

import { OtpService } from '../services/otp.service';

import ServerResponse from '../utils/serverResponse';
import { AuthRequest } from '../types';

export class SecurityController {
  

  static async generateOtp(req: AuthRequest, res: Response) {
    try {
      const { type } = req.body;
      const userId = req.user!.id;

      await OtpService.generateOtp(userId, type);
      return ServerResponse.success(res, 'OTP sent to your email');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async verifyOtp(req: Request, res: Response) {
    try {
      const { code, type } = req.body;
      const userId = req.user!.id;

      const isValid = await OtpService.verifyOtp(userId, code, type);
      if (!isValid) {
        return ServerResponse.error(res, 'Invalid or expired OTP');
      }

      return ServerResponse.success(res, 'OTP verified successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

}