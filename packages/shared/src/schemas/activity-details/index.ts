import { z } from "zod";
import { ActivityType } from "../../enums";
import { boredPilingSchema } from "./bored-piling.schema";
import { micropilingSchema } from "./micropiling.schema";
import { diaphragmWallSchema } from "./diaphragm-wall.schema";
import { sheetPilingSchema } from "./sheet-piling.schema";
import { pilecapSchema } from "./pilecap.schema";
import { pileHeadHackingSchema } from "./pile-head-hacking.schema";
import { soilNailingSchema } from "./soil-nailing.schema";
import { groundAnchorSchema } from "./ground-anchor.schema";
import { caissonPileSchema } from "./caisson-pile.schema";

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
};

export type { BoredPilingDetails } from "./bored-piling.schema";
export type { MicropilingDetails } from "./micropiling.schema";
export type { DiaphragmWallDetails } from "./diaphragm-wall.schema";
export type { SheetPilingDetails } from "./sheet-piling.schema";
export type { PilecapDetails } from "./pilecap.schema";
export type { PileHeadHackingDetails } from "./pile-head-hacking.schema";
export type { SoilNailingDetails } from "./soil-nailing.schema";
export type { GroundAnchorDetails } from "./ground-anchor.schema";
export type { CaissonPileDetails } from "./caisson-pile.schema";

/**
 * Maps each ActivityType to its corresponding Zod validation schema.
 * Use this to dynamically validate activity details based on the activity type.
 */
export const activityDetailSchemaMap: Record<ActivityType, z.ZodType> = {
  [ActivityType.BORED_PILING]: boredPilingSchema,
  [ActivityType.MICROPILING]: micropilingSchema,
  [ActivityType.DIAPHRAGM_WALL]: diaphragmWallSchema,
  [ActivityType.SHEET_PILING]: sheetPilingSchema,
  [ActivityType.PILECAP]: pilecapSchema,
  [ActivityType.PILE_HEAD_HACKING]: pileHeadHackingSchema,
  [ActivityType.SOIL_NAILING]: soilNailingSchema,
  [ActivityType.GROUND_ANCHOR]: groundAnchorSchema,
  [ActivityType.CAISSON_PILE]: caissonPileSchema,
};

/**
 * Validates activity details against the schema for the given activity type.
 * Returns the parsed data or throws a ZodError.
 */
export function validateActivityDetails<T extends ActivityType>(
  activityType: T,
  data: unknown,
): z.infer<(typeof activityDetailSchemaMap)[T]> {
  const schema = activityDetailSchemaMap[activityType];
  return schema.parse(data);
}
