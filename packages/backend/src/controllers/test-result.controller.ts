import type { Request, Response, NextFunction } from "express";
import { testResultService } from "../services/test-result.service";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";

export class TestResultController {
  async getTestResults(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filter = {
        siteId: req.query.siteId as string | undefined,
        testType: req.query.testType as string | undefined,
        status: req.query.status as string | undefined,
        search: req.query.search as string | undefined,
      };

      const { data, total } = await testResultService.getTestResults(filter, pagination);
      const result = buildPaginatedResponse(data, total, pagination.page, pagination.pageSize);

      const response: PaginatedResponse = {
        success: true,
        data: result.data,
        pagination: result.pagination,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async getTestResultById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await testResultService.getTestResultById(req.params.id!);
      const response: ApiResponse = { success: true, data: result, requestId: req.requestId };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async createTestResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const userId = (req as any).user?.userId;
      const result = await testResultService.createTestResult(req.body, userId);
      const response: ApiResponse = {
        success: true,
        data: result,
        message: "Test result created successfully",
        requestId: req.requestId,
      };
      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  }

  async updateTestResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await testResultService.updateTestResult(req.params.id!, req.body);
      const response: ApiResponse = {
        success: true,
        data: result,
        message: "Test result updated successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async deleteTestResult(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      await testResultService.deleteTestResult(req.params.id!);
      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Test result deleted successfully",
        requestId: req.requestId,
      };
      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}

export const testResultController = new TestResultController();
