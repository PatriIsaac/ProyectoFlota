/*
  Warnings:

  - You are about to drop the column `kmHoras` on the `CostoOperacionMensual` table. All the data in the column will be lost.
  - You are about to drop the column `taller` on the `OrdenServicio` table. All the data in the column will be lost.
  - The `estado` column on the `Vehiculo` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the `abastecimiento` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `actualizadoEn` to the `Area` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Asignacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `CategoriaVehiculo` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Conductor` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Conjunto` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `CostoFijoMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `combustibleCosto` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `combustibleGalones` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `diasUtiles` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gastosLavado` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gastosViaje` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `horas` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `km` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `llantasNuevasCosto` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `llantasReencauchadasCosto` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lubricanteCosto` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lubricanteGalones` to the `CostoOperacionMensual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `CostoPromedioAnual` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `DetalleCostoMantenimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `DetalleSolicitud` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Indicador` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `InventarioUnidad` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Llanta` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Material` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `MovimientoDiario` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `OrdenServicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tallerId` to the `OrdenServicio` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `ParametroUtilizacion` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `RegistroMensualMantenimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `SolicitudMaterial` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `TipoMantenimiento` table without a default value. This is not possible if the table is not empty.
  - Added the required column `actualizadoEn` to the `Vehiculo` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstadoVehiculo" AS ENUM ('Operativo', 'Mantenimiento', 'Inactivo', 'DeBaja');

-- DropForeignKey
ALTER TABLE "abastecimiento" DROP CONSTRAINT "abastecimiento_vehiculoId_fkey";

-- AlterTable
ALTER TABLE "Area" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Asignacion" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "conductorId" INTEGER,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CategoriaVehiculo" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Conductor" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Conjunto" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CostoFijoMensual" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "CostoOperacionMensual" DROP COLUMN "kmHoras",
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "combustibleCosto" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "combustibleGalones" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "diasUtiles" INTEGER NOT NULL,
ADD COLUMN     "gastosLavado" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "gastosViaje" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "horas" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "km" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "llantasNuevasCosto" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "llantasReencauchadasCosto" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "lubricanteCosto" DECIMAL(12,2) NOT NULL,
ADD COLUMN     "lubricanteGalones" DOUBLE PRECISION NOT NULL;

-- AlterTable
ALTER TABLE "CostoPromedioAnual" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DetalleCostoMantenimiento" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "DetalleSolicitud" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Indicador" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "InventarioUnidad" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Llanta" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Material" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "MovimientoDiario" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "OrdenServicio" DROP COLUMN "taller",
ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "tallerId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "ParametroUtilizacion" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "RegistroMensualMantenimiento" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "SolicitudMaterial" ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "TipoMantenimiento" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "Vehiculo" ADD COLUMN     "activo" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "actualizadoEn" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
DROP COLUMN "estado",
ADD COLUMN     "estado" "EstadoVehiculo" NOT NULL DEFAULT 'Operativo';

-- DropTable
DROP TABLE "abastecimiento";

-- CreateTable
CREATE TABLE "DocumentoPersonal" (
    "documentoId" SERIAL NOT NULL,
    "conductorId" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "vigencia" TIMESTAMP(3) NOT NULL,
    "fechaSubida" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DocumentoPersonal_pkey" PRIMARY KEY ("documentoId")
);

-- CreateTable
CREATE TABLE "AutorizacionServicioExterno" (
    "autorizacionId" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "fechaEntrada" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3),
    "valorPresupuestado" DECIMAL(12,2) NOT NULL,
    "nombreResponsable" TEXT NOT NULL,
    "fechaAprobacion" TIMESTAMP(3),
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AutorizacionServicioExterno_pkey" PRIMARY KEY ("autorizacionId")
);

-- CreateTable
CREATE TABLE "TarjetaManoObra" (
    "tarjetaId" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "mecanicoNombre" TEXT NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "codigoServicio" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFin" TIMESTAMP(3) NOT NULL,
    "tiempoUtilizado" DOUBLE PRECISION NOT NULL,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TarjetaManoObra_pkey" PRIMARY KEY ("tarjetaId")
);

-- CreateTable
CREATE TABLE "Rol" (
    "rolId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Rol_pkey" PRIMARY KEY ("rolId")
);

-- CreateTable
CREATE TABLE "Servicentro" (
    "servicentroId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Servicentro_pkey" PRIMARY KEY ("servicentroId")
);

-- CreateTable
CREATE TABLE "Taller" (
    "tallerId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,
    "ruc" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Taller_pkey" PRIMARY KEY ("tallerId")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "usuarioId" SERIAL NOT NULL,
    "nombres" TEXT NOT NULL,
    "apellidos" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rolId" INTEGER NOT NULL,
    "estado" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("usuarioId")
);

-- CreateTable
CREATE TABLE "Abastecimiento" (
    "abastecimientoId" SERIAL NOT NULL,
    "numeroOrden" TEXT NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "servicentroId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipoCombustible" TEXT NOT NULL,
    "galones" DOUBLE PRECISION NOT NULL,
    "costo" DECIMAL(12,2) NOT NULL,
    "kmVelocimetro" DOUBLE PRECISION NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "creadoEn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "actualizadoEn" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Abastecimiento_pkey" PRIMARY KEY ("abastecimientoId")
);

-- CreateIndex
CREATE INDEX "DocumentoPersonal_conductorId_idx" ON "DocumentoPersonal"("conductorId");

-- CreateIndex
CREATE UNIQUE INDEX "AutorizacionServicioExterno_numero_key" ON "AutorizacionServicioExterno"("numero");

-- CreateIndex
CREATE INDEX "AutorizacionServicioExterno_ordenId_idx" ON "AutorizacionServicioExterno"("ordenId");

-- CreateIndex
CREATE INDEX "TarjetaManoObra_ordenId_idx" ON "TarjetaManoObra"("ordenId");

-- CreateIndex
CREATE UNIQUE INDEX "Rol_nombre_key" ON "Rol"("nombre");

-- CreateIndex
CREATE UNIQUE INDEX "Servicentro_ruc_key" ON "Servicentro"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Taller_ruc_key" ON "Taller"("ruc");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Abastecimiento_numeroOrden_key" ON "Abastecimiento"("numeroOrden");

-- CreateIndex
CREATE INDEX "Abastecimiento_vehiculoId_idx" ON "Abastecimiento"("vehiculoId");

-- CreateIndex
CREATE INDEX "Abastecimiento_servicentroId_idx" ON "Abastecimiento"("servicentroId");

-- CreateIndex
CREATE INDEX "Asignacion_vehiculoId_idx" ON "Asignacion"("vehiculoId");

-- CreateIndex
CREATE INDEX "Asignacion_areaId_idx" ON "Asignacion"("areaId");

-- CreateIndex
CREATE INDEX "Asignacion_conductorId_idx" ON "Asignacion"("conductorId");

-- CreateIndex
CREATE INDEX "Conjunto_vehiculoId_idx" ON "Conjunto"("vehiculoId");

-- CreateIndex
CREATE INDEX "CostoFijoMensual_vehiculoId_idx" ON "CostoFijoMensual"("vehiculoId");

-- CreateIndex
CREATE INDEX "CostoOperacionMensual_vehiculoId_idx" ON "CostoOperacionMensual"("vehiculoId");

-- CreateIndex
CREATE INDEX "DetalleCostoMantenimiento_ordenId_idx" ON "DetalleCostoMantenimiento"("ordenId");

-- CreateIndex
CREATE INDEX "DetalleSolicitud_solicitudId_idx" ON "DetalleSolicitud"("solicitudId");

-- CreateIndex
CREATE INDEX "DetalleSolicitud_materialId_idx" ON "DetalleSolicitud"("materialId");

-- CreateIndex
CREATE INDEX "InventarioUnidad_vehiculoId_idx" ON "InventarioUnidad"("vehiculoId");

-- CreateIndex
CREATE INDEX "Llanta_vehiculoId_idx" ON "Llanta"("vehiculoId");

-- CreateIndex
CREATE INDEX "MovimientoDiario_vehiculoId_idx" ON "MovimientoDiario"("vehiculoId");

-- CreateIndex
CREATE INDEX "MovimientoDiario_conductorId_idx" ON "MovimientoDiario"("conductorId");

-- CreateIndex
CREATE INDEX "OrdenServicio_vehiculoId_idx" ON "OrdenServicio"("vehiculoId");

-- CreateIndex
CREATE INDEX "OrdenServicio_tallerId_idx" ON "OrdenServicio"("tallerId");

-- CreateIndex
CREATE INDEX "RegistroMensualMantenimiento_vehiculoId_idx" ON "RegistroMensualMantenimiento"("vehiculoId");

-- CreateIndex
CREATE INDEX "SolicitudMaterial_ordenId_idx" ON "SolicitudMaterial"("ordenId");

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("conductorId") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentoPersonal" ADD CONSTRAINT "DocumentoPersonal_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("conductorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AutorizacionServicioExterno" ADD CONSTRAINT "AutorizacionServicioExterno_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenServicio"("ordenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TarjetaManoObra" ADD CONSTRAINT "TarjetaManoObra_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenServicio"("ordenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_tallerId_fkey" FOREIGN KEY ("tallerId") REFERENCES "Taller"("tallerId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Usuario" ADD CONSTRAINT "Usuario_rolId_fkey" FOREIGN KEY ("rolId") REFERENCES "Rol"("rolId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Abastecimiento" ADD CONSTRAINT "Abastecimiento_servicentroId_fkey" FOREIGN KEY ("servicentroId") REFERENCES "Servicentro"("servicentroId") ON DELETE RESTRICT ON UPDATE CASCADE;
