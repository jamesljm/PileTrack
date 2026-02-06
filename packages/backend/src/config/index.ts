import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  API_PREFIX: z.string().default("/api/v1"),

  // Database
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),

  // Redis
  REDIS_URL: z.string().default("redis://localhost:6379"),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(16, "JWT_ACCESS_SECRET must be at least 16 characters"),
  JWT_REFRESH_SECRET: z.string().min(16, "JWT_REFRESH_SECRET must be at least 16 characters"),
  JWT_ACCESS_EXPIRES_IN: z.string().default("15m"),
  JWT_REFRESH_EXPIRES_IN: z.string().default("7d"),

  // CORS
  CORS_ORIGINS: z.string().default("http://localhost:3000,http://localhost:5173"),

  // Logging
  LOG_LEVEL: z.enum(["fatal", "error", "warn", "info", "debug", "trace"]).default("info"),

  // Rate Limiting
  RATE_LIMIT_ENABLED: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

function loadConfig() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formatted = result.error.format();
    const errors = Object.entries(formatted)
      .filter(([key]) => key !== "_errors")
      .map(([key, value]) => {
        const errs = (value as { _errors?: string[] })._errors ?? [];
        return `  ${key}: ${errs.join(", ")}`;
      })
      .join("\n");

    console.error(`\nEnvironment validation failed:\n${errors}\n`);
    process.exit(1);
  }

  const env = result.data;

  return {
    nodeEnv: env.NODE_ENV,
    isDev: env.NODE_ENV === "development",
    isProd: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
    port: env.PORT,
    apiPrefix: env.API_PREFIX,

    database: {
      url: env.DATABASE_URL,
    },

    redis: {
      url: env.REDIS_URL,
    },

    jwt: {
      accessSecret: env.JWT_ACCESS_SECRET,
      refreshSecret: env.JWT_REFRESH_SECRET,
      accessExpiresIn: env.JWT_ACCESS_EXPIRES_IN,
      refreshExpiresIn: env.JWT_REFRESH_EXPIRES_IN,
    },

    cors: {
      origins: env.CORS_ORIGINS.split(",").map((o) => o.trim()),
    },

    logging: {
      level: env.LOG_LEVEL,
    },

    rateLimit: {
      enabled: env.RATE_LIMIT_ENABLED,
    },
  } as const;
}

export const config = loadConfig();
export type Config = typeof config;
