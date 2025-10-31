import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Response } from "express";
import {
  CustomerRegistrationDto,
  CustomerLoginDto,
  CustomerResponseDto,
} from "../dtos/customer.dto";
import { JwtPayload, DeviceInfo } from "../types";
import { DeviceService } from "./device.service";
import { AuditService } from "./audit.service";
import { EmailService } from "./email.service";
import { OtpService } from "./otp.service";
import { RedisService } from "./redis.service";
import { InternalNotificationService } from "./internal-notification.service";
import { AccountUtils } from "../utils/account";
import prisma from "../config/prisma-client";
import crypto from "crypto";
import { DeviceUtils } from "../utils/device";

export class AuthService {
  private static hashPassword(password: string): string {
    return bcrypt.hashSync(password, 12);
  }

  private static verifyPassword(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  private static generateAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, process.env.JWT_SECRET!, {
      expiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    });
  }

  private static generateRefreshToken(payload: { userId: string; sessionId: string }): string {
    return jwt.sign(payload, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
    });
  }

  private static getDeviceInfo(userAgent?: string): { platform?: string } {
    if (!userAgent) return {};
    const platform = userAgent.includes("Windows")
      ? "Windows"
      : userAgent.includes("Mac")
      ? "macOS"
      : userAgent.includes("Linux")
      ? "Linux"
      : userAgent.includes("Android")
      ? "Android"
      : userAgent.includes("iOS")
      ? "iOS"
      : "Unknown";
    return { platform };
  }

  static async register(
    data: CustomerRegistrationDto & { ipAddress: string; userAgent?: string }
  ): Promise<{ message: string }> {
    const hashedPassword = this.hashPassword(data.password);
    const { platform } = this.getDeviceInfo(data.userAgent);

    const accountNumber = await AccountUtils.generateAccountNumber();
    
    const user = await prisma.user.create({
      data: {
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        role: 'CLIENT',
        accounts: {
          create: {
            accountNumber,
            accountType: 'SAVINGS',
            balance: 0
          }
        }
      },
      include: {
        accounts: true
      }
    });

    const device = await DeviceService.registerDevice(user.id, {
      deviceId: data.deviceId,
      platform,
      deviceName: DeviceUtils.generateDeviceName(data.userAgent),
      userAgent: data.userAgent,
      ipAddress: data.ipAddress,
    });

    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        deviceId: device.id,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: accessExpiresAt,
        refreshExpiresAt,
      },
    });

    const accessToken = this.generateAccessToken({
      userId: user.id,
      deviceId: device.id,
      sessionId: session.id,
    });

    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    // Test Redis connection first
    const redisConnected = await RedisService.testConnection();
    console.log('Redis connection status (register):', redisConnected);
    
    // Store session in Redis
    await RedisService.setSession(session.id, {
      userId: user.id,
      deviceId: device.id,
      isActive: true
    }, 15 * 60);
    
    await RedisService.addUserSession(user.id, session.id);
    await RedisService.setRefreshToken(user.id, refreshToken, 7 * 24 * 60 * 60);

    await AuditService.log({
      userId: user.id,
      deviceId: device.id,
      action: "REGISTER",
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      platform,
    });

    // Queue welcome email
    const { queueService } = await import('./queue.service');
    queueService.addJob('email_notification', {
      email: user.email,
      type: 'welcome_email',
      data: { firstName: user.firstName }
    });

    // Send email verification OTP
    const otp = await OtpService.generateOtp(user.id, 'EMAIL_VERIFICATION');
    queueService.addJob('email_notification', {
      email: user.email,
      type: 'email_verification',
      data: { firstName: user.firstName, otp }
    });

    return {
      message: "Registration successful. Please check your email to verify your account.",
     
    };
  }

  static async login(
    data: CustomerLoginDto & { ipAddress: string; userAgent?: string; loginOtp?: string }
  ): Promise<{ accessToken: string; refreshToken: string; requiresOtp?: boolean; userId?: string }> {
    const user = await prisma.user.findUnique({
      where: { email: data.email },
      include: { accounts: true,devices: true }
    });

    if (user) {
      const attempts = await RedisService.getLoginAttempts(data.email);
      if (attempts >= 5) {
        throw new Error("Account temporarily locked due to too many failed login attempts");
      }
    }

    if (!user || !this.verifyPassword(data.password, user.password)) {
      // Send failed login notification if user exists
      if (user) {
        await InternalNotificationService.createNotification(
          user.id,
          'Failed Login Attempt',
          `Failed login attempt from ${data.ipAddress}`,
          'SECURITY'
        );
        
        const newAttempts = await RedisService.incrementLoginAttempts(data.email);
        
        // Deactivate user after 5 failed attempts
        if (newAttempts >= 5) {
          await prisma.user.update({
            where: { id: user.id },
            data: { isActive: false }
          });
          
          await AuditService.log({
            userId: user.id,
            action: "ACCOUNT_DEACTIVATED",
            resource: "LOGIN_ATTEMPTS",
            details: { attempts: newAttempts },
            ipAddress: data.ipAddress,
            userAgent: data.userAgent
          });
          
          throw new Error("Account has been deactivated due to multiple failed login attempts");
        }
      }
      
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Account deactivated please contact support for activation");
    }

    await RedisService.resetLoginAttempts(data.email);

    // If no OTP provided, send OTP and require verification
    if (!data.loginOtp) {
      const otp = await OtpService.generateOtp(user.id, 'LOGIN');
      console.log("====OTP====")
      console.log(otp)
      const { queueService } = await import('./queue.service');
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'login_otp',
        data: { firstName: user.firstName, otp }
      });
      
      return {
        requiresOtp: true,
        userId: user.id,
        accessToken: '',
        refreshToken: ''
      };
    }

    // Verify OTP if provided
    const isValidOtp = await OtpService.verifyOtp(user.id, data.loginOtp, 'LOGIN');
    if (!isValidOtp) {
      throw new Error('Invalid or expired OTP');
    }

    let device = user.devices.find((device)=>device.deviceId==data.deviceId);
    
    if (!device && (user.role === "ADMIN")) {
      device = await DeviceService.registerDevice(user.id, {
        deviceId: data.deviceId,
        platform: this.getDeviceInfo(data.userAgent).platform,
        deviceName: DeviceUtils.generateDeviceName(data.userAgent),
        userAgent: data.userAgent,
        ipAddress: data.ipAddress,
      });
      
      // Auto-verify admin devices
      await prisma.device.update({
        where: { id: device.id },
        data: { isVerified: true }
      });
    }

    if (!device && user.role === "CLIENT") {
      throw new Error("You can not login with this device");
    }

    if (!device?.isVerified && user.role === "CLIENT") {
      throw new Error("You can not login with this device");
    }

    const { platform } = this.getDeviceInfo(data.userAgent);

    if (device) {
      await prisma.device.update({
        where: { id: device.id },
        data: {
          lastUsed: new Date(),
          userAgent: data.userAgent,
          platform,
        },
      });
    }

    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    
    const session = await prisma.session.create({
      data: {
        userId: user.id,
        deviceId: device!.id,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        expiresAt: accessExpiresAt,
        refreshExpiresAt,
      },
    });

    const accessToken = this.generateAccessToken({
      userId: user.id,
      deviceId: device!.id,
      sessionId: session.id,
    });

    const refreshToken = this.generateRefreshToken({
      userId: user.id,
      sessionId: session.id,
    });

    // Test Redis connection first
    const redisConnected = await RedisService.testConnection();
    console.log('Redis connection status (login):', redisConnected);
    
    // Store session in Redis
    await RedisService.setSession(session.id, {
      userId: user.id,
      deviceId: device!.id,
      isActive: true
    }, 15 * 60);
    
    await RedisService.addUserSession(user.id, session.id);
    await RedisService.setRefreshToken(user.id, refreshToken, 7 * 24 * 60 * 60);

    await AuditService.log({
      userId: user.id,
      deviceId: device!.id,
      action: "LOGIN",
      ipAddress: data.ipAddress,
      userAgent: data.userAgent,
      platform,
    });

    // Send login notification with consistent metadata structure
    const { NotificationService } = await import('./notification.service');
    await NotificationService.createLoginSuccessNotification(
      user.id,
      data.ipAddress,
      data.userAgent,
      DeviceUtils.generateDeviceName(data.userAgent)
    );

    // Queue login notification email
    const { queueService } = await import('./queue.service');
    queueService.addJob('email_notification', {
      email: user.email,
      type: 'login_notification',
      data: { firstName: user.firstName, ipAddress: data.ipAddress, userAgent: data.userAgent }
    });

    return {
      
      accessToken,
      refreshToken
    };
  }

  static verifyToken(token: string): JwtPayload {
    return jwt.verify(token, process.env.JWT_SECRET!) as JwtPayload;
  }

  static async validateSession(sessionId: string): Promise<boolean> {
    console.log('Validating session:', sessionId);
    
    // Check Redis first for faster validation
    const redisSession = await RedisService.getSession(sessionId);
    console.log('Redis session found:', redisSession);
    
    if (!redisSession) {
      console.log('No Redis session found, checking database');
      
      // Fallback to database if needed
      const session = await prisma.session.findUnique({
        where: { id: sessionId },
      });
      
      console.log('Database session:', session);
      const isValid = session?.isActive === true && session.expiresAt > new Date();
      console.log('Session validation result:', isValid);
      
      return isValid;
    }

    console.log('Redis session is valid');
    return true;
  }

  static async refreshToken(refreshToken: string, res: Response): Promise<{ accessToken: string; refreshToken: string }> {
    const payload = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as { userId: string; sessionId: string };
    
    // Validate refresh token in Redis
    const isValidRefreshToken = await RedisService.validateRefreshToken(payload.userId, refreshToken);
    if (!isValidRefreshToken) {
      throw new Error('Invalid refresh token');
    }

    const session = await prisma.session.findUnique({
      where: { 
        id: payload.sessionId,
        isActive: true,
        refreshExpiresAt: { gt: new Date() }
      },
      include: { device: true }
    });

    if (!session) {
      throw new Error('Invalid refresh token');
    }

    const newAccessToken = this.generateAccessToken({
      userId: payload.userId,
      deviceId: session.deviceId,
      sessionId: session.id,
    });

    const newRefreshToken = this.generateRefreshToken({
      userId: payload.userId,
      sessionId: session.id,
    });

    const accessExpiresAt = new Date(Date.now() + 15 * 60 * 1000);
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await prisma.session.update({
      where: { id: session.id },
      data: {
        expiresAt: accessExpiresAt,
        refreshExpiresAt,
        lastUsed: new Date()
      },
    });

    // Update Redis session
    await RedisService.setSession(session.id, {
      userId: payload.userId,
      deviceId: session.deviceId,
      ipAddress: session.ipAddress,
      userAgent: session.userAgent
    });

    // Update refresh token in Redis
    await RedisService.deleteRefreshToken(payload.userId, refreshToken);
    await RedisService.setRefreshToken(payload.userId, newRefreshToken);

    // Set new tokens in cookies
    res.cookie('accessToken', newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });
    
    res.cookie('refreshToken', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  static async forgotPassword(email: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { email }
    });

    if (!user) {
      throw new Error('User not found');
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken: resetToken,
        passwordResetExpires: resetExpires
      }
    });

    const { queueService } = await import('./queue.service');
    queueService.addJob('email_notification', {
      email: user.email,
      type: 'password_reset',
      data: { firstName: user.firstName, resetToken }
    });
  }

  static async resetPassword(token: string, newPassword: string): Promise<void> {
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gt: new Date() }
      }
    });

    if (!user) {
      throw new Error('Invalid or expired reset token');
    }

    const hashedPassword = this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null
      }
    });

    // Revoke all sessions
    await prisma.session.updateMany({
      where: { userId: user.id },
      data: { isActive: false }
    });
  }

  static async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        dateOfBirth: true,
        profileImage: true,
        role: true,
        isVerified: true,
        createdAt: true,
        accounts: {
          select: {
            id: true,
            accountNumber: true,
            accountType: true,
            balance: true
          }
        }
      }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Convert profileImage filename to full URL
    let profileImageUrl = null;
    if (user.profileImage) {
      try {
        const { FileService } = await import('./file.service');
        profileImageUrl = await FileService.getFileUrl(user.profileImage);
      } catch (error) {
        console.warn('Failed to get profile image URL:', error);
      }
    }

    return {
      ...user,
      profileImage: profileImageUrl
    };
  }

  static async logout(
    sessionId: string,
    userId: string,
    ipAddress: string,
    userAgent?: string,
    res?: Response
  ) {
    await prisma.session.update({
      where: { id: sessionId },
      data: { isActive: false },
    });

    // Clean up Redis
    await RedisService.deleteSession(sessionId);
    await RedisService.removeUserSession(userId, sessionId);

    // Clear cookies
    if (res) {
      res.clearCookie('accessToken');
      res.clearCookie('refreshToken');
    }

    await AuditService.log({
      userId,
      action: "LOGOUT",
      ipAddress,
      userAgent,
    });
  }

  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!this.verifyPassword(currentPassword, user.password)) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = this.hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword }
    });

    await AuditService.log({
      userId,
      action: "PASSWORD_CHANGED",
      ipAddress,
      userAgent,
    });

    // Create password changed notification
    const { NotificationService } = await import('./notification.service');
    await NotificationService.createPasswordChangedNotification(userId, ipAddress, userAgent);
  }

  static async changeEmail(
    userId: string,
    newEmail: string,
    password: string,
    ipAddress: string,
    userAgent?: string
  ): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (!this.verifyPassword(password, user.password)) {
      throw new Error('Password is incorrect');
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: newEmail }
    });

    if (existingUser && existingUser.id !== userId) {
      throw new Error('Email already in use');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { email: newEmail }
    });

    await AuditService.log({
      userId,
      action: "EMAIL_CHANGED",
      details: { oldEmail: user.email, newEmail },
      ipAddress,
      userAgent,
    });

    // Create email changed notification
    const { NotificationService } = await import('./notification.service');
    await NotificationService.createEmailChangedNotification(
      userId,
      user.email,
      newEmail,
      ipAddress,
      userAgent
    );
  }

  static async verifyEmail(userId: string, otp: string): Promise<void> {
    const isValidOtp = await OtpService.verifyOtp(userId, otp, 'EMAIL_VERIFICATION');
    if (!isValidOtp) {
      throw new Error('Invalid or expired OTP');
    }

    await prisma.user.update({
      where: { id: userId },
      data: { isVerified: true }
    });
  }

  static async resendVerification(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (user.isVerified) {
      throw new Error('Email already verified');
    }

    const otp = await OtpService.generateOtp(userId, 'EMAIL_VERIFICATION');
    const { queueService } = await import('./queue.service');
    queueService.addJob('email_notification', {
      email: user.email,
      type: 'email_verification',
      data: { firstName: user.firstName, otp }
    });
  }

  static async validateWithdrawal(userId: string, amount: number, pin?: string, password?: string): Promise<{ validated: boolean }> {
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Check if user has PIN
    const hasPin = !!user.transactionPin;

    if (hasPin && pin) {
      const { PinService } = await import('./pin.service');
      const isValidPin = await PinService.verifyTransactionPin(userId, pin);
      if (!isValidPin) {
        throw new Error('Invalid PIN');
      }
    } else if (!hasPin && password) {
      const isValidPassword = this.verifyPassword(password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }
    } else {
      throw new Error('PIN or password required');
    }

    return { validated: true };
  }
}
