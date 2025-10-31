import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../services/redis.service';
import ServerResponse from '../utils/serverResponse';

export const rateLimitMiddleware = (limit: number = 100, window: number = 900) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const key = req.ip || 'unknown';
    
    try {
      const allowed = await RedisService.checkRateLimit(key, limit, window);
      
      if (!allowed) {
        return ServerResponse.error(res, 'Too many requests. Please try again later.');
      }
      
      next();
    } catch (error) {
    console.error('Rate limit error:', error);
      next(); 
    }
  };
};