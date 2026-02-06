import type { Request, Response, NextFunction } from "express";
import { prisma } from "../config/database";
import { logger } from "../config/logger";

const MUTATION_METHODS = new Set(["POST", "PATCH", "PUT", "DELETE"]);

export function auditLog(entityType: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!MUTATION_METHODS.has(req.method)) {
      next();
      return;
    }

    // Capture the original json method to intercept the response body
    const originalJson = res.json.bind(res);
    let responseBody: unknown;

    res.json = function (body: unknown) {
      responseBody = body;
      return originalJson(body);
    };

    res.on("finish", () => {
      // Only log successful mutations
      if (res.statusCode >= 200 && res.statusCode < 300) {
        const action = methodToAction(req.method);
        const entityId = req.params.id ?? (responseBody as Record<string, unknown>)?.data?.toString() ?? "unknown";

        // Extract entity ID from response if it's a create operation
        let resolvedEntityId = entityId;
        if (action === "CREATE" && typeof responseBody === "object" && responseBody !== null) {
          const data = (responseBody as Record<string, unknown>).data;
          if (typeof data === "object" && data !== null && "id" in data) {
            resolvedEntityId = (data as Record<string, string>).id;
          }
        }

        prisma.auditLog
          .create({
            data: {
              userId: req.user?.id ?? null,
              action,
              entityType,
              entityId: resolvedEntityId,
              newValues: req.method !== "DELETE" ? (req.body as object) : undefined,
              ipAddress: req.ip ?? null,
              userAgent: req.headers["user-agent"]?.substring(0, 500) ?? null,
            },
          })
          .catch((err) => {
            logger.error({ error: err, entityType, action }, "Failed to create audit log");
          });
      }
    });

    next();
  };
}

function methodToAction(method: string): string {
  switch (method) {
    case "POST":
      return "CREATE";
    case "PATCH":
    case "PUT":
      return "UPDATE";
    case "DELETE":
      return "DELETE";
    default:
      return method;
  }
}
