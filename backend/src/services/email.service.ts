import { sendEmail } from '../utils/email';

export class EmailService {
  static async sendWelcomeEmail(email: string, firstName: string) {
    await sendEmail({
      to: email,
      subject: 'Welcome to Credit Jambo',
      template: 'welcome',
      data: { firstName }
    });
  }

  static async sendLoginNotification(email: string, firstName: string, ipAddress: string, userAgent?: string) {
    await sendEmail({
      to: email,
      subject: 'New Login to Your Account',
      template: 'login-notification',
      data: {
        firstName,
        ipAddress,
        userAgent: userAgent || 'Unknown',
        loginTime: new Date().toLocaleString()
      }
    });
  }

  static async sendPasswordResetEmail(email: string, firstName: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Password Reset Request',
      template: 'password-reset',
      data: {
        firstName,
        resetUrl
      }
    });
  }

  static async sendOtpEmail(email: string, code: string, type: string) {
    await sendEmail({
      to: email,
      subject: `Your ${type} Verification Code`,
      template: 'otp-verification',
      data: { code, type }
    });
  }

  static async sendDepositConfirmation(email: string, data: any) {
    await sendEmail({
      to: email,
      subject: 'Deposit Confirmation',
      template: 'deposit-confirmation',
      data
    });
  }

  static async sendWithdrawalAlert(email: string, data: any) {
    await sendEmail({
      to: email,
      subject: 'Withdrawal Alert',
      template: 'withdrawal-alert',
      data
    });
  }

  static async sendInsufficientBalanceAlert(email: string, data: any) {
    await sendEmail({
      to: email,
      subject: 'Insufficient Balance Alert',
      template: 'insufficient-balance-alert',
      data
    });
  }

  static async sendDeviceVerificationAlert(email: string, data: any) {
    await sendEmail({
      to: email,
      subject: 'New Device Login',
      template: 'device-verification',
      data
    });
  }

  static async sendFailedLoginAlert(email: string, data: any) {
    await sendEmail({
      to: email,
      subject: 'Failed Login Attempt',
      template: 'failed-login',
      data
    });
  }

  static async sendEmailVerification(email: string, firstName: string, otp: string) {
    await sendEmail({
      to: email,
      subject: 'Verify Your Email Address',
      template: 'email-verification',
      data: { firstName, otp }
    });
  }

  static async sendLoginOtp(email: string, firstName: string, otp: string) {
    await sendEmail({
      to: email,
      subject: 'Login Verification Code',
      template: 'login-otp',
      data: { firstName, otp }
    });
  }

  static async sendTransactionReversalNotification(email: string, data: any) {
    await sendEmail({
      to: email,
      subject: 'Transaction Reversal Notice',
      template: 'transaction-reversal',
      data
    });
  }

  static async sendAccountActivationNotification(email: string, firstName: string) {
    await sendEmail({
      to: email,
      subject: 'Account Activated',
      template: 'account-activation',
      data: { firstName }
    });
  }

  static async sendAccountDeactivationNotification(email: string, firstName: string, reason: string) {
    await sendEmail({
      to: email,
      subject: 'Account Deactivated',
      template: 'account-deactivation',
      data: { firstName, reason }
    });
  }

  static async sendAdminPasswordSetupEmail(email: string, firstName: string, resetToken: string) {
    const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Admin Account Created - Set Your Password',
      template: 'admin-password-setup',
      data: {
        firstName,
        setupUrl,
        loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
      }
    });
  }

  static async sendCustomerPasswordSetupEmail(email: string, firstName: string, resetToken: string) {
    const setupUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    
    await sendEmail({
      to: email,
      subject: 'Welcome to Credit Ijambo - Set Your Password',
      template: 'customer-password-setup',
      data: {
        firstName,
        setupUrl,
        loginUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login`
      }
    });
  }
}