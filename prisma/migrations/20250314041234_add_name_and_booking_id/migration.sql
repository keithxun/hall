/*
  Warnings:

  - You are about to drop the column `slot` on the `Booking` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `organiserId` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `slot` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Facility` table. All the data in the column will be lost.
  - You are about to drop the column `openingHours` on the `Facility` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[bookingId]` on the table `Event` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Facility` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `endTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Booking` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Facility` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Facility_description_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "slot",
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "location",
DROP COLUMN "organiserId",
DROP COLUMN "slot",
ADD COLUMN     "bookingId" INTEGER,
ADD COLUMN     "endTime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "organiserIds" TEXT[],
ADD COLUMN     "startTime" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "signUpLink" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Facility" DROP COLUMN "description",
DROP COLUMN "openingHours",
ADD COLUMN     "location" TEXT,
ADD COLUMN     "name" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "CCA" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,

    CONSTRAINT "CCA_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CCA_name_key" ON "CCA"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Event_bookingId_key" ON "Event"("bookingId");

-- CreateIndex
CREATE UNIQUE INDEX "Facility_name_key" ON "Facility"("name");

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "Booking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
