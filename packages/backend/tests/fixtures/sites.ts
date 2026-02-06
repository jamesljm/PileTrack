export const testSite1 = {
  id: "00000000-0000-0000-0000-000000000010",
  name: "Test Site Alpha",
  code: "TS-001",
  address: "123 Test Street, Test City",
  clientName: "Test Client Corp",
  contractNumber: "CT-TEST-001",
  gpsLat: 3.1569,
  gpsLng: 101.7123,
  status: "ACTIVE" as const,
  startDate: "2024-01-15",
  expectedEndDate: "2025-06-30",
  description: "Test site for unit tests",
};

export const testSite2 = {
  id: "00000000-0000-0000-0000-000000000011",
  name: "Test Site Beta",
  code: "TS-002",
  address: "456 Test Avenue, Test City",
  clientName: "Beta Corp",
  contractNumber: "CT-TEST-002",
  gpsLat: 3.1073,
  gpsLng: 101.6067,
  status: "ACTIVE" as const,
  startDate: "2024-03-01",
  expectedEndDate: "2025-09-30",
  description: "Second test site",
};

export const newSiteInput = {
  name: "New Test Site",
  code: "NTS-001",
  address: "789 New Street",
  clientName: "New Client",
  contractNumber: "CT-NEW-001",
};

export const invalidSiteInputs = {
  missingName: {
    code: "TS-X",
    address: "123 Test St",
    clientName: "Client",
  },
  missingCode: {
    name: "Test Site",
    address: "123 Test St",
    clientName: "Client",
  },
  duplicateCode: {
    name: "Duplicate Site",
    code: "TS-001", // already exists
    address: "123 Test St",
    clientName: "Client",
  },
};
