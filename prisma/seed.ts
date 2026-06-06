import "dotenv/config";

import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL!;

const adapter = new PrismaPg({
    connectionString,
});

const prisma = new PrismaClient({
    adapter,
});

async function main() {
    // ─── CategoriaVehiculo (5 registros) ───────────────────────────────────────
    await prisma.categoriaVehiculo.createMany({
        data: [
            { codigo: "CAM", nombre: "Camión" },
            { codigo: "AUT", nombre: "Automóvil" },
            { codigo: "VAN", nombre: "Van" },
            { codigo: "BUS", nombre: "Bus" },
            { codigo: "MOT", nombre: "Motocicleta" },
        ],
        skipDuplicates: true,
    });

    // ─── Conductor (10 registros) ──────────────────────────────────────────────
    await prisma.conductor.createMany({
        data: [
            { documento: "70000001", nombre: "Conductor 1", osActivo: true },
            { documento: "70000002", nombre: "Conductor 2", osActivo: true },
            { documento: "70000003", nombre: "Conductor 3", osActivo: true },
            { documento: "70000004", nombre: "Conductor 4", osActivo: true },
            { documento: "70000005", nombre: "Conductor 5", osActivo: true },
            { documento: "70000006", nombre: "Conductor 6", osActivo: true },
            { documento: "70000007", nombre: "Conductor 7", osActivo: true },
            { documento: "70000008", nombre: "Conductor 8", osActivo: true },
            { documento: "70000009", nombre: "Conductor 9", osActivo: true },
            { documento: "70000010", nombre: "Conductor 10", osActivo: true },
        ],
        skipDuplicates: true,
    });


    // ─── Vehiculo (30 registros) ───────────────────────────────────────────────
    // categoriaVehiculoId cicla 1-5 (CAM, AUT, VAN, BUS, MOT)
    // valorNuevo: 81000 + (i * 1000), valorResidual: 10200 + (i * 200)
    // vidaUtilAnios cicla: 9, 10, 11, 12, 8
    await prisma.vehiculo.createMany({
        data: [
            { codigoPatrimonio: "100001", placa: "ABC001", categoriaVehiculoId: 1, valorNuevo: 81000, valorResidual: 10200, vidaUtilAnios: 9, estado: "Activo" },
            { codigoPatrimonio: "100002", placa: "ABC002", categoriaVehiculoId: 2, valorNuevo: 82000, valorResidual: 10400, vidaUtilAnios: 10, estado: "Activo" },
            { codigoPatrimonio: "100003", placa: "ABC003", categoriaVehiculoId: 3, valorNuevo: 83000, valorResidual: 10600, vidaUtilAnios: 11, estado: "Activo" },
            { codigoPatrimonio: "100004", placa: "ABC004", categoriaVehiculoId: 4, valorNuevo: 84000, valorResidual: 10800, vidaUtilAnios: 12, estado: "Activo" },
            { codigoPatrimonio: "100005", placa: "ABC005", categoriaVehiculoId: 5, valorNuevo: 85000, valorResidual: 11000, vidaUtilAnios: 8, estado: "Activo" },
            { codigoPatrimonio: "100006", placa: "ABC006", categoriaVehiculoId: 1, valorNuevo: 86000, valorResidual: 11200, vidaUtilAnios: 9, estado: "Activo" },
            { codigoPatrimonio: "100007", placa: "ABC007", categoriaVehiculoId: 2, valorNuevo: 87000, valorResidual: 11400, vidaUtilAnios: 10, estado: "Activo" },
            { codigoPatrimonio: "100008", placa: "ABC008", categoriaVehiculoId: 3, valorNuevo: 88000, valorResidual: 11600, vidaUtilAnios: 11, estado: "Activo" },
            { codigoPatrimonio: "100009", placa: "ABC009", categoriaVehiculoId: 4, valorNuevo: 89000, valorResidual: 11800, vidaUtilAnios: 12, estado: "Activo" },
            { codigoPatrimonio: "100010", placa: "ABC010", categoriaVehiculoId: 5, valorNuevo: 90000, valorResidual: 12000, vidaUtilAnios: 8, estado: "Activo" },
            { codigoPatrimonio: "100011", placa: "ABC011", categoriaVehiculoId: 1, valorNuevo: 91000, valorResidual: 12200, vidaUtilAnios: 9, estado: "Activo" },
            { codigoPatrimonio: "100012", placa: "ABC012", categoriaVehiculoId: 2, valorNuevo: 92000, valorResidual: 12400, vidaUtilAnios: 10, estado: "Activo" },
            { codigoPatrimonio: "100013", placa: "ABC013", categoriaVehiculoId: 3, valorNuevo: 93000, valorResidual: 12600, vidaUtilAnios: 11, estado: "Activo" },
            { codigoPatrimonio: "100014", placa: "ABC014", categoriaVehiculoId: 4, valorNuevo: 94000, valorResidual: 12800, vidaUtilAnios: 12, estado: "Activo" },
            { codigoPatrimonio: "100015", placa: "ABC015", categoriaVehiculoId: 5, valorNuevo: 95000, valorResidual: 13000, vidaUtilAnios: 8, estado: "Activo" },
            { codigoPatrimonio: "100016", placa: "ABC016", categoriaVehiculoId: 1, valorNuevo: 96000, valorResidual: 13200, vidaUtilAnios: 9, estado: "Activo" },
            { codigoPatrimonio: "100017", placa: "ABC017", categoriaVehiculoId: 2, valorNuevo: 97000, valorResidual: 13400, vidaUtilAnios: 10, estado: "Activo" },
            { codigoPatrimonio: "100018", placa: "ABC018", categoriaVehiculoId: 3, valorNuevo: 98000, valorResidual: 13600, vidaUtilAnios: 11, estado: "Activo" },
            { codigoPatrimonio: "100019", placa: "ABC019", categoriaVehiculoId: 4, valorNuevo: 99000, valorResidual: 13800, vidaUtilAnios: 12, estado: "Activo" },
            { codigoPatrimonio: "100020", placa: "ABC020", categoriaVehiculoId: 5, valorNuevo: 100000, valorResidual: 14000, vidaUtilAnios: 8, estado: "Activo" },
            { codigoPatrimonio: "100021", placa: "ABC021", categoriaVehiculoId: 1, valorNuevo: 101000, valorResidual: 14200, vidaUtilAnios: 9, estado: "Activo" },
            { codigoPatrimonio: "100022", placa: "ABC022", categoriaVehiculoId: 2, valorNuevo: 102000, valorResidual: 14400, vidaUtilAnios: 10, estado: "Activo" },
            { codigoPatrimonio: "100023", placa: "ABC023", categoriaVehiculoId: 3, valorNuevo: 103000, valorResidual: 14600, vidaUtilAnios: 11, estado: "Activo" },
            { codigoPatrimonio: "100024", placa: "ABC024", categoriaVehiculoId: 4, valorNuevo: 104000, valorResidual: 14800, vidaUtilAnios: 12, estado: "Activo" },
            { codigoPatrimonio: "100025", placa: "ABC025", categoriaVehiculoId: 5, valorNuevo: 105000, valorResidual: 15000, vidaUtilAnios: 8, estado: "Activo" },
            { codigoPatrimonio: "100026", placa: "ABC026", categoriaVehiculoId: 1, valorNuevo: 106000, valorResidual: 15200, vidaUtilAnios: 9, estado: "Activo" },
            { codigoPatrimonio: "100027", placa: "ABC027", categoriaVehiculoId: 2, valorNuevo: 107000, valorResidual: 15400, vidaUtilAnios: 10, estado: "Activo" },
            { codigoPatrimonio: "100028", placa: "ABC028", categoriaVehiculoId: 3, valorNuevo: 108000, valorResidual: 15600, vidaUtilAnios: 11, estado: "Activo" },
            { codigoPatrimonio: "100029", placa: "ABC029", categoriaVehiculoId: 4, valorNuevo: 109000, valorResidual: 15800, vidaUtilAnios: 12, estado: "Activo" },
            { codigoPatrimonio: "100030", placa: "ABC030", categoriaVehiculoId: 5, valorNuevo: 110000, valorResidual: 16000, vidaUtilAnios: 8, estado: "Activo" },
        ],
        skipDuplicates: true,
    });

    console.log("✅ Datos cargados correctamente:");
    console.log("   - 5 CategoriaVehiculo");
    console.log("   - 10 Conductores");
    console.log("   - 30 Vehículos");
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect();
    });