import type { Request, Response, NextFunction } from "express";
import { reportService } from "../services/report.service";
import { pdfService } from "../services/pdf.service";
import type { ApiResponse } from "../types";

export class ReportsController {
  async dailySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { siteId } = req.params;
      const date = req.query.date
        ? new Date(req.query.date as string)
        : new Date();

      const summary = await reportService.dailySummary(siteId!, date);

      const response: ApiResponse = {
        success: true,
        data: summary,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async weeklySummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { siteId } = req.params;
      const weekStart = req.query.weekStart
        ? new Date(req.query.weekStart as string)
        : new Date();

      const summary = await reportService.weeklySummary(siteId!, weekStart);

      const response: ApiResponse = {
        success: true,
        data: summary,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async siteSummary(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const summary = await reportService.siteSummary(req.params.siteId!);

      const response: ApiResponse = {
        success: true,
        data: summary,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async equipmentUtilization(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const siteId = req.query.siteId as string | undefined;
      const utilization = await reportService.equipmentUtilization(siteId);

      const response: ApiResponse = {
        success: true,
        data: utilization,
        requestId: req.requestId,
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  async exportCsv(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { siteId } = req.params;
      const from = req.query.from ? new Date(req.query.from as string) : undefined;
      const to = req.query.to ? new Date(req.query.to as string) : undefined;

      const csv = await reportService.exportActivitiesCsv(siteId!, from, to);

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="activities-${siteId}-${new Date().toISOString().split("T")[0]}.csv"`,
      );
      res.status(200).send(csv);
    } catch (error) {
      next(error);
    }
  }

  async exportPdf(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { siteId } = req.params;
      const summary = await reportService.siteSummary(siteId!);

      const pdfBuffer = await pdfService.generateReport({
        title: `Site Summary Report - ${(summary.site as Record<string, string>).name}`,
        content: summary.stats as Record<string, unknown>,
      });

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="report-${siteId}-${new Date().toISOString().split("T")[0]}.pdf"`,
      );
      res.status(200).send(pdfBuffer);
    } catch (error) {
      next(error);
    }
  }
}

export const reportsController = new ReportsController();
