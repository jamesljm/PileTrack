import { describe, it, expect, beforeAll, vi } from "vitest";
import request from "supertest";
import type { Express } from "express";

// Mock Prisma before importing the app
vi.mock("../../src/config/database", () => {
  const mockPrisma = {
    $connect: vi.fn(),
    $disconnect: vi.fn(),
    $on: vi.fn(),
    $queryRaw: vi.fn(),
    user: {
      findFirst: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      findMany: vi.fn(),
      count: vi.fn(),
    },
    refreshToken: {
      create: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      updateMany: vi.fn(),
    },
    siteUser: {
      findMany: vi.fn().mockResolvedValue([]),
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
import bcrypt from "bcryptjs";

describe("Auth Endpoints", () => {
  let app: Express;

  beforeAll(() => {
    app = createApp();
  });

  describe("POST /api/v1/auth/register", () => {
    it("should register a new user successfully", async () => {
      const mockUser = {
        id: "00000000-0000-0000-0000-000000000099",
        email: "newuser@test.com",
        firstName: "New",
        lastName: "User",
        phone: null,
        role: "WORKER",
        status: "ACTIVE",
        createdAt: new Date(),
      };

      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null); // no existing user
      vi.mocked(prisma.user.create).mockResolvedValueOnce(mockUser as never);
      vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({} as never);

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "newuser@test.com",
          password: "NewUser123!",
          firstName: "New",
          lastName: "User",
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.user.email).toBe("newuser@test.com");
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.tokens.refreshToken).toBeDefined();
    });

    it("should reject registration with duplicate email", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        id: "existing",
        email: "existing@test.com",
      } as never);

      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "existing@test.com",
          password: "Test123!Abc",
          firstName: "Test",
          lastName: "User",
        });

      expect(res.status).toBe(409);
      expect(res.body.success).toBe(false);
    });

    it("should reject registration with weak password", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "test@test.com",
          password: "weak",
          firstName: "Test",
          lastName: "User",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it("should reject registration with invalid email", async () => {
      const res = await request(app)
        .post("/api/v1/auth/register")
        .send({
          email: "not-an-email",
          password: "Test123!Abc",
          firstName: "Test",
          lastName: "User",
        });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe("POST /api/v1/auth/login", () => {
    it("should login with valid credentials", async () => {
      const passwordHash = await bcrypt.hash("Admin123!", 12);
      const mockUser = {
        id: "00000000-0000-0000-0000-000000000001",
        email: "admin@test.com",
        passwordHash,
        firstName: "Admin",
        lastName: "User",
        phone: null,
        role: "ADMIN",
        status: "ACTIVE",
        deletedAt: null,
      };

      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(mockUser as never);
      vi.mocked(prisma.refreshToken.create).mockResolvedValueOnce({} as never);
      vi.mocked(prisma.user.update).mockResolvedValueOnce(mockUser as never);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "admin@test.com",
          password: "Admin123!",
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.tokens.accessToken).toBeDefined();
      expect(res.body.data.user.email).toBe("admin@test.com");
    });

    it("should reject login with wrong password", async () => {
      const passwordHash = await bcrypt.hash("Admin123!", 12);
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        id: "1",
        email: "admin@test.com",
        passwordHash,
        status: "ACTIVE",
        deletedAt: null,
      } as never);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "admin@test.com",
          password: "WrongPassword123!",
        });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
    });

    it("should reject login for non-existent user", async () => {
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce(null);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "nonexistent@test.com",
          password: "Test123!",
        });

      expect(res.status).toBe(401);
    });

    it("should reject login for suspended user", async () => {
      const passwordHash = await bcrypt.hash("Admin123!", 12);
      vi.mocked(prisma.user.findFirst).mockResolvedValueOnce({
        id: "1",
        email: "suspended@test.com",
        passwordHash,
        status: "SUSPENDED",
        deletedAt: null,
      } as never);

      const res = await request(app)
        .post("/api/v1/auth/login")
        .send({
          email: "suspended@test.com",
          password: "Admin123!",
        });

      expect(res.status).toBe(401);
    });
  });

  describe("GET /api/v1/auth/me", () => {
    it("should reject request without auth token", async () => {
      const res = await request(app).get("/api/v1/auth/me");
      expect(res.status).toBe(401);
    });

    it("should reject request with invalid token", async () => {
      const res = await request(app)
        .get("/api/v1/auth/me")
        .set("Authorization", "Bearer invalid-token");

      expect(res.status).toBe(401);
    });
  });
});
