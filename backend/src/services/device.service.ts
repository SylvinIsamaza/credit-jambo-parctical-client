import { DeviceInfo } from "../types";
import prisma from "../config/prisma-client";

export class DeviceService {
  static async registerDevice(userId: string, deviceInfo: DeviceInfo) {
    return await prisma.device.upsert({
      where: {
        userId_deviceId: {
          userId,
          deviceId: deviceInfo.deviceId,
        },
      },
      update: {
        lastUsed: new Date(),
        userAgent: deviceInfo.userAgent,
        platform: deviceInfo.platform,
      },
      create: {
        userId,
        deviceId: deviceInfo.deviceId,
        deviceName: deviceInfo.deviceName,
        platform: deviceInfo.platform,
        userAgent: deviceInfo.userAgent,
      },
    });
  }

  static async getUserDevices(userId: string, filters?: {
    isVerified?: boolean;
    platform?: string;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: any = { userId };
    
    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }
    
    if (filters?.platform) {
      where.platform = filters.platform;
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      where.lastUsed = {};
      if (filters.dateFrom) {
        where.lastUsed.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.lastUsed.lte = filters.dateTo;
      }
    }
    
    return await prisma.device.findMany({
      where,
      orderBy: { lastUsed: "desc" },
    });
  }

  static async getActiveSessions(userId: string, filters?: {
    isActive?: boolean;
    dateFrom?: Date;
    dateTo?: Date;
  }) {
    const where: any = {
      userId,
      expiresAt: { gt: new Date() },
    };
    
    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      where.lastActivity = {};
      if (filters.dateFrom) {
        where.lastActivity.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.lastActivity.lte = filters.dateTo;
      }
    }
    
    return await prisma.session.findMany({
      where,
      include: { device: true },
      orderBy: { lastUsed: "desc" },
    });
  }

  static async revokeSession(sessionId: string, userId: string) {
    return await prisma.session.update({
      where: {
        id: sessionId,
        userId,
      },
      data: { isActive: false },
    });
  }

  static async revokeAllSessions(userId: string, exceptSessionId?: string) {
    return await prisma.session.updateMany({
      where: {
        userId,
        isActive: true,
        ...(exceptSessionId && { id: { not: exceptSessionId } }),
      },
      data: { isActive: false },
    });
  }

  static async verifyDevice(deviceId: string, userId: string) {
    const device = await prisma.device.findUnique({
      where: {
        userId_deviceId: {
          userId,
          deviceId,
        },
      },
    });

    if (!device) {
      throw new Error('You can not login with this device');
    }

    return await prisma.device.update({
      where: { id: device.id },
      data: { isVerified: true },
    });
  }
    static async getAllDevices(filters?: {
    isVerified?: boolean;
    platform?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
  }) {
    const where: any = {  };
    
    if (filters?.isVerified !== undefined) {
      where.isVerified = filters.isVerified;
    }
    
    if (filters?.platform) {
      where.platform = filters.platform;
    }
    
    if (filters?.dateFrom || filters?.dateTo) {
      where.lastUsed = {};
      if (filters.dateFrom) {
        where.lastUsed.gte = filters.dateFrom;
      }
      if (filters.dateTo) {
        where.lastUsed.lte = filters.dateTo;
      }
    }
    
    if (filters?.search) {
      where.OR = [
        { deviceName: { contains: filters.search, mode: 'insensitive' } },
        { deviceId: { contains: filters.search, mode: 'insensitive' } },
        { platform: { contains: filters.search, mode: 'insensitive' } },
        { user: {
          OR: [
            { firstName: { contains: filters.search, mode: 'insensitive' } },
            { lastName: { contains: filters.search, mode: 'insensitive' } },
            { email: { contains: filters.search, mode: 'insensitive' } }
          ]
        }}
      ];
    }
    
    return await prisma.device.findMany({
      where,
      include: {
        user: {
          select: {
            firstName: true,
            lastName: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { lastUsed: "desc" },
    });
  }
}
