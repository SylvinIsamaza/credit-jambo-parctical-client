import prisma from '../config/prisma-client';
import { EmailService } from './email.service';

export class OtpService {
  private static generateOtpCode(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  static async generateOtp(userId: string, type: 'LOGIN' | 'TRANSACTION' | 'DEVICE_VERIFICATION'): Promise<string> {
    const code = this.generateOtpCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.otpCode.create({
      data: {
        userId,
        code,
        type,
        expiresAt
      }
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      const { queueService } = await import('./queue.service');
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'otp_email',
        data: { code, type }
      });
    }

    return code;
  }

  static async verifyOtp(userId: string, code: string, type: 'LOGIN' | 'TRANSACTION' | 'DEVICE_VERIFICATION'): Promise<boolean> {
    const otpRecord = await prisma.otpCode.findFirst({
      where: {
        userId,
        code,
        type,
        isUsed: false,
        expiresAt: { gt: new Date() }
      }
    });

    if (!otpRecord) {
      return false;
    }

    await prisma.otpCode.update({
      where: { id: otpRecord.id },
      data: { isUsed: true }
    });

    return true;
  }

  static async cleanupExpiredOtps(): Promise<void> {
    await prisma.otpCode.deleteMany({
      where: {
        OR: [
          { expiresAt: { lt: new Date() } },
          { isUsed: true }
        ]
      }
    });
  }
}