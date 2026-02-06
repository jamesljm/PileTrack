import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { generateTestAccessToken, testWorker } from "../helpers/auth";

// Mock dependencies
vi.mock("../../src/config/database", () => {
  const mockPrisma = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $on: vi.fn(),
    $queryRaw: vi.fn(),
    syncLog: {
      count: vi.fn(),
      create: vi.fn(),
      findFirst: vi.fn(),
      findMany: vi.fn(),
    },
    activityRecord: {
      findFirst: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
  };
  return { prisma: mockPrisma, disconnectDatabase: vi.fn() };
});

vi.mock("../../src/config/redis", () => ({
  getRedis: vi.fn().mockReturnValue({
    ping: vi.fn(),
    quit: vi.fn(),
    call: vi.fn(),
    connect: vi.fn(),
    on: vi.fn(),
  }),
  connectRedis: vi.fn(),
  disconnectRedis: vi.fn(),
}));

import { createApp } from "../../src/app";
import { prisma } from "../../src/config/database";

describe("Sync Endpoints", () => {
  let app: Express;
  let workerToken: string;

  beforeAll(() => {
    app = createApp();
    workerToken = generateTestAccessToken(testWorker);
  });

  describe("POST /api/v1/sync/push", () => {
    it("should accept and process sync changes", async () => {
      vi.mocked(prisma.syncLog.count).mockResolvedValue(0 as never);
      vi.mocked(prisma.activityRecord.findFirst).mockResolvedValueOnce(null as never);
      vi.mocked(prisma.activityRecord.create).mockResolvedValueOnce({
        id: "new-activity-id",
      } as never);
      vi.mocked(prisma.syncLog.create).mockResolvedValueOnce({
        id: "sync-log-id",
        serverVersion: 1,
      } as never);
      vi.mocked(prisma.syncLog.findFirst).mockResolvedValueOnce({
        serverVersion: 1,
      } as never);

      const res = await request(app)
        .post("/api/v1/sync/push")
        .set("Authorization", `Bearer ${workerToken}`)
        .send({
          changes: [
            {
              clientId: "client-uuid-001",
              action: "CREATE",
              entityType: "activity",
              entityId: "local-uuid-001",
              payload: {
                siteId: "00000000-0000-0000-0000-000000000010",
                activityType: "BORED_PILING",
                activityDate: "2024-06-15",
                details: { pileId: "BP-001", pileLength: 30, pileDiameter: 1.2 },
                clientId: "local-uuid-001",
              },
              timestamp: new Date().toISOString(),
            },
          ],
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.applied).toBe(1);
    });

    it("should reject sync without auth", async () => {
      const res = await request(app)
        .post("/api/v1/sync/push")
        .send({ changes: [] });

      expect(res.status).toBe(401);
    });

    it("should reject invalid change format", async () => {
      const res = await request(app)
        .post("/api/v1/sync/push")
        .set("Authorization", `Bearer ${workerToken}`)
        .send({
          changes: [
            {
              // Missing required fields
              action: "CREATE",
            },
          ],
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/sync/pull", () => {
    it("should return changes since version", async () => {
      vi.mocked(prisma.syncLog.findMany).mockResolvedValueOnce([] as never);
      vi.mocked(prisma.syncLog.findFirst).mockResolvedValueOnce({
        serverVersion: 5,
      } as never);

      const res = await request(app)
        .get("/api/v1/sync/pull?sinceVersion=0")
        .set("Authorization", `Bearer ${workerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.serverVersion).toBeDefined();
      expect(Array.isArray(res.body.data.changes)).toBe(true);
    });
  });

  describe("GET /api/v1/sync/status", () => {
    it("should return sync status", async () => {
      vi.mocked(prisma.syncLog.findFirst).mockResolvedValue({
        serverVersion: 10,
      } as never);
      vi.mocked(prisma.syncLog.findMany).mockResolvedValue([] as never);

      const res = await request(app)
        .get("/api/v1/sync/status")
        .set("Authorization", `Bearer ${workerToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.serverVersion).toBeDefined();
    });
  });
});
