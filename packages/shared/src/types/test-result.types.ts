export interface TestResult {
  id: string;
  siteId: string;
  activityId: string | null;
  testType: string;
  testDate: string;
  pileId: string | null;
  status: string;
  results: Record<string, unknown>;
  remarks: string | null;
  photos: string[] | null;
  conductedBy: string | null;
  createdById: string;
  createdBy?: { firstName: string; lastName: string };
  createdAt: string;
  updatedAt: string;
}
