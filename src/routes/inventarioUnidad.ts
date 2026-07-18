import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.inventarioUnidad.findMany({
            include: { Vehiculo: true },
            orderBy: { fecha: 'desc' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener inventario' });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.vehiculoId) data.vehiculoId = Number(data.vehiculoId);
        if (data.fecha) data.fecha = new Date(data.fecha);
        if (data.kmHorasLectura) data.kmHorasLectura = Number(data.kmHorasLectura);
        
        const nuevo = await prisma.inventarioUnidad.create({ data });
        res.status(201).json(nuevo);
    } catch (error: any) {
        console.error("Error creating inventario:", error);
        res.status(400).json({ error: error.message || 'Error al crear inventario', details: error });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const inventarioId = Number(req.params.id);
        const actualizado = await prisma.inventarioUnidad.update({
            where: { inventarioId },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar inventario' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const inventarioId = Number(req.params.id);
        await prisma.inventarioUnidad.delete({ where: { inventarioId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar inventario' });
    }
});

export default router;
