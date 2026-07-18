import { PrismaClient } from './generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

async function main() {
    try {
        const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
        const adapter = new PrismaPg(pool);
        const prisma = new PrismaClient({ adapter });

        console.log("Intentando obtener vehiculos...");
        const vehiculos = await prisma.vehiculo.findMany({ include: { categoriaVehiculo: true }});
        console.log("Vehiculos:", vehiculos.length);
        process.exit(0);
    } catch(e) {
        console.error("ERROR Prisma:", e);
        process.exit(1);
    }
}
main();
