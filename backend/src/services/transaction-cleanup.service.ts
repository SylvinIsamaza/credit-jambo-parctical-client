import prisma from '../config/prisma-client';

export class TransactionCleanupService {
  static async cancelExpiredTransactions(): Promise<void> {
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);

    await prisma.transaction.updateMany({
      where: {
        status: 'PENDING',
        createdAt: { lt: twentyMinutesAgo }
      },
      data: { status: 'CANCELLED' }
    });
  }

  static startCleanupScheduler(): void {
    // Run every 5 minutes
    setInterval(async () => {
      try {
        await this.cancelExpiredTransactions();
      } catch (error) {
        console.error('Transaction cleanup error:', error);
      }
    }, 5 * 60 * 1000);
  }
}