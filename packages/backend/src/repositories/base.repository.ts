import { prisma } from "../config/database";
import type { PaginationParams } from "../utils/pagination";

export type ModelDelegate = {
  findMany: (args: Record<string, unknown>) => Promise<unknown[]>;
  findUnique: (args: Record<string, unknown>) => Promise<unknown | null>;
  findFirst: (args: Record<string, unknown>) => Promise<unknown | null>;
  create: (args: Record<string, unknown>) => Promise<unknown>;
  update: (args: Record<string, unknown>) => Promise<unknown>;
  count: (args: Record<string, unknown>) => Promise<number>;
};

export class BaseRepository<T extends Record<string, unknown>> {
  protected model: ModelDelegate;
  protected modelName: string;

  constructor(modelName: string) {
    this.modelName = modelName;
    this.model = (prisma as Record<string, unknown>)[modelName] as ModelDelegate;
  }

  async findAll(
    where: Record<string, unknown> = {},
    pagination?: PaginationParams,
    orderBy: Record<string, string> = { createdAt: "desc" },
    include?: Record<string, unknown>,
  ): Promise<{ data: T[]; total: number }> {
    const whereWithSoftDelete = { ...where, deletedAt: null };

    const [data, total] = await Promise.all([
      this.model.findMany({
        where: whereWithSoftDelete,
        ...(pagination ? { skip: pagination.skip, take: pagination.take } : {}),
        orderBy,
        ...(include ? { include } : {}),
      }),
      this.model.count({ where: whereWithSoftDelete }),
    ]);

    return { data: data as T[], total };
  }

  async findById(id: string, include?: Record<string, unknown>): Promise<T | null> {
    const result = await this.model.findFirst({
      where: { id, deletedAt: null },
      ...(include ? { include } : {}),
    });
    return result as T | null;
  }

  async create(data: Record<string, unknown>, include?: Record<string, unknown>): Promise<T> {
    const result = await this.model.create({
      data,
      ...(include ? { include } : {}),
    });
    return result as T;
  }

  async update(
    id: string,
    data: Record<string, unknown>,
    include?: Record<string, unknown>,
  ): Promise<T> {
    const result = await this.model.update({
      where: { id },
      data,
      ...(include ? { include } : {}),
    });
    return result as T;
  }

  async softDelete(id: string): Promise<T> {
    const result = await this.model.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
    return result as T;
  }

  async exists(where: Record<string, unknown>): Promise<boolean> {
    const count = await this.model.count({
      where: { ...where, deletedAt: null },
    });
    return count > 0;
  }
}
