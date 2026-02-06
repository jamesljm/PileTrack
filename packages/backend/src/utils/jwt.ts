import jwt from "jsonwebtoken";
import { config } from "../config";
import type { JwtPayload } from "../types";

export function signAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.accessSecret, {
    expiresIn: config.jwt.accessExpiresIn,
    issuer: "piletrack",
    audience: "piletrack-api",
  });
}

export function signRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
    issuer: "piletrack",
    audience: "piletrack-api",
  });
}

export function verifyAccessToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwt.accessSecret, {
    issuer: "piletrack",
    audience: "piletrack-api",
  }) as JwtPayload & jwt.JwtPayload;

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };
}

export function verifyRefreshToken(token: string): JwtPayload {
  const decoded = jwt.verify(token, config.jwt.refreshSecret, {
    issuer: "piletrack",
    audience: "piletrack-api",
  }) as JwtPayload & jwt.JwtPayload;

  return {
    userId: decoded.userId,
    email: decoded.email,
    role: decoded.role,
  };
}
