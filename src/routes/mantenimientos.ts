import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.ordenServicio.findMany({ include: { Vehiculo: true, TipoMantenimiento: true, Taller: true } });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        const data = await prisma.ordenServicio.findUnique({ where: { ordenId: Number(req.params.id) }, include: { Vehiculo: true, TipoMantenimiento: true, Taller: true } });
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
        if (data.tipoId) data.tipoId = Number(data.tipoId);
        if (data.tallerId) data.tallerId = Number(data.tallerId);
        if (data.kilometraje) data.kilometraje = Number(data.kilometraje);
        if (data.fechaEntrada) data.fechaEntrada = new Date(data.fechaEntrada);
        if (data.fechaSalida) data.fechaSalida = new Date(data.fechaSalida);
        
        const nuevo = await prisma.ordenServicio.create({ data });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("Error creating OrdenServicio:", error);
        res.status(400).json({ error: 'Error al crear', details: error });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const actualizado = await prisma.ordenServicio.update({
            where: { ordenId: Number(req.params.id) },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.ordenServicio.update({ where: { ordenId: Number(req.params.id) }, data: { activo: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
