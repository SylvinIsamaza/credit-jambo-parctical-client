import prisma from "../config/prisma-client";

export class AuditService {
  static async log(data: {
    userId: string;
    deviceId?: string;
    action: string;
    resource?: string;
    details?: any;
    ipAddress: string;
    userAgent?: string;
    platform?: string;
  }) {
    return await prisma.auditLog.create({
      data: {
        userId: data.userId,  
        deviceId: data.deviceId,
        action: data.action,
        resource: data.resource,
        details: data.details,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        platform: data.platform,
      },
    });
  }

  static async getUserAuditLogs(userId: string, limit = 50) {
    return await prisma.auditLog.findMany({
      where: { userId },
      include: { device: true },
      orderBy: { timestamp: "desc" },
      take: limit,
    });
  }
}
