import { PrismaClient, UserRole, UserStatus, SiteStatus, EquipmentStatus, EquipmentCategory, ActivityType, ActivityStatus, TransferStatus, NotificationType, DailyLogStatus, TestType, TestResultStatus, PileStatus, NCRStatus, NCRPriority, NCRCategory } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function hash(password: string) {
  return bcrypt.hash(password, 12);
}

async function main() {
  console.log("🌱 Seeding database with realistic data...\n");

  // ─── USERS ──────────────────────────────────────────────
  const pw = await hash("Admin1234");

  const admin = await prisma.user.upsert({
    where: { email: "admin@piletrack.com" },
    update: { role: UserRole.ADMIN, firstName: "Ahmad", lastName: "Rahman", phone: "+60123456789" },
    create: { email: "admin@piletrack.com", passwordHash: pw, firstName: "Ahmad", lastName: "Rahman", phone: "+60123456789", role: UserRole.ADMIN, status: UserStatus.ACTIVE },
  });

  const sup1 = await prisma.user.upsert({
    where: { email: "lee.wk@piletrack.com" },
    update: {},
    create: { email: "lee.wk@piletrack.com", passwordHash: pw, firstName: "Wei Kiat", lastName: "Lee", phone: "+60123456790", role: UserRole.SUPERVISOR, status: UserStatus.ACTIVE },
  });

  const sup2 = await prisma.user.upsert({
    where: { email: "siti.n@piletrack.com" },
    update: {},
    create: { email: "siti.n@piletrack.com", passwordHash: pw, firstName: "Siti", lastName: "Nurhaliza", phone: "+60123456791", role: UserRole.SUPERVISOR, status: UserStatus.ACTIVE },
  });

  const w1 = await prisma.user.upsert({
    where: { email: "muthu.k@piletrack.com" },
    update: {},
    create: { email: "muthu.k@piletrack.com", passwordHash: pw, firstName: "Muthu", lastName: "Krishnan", phone: "+60123456792", role: UserRole.WORKER, status: UserStatus.ACTIVE },
  });

  const w2 = await prisma.user.upsert({
    where: { email: "tan.ah@piletrack.com" },
    update: {},
    create: { email: "tan.ah@piletrack.com", passwordHash: pw, firstName: "Ah Hock", lastName: "Tan", phone: "+60123456793", role: UserRole.WORKER, status: UserStatus.ACTIVE },
  });

  const w3 = await prisma.user.upsert({
    where: { email: "rajesh.s@piletrack.com" },
    update: {},
    create: { email: "rajesh.s@piletrack.com", passwordHash: pw, firstName: "Rajesh", lastName: "Subramaniam", phone: "+60123456794", role: UserRole.WORKER, status: UserStatus.ACTIVE },
  });

  const w4 = await prisma.user.upsert({
    where: { email: "faizal.m@piletrack.com" },
    update: {},
    create: { email: "faizal.m@piletrack.com", passwordHash: pw, firstName: "Faizal", lastName: "Mohamed", phone: "+60123456795", role: UserRole.WORKER, status: UserStatus.ACTIVE },
  });

  console.log("✅ 7 users created");

  // ─── SITES ──────────────────────────────────────────────
  const site1 = await prisma.site.upsert({
    where: { code: "KL-TRX-001" },
    update: {},
    create: {
      name: "TRX Tower Foundation Works",
      code: "KL-TRX-001",
      address: "Jalan Tun Razak, 55000 Kuala Lumpur",
      clientName: "TRX City Sdn Bhd",
      contractNumber: "TRX-FDN-2025-001",
      gpsLat: 3.1425, gpsLng: 101.7195,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2025-06-01"),
      expectedEndDate: new Date("2026-12-31"),
      description: "Deep foundation works including bored piling, diaphragm wall and micropiling for 78-storey commercial tower",
    },
  });

  const site2 = await prisma.site.upsert({
    where: { code: "PJ-LRT3-002" },
    update: {},
    create: {
      name: "LRT3 Bandar Utama Station",
      code: "PJ-LRT3-002",
      address: "Persiaran Bandar Utama, 47800 Petaling Jaya",
      clientName: "Prasarana Malaysia Berhad",
      contractNumber: "LRT3-STA-2025-014",
      gpsLat: 3.1340, gpsLng: 101.6118,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2025-03-15"),
      expectedEndDate: new Date("2027-06-30"),
      description: "Underground station construction with sheet piling, soil nailing and ground anchors for deep excavation support",
    },
  });

  const site3 = await prisma.site.upsert({
    where: { code: "JB-CIQ-003" },
    update: {},
    create: {
      name: "JB-Singapore RTS Link CIQ",
      code: "JB-CIQ-003",
      address: "Bukit Chagar, 80300 Johor Bahru",
      clientName: "RTS Operations Sdn Bhd",
      contractNumber: "RTS-CIQ-2025-001",
      gpsLat: 1.4655, gpsLng: 103.7578,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2025-01-10"),
      expectedEndDate: new Date("2027-12-31"),
      description: "CIQ building foundation with caisson piles, pilecaps and pile head hacking for railway terminus",
    },
  });

  const site4 = await prisma.site.upsert({
    where: { code: "PNG-HILL-004" },
    update: {},
    create: {
      name: "Penang Hill Hillside Stabilization",
      code: "PNG-HILL-004",
      address: "Jalan Bukit Bendera, 11500 Air Itam, Penang",
      clientName: "Penang State Government",
      contractNumber: "PNG-SLOPE-2025-003",
      gpsLat: 5.4200, gpsLng: 100.2715,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2025-04-01"),
      expectedEndDate: new Date("2026-09-30"),
      description: "Slope stabilization using soil nailing, ground anchors and micropiling for hillside road widening",
    },
  });

  console.log("✅ 4 sites created");

  // ─── SITE-USER ASSIGNMENTS ──────────────────────────────
  const assignments = [
    { userId: admin.id, siteId: site1.id, siteRole: "Project Director" },
    { userId: admin.id, siteId: site2.id, siteRole: "Project Director" },
    { userId: admin.id, siteId: site3.id, siteRole: "Project Director" },
    { userId: admin.id, siteId: site4.id, siteRole: "Project Director" },
    { userId: sup1.id, siteId: site1.id, siteRole: "Site Supervisor" },
    { userId: sup1.id, siteId: site3.id, siteRole: "Site Supervisor" },
    { userId: sup2.id, siteId: site2.id, siteRole: "Site Supervisor" },
    { userId: sup2.id, siteId: site4.id, siteRole: "Site Supervisor" },
    { userId: w1.id, siteId: site1.id, siteRole: "Piling Operator" },
    { userId: w2.id, siteId: site1.id, siteRole: "Crane Operator" },
    { userId: w3.id, siteId: site2.id, siteRole: "Sheet Pile Driver" },
    { userId: w4.id, siteId: site3.id, siteRole: "Caisson Worker" },
    { userId: w1.id, siteId: site2.id, siteRole: "General Worker" },
    { userId: w2.id, siteId: site4.id, siteRole: "Soil Nail Installer" },
  ];

  for (const a of assignments) {
    await prisma.siteUser.upsert({
      where: { userId_siteId: { userId: a.userId, siteId: a.siteId } },
      update: {},
      create: a,
    });
  }
  console.log("✅ 14 site-user assignments created");

  // ─── EQUIPMENT ──────────────────────────────────────────
  const eqData = [
    { siteId: site1.id, name: "Bauer BG 36 Rotary Drilling Rig", category: EquipmentCategory.PILING_RIG, serialNumber: "BG36-2024-001", status: EquipmentStatus.IN_USE, manufacturer: "Bauer", model: "BG 36", yearManufactured: 2024, lastServiceDate: new Date("2025-11-15"), nextServiceDate: new Date("2026-05-15"), notes: "Primary rig for 1500mm bored piles" },
    { siteId: site1.id, name: "Bauer BG 28 Rotary Drilling Rig", category: EquipmentCategory.PILING_RIG, serialNumber: "BG28-2023-007", status: EquipmentStatus.IN_USE, manufacturer: "Bauer", model: "BG 28", yearManufactured: 2023, lastServiceDate: new Date("2025-10-01"), nextServiceDate: new Date("2026-04-01"), notes: "Secondary rig for 1000mm micropiles" },
    { siteId: site1.id, name: "Liebherr LTM 1100 Mobile Crane", category: EquipmentCategory.CRANE, serialNumber: "LTM1100-2022-015", status: EquipmentStatus.IN_USE, manufacturer: "Liebherr", model: "LTM 1100-4.2", yearManufactured: 2022, lastServiceDate: new Date("2025-12-01"), nextServiceDate: new Date("2026-06-01"), notes: "100-ton crane for cage lifting" },
    { siteId: site1.id, name: "Putzmeister BSA 2110 Concrete Pump", category: EquipmentCategory.CONCRETE_PUMP, serialNumber: "PM2110-2023-003", status: EquipmentStatus.IN_USE, manufacturer: "Putzmeister", model: "BSA 2110 HP-D", yearManufactured: 2023, lastServiceDate: new Date("2025-09-20"), nextServiceDate: new Date("2026-03-20"), notes: "Stationary pump for tremie concrete" },
    { siteId: site2.id, name: "ICE 44B Vibratory Hammer", category: EquipmentCategory.PILING_RIG, serialNumber: "ICE44B-2023-012", status: EquipmentStatus.IN_USE, manufacturer: "ICE", model: "44B", yearManufactured: 2023, lastServiceDate: new Date("2025-11-01"), nextServiceDate: new Date("2026-05-01"), notes: "For vibratory sheet pile driving" },
    { siteId: site2.id, name: "Kobelco SK210 Excavator", category: EquipmentCategory.EXCAVATOR, serialNumber: "SK210-2022-089", status: EquipmentStatus.IN_USE, manufacturer: "Kobelco", model: "SK210LC-10", yearManufactured: 2022, lastServiceDate: new Date("2025-10-15"), nextServiceDate: new Date("2026-04-15"), notes: "Fitted with hydraulic breaker for soil nail drilling" },
    { siteId: site2.id, name: "Atlas Copco GA 55 Compressor", category: EquipmentCategory.COMPRESSOR, serialNumber: "GA55-2024-002", status: EquipmentStatus.AVAILABLE, manufacturer: "Atlas Copco", model: "GA 55+", yearManufactured: 2024, lastServiceDate: new Date("2025-08-20"), nextServiceDate: new Date("2026-02-20"), notes: "Air supply for pneumatic drilling" },
    { siteId: site3.id, name: "MAIT HR180 Rotary Rig", category: EquipmentCategory.PILING_RIG, serialNumber: "HR180-2023-004", status: EquipmentStatus.IN_USE, manufacturer: "MAIT", model: "HR 180", yearManufactured: 2023, lastServiceDate: new Date("2025-12-10"), nextServiceDate: new Date("2026-06-10"), notes: "Caisson pile excavation rig" },
    { siteId: site3.id, name: "CAT 330 Excavator", category: EquipmentCategory.EXCAVATOR, serialNumber: "CAT330-2024-011", status: EquipmentStatus.IN_USE, manufacturer: "Caterpillar", model: "330 GC", yearManufactured: 2024, lastServiceDate: new Date("2025-11-20"), nextServiceDate: new Date("2026-05-20"), notes: "Pile head hacking and general earthworks" },
    { siteId: site3.id, name: "Tadano GR-600XL Crane", category: EquipmentCategory.CRANE, serialNumber: "GR600-2023-006", status: EquipmentStatus.AVAILABLE, manufacturer: "Tadano", model: "GR-600XL-4", yearManufactured: 2023, lastServiceDate: new Date("2025-10-10"), nextServiceDate: new Date("2026-04-10"), notes: "60-ton rough terrain crane" },
    { siteId: site4.id, name: "Hütte HBR 605 Drill Rig", category: EquipmentCategory.PILING_RIG, serialNumber: "HBR605-2024-003", status: EquipmentStatus.IN_USE, manufacturer: "Hütte", model: "HBR 605", yearManufactured: 2024, lastServiceDate: new Date("2025-12-01"), nextServiceDate: new Date("2026-06-01"), notes: "Compact rig for hillside micropiling and soil nails" },
    { siteId: site4.id, name: "Atlas Copco XAS 188 Compressor", category: EquipmentCategory.COMPRESSOR, serialNumber: "XAS188-2023-009", status: EquipmentStatus.IN_USE, manufacturer: "Atlas Copco", model: "XAS 188", yearManufactured: 2023, lastServiceDate: new Date("2025-09-15"), nextServiceDate: new Date("2026-03-15"), notes: "Portable compressor for anchor stressing" },
    { siteId: null, name: "Topcon GT-600 Total Station", category: EquipmentCategory.SURVEYING, serialNumber: "GT600-2024-001", status: EquipmentStatus.AVAILABLE, manufacturer: "Topcon", model: "GT-605", yearManufactured: 2024, lastServiceDate: new Date("2025-11-01"), nextServiceDate: new Date("2026-05-01"), notes: "Survey instrument - available for deployment" },
    { siteId: null, name: "Lincoln Electric Invertec V350", category: EquipmentCategory.WELDING_MACHINE, serialNumber: "V350-2023-005", status: EquipmentStatus.MAINTENANCE, manufacturer: "Lincoln Electric", model: "Invertec V350-PRO", yearManufactured: 2023, lastServiceDate: new Date("2026-01-15"), nextServiceDate: new Date("2026-07-15"), notes: "Under repair - motor replacement" },
    { siteId: null, name: "CAT D6 Bulldozer", category: EquipmentCategory.GENERAL, serialNumber: "D6-2022-018", status: EquipmentStatus.AVAILABLE, manufacturer: "Caterpillar", model: "D6 XE", yearManufactured: 2022, lastServiceDate: new Date("2025-08-01"), nextServiceDate: new Date("2026-02-01"), notes: "General earthworks - pending site allocation" },
  ];

  for (const eq of eqData) {
    await prisma.equipment.upsert({
      where: { serialNumber: eq.serialNumber },
      update: {},
      create: { ...eq, qrCode: `QR-${eq.serialNumber}` },
    });
  }
  console.log("✅ 15 equipment items created");

  // ─── MATERIALS ──────────────────────────────────────────
  const matData = [
    { siteId: site1.id, name: "Grade 50 Concrete (C50)", unit: "m³", currentStock: 185, minimumStock: 50, unitPrice: 340, supplier: "Hanson Concrete Sdn Bhd" },
    { siteId: site1.id, name: "Steel Rebar Y32 (Grade 500)", unit: "tonnes", currentStock: 62, minimumStock: 20, unitPrice: 3400, supplier: "Southern Steel Berhad" },
    { siteId: site1.id, name: "Steel Rebar Y16 (Grade 500)", unit: "tonnes", currentStock: 28, minimumStock: 10, unitPrice: 3200, supplier: "Southern Steel Berhad" },
    { siteId: site1.id, name: "Bentonite Powder", unit: "tonnes", currentStock: 12, minimumStock: 5, unitPrice: 900, supplier: "Drilling Supplies MY" },
    { siteId: site1.id, name: "Temporary Casing (1500mm)", unit: "pieces", currentStock: 8, minimumStock: 4, unitPrice: 18000, supplier: "Bauer Equipment MY" },
    { siteId: site1.id, name: "Tremie Pipe Sections (300mm)", unit: "pieces", currentStock: 24, minimumStock: 8, unitPrice: 2200, supplier: "Bauer Equipment MY" },
    { siteId: site2.id, name: "Sheet Pile FSP-IIIA (12m)", unit: "pieces", currentStock: 95, minimumStock: 30, unitPrice: 5200, supplier: "ArcelorMittal Distribution" },
    { siteId: site2.id, name: "Sheet Pile FSP-IIIA (9m)", unit: "pieces", currentStock: 60, minimumStock: 20, unitPrice: 3900, supplier: "ArcelorMittal Distribution" },
    { siteId: site2.id, name: "Soil Nails T32 (12m)", unit: "pieces", currentStock: 145, minimumStock: 50, unitPrice: 310, supplier: "Geo Foundation Systems" },
    { siteId: site2.id, name: "Shotcrete Premix", unit: "tonnes", currentStock: 35, minimumStock: 10, unitPrice: 420, supplier: "BASF Construction Chemicals" },
    { siteId: site2.id, name: "Waler Beams H350", unit: "pieces", currentStock: 18, minimumStock: 6, unitPrice: 8500, supplier: "Steel Industries MY" },
    { siteId: site3.id, name: "Grade 40 Concrete (C40)", unit: "m³", currentStock: 120, minimumStock: 40, unitPrice: 300, supplier: "YTL Cement Berhad" },
    { siteId: site3.id, name: "Steel Rebar Y25 (Grade 500)", unit: "tonnes", currentStock: 45, minimumStock: 15, unitPrice: 3300, supplier: "Perwaja Steel" },
    { siteId: site3.id, name: "Steel Liner Tubes (1200mm)", unit: "metres", currentStock: 80, minimumStock: 20, unitPrice: 1800, supplier: "KHK Scaffold & Formwork" },
    { siteId: site3.id, name: "Plywood Formwork (18mm)", unit: "sheets", currentStock: 200, minimumStock: 50, unitPrice: 85, supplier: "Evergreen Plywood" },
    { siteId: site4.id, name: "Soil Nails T25 (9m)", unit: "pieces", currentStock: 280, minimumStock: 80, unitPrice: 220, supplier: "Geo Foundation Systems" },
    { siteId: site4.id, name: "Cement Grout Premix", unit: "tonnes", currentStock: 18, minimumStock: 5, unitPrice: 380, supplier: "Sika Malaysia" },
    { siteId: site4.id, name: "Strand Anchors (7-wire, 15.2mm)", unit: "pieces", currentStock: 42, minimumStock: 15, unitPrice: 650, supplier: "VSL Engineering" },
    { siteId: site4.id, name: "Welded Wire Mesh A393", unit: "sheets", currentStock: 150, minimumStock: 40, unitPrice: 95, supplier: "Steel Industries MY" },
    { siteId: site4.id, name: "Micropile Casing (200mm)", unit: "metres", currentStock: 160, minimumStock: 40, unitPrice: 450, supplier: "Bauer Equipment MY" },
  ];

  for (const m of matData) {
    await prisma.material.create({ data: m });
  }
  console.log("✅ 20 materials created");

  // ─── ACTIVITY RECORDS (all 9 types) ─────────────────────
  const today = new Date();
  const d = (daysAgo: number) => { const dt = new Date(today); dt.setDate(dt.getDate() - daysAgo); return dt; };

  const activities = [
    // BORED PILING - Site 1
    { siteId: site1.id, activityType: ActivityType.BORED_PILING, status: ActivityStatus.APPROVED, activityDate: d(14), createdById: w1.id, approvedById: sup1.id, approvedAt: d(13), details: { pileId: "BP-001", diameter: 1500, depth: 48.5, reinforcementCage: "32Y32-12m sections x4", concreteVolume: 86.2, slumpTest: 180, cubeTestRef: "CT-2026-0142", casingDepth: 12.0, tremieLength: 36.5, cutOffLevel: -2.5, concreteGrade: "C50", startDepth: 0, finalDepth: 48.5, socketRockLength: 3.2, groundwaterLevel: -8.5, casingType: "Temporary 1500mm" }, weather: { condition: "Sunny", temperature: 32, humidity: 75, windSpeed: 8 }, remarks: "Pile completed successfully. Rock socket achieved at 45.3m. Good concrete quality." },
    { siteId: site1.id, activityType: ActivityType.BORED_PILING, status: ActivityStatus.APPROVED, activityDate: d(12), createdById: w1.id, approvedById: sup1.id, approvedAt: d(11), details: { pileId: "BP-002", diameter: 1500, depth: 51.2, reinforcementCage: "32Y32-12m sections x4 + 1x3m", concreteVolume: 91.5, slumpTest: 175, cubeTestRef: "CT-2026-0148", casingDepth: 14.0, tremieLength: 37.2, cutOffLevel: -2.5, concreteGrade: "C50", startDepth: 0, finalDepth: 51.2, socketRockLength: 3.5, groundwaterLevel: -9.0, casingType: "Temporary 1500mm" }, weather: { condition: "Partly Cloudy", temperature: 31, humidity: 78, windSpeed: 12 }, remarks: "Deeper than expected - soft layer at 25-28m required longer casing." },
    { siteId: site1.id, activityType: ActivityType.BORED_PILING, status: ActivityStatus.SUBMITTED, activityDate: d(2), createdById: w1.id, details: { pileId: "BP-003", diameter: 1200, depth: 42.0, reinforcementCage: "24Y32-12m sections x3 + 1x6m", concreteVolume: 48.8, slumpTest: 185, cubeTestRef: "CT-2026-0189", casingDepth: 10.0, tremieLength: 32.0, cutOffLevel: -2.0, concreteGrade: "C50", startDepth: 0, finalDepth: 42.0, socketRockLength: 2.8, groundwaterLevel: -7.5, casingType: "Temporary 1200mm" }, weather: { condition: "Light Rain", temperature: 28, humidity: 88, windSpeed: 15 }, remarks: "Pending cube test results before approval." },
    { siteId: site1.id, activityType: ActivityType.BORED_PILING, status: ActivityStatus.DRAFT, activityDate: d(0), createdById: w2.id, details: { pileId: "BP-004", diameter: 1500, depth: 35.0, reinforcementCage: "In progress", concreteVolume: 0, slumpTest: 0, cubeTestRef: "", casingDepth: 8.0, tremieLength: 0, cutOffLevel: -2.5, concreteGrade: "C50", startDepth: 0, finalDepth: 35.0, socketRockLength: 0, groundwaterLevel: -8.0, casingType: "Temporary 1500mm" }, weather: { condition: "Sunny", temperature: 33, humidity: 70, windSpeed: 5 }, remarks: "Boring in progress. Expected completion tomorrow." },

    // MICROPILING - Site 1 & 4
    { siteId: site1.id, activityType: ActivityType.MICROPILING, status: ActivityStatus.APPROVED, activityDate: d(10), createdById: w2.id, approvedById: sup1.id, approvedAt: d(9), details: { pileId: "MP-001", diameter: 300, depth: 22.5, groutPressure: 8.5, groutVolume: 420, reinforcementType: "N80 API Casing", bondLength: 8.0, freeLength: 14.5, testLoad: 850, inclination: 0, groutMixRatio: "1:0.45", casingLength: 22.5, drillingMethod: "Rotary Percussive", flushType: "WATER" }, weather: { condition: "Sunny", temperature: 31, humidity: 72, windSpeed: 6 }, remarks: "Test load achieved 1.5x design load. Satisfactory." },
    { siteId: site4.id, activityType: ActivityType.MICROPILING, status: ActivityStatus.APPROVED, activityDate: d(8), createdById: w2.id, approvedById: sup2.id, approvedAt: d(7), details: { pileId: "MP-101", diameter: 200, depth: 15.0, groutPressure: 12.0, groutVolume: 280, reinforcementType: "T32 Rebar", bondLength: 6.0, freeLength: 9.0, testLoad: 450, inclination: 15, groutMixRatio: "1:0.42", casingLength: 15.0, drillingMethod: "Rotary Percussive", flushType: "AIR" }, weather: { condition: "Overcast", temperature: 27, humidity: 85, windSpeed: 18 }, remarks: "Hillside installation. 15-degree inclination as per design." },

    // DIAPHRAGM WALL - Site 1
    { siteId: site1.id, activityType: ActivityType.DIAPHRAGM_WALL, status: ActivityStatus.APPROVED, activityDate: d(20), createdById: w1.id, approvedById: sup1.id, approvedAt: d(19), details: { panelId: "DW-P01", length: 6.0, width: 0.8, depth: 35.0, slurryLevel: -1.5, reinforcementCage: "Cage A - 48Y25 + Y16@150", concreteVolume: 168.0, jointType: "CWS", guideWallLevel: 0.5, excavationMethod: "HYDROMILL", slurryDensity: 1.05, panelSequence: 1, tremiePipeCount: 2, concreteGrade: "C40", overbreak: 2.5 }, weather: { condition: "Sunny", temperature: 33, humidity: 68, windSpeed: 7 }, remarks: "First panel completed. Verticality within tolerance 1:400." },
    { siteId: site1.id, activityType: ActivityType.DIAPHRAGM_WALL, status: ActivityStatus.SUBMITTED, activityDate: d(5), createdById: w1.id, details: { panelId: "DW-P02", length: 6.0, width: 0.8, depth: 35.0, slurryLevel: -1.2, reinforcementCage: "Cage B - 48Y25 + Y16@150", concreteVolume: 172.5, jointType: "CWS", guideWallLevel: 0.5, excavationMethod: "HYDROMILL", slurryDensity: 1.06, panelSequence: 2, tremiePipeCount: 2, concreteGrade: "C40", overbreak: 3.1 }, weather: { condition: "Partly Cloudy", temperature: 30, humidity: 80, windSpeed: 10 }, remarks: "Slight overbreak noted. Pending engineer review." },

    // SHEET PILING - Site 2
    { siteId: site2.id, activityType: ActivityType.SHEET_PILING, status: ActivityStatus.APPROVED, activityDate: d(18), createdById: w3.id, approvedById: sup2.id, approvedAt: d(17), details: { pileNumber: "SP-001", type: "FSP-IIIA", length: 12.0, driveMethod: "VIBRATORY", finalSet: 0, inclination: 0.5, interlockCondition: "GOOD", clutchType: "Larssen", vibroHammerModel: "ICE 44B", penetrationRate: 0.8, sectionModulus: "2270 cm³/m", coatingType: "None", weldingRequired: false, toeLevel: -11.5 }, weather: { condition: "Sunny", temperature: 34, humidity: 65, windSpeed: 5 }, remarks: "First pair driven. Interlock engagement confirmed by ultrasonic test." },
    { siteId: site2.id, activityType: ActivityType.SHEET_PILING, status: ActivityStatus.APPROVED, activityDate: d(16), createdById: w3.id, approvedById: sup2.id, approvedAt: d(15), details: { pileNumber: "SP-002 to SP-008", type: "FSP-IIIA", length: 12.0, driveMethod: "VIBRATORY", finalSet: 0, inclination: 0.3, interlockCondition: "GOOD", clutchType: "Larssen", vibroHammerModel: "ICE 44B", penetrationRate: 0.6, sectionModulus: "2270 cm³/m", coatingType: "None", weldingRequired: false, toeLevel: -11.5 }, weather: { condition: "Overcast", temperature: 29, humidity: 82, windSpeed: 14 }, remarks: "7 pairs driven in single shift. Good progress." },

    // PILECAP - Site 3
    { siteId: site3.id, activityType: ActivityType.PILECAP, status: ActivityStatus.APPROVED, activityDate: d(6), createdById: w4.id, approvedById: sup1.id, approvedAt: d(5), details: { pilecapId: "PC-001", linkedPileIds: ["CP-001", "CP-002", "CP-003", "CP-004"], length: 4.5, width: 4.5, depth: 2.0, reinforcementDetails: "T25@150 B.W. + T16@200 distribution", concreteVolume: 40.5, formworkType: "PLYWOOD", curingMethod: "WATER", cubeTestRef: "CT-2026-0175", concreteGrade: "C40", blindingThickness: 75, waterproofing: true, holdingDownBolts: true }, weather: { condition: "Sunny", temperature: 32, humidity: 70, windSpeed: 8 }, remarks: "4-pile cap completed. 7-day water curing initiated." },

    // PILE HEAD HACKING - Site 3
    { siteId: site3.id, activityType: ActivityType.PILE_HEAD_HACKING, status: ActivityStatus.APPROVED, activityDate: d(9), createdById: w4.id, approvedById: sup1.id, approvedAt: d(8), details: { pileId: "CP-001", hackingLevel: -2.0, method: "HYDRAULIC", reinforcementExposed: true, inspectionStatus: "PASSED", wasteVolume: 1.8, exposedRebarLength: 900, pileIntegrity: "GOOD", defectDescription: "", completionPhotos: [] }, weather: { condition: "Sunny", temperature: 33, humidity: 68, windSpeed: 6 }, remarks: "Clean hacking. 900mm rebar exposed for pilecap connection." },
    { siteId: site3.id, activityType: ActivityType.PILE_HEAD_HACKING, status: ActivityStatus.REJECTED, activityDate: d(7), createdById: w4.id, approvedById: sup1.id, approvedAt: d(6), rejectionNotes: "Rebar damaged during hacking. Need to splice additional bars.", details: { pileId: "CP-002", hackingLevel: -2.0, method: "MECHANICAL", reinforcementExposed: true, inspectionStatus: "FAILED", wasteVolume: 2.1, exposedRebarLength: 750, pileIntegrity: "MINOR_DEFECT", defectDescription: "2 rebars bent during mechanical hacking", completionPhotos: [] }, weather: { condition: "Partly Cloudy", temperature: 31, humidity: 75, windSpeed: 10 }, remarks: "Rework required. Switch to hydraulic method for remaining piles." },

    // SOIL NAILING - Site 2 & 4
    { siteId: site2.id, activityType: ActivityType.SOIL_NAILING, status: ActivityStatus.APPROVED, activityDate: d(11), createdById: w3.id, approvedById: sup2.id, approvedAt: d(10), details: { nailId: "SN-001", length: 12.0, diameter: 32, angle: 15, groutPressure: 3.5, groutVolume: 85, pullOutTestLoad: 180, facingType: "SHOTCRETE", facingThickness: 150, drainageProvided: true, drillHoleDiameter: 100, nailMaterial: "STEEL_BAR", headPlateSize: "250x250x20mm", rowNumber: 1, spacingHorizontal: 1.5, spacingVertical: 1.5 }, weather: { condition: "Sunny", temperature: 32, humidity: 72, windSpeed: 8 }, remarks: "Pull-out test passed at 180kN (design 120kN). Factor of safety 1.5." },
    { siteId: site4.id, activityType: ActivityType.SOIL_NAILING, status: ActivityStatus.SUBMITTED, activityDate: d(3), createdById: w2.id, details: { nailId: "SN-101", length: 9.0, diameter: 25, angle: 10, groutPressure: 4.0, groutVolume: 55, pullOutTestLoad: 0, facingType: "SHOTCRETE", facingThickness: 100, drainageProvided: true, drillHoleDiameter: 76, nailMaterial: "SELF_DRILLING", headPlateSize: "200x200x16mm", rowNumber: 1, spacingHorizontal: 1.2, spacingVertical: 1.2 }, weather: { condition: "Light Rain", temperature: 26, humidity: 90, windSpeed: 20 }, remarks: "Pull-out test scheduled for next week." },

    // GROUND ANCHOR - Site 2 & 4
    { siteId: site2.id, activityType: ActivityType.GROUND_ANCHOR, status: ActivityStatus.APPROVED, activityDate: d(15), createdById: w3.id, approvedById: sup2.id, approvedAt: d(14), details: { anchorId: "GA-001", type: "TEMPORARY", freeLength: 12.0, bondLength: 8.0, designLoad: 600, testLoad: 900, lockOffLoad: 450, strandCount: 4, groutPressure: 5.0, inclination: 25, drillHoleDiameter: 150, stressingRecord: "Stage loaded to 150% DL. Creep < 2mm. Locked off at 75% DL.", creepTest: true, corrosionProtection: "SINGLE", anchorHeadType: "Dywidag MA", wallType: "Sheet pile wall" }, weather: { condition: "Sunny", temperature: 33, humidity: 67, windSpeed: 6 }, remarks: "Anchor stressed and locked off successfully. Creep test passed." },
    { siteId: site4.id, activityType: ActivityType.GROUND_ANCHOR, status: ActivityStatus.APPROVED, activityDate: d(4), createdById: w2.id, approvedById: sup2.id, approvedAt: d(3), details: { anchorId: "GA-101", type: "PERMANENT", freeLength: 8.0, bondLength: 10.0, designLoad: 450, testLoad: 675, lockOffLoad: 340, strandCount: 3, groutPressure: 6.0, inclination: 20, drillHoleDiameter: 150, stressingRecord: "Loaded to 150% DL. All acceptance criteria met.", creepTest: true, corrosionProtection: "DOUBLE", anchorHeadType: "VSL EC", wallType: "Soil nail wall" }, weather: { condition: "Overcast", temperature: 27, humidity: 82, windSpeed: 12 }, remarks: "Permanent anchor with double corrosion protection as per BS 8081." },

    // CAISSON PILE - Site 3
    { siteId: site3.id, activityType: ActivityType.CAISSON_PILE, status: ActivityStatus.APPROVED, activityDate: d(22), createdById: w4.id, approvedById: sup1.id, approvedAt: d(21), details: { caissonId: "CP-001", diameter: 1200, depth: 32.0, excavationMethod: "RCD", groundwaterLevel: -6.5, concreteVolume: 38.2, reinforcementCage: "20Y32 + Y16@200 spirals", bellDiameter: 0, socketLength: 4.5, rockLevel: -27.5, linerType: "STEEL", linerThickness: 12, concreteGrade: "C45", baseGrouting: false, sonicLoggingTubes: 4 }, weather: { condition: "Sunny", temperature: 34, humidity: 65, windSpeed: 5 }, remarks: "RCD method used due to high groundwater. Sonic logging scheduled Day 7." },
    { siteId: site3.id, activityType: ActivityType.CAISSON_PILE, status: ActivityStatus.APPROVED, activityDate: d(19), createdById: w4.id, approvedById: sup1.id, approvedAt: d(18), details: { caissonId: "CP-002", diameter: 1200, depth: 34.5, excavationMethod: "RCD", groundwaterLevel: -7.0, concreteVolume: 41.0, reinforcementCage: "20Y32 + Y16@200 spirals", bellDiameter: 1800, socketLength: 5.0, rockLevel: -29.5, linerType: "STEEL", linerThickness: 12, concreteGrade: "C45", baseGrouting: true, sonicLoggingTubes: 4 }, weather: { condition: "Partly Cloudy", temperature: 31, humidity: 78, windSpeed: 10 }, remarks: "Bell-out to 1800mm at base. Base grouting applied for enhanced capacity." },
    { siteId: site3.id, activityType: ActivityType.CAISSON_PILE, status: ActivityStatus.SUBMITTED, activityDate: d(1), createdById: w4.id, details: { caissonId: "CP-003", diameter: 1500, depth: 28.0, excavationMethod: "HAMMER_GRAB", groundwaterLevel: -5.5, concreteVolume: 52.0, reinforcementCage: "24Y32 + Y16@200 spirals", bellDiameter: 0, socketLength: 3.0, rockLevel: -25.0, linerType: "CONCRETE", linerThickness: 100, concreteGrade: "C45", baseGrouting: false, sonicLoggingTubes: 4 }, weather: { condition: "Sunny", temperature: 33, humidity: 70, windSpeed: 7 }, remarks: "Pending sonic logging results." },
  ];

  for (const act of activities) {
    await prisma.activityRecord.create({
      data: {
        ...act,
        clientId: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        version: 1,
      },
    });
  }
  console.log("✅ 22 activity records created (all 9 types)");

  // ─── TRANSFERS ──────────────────────────────────────────
  const t1 = await prisma.transfer.create({
    data: {
      fromSiteId: site1.id, toSiteId: site3.id,
      status: TransferStatus.DELIVERED, requestedById: sup1.id, approvedById: admin.id,
      approvedAt: d(10), shippedAt: d(9), deliveredAt: d(7),
      notes: "Urgently needed for caisson pile reinforcement",
    },
  });
  await prisma.transferItem.createMany({
    data: [
      { transferId: t1.id, materialId: null, equipmentId: null, quantity: 5, notes: "5 tonnes Y32 rebar transferred" },
    ],
  });

  const t2 = await prisma.transfer.create({
    data: {
      fromSiteId: site2.id, toSiteId: site4.id,
      status: TransferStatus.IN_TRANSIT, requestedById: sup2.id, approvedById: admin.id,
      approvedAt: d(3), shippedAt: d(2),
      notes: "Soil nail installation equipment redeployment",
    },
  });

  const t3 = await prisma.transfer.create({
    data: {
      fromSiteId: site3.id, toSiteId: site1.id,
      status: TransferStatus.REQUESTED, requestedById: sup1.id,
      notes: "Request to transfer crane after caisson completion",
    },
  });

  const t4 = await prisma.transfer.create({
    data: {
      fromSiteId: site1.id, toSiteId: site2.id,
      status: TransferStatus.APPROVED, requestedById: sup2.id, approvedById: admin.id,
      approvedAt: d(1),
      notes: "Concrete pump needed for grouting works",
    },
  });

  console.log("✅ 4 transfers created");

  // ─── NOTIFICATIONS ──────────────────────────────────────
  const notifs = [
    { userId: admin.id, type: NotificationType.ACTIVITY_SUBMITTED, title: "New Activity Pending Approval", message: "Bored pile BP-003 at TRX Tower Foundation submitted by Muthu Krishnan awaits your review.", data: { activityType: "BORED_PILING", siteCode: "KL-TRX-001" } },
    { userId: admin.id, type: NotificationType.TRANSFER_REQUESTED, title: "Transfer Request", message: "Wei Kiat Lee requested crane transfer from JB-CIQ to TRX Tower site.", data: { fromSite: "JB-CIQ-003", toSite: "KL-TRX-001" } },
    { userId: sup1.id, type: NotificationType.ACTIVITY_APPROVED, title: "Activity Approved", message: "Caisson pile CP-002 at JB-CIQ has been approved by Ahmad Rahman.", data: { activityType: "CAISSON_PILE", siteCode: "JB-CIQ-003" } },
    { userId: sup2.id, type: NotificationType.ACTIVITY_SUBMITTED, title: "Soil Nailing Pending Review", message: "Soil nail SN-101 at Penang Hill submitted by Ah Hock Tan. Pull-out test pending.", data: { activityType: "SOIL_NAILING", siteCode: "PNG-HILL-004" } },
    { userId: sup1.id, type: NotificationType.TRANSFER_APPROVED, title: "Transfer Approved", message: "Your crane transfer request from JB-CIQ to TRX Tower has been approved.", data: {} },
    { userId: sup2.id, type: NotificationType.TRANSFER_DELIVERED, title: "Transfer Delivered", message: "5 tonnes Y32 rebar successfully delivered to JB-CIQ site.", data: {} },
    { userId: w4.id, type: NotificationType.ACTIVITY_REJECTED, title: "Activity Rejected", message: "Pile head hacking CP-002 was rejected. Reason: Rebar damaged during hacking.", data: { activityType: "PILE_HEAD_HACKING", siteCode: "JB-CIQ-003" } },
    { userId: admin.id, type: NotificationType.EQUIPMENT_SERVICE_DUE, title: "Equipment Service Due", message: "CAT D6 Bulldozer (D6-2022-018) service is overdue since 01 Feb 2026.", data: { equipmentCode: "D6-2022-018" } },
    { userId: admin.id, type: NotificationType.EQUIPMENT_SERVICE_DUE, title: "Equipment Service Due", message: "Atlas Copco GA 55 Compressor (GA55-2024-002) service due on 20 Feb 2026.", data: { equipmentCode: "GA55-2024-002" } },
    { userId: sup2.id, type: NotificationType.LOW_STOCK_ALERT, title: "Low Stock Alert", message: "Shotcrete Premix at LRT3 Bandar Utama is approaching minimum stock level (35 of 10 min).", data: { siteCode: "PJ-LRT3-002", material: "Shotcrete Premix" } },
    { userId: admin.id, type: NotificationType.SYSTEM, title: "System Maintenance", message: "PileTrack will undergo scheduled maintenance on 15 Feb 2026, 02:00-04:00 MYT.", data: {} },
  ];

  for (const n of notifs) {
    await prisma.notification.create({ data: n });
  }
  console.log("✅ 11 notifications created");

  // ─── NEW USERS ─────────────────────────────────────────
  const sup3 = await prisma.user.upsert({
    where: { email: "jason.lim@piletrack.com" },
    update: {},
    create: { email: "jason.lim@piletrack.com", passwordHash: pw, firstName: "Jason", lastName: "Lim", phone: "+6591234567", role: UserRole.SUPERVISOR, status: UserStatus.ACTIVE },
  });

  const w5 = await prisma.user.upsert({
    where: { email: "kumar.r@piletrack.com" },
    update: {},
    create: { email: "kumar.r@piletrack.com", passwordHash: pw, firstName: "Kumar", lastName: "Rajan", phone: "+60127654321", role: UserRole.WORKER, status: UserStatus.ACTIVE },
  });

  const w6 = await prisma.user.upsert({
    where: { email: "hafiz.a@piletrack.com" },
    update: {},
    create: { email: "hafiz.a@piletrack.com", passwordHash: pw, firstName: "Hafiz", lastName: "Abdullah", phone: "+60128765432", role: UserRole.WORKER, status: UserStatus.ACTIVE },
  });

  console.log("✅ 3 additional users created");

  // ─── NEW SITES (Johor + Singapore) ─────────────────────
  const site5 = await prisma.site.upsert({
    where: { code: "JB-DANGA-005" },
    update: {},
    create: {
      name: "Danga Bay Waterfront Mixed Development",
      code: "JB-DANGA-005",
      address: "Jalan Skudai, Danga Bay, 80200 Johor Bahru",
      clientName: "Iskandar Waterfront Holdings Sdn Bhd",
      contractNumber: "IWH-DB-2025-008",
      gpsLat: 1.4580, gpsLng: 103.7280,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2025-08-01"),
      expectedEndDate: new Date("2027-06-30"),
      description: "Jack-in piling and driven piling for 42-storey residential tower with 3-level basement car park at Danga Bay waterfront",
    },
  });

  const site6 = await prisma.site.upsert({
    where: { code: "SG-TE-006" },
    update: {},
    create: {
      name: "Thomson-East Coast Line T4 Extension",
      code: "SG-TE-006",
      address: "Bayshore Road, Singapore 469977",
      clientName: "Land Transport Authority Singapore",
      contractNumber: "LTA-TEL4-C902",
      gpsLat: 1.3080, gpsLng: 103.9350,
      status: SiteStatus.ACTIVE,
      startDate: new Date("2025-05-15"),
      expectedEndDate: new Date("2028-03-31"),
      description: "Deep bored piling for underground station box and TBM launching shaft. D-wall and contiguous bored pile retaining wall.",
    },
  });

  console.log("✅ 2 new sites created (Johor + Singapore)");

  // ─── NEW SITE-USER ASSIGNMENTS ─────────────────────────
  const newAssignments = [
    { userId: admin.id, siteId: site5.id, siteRole: "Project Director" },
    { userId: admin.id, siteId: site6.id, siteRole: "Project Director" },
    { userId: sup1.id, siteId: site5.id, siteRole: "Site Supervisor" },
    { userId: sup3.id, siteId: site6.id, siteRole: "Site Supervisor" },
    { userId: w5.id, siteId: site5.id, siteRole: "Driven Pile Operator" },
    { userId: w6.id, siteId: site5.id, siteRole: "Jack-in Pile Operator" },
    { userId: w5.id, siteId: site6.id, siteRole: "Bored Pile Operator" },
    { userId: w3.id, siteId: site6.id, siteRole: "General Worker" },
  ];
  for (const a of newAssignments) {
    await prisma.siteUser.upsert({
      where: { userId_siteId: { userId: a.userId, siteId: a.siteId } },
      update: {},
      create: a,
    });
  }
  console.log("✅ 8 new site-user assignments");

  // ─── NEW EQUIPMENT ─────────────────────────────────────
  const newEqData = [
    { siteId: site5.id, name: "Junttan HHK 12S Hydraulic Hammer", category: EquipmentCategory.PILING_RIG, serialNumber: "HHK12S-2024-002", status: EquipmentStatus.IN_USE, manufacturer: "Junttan", model: "HHK 12S", yearManufactured: 2024, lastServiceDate: new Date("2025-12-20"), nextServiceDate: new Date("2026-06-20"), notes: "12-tonne hydraulic hammer for driven piles" },
    { siteId: site5.id, name: "Giken Silent Piler ECO700S", category: EquipmentCategory.PILING_RIG, serialNumber: "ECO700S-2023-001", status: EquipmentStatus.IN_USE, manufacturer: "Giken", model: "ECO700S", yearManufactured: 2023, lastServiceDate: new Date("2025-11-10"), nextServiceDate: new Date("2026-05-10"), notes: "700kN jacking force for RC spun piles" },
    { siteId: site5.id, name: "Kobelco CKE2500 Crawler Crane", category: EquipmentCategory.CRANE, serialNumber: "CKE2500-2023-008", status: EquipmentStatus.IN_USE, manufacturer: "Kobelco", model: "CKE2500-2", yearManufactured: 2023, lastServiceDate: new Date("2025-10-25"), nextServiceDate: new Date("2026-04-25"), notes: "250-ton crawler crane for pile handling" },
    { siteId: site6.id, name: "Bauer BG 40 Rotary Drilling Rig", category: EquipmentCategory.PILING_RIG, serialNumber: "BG40-2024-003", status: EquipmentStatus.IN_USE, manufacturer: "Bauer", model: "BG 40", yearManufactured: 2024, lastServiceDate: new Date("2025-12-15"), nextServiceDate: new Date("2026-06-15"), notes: "Primary rig for 1800mm bored piles - Singapore TEL project" },
    { siteId: site6.id, name: "Liebherr LTM 1300 Mobile Crane", category: EquipmentCategory.CRANE, serialNumber: "LTM1300-2024-001", status: EquipmentStatus.IN_USE, manufacturer: "Liebherr", model: "LTM 1300-6.3", yearManufactured: 2024, lastServiceDate: new Date("2026-01-05"), nextServiceDate: new Date("2026-07-05"), notes: "300-ton mobile crane for Singapore deep foundation" },
    { siteId: site6.id, name: "Schwing SP 2800 Concrete Pump", category: EquipmentCategory.CONCRETE_PUMP, serialNumber: "SP2800-2024-004", status: EquipmentStatus.IN_USE, manufacturer: "Schwing", model: "SP 2800", yearManufactured: 2024, lastServiceDate: new Date("2025-11-28"), nextServiceDate: new Date("2026-05-28"), notes: "High-pressure pump for deep tremie concrete" },
  ];
  for (const eq of newEqData) {
    await prisma.equipment.upsert({
      where: { serialNumber: eq.serialNumber },
      update: {},
      create: { ...eq, qrCode: `QR-${eq.serialNumber}` },
    });
  }
  console.log("✅ 6 new equipment items");

  // ─── NEW MATERIALS ─────────────────────────────────────
  const newMatData = [
    { siteId: site5.id, name: "RC Spun Pile 300mm (12m)", unit: "pieces", currentStock: 85, minimumStock: 20, unitPrice: 2800, supplier: "ICP Sdn Bhd" },
    { siteId: site5.id, name: "RC Spun Pile 400mm (12m)", unit: "pieces", currentStock: 120, minimumStock: 30, unitPrice: 3600, supplier: "ICP Sdn Bhd" },
    { siteId: site5.id, name: "Precast Concrete Pile 350mm (12m)", unit: "pieces", currentStock: 60, minimumStock: 15, unitPrice: 3100, supplier: "Cahaya Jauhar Sdn Bhd" },
    { siteId: site5.id, name: "Steel H-Pile 305×305×97kg (12m)", unit: "pieces", currentStock: 45, minimumStock: 10, unitPrice: 5200, supplier: "Ann Joo Steel Berhad" },
    { siteId: site5.id, name: "Pile Joint Plates (400mm)", unit: "pieces", currentStock: 200, minimumStock: 50, unitPrice: 85, supplier: "Johor Steel Works" },
    { siteId: site5.id, name: "Grade 35 Concrete (C35)", unit: "m³", currentStock: 95, minimumStock: 30, unitPrice: 280, supplier: "Lafarge Malaysia" },
    { siteId: site6.id, name: "Grade 60 Concrete (C60)", unit: "m³", currentStock: 200, minimumStock: 80, unitPrice: 420, supplier: "Pan-United Concrete Pte Ltd" },
    { siteId: site6.id, name: "Steel Rebar Y40 (Grade 500)", unit: "tonnes", currentStock: 85, minimumStock: 30, unitPrice: 3800, supplier: "BRC Asia Ltd" },
    { siteId: site6.id, name: "Steel Rebar Y32 (Grade 500)", unit: "tonnes", currentStock: 120, minimumStock: 40, unitPrice: 3500, supplier: "BRC Asia Ltd" },
    { siteId: site6.id, name: "Bentonite Slurry", unit: "tonnes", currentStock: 25, minimumStock: 8, unitPrice: 950, supplier: "Drilling Fluids Singapore" },
    { siteId: site6.id, name: "Temporary Casing (1800mm)", unit: "pieces", currentStock: 6, minimumStock: 3, unitPrice: 25000, supplier: "Bauer Equipment SEA" },
    { siteId: site6.id, name: "Tremie Pipe Sections (350mm)", unit: "pieces", currentStock: 30, minimumStock: 10, unitPrice: 2800, supplier: "Bauer Equipment SEA" },
  ];
  for (const m of newMatData) {
    await prisma.material.create({ data: m });
  }
  console.log("✅ 12 new materials");

  // ─── ADDITIONAL ACTIVITY RECORDS (new types) ───────────
  const newActivities = [
    // DRIVEN PILE - Site 5
    { siteId: site5.id, activityType: ActivityType.DRIVEN_PILE, status: ActivityStatus.APPROVED, activityDate: d(20), createdById: w5.id, approvedById: sup1.id, approvedAt: d(19), details: { pileId: "DP-001", hammerType: "Hydraulic", hammerWeight: 12000, dropHeight: 1.2, finalSet: 3.5, totalBlowCount: 2850, designLength: 24, actualLength: 24, cutOffLevel: -1.5, platformLevel: 0.0, pileType: "Precast RC", pileSection: "350x350mm", concreteGrade: "C60", drivingLog: [{ depth: 6, blowCount: 180 }, { depth: 12, blowCount: 420 }, { depth: 18, blowCount: 780 }, { depth: 24, blowCount: 1470 }] }, weather: { condition: "Sunny", temperature: 33, humidity: 72, windSpeed: 8 }, remarks: "Pile driven to design depth. Final set 3.5mm/10 blows satisfactory." },
    { siteId: site5.id, activityType: ActivityType.DRIVEN_PILE, status: ActivityStatus.APPROVED, activityDate: d(18), createdById: w5.id, approvedById: sup1.id, approvedAt: d(17), details: { pileId: "DP-002", hammerType: "Hydraulic", hammerWeight: 12000, dropHeight: 1.2, finalSet: 2.8, totalBlowCount: 3100, designLength: 24, actualLength: 24, cutOffLevel: -1.5, platformLevel: 0.0, pileType: "Precast RC", pileSection: "350x350mm", concreteGrade: "C60", drivingLog: [{ depth: 6, blowCount: 200 }, { depth: 12, blowCount: 480 }, { depth: 18, blowCount: 850 }, { depth: 24, blowCount: 1570 }] }, weather: { condition: "Partly Cloudy", temperature: 31, humidity: 78, windSpeed: 10 }, remarks: "Good driving resistance. No pile damage observed." },
    { siteId: site5.id, activityType: ActivityType.DRIVEN_PILE, status: ActivityStatus.SUBMITTED, activityDate: d(3), createdById: w5.id, details: { pileId: "DP-005", hammerType: "Hydraulic", hammerWeight: 12000, dropHeight: 1.0, finalSet: 8.5, totalBlowCount: 1950, designLength: 24, actualLength: 24, cutOffLevel: -1.5, platformLevel: 0.0, pileType: "Steel H-Pile", pileSection: "305x305x97kg", steelGrade: "S355", drivingLog: [{ depth: 6, blowCount: 120 }, { depth: 12, blowCount: 350 }, { depth: 18, blowCount: 620 }, { depth: 24, blowCount: 860 }] }, weather: { condition: "Sunny", temperature: 34, humidity: 68, windSpeed: 5 }, remarks: "Steel H-pile. Higher set than expected - may need restrike test." },

    // JACK-IN PILE - Site 5
    { siteId: site5.id, activityType: ActivityType.JACK_IN_PILE, status: ActivityStatus.APPROVED, activityDate: d(15), createdById: w6.id, approvedById: sup1.id, approvedAt: d(14), details: { pileId: "JP-001", jackingForce: 700, designCapacity: 350, maxJackingForce: 700, pileType: "RC Spun", pileSection: "400mm dia", pileLength: 24, numberOfSections: 2, finalLoad: 700, penetrationRate: 0.8, terminationCriteria: "2x design load sustained for 2 min", designLength: 24, actualLength: 24, cutOffLevel: -1.0, jointDetails: "Welded steel end plates" }, weather: { condition: "Sunny", temperature: 32, humidity: 75, windSpeed: 6 }, remarks: "Pile jacked to 2x working load. Silent piler operation - no noise complaints." },
    { siteId: site5.id, activityType: ActivityType.JACK_IN_PILE, status: ActivityStatus.APPROVED, activityDate: d(13), createdById: w6.id, approvedById: sup1.id, approvedAt: d(12), details: { pileId: "JP-002", jackingForce: 700, designCapacity: 350, maxJackingForce: 680, pileType: "RC Spun", pileSection: "400mm dia", pileLength: 24, numberOfSections: 2, finalLoad: 680, penetrationRate: 0.6, terminationCriteria: "2x design load sustained for 2 min", designLength: 24, actualLength: 24, cutOffLevel: -1.0, jointDetails: "Welded steel end plates" }, weather: { condition: "Overcast", temperature: 29, humidity: 82, windSpeed: 12 }, remarks: "Reached termination criteria at 680kN. Satisfactory." },

    // CONTIGUOUS BORED PILE - Site 6
    { siteId: site6.id, activityType: ActivityType.CONTIGUOUS_BORED_PILE, status: ActivityStatus.APPROVED, activityDate: d(25), createdById: w5.id, approvedById: sup3.id, approvedAt: d(24), details: { pileId: "CBP-001", diameter: 1000, depth: 28, spacing: 1100, wallSectionId: "RW-A", panelId: "A1", secant: false, guideWallDetails: "500mm wide x 1200mm deep RC guide wall", reinforcementCage: "16Y32 + Y12@200 spirals", concreteVolume: 22.5, concreteGrade: "C45", designLength: 28, cutOffLevel: -1.5 }, weather: { condition: "Sunny", temperature: 31, humidity: 70, windSpeed: 5 }, remarks: "First CBP in retaining wall section A. Verticality 1:300 - within tolerance." },

    // GROUND IMPROVEMENT - Site 5
    { siteId: site5.id, activityType: ActivityType.GROUND_IMPROVEMENT, status: ActivityStatus.APPROVED, activityDate: d(30), createdById: w6.id, approvedById: sup1.id, approvedAt: d(29), details: { method: "Vibro-replacement stone column", gridRef: "Zone A - Grid 1-5", depth: 15, diameter: 800, columnSpacing: 2.0, treatmentArea: 500, fillMaterial: "Crushed granite 20-40mm", remarks: "Soft marine clay treatment for basement raft foundation" }, weather: { condition: "Sunny", temperature: 33, humidity: 70, windSpeed: 7 }, remarks: "Stone column installation completed for Zone A. Plate load test scheduled." },
  ];

  for (const act of newActivities) {
    await prisma.activityRecord.create({
      data: { ...act, clientId: `client-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`, version: 1 },
    });
  }
  console.log("✅ 8 new activity records (DRIVEN_PILE, JACK_IN_PILE, CONTIGUOUS_BORED_PILE, GROUND_IMPROVEMENT)");

  // ─── PILES (30 across sites) ──────────────────────────
  const pilesData = [
    // Site 1 - KL TRX Bored Piles
    { siteId: site1.id, pileId: "BP-001", pileType: ActivityType.BORED_PILING, status: PileStatus.APPROVED, designLength: 48, actualLength: 48.5, designDiameter: 1500, cutOffLevel: -2.5, platformLevel: 0.0, gridRef: "A1", concreteGrade: "C50", concreteVolume: 85, actualConcreteVol: 86.2, overconsumption: 1.4, createdById: w1.id, remarks: "Completed and approved" },
    { siteId: site1.id, pileId: "BP-002", pileType: ActivityType.BORED_PILING, status: PileStatus.APPROVED, designLength: 50, actualLength: 51.2, designDiameter: 1500, cutOffLevel: -2.5, platformLevel: 0.0, gridRef: "A2", concreteGrade: "C50", concreteVolume: 88, actualConcreteVol: 91.5, overconsumption: 4.0, createdById: w1.id, remarks: "Slight overconsumption due to soft layer" },
    { siteId: site1.id, pileId: "BP-003", pileType: ActivityType.BORED_PILING, status: PileStatus.TESTED, designLength: 42, actualLength: 42.0, designDiameter: 1200, cutOffLevel: -2.0, platformLevel: 0.0, gridRef: "A3", concreteGrade: "C50", concreteVolume: 47, actualConcreteVol: 48.8, overconsumption: 3.8, createdById: w1.id, remarks: "Cube test pending results" },
    { siteId: site1.id, pileId: "BP-004", pileType: ActivityType.BORED_PILING, status: PileStatus.BORED, designLength: 48, actualLength: 35.0, designDiameter: 1500, cutOffLevel: -2.5, platformLevel: 0.0, gridRef: "A4", concreteGrade: "C50", concreteVolume: 85, createdById: w2.id, remarks: "Boring in progress" },
    { siteId: site1.id, pileId: "BP-005", pileType: ActivityType.BORED_PILING, status: PileStatus.PLANNED, designLength: 48, designDiameter: 1500, cutOffLevel: -2.5, platformLevel: 0.0, gridRef: "B1", concreteGrade: "C50", concreteVolume: 85, createdById: w1.id },
    { siteId: site1.id, pileId: "BP-006", pileType: ActivityType.BORED_PILING, status: PileStatus.PLANNED, designLength: 48, designDiameter: 1500, cutOffLevel: -2.5, platformLevel: 0.0, gridRef: "B2", concreteGrade: "C50", concreteVolume: 85, createdById: w1.id },
    { siteId: site1.id, pileId: "BP-007", pileType: ActivityType.BORED_PILING, status: PileStatus.CONCRETED, designLength: 45, actualLength: 45.0, designDiameter: 1200, cutOffLevel: -2.0, platformLevel: 0.0, gridRef: "B3", concreteGrade: "C50", concreteVolume: 51, actualConcreteVol: 54.2, overconsumption: 6.3, createdById: w1.id, remarks: "Concrete poured. Curing in progress." },
    { siteId: site1.id, pileId: "BP-008", pileType: ActivityType.BORED_PILING, status: PileStatus.CAGED, designLength: 48, designDiameter: 1500, cutOffLevel: -2.5, platformLevel: 0.0, gridRef: "B4", concreteGrade: "C50", concreteVolume: 85, createdById: w2.id, remarks: "Cage lowered. Ready for concrete." },
    { siteId: site1.id, pileId: "MP-001", pileType: ActivityType.MICROPILING, status: PileStatus.APPROVED, designLength: 22, actualLength: 22.5, designDiameter: 300, cutOffLevel: -1.0, gridRef: "C1", concreteGrade: "Grout", concreteVolume: 1.6, actualConcreteVol: 1.7, overconsumption: 6.3, createdById: w2.id },

    // Site 3 - JB CIQ Caisson Piles
    { siteId: site3.id, pileId: "CP-001", pileType: ActivityType.CAISSON_PILE, status: PileStatus.APPROVED, designLength: 32, actualLength: 32.0, designDiameter: 1200, cutOffLevel: -2.0, gridRef: "P1", concreteGrade: "C45", concreteVolume: 36, actualConcreteVol: 38.2, overconsumption: 6.1, createdById: w4.id },
    { siteId: site3.id, pileId: "CP-002", pileType: ActivityType.CAISSON_PILE, status: PileStatus.APPROVED, designLength: 34, actualLength: 34.5, designDiameter: 1200, cutOffLevel: -2.0, gridRef: "P2", concreteGrade: "C45", concreteVolume: 38, actualConcreteVol: 41.0, overconsumption: 7.9, createdById: w4.id },
    { siteId: site3.id, pileId: "CP-003", pileType: ActivityType.CAISSON_PILE, status: PileStatus.CONCRETED, designLength: 28, actualLength: 28.0, designDiameter: 1500, cutOffLevel: -2.0, gridRef: "P3", concreteGrade: "C45", concreteVolume: 50, actualConcreteVol: 52.0, overconsumption: 4.0, createdById: w4.id, remarks: "Pending sonic logging" },
    { siteId: site3.id, pileId: "CP-004", pileType: ActivityType.CAISSON_PILE, status: PileStatus.CAGED, designLength: 30, designDiameter: 1200, cutOffLevel: -2.0, gridRef: "P4", concreteGrade: "C45", concreteVolume: 34, createdById: w4.id },
    { siteId: site3.id, pileId: "CP-005", pileType: ActivityType.CAISSON_PILE, status: PileStatus.PLANNED, designLength: 32, designDiameter: 1200, cutOffLevel: -2.0, gridRef: "P5", concreteGrade: "C45", concreteVolume: 36, createdById: w4.id },

    // Site 5 - JB Danga Bay Driven + Jack-in
    { siteId: site5.id, pileId: "DP-001", pileType: ActivityType.DRIVEN_PILE, status: PileStatus.APPROVED, designLength: 24, actualLength: 24.0, designDiameter: 350, cutOffLevel: -1.5, gridRef: "D1", concreteGrade: "C60", concreteVolume: 2.9, actualConcreteVol: 2.9, overconsumption: 0, createdById: w5.id },
    { siteId: site5.id, pileId: "DP-002", pileType: ActivityType.DRIVEN_PILE, status: PileStatus.APPROVED, designLength: 24, actualLength: 24.0, designDiameter: 350, cutOffLevel: -1.5, gridRef: "D2", concreteGrade: "C60", concreteVolume: 2.9, actualConcreteVol: 2.9, overconsumption: 0, createdById: w5.id },
    { siteId: site5.id, pileId: "DP-003", pileType: ActivityType.DRIVEN_PILE, status: PileStatus.TESTED, designLength: 24, actualLength: 24.0, designDiameter: 350, cutOffLevel: -1.5, gridRef: "D3", concreteGrade: "C60", concreteVolume: 2.9, actualConcreteVol: 2.9, overconsumption: 0, createdById: w5.id, remarks: "PDA test scheduled" },
    { siteId: site5.id, pileId: "DP-004", pileType: ActivityType.DRIVEN_PILE, status: PileStatus.SET_UP, designLength: 24, designDiameter: 350, cutOffLevel: -1.5, gridRef: "D4", concreteGrade: "C60", concreteVolume: 2.9, createdById: w5.id },
    { siteId: site5.id, pileId: "DP-005", pileType: ActivityType.DRIVEN_PILE, status: PileStatus.CONCRETED, designLength: 24, actualLength: 24.0, designDiameter: 305, cutOffLevel: -1.5, gridRef: "D5", createdById: w5.id, remarks: "Steel H-pile driven" },
    { siteId: site5.id, pileId: "JP-001", pileType: ActivityType.JACK_IN_PILE, status: PileStatus.APPROVED, designLength: 24, actualLength: 24.0, designDiameter: 400, cutOffLevel: -1.0, gridRef: "J1", concreteGrade: "C80", concreteVolume: 3.0, actualConcreteVol: 3.0, overconsumption: 0, createdById: w6.id },
    { siteId: site5.id, pileId: "JP-002", pileType: ActivityType.JACK_IN_PILE, status: PileStatus.APPROVED, designLength: 24, actualLength: 24.0, designDiameter: 400, cutOffLevel: -1.0, gridRef: "J2", concreteGrade: "C80", concreteVolume: 3.0, actualConcreteVol: 3.0, overconsumption: 0, createdById: w6.id },
    { siteId: site5.id, pileId: "JP-003", pileType: ActivityType.JACK_IN_PILE, status: PileStatus.TESTED, designLength: 24, actualLength: 24.0, designDiameter: 400, cutOffLevel: -1.0, gridRef: "J3", concreteGrade: "C80", concreteVolume: 3.0, actualConcreteVol: 3.0, overconsumption: 0, createdById: w6.id },
    { siteId: site5.id, pileId: "JP-004", pileType: ActivityType.JACK_IN_PILE, status: PileStatus.CONCRETED, designLength: 24, actualLength: 24.0, designDiameter: 300, cutOffLevel: -1.0, gridRef: "J4", concreteGrade: "C80", concreteVolume: 1.7, actualConcreteVol: 1.7, overconsumption: 0, createdById: w6.id },
    { siteId: site5.id, pileId: "JP-005", pileType: ActivityType.JACK_IN_PILE, status: PileStatus.PLANNED, designLength: 24, designDiameter: 400, cutOffLevel: -1.0, gridRef: "J5", concreteGrade: "C80", concreteVolume: 3.0, createdById: w6.id },
    { siteId: site5.id, pileId: "JP-006", pileType: ActivityType.JACK_IN_PILE, status: PileStatus.PLANNED, designLength: 24, designDiameter: 400, cutOffLevel: -1.0, gridRef: "J6", concreteGrade: "C80", concreteVolume: 3.0, createdById: w6.id },

    // Site 6 - Singapore TEL Bored Piles + CBP
    { siteId: site6.id, pileId: "SBP-001", pileType: ActivityType.BORED_PILING, status: PileStatus.APPROVED, designLength: 55, actualLength: 55.5, designDiameter: 1800, cutOffLevel: -3.0, gridRef: "S1", concreteGrade: "C60", concreteVolume: 140, actualConcreteVol: 145.2, overconsumption: 3.7, createdById: w5.id },
    { siteId: site6.id, pileId: "SBP-002", pileType: ActivityType.BORED_PILING, status: PileStatus.TESTED, designLength: 55, actualLength: 56.0, designDiameter: 1800, cutOffLevel: -3.0, gridRef: "S2", concreteGrade: "C60", concreteVolume: 140, actualConcreteVol: 148.5, overconsumption: 6.1, createdById: w5.id, remarks: "Crosshole sonic logging passed" },
    { siteId: site6.id, pileId: "SBP-003", pileType: ActivityType.BORED_PILING, status: PileStatus.CONCRETED, designLength: 52, actualLength: 52.0, designDiameter: 1500, cutOffLevel: -3.0, gridRef: "S3", concreteGrade: "C60", concreteVolume: 92, actualConcreteVol: 98.5, overconsumption: 7.1, createdById: w5.id },
    { siteId: site6.id, pileId: "CBP-001", pileType: ActivityType.CONTIGUOUS_BORED_PILE, status: PileStatus.APPROVED, designLength: 28, actualLength: 28.0, designDiameter: 1000, cutOffLevel: -1.5, gridRef: "RW-A1", concreteGrade: "C45", concreteVolume: 22, actualConcreteVol: 22.5, overconsumption: 2.3, createdById: w5.id },
    { siteId: site6.id, pileId: "CBP-002", pileType: ActivityType.CONTIGUOUS_BORED_PILE, status: PileStatus.CAGED, designLength: 28, designDiameter: 1000, cutOffLevel: -1.5, gridRef: "RW-A2", concreteGrade: "C45", concreteVolume: 22, createdById: w5.id },
  ];

  const createdPiles: Record<string, any> = {};
  for (const p of pilesData) {
    const pile = await prisma.pile.create({ data: p });
    createdPiles[`${p.siteId}-${p.pileId}`] = pile;
  }
  console.log(`✅ ${pilesData.length} piles created`);

  // ─── NCRs (12) ─────────────────────────────────────────
  const ncrsData = [
    { siteId: site1.id, pileId: createdPiles[`${site1.id}-BP-002`]?.id, ncrNumber: "NCR-TRX-001", category: NCRCategory.DIMENSIONAL, priority: NCRPriority.MEDIUM, status: NCRStatus.CLOSED, title: "Pile BP-002 overconsumption exceeds 3%", description: "Concrete overconsumption for BP-002 is 4.0% which exceeds the 3% tolerance specified in the contract. Soft clay layer at 25-28m caused cavity.", rootCause: "Unexpected soft marine clay layer between 25-28m depth causing borehole enlargement", correctiveAction: "Additional SI borehole drilled to verify ground conditions for remaining piles in this zone", preventiveAction: "Pre-bore SI holes for all piles in Zone A to identify soft layers before boring", raisedById: sup1.id, assignedToId: w1.id, closedById: admin.id, raisedAt: d(11), dueDate: d(4), closedAt: d(5) },
    { siteId: site1.id, ncrNumber: "NCR-TRX-002", category: NCRCategory.MATERIAL, priority: NCRPriority.HIGH, status: NCRStatus.RESOLVED, title: "Concrete slump exceeds specification for BP-007", description: "Delivered concrete slump measured at 210mm vs max 200mm specified. Concrete was accepted after engineer approval but NCR raised for documentation.", rootCause: "Batch plant over-dosed water reducer admixture by 15%", correctiveAction: "Notified Hanson Concrete. Batch plant recalibrated their admixture dosing system.", preventiveAction: "All future deliveries to be checked at gate before pouring. Reject if slump > 200mm.", raisedById: w1.id, assignedToId: sup1.id, raisedAt: d(8), dueDate: d(3) },
    { siteId: site1.id, ncrNumber: "NCR-TRX-003", category: NCRCategory.WORKMANSHIP, priority: NCRPriority.LOW, status: NCRStatus.OPEN, title: "Cage spacer blocks misaligned on BP-008", description: "During pre-concrete inspection, 3 spacer blocks found dislodged on cage for BP-008. Cover may be insufficient at those locations.", raisedById: sup1.id, assignedToId: w2.id, raisedAt: d(1), dueDate: d(-5) },
    { siteId: site3.id, pileId: createdPiles[`${site3.id}-CP-002`]?.id, ncrNumber: "NCR-CIQ-001", category: NCRCategory.STRUCTURAL, priority: NCRPriority.CRITICAL, status: NCRStatus.ACTION_REQUIRED, title: "Pile head damage during hacking CP-002", description: "2 main reinforcement bars bent during mechanical pile head hacking. Structural integrity of pilecap connection compromised.", rootCause: "Operator used mechanical method instead of hydraulic. Impact force too high for the concrete strength.", correctiveAction: "Splice additional 2Y32 bars with 40d lap length. Use hydraulic breaker for all remaining piles.", raisedById: sup1.id, assignedToId: w4.id, raisedAt: d(7), dueDate: d(0) },
    { siteId: site3.id, ncrNumber: "NCR-CIQ-002", category: NCRCategory.SAFETY, priority: NCRPriority.HIGH, status: NCRStatus.INVESTIGATING, title: "Missing safety barrier around open caisson excavation CP-005", description: "During site walk, open caisson excavation for CP-005 found without proper safety barriers and warning signs.", raisedById: admin.id, assignedToId: sup1.id, raisedAt: d(2), dueDate: d(-3) },
    { siteId: site5.id, pileId: createdPiles[`${site5.id}-DP-005`]?.id, ncrNumber: "NCR-DB-001", category: NCRCategory.WORKMANSHIP, priority: NCRPriority.HIGH, status: NCRStatus.OPEN, title: "High final set for driven pile DP-005", description: "Steel H-pile DP-005 recorded final set of 8.5mm/10 blows vs design requirement of ≤5mm. Pile may not have reached required bearing capacity.", raisedById: sup1.id, assignedToId: w5.id, raisedAt: d(2), dueDate: d(-4) },
    { siteId: site5.id, ncrNumber: "NCR-DB-002", category: NCRCategory.MATERIAL, priority: NCRPriority.MEDIUM, status: NCRStatus.RESOLVED, title: "RC Spun pile hairline crack on JP-004", description: "Hairline crack observed on RC spun pile JP-004 300mm section after delivery. Crack width <0.2mm.", rootCause: "Transport damage - pile not properly secured on lorry", correctiveAction: "Pile accepted with crack sealing using approved epoxy. Pile integrity test passed.", preventiveAction: "Updated delivery specification requiring proper cradle support and tie-down protocol.", raisedById: w6.id, assignedToId: sup1.id, raisedAt: d(9), dueDate: d(2) },
    { siteId: site6.id, pileId: createdPiles[`${site6.id}-SBP-003`]?.id, ncrNumber: "NCR-SG-001", category: NCRCategory.DIMENSIONAL, priority: NCRPriority.MEDIUM, status: NCRStatus.INVESTIGATING, title: "Overconsumption 7.1% on SBP-003", description: "Bored pile SBP-003 concrete overconsumption is 7.1% (98.5m3 vs design 92m3). LTA specification allows max 5%.", raisedById: sup3.id, assignedToId: w5.id, raisedAt: d(4), dueDate: d(-1) },
    { siteId: site6.id, ncrNumber: "NCR-SG-002", category: NCRCategory.ENVIRONMENTAL, priority: NCRPriority.LOW, status: NCRStatus.CLOSED, title: "Bentonite slurry overflow into drain", description: "Minor bentonite slurry overflow (~50L) into perimeter drain during SBP-002 boring. Drain was not connected to settlement tank.", rootCause: "Temporary slurry channel blocked with debris", correctiveAction: "Slurry cleaned up immediately. Channel cleared and sump pump installed.", preventiveAction: "Daily inspection of slurry management system before boring. Added checklist item.", raisedById: sup3.id, closedById: sup3.id, raisedAt: d(15), dueDate: d(10), closedAt: d(8) },
    { siteId: site4.id, ncrNumber: "NCR-PNG-001", category: NCRCategory.PROCEDURAL, priority: NCRPriority.MEDIUM, status: NCRStatus.OPEN, title: "Soil nail pull-out test not conducted within 7 days", description: "Soil nail SN-101 installed 10 days ago but pull-out test not yet conducted. IEM guidelines require testing within 7 days of installation.", raisedById: sup2.id, assignedToId: w2.id, raisedAt: d(1), dueDate: d(-3) },
    { siteId: site5.id, pileId: createdPiles[`${site5.id}-JP-003`]?.id, ncrNumber: "NCR-DB-003", category: NCRCategory.WORKMANSHIP, priority: NCRPriority.LOW, status: NCRStatus.CLOSED, title: "Jack-in pile JP-003 joint plate weld defect", description: "Visual inspection revealed incomplete fusion at pile joint weld for JP-003. Weld bead width inconsistent.", rootCause: "Welder did not preheat plates to required 100°C before welding in morning session", correctiveAction: "Joint re-welded by certified welder. UT inspection passed.", preventiveAction: "Mandatory preheat verification by supervisor before all pile joint welding.", raisedById: w6.id, assignedToId: sup1.id, closedById: sup1.id, raisedAt: d(12), dueDate: d(7), closedAt: d(6) },
    { siteId: site6.id, ncrNumber: "NCR-SG-003", category: NCRCategory.STRUCTURAL, priority: NCRPriority.HIGH, status: NCRStatus.OPEN, title: "CBP-002 cage verticality deviation", description: "Koden test on CBP-002 borehole shows 1:180 deviation at 20m depth. LTA specification requires 1:200 minimum.", raisedById: sup3.id, assignedToId: w5.id, raisedAt: d(1), dueDate: d(-5) },
  ];

  for (const ncr of ncrsData) {
    await prisma.nCR.create({ data: ncr });
  }
  console.log("✅ 12 NCRs created");

  // ─── CONCRETE DELIVERIES (16) ──────────────────────────
  const cdData = [
    // Site 1 - TRX bored pile concrete
    { siteId: site1.id, pileId: createdPiles[`${site1.id}-BP-001`]?.id, doNumber: "DO-HAN-26-0142", deliveryDate: d(14), supplier: "Hanson Concrete Sdn Bhd", batchPlant: "Hanson KL Sentral", truckNumber: "WKH 8821", concreteGrade: "C50", volume: 8.0, slumpRequired: 180, slumpActual: 175, batchTime: d(14), arrivalTime: d(14), temperature: 28, cubesTaken: 3, cubeSampleIds: ["CT-0142-A", "CT-0142-B", "CT-0142-C"], createdById: w1.id, remarks: "First load for BP-001" },
    { siteId: site1.id, pileId: createdPiles[`${site1.id}-BP-001`]?.id, doNumber: "DO-HAN-26-0143", deliveryDate: d(14), supplier: "Hanson Concrete Sdn Bhd", batchPlant: "Hanson KL Sentral", truckNumber: "WKH 9932", concreteGrade: "C50", volume: 8.0, slumpRequired: 180, slumpActual: 182, temperature: 29, cubesTaken: 3, createdById: w1.id },
    { siteId: site1.id, pileId: createdPiles[`${site1.id}-BP-002`]?.id, doNumber: "DO-HAN-26-0148", deliveryDate: d(12), supplier: "Hanson Concrete Sdn Bhd", batchPlant: "Hanson KL Sentral", truckNumber: "WKH 8821", concreteGrade: "C50", volume: 8.0, slumpRequired: 180, slumpActual: 178, temperature: 27, cubesTaken: 3, createdById: w1.id },
    { siteId: site1.id, pileId: createdPiles[`${site1.id}-BP-007`]?.id, doNumber: "DO-HAN-26-0185", deliveryDate: d(5), supplier: "Hanson Concrete Sdn Bhd", batchPlant: "Hanson KL Sentral", truckNumber: "WKH 5544", concreteGrade: "C50", volume: 8.0, slumpRequired: 180, slumpActual: 210, temperature: 30, cubesTaken: 3, createdById: w1.id, remarks: "Slump exceeded - NCR raised" },
    { siteId: site1.id, doNumber: "DO-HAN-26-0190", deliveryDate: d(4), supplier: "Hanson Concrete Sdn Bhd", batchPlant: "Hanson Shah Alam", truckNumber: "WKH 3311", concreteGrade: "C50", volume: 8.0, slumpRequired: 180, slumpActual: 195, rejected: true, rejectionReason: "Concrete arrived 2.5 hours after batching. Maximum allowable time is 2 hours per MS 1195.", temperature: 33, createdById: w2.id, remarks: "Truck stuck in KL traffic jam" },

    // Site 3 - JB CIQ caisson concrete
    { siteId: site3.id, pileId: createdPiles[`${site3.id}-CP-001`]?.id, doNumber: "DO-YTL-26-0501", deliveryDate: d(22), supplier: "YTL Cement Berhad", batchPlant: "YTL Johor Bahru", truckNumber: "JKR 2211", concreteGrade: "C45", volume: 6.0, slumpRequired: 180, slumpActual: 180, temperature: 30, cubesTaken: 3, createdById: w4.id },
    { siteId: site3.id, pileId: createdPiles[`${site3.id}-CP-002`]?.id, doNumber: "DO-YTL-26-0512", deliveryDate: d(19), supplier: "YTL Cement Berhad", batchPlant: "YTL Johor Bahru", truckNumber: "JKR 3344", concreteGrade: "C45", volume: 6.0, slumpRequired: 180, slumpActual: 176, temperature: 29, cubesTaken: 3, createdById: w4.id },
    { siteId: site3.id, pileId: createdPiles[`${site3.id}-CP-003`]?.id, doNumber: "DO-YTL-26-0530", deliveryDate: d(1), supplier: "YTL Cement Berhad", batchPlant: "YTL Johor Bahru", truckNumber: "JKR 2211", concreteGrade: "C45", volume: 8.0, slumpRequired: 180, slumpActual: 185, temperature: 31, cubesTaken: 4, createdById: w4.id },

    // Site 5 - JB Danga Bay
    { siteId: site5.id, doNumber: "DO-LAF-26-0801", deliveryDate: d(25), supplier: "Lafarge Malaysia", batchPlant: "Lafarge Pasir Gudang", truckNumber: "JMK 1122", concreteGrade: "C35", volume: 6.0, slumpRequired: 150, slumpActual: 145, temperature: 31, cubesTaken: 3, createdById: w6.id, remarks: "Grade C35 for ground improvement base slab" },
    { siteId: site5.id, doNumber: "DO-LAF-26-0815", deliveryDate: d(10), supplier: "Lafarge Malaysia", batchPlant: "Lafarge Pasir Gudang", truckNumber: "JMK 3344", concreteGrade: "C35", volume: 6.0, slumpRequired: 150, slumpActual: 155, temperature: 32, cubesTaken: 3, createdById: w5.id },

    // Site 6 - Singapore TEL
    { siteId: site6.id, pileId: createdPiles[`${site6.id}-SBP-001`]?.id, doNumber: "DO-PU-26-1001", deliveryDate: d(28), supplier: "Pan-United Concrete Pte Ltd", batchPlant: "Pan-United Tuas", truckNumber: "SBU 8821K", concreteGrade: "C60", volume: 7.0, slumpRequired: 180, slumpActual: 178, temperature: 28, cubesTaken: 4, cubeSampleIds: ["SG-CT-001A", "SG-CT-001B", "SG-CT-001C", "SG-CT-001D"], createdById: w5.id },
    { siteId: site6.id, pileId: createdPiles[`${site6.id}-SBP-001`]?.id, doNumber: "DO-PU-26-1002", deliveryDate: d(28), supplier: "Pan-United Concrete Pte Ltd", batchPlant: "Pan-United Tuas", truckNumber: "SBU 7712K", concreteGrade: "C60", volume: 7.0, slumpRequired: 180, slumpActual: 175, temperature: 28, cubesTaken: 0, createdById: w5.id },
    { siteId: site6.id, pileId: createdPiles[`${site6.id}-SBP-002`]?.id, doNumber: "DO-PU-26-1015", deliveryDate: d(20), supplier: "Pan-United Concrete Pte Ltd", batchPlant: "Pan-United Tuas", truckNumber: "SBU 8821K", concreteGrade: "C60", volume: 7.0, slumpRequired: 180, slumpActual: 182, temperature: 29, cubesTaken: 4, createdById: w5.id },
    { siteId: site6.id, pileId: createdPiles[`${site6.id}-SBP-003`]?.id, doNumber: "DO-PU-26-1028", deliveryDate: d(8), supplier: "Pan-United Concrete Pte Ltd", batchPlant: "Pan-United Tuas", truckNumber: "SBU 5533K", concreteGrade: "C60", volume: 7.0, slumpRequired: 180, slumpActual: 190, rejected: true, rejectionReason: "Slump 190mm exceeds C60 max 185mm per SS EN 206. Load rejected and returned.", temperature: 31, createdById: w5.id, remarks: "Rejected - slump out of spec" },
    { siteId: site6.id, pileId: createdPiles[`${site6.id}-CBP-001`]?.id, doNumber: "DO-PU-26-1040", deliveryDate: d(25), supplier: "Pan-United Concrete Pte Ltd", batchPlant: "Pan-United Senoko", truckNumber: "SBU 9944K", concreteGrade: "C45", volume: 6.0, slumpRequired: 175, slumpActual: 170, temperature: 28, cubesTaken: 3, createdById: w5.id },
  ];

  for (const cd of cdData) {
    await prisma.concreteDelivery.create({ data: cd });
  }
  console.log("✅ 16 concrete deliveries created");

  // ─── DAILY LOGS (12) ───────────────────────────────────
  const dailyLogsData = [
    { siteId: site1.id, logDate: d(1), status: DailyLogStatus.SUBMITTED, workforce: [{ trade: "Piling Crew", count: 8, hours: 10 }, { trade: "Crane Operator", count: 2, hours: 10 }, { trade: "Concrete Gang", count: 4, hours: 8 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Tremie concrete safety" }, delays: [], materialUsage: [{ material: "C50 Concrete", quantity: 54.2, unit: "m3" }, { material: "Bentonite", quantity: 0.8, unit: "tonnes" }], weather: { condition: "Sunny", temperature: 32, humidity: 75 }, createdById: sup1.id, remarks: "BP-007 concreted today. Good progress." },
    { siteId: site1.id, logDate: d(2), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Piling Crew", count: 8, hours: 10 }, { trade: "Crane Operator", count: 2, hours: 10 }, { trade: "Rebar Gang", count: 6, hours: 10 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 1, topic: "Lifting operations near overhead lines" }, delays: [{ type: "Weather", duration: 1.5, description: "Rain stoppage 1400-1530" }], materialUsage: [{ material: "Y32 Rebar", quantity: 2.8, unit: "tonnes" }], weather: { condition: "Rain", temperature: 28, humidity: 88 }, createdById: sup1.id, approvedById: admin.id, approvedAt: d(1), remarks: "BP-003 cage completed despite rain delay." },
    { siteId: site1.id, logDate: d(3), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Piling Crew", count: 8, hours: 10 }, { trade: "D-wall Crew", count: 6, hours: 10 }, { trade: "Surveyor", count: 1, hours: 8 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Confined space entry" }, delays: [], materialUsage: [{ material: "Bentonite", quantity: 1.2, unit: "tonnes" }, { material: "Tremie Pipe", quantity: 2, unit: "pcs" }], weather: { condition: "Sunny", temperature: 33, humidity: 70 }, createdById: sup1.id, approvedById: admin.id, approvedAt: d(2) },
    { siteId: site3.id, logDate: d(1), status: DailyLogStatus.SUBMITTED, workforce: [{ trade: "Caisson Crew", count: 6, hours: 10 }, { trade: "Crane Operator", count: 1, hours: 10 }, { trade: "Concrete Gang", count: 4, hours: 8 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Deep excavation safety" }, delays: [], materialUsage: [{ material: "C45 Concrete", quantity: 52, unit: "m3" }, { material: "Steel Liner", quantity: 10, unit: "m" }], weather: { condition: "Sunny", temperature: 33, humidity: 70 }, createdById: sup1.id, remarks: "CP-003 concreted. CP-004 cage lowering." },
    { siteId: site3.id, logDate: d(2), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Caisson Crew", count: 6, hours: 10 }, { trade: "Formwork Carpenter", count: 4, hours: 10 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Formwork stability" }, delays: [{ type: "Equipment", duration: 2, description: "Rig hydraulic leak - repaired on site" }], materialUsage: [{ material: "Plywood", quantity: 20, unit: "sheets" }], weather: { condition: "Partly Cloudy", temperature: 31, humidity: 78 }, createdById: sup1.id, approvedById: admin.id, approvedAt: d(1) },
    { siteId: site5.id, logDate: d(1), status: DailyLogStatus.SUBMITTED, workforce: [{ trade: "Driven Pile Crew", count: 6, hours: 10 }, { trade: "Jack-in Pile Crew", count: 4, hours: 10 }, { trade: "Crane Operator", count: 2, hours: 10 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 1, topic: "Pile handling and lifting" }, delays: [], materialUsage: [{ material: "RC Spun Pile 400mm", quantity: 4, unit: "pcs" }, { material: "Steel H-Pile", quantity: 2, unit: "pcs" }], weather: { condition: "Sunny", temperature: 33, humidity: 72 }, createdById: sup1.id, remarks: "2 driven piles and 2 jack-in piles completed today." },
    { siteId: site5.id, logDate: d(2), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Driven Pile Crew", count: 6, hours: 10 }, { trade: "Welder", count: 2, hours: 8 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Hot works and welding safety" }, delays: [{ type: "Material", duration: 3, description: "Late delivery of spun piles from factory" }], materialUsage: [{ material: "RC Spun Pile 300mm", quantity: 6, unit: "pcs" }, { material: "Joint Plates", quantity: 12, unit: "pcs" }], weather: { condition: "Overcast", temperature: 29, humidity: 85 }, createdById: sup1.id, approvedById: admin.id, approvedAt: d(1) },
    { siteId: site5.id, logDate: d(3), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Jack-in Pile Crew", count: 4, hours: 10 }, { trade: "General Worker", count: 3, hours: 8 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Machine guarding on silent piler" }, delays: [], materialUsage: [{ material: "RC Spun Pile 400mm", quantity: 4, unit: "pcs" }], weather: { condition: "Sunny", temperature: 34, humidity: 68 }, createdById: sup1.id, approvedById: admin.id, approvedAt: d(2) },
    { siteId: site6.id, logDate: d(1), status: DailyLogStatus.SUBMITTED, workforce: [{ trade: "Bored Pile Crew", count: 10, hours: 12 }, { trade: "Crane Operator", count: 2, hours: 12 }, { trade: "Concrete Pump Operator", count: 1, hours: 8 }, { trade: "Surveyor", count: 1, hours: 10 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Night works safety protocols" }, delays: [], materialUsage: [{ material: "C60 Concrete", quantity: 98.5, unit: "m3" }, { material: "Bentonite", quantity: 2.5, unit: "tonnes" }], weather: { condition: "Partly Cloudy", temperature: 30, humidity: 78 }, createdById: sup3.id, remarks: "SBP-003 concreted (day+night shift). CBP wall section progressing." },
    { siteId: site6.id, logDate: d(2), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Bored Pile Crew", count: 10, hours: 10 }, { trade: "CBP Crew", count: 6, hours: 10 }, { trade: "Rebar Gang", count: 8, hours: 10 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Working at height for cage assembly" }, delays: [], materialUsage: [{ material: "Y40 Rebar", quantity: 4.5, unit: "tonnes" }, { material: "Y32 Rebar", quantity: 3.2, unit: "tonnes" }], weather: { condition: "Sunny", temperature: 31, humidity: 72 }, createdById: sup3.id, approvedById: admin.id, approvedAt: d(1) },
    { siteId: site4.id, logDate: d(1), status: DailyLogStatus.DRAFT, workforce: [{ trade: "Soil Nail Crew", count: 4, hours: 8 }, { trade: "Shotcrete Crew", count: 3, hours: 6 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Slope stability monitoring" }, delays: [{ type: "Weather", duration: 4, description: "Heavy rain - slope works suspended" }], materialUsage: [{ material: "Soil Nails T25", quantity: 4, unit: "pcs" }, { material: "Shotcrete", quantity: 2.5, unit: "tonnes" }], weather: { condition: "Heavy Rain", temperature: 25, humidity: 95 }, createdById: sup2.id, remarks: "Limited progress due to rain. Monitoring piezometer readings." },
    { siteId: site2.id, logDate: d(1), status: DailyLogStatus.APPROVED, workforce: [{ trade: "Sheet Pile Crew", count: 6, hours: 10 }, { trade: "Soil Nail Crew", count: 4, hours: 10 }, { trade: "Excavator Operator", count: 2, hours: 10 }], safety: { toolboxTalk: true, incidents: 0, nearMisses: 0, topic: "Vibration monitoring near existing structures" }, delays: [], materialUsage: [{ material: "Sheet Pile FSP-IIIA", quantity: 4, unit: "pcs" }, { material: "Soil Nails T32", quantity: 6, unit: "pcs" }], weather: { condition: "Sunny", temperature: 32, humidity: 70 }, createdById: sup2.id, approvedById: admin.id, approvedAt: d(0) },
  ];

  for (const dl of dailyLogsData) {
    await prisma.dailyLog.create({ data: dl });
  }
  console.log("✅ 12 daily logs created");

  // ─── BOREHOLE LOGS (7) ─────────────────────────────────
  const bhData = [
    { siteId: site1.id, boreholeId: "BH-TRX-01", logDate: d(60), location: "Grid A1, 2m offset", gpsLat: 3.1426, gpsLng: 101.7196, totalDepth: 50, groundLevel: 0.0, groundwaterLevel: -8.5, casingDepth: 12, strata: [{ from: 0, to: 3, description: "Fill - sandy gravel", blowCount: 8 }, { from: 3, to: 12, description: "Stiff sandy clay (Alluvium)", blowCount: 15 }, { from: 12, to: 25, description: "Very stiff silty clay (Kenny Hill)", blowCount: 35 }, { from: 25, to: 28, description: "Soft marine clay", blowCount: 4 }, { from: 28, to: 45, description: "Hard shale (Kenny Hill)", blowCount: 50 }, { from: 45, to: 50, description: "Weathered granite", blowCount: 100 }], sptResults: [{ depth: 3, blowCount: 8 }, { depth: 6, blowCount: 12 }, { depth: 9, blowCount: 15 }, { depth: 12, blowCount: 18 }, { depth: 15, blowCount: 25 }, { depth: 20, blowCount: 35 }, { depth: 25, blowCount: 4 }, { depth: 30, blowCount: 45 }, { depth: 35, blowCount: 50 }, { depth: 40, blowCount: 50 }, { depth: 45, blowCount: 100 }], drillingMethod: "Rotary Wash Boring", contractor: "Geotek Sdn Bhd", loggedBy: "Ir. Tan Wei Ming", createdById: sup1.id },
    { siteId: site1.id, boreholeId: "BH-TRX-02", logDate: d(58), location: "Grid B1, 2m offset", gpsLat: 3.1427, gpsLng: 101.7197, totalDepth: 52, groundLevel: 0.0, groundwaterLevel: -9.0, casingDepth: 14, strata: [{ from: 0, to: 2, description: "Fill", blowCount: 6 }, { from: 2, to: 14, description: "Stiff sandy clay", blowCount: 18 }, { from: 14, to: 30, description: "Very stiff silty clay", blowCount: 40 }, { from: 30, to: 48, description: "Hard shale", blowCount: 50 }, { from: 48, to: 52, description: "Moderately weathered granite", blowCount: 100 }], sptResults: [{ depth: 3, blowCount: 10 }, { depth: 6, blowCount: 14 }, { depth: 12, blowCount: 22 }, { depth: 18, blowCount: 38 }, { depth: 24, blowCount: 42 }, { depth: 30, blowCount: 50 }, { depth: 36, blowCount: 50 }, { depth: 42, blowCount: 50 }, { depth: 48, blowCount: 100 }], drillingMethod: "Rotary Wash Boring", contractor: "Geotek Sdn Bhd", loggedBy: "Ir. Tan Wei Ming", createdById: sup1.id },
    { siteId: site3.id, boreholeId: "BH-CIQ-01", logDate: d(90), location: "Platform area P1-P4", gpsLat: 1.4656, gpsLng: 103.7579, totalDepth: 40, groundLevel: 0.0, groundwaterLevel: -6.5, casingDepth: 8, strata: [{ from: 0, to: 4, description: "Fill - sandy gravel", blowCount: 10 }, { from: 4, to: 15, description: "Firm marine clay", blowCount: 8 }, { from: 15, to: 28, description: "Stiff residual soil (Sedimentary)", blowCount: 25 }, { from: 28, to: 36, description: "Weathered sandstone", blowCount: 50 }, { from: 36, to: 40, description: "Hard sandstone", blowCount: 100 }], sptResults: [{ depth: 3, blowCount: 10 }, { depth: 6, blowCount: 8 }, { depth: 9, blowCount: 8 }, { depth: 12, blowCount: 12 }, { depth: 18, blowCount: 22 }, { depth: 24, blowCount: 30 }, { depth: 30, blowCount: 50 }, { depth: 36, blowCount: 100 }], drillingMethod: "Rotary Wash Boring", contractor: "GeoStar JB Sdn Bhd", loggedBy: "Ir. Ahmad Fauzi", createdById: sup1.id },
    { siteId: site5.id, boreholeId: "BH-DB-01", logDate: d(45), location: "Tower block - Grid D1", gpsLat: 1.4581, gpsLng: 103.7281, totalDepth: 35, groundLevel: 0.0, groundwaterLevel: -3.0, casingDepth: 6, strata: [{ from: 0, to: 3, description: "Fill - sandy", blowCount: 5 }, { from: 3, to: 8, description: "Soft marine clay", blowCount: 3 }, { from: 8, to: 18, description: "Medium stiff sandy clay", blowCount: 12 }, { from: 18, to: 28, description: "Dense sand (Old Alluvium)", blowCount: 40 }, { from: 28, to: 35, description: "Very dense sand / cemented sand", blowCount: 50 }], sptResults: [{ depth: 3, blowCount: 5 }, { depth: 6, blowCount: 3 }, { depth: 9, blowCount: 8 }, { depth: 12, blowCount: 12 }, { depth: 15, blowCount: 18 }, { depth: 20, blowCount: 35 }, { depth: 25, blowCount: 45 }, { depth: 30, blowCount: 50 }, { depth: 35, blowCount: 50 }], drillingMethod: "Rotary Wash Boring", contractor: "GeoStar JB Sdn Bhd", loggedBy: "Ir. Lim Chee Keong", createdById: sup1.id },
    { siteId: site5.id, boreholeId: "BH-DB-02", logDate: d(44), location: "Car park block - Grid J1", gpsLat: 1.4582, gpsLng: 103.7282, totalDepth: 30, groundLevel: 0.0, groundwaterLevel: -2.5, casingDepth: 5, strata: [{ from: 0, to: 2, description: "Fill", blowCount: 4 }, { from: 2, to: 10, description: "Soft to firm marine clay", blowCount: 4 }, { from: 10, to: 20, description: "Stiff sandy clay", blowCount: 15 }, { from: 20, to: 30, description: "Dense sand (Old Alluvium)", blowCount: 45 }], sptResults: [{ depth: 3, blowCount: 4 }, { depth: 6, blowCount: 4 }, { depth: 9, blowCount: 8 }, { depth: 12, blowCount: 15 }, { depth: 18, blowCount: 22 }, { depth: 24, blowCount: 42 }, { depth: 30, blowCount: 50 }], drillingMethod: "Rotary Wash Boring", contractor: "GeoStar JB Sdn Bhd", loggedBy: "Ir. Lim Chee Keong", createdById: sup1.id },
    { siteId: site6.id, boreholeId: "BH-TEL-01", logDate: d(80), location: "Station box - Grid S1", gpsLat: 1.3081, gpsLng: 103.9351, totalDepth: 65, groundLevel: 0.0, groundwaterLevel: -4.0, casingDepth: 15, strata: [{ from: 0, to: 5, description: "Fill - sandy gravel", blowCount: 8 }, { from: 5, to: 15, description: "Marine clay (Kallang Fm)", blowCount: 4 }, { from: 15, to: 30, description: "Stiff Old Alluvium - sandy clay", blowCount: 30 }, { from: 30, to: 50, description: "Dense Old Alluvium - cemented sand", blowCount: 50 }, { from: 50, to: 60, description: "Very hard cemented OA / weak rock", blowCount: 100 }, { from: 60, to: 65, description: "Bukit Timah Granite (Grade IV)", blowCount: 100 }], sptResults: [{ depth: 3, blowCount: 8 }, { depth: 6, blowCount: 4 }, { depth: 9, blowCount: 4 }, { depth: 12, blowCount: 6 }, { depth: 15, blowCount: 12 }, { depth: 20, blowCount: 28 }, { depth: 25, blowCount: 35 }, { depth: 30, blowCount: 50 }, { depth: 40, blowCount: 50 }, { depth: 50, blowCount: 100 }, { depth: 60, blowCount: 100 }], drillingMethod: "Rotary Coring", contractor: "Geotechnic Solutions Pte Ltd", loggedBy: "Ir. David Wong", createdById: sup3.id },
    { siteId: site4.id, boreholeId: "BH-PNG-01", logDate: d(70), location: "Slope crest - Ch.100", gpsLat: 5.4201, gpsLng: 100.2716, totalDepth: 20, groundLevel: 85.0, groundwaterLevel: -5.0, casingDepth: 3, strata: [{ from: 0, to: 3, description: "Residual soil - sandy silt", blowCount: 6 }, { from: 3, to: 8, description: "Completely weathered granite (Grade V)", blowCount: 12 }, { from: 8, to: 15, description: "Highly weathered granite (Grade IV)", blowCount: 30 }, { from: 15, to: 20, description: "Moderately weathered granite (Grade III)", blowCount: 50 }], sptResults: [{ depth: 3, blowCount: 6 }, { depth: 6, blowCount: 12 }, { depth: 9, blowCount: 18 }, { depth: 12, blowCount: 28 }, { depth: 15, blowCount: 35 }, { depth: 18, blowCount: 50 }], drillingMethod: "Rotary Coring", contractor: "Slope Engineering Sdn Bhd", loggedBy: "Ir. Ng Kok Heng", createdById: sup2.id },
  ];

  for (const bh of bhData) {
    await prisma.boreholeLog.create({ data: bh });
  }
  console.log("✅ 7 borehole logs created");

  // ─── TEST RESULTS (14) ─────────────────────────────────
  const testData = [
    // Cube tests - Site 1
    { siteId: site1.id, testType: TestType.CUBE_TEST, testDate: d(7), pileId: "BP-001", status: TestResultStatus.PASS, results: { cubeId: "CT-0142-A", age: 7, strength: 42.5, requiredStrength: 37.5, specimenSize: "150mm" }, conductedBy: "Jurutera Perunding ZKE", createdById: sup1.id },
    { siteId: site1.id, testType: TestType.CUBE_TEST, testDate: d(0), pileId: "BP-001", status: TestResultStatus.PASS, results: { cubeId: "CT-0142-B", age: 28, strength: 56.2, requiredStrength: 50.0, specimenSize: "150mm" }, conductedBy: "Jurutera Perunding ZKE", createdById: sup1.id, remarks: "28-day strength exceeds requirement" },
    { siteId: site1.id, testType: TestType.CUBE_TEST, testDate: d(5), pileId: "BP-002", status: TestResultStatus.PASS, results: { cubeId: "CT-0148-A", age: 7, strength: 40.8, requiredStrength: 37.5, specimenSize: "150mm" }, conductedBy: "Jurutera Perunding ZKE", createdById: sup1.id },
    { siteId: site1.id, testType: TestType.CUBE_TEST, testDate: d(2), pileId: "BP-003", status: TestResultStatus.PENDING, results: { cubeId: "CT-0189-A", age: 0, specimenSize: "150mm", notes: "Waiting for 7-day test" }, conductedBy: "Jurutera Perunding ZKE", createdById: sup1.id },

    // Slump tests
    { siteId: site1.id, testType: TestType.SLUMP_TEST, testDate: d(5), pileId: "BP-007", status: TestResultStatus.FAIL, results: { doNumber: "DO-HAN-26-0185", targetSlump: 180, measuredSlump: 210, tolerance: 20, maxAllowed: 200 }, conductedBy: "Site Lab Technician", createdById: w1.id, remarks: "Slump exceeded. NCR-TRX-002 raised." },
    { siteId: site6.id, testType: TestType.SLUMP_TEST, testDate: d(28), pileId: "SBP-001", status: TestResultStatus.PASS, results: { doNumber: "DO-PU-26-1001", targetSlump: 180, measuredSlump: 178, tolerance: 15, maxAllowed: 195 }, conductedBy: "Singapore Accredited Lab", createdById: sup3.id },

    // Crosshole Sonic Logging - Site 6
    { siteId: site6.id, testType: TestType.CROSSHOLE_SONIC, testDate: d(10), pileId: "SBP-002", status: TestResultStatus.PASS, results: { tubes: 4, firstArrivalTime: "Consistent across all profiles", anomalies: "None detected", maxVelocity: 4200, minVelocity: 3800, interpretation: "No significant defects. Pile concrete quality satisfactory." }, conductedBy: "Pile Dynamics Singapore", createdById: sup3.id, remarks: "All 6 profiles (1-2, 1-3, 1-4, 2-3, 2-4, 3-4) passed" },

    // PIT - Site 1
    { siteId: site1.id, testType: TestType.PIT, testDate: d(6), pileId: "BP-001", status: TestResultStatus.PASS, results: { method: "Pile Integrity Test (Low Strain)", velocity: 4100, impedanceChange: "None significant", reflectionFromToe: "Clear toe reflection at 48.3m", interpretation: "Pile intact. No defects detected." }, conductedBy: "GDS Testing Sdn Bhd", createdById: sup1.id },
    { siteId: site1.id, testType: TestType.PIT, testDate: d(4), pileId: "BP-002", status: TestResultStatus.PASS, results: { method: "Pile Integrity Test (Low Strain)", velocity: 4050, impedanceChange: "Minor increase at 25m (possible diameter change)", reflectionFromToe: "Clear toe reflection at 51.0m", interpretation: "Pile intact. Minor impedance change consistent with known soft layer." }, conductedBy: "GDS Testing Sdn Bhd", createdById: sup1.id },

    // PDA - Site 5
    { siteId: site5.id, testType: TestType.PDA, testDate: d(5), pileId: "DP-001", status: TestResultStatus.PASS, results: { method: "Pile Driving Analyzer - Restrike", designCapacity: 600, measuredCapacity: 820, factorOfSafety: 1.37, maxForce: 2400, maxVelocity: 3.2, blowCount: 10, set: 3.5, hammerEfficiency: 72, caseMethod: "CAPWAP", interpretation: "Pile capacity exceeds design by 37%. Satisfactory." }, conductedBy: "Pile Dynamics Asia", createdById: w5.id, remarks: "Restrike test 7 days after initial driving" },
    { siteId: site5.id, testType: TestType.PDA, testDate: d(4), pileId: "DP-002", status: TestResultStatus.PASS, results: { method: "Pile Driving Analyzer - Restrike", designCapacity: 600, measuredCapacity: 890, factorOfSafety: 1.48, maxForce: 2500, maxVelocity: 3.4, blowCount: 10, set: 2.8, hammerEfficiency: 75, caseMethod: "CAPWAP", interpretation: "Excellent pile capacity. Well above design." }, conductedBy: "Pile Dynamics Asia", createdById: w5.id },

    // Koden - Site 6
    { siteId: site6.id, testType: TestType.KODEN, testDate: d(6), pileId: "CBP-001", status: TestResultStatus.PASS, results: { maxDeviation: "1:300 at 22m depth", toleranceRequired: "1:200", direction: "North-South", depthMeasured: 28, boreholeCondition: "Clean, no obstructions" }, conductedBy: "Koden Asia Pte Ltd", createdById: sup3.id },
    { siteId: site6.id, testType: TestType.KODEN, testDate: d(2), pileId: "CBP-002", status: TestResultStatus.FAIL, results: { maxDeviation: "1:180 at 20m depth", toleranceRequired: "1:200", direction: "East-West", depthMeasured: 28, boreholeCondition: "Slight necking at 18m" }, conductedBy: "Koden Asia Pte Ltd", createdById: sup3.id, remarks: "NCR-SG-003 raised for verticality deviation" },
  ];

  for (const tr of testData) {
    await prisma.testResult.create({ data: tr });
  }
  console.log("✅ 14 test results created");

  console.log("\n🎉 Database seeded successfully with realistic Malaysian construction data!");
  console.log("\nLogin credentials (all users same password: Admin1234):");
  console.log("  admin@piletrack.com        (ADMIN)");
  console.log("  lee.wk@piletrack.com       (SUPERVISOR)");
  console.log("  siti.n@piletrack.com       (SUPERVISOR)");
  console.log("  jason.lim@piletrack.com    (SUPERVISOR - Singapore)");
  console.log("  muthu.k@piletrack.com      (WORKER)");
  console.log("  tan.ah@piletrack.com       (WORKER)");
  console.log("  rajesh.s@piletrack.com     (WORKER)");
  console.log("  faizal.m@piletrack.com     (WORKER)");
  console.log("  kumar.r@piletrack.com      (WORKER - Driven Pile)");
  console.log("  hafiz.a@piletrack.com      (WORKER - Jack-in Pile)");
  console.log("\nSites: KL-TRX-001, PJ-LRT3-002, JB-CIQ-003, PNG-HILL-004, JB-DANGA-005, SG-TE-006");
  console.log("Totals: 10 users, 6 sites, 31 piles, 12 NCRs, 16 concrete deliveries, 12 daily logs, 7 borehole logs, 14 test results");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
