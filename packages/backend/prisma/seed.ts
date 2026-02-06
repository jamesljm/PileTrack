import { PrismaClient, UserRole, UserStatus, SiteStatus, EquipmentStatus, EquipmentCategory, ActivityType, ActivityStatus, TransferStatus, NotificationType } from "@prisma/client";
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

  console.log("\n🎉 Database seeded successfully with realistic Malaysian construction data!");
  console.log("\nLogin credentials (all users same password: Admin1234):");
  console.log("  admin@piletrack.com      (ADMIN)");
  console.log("  lee.wk@piletrack.com     (SUPERVISOR)");
  console.log("  siti.n@piletrack.com     (SUPERVISOR)");
  console.log("  muthu.k@piletrack.com    (WORKER)");
  console.log("  tan.ah@piletrack.com     (WORKER)");
  console.log("  rajesh.s@piletrack.com   (WORKER)");
  console.log("  faizal.m@piletrack.com   (WORKER)");
}

main()
  .catch((e) => { console.error("Seed failed:", e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
