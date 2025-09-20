-- CreateEnum
CREATE TYPE "public"."AcademicResourceType" AS ENUM ('SYLLABUS', 'QUESTION_PAPER', 'DATE_SHEET', 'CURRICULUM', 'STUDY_MATERIAL');

-- CreateEnum
CREATE TYPE "public"."RegistrationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'COMPLETED');

-- AlterEnum
ALTER TYPE "public"."ResourceType" ADD VALUE 'DATE_SHEET';

-- CreateTable
CREATE TABLE "public"."academic_resources" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" "public"."AcademicResourceType" NOT NULL,
    "className" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "year" TEXT,
    "fileUrl" TEXT,
    "fileName" TEXT,
    "fileSize" INTEGER,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "academic_resources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."admission_test_registrations" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "fathersName" TEXT NOT NULL,
    "mothersName" TEXT NOT NULL,
    "currentClass" TEXT NOT NULL,
    "presentSchool" TEXT NOT NULL,
    "parentMobile" TEXT NOT NULL,
    "residentialAddress" TEXT NOT NULL,
    "hasAppearedNTSE" BOOLEAN NOT NULL,
    "passportPhoto" TEXT,
    "aadharPhoto" TEXT,
    "admitCardId" TEXT NOT NULL,
    "registrationDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "public"."RegistrationStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admission_test_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admission_test_registrations_admitCardId_key" ON "public"."admission_test_registrations"("admitCardId");

-- AddForeignKey
ALTER TABLE "public"."academic_resources" ADD CONSTRAINT "academic_resources_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "public"."users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
