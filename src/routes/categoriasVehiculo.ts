import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.categoriaVehiculo.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener categorías' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.categoriaVehiculo.findUnique({ where: { categoriaVehiculoId: Number(req.params.id) } });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nueva = await prisma.categoriaVehiculo.create({ data: req.body });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizada = await prisma.categoriaVehiculo.update({
            where: { categoriaVehiculoId: Number(req.params.id) },
            data: req.body,
        });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.categoriaVehiculo.update({ where: { categoriaVehiculoId: Number(req.params.id) }, data: { activo: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
