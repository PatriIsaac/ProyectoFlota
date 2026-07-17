import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.area.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener áreas' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const area = await prisma.area.findUnique({ where: { areaId: Number(req.params.id) } });
        if (area) res.json(area);
        else res.status(404).json({ error: 'No encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nueva = await prisma.area.create({ data: req.body });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizada = await prisma.area.update({
            where: { areaId: Number(req.params.id) },
            data: req.body,
        });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

// Borrado lógico: nunca se elimina físicamente un catálogo referenciado por asignaciones.
router.delete('/:id', async (req, res) => {
    try {
        await prisma.area.update({ where: { areaId: Number(req.params.id) }, data: { activo: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
