import { Request, Response } from 'express';
import { ContactService } from '../services/contact.service';
import { CreateContactDto } from '../dtos/contact.dto';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/serverResponse';

export class ContactController {
  static async createContact(req: AuthRequest, res: Response) {
    try {
      const data: CreateContactDto = req.body;
      const userId = req.user!.id;

      const result = await ContactService.createContact(userId, data);
      return ServerResponse.created(res, 'Contact message sent successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getUserContacts(req: AuthRequest, res: Response) {
    try {
      const userId = req.user!.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const result = await ContactService.getUserContacts(userId, page, limit);
      return ServerResponse.success(res, 'Contacts retrieved successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getAllContacts(req: Request, res: Response) {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const status = req.query.status as string;
      const search = req.query.search as string;
      
      const result = await ContactService.getAllContacts(page, limit, status, search);
      return ServerResponse.success(res, 'All contacts retrieved successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async updateContactStatus(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      await ContactService.updateContactStatus(id, status);
      return ServerResponse.success(res, 'Contact status updated successfully');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async replyToContact(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const { message } = req.body;
      const adminId = req.user!.id;

      const result = await ContactService.replyToContact(id, adminId, message);
      return ServerResponse.created(res, 'Reply added successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getContactReplies(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const result = await ContactService.getContactReplies(id);
      return ServerResponse.success(res, 'Contact replies retrieved successfully', result);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }
}