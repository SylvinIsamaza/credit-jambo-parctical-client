import prisma from '../config/prisma-client';
import { NotificationType } from '../generated/prisma';
import { queueService } from './queue.service';
import { EmailService } from './email.service';

interface NotificationData {
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  metadata?: any;
}

export class NotificationService {
  static initialize() {
    queueService.registerProcessor('deposit_notification', this.processDepositNotification.bind(this));
    queueService.registerProcessor('withdrawal_notification', this.processWithdrawalNotification.bind(this));
    queueService.registerProcessor('insufficient_balance_notification', this.processInsufficientBalanceNotification.bind(this));

    queueService.registerProcessor('transaction_reversal_notification', this.processTransactionReversalNotification.bind(this));
    queueService.registerProcessor('device_verification_notification', this.processDeviceVerificationNotification.bind(this));
    queueService.registerProcessor('account_activation_notification', this.processAccountActivationNotification.bind(this));
    queueService.registerProcessor('account_deactivation_notification', this.processAccountDeactivationNotification.bind(this));
    queueService.registerProcessor('email_notification', this.processEmailNotification.bind(this));
  }

  static async createNotification(data: NotificationData) {
    return await prisma.notification.create({
      data: {
        userId: data.userId,
        title: data.title,
        message: data.message,
        type: data.type,
        metadata: data.metadata || {}
      }
    });
  }

  static async createLoginSuccessNotification(
    userId: string, 
    ipAddress: string, 
    userAgent?: string,
    deviceName?: string
  ) {
    const metadata = {
      ipAddress,
      userAgent,
      deviceName,
      timestamp: new Date().toISOString(),
      actionType: 'LOGIN_SUCCESS'
    };

    return await this.createNotification({
      userId,
      title: 'Successful Login',
      message: `You successfully logged in from ${deviceName || 'Unknown Device'}`,
      type: 'LOGIN_SUCCESS',
      metadata
    });
  }

  static async createPasswordResetNotification(userId: string, ipAddress: string, userAgent?: string) {
    const metadata = {
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      actionType: 'PASSWORD_RESET'
    };

    return await this.createNotification({
      userId,
      title: 'Password Reset',
      message: 'Your password has been successfully reset',
      type: 'PASSWORD_RESET',
      metadata
    });
  }

  static async createEmailChangedNotification(
    userId: string, 
    oldEmail: string, 
    newEmail: string,
    ipAddress: string,
    userAgent?: string
  ) {
    const metadata = {
      oldEmail,
      newEmail,
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      actionType: 'EMAIL_CHANGED'
    };

    return await this.createNotification({
      userId,
      title: 'Email Address Changed',
      message: `Your email address has been changed from ${oldEmail} to ${newEmail}`,
      type: 'EMAIL_CHANGED',
      metadata
    });
  }

  static async createPinChangedNotification(userId: string, ipAddress: string, userAgent?: string) {
    const metadata = {
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      actionType: 'TRANSACTION_PIN_CHANGED'
    };

    return await this.createNotification({
      userId,
      title: 'Transaction PIN Changed',
      message: 'Your transaction PIN has been successfully changed',
      type: 'TRANSACTION_PIN_CHANGED',
      metadata
    });
  }

  static async createPasswordChangedNotification(userId: string, ipAddress: string, userAgent?: string) {
    const metadata = {
      ipAddress,
      userAgent,
      timestamp: new Date().toISOString(),
      actionType: 'ACCOUNT_PASSWORD_CHANGED'
    };

    return await this.createNotification({
      userId,
      title: 'Account Password Changed',
      message: 'Your account password has been successfully changed',
      type: 'ACCOUNT_PASSWORD_CHANGED',
      metadata
    });
  }

  static async getUserNotifications(userId: string, filters?: {
    type?: NotificationType;
    isRead?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: any = { userId };

    if (filters?.type) {
      where.type = filters.type;
    }
    if (filters?.isRead !== undefined) {
      where.isRead = filters.isRead;
    }
    if (filters?.dateFrom || filters?.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) {
        where.createdAt.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.createdAt.lte = filters.dateTo;
      }
    }

    return await prisma.notification.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async markAsRead(notificationId: string, userId: string) {
    return await prisma.notification.update({
      where: { 
        id: notificationId,
        userId // Ensure user can only mark their own notifications
      },
      data: { isRead: true }
    });
  }

  static async getNotificationById(notificationId: string, userId: string) {
    return await prisma.notification.findFirst({
      where: { 
        id: notificationId,
        userId
      }
    });
  }

  static async markAllAsRead(userId: string) {
    return await prisma.notification.updateMany({
      where: { 
        userId,
        isRead: false
      },
      data: { isRead: true }
    });
  }

  static async getUnreadCount(userId: string) {
    return await prisma.notification.count({
      where: { 
        userId,
        isRead: false
      }
    });
  }

  static async sendDepositConfirmation(userId: string, amount: number, newBalance: number) {
    queueService.addJob('deposit_notification', { userId, amount, newBalance });
  }

  static async processDepositNotification(data: { userId: string; amount: number; newBalance: number }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Deposit Successful',
      message: `Your deposit of RWF ${data.amount.toLocaleString()} has been processed successfully.`,
      type: 'DEPOSIT_SUCCESS',
      metadata: { amount: data.amount, timestamp: new Date().toISOString() }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'deposit_confirmation',
        data: { 
          firstName: user.firstName, 
          amount: data.amount.toLocaleString(),
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
      });
    }
  }

  static async sendWithdrawalAlert(userId: string, amount: number, newBalance: number) {
    queueService.addJob('withdrawal_notification', { userId, amount, newBalance });
  }

  static async processWithdrawalNotification(data: { userId: string; amount: number; newBalance: number }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Withdrawal Processed',
      message: `Your withdrawal of RWF ${data.amount.toLocaleString()} has been processed successfully.`,
      type: 'WITHDRAWAL_SUCCESS',
      metadata: { amount: data.amount, timestamp: new Date().toISOString() }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'withdrawal_alert',
        data: { 
          firstName: user.firstName, 
          amount: data.amount.toLocaleString(),
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
      });
    }
  }

  static async sendInsufficientBalanceAlert(userId: string, attemptedAmount: number, currentBalance: number) {
    queueService.addJob('insufficient_balance_notification', { userId, attemptedAmount, currentBalance });
  }

  static async processInsufficientBalanceNotification(data: { userId: string; attemptedAmount: number; currentBalance: number }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Insufficient Balance',
      message: `Withdrawal attempt of RWF ${data.attemptedAmount.toLocaleString()} failed due to insufficient funds.`,
      type: 'INSUFFICIENT_BALANCE',
      metadata: { attemptedAmount: data.attemptedAmount, timestamp: new Date().toISOString() }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'insufficient_balance_alert',
        data: { 
          firstName: user.firstName, 
          requestedAmount: data.attemptedAmount.toLocaleString()
        }
      });
    }
  }



  static async processEmailNotification(data: { email: string; type: string; data: any }) {
    try {
      switch (data.type) {
        case 'deposit_confirmation':
          await EmailService.sendDepositConfirmation(data.email, data.data);
          break;
        case 'withdrawal_alert':
          await EmailService.sendWithdrawalAlert(data.email, data.data);
          break;
        case 'insufficient_balance_alert':
          await EmailService.sendInsufficientBalanceAlert(data.email, data.data);
          break;
        case 'welcome_email':
          await EmailService.sendWelcomeEmail(data.email, data.data.firstName);
          break;
        case 'email_verification':
          await EmailService.sendEmailVerification(data.email, data.data.firstName, data.data.otp);
          break;
        case 'login_otp':
          await EmailService.sendLoginOtp(data.email, data.data.firstName, data.data.otp);
          break;
        case 'login_notification':
          await EmailService.sendLoginNotification(data.email, data.data.firstName, data.data.ipAddress, data.data.userAgent);
          break;
        case 'password_reset':
          await EmailService.sendPasswordResetEmail(data.email, data.data.firstName, data.data.resetToken);
          break;
        case 'otp_email':
          await EmailService.sendOtpEmail(data.email, data.data.code, data.data.type);
          break;
        case 'transaction_reversal':
          await EmailService.sendTransactionReversalNotification(data.email, data.data);
          break;
        case 'device_verification':
          await EmailService.sendDeviceVerificationAlert(data.email, data.data);
          break;
        case 'account_activation':
          await EmailService.sendAccountActivationNotification(data.email, data.data.firstName);
          break;
        case 'account_deactivation':
          await EmailService.sendAccountDeactivationNotification(data.email, data.data.firstName, data.data.reason);
          break;
        case 'admin_password_setup':
          await EmailService.sendAdminPasswordSetupEmail(data.email, data.data.firstName, data.data.resetToken);
          break;
        case 'customer_password_setup':
          await EmailService.sendCustomerPasswordSetupEmail(data.email, data.data.firstName, data.data.resetToken);
          break;
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }

  static async sendTransactionReversalNotification(userId: string, transactionData: any) {
    queueService.addJob('transaction_reversal_notification', { userId, transactionData });
  }

  static async processTransactionReversalNotification(data: { userId: string; transactionData: any }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Transaction Reversed',
      message: `Your ${data.transactionData.originalType.toLowerCase()} transaction of RWF ${data.transactionData.amount.toLocaleString()} has been reversed.`,
      type: 'TRANSACTION_REVERSED',
      metadata: { 
        transactionId: data.transactionData.transactionId,
        amount: data.transactionData.amount,
        reason: data.transactionData.reason,
        timestamp: new Date().toISOString() 
      }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'transaction_reversal',
        data: { 
          firstName: user.firstName,
          transactionId: data.transactionData.transactionId,
          originalType: data.transactionData.originalType,
          amount: data.transactionData.amount.toLocaleString(),
          reversalDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          reason: data.transactionData.reason
        }
      });
    }
  }

  static async sendDeviceVerificationNotification(userId: string, deviceData: any) {
    queueService.addJob('device_verification_notification', { userId, deviceData });
  }

  static async processDeviceVerificationNotification(data: { userId: string; deviceData: any }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Device Verified',
      message: `Your device "${data.deviceData.deviceName}" has been verified and is now trusted.`,
      type: 'DEVICE_VERIFIED',
      metadata: { 
        deviceId: data.deviceData.deviceId,
        deviceName: data.deviceData.deviceName,
        timestamp: new Date().toISOString() 
      }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'device_verification',
        data: { 
          firstName: user.firstName,
          deviceName: data.deviceData.deviceName,
          verificationDate: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
        }
      });
    }
  }

  static async sendAccountActivationNotification(userId: string) {
    queueService.addJob('account_activation_notification', { userId });
  }

  static async processAccountActivationNotification(data: { userId: string }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Account Activated',
      message: 'Your account has been activated and you can now access all services.',
      type: 'SUCCESS',
      metadata: { 
        actionType: 'ACCOUNT_ACTIVATED',
        timestamp: new Date().toISOString() 
      }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'account_activation',
        data: { firstName: user.firstName }
      });
    }
  }

  static async sendAccountDeactivationNotification(userId: string, reason: string) {
    queueService.addJob('account_deactivation_notification', { userId, reason });
  }

  static async processAccountDeactivationNotification(data: { userId: string; reason: string }) {
    await this.createNotification({
      userId: data.userId,
      title: 'Account Deactivated',
      message: `Your account has been deactivated. Reason: ${data.reason}`,
      type: 'WARNING',
      metadata: { 
        reason: data.reason,
        actionType: 'ACCOUNT_DEACTIVATED',
        timestamp: new Date().toISOString() 
      }
    });
    
    // Queue email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'account_deactivation',
        data: { firstName: user.firstName, reason: data.reason }
      });
    }
  }
}