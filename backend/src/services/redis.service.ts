import redis from '../config/redis';

export class RedisService {
  // Test Redis connection
  static async testConnection(): Promise<boolean> {
    try {
      const result = await redis.ping();
      return result === 'PONG';
    } catch (error) {
      console.error('Redis connection test failed:', error);
      return false;
    }
  }
  // Session management
  static async setSession(sessionId: string, sessionData: any, ttl: number = 900) { // 15 minutes default
    try {
      const key = `session:${sessionId}`;
      const value = JSON.stringify(sessionData);
      
      const result = await redis.setex(key, ttl, value);
      
      // Verify the session was stored
      const stored = await redis.get(key);
    } catch (error) {
      console.error('Error setting Redis session:', error);
      throw error;
    }
  }

  static async getSession(sessionId: string) {
    try {
      const key = `session:${sessionId}`;
      
      const data = await redis.get(key);
      
      return data ? JSON.parse(data) : null;
    } catch (error) {
      return null;
    }
  }

  static async deleteSession(sessionId: string) {
    await redis.del(`session:${sessionId}`);
  }

  // Refresh token management
  static async setRefreshToken(userId: string, refreshToken: string, ttl: number = 604800) { // 7 days default
    await redis.setex(`refresh:${userId}:${refreshToken}`, ttl, userId);
  }

  static async validateRefreshToken(userId: string, refreshToken: string): Promise<boolean> {
    const storedUserId = await redis.get(`refresh:${userId}:${refreshToken}`);
    return storedUserId === userId;
  }

  static async deleteRefreshToken(userId: string, refreshToken: string) {
    await redis.del(`refresh:${userId}:${refreshToken}`);
  }

  // Rate limiting
  static async checkRateLimit(key: string, limit: number, window: number): Promise<boolean> {
    const current = await redis.incr(`rate:${key}`);
    if (current === 1) {
      await redis.expire(`rate:${key}`, window);
    }
    return current <= limit;
  }

  // Login attempt tracking
  static async incrementLoginAttempts(email: string): Promise<number> {
    const key = `login_attempts:${email}`;
    const attempts = await redis.incr(key);
    if (attempts === 1) {
      await redis.expire(key, 900); // 15 minutes
    }
    return attempts;
  }

  static async getLoginAttempts(email: string): Promise<number> {
    const attempts = await redis.get(`login_attempts:${email}`);
    return attempts ? parseInt(attempts) : 0;
  }

  static async resetLoginAttempts(email: string) {
    await redis.del(`login_attempts:${email}`);
  }

  // User active sessions
  static async addUserSession(userId: string, sessionId: string) {
    await redis.sadd(`user:${userId}:sessions`, sessionId);
  }

  static async removeUserSession(userId: string, sessionId: string) {
    await redis.srem(`user:${userId}:sessions`, sessionId);
  }

  static async getUserSessions(userId: string): Promise<string[]> {
    return await redis.smembers(`user:${userId}:sessions`);
  }

  static async revokeAllUserSessions(userId: string) {
    const sessions = await this.getUserSessions(userId);
    const pipeline = redis.pipeline();
    
    sessions.forEach(sessionId => {
      pipeline.del(`session:${sessionId}`);
    });
    
    pipeline.del(`user:${userId}:sessions`);
    await pipeline.exec();
  }

  // Cache management
  static async setCache(key: string, data: any, ttl: number = 3600) {
    await redis.setex(`cache:${key}`, ttl, JSON.stringify(data));
  }

  static async getCache(key: string) {
    const data = await redis.get(`cache:${key}`);
    return data ? JSON.parse(data) : null;
  }

  static async deleteCache(key: string) {
    await redis.del(`cache:${key}`);
  }
}