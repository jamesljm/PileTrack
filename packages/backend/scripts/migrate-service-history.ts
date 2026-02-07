/**
 * Migration script: Reads existing equipment.serviceHistory JSON arrays
 * and inserts them as normalized rows into the service_records table.
 *
 * Usage: npx tsx scripts/migrate-service-history.ts
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

interface LegacyServiceEntry {
  date?: string;
  description?: string;
  performedBy?: string;
  cost?: number;
  nextServiceDate?: string;
  loggedAt?: string;
}

async function main() {
  console.log("Starting service history migration...");

  const equipments = await prisma.equipment.findMany({
    where: { deletedAt: null },
    select: {
      id: true,
      name: true,
      serviceHistory: true,
    },
  });

  let totalMigrated = 0;
  let totalSkipped = 0;

  for (const eq of equipments) {
    const history = (eq.serviceHistory as LegacyServiceEntry[] | null) ?? [];

    if (history.length === 0) {
      continue;
    }

    // Check if records already migrated for this equipment
    const existingCount = await prisma.serviceRecord.count({
      where: { equipmentId: eq.id },
    });

    if (existingCount > 0) {
      console.log(`  Skipping ${eq.name} (${eq.id}) — already has ${existingCount} records`);
      totalSkipped += history.length;
      continue;
    }

    for (const entry of history) {
      try {
        await prisma.serviceRecord.create({
          data: {
            equipmentId: eq.id,
            serviceType: "ROUTINE_MAINTENANCE",
            serviceDate: entry.date ? new Date(entry.date) : new Date(),
            description: entry.description ?? "Migrated from legacy service history",
            performedBy: entry.performedBy ?? "Unknown",
            cost: entry.cost,
            nextServiceDate: entry.nextServiceDate ? new Date(entry.nextServiceDate) : null,
          },
        });
        totalMigrated++;
      } catch (error) {
        console.error(`  Error migrating entry for ${eq.name} (${eq.id}):`, error);
      }
    }

    console.log(`  Migrated ${history.length} records for ${eq.name} (${eq.id})`);
  }

  console.log(`\nMigration complete: ${totalMigrated} records migrated, ${totalSkipped} skipped`);
}

main()
  .catch((e) => {
    console.error("Migration failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
