import type { Request, Response, NextFunction } from "express";
import { authService } from "../services/auth.service";
import type { ApiResponse } from "../types";

export class AuthController {
  async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.register(req.body);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: "Registration successful",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body);

      const response: ApiResponse = {
        success: true,
        data: result,
        message: "Login successful",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      const tokens = await authService.refreshTokens(refreshToken);

      const response: ApiResponse = {
        success: true,
        data: tokens,
        message: "Tokens refreshed",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { refreshToken } = req.body;
      await authService.logout(refreshToken);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Logged out successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = req.user!.id;
      const { currentPassword, newPassword } = req.body;

      await authService.changePassword(userId, currentPassword, newPassword);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Password changed successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.forgotPassword(req.body.email);

      const response: ApiResponse = {
        success: true,
        data: result,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await authService.resetPassword(token, newPassword);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Password reset successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async me(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { userService } = await import("../services/user.service");
      const user = await userService.getUserById(req.user!.id);

      const response: ApiResponse = {
        success: true,
        data: user,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
