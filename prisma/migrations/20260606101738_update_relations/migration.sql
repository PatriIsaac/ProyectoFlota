/*
  Warnings:

  - Added the required column `vehiculoId` to the `Conjunto` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Conjunto" ADD COLUMN     "vehiculoId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Conjunto" ADD CONSTRAINT "Conjunto_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;
