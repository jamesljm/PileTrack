import { auditLogRepository } from "../repositories/audit-log.repository";
import { logger } from "../config/logger";

export async function logAction(params: {
  userId?: string | null;
  action: string;
  entityType: string;
  entityId: string;
  oldValues?: unknown;
  newValues?: unknown;
  ipAddress?: string | null;
  userAgent?: string | null;
}): Promise<void> {
  try {
    await auditLogRepository.createLog({
      userId: params.userId,
      action: params.action,
      entityType: params.entityType,
      entityId: params.entityId,
      oldValues: params.oldValues,
      newValues: params.newValues,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    });
  } catch (error) {
    logger.error({ error, ...params }, "Failed to create audit log entry");
  }
}

export async function getAuditLogs(
  entityType: string,
  entityId: string,
  pagination: { skip: number; take: number } = { skip: 0, take: 50 },
) {
  return auditLogRepository.findByRecord(entityType, entityId, pagination);
}

export async function getUserAuditLogs(
  userId: string,
  pagination: { skip: number; take: number } = { skip: 0, take: 50 },
) {
  return auditLogRepository.findByUser(userId, pagination);
}
