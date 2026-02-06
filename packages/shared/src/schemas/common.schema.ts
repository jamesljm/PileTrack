import { z } from "zod";

// ─── Pagination ──────────────────────────────────────────────────────────────

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z.string().min(1).optional(),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});

export type PaginationQuery = z.infer<typeof paginationQuerySchema>;

// ─── Date Range ──────────────────────────────────────────────────────────────

export const dateRangeSchema = z
  .object({
    from: z.coerce.date(),
    to: z.coerce.date(),
  })
  .refine((data) => data.from <= data.to, {
    message: "'from' date must be before or equal to 'to' date",
    path: ["from"],
  });

export type DateRange = z.infer<typeof dateRangeSchema>;

// ─── ID Param ────────────────────────────────────────────────────────────────

export const idParamSchema = z.object({
  id: z.string().uuid("Invalid UUID format"),
});

export type IdParam = z.infer<typeof idParamSchema>;

// ─── Weather ─────────────────────────────────────────────────────────────────

export const weatherSchema = z.object({
  condition: z.enum([
    "SUNNY",
    "CLOUDY",
    "OVERCAST",
    "LIGHT_RAIN",
    "HEAVY_RAIN",
    "THUNDERSTORM",
    "WINDY",
    "FOG",
    "HAZE",
  ]),
  temperatureCelsius: z.number().min(-50).max(60).optional(),
  humidity: z.number().min(0).max(100).optional(),
  windSpeedKmh: z.number().min(0).max(300).optional(),
  rainfall: z.number().min(0).optional(),
});

export type Weather = z.infer<typeof weatherSchema>;
