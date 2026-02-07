-- CreateEnum
CREATE TYPE "ServiceType" AS ENUM ('ROUTINE_MAINTENANCE', 'REPAIR', 'INSPECTION', 'OVERHAUL', 'CALIBRATION', 'BREAKDOWN_REPAIR');

-- CreateEnum
CREATE TYPE "EquipmentCondition" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'CRITICAL');

-- CreateEnum
CREATE TYPE "HoldPointType" AS ENUM ('PRE_BORING', 'PRE_CAGE', 'PRE_CONCRETE');

-- CreateEnum
CREATE TYPE "HoldPointStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable: Add new columns to equipment
ALTER TABLE "equipment" ADD COLUMN "condition" "EquipmentCondition" NOT NULL DEFAULT 'GOOD';
ALTER TABLE "equipment" ADD COLUMN "total_usage_hours" DOUBLE PRECISION NOT NULL DEFAULT 0;
ALTER TABLE "equipment" ADD COLUMN "service_interval_hours" DOUBLE PRECISION;
ALTER TABLE "equipment" ADD COLUMN "purchase_date" TIMESTAMP(3);
ALTER TABLE "equipment" ADD COLUMN "purchase_price" DOUBLE PRECISION;
ALTER TABLE "equipment" ADD COLUMN "daily_rate" DOUBLE PRECISION;
ALTER TABLE "equipment" ADD COLUMN "insurance_expiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "service_records" (
    "id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,
    "service_type" "ServiceType" NOT NULL,
    "service_date" TIMESTAMP(3) NOT NULL,
    "description" TEXT NOT NULL,
    "performed_by" VARCHAR(200) NOT NULL,
    "cost" DOUBLE PRECISION,
    "parts_replaced" TEXT,
    "next_service_date" TIMESTAMP(3),
    "meter_reading" DOUBLE PRECISION,
    "notes" TEXT,
    "created_by_id" UUID,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "service_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "equipment_site_history" (
    "id" UUID NOT NULL,
    "equipment_id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "assigned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "removed_at" TIMESTAMP(3),
    "transfer_id" UUID,
    "notes" TEXT,

    CONSTRAINT "equipment_site_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hold_points" (
    "id" UUID NOT NULL,
    "activity_id" UUID NOT NULL,
    "type" "HoldPointType" NOT NULL,
    "status" "HoldPointStatus" NOT NULL DEFAULT 'PENDING',
    "checklist" JSONB NOT NULL DEFAULT '[]',
    "signed_by_name" VARCHAR(200),
    "signed_by_id" UUID,
    "signed_at" TIMESTAMP(3),
    "signature_data" TEXT,
    "rejection_notes" TEXT,
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hold_points_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "service_records_equipment_id_idx" ON "service_records"("equipment_id");

-- CreateIndex
CREATE INDEX "service_records_service_date_idx" ON "service_records"("service_date");

-- CreateIndex
CREATE INDEX "service_records_deleted_at_idx" ON "service_records"("deleted_at");

-- CreateIndex
CREATE INDEX "equipment_site_history_equipment_id_idx" ON "equipment_site_history"("equipment_id");

-- CreateIndex
CREATE INDEX "equipment_site_history_site_id_idx" ON "equipment_site_history"("site_id");

-- CreateIndex
CREATE INDEX "equipment_site_history_transfer_id_idx" ON "equipment_site_history"("transfer_id");

-- CreateIndex
CREATE INDEX "hold_points_activity_id_idx" ON "hold_points"("activity_id");

-- CreateIndex
CREATE INDEX "hold_points_status_idx" ON "hold_points"("status");

-- CreateIndex
CREATE UNIQUE INDEX "hold_points_activity_id_type_key" ON "hold_points"("activity_id", "type");

-- AddForeignKey
ALTER TABLE "service_records" ADD CONSTRAINT "service_records_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_records" ADD CONSTRAINT "service_records_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_site_history" ADD CONSTRAINT "equipment_site_history_equipment_id_fkey" FOREIGN KEY ("equipment_id") REFERENCES "equipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_site_history" ADD CONSTRAINT "equipment_site_history_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "equipment_site_history" ADD CONSTRAINT "equipment_site_history_transfer_id_fkey" FOREIGN KEY ("transfer_id") REFERENCES "transfers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_points" ADD CONSTRAINT "hold_points_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "hold_points" ADD CONSTRAINT "hold_points_signed_by_id_fkey" FOREIGN KEY ("signed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
