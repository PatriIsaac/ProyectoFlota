import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.conjunto.findMany({
            include: { Vehiculo: true },
            orderBy: { creadoEn: 'desc' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener conjuntos' });
    }
});

router.post('/', async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.vehiculoId) data.vehiculoId = Number(data.vehiculoId);
        if (data.costo !== undefined) data.costo = Number(data.costo);
        if (data.fechaInstalacion) data.fechaInstalacion = new Date(data.fechaInstalacion);
        
        const nuevo = await prisma.conjunto.create({ data });
        res.status(201).json(nuevo);
    } catch (error: any) {
        console.error("Error creating conjunto:", error);
        if (error.code === 'P2002') {
            return res.status(400).json({ error: 'El código del conjunto ya existe. Ingrese uno diferente.' });
        }
        res.status(400).json({ error: error.message || 'Error al crear conjunto', details: error });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const conjuntoId = Number(req.params.id);
        const actualizado = await prisma.conjunto.update({
            where: { conjuntoId },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar conjunto' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const conjuntoId = Number(req.params.id);
        await prisma.conjunto.delete({ where: { conjuntoId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar conjunto' });
    }
});

export default router;
