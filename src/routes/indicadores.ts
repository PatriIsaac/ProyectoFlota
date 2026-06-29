import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

const prom = (xs: number[]) => (xs.length ? xs.reduce((a, b) => a + b, 0) / xs.length : 0);

// GET /api/indicadores/dashboard
// KPIs consolidados de la flota para el tablero principal (Figura 16).
router.get('/dashboard', async (req, res) => {
    try {
        const vehiculos = await prisma.vehiculo.findMany({ select: { vehiculoId: true, estado: true } });

        // Disponibilidad por estado.
        const porEstado: Record<string, number> = {};
        for (const v of vehiculos) porEstado[v.estado] = (porEstado[v.estado] ?? 0) + 1;
        const disponibles = vehiculos.filter((v) => v.estado.toLowerCase() === 'operativo' || v.estado.toLowerCase() === 'disponible').length;

        // Último costo operacional calculado por vehículo (para promediar la flota).
        const costos = await prisma.costoOperacionMensual.findMany({ orderBy: { mesAnio: 'asc' } });
        const ultimoPorVehiculo = new Map<number, typeof costos[number]>();
        for (const c of costos) ultimoPorVehiculo.set(c.vehiculoId, c); // orden asc => queda el más reciente
        const ultimos = [...ultimoPorVehiculo.values()];

        res.json({
            totalVehiculos: vehiculos.length,
            disponibles,
            disponibilidadPct: vehiculos.length ? disponibles / vehiculos.length : 0,
            porEstado,
            promedios: {
                ckv: prom(ultimos.map((c) => Number(c.ckv))),
                iuv: prom(ultimos.map((c) => Number(c.iuv))),
                consumo: prom(ultimos.map((c) => Number(c.consumo))),
            },
            vehiculosConCosto: ultimos.length,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al generar el dashboard' });
    }
});

export default router;
