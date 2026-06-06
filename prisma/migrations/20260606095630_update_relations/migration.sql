-- AlterTable
ALTER TABLE "Asignacion" ADD COLUMN     "fechaFin" TIMESTAMP(3);

-- AddForeignKey
ALTER TABLE "ParametroUtilizacion" ADD CONSTRAINT "ParametroUtilizacion_categoriaVehiculoId_fkey" FOREIGN KEY ("categoriaVehiculoId") REFERENCES "CategoriaVehiculo"("categoriaVehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;
