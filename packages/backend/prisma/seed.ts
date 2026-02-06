import { PrismaClient, UserRole, UserStatus, SiteStatus, EquipmentStatus, EquipmentCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("Seeding database...");

  // ─── Users ──────────────────────────────────────────────────────────────────
  const adminPassword = await hashPassword("Admin123!");
  const supervisorPassword = await hashPassword("Super123!");
  const workerPassword = await hashPassword("Worker123!");

  const admin = await prisma.user.upsert({
    where: { email: "admin@piletrack.com" },
    update: {},
    create: {
      email: "admin@piletrack.com",
      passwordHash: adminPassword,
      firstName: "System",
      lastName: "Admin",
      phone: "+60123456789",
      role: UserRole.ADMIN,
      status: UserStatus.ACTIVE,
    },
  });

  const supervisor = await prisma.user.upsert({
    where: { email: "supervisor@piletrack.com" },
    update: {},
    create: {
      email: "supervisor@piletrack.com",
      passwordHash: supervisorPassword,
      firstName: "John",
      lastName: "Supervisor",
      phone: "+60123456790",
      role: UserRole.SUPERVISOR,
      status: UserStatus.ACTIVE,
    },
  });

  const worker = await prisma.user.upsert({
    where: { email: "worker@piletrack.com" },
    update: {},
    create: {
      email: "worker@piletrack.com",
      passwordHash: workerPassword,
      firstName: "Jane",
      lastName: "Worker",
      phone: "+60123456791",
      role: UserRole.WORKER,
      status: UserStatus.ACTIVE,
    },
  });

  console.log("Users created:", { admin: admin.id, supervisor: supervisor.id, worker: worker.id });

  // ─── Sites ──────────────────────────────────────────────────────────────────
  const site1 = await prisma.site.upsert({
    where: { code: "KL-001" },
    update: {},
    create: {
      name: "KL Tower Foundation",
      code: "KL-001",
      address: "Jalan Ampang, 50450 Kuala Lumpur, Malaysia",
      clientName: "KL Development Corp",
      contractNumber: "CT-2024-001",
      gpsLat: 3.1569,
      gpsLng: 101.7123,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2024-01-15"),
      expectedEndDate: new Date("2025-06-30"),
      description: "Bored piling works for new commercial tower foundation",
    },
  });

  const site2 = await prisma.site.upsert({
    where: { code: "PJ-002" },
    update: {},
    create: {
      name: "PJ Highway Retaining Wall",
      code: "PJ-002",
      address: "Petaling Jaya, 46000 Selangor, Malaysia",
      clientName: "Highway Authority Malaysia",
      contractNumber: "CT-2024-002",
      gpsLat: 3.1073,
      gpsLng: 101.6067,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2024-03-01"),
      expectedEndDate: new Date("2025-09-30"),
      description: "Sheet piling and soil nailing for highway retaining wall",
    },
  });

  console.log("Sites created:", { site1: site1.id, site2: site2.id });

  // ─── Site-User Assignments ────────────────────────────────────────────────
  await prisma.siteUser.upsert({
    where: { userId_siteId: { userId: admin.id, siteId: site1.id } },
    update: {},
    create: { userId: admin.id, siteId: site1.id, siteRole: "Project Manager" },
  });

  await prisma.siteUser.upsert({
    where: { userId_siteId: { userId: supervisor.id, siteId: site1.id } },
    update: {},
    create: { userId: supervisor.id, siteId: site1.id, siteRole: "Site Supervisor" },
  });

  await prisma.siteUser.upsert({
    where: { userId_siteId: { userId: worker.id, siteId: site1.id } },
    update: {},
    create: { userId: worker.id, siteId: site1.id, siteRole: "Piling Operator" },
  });

  await prisma.siteUser.upsert({
    where: { userId_siteId: { userId: supervisor.id, siteId: site2.id } },
    update: {},
    create: { userId: supervisor.id, siteId: site2.id, siteRole: "Site Supervisor" },
  });

  await prisma.siteUser.upsert({
    where: { userId_siteId: { userId: worker.id, siteId: site2.id } },
    update: {},
    create: { userId: worker.id, siteId: site2.id, siteRole: "Field Worker" },
  });

  console.log("Site-User assignments created");

  // ─── Equipment ────────────────────────────────────────────────────────────
  const equipment1 = await prisma.equipment.create({
    data: {
      siteId: site1.id,
      name: "Bauer BG 28 Rotary Drilling Rig",
      category: EquipmentCategory.PILING_RIG,
      serialNumber: "BG28-2023-001",
      qrCode: `EQ-${Date.now()}-001`,
      status: EquipmentStatus.IN_USE,
      manufacturer: "Bauer",
      model: "BG 28",
      yearManufactured: 2023,
      lastServiceDate: new Date("2024-06-15"),
      nextServiceDate: new Date("2024-12-15"),
      notes: "Primary piling rig for KL Tower project",
    },
  });

  const equipment2 = await prisma.equipment.create({
    data: {
      siteId: site1.id,
      name: "Liebherr LTM 1100 Mobile Crane",
      category: EquipmentCategory.CRANE,
      serialNumber: "LTM1100-2022-015",
      qrCode: `EQ-${Date.now()}-002`,
      status: EquipmentStatus.IN_USE,
      manufacturer: "Liebherr",
      model: "LTM 1100-4.2",
      yearManufactured: 2022,
      lastServiceDate: new Date("2024-08-01"),
      nextServiceDate: new Date("2025-02-01"),
      notes: "100-ton mobile crane for cage and casing handling",
    },
  });

  const equipment3 = await prisma.equipment.create({
    data: {
      siteId: site2.id,
      name: "CAT 320 Excavator",
      category: EquipmentCategory.EXCAVATOR,
      serialNumber: "CAT320-2021-042",
      qrCode: `EQ-${Date.now()}-003`,
      status: EquipmentStatus.AVAILABLE,
      manufacturer: "Caterpillar",
      model: "320 GC",
      yearManufactured: 2021,
      lastServiceDate: new Date("2024-07-20"),
      nextServiceDate: new Date("2025-01-20"),
      notes: "General excavation work for sheet pile installation",
    },
  });

  console.log("Equipment created:", {
    equipment1: equipment1.id,
    equipment2: equipment2.id,
    equipment3: equipment3.id,
  });

  // ─── Materials ────────────────────────────────────────────────────────────
  await prisma.material.create({
    data: {
      siteId: site1.id,
      name: "Grade 50 Concrete (C50)",
      unit: "m3",
      currentStock: 250,
      minimumStock: 50,
      unitPrice: 320,
      supplier: "Hanson Concrete Sdn Bhd",
      notes: "For bored pile casting",
    },
  });

  await prisma.material.create({
    data: {
      siteId: site1.id,
      name: "Steel Rebar Y32",
      unit: "tonnes",
      currentStock: 80,
      minimumStock: 20,
      unitPrice: 3200,
      supplier: "Southern Steel Berhad",
      notes: "32mm diameter high tensile steel for pile cages",
    },
  });

  await prisma.material.create({
    data: {
      siteId: site1.id,
      name: "Bentonite Powder",
      unit: "tonnes",
      currentStock: 15,
      minimumStock: 5,
      unitPrice: 850,
      supplier: "Drilling Supplies Malaysia",
      notes: "For bore stabilization fluid",
    },
  });

  await prisma.material.create({
    data: {
      siteId: site2.id,
      name: "Sheet Pile FSP-III",
      unit: "pieces",
      currentStock: 120,
      minimumStock: 30,
      unitPrice: 4500,
      supplier: "ArcelorMittal Distribution",
      notes: "Larssen type steel sheet piles",
    },
  });

  await prisma.material.create({
    data: {
      siteId: site2.id,
      name: "Soil Nails (32mm, 12m)",
      unit: "pieces",
      currentStock: 200,
      minimumStock: 50,
      unitPrice: 280,
      supplier: "Geo Foundation Systems",
      notes: "Galvanized soil nails for retaining wall",
    },
  });

  console.log("Materials created");

  console.log("Seed completed successfully!");
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
