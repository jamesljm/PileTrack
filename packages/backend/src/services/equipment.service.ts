import { v4 as uuidv4 } from "uuid";
import { prisma } from "../config/database";
import { equipmentRepository } from "../repositories/equipment.repository";
import { NotFoundError, ConflictError, ValidationError } from "../utils/api-error";
import { generateQRCode } from "../utils/qr-generator";
import type { Equipment, EquipmentCategory, EquipmentStatus } from "@prisma/client";
import { logger } from "../config/logger";

export interface CreateEquipmentInput {
  siteId?: string;
  name: string;
  category?: EquipmentCategory;
  serialNumber?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  model?: string;
  yearManufactured?: number;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  notes?: string;
}

export interface UpdateEquipmentInput {
  siteId?: string | null;
  name?: string;
  category?: EquipmentCategory;
  serialNumber?: string;
  status?: EquipmentStatus;
  manufacturer?: string;
  model?: string;
  yearManufactured?: number;
  lastServiceDate?: Date;
  nextServiceDate?: Date;
  notes?: string;
}

class EquipmentService {
  async getEquipment(
    filter: {
      search?: string;
      category?: string;
      status?: string;
      siteId?: string;
    },
    pagination: { skip: number; take: number },
  ): Promise<{ data: Equipment[]; total: number }> {
    return equipmentRepository.findAllFiltered(filter, pagination);
  }

  async getEquipmentById(id: string): Promise<Equipment> {
    const equipment = await equipmentRepository.findById(id, {
      site: { select: { id: true, name: true, code: true } },
    });
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }
    return equipment;
  }

  async createEquipment(input: CreateEquipmentInput): Promise<Equipment> {
    if (input.serialNumber) {
      const existing = await equipmentRepository.findBySerialNumber(input.serialNumber);
      if (existing) {
        throw new ConflictError(`Equipment with serial number '${input.serialNumber}' already exists`);
      }
    }

    if (input.siteId) {
      const site = await prisma.site.findFirst({ where: { id: input.siteId, deletedAt: null } });
      if (!site) {
        throw new NotFoundError("Site");
      }
    }

    const qrCode = `EQ-${uuidv4()}`;

    const equipment = await prisma.equipment.create({
      data: {
        siteId: input.siteId,
        name: input.name,
        category: input.category ?? "GENERAL",
        serialNumber: input.serialNumber,
        qrCode,
        status: input.status ?? "AVAILABLE",
        manufacturer: input.manufacturer,
        model: input.model,
        yearManufactured: input.yearManufactured,
        lastServiceDate: input.lastServiceDate,
        nextServiceDate: input.nextServiceDate,
        notes: input.notes,
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    logger.info({ equipmentId: equipment.id, name: equipment.name }, "Equipment created");
    return equipment;
  }

  async updateEquipment(id: string, input: UpdateEquipmentInput): Promise<Equipment> {
    const existing = await equipmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Equipment");
    }

    if (input.serialNumber && input.serialNumber !== (existing as Equipment).serialNumber) {
      const conflict = await equipmentRepository.findBySerialNumber(input.serialNumber);
      if (conflict) {
        throw new ConflictError(`Equipment with serial number '${input.serialNumber}' already exists`);
      }
    }

    const equipment = await prisma.equipment.update({
      where: { id },
      data: input,
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    logger.info({ equipmentId: id }, "Equipment updated");
    return equipment;
  }

  async deleteEquipment(id: string): Promise<void> {
    const existing = await equipmentRepository.findById(id);
    if (!existing) {
      throw new NotFoundError("Equipment");
    }

    await equipmentRepository.softDelete(id);
    logger.info({ equipmentId: id }, "Equipment soft-deleted");
  }

  async generateQR(id: string): Promise<{ qrCode: string; svgContent: string }> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const eq = equipment as Equipment;
    const qrData = JSON.stringify({
      id: eq.id,
      name: eq.name,
      serialNumber: eq.serialNumber,
      qrCode: eq.qrCode,
    });

    const svgContent = generateQRCode(qrData);

    return {
      qrCode: eq.qrCode ?? "",
      svgContent,
    };
  }

  async scanQR(qrCode: string): Promise<Equipment> {
    const equipment = await equipmentRepository.findByQrCode(qrCode);
    if (!equipment) {
      throw new NotFoundError("Equipment with this QR code");
    }
    return equipment;
  }

  async logService(
    id: string,
    serviceData: {
      date: Date;
      description: string;
      performedBy: string;
      cost?: number;
      nextServiceDate?: Date;
    },
  ): Promise<Equipment> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    const eq = equipment as Equipment;
    const currentHistory = (eq.serviceHistory as unknown[] | null) ?? [];
    const updatedHistory = [
      ...currentHistory,
      {
        ...serviceData,
        loggedAt: new Date().toISOString(),
      },
    ];

    const updated = await prisma.equipment.update({
      where: { id },
      data: {
        lastServiceDate: serviceData.date,
        nextServiceDate: serviceData.nextServiceDate ?? eq.nextServiceDate,
        serviceHistory: updatedHistory,
        status: "AVAILABLE",
      },
      include: {
        site: { select: { id: true, name: true, code: true } },
      },
    });

    logger.info({ equipmentId: id }, "Service logged for equipment");
    return updated;
  }

  async getServiceDue(
    beforeDate?: Date,
    pagination: { skip: number; take: number } = { skip: 0, take: 20 },
  ): Promise<{ data: Equipment[]; total: number }> {
    return equipmentRepository.findServiceDue(beforeDate, pagination);
  }

  async getHistory(id: string): Promise<unknown[]> {
    const equipment = await equipmentRepository.findById(id);
    if (!equipment) {
      throw new NotFoundError("Equipment");
    }

    return ((equipment as Equipment).serviceHistory as unknown[] | null) ?? [];
  }
}

export const equipmentService = new EquipmentService();
