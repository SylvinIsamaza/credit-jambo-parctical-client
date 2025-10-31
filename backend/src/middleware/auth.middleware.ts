import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { AuthRequest } from '../types';
import ServerResponse from '../utils/serverResponse';

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = req.cookies?.accessToken || (req.headers['authorization']?.split(' ')[1]);

  if (!token) {
    return ServerResponse.unauthenticated(res, 'Access token required');
  }

  try {
    const payload = AuthService.verifyToken(token);
    const isValidSession = await AuthService.validateSession(payload.sessionId);
    
    if (!isValidSession) {
      return ServerResponse.unauthorized(res, 'Session expired or invalid');
    }

    req.user = {
      id: payload.userId,
      deviceId: payload.deviceId,
      sessionId: payload.sessionId
    };
    
    req.deviceInfo = {
      ipAddress: req.ip || req.connection.remoteAddress || 'unknown',
      userAgent: req.headers['user-agent'],
      platform: req.headers['user-agent']?.includes('Windows') ? 'Windows' :
                req.headers['user-agent']?.includes('Mac') ? 'macOS' :
                req.headers['user-agent']?.includes('Linux') ? 'Linux' :
                req.headers['user-agent']?.includes('Android') ? 'Android' :
                req.headers['user-agent']?.includes('iOS') ? 'iOS' : 'Unknown'
    };
    
    next();
  } catch (error) {
    next(error);
  }
};