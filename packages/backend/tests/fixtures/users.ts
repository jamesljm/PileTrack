export const adminUser = {
  id: "00000000-0000-0000-0000-000000000001",
  email: "admin@test.com",
  password: "Admin123!",
  firstName: "Test",
  lastName: "Admin",
  phone: "+60123456789",
  role: "ADMIN" as const,
  status: "ACTIVE" as const,
};

export const supervisorUser = {
  id: "00000000-0000-0000-0000-000000000002",
  email: "supervisor@test.com",
  password: "Super123!",
  firstName: "Test",
  lastName: "Supervisor",
  phone: "+60123456790",
  role: "SUPERVISOR" as const,
  status: "ACTIVE" as const,
};

export const workerUser = {
  id: "00000000-0000-0000-0000-000000000003",
  email: "worker@test.com",
  password: "Worker123!",
  firstName: "Test",
  lastName: "Worker",
  phone: "+60123456791",
  role: "WORKER" as const,
  status: "ACTIVE" as const,
};

export const newUserInput = {
  email: "newuser@test.com",
  password: "NewUser123!",
  firstName: "New",
  lastName: "User",
  phone: "+60123456792",
};

export const invalidUserInputs = {
  missingEmail: {
    password: "Test123!",
    firstName: "Test",
    lastName: "User",
  },
  invalidEmail: {
    email: "not-an-email",
    password: "Test123!",
    firstName: "Test",
    lastName: "User",
  },
  weakPassword: {
    email: "test@test.com",
    password: "weak",
    firstName: "Test",
    lastName: "User",
  },
  missingName: {
    email: "test@test.com",
    password: "Test123!",
    firstName: "",
    lastName: "User",
  },
};
