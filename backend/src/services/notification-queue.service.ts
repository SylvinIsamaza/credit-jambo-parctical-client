import { queueService } from './queue.service';
import { NotificationService } from './notification.service';
import { EmailService } from './email.service';
import prisma from '../config/prisma-client';

export class NotificationQueueService {
  static initialize() {
    // Register notification processors
    queueService.registerProcessor('deposit_notification', this.processDepositNotification);
    queueService.registerProcessor('withdrawal_notification', this.processWithdrawalNotification);
    queueService.registerProcessor('insufficient_balance_notification', this.processInsufficientBalanceNotification);
    queueService.registerProcessor('login_notification', this.processLoginNotification);
    queueService.registerProcessor('email_notification', this.processEmailNotification);
  }

  static async processDepositNotification(data: { userId: string; amount: number; newBalance: number }) {
    await NotificationService.sendDepositConfirmation(data.userId, data.amount, data.newBalance);
    
    // Also send email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'deposit_confirmation',
        data: { firstName: user.firstName, amount: data.amount, newBalance: data.newBalance }
      });
    }
  }

  static async processWithdrawalNotification(data: { userId: string; amount: number; newBalance: number }) {
    await NotificationService.sendWithdrawalAlert(data.userId, data.amount, data.newBalance);
    
    // Also send email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'withdrawal_alert',
        data: { firstName: user.firstName, amount: data.amount, newBalance: data.newBalance }
      });
    }
  }

  static async processInsufficientBalanceNotification(data: { userId: string; attemptedAmount: number; currentBalance: number }) {
    await NotificationService.sendInsufficientBalanceAlert(data.userId, data.attemptedAmount, data.currentBalance);
    
    // Also send email notification
    const user = await prisma.user.findUnique({ where: { id: data.userId } });
    if (user) {
      queueService.addJob('email_notification', {
        email: user.email,
        type: 'insufficient_balance_alert',
        data: { firstName: user.firstName, attemptedAmount: data.attemptedAmount, currentBalance: data.currentBalance }
      });
    }
  }

  static async processLoginNotification(data: { userId: string; ipAddress: string; userAgent?: string; deviceName?: string }) {
    await NotificationService.createLoginSuccessNotification(
      data.userId,
      data.ipAddress,
      data.userAgent,
      data.deviceName
    );
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
      }
    } catch (error) {
      console.error('Failed to send email notification:', error);
    }
  }
}