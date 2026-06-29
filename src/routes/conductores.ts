import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Obtener todos
router.get('/', async (req, res) => {
    try {
        const conductores = await prisma.conductor.findMany();
        res.json(conductores);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener conductores' });
    }
});

// Obtener uno
router.get('/:id', async (req, res) => {
    try {
        const conductor = await prisma.conductor.findUnique({ where: { conductorId: Number(req.params.id) } });
        if (conductor) res.json(conductor);
        else res.status(404).json({ error: 'No encontrado' });
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

// Crear
router.post('/', async (req, res) => {
    try {
        const nuevo = await prisma.conductor.create({ data: req.body });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear' });
    }
});

// Actualizar
router.patch('/:id', async (req, res) => {
    try {
        const actualizado = await prisma.conductor.update({
            where: { conductorId: Number(req.params.id) },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

// Eliminar
router.delete('/:id', async (req, res) => {
    try {
        await prisma.conductor.delete({ where: { conductorId: Number(req.params.id) } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
