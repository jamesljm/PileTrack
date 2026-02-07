import { prisma } from "../config/database";
import { testResultRepository } from "../repositories/test-result.repository";
import { NotFoundError } from "../utils/api-error";
import type { TestResult } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateTestResultInput {
  siteId: string;
  activityId?: string;
  testType: string;
  testDate: string;
  pileId?: string;
  status?: string;
  results?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
  conductedBy?: string;
}

export interface UpdateTestResultInput {
  activityId?: string;
  testType?: string;
  testDate?: string;
  pileId?: string;
  status?: string;
  results?: Record<string, unknown>;
  remarks?: string;
  photos?: string[];
  conductedBy?: string;
}

class TestResultService {
  async getTestResults(
    filter: { siteId?: string; testType?: string; status?: string; search?: string },
    pagination: { skip: number; take: number },
  ): Promise<{ data: TestResult[]; total: number }> {
    return testResultRepository.findAllFiltered(filter, pagination);
  }

  async getTestResultById(id: string): Promise<TestResult> {
    const result = await testResultRepository.findById(id, {
      site: { select: { id: true, name: true, code: true } },
      createdBy: { select: { id: true, firstName: true, lastName: true } },
      activity: { select: { id: true, activityType: true, activityDate: true } },
    });
    if (!result) throw new NotFoundError("TestResult");
    return result;
  }

  async createTestResult(input: CreateTestResultInput, userId: string): Promise<TestResult> {
    const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
    if (!site) throw new NotFoundError("Site");

    if (input.activityId) {
      const activity = await prisma.activityRecord.findFirst({
        where: { id: input.activityId, deletedAt: null },
      });
      if (!activity) throw new NotFoundError("ActivityRecord");
    }

    const result = await prisma.testResult.create({
      data: {
        siteId: input.siteId,
        activityId: input.activityId ?? null,
        testType: input.testType as any,
        testDate: new Date(input.testDate),
        pileId: input.pileId,
        status: (input.status as any) ?? "PENDING",
        results: (input.results as any) ?? {},
        remarks: input.remarks,
        photos: (input.photos as any) ?? [],
        conductedBy: input.conductedBy,
        createdById: userId,
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        activity: { select: { id: true, activityType: true, activityDate: true } },
      },
    });

    logger.info({ testResultId: result.id }, "Test result created");
    return result;
  }

  async updateTestResult(id: string, input: UpdateTestResultInput): Promise<TestResult> {
    const existing = await testResultRepository.findById(id);
    if (!existing) throw new NotFoundError("TestResult");

    const data: Record<string, unknown> = {};
    if (input.activityId !== undefined) data.activityId = input.activityId || null;
    if (input.testType !== undefined) data.testType = input.testType;
    if (input.testDate !== undefined) data.testDate = new Date(input.testDate);
    if (input.pileId !== undefined) data.pileId = input.pileId;
    if (input.status !== undefined) data.status = input.status;
    if (input.results !== undefined) data.results = input.results;
    if (input.remarks !== undefined) data.remarks = input.remarks;
    if (input.photos !== undefined) data.photos = input.photos;
    if (input.conductedBy !== undefined) data.conductedBy = input.conductedBy;

    const result = await prisma.testResult.update({
      where: { id },
      data,
      include: {
        site: { select: { id: true, name: true, code: true } },
        createdBy: { select: { id: true, firstName: true, lastName: true } },
        activity: { select: { id: true, activityType: true, activityDate: true } },
      },
    });

    logger.info({ testResultId: id }, "Test result updated");
    return result;
  }

  async deleteTestResult(id: string): Promise<void> {
    const existing = await testResultRepository.findById(id);
    if (!existing) throw new NotFoundError("TestResult");
    await testResultRepository.softDelete(id);
    logger.info({ testResultId: id }, "Test result soft-deleted");
  }
}

export const testResultService = new TestResultService();
