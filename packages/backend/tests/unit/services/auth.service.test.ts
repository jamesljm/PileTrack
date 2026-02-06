import { describe, it, expect, vi, beforeEach } from "vitest";
import { hashPassword, comparePassword } from "../../../src/utils/hash";
import { signAccessToken, verifyAccessToken, signRefreshToken, verifyRefreshToken } from "../../../src/utils/jwt";

// We test the utility functions used by the auth service
// since the full service requires database connectivity

describe("Password Hashing", () => {
  it("should hash a password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toBe(password);
    expect(hash.length).toBeGreaterThan(50);
  });

  it("should produce different hashes for the same password", async () => {
    const password = "TestPassword123!";
    const hash1 = await hashPassword(password);
    const hash2 = await hashPassword(password);

    expect(hash1).not.toBe(hash2); // bcrypt uses random salt
  });

  it("should verify a correct password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);

    const isValid = await comparePassword(password, hash);
    expect(isValid).toBe(true);
  });

  it("should reject an incorrect password", async () => {
    const password = "TestPassword123!";
    const hash = await hashPassword(password);

    const isValid = await comparePassword("WrongPassword123!", hash);
    expect(isValid).toBe(false);
  });

  it("should reject an empty password", async () => {
    const hash = await hashPassword("TestPassword123!");
    const isValid = await comparePassword("", hash);
    expect(isValid).toBe(false);
  });
});

describe("JWT Token Operations", () => {
  const payload = {
    userId: "00000000-0000-0000-0000-000000000001",
    email: "test@example.com",
    role: "ADMIN",
  };

  describe("Access Token", () => {
    it("should sign and verify an access token", () => {
      const token = signAccessToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = verifyAccessToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it("should reject an invalid access token", () => {
      expect(() => verifyAccessToken("invalid.token.here")).toThrow();
    });

    it("should reject a tampered token", () => {
      const token = signAccessToken(payload);
      const tampered = token.slice(0, -5) + "xxxxx";
      expect(() => verifyAccessToken(tampered)).toThrow();
    });
  });

  describe("Refresh Token", () => {
    it("should sign and verify a refresh token", () => {
      const token = signRefreshToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe("string");

      const decoded = verifyRefreshToken(token);
      expect(decoded.userId).toBe(payload.userId);
      expect(decoded.email).toBe(payload.email);
      expect(decoded.role).toBe(payload.role);
    });

    it("should not verify a refresh token with access secret", () => {
      const token = signRefreshToken(payload);
      expect(() => verifyAccessToken(token)).toThrow();
    });

    it("should not verify an access token with refresh secret", () => {
      const token = signAccessToken(payload);
      expect(() => verifyRefreshToken(token)).toThrow();
    });
  });
});
