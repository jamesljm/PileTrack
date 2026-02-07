-- ============================================================================
-- Migration: Add DailyLogs, BoreholeLogs, TestResults, Piles, NCRs, ConcreteDeliveries
-- ============================================================================

-- ─── New Enums ──────────────────────────────────────────────────────────────

-- CreateEnum
CREATE TYPE "DailyLogStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "TestType" AS ENUM ('PIT', 'STATIC_LOAD_TEST', 'DYNAMIC_LOAD_TEST', 'CUBE_TEST', 'CORE_TEST', 'KODEN', 'CROSSHOLE_SONIC', 'SLUMP_TEST', 'PDA', 'PLATE_LOAD_TEST', 'FIELD_DENSITY_TEST', 'GROUT_CUBE_TEST');

-- CreateEnum
CREATE TYPE "TestResultStatus" AS ENUM ('PENDING', 'PASS', 'FAIL', 'INCONCLUSIVE');

-- CreateEnum
CREATE TYPE "PileStatus" AS ENUM ('PLANNED', 'SET_UP', 'BORED', 'CAGED', 'CONCRETED', 'TESTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "NCRStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'ACTION_REQUIRED', 'RESOLVED', 'CLOSED', 'VOIDED');

-- CreateEnum
CREATE TYPE "NCRPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "NCRCategory" AS ENUM ('MATERIAL', 'WORKMANSHIP', 'DIMENSIONAL', 'STRUCTURAL', 'SAFETY', 'ENVIRONMENTAL', 'PROCEDURAL');

-- ─── Add new values to existing enums ───────────────────────────────────────

-- Add new ActivityType values
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'DRIVEN_PILE';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'JACK_IN_PILE';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'CONTIGUOUS_BORED_PILE';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'GROUND_IMPROVEMENT';
ALTER TYPE "ActivityType" ADD VALUE IF NOT EXISTS 'SLOPE_PROTECTION';

-- Add new HoldPointType values
ALTER TYPE "HoldPointType" ADD VALUE IF NOT EXISTS 'POST_BORING';
ALTER TYPE "HoldPointType" ADD VALUE IF NOT EXISTS 'CAGE_INSPECTION';
ALTER TYPE "HoldPointType" ADD VALUE IF NOT EXISTS 'DURING_CONCRETING';
ALTER TYPE "HoldPointType" ADD VALUE IF NOT EXISTS 'POST_CONCRETING';
ALTER TYPE "HoldPointType" ADD VALUE IF NOT EXISTS 'PRE_DRIVING';
ALTER TYPE "HoldPointType" ADD VALUE IF NOT EXISTS 'FINAL_SET';

-- ─── New Tables ─────────────────────────────────────────────────────────────

-- CreateTable: daily_logs
CREATE TABLE "daily_logs" (
    "id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "log_date" DATE NOT NULL,
    "status" "DailyLogStatus" NOT NULL DEFAULT 'DRAFT',
    "workforce" JSONB NOT NULL DEFAULT '[]',
    "safety" JSONB NOT NULL DEFAULT '{}',
    "delays" JSONB NOT NULL DEFAULT '[]',
    "material_usage" JSONB NOT NULL DEFAULT '[]',
    "weather" JSONB,
    "remarks" TEXT,
    "photos" JSONB DEFAULT '[]',
    "created_by_id" UUID NOT NULL,
    "approved_by_id" UUID,
    "approved_at" TIMESTAMP(3),
    "rejection_notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "daily_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: borehole_logs
CREATE TABLE "borehole_logs" (
    "id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "borehole_id" VARCHAR(50) NOT NULL,
    "log_date" DATE NOT NULL,
    "location" VARCHAR(200),
    "gps_lat" DOUBLE PRECISION,
    "gps_lng" DOUBLE PRECISION,
    "total_depth" DOUBLE PRECISION NOT NULL,
    "ground_level" DOUBLE PRECISION,
    "groundwater_level" DOUBLE PRECISION,
    "casing_depth" DOUBLE PRECISION,
    "strata" JSONB NOT NULL DEFAULT '[]',
    "spt_results" JSONB NOT NULL DEFAULT '[]',
    "remarks" TEXT,
    "photos" JSONB DEFAULT '[]',
    "drilling_method" VARCHAR(100),
    "contractor" VARCHAR(200),
    "logged_by" VARCHAR(200),
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "borehole_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: test_results
CREATE TABLE "test_results" (
    "id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "activity_id" UUID,
    "test_type" "TestType" NOT NULL,
    "test_date" DATE NOT NULL,
    "pile_id" VARCHAR(50),
    "status" "TestResultStatus" NOT NULL DEFAULT 'PENDING',
    "results" JSONB NOT NULL DEFAULT '{}',
    "remarks" TEXT,
    "photos" JSONB DEFAULT '[]',
    "conducted_by" VARCHAR(200),
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable: piles
CREATE TABLE "piles" (
    "id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "pile_id" VARCHAR(50) NOT NULL,
    "pile_type" "ActivityType" NOT NULL,
    "status" "PileStatus" NOT NULL DEFAULT 'PLANNED',
    "design_length" DOUBLE PRECISION,
    "actual_length" DOUBLE PRECISION,
    "design_diameter" DOUBLE PRECISION,
    "cut_off_level" DOUBLE PRECISION,
    "platform_level" DOUBLE PRECISION,
    "grid_ref" VARCHAR(50),
    "gps_lat" DOUBLE PRECISION,
    "gps_lng" DOUBLE PRECISION,
    "concrete_grade" VARCHAR(20),
    "concrete_volume" DOUBLE PRECISION,
    "actual_concrete_vol" DOUBLE PRECISION,
    "overconsumption" DOUBLE PRECISION,
    "remarks" TEXT,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "piles_pkey" PRIMARY KEY ("id")
);

-- CreateTable: ncrs
CREATE TABLE "ncrs" (
    "id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "pile_id" UUID,
    "ncr_number" VARCHAR(50) NOT NULL,
    "category" "NCRCategory" NOT NULL,
    "priority" "NCRPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "NCRStatus" NOT NULL DEFAULT 'OPEN',
    "title" VARCHAR(300) NOT NULL,
    "description" TEXT NOT NULL,
    "root_cause" TEXT,
    "corrective_action" TEXT,
    "preventive_action" TEXT,
    "photos" JSONB DEFAULT '[]',
    "raised_by_id" UUID NOT NULL,
    "assigned_to_id" UUID,
    "closed_by_id" UUID,
    "raised_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "due_date" TIMESTAMP(3),
    "closed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "ncrs_pkey" PRIMARY KEY ("id")
);

-- CreateTable: concrete_deliveries
CREATE TABLE "concrete_deliveries" (
    "id" UUID NOT NULL,
    "site_id" UUID NOT NULL,
    "pile_id" UUID,
    "do_number" VARCHAR(50) NOT NULL,
    "delivery_date" TIMESTAMP(3) NOT NULL,
    "supplier" VARCHAR(200) NOT NULL,
    "batch_plant" VARCHAR(200),
    "truck_number" VARCHAR(50),
    "concrete_grade" VARCHAR(20) NOT NULL,
    "volume" DOUBLE PRECISION NOT NULL,
    "slump_required" DOUBLE PRECISION,
    "slump_actual" DOUBLE PRECISION,
    "batch_time" TIMESTAMP(3),
    "arrival_time" TIMESTAMP(3),
    "pour_start_time" TIMESTAMP(3),
    "pour_end_time" TIMESTAMP(3),
    "temperature" DOUBLE PRECISION,
    "cubes_taken" INTEGER,
    "cube_sample_ids" JSONB DEFAULT '[]',
    "rejected" BOOLEAN NOT NULL DEFAULT false,
    "rejection_reason" TEXT,
    "remarks" TEXT,
    "created_by_id" UUID NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "concrete_deliveries_pkey" PRIMARY KEY ("id")
);

-- ─── Indexes: daily_logs ────────────────────────────────────────────────────

CREATE INDEX "daily_logs_site_id_idx" ON "daily_logs"("site_id");
CREATE INDEX "daily_logs_log_date_idx" ON "daily_logs"("log_date");
CREATE INDEX "daily_logs_status_idx" ON "daily_logs"("status");
CREATE INDEX "daily_logs_created_by_id_idx" ON "daily_logs"("created_by_id");
CREATE INDEX "daily_logs_deleted_at_idx" ON "daily_logs"("deleted_at");
CREATE UNIQUE INDEX "daily_logs_site_id_log_date_key" ON "daily_logs"("site_id", "log_date");

-- ─── Indexes: borehole_logs ─────────────────────────────────────────────────

CREATE INDEX "borehole_logs_site_id_idx" ON "borehole_logs"("site_id");
CREATE INDEX "borehole_logs_deleted_at_idx" ON "borehole_logs"("deleted_at");
CREATE UNIQUE INDEX "borehole_logs_site_id_borehole_id_key" ON "borehole_logs"("site_id", "borehole_id");

-- ─── Indexes: test_results ──────────────────────────────────────────────────

CREATE INDEX "test_results_site_id_idx" ON "test_results"("site_id");
CREATE INDEX "test_results_activity_id_idx" ON "test_results"("activity_id");
CREATE INDEX "test_results_test_type_idx" ON "test_results"("test_type");
CREATE INDEX "test_results_status_idx" ON "test_results"("status");
CREATE INDEX "test_results_deleted_at_idx" ON "test_results"("deleted_at");

-- ─── Indexes: piles ─────────────────────────────────────────────────────────

CREATE INDEX "piles_site_id_idx" ON "piles"("site_id");
CREATE INDEX "piles_status_idx" ON "piles"("status");
CREATE INDEX "piles_pile_type_idx" ON "piles"("pile_type");
CREATE INDEX "piles_deleted_at_idx" ON "piles"("deleted_at");
CREATE UNIQUE INDEX "piles_site_id_pile_id_key" ON "piles"("site_id", "pile_id");

-- ─── Indexes: ncrs ──────────────────────────────────────────────────────────

CREATE INDEX "ncrs_site_id_idx" ON "ncrs"("site_id");
CREATE INDEX "ncrs_status_idx" ON "ncrs"("status");
CREATE INDEX "ncrs_priority_idx" ON "ncrs"("priority");
CREATE INDEX "ncrs_category_idx" ON "ncrs"("category");
CREATE INDEX "ncrs_pile_id_idx" ON "ncrs"("pile_id");
CREATE INDEX "ncrs_deleted_at_idx" ON "ncrs"("deleted_at");

-- ─── Indexes: concrete_deliveries ───────────────────────────────────────────

CREATE INDEX "concrete_deliveries_site_id_idx" ON "concrete_deliveries"("site_id");
CREATE INDEX "concrete_deliveries_pile_id_idx" ON "concrete_deliveries"("pile_id");
CREATE INDEX "concrete_deliveries_delivery_date_idx" ON "concrete_deliveries"("delivery_date");
CREATE INDEX "concrete_deliveries_deleted_at_idx" ON "concrete_deliveries"("deleted_at");

-- ─── Foreign Keys: daily_logs ───────────────────────────────────────────────

ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "daily_logs" ADD CONSTRAINT "daily_logs_approved_by_id_fkey" FOREIGN KEY ("approved_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── Foreign Keys: borehole_logs ────────────────────────────────────────────

ALTER TABLE "borehole_logs" ADD CONSTRAINT "borehole_logs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "borehole_logs" ADD CONSTRAINT "borehole_logs_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─── Foreign Keys: test_results ─────────────────────────────────────────────

ALTER TABLE "test_results" ADD CONSTRAINT "test_results_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_activity_id_fkey" FOREIGN KEY ("activity_id") REFERENCES "activity_records"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─── Foreign Keys: piles ────────────────────────────────────────────────────

ALTER TABLE "piles" ADD CONSTRAINT "piles_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "piles" ADD CONSTRAINT "piles_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- ─── Foreign Keys: ncrs ─────────────────────────────────────────────────────

ALTER TABLE "ncrs" ADD CONSTRAINT "ncrs_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ncrs" ADD CONSTRAINT "ncrs_pile_id_fkey" FOREIGN KEY ("pile_id") REFERENCES "piles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ncrs" ADD CONSTRAINT "ncrs_raised_by_id_fkey" FOREIGN KEY ("raised_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ncrs" ADD CONSTRAINT "ncrs_assigned_to_id_fkey" FOREIGN KEY ("assigned_to_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ncrs" ADD CONSTRAINT "ncrs_closed_by_id_fkey" FOREIGN KEY ("closed_by_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- ─── Foreign Keys: concrete_deliveries ──────────────────────────────────────

ALTER TABLE "concrete_deliveries" ADD CONSTRAINT "concrete_deliveries_site_id_fkey" FOREIGN KEY ("site_id") REFERENCES "sites"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "concrete_deliveries" ADD CONSTRAINT "concrete_deliveries_pile_id_fkey" FOREIGN KEY ("pile_id") REFERENCES "piles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "concrete_deliveries" ADD CONSTRAINT "concrete_deliveries_created_by_id_fkey" FOREIGN KEY ("created_by_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
