import {
  ActivityType,
  ActivityStatus,
  EquipmentCategory,
  EquipmentStatus,
  EquipmentCondition,
  ServiceType,
  TransferStatus,
  SiteStatus,
  HoldPointType,
  HoldPointStatus,
  DailyLogStatus,
  TestType,
  TestResultStatus,
  PileStatus,
  NCRStatus,
  NCRPriority,
  NCRCategory,
} from "@piletrack/shared";

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:3001/api";

export const APP_NAME = "PileTrack";

export const SYNC_INTERVAL = 30_000; // 30 seconds

export const MAX_RETRY = 3;

export const ACTIVITY_TYPE_LABELS: Record<ActivityType, string> = {
  [ActivityType.BORED_PILING]: "Bored Piling",
  [ActivityType.MICROPILING]: "Micropiling",
  [ActivityType.DIAPHRAGM_WALL]: "Diaphragm Wall",
  [ActivityType.SHEET_PILING]: "Sheet Piling",
  [ActivityType.PILECAP]: "Pilecap",
  [ActivityType.PILE_HEAD_HACKING]: "Pile Head Hacking",
  [ActivityType.SOIL_NAILING]: "Soil Nailing",
  [ActivityType.GROUND_ANCHOR]: "Ground Anchor",
  [ActivityType.CAISSON_PILE]: "Caisson Pile",
  [ActivityType.DRIVEN_PILE]: "Driven Pile",
  [ActivityType.JACK_IN_PILE]: "Jack-in Pile",
  [ActivityType.CONTIGUOUS_BORED_PILE]: "Contiguous Bored Pile",
  [ActivityType.GROUND_IMPROVEMENT]: "Ground Improvement",
  [ActivityType.SLOPE_PROTECTION]: "Slope Protection",
};

export const EQUIPMENT_CATEGORY_LABELS: Record<EquipmentCategory, string> = {
  [EquipmentCategory.PILING_RIG]: "Piling Rig",
  [EquipmentCategory.CRANE]: "Crane",
  [EquipmentCategory.EXCAVATOR]: "Excavator",
  [EquipmentCategory.CONCRETE_PUMP]: "Concrete Pump",
  [EquipmentCategory.GENERATOR]: "Generator",
  [EquipmentCategory.COMPRESSOR]: "Compressor",
  [EquipmentCategory.WELDING_MACHINE]: "Welding Machine",
  [EquipmentCategory.SURVEYING]: "Surveying",
  [EquipmentCategory.SAFETY]: "Safety",
  [EquipmentCategory.GENERAL]: "General",
};

export const ACTIVITY_STATUS_COLORS: Record<ActivityStatus, string> = {
  [ActivityStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [ActivityStatus.SUBMITTED]: "bg-blue-100 text-blue-800",
  [ActivityStatus.APPROVED]: "bg-green-100 text-green-800",
  [ActivityStatus.REJECTED]: "bg-red-100 text-red-800",
};

export const EQUIPMENT_STATUS_COLORS: Record<EquipmentStatus, string> = {
  [EquipmentStatus.AVAILABLE]: "bg-green-100 text-green-800",
  [EquipmentStatus.IN_USE]: "bg-blue-100 text-blue-800",
  [EquipmentStatus.MAINTENANCE]: "bg-yellow-100 text-yellow-800",
  [EquipmentStatus.DECOMMISSIONED]: "bg-gray-100 text-gray-800",
};

export const TRANSFER_STATUS_COLORS: Record<TransferStatus, string> = {
  [TransferStatus.REQUESTED]: "bg-blue-100 text-blue-800",
  [TransferStatus.APPROVED]: "bg-green-100 text-green-800",
  [TransferStatus.IN_TRANSIT]: "bg-yellow-100 text-yellow-800",
  [TransferStatus.DELIVERED]: "bg-emerald-100 text-emerald-800",
  [TransferStatus.CANCELLED]: "bg-gray-100 text-gray-800",
};

export const SITE_STATUS_COLORS: Record<SiteStatus, string> = {
  [SiteStatus.ACTIVE]: "bg-green-100 text-green-800",
  [SiteStatus.INACTIVE]: "bg-gray-100 text-gray-800",
  [SiteStatus.COMPLETED]: "bg-blue-100 text-blue-800",
};

export const HOLD_POINT_TYPE_LABELS: Record<HoldPointType, string> = {
  [HoldPointType.PRE_BORING]: "Pre-Boring",
  [HoldPointType.PRE_CAGE]: "Pre-Cage",
  [HoldPointType.PRE_CONCRETE]: "Pre-Concrete",
  [HoldPointType.POST_BORING]: "Post-Boring",
  [HoldPointType.CAGE_INSPECTION]: "Cage Inspection",
  [HoldPointType.DURING_CONCRETING]: "During Concreting",
  [HoldPointType.POST_CONCRETING]: "Post-Concreting",
  [HoldPointType.PRE_DRIVING]: "Pre-Driving",
  [HoldPointType.FINAL_SET]: "Final Set",
};

export const HOLD_POINT_STATUS_COLORS: Record<HoldPointStatus, string> = {
  [HoldPointStatus.PENDING]: "bg-yellow-100 text-yellow-800",
  [HoldPointStatus.APPROVED]: "bg-green-100 text-green-800",
  [HoldPointStatus.REJECTED]: "bg-red-100 text-red-800",
};

export const SERVICE_TYPE_LABELS: Record<ServiceType, string> = {
  [ServiceType.ROUTINE_MAINTENANCE]: "Routine Maintenance",
  [ServiceType.REPAIR]: "Repair",
  [ServiceType.INSPECTION]: "Inspection",
  [ServiceType.OVERHAUL]: "Overhaul",
  [ServiceType.CALIBRATION]: "Calibration",
  [ServiceType.BREAKDOWN_REPAIR]: "Breakdown Repair",
};

export const SERVICE_TYPE_COLORS: Record<ServiceType, string> = {
  [ServiceType.ROUTINE_MAINTENANCE]: "bg-blue-100 text-blue-800",
  [ServiceType.REPAIR]: "bg-orange-100 text-orange-800",
  [ServiceType.INSPECTION]: "bg-purple-100 text-purple-800",
  [ServiceType.OVERHAUL]: "bg-red-100 text-red-800",
  [ServiceType.CALIBRATION]: "bg-cyan-100 text-cyan-800",
  [ServiceType.BREAKDOWN_REPAIR]: "bg-red-100 text-red-800",
};

export const EQUIPMENT_CONDITION_LABELS: Record<EquipmentCondition, string> = {
  [EquipmentCondition.EXCELLENT]: "Excellent",
  [EquipmentCondition.GOOD]: "Good",
  [EquipmentCondition.FAIR]: "Fair",
  [EquipmentCondition.POOR]: "Poor",
  [EquipmentCondition.CRITICAL]: "Critical",
};

export const EQUIPMENT_CONDITION_COLORS: Record<EquipmentCondition, string> = {
  [EquipmentCondition.EXCELLENT]: "bg-green-100 text-green-800",
  [EquipmentCondition.GOOD]: "bg-blue-100 text-blue-800",
  [EquipmentCondition.FAIR]: "bg-yellow-100 text-yellow-800",
  [EquipmentCondition.POOR]: "bg-orange-100 text-orange-800",
  [EquipmentCondition.CRITICAL]: "bg-red-100 text-red-800",
};

export const WEATHER_CONDITIONS = [
  "SUNNY",
  "CLOUDY",
  "OVERCAST",
  "LIGHT_RAIN",
  "HEAVY_RAIN",
  "THUNDERSTORM",
  "WINDY",
  "FOG",
  "HAZE",
] as const;

export const WEATHER_CONDITION_LABELS: Record<string, string> = {
  SUNNY: "Sunny",
  CLOUDY: "Cloudy",
  OVERCAST: "Overcast",
  LIGHT_RAIN: "Light Rain",
  HEAVY_RAIN: "Heavy Rain",
  THUNDERSTORM: "Thunderstorm",
  WINDY: "Windy",
  FOG: "Fog",
  HAZE: "Haze",
};

// ─── Daily Log ──────────────────────────────────────────────────────────────

export const DAILY_LOG_STATUS_COLORS: Record<DailyLogStatus, string> = {
  [DailyLogStatus.DRAFT]: "bg-gray-100 text-gray-800",
  [DailyLogStatus.SUBMITTED]: "bg-blue-100 text-blue-800",
  [DailyLogStatus.APPROVED]: "bg-green-100 text-green-800",
  [DailyLogStatus.REJECTED]: "bg-red-100 text-red-800",
};

// ─── Test ───────────────────────────────────────────────────────────────────

export const TEST_TYPE_LABELS: Record<TestType, string> = {
  [TestType.PIT]: "Pile Integrity Test",
  [TestType.STATIC_LOAD_TEST]: "Static Load Test",
  [TestType.DYNAMIC_LOAD_TEST]: "Dynamic Load Test",
  [TestType.CUBE_TEST]: "Cube Test",
  [TestType.CORE_TEST]: "Core Test",
  [TestType.KODEN]: "Koden Test",
  [TestType.CROSSHOLE_SONIC]: "Crosshole Sonic",
  [TestType.SLUMP_TEST]: "Slump Test",
  [TestType.PDA]: "Pile Driving Analyzer",
  [TestType.PLATE_LOAD_TEST]: "Plate Load Test",
  [TestType.FIELD_DENSITY_TEST]: "Field Density Test",
  [TestType.GROUT_CUBE_TEST]: "Grout Cube Test",
};

export const TEST_RESULT_STATUS_COLORS: Record<TestResultStatus, string> = {
  [TestResultStatus.PENDING]: "bg-gray-100 text-gray-800",
  [TestResultStatus.PASS]: "bg-green-100 text-green-800",
  [TestResultStatus.FAIL]: "bg-red-100 text-red-800",
  [TestResultStatus.INCONCLUSIVE]: "bg-yellow-100 text-yellow-800",
};

// ─── Workforce & Delays ─────────────────────────────────────────────────────

export const WORKFORCE_TRADES = [
  "Piling Operator",
  "Crane Operator",
  "Rigger",
  "Steel Fixer",
  "Concreter",
  "General Labour",
  "Surveyor",
  "Foreman",
  "Engineer",
  "Safety Officer",
] as const;

export const DELAY_REASONS = [
  "Weather",
  "Equipment Breakdown",
  "Material Shortage",
  "Subcontractor",
  "Design Change",
  "Client Instruction",
  "Other",
] as const;

// ─── Pile ───────────────────────────────────────────────────────────────────

export const PILE_STATUS_LABELS: Record<PileStatus, string> = {
  [PileStatus.PLANNED]: "Planned",
  [PileStatus.SET_UP]: "Set Up",
  [PileStatus.BORED]: "Bored",
  [PileStatus.CAGED]: "Caged",
  [PileStatus.CONCRETED]: "Concreted",
  [PileStatus.TESTED]: "Tested",
  [PileStatus.APPROVED]: "Approved",
  [PileStatus.REJECTED]: "Rejected",
};

export const PILE_STATUS_COLORS: Record<PileStatus, string> = {
  [PileStatus.PLANNED]: "bg-gray-100 text-gray-800",
  [PileStatus.SET_UP]: "bg-blue-100 text-blue-800",
  [PileStatus.BORED]: "bg-indigo-100 text-indigo-800",
  [PileStatus.CAGED]: "bg-purple-100 text-purple-800",
  [PileStatus.CONCRETED]: "bg-orange-100 text-orange-800",
  [PileStatus.TESTED]: "bg-cyan-100 text-cyan-800",
  [PileStatus.APPROVED]: "bg-green-100 text-green-800",
  [PileStatus.REJECTED]: "bg-red-100 text-red-800",
};

// ─── NCR ────────────────────────────────────────────────────────────────────

export const NCR_STATUS_LABELS: Record<NCRStatus, string> = {
  [NCRStatus.OPEN]: "Open",
  [NCRStatus.INVESTIGATING]: "Investigating",
  [NCRStatus.ACTION_REQUIRED]: "Action Required",
  [NCRStatus.RESOLVED]: "Resolved",
  [NCRStatus.CLOSED]: "Closed",
  [NCRStatus.VOIDED]: "Voided",
};

export const NCR_STATUS_COLORS: Record<NCRStatus, string> = {
  [NCRStatus.OPEN]: "bg-red-100 text-red-800",
  [NCRStatus.INVESTIGATING]: "bg-yellow-100 text-yellow-800",
  [NCRStatus.ACTION_REQUIRED]: "bg-orange-100 text-orange-800",
  [NCRStatus.RESOLVED]: "bg-blue-100 text-blue-800",
  [NCRStatus.CLOSED]: "bg-green-100 text-green-800",
  [NCRStatus.VOIDED]: "bg-gray-100 text-gray-800",
};

export const NCR_PRIORITY_LABELS: Record<NCRPriority, string> = {
  [NCRPriority.LOW]: "Low",
  [NCRPriority.MEDIUM]: "Medium",
  [NCRPriority.HIGH]: "High",
  [NCRPriority.CRITICAL]: "Critical",
};

export const NCR_PRIORITY_COLORS: Record<NCRPriority, string> = {
  [NCRPriority.LOW]: "bg-gray-100 text-gray-800",
  [NCRPriority.MEDIUM]: "bg-yellow-100 text-yellow-800",
  [NCRPriority.HIGH]: "bg-orange-100 text-orange-800",
  [NCRPriority.CRITICAL]: "bg-red-100 text-red-800",
};

export const NCR_CATEGORY_LABELS: Record<NCRCategory, string> = {
  [NCRCategory.MATERIAL]: "Material",
  [NCRCategory.WORKMANSHIP]: "Workmanship",
  [NCRCategory.DIMENSIONAL]: "Dimensional",
  [NCRCategory.STRUCTURAL]: "Structural",
  [NCRCategory.SAFETY]: "Safety",
  [NCRCategory.ENVIRONMENTAL]: "Environmental",
  [NCRCategory.PROCEDURAL]: "Procedural",
};

// ─── Concrete ───────────────────────────────────────────────────────────────

export const CONCRETE_GRADES = [
  "G25",
  "G30",
  "G35",
  "G40",
  "G45",
  "G50",
  "G60",
] as const;

export const PILE_TYPES = [
  "Bored",
  "Driven (Precast)",
  "Driven (Steel H)",
  "Jack-in (RC Spun)",
  "Jack-in (RC Square)",
  "Micropile",
  "Caisson",
] as const;
