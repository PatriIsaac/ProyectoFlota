import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.movimientoDiario.findMany({ include: { vehiculo: true, conductor: true } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.movimientoDiario.findUnique({ where: { movimientoId: Number(req.params.id) }, include: { vehiculo: true, conductor: true } });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        // Regla de negocio (MA 122 01 01): km de llegada no puede ser menor al de salida.
        const { kmSalida, kmLlegada } = req.body;
        if (kmLlegada != null && kmSalida != null && Number(kmLlegada) < Number(kmSalida)) {
            return res.status(400).json({ error: 'kmLlegada no puede ser menor que kmSalida' });
        }
        const nuevo = await prisma.movimientoDiario.create({ data: req.body });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

// GET /api/movimientos/vehiculo/:id/kilometraje -> km acumulado y horas de la unidad
router.get('/vehiculo/:id/kilometraje', async (req, res) => {
    try {
        const vehiculoId = Number(req.params.id);
        const movs = await prisma.movimientoDiario.findMany({ where: { vehiculoId } });
        const kmAcumulado = movs.reduce((s, m) => s + Math.max(m.kmLlegada - m.kmSalida, 0), 0);
        const horasAcumuladas = movs.reduce((s, m) => s + m.horas, 0);
        res.json({ vehiculoId, movimientos: movs.length, kmAcumulado, horasAcumuladas });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizado = await prisma.movimientoDiario.update({
            where: { movimientoId: Number(req.params.id) },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.movimientoDiario.delete({ where: { movimientoId: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
