export interface RateLimitTier {
  windowMs: number;
  max: number;
  message: string;
}

export const rateLimitTiers: Record<string, RateLimitTier> = {
  auth: {
    windowMs: 60 * 1000, // 1 minute
    max: 5,
    message: "Too many authentication attempts. Please try again after 1 minute.",
  },
  api: {
    windowMs: 60 * 1000, // 1 minute
    max: 100,
    message: "Too many requests. Please try again after 1 minute.",
  },
  sync: {
    windowMs: 60 * 1000, // 1 minute
    max: 30,
    message: "Too many sync requests. Please try again after 1 minute.",
  },
  reports: {
    windowMs: 60 * 1000, // 1 minute
    max: 10,
    message: "Too many report requests. Please try again after 1 minute.",
  },
};
