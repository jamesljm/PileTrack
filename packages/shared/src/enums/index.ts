// ─── User ────────────────────────────────────────────────────────────────────

export enum UserRole {
  WORKER = "WORKER",
  SUPERVISOR = "SUPERVISOR",
  ADMIN = "ADMIN",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

// ─── Site ────────────────────────────────────────────────────────────────────

export enum SiteStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  COMPLETED = "COMPLETED",
}

// ─── Activity ────────────────────────────────────────────────────────────────

export enum ActivityType {
  BORED_PILING = "BORED_PILING",
  MICROPILING = "MICROPILING",
  DIAPHRAGM_WALL = "DIAPHRAGM_WALL",
  SHEET_PILING = "SHEET_PILING",
  PILECAP = "PILECAP",
  PILE_HEAD_HACKING = "PILE_HEAD_HACKING",
  SOIL_NAILING = "SOIL_NAILING",
  GROUND_ANCHOR = "GROUND_ANCHOR",
  CAISSON_PILE = "CAISSON_PILE",
  DRIVEN_PILE = "DRIVEN_PILE",
  JACK_IN_PILE = "JACK_IN_PILE",
  CONTIGUOUS_BORED_PILE = "CONTIGUOUS_BORED_PILE",
  GROUND_IMPROVEMENT = "GROUND_IMPROVEMENT",
  SLOPE_PROTECTION = "SLOPE_PROTECTION",
}

export enum ActivityStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ─── Equipment ───────────────────────────────────────────────────────────────

export enum EquipmentStatus {
  AVAILABLE = "AVAILABLE",
  IN_USE = "IN_USE",
  MAINTENANCE = "MAINTENANCE",
  DECOMMISSIONED = "DECOMMISSIONED",
}

export enum EquipmentCategory {
  PILING_RIG = "PILING_RIG",
  CRANE = "CRANE",
  EXCAVATOR = "EXCAVATOR",
  CONCRETE_PUMP = "CONCRETE_PUMP",
  GENERATOR = "GENERATOR",
  COMPRESSOR = "COMPRESSOR",
  WELDING_MACHINE = "WELDING_MACHINE",
  SURVEYING = "SURVEYING",
  SAFETY = "SAFETY",
  GENERAL = "GENERAL",
}

export enum ServiceType {
  ROUTINE_MAINTENANCE = "ROUTINE_MAINTENANCE",
  REPAIR = "REPAIR",
  INSPECTION = "INSPECTION",
  OVERHAUL = "OVERHAUL",
  CALIBRATION = "CALIBRATION",
  BREAKDOWN_REPAIR = "BREAKDOWN_REPAIR",
}

export enum EquipmentCondition {
  EXCELLENT = "EXCELLENT",
  GOOD = "GOOD",
  FAIR = "FAIR",
  POOR = "POOR",
  CRITICAL = "CRITICAL",
}

// ─── Transfer ────────────────────────────────────────────────────────────────

export enum TransferStatus {
  REQUESTED = "REQUESTED",
  APPROVED = "APPROVED",
  IN_TRANSIT = "IN_TRANSIT",
  DELIVERED = "DELIVERED",
  CANCELLED = "CANCELLED",
}

// ─── Sync ────────────────────────────────────────────────────────────────────

export enum SyncAction {
  CREATE = "CREATE",
  UPDATE = "UPDATE",
  DELETE = "DELETE",
}

// ─── Hold Point ─────────────────────────────────────────────────────────────

export enum HoldPointType {
  PRE_BORING = "PRE_BORING",
  PRE_CAGE = "PRE_CAGE",
  PRE_CONCRETE = "PRE_CONCRETE",
  POST_BORING = "POST_BORING",
  CAGE_INSPECTION = "CAGE_INSPECTION",
  DURING_CONCRETING = "DURING_CONCRETING",
  POST_CONCRETING = "POST_CONCRETING",
  PRE_DRIVING = "PRE_DRIVING",
  FINAL_SET = "FINAL_SET",
}

export enum HoldPointStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ─── Daily Log ──────────────────────────────────────────────────────────────

export enum DailyLogStatus {
  DRAFT = "DRAFT",
  SUBMITTED = "SUBMITTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ─── Test ───────────────────────────────────────────────────────────────────

export enum TestType {
  PIT = "PIT",
  STATIC_LOAD_TEST = "STATIC_LOAD_TEST",
  DYNAMIC_LOAD_TEST = "DYNAMIC_LOAD_TEST",
  CUBE_TEST = "CUBE_TEST",
  CORE_TEST = "CORE_TEST",
  KODEN = "KODEN",
  CROSSHOLE_SONIC = "CROSSHOLE_SONIC",
  SLUMP_TEST = "SLUMP_TEST",
  PDA = "PDA",
  PLATE_LOAD_TEST = "PLATE_LOAD_TEST",
  FIELD_DENSITY_TEST = "FIELD_DENSITY_TEST",
  GROUT_CUBE_TEST = "GROUT_CUBE_TEST",
}

export enum TestResultStatus {
  PENDING = "PENDING",
  PASS = "PASS",
  FAIL = "FAIL",
  INCONCLUSIVE = "INCONCLUSIVE",
}

// ─── Notification ────────────────────────────────────────────────────────────

export enum NotificationType {
  ACTIVITY_SUBMITTED = "ACTIVITY_SUBMITTED",
  ACTIVITY_APPROVED = "ACTIVITY_APPROVED",
  ACTIVITY_REJECTED = "ACTIVITY_REJECTED",
  TRANSFER_REQUESTED = "TRANSFER_REQUESTED",
  TRANSFER_APPROVED = "TRANSFER_APPROVED",
  TRANSFER_DELIVERED = "TRANSFER_DELIVERED",
  EQUIPMENT_SERVICE_DUE = "EQUIPMENT_SERVICE_DUE",
  LOW_STOCK_ALERT = "LOW_STOCK_ALERT",
  SYSTEM = "SYSTEM",
}

// ─── Pile ───────────────────────────────────────────────────────────────────

export enum PileStatus {
  PLANNED = "PLANNED",
  SET_UP = "SET_UP",
  BORED = "BORED",
  CAGED = "CAGED",
  CONCRETED = "CONCRETED",
  TESTED = "TESTED",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

// ─── NCR ────────────────────────────────────────────────────────────────────

export enum NCRStatus {
  OPEN = "OPEN",
  INVESTIGATING = "INVESTIGATING",
  ACTION_REQUIRED = "ACTION_REQUIRED",
  RESOLVED = "RESOLVED",
  CLOSED = "CLOSED",
  VOIDED = "VOIDED",
}

export enum NCRPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
  CRITICAL = "CRITICAL",
}

export enum NCRCategory {
  MATERIAL = "MATERIAL",
  WORKMANSHIP = "WORKMANSHIP",
  DIMENSIONAL = "DIMENSIONAL",
  STRUCTURAL = "STRUCTURAL",
  SAFETY = "SAFETY",
  ENVIRONMENTAL = "ENVIRONMENTAL",
  PROCEDURAL = "PROCEDURAL",
}
