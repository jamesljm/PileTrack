import {
  ActivityType,
  ActivityStatus,
  EquipmentCategory,
  EquipmentStatus,
  TransferStatus,
  SiteStatus,
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
