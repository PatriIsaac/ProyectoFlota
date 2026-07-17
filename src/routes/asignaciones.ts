import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.asignacion.findMany({ include: { Vehiculo: true, Area: true, Conductor: true } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener asignaciones' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.asignacion.findUnique({
            where: { asignacionId: Number(req.params.id) },
            include: { Vehiculo: true, Area: true, Conductor: true },
        });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nueva = await prisma.asignacion.create({ data: req.body });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizada = await prisma.asignacion.update({
            where: { asignacionId: Number(req.params.id) },
            data: req.body,
        });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.asignacion.delete({ where: { asignacionId: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
