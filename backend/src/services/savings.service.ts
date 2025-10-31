import { TransactionType } from "@prisma/client";
import {
  TransactionResponseDto,
  CustomerResponseDto,
} from "../dtos/customer.dto";
import { TransactionDto } from "../dtos/transaction.dto";
import prisma from "../config/prisma-client";
import { NotificationService } from "./notification.service";

import { RefIdGenerator } from "../utils/refId";

export class SavingsService {
  static async deposit(
    userId: string,
    data: TransactionDto
  ): Promise<TransactionResponseDto> {
    const account = await prisma.account.findFirst({
      where: { userId, isActive: true }
    });

    if (!account) {
      throw new Error('No active account found');
    }

    // Check if deposit would cause balance overflow (max: 99,999,999.99)
    const maxBalance = 99999999.99;
    const currentBalance = account.balance.toNumber();
    if (currentBalance + data.amount > maxBalance) {
      throw new Error(`Deposit would exceed maximum balance limit of $${maxBalance.toLocaleString()}`);
    }

    

    // Process immediately if no PIN required
    const result = await prisma.$transaction(async (tx) => {
      const updatedAccount = await tx.account.update({
        where: { id: account.id },
        data: {
          balance: {
            increment: data.amount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          refId: RefIdGenerator.generateTransactionRefId(),
          accountId: account.id,
          type: TransactionType.DEPOSIT,
          amount: data.amount,
          status: 'COMPLETED'
        },
      });

      // Send notification
      await NotificationService.sendDepositConfirmation(
        userId,
        data.amount,
        updatedAccount.balance.toNumber()
      );

      return transaction;
    });

    return {
      id: result.id,
      type: result.type,
      amount: result.amount.toString(),
      createdAt: result.createdAt,
    };
  }

  static async withdraw(
    userId: string,
    data: TransactionDto
  ): Promise<TransactionResponseDto> {
    const account = await prisma.account.findFirst({
      where: { userId, isActive: true }
    });

    if (!account) {
      throw new Error("No active account found");
    }

    if (account.balance.toNumber() < data.amount) {
      // Send notification
      await NotificationService.sendInsufficientBalanceAlert(
        userId,
        data.amount,
        account.balance.toNumber()
      );
      throw new Error("Insufficient balance");
    }

    // Check if PIN is required
    

    // Process immediately if no PIN required
    const result = await prisma.$transaction(async (tx) => {
      const updatedAccount = await tx.account.update({
        where: { id: account.id },
        data: {
          balance: {
            decrement: data.amount,
          },
        },
      });

      const transaction = await tx.transaction.create({
        data: {
          refId: RefIdGenerator.generateTransactionRefId(),
          accountId: account.id,
          type: TransactionType.WITHDRAWAL,
          amount: data.amount,
          status: 'COMPLETED'
        },
      });

      // Send notification
      await NotificationService.sendWithdrawalAlert(
        userId,
        data.amount,
        updatedAccount.balance.toNumber()
      );

      return transaction;
    });

    return {
      id: result.id,
      type: result.type,
      amount: result.amount.toString(),
      createdAt: result.createdAt,
    };
  }

  static async getBalance(userId: string): Promise<CustomerResponseDto> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { accounts: true }
    });

    if (!user) {
      throw new Error("User not found");
    }

    const account = user.accounts.find(acc => acc.isActive) || user.accounts[0];

    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      balance: account?.balance.toString() || '0',
      isVerified: user.isVerified,
      createdAt: user.createdAt,
    };
  }

  static async getTransactionHistory(
    userId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<{ transactions: TransactionResponseDto[]; total: number; pages: number }> {
    const account = await prisma.account.findFirst({
      where: { userId, isActive: true }
    });

    if (!account) {
      return { transactions: [], total: 0, pages: 0 };
    }

    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where: { accountId: account.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit
      }),
      prisma.transaction.count({
        where: { accountId: account.id }
      })
    ]);

    const pages = Math.ceil(total / limit);

    return {
      transactions: transactions.map((t) => ({
        id: t.id,
        refId: t.refId,
        type: t.type,
        amount: t.amount.toString(),
        createdAt: t.createdAt,
      })),
      total,
      pages
    };
  }

  static async reverseTransaction(
    transactionId: string,
    adminUserId: string,
    reason: string
  ): Promise<TransactionResponseDto> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.status === 'REVERSED') {
      throw new Error('Transaction already reversed');
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update original transaction
      await tx.transaction.update({
        where: { id: transactionId },
        data: {
          status: 'REVERSED',
          reversedBy: adminUserId,
          reversedAt: new Date(),
          reversedReason: reason
        }
      });

      // Create reversal transaction
      const reversalType = transaction.type === 'DEPOSIT' ? 'WITHDRAWAL' : 'DEPOSIT';
      const balanceChange = transaction.type === 'DEPOSIT' ? 'decrement' : 'increment';

      await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            [balanceChange]: transaction.amount
          }
        }
      });

      const reversalTransaction = await tx.transaction.create({
        data: {
          refId: RefIdGenerator.generateTransactionRefId(),
          accountId: transaction.accountId,
          type: 'REVERSAL',
          amount: transaction.amount,
          reversedReason: reason,
          status: 'COMPLETED'
        }
      });

      return reversalTransaction;
    });

    return {
      id: result.id,
      type: result.type,
      amount: result.amount.toString(),
      createdAt: result.createdAt,
    };
  }

  static async confirmTransaction(
    transactionId: string,
    userId: string,
    pin: string
  ): Promise<TransactionResponseDto> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.account.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (transaction.status !== 'PENDING') {
      throw new Error('Transaction is not pending');
    }

    // Check if transaction has expired (20 minutes)
    const twentyMinutesAgo = new Date(Date.now() - 20 * 60 * 1000);
    if (transaction.createdAt < twentyMinutesAgo) {
      await prisma.transaction.update({
        where: { id: transactionId },
        data: { status: 'CANCELLED' }
      });
      throw new Error('Transaction has expired');
    }

    // Verify PIN
    const isValidPin = await PinService.verifyTransactionPin(userId, pin);
    if (!isValidPin) {
      throw new Error('Invalid PIN');
    }

    // Check balance limits for deposits
    if (transaction.type === 'DEPOSIT') {
      const maxBalance = 99999999.99;
      const currentBalance = transaction.account.balance.toNumber();
      if (currentBalance + transaction.amount.toNumber() > maxBalance) {
        throw new Error(`Deposit would exceed maximum balance limit of $${maxBalance.toLocaleString()}`);
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      // Update balance
      const balanceChange = transaction.type === 'DEPOSIT' ? 'increment' : 'decrement';
      const updatedAccount = await tx.account.update({
        where: { id: transaction.accountId },
        data: {
          balance: {
            [balanceChange]: transaction.amount
          }
        }
      });

      // Update transaction status
      const updatedTransaction = await tx.transaction.update({
        where: { id: transactionId },
        data: { status: 'COMPLETED' }
      });

      // Send notifications
      if (transaction.type === 'DEPOSIT') {
        await NotificationService.sendDepositConfirmation(
          userId,
          transaction.amount.toNumber(),
          updatedAccount.balance.toNumber()
        );
      } else {
        await NotificationService.sendWithdrawalAlert(
          userId,
          transaction.amount.toNumber(),
          updatedAccount.balance.toNumber()
        );
      }

      return updatedTransaction;
    });

    return {
      id: result.id,
      type: result.type,
      amount: result.amount.toString(),
      createdAt: result.createdAt,
    };
  }

  static async cancelTransaction(
    transactionId: string,
    userId: string
  ): Promise<void> {
    const transaction = await prisma.transaction.findUnique({
      where: { id: transactionId },
      include: { account: true }
    });

    if (!transaction) {
      throw new Error('Transaction not found');
    }

    if (transaction.account.userId !== userId) {
      throw new Error('Unauthorized');
    }

    if (transaction.status !== 'PENDING') {
      throw new Error('Transaction is not pending');
    }

    await prisma.transaction.update({
      where: { id: transactionId },
      data: { status: 'CANCELLED' }
    });
  }
}