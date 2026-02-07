// ─── Enums ───────────────────────────────────────────────────────────────────
export {
  UserRole,
  UserStatus,
  SiteStatus,
  ActivityType,
  ActivityStatus,
  EquipmentStatus,
  EquipmentCategory,
  ServiceType,
  EquipmentCondition,
  TransferStatus,
  SyncAction,
  NotificationType,
  HoldPointType,
  HoldPointStatus,
  DailyLogStatus,
  TestType,
  TestResultStatus,
  PileStatus,
  NCRStatus,
  NCRPriority,
  NCRCategory,
} from "./enums";

// ─── Schemas: Common ─────────────────────────────────────────────────────────
export {
  paginationQuerySchema,
  dateRangeSchema,
  idParamSchema,
  weatherSchema,
} from "./schemas/common.schema";
export type {
  PaginationQuery,
  DateRange,
  IdParam,
  Weather,
} from "./schemas/common.schema";

// ─── Schemas: Auth ───────────────────────────────────────────────────────────
export {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
  changePasswordSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "./schemas/auth.schema";
export type {
  LoginInput,
  RegisterInput,
  RefreshTokenInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./schemas/auth.schema";

// ─── Schemas: User ───────────────────────────────────────────────────────────
export {
  createUserSchema,
  updateUserSchema,
  userFilterSchema,
} from "./schemas/user.schema";
export type {
  CreateUserInput,
  UpdateUserInput,
  UserFilter,
} from "./schemas/user.schema";

// ─── Schemas: Site ───────────────────────────────────────────────────────────
export {
  createSiteSchema,
  updateSiteSchema,
  siteFilterSchema,
  assignUserToSiteSchema,
} from "./schemas/site.schema";
export type {
  CreateSiteInput,
  UpdateSiteInput,
  SiteFilter,
  AssignUserToSiteInput,
} from "./schemas/site.schema";

// ─── Schemas: Activity ───────────────────────────────────────────────────────
export {
  createActivitySchema,
  updateActivitySchema,
  activityFilterSchema,
  approveActivitySchema,
  rejectActivitySchema,
} from "./schemas/activity.schema";
export type {
  CreateActivityInput,
  UpdateActivityInput,
  ActivityFilter,
  ApproveActivityInput,
  RejectActivityInput,
} from "./schemas/activity.schema";

// ─── Schemas: Activity Details ───────────────────────────────────────────────
export {
  boredPilingSchema,
  micropilingSchema,
  diaphragmWallSchema,
  sheetPilingSchema,
  pilecapSchema,
  pileHeadHackingSchema,
  soilNailingSchema,
  groundAnchorSchema,
  caissonPileSchema,
  drivenPilingSchema,
  jackInPilingSchema,
  contiguousBoredPileSchema,
  groundImprovementSchema,
  slopeProtectionSchema,
  activityDetailSchemaMap,
  validateActivityDetails,
} from "./schemas/activity-details";
export type {
  BoredPilingDetails,
  ConcreteTruck,
  StageTimings,
  EquipmentUsedEntry,
  MicropilingDetails,
  DiaphragmWallDetails,
  SheetPilingDetails,
  PilecapDetails,
  PileHeadHackingDetails,
  SoilNailingDetails,
  GroundAnchorDetails,
  CaissonPileDetails,
  DrivenPilingDetails,
  JackInPilingDetails,
  ContiguousBoredPileDetails,
  GroundImprovementDetails,
  SlopeProtectionDetails,
} from "./schemas/activity-details";

// ─── Schemas: Hold Point ─────────────────────────────────────────────────────
export {
  signHoldPointSchema,
  rejectHoldPointSchema,
} from "./schemas/hold-point.schema";
export type {
  SignHoldPointInput,
  RejectHoldPointInput,
} from "./schemas/hold-point.schema";

// ─── Schemas: Equipment ──────────────────────────────────────────────────────
export {
  createEquipmentSchema,
  updateEquipmentSchema,
  equipmentFilterSchema,
} from "./schemas/equipment.schema";
export type {
  CreateEquipmentInput,
  UpdateEquipmentInput,
  EquipmentFilter,
} from "./schemas/equipment.schema";

// ─── Schemas: Service Record ────────────────────────────────────────────────
export {
  createServiceRecordSchema,
  updateServiceRecordSchema,
  serviceRecordFilterSchema,
} from "./schemas/service-record.schema";
export type {
  CreateServiceRecordInput,
  UpdateServiceRecordInput,
  ServiceRecordFilter,
} from "./schemas/service-record.schema";

// ─── Schemas: Material ───────────────────────────────────────────────────────
export {
  createMaterialSchema,
  updateMaterialSchema,
  adjustStockSchema,
} from "./schemas/material.schema";
export type {
  CreateMaterialInput,
  UpdateMaterialInput,
  AdjustStockInput,
} from "./schemas/material.schema";

// ─── Schemas: Transfer ───────────────────────────────────────────────────────
export {
  createTransferSchema,
  transferFilterSchema,
} from "./schemas/transfer.schema";
export type {
  CreateTransferInput,
  TransferFilter,
} from "./schemas/transfer.schema";

// ─── Schemas: Sync ───────────────────────────────────────────────────────────
export {
  syncPushItemSchema,
  syncPushSchema,
  syncPullQuerySchema,
} from "./schemas/sync.schema";
export type {
  SyncPushItem,
  SyncPushInput,
  SyncPullQuery,
} from "./schemas/sync.schema";

// ─── Types ───────────────────────────────────────────────────────────────────
export type {
  ApiResponse,
  PaginatedResponse,
  ApiErrorResponse,
} from "./types";
export type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  TokenPayload,
} from "./types";
export type { User, UserSummary } from "./types";
export type { Site, SiteSummary, SiteWithUsers } from "./types";
export type { ActivityRecord, ActivitySummary } from "./types";
export type {
  Equipment,
  ServiceRecord,
  EquipmentSiteHistory,
  EquipmentUsageEntry,
  EquipmentUsageSummary,
  EquipmentStats,
  ServiceCostSummary,
  FleetStats,
} from "./types";
export type { Material } from "./types";
export type { Transfer, TransferItem, TransferWithItems } from "./types";
export type {
  DailyLog,
  WorkforceEntry,
  SafetyRecord,
  DelayEntry,
  MaterialUsageEntry,
} from "./types";
export type { BoreholeLog, StratumEntry, SPTEntry } from "./types";
export type { TestResult } from "./types";
export type { Pile, PileSummary } from "./types";
export type { NCR, NCRSummary } from "./types";
export type {
  ConcreteDelivery,
  ConcreteDeliverySummary,
} from "./types";

// ─── Utilities ───────────────────────────────────────────────────────────────
export {
  validateSchema,
  validateSchemaOrThrow,
  formatZodErrors,
} from "./utils/validation";
export type { ValidationResult, ValidationError } from "./utils/validation";

export {
  formatDate,
  formatCurrency,
  formatNumber,
  truncateString,
} from "./utils/formatters";
