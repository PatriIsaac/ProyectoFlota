import "dotenv/config";
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '../generated/prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from "@prisma/adapter-pg";
import vehiculosRoutes from './routes/vehiculos';
import conductoresRoutes from './routes/conductores';
import authRoutes from './routes/auth';
import movimientosRoutes from './routes/movimientos';
import abastecimientosRoutes from './routes/abastecimientos';
import mantenimientosRoutes from './routes/mantenimientos';
import usuariosRoutes from './routes/usuarios';

const app = express();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Ruta de comprobación de salud
app.get('/', (req, res) => {
    res.json({ message: 'FleetSys API is running' });
});

// Rutas de entidades
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/abastecimientos', abastecimientosRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);
app.use('/api/usuarios', usuariosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
