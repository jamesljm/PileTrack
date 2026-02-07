import type { TestResult, Prisma } from "@prisma/client";
import { prisma } from "../config/database";
import { BaseRepository } from "./base.repository";

class TestResultRepository extends BaseRepository<TestResult> {
  constructor() {
    super("testResult");
  }

  async findAllFiltered(
    filter: {
      siteId?: string;
      testType?: string;
      status?: string;
      search?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: TestResult[]; total: number }> {
    const where: Prisma.TestResultWhereInput = {
      deletedAt: null,
    };

    if (filter.siteId) where.siteId = filter.siteId;
    if (filter.testType) where.testType = filter.testType as any;
    if (filter.status) where.status = filter.status as any;
    if (filter.search) {
      where.OR = [
        { pileId: { contains: filter.search, mode: "insensitive" } },
        { conductedBy: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const [data, total] = await Promise.all([
      prisma.testResult.findMany({
        where,
        skip: pagination.skip,
        take: pagination.take,
        orderBy: { testDate: "desc" },
        include: {
          site: { select: { id: true, name: true, code: true } },
          createdBy: { select: { id: true, firstName: true, lastName: true } },
          activity: { select: { id: true, activityType: true, activityDate: true } },
        },
      }),
      prisma.testResult.count({ where }),
    ]);

    return { data, total };
  }
}

export const testResultRepository = new TestResultRepository();
