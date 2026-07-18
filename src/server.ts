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
import costosRoutes from './routes/costos';
import indicadoresRoutes from './routes/indicadores';
import areasRoutes from './routes/areas';
import servicentrosRoutes from './routes/servicentros';
import talleresRoutes from './routes/talleres';
import categoriasVehiculoRoutes from './routes/categoriasVehiculo';
import tiposMantenimientoRoutes from './routes/tiposMantenimiento';
import autorizacionesExternasRoutes from './routes/autorizacionesExternas';
import tarjetasManoObraRoutes from './routes/tarjetasManoObra';
import asignacionesRoutes from './routes/asignaciones';
import reportesBirtRoutes from './routes/reportesBirt';
import materialesRoutes from './routes/materiales';
import solicitudesMaterialRoutes from './routes/solicitudesMaterial';
import documentosPersonalesRoutes from './routes/documentosPersonales';
import inventarioUnidadRoutes from './routes/inventarioUnidad';
import llantasRoutes from './routes/llantas';
import conjuntosRoutes from './routes/conjuntos';
import { requireAuth } from './middleware/auth';

const app = express();

const connectionString = process.env.DATABASE_URL!;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });

app.use(cors());
app.use(express.json());

// Servir archivos subidos
app.use('/uploads', express.static('uploads'));

// Ruta de comprobación de salud
app.get('/', (req, res) => {
    res.json({ message: 'FleetSys API is running' });
});

// Login es la única ruta pública; todo lo demás exige JWT.
app.use('/api/auth', authRoutes);
app.use('/api', requireAuth);

// Rutas de entidades
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/conductores', conductoresRoutes);
app.use('/api/movimientos', movimientosRoutes);
app.use('/api/abastecimientos', abastecimientosRoutes);
app.use('/api/mantenimientos', mantenimientosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/costos', costosRoutes);
app.use('/api/indicadores', indicadoresRoutes);
app.use('/api/areas', areasRoutes);
app.use('/api/servicentros', servicentrosRoutes);
app.use('/api/talleres', talleresRoutes);
app.use('/api/categorias-vehiculo', categoriasVehiculoRoutes);
app.use('/api/tipos-mantenimiento', tiposMantenimientoRoutes);
app.use('/api/autorizaciones-externas', autorizacionesExternasRoutes);
app.use('/api/tarjetas-mano-obra', tarjetasManoObraRoutes);
app.use('/api/asignaciones', asignacionesRoutes);
app.use('/api/reportes', reportesBirtRoutes);
app.use('/api/materiales', materialesRoutes);
app.use('/api/solicitudes-material', solicitudesMaterialRoutes);
app.use('/api/documentos-personales', documentosPersonalesRoutes);
app.use('/api/inventario-unidad', inventarioUnidadRoutes);
app.use('/api/llantas', llantasRoutes);
app.use('/api/conjuntos', conjuntosRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`BIRT_PROJECT_DIR loaded as: ${process.env.BIRT_PROJECT_DIR}`);
});
