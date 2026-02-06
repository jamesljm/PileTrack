import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import type { Express } from "express";
import { generateTestAccessToken, testWorker, testSupervisor, testAdmin } from "../helpers/auth";

// Mock dependencies
vi.mock("../../src/config/database", () => {
  const mockPrisma = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $on: vi.fn(),
    $queryRaw: vi.fn(),
    activityRecord: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      count: vi.fn(),
    },
    site: {
      findFirst: vi.fn(),
    },
    siteUser: {
      findMany: vi.fn().mockResolvedValue([]),
    },
    auditLog: {
      create: vi.fn().mockResolvedValue({}),
    },
    notification: {
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
import { boredPilingActivity } from "../fixtures/activities";

describe("Activities Endpoints", () => {
  let app: Express;
  let workerToken: string;
  let supervisorToken: string;
  let adminToken: string;

  beforeAll(() => {
    app = createApp();
    workerToken = generateTestAccessToken(testWorker);
    supervisorToken = generateTestAccessToken(testSupervisor);
    adminToken = generateTestAccessToken(testAdmin);
  });

  describe("POST /api/v1/activities", () => {
    it("should create an activity with valid data", async () => {
      const mockSite = {
        id: boredPilingActivity.siteId,
        name: "Test Site",
        deletedAt: null,
      };

      const mockActivity = {
        id: "00000000-0000-0000-0000-000000000100",
        ...boredPilingActivity,
        status: "DRAFT",
        createdById: testWorker.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: { id: testWorker.userId, firstName: "Test", lastName: "Worker", email: testWorker.email },
        site: { id: mockSite.id, name: mockSite.name, code: "TS-001" },
      };

      vi.mocked(prisma.site.findFirst).mockResolvedValueOnce(mockSite as never);
      vi.mocked(prisma.activityRecord.create).mockResolvedValueOnce(mockActivity as never);

      const res = await request(app)
        .post("/api/v1/activities")
        .set("Authorization", `Bearer ${workerToken}`)
        .send(boredPilingActivity);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.activityType).toBe("BORED_PILING");
      expect(res.body.data.status).toBe("DRAFT");
    });

    it("should reject activity creation without auth", async () => {
      const res = await request(app)
        .post("/api/v1/activities")
        .send(boredPilingActivity);

      expect(res.status).toBe(401);
    });

    it("should reject invalid activity type", async () => {
      const res = await request(app)
        .post("/api/v1/activities")
        .set("Authorization", `Bearer ${workerToken}`)
        .send({
          ...boredPilingActivity,
          activityType: "INVALID_TYPE",
        });

      expect(res.status).toBe(400);
    });
  });

  describe("GET /api/v1/activities/pending", () => {
    it("should allow supervisors to view pending approvals", async () => {
      vi.mocked(prisma.activityRecord.findMany).mockResolvedValueOnce([] as never);
      vi.mocked(prisma.activityRecord.count).mockResolvedValueOnce(0 as never);

      const res = await request(app)
        .get("/api/v1/activities/pending")
        .set("Authorization", `Bearer ${supervisorToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
    });

    it("should deny workers access to pending approvals", async () => {
      const res = await request(app)
        .get("/api/v1/activities/pending")
        .set("Authorization", `Bearer ${workerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/v1/activities/:id/approve", () => {
    it("should deny workers from approving activities", async () => {
      const res = await request(app)
        .post("/api/v1/activities/00000000-0000-0000-0000-000000000100/approve")
        .set("Authorization", `Bearer ${workerToken}`);

      expect(res.status).toBe(403);
    });
  });

  describe("POST /api/v1/activities/:id/reject", () => {
    it("should require rejection notes", async () => {
      const res = await request(app)
        .post("/api/v1/activities/00000000-0000-0000-0000-000000000100/reject")
        .set("Authorization", `Bearer ${supervisorToken}`)
        .send({});

      expect(res.status).toBe(400);
    });
  });
});
