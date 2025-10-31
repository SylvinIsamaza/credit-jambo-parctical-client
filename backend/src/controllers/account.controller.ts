import { Response } from 'express';
import { AuthRequest } from '../types';
import { AccountUtils } from '../utils/account';
import ServerResponse from '../utils/serverResponse';
import prisma from '../config/prisma-client';

export class AccountController {
  static async getAccountInfo(req: AuthRequest, res: Response) {
    try {
      const account = await prisma.account.findFirst({
        where: { userId: req.user!.id, isActive: true }
      });

      if (!account) {
        return ServerResponse.notFound(res, 'No active account found');
      }

      return ServerResponse.success(res, 'Account information retrieved successfully', {
        accountNumber: account.accountNumber,
        accountType: account.accountType,
        balance: account.balance.toString(),
        bankName: AccountUtils.getBankName(),
        bankIdentifier: AccountUtils.getBankIdentifier(),
        isActive: account.isActive,
        createdAt: account.createdAt
      });
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

}