import { Request, Response } from 'express';
import { StatementService } from '../services/statement.service';
import ServerResponse from '../utils/serverResponse';

export class StatementController {
  static async downloadStatement(req: Request, res: Response) {
    try {
      const userId = req.user!.id;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return ServerResponse.error(res, 'Start date and end date are required');
      }

      const start = new Date(startDate as string);
      const end = new Date(endDate as string);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return ServerResponse.error(res, 'Invalid date format');
      }

      const pdfBuffer = await StatementService.generateAccountStatement(userId, start, end);

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=statement-${startDate}-${endDate}.pdf`);
      res.send(pdfBuffer);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }
}