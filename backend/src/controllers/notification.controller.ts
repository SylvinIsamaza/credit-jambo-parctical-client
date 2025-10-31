import { Response } from 'express';
import { NotificationService } from '../services/notification.service';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/serverResponse';

export class NotificationController {
  static async getUserNotifications(req: AuthRequest, res: Response) {
    try {
      const { type, isRead, dateFrom, dateTo } = req.query;
      
      const filters: any = {};
      if (type) filters.type = type as string;
      if (isRead !== undefined) filters.isRead = isRead === 'true';
      if (dateFrom) filters.dateFrom = new Date(dateFrom as string);
      if (dateTo) {
        const toDate = new Date(dateTo as string);
        toDate.setHours(23, 59, 59, 999);
        filters.dateTo = toDate;
      }

      const notifications = await NotificationService.getUserNotifications(req.user!.id, filters);
      return ServerResponse.success(res, 'Notifications retrieved successfully', notifications);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getNotificationById(req: AuthRequest, res: Response) {
    try {
      const { notificationId } = req.params;
      
      const notification = await NotificationService.getNotificationById(notificationId, req.user!.id);
      
      if (!notification) {
        return ServerResponse.notFound(res, 'Notification not found');
      }

      return ServerResponse.success(res, 'Notification retrieved successfully', notification);
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async markAsRead(req: AuthRequest, res: Response) {
    try {
      const { notificationId } = req.params;
      
      await NotificationService.markAsRead(notificationId, req.user!.id);
      return ServerResponse.success(res, 'Notification marked as read');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async markAllAsRead(req: AuthRequest, res: Response) {
    try {
      await NotificationService.markAllAsRead(req.user!.id);
      return ServerResponse.success(res, 'All notifications marked as read');
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }

  static async getUnreadCount(req: AuthRequest, res: Response) {
    try {
      const count = await NotificationService.getUnreadCount(req.user!.id);
      return ServerResponse.success(res, 'Unread count retrieved successfully', { count });
    } catch (error: any) {
      return ServerResponse.error(res, error.message);
    }
  }
}