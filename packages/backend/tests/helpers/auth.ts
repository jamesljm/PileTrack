import jwt from "jsonwebtoken";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET ?? "test-access-secret-at-least-16-chars";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET ?? "test-refresh-secret-at-least-16-chars";

export interface TestTokenPayload {
  userId: string;
  email: string;
  role: string;
}

export function generateTestAccessToken(payload: TestTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "15m",
    issuer: "piletrack",
    audience: "piletrack-api",
  });
}

export function generateTestRefreshToken(payload: TestTokenPayload): string {
  return jwt.sign(payload, REFRESH_SECRET, {
    expiresIn: "7d",
    issuer: "piletrack",
    audience: "piletrack-api",
  });
}

export function generateExpiredToken(payload: TestTokenPayload): string {
  return jwt.sign(payload, ACCESS_SECRET, {
    expiresIn: "0s",
    issuer: "piletrack",
    audience: "piletrack-api",
  });
}

export const testAdmin: TestTokenPayload = {
  userId: "00000000-0000-0000-0000-000000000001",
  email: "admin@test.com",
  role: "ADMIN",
};

export const testSupervisor: TestTokenPayload = {
  userId: "00000000-0000-0000-0000-000000000002",
  email: "supervisor@test.com",
  role: "SUPERVISOR",
};

export const testWorker: TestTokenPayload = {
  userId: "00000000-0000-0000-0000-000000000003",
  email: "worker@test.com",
  role: "WORKER",
};
