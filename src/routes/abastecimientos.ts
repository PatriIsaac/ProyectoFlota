import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.abastecimiento.findMany({ include: { Vehiculo: true, Servicentro: true } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.abastecimiento.findUnique({ where: { abastecimientoId: Number(req.params.id) }, include: { Vehiculo: true, Servicentro: true } });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.vehiculoId) data.vehiculoId = Number(data.vehiculoId);
        if (data.servicentroId) data.servicentroId = Number(data.servicentroId);
        if (data.galones) data.galones = Number(data.galones);
        if (data.costo) data.costo = Number(data.costo);
        if (data.kmVelocimetro) data.kmVelocimetro = Number(data.kmVelocimetro);
        if (data.fecha) data.fecha = new Date(data.fecha);

        const nuevo = await prisma.abastecimiento.create({ data });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("Error creating Abastecimiento:", error);
        res.status(400).json({ error: 'Error al crear', details: error });
    }
});

// GET /api/abastecimientos/vehiculo/:id/rendimiento -> IA122 01 (km/galón) de la unidad
router.get('/vehiculo/:id/rendimiento', async (req, res) => {
    try {
        const vehiculoId = Number(req.params.id);
        const movs = await prisma.movimientoDiario.findMany({ where: { vehiculoId } });
        const abast = await prisma.abastecimiento.findMany({ where: { vehiculoId } });
        const totalKm = movs.reduce((s, m) => s + Math.max(m.kmLlegada - m.kmSalida, 0), 0);
        const totalGalones = abast.reduce((s, a) => s + a.galones, 0);
        const costoTotal = abast.reduce((s, a) => s + Number(a.costo), 0);
        res.json({
            vehiculoId,
            totalKm,
            totalGalones,
            costoTotal,
            rendimiento: totalGalones > 0 ? totalKm / totalGalones : 0, // km/galón
            costoPorKm: totalKm > 0 ? costoTotal / totalKm : 0,
        });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizado = await prisma.abastecimiento.update({
            where: { abastecimientoId: Number(req.params.id) },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.abastecimiento.update({ where: { abastecimientoId: Number(req.params.id) }, data: { activo: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
