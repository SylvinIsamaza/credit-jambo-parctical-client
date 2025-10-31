import { Request } from 'express';

export interface JwtPayload {
  userId: string;
  deviceId: string;
  sessionId: string;
}

export interface AuthRequest extends Request {
  user?: {
    id: string;
    deviceId: string;
    sessionId: string;
  };
  deviceInfo?: {
    ipAddress: string;
    userAgent?: string;
    platform?: string;
  };
}

export interface DeviceInfo {
  deviceId: string;
  deviceName?: string;
  platform?: string;
  userAgent?: string;
  ipAddress: string;
}