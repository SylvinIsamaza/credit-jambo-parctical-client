import { Response } from 'express';
import { SavingsService } from '../services/savings.service';
import { PinService } from '../services/pin.service';
import { TransactionDto } from '../dtos/transaction.dto';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/serverResponse';

export class SavingsController {
  static async deposit(req: AuthRequest, res: Response) {
    try {
      const data: TransactionDto = req.body;
      const result = await SavingsService.deposit(req.user!.id, data);
      return ServerResponse.created(res, 'Deposit successful', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async withdraw(req: AuthRequest, res: Response) {
    try {
      const data: TransactionDto = req.body;
      const result = await SavingsService.withdraw(req.user!.id, data);
      return ServerResponse.created(res, 'Withdrawal successful', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getBalance(req: AuthRequest, res: Response) {
    try {
      const result = await SavingsService.getBalance(req.user!.id);
      return ServerResponse.success(res, 'Balance retrieved successfully', result);
    } catch (error: any) {
      return ServerResponse.notFound(res, error.message);
    }
  }

  static async getTransactionHistory(req: AuthRequest, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await SavingsService.getTransactionHistory(req.user!.id, page, limit);
      return ServerResponse.success(res, 'Transaction history retrieved successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async confirmTransaction(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { pin } = req.body;
      const userId = req.user!.id;

      const result = await SavingsService.confirmTransaction(id, userId, pin);
      return ServerResponse.success(res, 'Transaction confirmed successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async cancelTransaction(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const userId = req.user!.id;

      await SavingsService.cancelTransaction(id, userId);
      return ServerResponse.success(res, 'Transaction cancelled successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }
}