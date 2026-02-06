import { beforeAll, afterAll, beforeEach } from "vitest";

// Set test environment variables before any imports
process.env.NODE_ENV = "test";
process.env.PORT = "0"; // Random port for tests
process.env.DATABASE_URL = "postgresql://piletrack:piletrack@localhost:5432/piletrack_test?schema=public";
process.env.REDIS_URL = "redis://localhost:6379/1";
process.env.JWT_ACCESS_SECRET = "test-access-secret-at-least-16-chars";
process.env.JWT_REFRESH_SECRET = "test-refresh-secret-at-least-16-chars";
process.env.JWT_ACCESS_EXPIRES_IN = "15m";
process.env.JWT_REFRESH_EXPIRES_IN = "7d";
process.env.CORS_ORIGINS = "http://localhost:3000";
process.env.LOG_LEVEL = "error";
process.env.RATE_LIMIT_ENABLED = "false";

beforeAll(async () => {
  // Global setup for all tests
});

afterAll(async () => {
  // Global teardown
});

beforeEach(() => {
  // Reset state before each test if needed
});
