import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.tipoMantenimiento.findMany();
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener tipos de mantenimiento' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.tipoMantenimiento.findUnique({ where: { tipoId: Number(req.params.id) } });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nuevo = await prisma.tipoMantenimiento.create({ data: req.body });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizado = await prisma.tipoMantenimiento.update({
            where: { tipoId: Number(req.params.id) },
            data: req.body,
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.tipoMantenimiento.update({ where: { tipoId: Number(req.params.id) }, data: { activo: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
