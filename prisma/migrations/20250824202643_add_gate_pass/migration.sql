-- CreateEnum
CREATE TYPE "public"."GatePassReason" AS ENUM ('SICKNESS_DURING_SCHOOL_HOURS', 'URGENT_WORK_AT_HOME', 'PERSONAL');

-- CreateTable
CREATE TABLE "public"."gate_passes" (
    "id" TEXT NOT NULL,
    "studentName" TEXT NOT NULL,
    "className" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "fathersName" TEXT NOT NULL,
    "village" TEXT NOT NULL,
    "accompaniedBy" TEXT NOT NULL,
    "reason" "public"."GatePassReason" NOT NULL,
    "vanDriverName" TEXT,
    "busNumber" TEXT,
    "contactNumber" TEXT NOT NULL,
    "dispersalTime" TEXT NOT NULL,
    "studentImage" TEXT,
    "createdById" TEXT NOT NULL,
    "issuingAuthorityName" TEXT NOT NULL,
    "issuingAuthoritySignature" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gate_passes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."gate_passes" ADD CONSTRAINT "gate_passes_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
