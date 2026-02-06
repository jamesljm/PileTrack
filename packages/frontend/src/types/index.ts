import type {
  UserRole,
  ActivityType,
  ActivityStatus,
  EquipmentCategory,
  EquipmentStatus,
  SiteStatus,
  TransferStatus,
  NotificationType,
} from "@piletrack/shared";

// ─── Sync Types ─────────────────────────────────────────────────────────────

export enum SyncStatus {
  SYNCED = "SYNCED",
  PENDING = "PENDING",
  SYNCING = "SYNCING",
  FAILED = "FAILED",
  OFFLINE = "OFFLINE",
}

export interface SyncQueueItem {
  id?: number;
  table: string;
  action: "CREATE" | "UPDATE" | "DELETE";
  recordId: string;
  clientId?: string;
  payload?: Record<string, unknown>;
  status: "PENDING" | "SYNCED" | "FAILED";
  timestamp: string;
  retryCount: number;
  error?: string;
}

export interface SyncResult {
  pushed: number;
  pulled: number;
  failed: number;
}

export interface SyncState {
  status: SyncStatus;
  lastSyncAt: string | null;
  pendingCount: number;
  error: string | null;
  isSyncing: boolean;
}

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface AuthState {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: AuthUser | null;
}

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatarUrl?: string | null;
}

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

// ─── Navigation Types ───────────────────────────────────────────────────────

export interface NavItem {
  title: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  badge?: number;
  roles?: UserRole[];
  children?: NavItem[];
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

// ─── Table Types ────────────────────────────────────────────────────────────

export interface FilterOption {
  key: string;
  label: string;
  options: Array<{ value: string; label: string }>;
}

export interface TableMeta {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
}

// ─── Form Types ─────────────────────────────────────────────────────────────

export interface PhotoData {
  uri: string;
  caption?: string;
  takenAt?: string;
  file?: File;
}

export interface GpsData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  altitude?: number | null;
  timestamp: number;
}

export interface WeatherData {
  condition: string;
  temperatureCelsius?: number;
  humidity?: number;
  windSpeedKmh?: number;
  rainfall?: number;
}

// ─── Dashboard Types ────────────────────────────────────────────────────────

export interface DashboardStats {
  totalSites: number;
  activeSites: number;
  totalActivities: number;
  pendingApprovals: number;
  totalEquipment: number;
  equipmentInUse: number;
  recentActivities: number;
  weeklyOutput: number;
}

export interface ActivitySummaryData {
  type: ActivityType;
  label: string;
  count: number;
}

export interface EquipmentUtilizationData {
  category: EquipmentCategory;
  label: string;
  inUse: number;
  available: number;
  maintenance: number;
}

export interface SiteProgressData {
  date: string;
  activitiesCompleted: number;
  activitiesPlanned: number;
}

export interface DailyOutputData {
  date: string;
  [key: string]: string | number;
}

// ─── Chart Types ────────────────────────────────────────────────────────────

export interface ChartDataPoint {
  name: string;
  value: number;
  fill?: string;
}

export interface TimeSeriesDataPoint {
  date: string;
  [key: string]: string | number;
}

// ─── Notification Types ─────────────────────────────────────────────────────

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  isRead: boolean;
  data?: Record<string, unknown>;
  createdAt: string;
}

// ─── Report Types ───────────────────────────────────────────────────────────

export interface DailyReport {
  date: string;
  siteId: string;
  siteName: string;
  activities: Array<{
    id: string;
    type: ActivityType;
    status: ActivityStatus;
    createdByName: string;
  }>;
  equipmentUsed: Array<{
    id: string;
    name: string;
    category: EquipmentCategory;
  }>;
  materialsConsumed: Array<{
    id: string;
    name: string;
    quantity: number;
    unit: string;
  }>;
  weather?: WeatherData;
  notes?: string;
}

export interface WeeklyReport {
  startDate: string;
  endDate: string;
  siteId: string;
  siteName: string;
  summary: {
    totalActivities: number;
    approvedActivities: number;
    rejectedActivities: number;
    activitiesByType: Record<ActivityType, number>;
  };
  dailyBreakdown: Array<{
    date: string;
    activityCount: number;
    activitiesByType: Record<string, number>;
  }>;
}

export interface SiteSummaryReport {
  siteId: string;
  siteName: string;
  siteCode: string;
  status: SiteStatus;
  totalActivities: number;
  activitiesByStatus: Record<ActivityStatus, number>;
  activitiesByType: Record<ActivityType, number>;
  equipmentCount: number;
  equipmentByStatus: Record<EquipmentStatus, number>;
  materialCount: number;
  lowStockMaterials: number;
  activeTransfers: number;
}

// ─── PWA Types ──────────────────────────────────────────────────────────────

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: "accepted" | "dismissed";
    platform: string;
  }>;
  prompt(): Promise<void>;
}

// ─── Utility Types ──────────────────────────────────────────────────────────

export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type PickRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

export type WithTimestamps<T> = T & {
  createdAt: string;
  updatedAt: string;
};

export type Optional<T, K extends keyof T> = Omit<T, K> &
  Partial<Pick<T, K>>;
