-- CreateTable
CREATE TABLE "CategoriaVehiculo" (
    "categoriaVehiculoId" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "CategoriaVehiculo_pkey" PRIMARY KEY ("categoriaVehiculoId")
);

-- CreateTable
CREATE TABLE "Area" (
    "areaId" SERIAL NOT NULL,
    "nombre" TEXT NOT NULL,

    CONSTRAINT "Area_pkey" PRIMARY KEY ("areaId")
);

-- CreateTable
CREATE TABLE "Vehiculo" (
    "vehiculoId" SERIAL NOT NULL,
    "codigoPatrimonio" TEXT NOT NULL,
    "placa" TEXT NOT NULL,
    "categoriaVehiculoId" INTEGER NOT NULL,
    "valorNuevo" DECIMAL(12,2) NOT NULL,
    "valorResidual" DECIMAL(12,2) NOT NULL,
    "vidaUtilAnios" INTEGER NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Vehiculo_pkey" PRIMARY KEY ("vehiculoId")
);

-- CreateTable
CREATE TABLE "Conductor" (
    "conductorId" SERIAL NOT NULL,
    "documento" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "osActivo" BOOLEAN NOT NULL,

    CONSTRAINT "Conductor_pkey" PRIMARY KEY ("conductorId")
);

-- CreateTable
CREATE TABLE "MovimientoDiario" (
    "movimientoId" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "conductorId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "kmSalida" DOUBLE PRECISION NOT NULL,
    "kmLlegada" DOUBLE PRECISION NOT NULL,
    "horas" DOUBLE PRECISION NOT NULL,
    "destino" TEXT NOT NULL,

    CONSTRAINT "MovimientoDiario_pkey" PRIMARY KEY ("movimientoId")
);

-- CreateTable
CREATE TABLE "Asignacion" (
    "asignacionId" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "areaId" INTEGER NOT NULL,
    "fechaInicio" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Asignacion_pkey" PRIMARY KEY ("asignacionId")
);

-- CreateTable
CREATE TABLE "InventarioUnidad" (
    "inventarioId" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "lecturaVelocimetro" DOUBLE PRECISION NOT NULL,
    "estadoGeneral" TEXT NOT NULL,

    CONSTRAINT "InventarioUnidad_pkey" PRIMARY KEY ("inventarioId")
);

-- CreateTable
CREATE TABLE "Conjunto" (
    "conjuntoId" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "tipo" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Conjunto_pkey" PRIMARY KEY ("conjuntoId")
);

-- CreateTable
CREATE TABLE "Llanta" (
    "llantaId" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "dimension" TEXT NOT NULL,
    "posicion" TEXT NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "Llanta_pkey" PRIMARY KEY ("llantaId")
);

-- CreateTable
CREATE TABLE "Indicador" (
    "indicadorId" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "valor" DOUBLE PRECISION NOT NULL,
    "periodo" TEXT NOT NULL,

    CONSTRAINT "Indicador_pkey" PRIMARY KEY ("indicadorId")
);

-- CreateTable
CREATE TABLE "ParametroUtilizacion" (
    "parametroId" SERIAL NOT NULL,
    "categoriaVehiculoId" INTEGER NOT NULL,
    "kmParametro" DOUBLE PRECISION NOT NULL,
    "horasParametro" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "ParametroUtilizacion_pkey" PRIMARY KEY ("parametroId")
);

-- CreateTable
CREATE TABLE "CostoFijoMensual" (
    "cfmId" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "mesAnio" TEXT NOT NULL,
    "cfp" DECIMAL(12,2) NOT NULL,
    "cfv" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "CostoFijoMensual_pkey" PRIMARY KEY ("cfmId")
);

-- CreateTable
CREATE TABLE "CostoPromedioAnual" (
    "vehiculoId" INTEGER NOT NULL,
    "eniaN" DECIMAL(12,2) NOT NULL,
    "depreciacion" DECIMAL(12,2) NOT NULL,
    "remanenteAcumulado" DECIMAL(12,2) NOT NULL,
    "costoPromedioAnual" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "CostoPromedioAnual_pkey" PRIMARY KEY ("vehiculoId")
);

-- CreateTable
CREATE TABLE "CostoOperacionMensual" (
    "comId" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "mesAnio" TEXT NOT NULL,
    "kmHoras" DOUBLE PRECISION NOT NULL,
    "cvv" DECIMAL(12,2) NOT NULL,
    "ckv" DECIMAL(12,2) NOT NULL,
    "consumo" DECIMAL(12,2) NOT NULL,
    "iuv" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "CostoOperacionMensual_pkey" PRIMARY KEY ("comId")
);

-- CreateTable
CREATE TABLE "abastecimiento" (
    "abastecimientoId" SERIAL NOT NULL,
    "numeroOrden" TEXT NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "tipoCombustible" TEXT NOT NULL,
    "galones" DOUBLE PRECISION NOT NULL,
    "costo" DECIMAL(12,2) NOT NULL,
    "kmVelocimetro" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "abastecimiento_pkey" PRIMARY KEY ("abastecimientoId")
);

-- CreateTable
CREATE TABLE "TipoMantenimiento" (
    "tipoId" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,

    CONSTRAINT "TipoMantenimiento_pkey" PRIMARY KEY ("tipoId")
);

-- CreateTable
CREATE TABLE "OrdenServicio" (
    "ordenId" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "tipoId" INTEGER NOT NULL,
    "taller" TEXT NOT NULL,
    "fechaEntrada" TIMESTAMP(3) NOT NULL,
    "fechaSalida" TIMESTAMP(3),
    "kilometraje" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "OrdenServicio_pkey" PRIMARY KEY ("ordenId")
);

-- CreateTable
CREATE TABLE "DetalleCostoMantenimiento" (
    "detalleId" SERIAL NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "manoObra" DECIMAL(12,2) NOT NULL,
    "repuestos" DECIMAL(12,2) NOT NULL,
    "otros" DECIMAL(12,2) NOT NULL,
    "origen" TEXT NOT NULL,

    CONSTRAINT "DetalleCostoMantenimiento_pkey" PRIMARY KEY ("detalleId")
);

-- CreateTable
CREATE TABLE "RegistroMensualMantenimiento" (
    "registroId" SERIAL NOT NULL,
    "vehiculoId" INTEGER NOT NULL,
    "mesAnio" TEXT NOT NULL,
    "propio" DECIMAL(12,2) NOT NULL,
    "terceros" DECIMAL(12,2) NOT NULL,

    CONSTRAINT "RegistroMensualMantenimiento_pkey" PRIMARY KEY ("registroId")
);

-- CreateTable
CREATE TABLE "Material" (
    "materialId" SERIAL NOT NULL,
    "codigo" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "unidad" TEXT NOT NULL,

    CONSTRAINT "Material_pkey" PRIMARY KEY ("materialId")
);

-- CreateTable
CREATE TABLE "SolicitudMaterial" (
    "solicitudId" SERIAL NOT NULL,
    "numero" TEXT NOT NULL,
    "ordenId" INTEGER NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "estado" TEXT NOT NULL,

    CONSTRAINT "SolicitudMaterial_pkey" PRIMARY KEY ("solicitudId")
);

-- CreateTable
CREATE TABLE "DetalleSolicitud" (
    "detalleId" SERIAL NOT NULL,
    "solicitudId" INTEGER NOT NULL,
    "materialId" INTEGER NOT NULL,
    "cantidad" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "DetalleSolicitud_pkey" PRIMARY KEY ("detalleId")
);

-- CreateIndex
CREATE UNIQUE INDEX "CategoriaVehiculo_codigo_key" ON "CategoriaVehiculo"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_codigoPatrimonio_key" ON "Vehiculo"("codigoPatrimonio");

-- CreateIndex
CREATE UNIQUE INDEX "Vehiculo_placa_key" ON "Vehiculo"("placa");

-- CreateIndex
CREATE UNIQUE INDEX "Conductor_documento_key" ON "Conductor"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Conjunto_codigo_key" ON "Conjunto"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Llanta_codigo_key" ON "Llanta"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "Indicador_codigo_key" ON "Indicador"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "abastecimiento_numeroOrden_key" ON "abastecimiento"("numeroOrden");

-- CreateIndex
CREATE UNIQUE INDEX "TipoMantenimiento_codigo_key" ON "TipoMantenimiento"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "OrdenServicio_numero_key" ON "OrdenServicio"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Material_codigo_key" ON "Material"("codigo");

-- CreateIndex
CREATE UNIQUE INDEX "SolicitudMaterial_numero_key" ON "SolicitudMaterial"("numero");

-- AddForeignKey
ALTER TABLE "Vehiculo" ADD CONSTRAINT "Vehiculo_categoriaVehiculoId_fkey" FOREIGN KEY ("categoriaVehiculoId") REFERENCES "CategoriaVehiculo"("categoriaVehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoDiario" ADD CONSTRAINT "MovimientoDiario_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MovimientoDiario" ADD CONSTRAINT "MovimientoDiario_conductorId_fkey" FOREIGN KEY ("conductorId") REFERENCES "Conductor"("conductorId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Asignacion" ADD CONSTRAINT "Asignacion_areaId_fkey" FOREIGN KEY ("areaId") REFERENCES "Area"("areaId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventarioUnidad" ADD CONSTRAINT "InventarioUnidad_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Llanta" ADD CONSTRAINT "Llanta_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostoFijoMensual" ADD CONSTRAINT "CostoFijoMensual_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostoPromedioAnual" ADD CONSTRAINT "CostoPromedioAnual_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CostoOperacionMensual" ADD CONSTRAINT "CostoOperacionMensual_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "abastecimiento" ADD CONSTRAINT "abastecimiento_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrdenServicio" ADD CONSTRAINT "OrdenServicio_tipoId_fkey" FOREIGN KEY ("tipoId") REFERENCES "TipoMantenimiento"("tipoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleCostoMantenimiento" ADD CONSTRAINT "DetalleCostoMantenimiento_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenServicio"("ordenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RegistroMensualMantenimiento" ADD CONSTRAINT "RegistroMensualMantenimiento_vehiculoId_fkey" FOREIGN KEY ("vehiculoId") REFERENCES "Vehiculo"("vehiculoId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SolicitudMaterial" ADD CONSTRAINT "SolicitudMaterial_ordenId_fkey" FOREIGN KEY ("ordenId") REFERENCES "OrdenServicio"("ordenId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_solicitudId_fkey" FOREIGN KEY ("solicitudId") REFERENCES "SolicitudMaterial"("solicitudId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DetalleSolicitud" ADD CONSTRAINT "DetalleSolicitud_materialId_fkey" FOREIGN KEY ("materialId") REFERENCES "Material"("materialId") ON DELETE RESTRICT ON UPDATE CASCADE;
