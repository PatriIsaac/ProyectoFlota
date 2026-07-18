import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.llanta.findMany({
            include: { Vehiculo: true },
            orderBy: { creadoEn: 'desc' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener llantas' });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.vehiculoId) data.vehiculoId = Number(data.vehiculoId);
        if (data.costo !== undefined) data.costo = Number(data.costo);
        
        const nuevo = await prisma.llanta.create({ data });
        res.status(201).json(nuevo);
    } catch (error: any) {
        console.error("Error creating llanta:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'El código de la llanta ya existe. Ingrese uno diferente.' });
        }
        res.status(400).json({ error: error.message || 'Error al crear llanta', details: error });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const llantaId = Number(req.params.id);
        const actualizado = await prisma.llanta.update({
            where: { llantaId },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar llanta' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const llantaId = Number(req.params.id);
        await prisma.llanta.delete({ where: { llantaId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar llanta' });
    }
});

export default router;
