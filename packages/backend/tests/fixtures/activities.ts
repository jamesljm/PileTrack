export const boredPilingActivity = {
  siteId: "00000000-0000-0000-0000-000000000010",
  activityType: "BORED_PILING" as const,
  activityDate: "2024-06-15",
  weather: {
    condition: "SUNNY",
    temperatureCelsius: 32,
  },
  details: {
    pileId: "BP-001",
    pileLength: 30,
    pileDiameter: 1.2,
    boringDepth: 28,
    concreteVolume: 35.5,
    casingDepth: 15,
    rebarCageLength: 29,
    slumpTestResult: 180,
  },
  remarks: "Bore completed without obstruction",
};

export const micropilingActivity = {
  siteId: "00000000-0000-0000-0000-000000000010",
  activityType: "MICROPILING" as const,
  activityDate: "2024-06-16",
  details: {
    pileId: "MP-001",
    pileLength: 15,
    pileDiameter: 0.3,
    groutVolume: 2.5,
  },
};

export const sheetPilingActivity = {
  siteId: "00000000-0000-0000-0000-000000000011",
  activityType: "SHEET_PILING" as const,
  activityDate: "2024-06-17",
  details: {
    panelId: "SP-001",
    depth: 12,
    width: 600,
  },
  remarks: "Sheet pile installation sector B",
};

export const invalidActivityInputs = {
  missingSiteId: {
    activityType: "BORED_PILING",
    activityDate: "2024-06-15",
    details: { pileId: "BP-001", pileLength: 30, pileDiameter: 1.2 },
  },
  invalidType: {
    siteId: "00000000-0000-0000-0000-000000000010",
    activityType: "INVALID_TYPE",
    activityDate: "2024-06-15",
    details: {},
  },
  missingRequiredDetails: {
    siteId: "00000000-0000-0000-0000-000000000010",
    activityType: "BORED_PILING",
    activityDate: "2024-06-15",
    details: {}, // missing pileId, pileLength, pileDiameter
  },
};
