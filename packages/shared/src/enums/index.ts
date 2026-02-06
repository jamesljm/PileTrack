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
