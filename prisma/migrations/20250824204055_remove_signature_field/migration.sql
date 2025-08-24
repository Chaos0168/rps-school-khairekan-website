/*
  Warnings:

  - You are about to drop the column `issuingAuthoritySignature` on the `gate_passes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."gate_passes" DROP COLUMN "issuingAuthoritySignature";
