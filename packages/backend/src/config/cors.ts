import type { CorsOptions } from "cors";
import { config } from "./index";

export const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) {
      callback(null, true);
      return;
    }

    if (config.cors.origins.includes(origin) || config.isDev) {
      callback(null, true);
    } else {
      callback(new Error(`Origin ${origin} not allowed by CORS`));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Request-ID", "X-Client-ID"],
  exposedHeaders: ["X-Request-ID", "X-Total-Count"],
  maxAge: 600, // 10 minutes
};
