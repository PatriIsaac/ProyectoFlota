import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// MA 122 02 02 - Autorización de Servicio Externo.
router.get('/', async (req, res) => {
    try {
        const data = await prisma.autorizacionServicioExterno.findMany({ include: { OrdenServicio: true } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener autorizaciones' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.autorizacionServicioExterno.findUnique({
            where: { autorizacionId: Number(req.params.id) },
            include: { OrdenServicio: true },
        });
        if (data) res.json(data);
        else res.status(404).json({ error: 'No encontrada' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const nueva = await prisma.autorizacionServicioExterno.create({ data: req.body });
        res.status(201).json(nueva);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizada = await prisma.autorizacionServicioExterno.update({
            where: { autorizacionId: Number(req.params.id) },
            data: req.body,
        });
        res.json(actualizada);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.autorizacionServicioExterno.delete({ where: { autorizacionId: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
