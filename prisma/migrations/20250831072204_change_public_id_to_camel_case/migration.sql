/*
  Warnings:

  - You are about to drop the column `public_id` on the `File` table. All the data in the column will be lost.
  - Added the required column `publicId` to the `File` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."File" DROP COLUMN "public_id",
ADD COLUMN     "publicId" TEXT NOT NULL;
