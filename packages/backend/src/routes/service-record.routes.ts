import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import { serviceRecordService } from "../services/service-record.service";
import { authorize } from "../middleware/authorize";
import { validate } from "../middleware/validate";
import { auditLog } from "../middleware/audit";
import { parsePagination, buildPaginatedResponse } from "../utils/pagination";
import type { ApiResponse, PaginatedResponse } from "../types";
import { z } from "zod";

const router = Router({ mergeParams: true });

const idParamSchema = z.object({
  id: z.string().uuid(),
});

const recordIdParamSchema = z.object({
  id: z.string().uuid(),
  recordId: z.string().uuid(),
});

const createServiceRecordSchema = z.object({
  serviceType: z.enum([
    "ROUTINE_MAINTENANCE",
    "REPAIR",
    "INSPECTION",
    "OVERHAUL",
    "CALIBRATION",
    "BREAKDOWN_REPAIR",
  ]),
  serviceDate: z.coerce.date(),
  description: z.string().min(1).max(2000),
  performedBy: z.string().min(1).max(200),
  cost: z.number().min(0).optional(),
  partsReplaced: z.string().max(2000).optional(),
  nextServiceDate: z.coerce.date().optional(),
  meterReading: z.number().min(0).optional(),
  notes: z.string().max(2000).optional(),
});

const updateServiceRecordSchema = createServiceRecordSchema.partial();

// GET /equipment/:id/service-records
router.get(
  "/",
  validate({ params: idParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const pagination = parsePagination(req.query as Record<string, string>);
      const filters = {
        serviceType: req.query.serviceType as string | undefined,
        from: req.query.from ? new Date(req.query.from as string) : undefined,
        to: req.query.to ? new Date(req.query.to as string) : undefined,
      };

      const { data, total } = await serviceRecordService.getByEquipment(
        req.params.id!,
        pagination,
        filters as any,
      );
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
  },
);

// GET /equipment/:id/service-records/summary
router.get(
  "/summary",
  validate({ params: idParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const summary = await serviceRecordService.getCostSummary(req.params.id!);

      const response: ApiResponse = {
        success: true,
        data: summary,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// POST /equipment/:id/service-records
router.post(
  "/",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("service_record"),
  validate({ params: idParamSchema, body: createServiceRecordSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = (req as any).user?.id;
      const record = await serviceRecordService.create(
        req.params.id!,
        req.body,
        userId,
      );

      const response: ApiResponse = {
        success: true,
        data: record,
        message: "Service record created successfully",
        requestId: req.requestId,
      };

      res.status(201).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// PATCH /equipment/:id/service-records/:recordId
router.patch(
  "/:recordId",
  authorize("SUPERVISOR", "ADMIN"),
  auditLog("service_record"),
  validate({ params: recordIdParamSchema, body: updateServiceRecordSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const record = await serviceRecordService.update(
        req.params.recordId!,
        req.body,
      );

      const response: ApiResponse = {
        success: true,
        data: record,
        message: "Service record updated successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

// DELETE /equipment/:id/service-records/:recordId
router.delete(
  "/:recordId",
  authorize("ADMIN"),
  auditLog("service_record"),
  validate({ params: recordIdParamSchema }),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await serviceRecordService.delete(req.params.recordId!);

      const response: ApiResponse = {
        success: true,
        data: null,
        message: "Service record deleted successfully",
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
