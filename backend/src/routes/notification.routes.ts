import { Router } from 'express';
import { NotificationController } from '../controllers/notification.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router:Router = Router();

router.use(authenticateToken);

router.get('/', NotificationController.getUserNotifications);
router.get('/unread-count', NotificationController.getUnreadCount);
router.get('/:notificationId', NotificationController.getNotificationById);
router.patch('/:notificationId/read', NotificationController.markAsRead);
router.patch('/mark-all-read', NotificationController.markAllAsRead);

export default router;