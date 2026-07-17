import { Router } from 'express';
import { prisma } from '../server';
import {
    calcularIndicadores,
    depreciacionAnual,
    curvaCostoPromedioAnual,
    VariablesControl,
} from '../services/costos';

const router = Router();

// "YYYY-MM" -> [inicioMes, inicioMesSiguiente)
function rangoMes(mesAnio: string): { inicio: Date; fin: Date } | null {
    const m = /^(\d{4})-(\d{2})$/.exec(mesAnio);
    if (!m) return null;
    const anio = Number(m[1]);
    const mes = Number(m[2]);
    if (mes < 1 || mes > 12) return null;
    return { inicio: new Date(Date.UTC(anio, mes - 1, 1)), fin: new Date(Date.UTC(anio, mes, 1)) };
}

// Gastos que el manual (F1T02 §4.2, líneas 5b-9) deja a criterio de "autorización especial" de
// cada EPS: no tienen tabla de origen propia, se registran manualmente al calcular el mes.
export interface GastosManuales {
    diasUtiles: number;
    lubricanteGalones: number;
    lubricanteCosto: number;
    llantasNuevasCosto: number;
    llantasReencauchadasCosto: number;
    gastosLavado: number;
    gastosViaje: number;
}

const gastosManualesDefault = (): GastosManuales => ({
    diasUtiles: 0, lubricanteGalones: 0, lubricanteCosto: 0,
    llantasNuevasCosto: 0, llantasReencauchadasCosto: 0, gastosLavado: 0, gastosViaje: 0,
});

// Reúne las variables de control (VA122 0x) de un vehículo en un mes.
async function obtenerVariablesControl(
    vehiculoId: number, mesAnio: string, rango: { inicio: Date; fin: Date }, gastos: GastosManuales
): Promise<VariablesControl> {
    const vehiculo = await prisma.vehiculo.findUnique({
        where: { vehiculoId },
        include: { CategoriaVehiculo: { include: { ParametroUtilizacion: true } } },
    });
    if (!vehiculo) throw new Error('Vehículo no encontrado');

    const movimientos = await prisma.movimientoDiario.findMany({
        where: { vehiculoId, fecha: { gte: rango.inicio, lt: rango.fin } },
    });
    const totalKm = movimientos.reduce((s, m) => s + Math.max(m.kmLlegada - m.kmSalida, 0), 0);
    const totalHoras = movimientos.reduce((s, m) => s + m.horas, 0);

    const abast = await prisma.abastecimiento.findMany({
        where: { vehiculoId, fecha: { gte: rango.inicio, lt: rango.fin } },
    });
    const totalGalones = abast.reduce((s, a) => s + a.galones, 0);
    const costoCombustible = abast.reduce((s, a) => s + Number(a.costo), 0);

    const regMant = await prisma.registroMensualMantenimiento.findFirst({ where: { vehiculoId, mesAnio } });
    const param = vehiculo.CategoriaVehiculo.ParametroUtilizacion[0];

    return {
        totalKm,
        totalHoras,
        totalGalones,
        costoCombustible,
        mantPropio: regMant ? Number(regMant.propio) : 0,
        mantTerceros: regMant ? Number(regMant.terceros) : 0,
        kmParametro: param?.kmParametro ?? 0,
        horasParametro: param?.horasParametro ?? 0,
        lubricanteCosto: gastos.lubricanteCosto,
        llantasNuevasCosto: gastos.llantasNuevasCosto,
        llantasReencauchadasCosto: gastos.llantasReencauchadasCosto,
        gastosLavado: gastos.gastosLavado,
        gastosViaje: gastos.gastosViaje,
    };
}

// POST /api/costos/calcular  { vehiculoId, mesAnio }
// Calcula CVV, CKV, consumo, IUV del mes y los persiste en CostoOperacionMensual.
router.post('/calcular', async (req, res) => {
    try {
        const vehiculoId = Number(req.body.vehiculoId);
        const mesAnio: string = req.body.mesAnio;
        const rango = rangoMes(mesAnio);
        if (!vehiculoId || !rango) {
            return res.status(400).json({ error: 'vehiculoId y mesAnio ("YYYY-MM") son obligatorios' });
        }

        const gastos: GastosManuales = { ...gastosManualesDefault(), ...req.body.gastosManuales };
        const variables = await obtenerVariablesControl(vehiculoId, mesAnio, rango, gastos);

        const costoFijo = await prisma.costoFijoMensual.findFirst({ where: { vehiculoId, mesAnio } });
        const provisional = !costoFijo; // flujo alterno 3a: sin CFP/CFV el cálculo es PROVISIONAL
        const cfp = costoFijo ? Number(costoFijo.cfp) : 0;
        const cfv = costoFijo ? Number(costoFijo.cfv) : 0;

        const ind = calcularIndicadores(variables, cfp, cfv);

        // CostoOperacionMensual no tiene unique (vehiculoId, mesAnio): upsert manual.
        const existente = await prisma.costoOperacionMensual.findFirst({ where: { vehiculoId, mesAnio } });
        const datos = {
            vehiculoId,
            mesAnio,
            diasUtiles: gastos.diasUtiles,
            km: variables.totalKm,
            horas: variables.totalHoras,
            combustibleGalones: variables.totalGalones,
            combustibleCosto: variables.costoCombustible,
            lubricanteGalones: gastos.lubricanteGalones,
            lubricanteCosto: gastos.lubricanteCosto,
            llantasNuevasCosto: gastos.llantasNuevasCosto,
            llantasReencauchadasCosto: gastos.llantasReencauchadasCosto,
            gastosLavado: gastos.gastosLavado,
            gastosViaje: gastos.gastosViaje,
            cvv: ind.cvv,
            ckv: ind.ckv,
            consumo: ind.consumo,
            iuv: ind.iuv,
        };
        const registro = existente
            ? await prisma.costoOperacionMensual.update({ where: { comId: existente.comId }, data: datos })
            : await prisma.costoOperacionMensual.create({ data: datos });

        res.json({ provisional, variables, indicadores: ind, costoFijo: { cfp, cfv }, registro });
    } catch (error: any) {
        if (error?.message === 'Vehículo no encontrado') return res.status(404).json({ error: error.message });
        console.error(error);
        res.status(500).json({ error: 'Error al calcular el costo operacional' });
    }
});

// GET /api/costos/operacion/:vehiculoId  -> histórico mensual ya calculado
router.get('/operacion/:vehiculoId', async (req, res) => {
    try {
        const data = await prisma.costoOperacionMensual.findMany({
            where: { vehiculoId: Number(req.params.vehiculoId) },
            orderBy: { mesAnio: 'asc' },
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

// GET /api/costos/sustitucion/:vehiculoId?factorCrecimiento=0.2&mantenimientoAnioBase=5000
// Curva de costo promedio anual + año óptimo de sustitución. Persiste en CostoPromedioAnual.
router.get('/sustitucion/:vehiculoId', async (req, res) => {
    try {
        const vehiculoId = Number(req.params.vehiculoId);
        const vehiculo = await prisma.vehiculo.findUnique({ where: { vehiculoId } });
        if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });

        // Base de mantenimiento anual: promedio mensual histórico × 12 (o default si no hay datos).
        const registros = await prisma.registroMensualMantenimiento.findMany({ where: { vehiculoId } });
        let mantenimientoAnioBase = Number(req.query.mantenimientoAnioBase);
        if (!mantenimientoAnioBase || mantenimientoAnioBase <= 0) {
            const totalMensual = registros.reduce((s, r) => s + Number(r.propio) + Number(r.terceros), 0);
            mantenimientoAnioBase = registros.length > 0 ? (totalMensual / registros.length) * 12 : 3000;
        }
        const factorCrecimiento = Number(req.query.factorCrecimiento) || 0.2;

        const valorNuevo = Number(vehiculo.valorNuevo);
        const valorResidual = Number(vehiculo.valorResidual);
        const { curva, anioOptimo } = curvaCostoPromedioAnual({
            valorNuevo,
            valorResidual,
            vidaUtilAnios: vehiculo.vidaUtilAnios,
            mantenimientoAnioBase,
            factorCrecimiento,
        });

        const optimo = curva[anioOptimo - 1];
        const datos = {
            eniaN: anioOptimo, // año n óptimo
            depreciacion: optimo.depreciacionAcum,
            remanenteAcumulado: optimo.valorRescate,
            costoPromedioAnual: optimo.costoPromedioAnual,
        };
        await prisma.costoPromedioAnual.upsert({
            where: { vehiculoId },
            update: datos,
            create: { vehiculoId, ...datos },
        });

        res.json({
            vehiculoId,
            depreciacionAnual: depreciacionAnual(valorNuevo, valorResidual, vehiculo.vidaUtilAnios),
            mantenimientoAnioBase,
            factorCrecimiento,
            anioOptimo,
            curva,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al calcular la sustitución óptima' });
    }
});

export default router;
