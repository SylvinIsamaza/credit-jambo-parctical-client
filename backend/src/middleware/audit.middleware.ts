import { Response, NextFunction } from 'express';
import { AuthRequest } from '../types';
import { AuditService } from '../services/audit.service';

export const auditMiddleware = (action: string, resource?: string) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.user && req.deviceInfo) {
      await AuditService.log({
        userId: req.user?.id??'',
        deviceId: req.user?.deviceId??'',
        action,
        resource,
        details: { body: req.body, params: req.params, query: req.query },
        ipAddress: req.deviceInfo.ipAddress,
        userAgent: req.deviceInfo.userAgent,
        platform: req.deviceInfo.platform
      });
    }
    next();
  };
};