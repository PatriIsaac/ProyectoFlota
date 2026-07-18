import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Obtener todos
router.get('/', async (req, res) => {
    try {
        const conductores = await prisma.conductor.findMany({
            include: { DocumentoPersonal: true }
        });
        const mapped = conductores.map(c => ({
            ...c,
            documentos: c.DocumentoPersonal
        }));
        res.json(mapped);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener conductores' });
    }
});

// Obtener uno
router.get('/:id', async (req, res) => {
    try {
        const conductor = await prisma.conductor.findUnique({ 
            where: { conductorId: Number(req.params.id) },
            include: { DocumentoPersonal: true }
        });
        if (conductor) {
            const mapped = { ...conductor, documentos: conductor.DocumentoPersonal };
            res.json(mapped);
        } else {
            res.status(404).json({ error: 'No encontrado' });
        }
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

// Eliminar (borrado lógico)
router.delete('/:id', async (req, res) => {
    try {
        await prisma.conductor.update({ where: { conductorId: Number(req.params.id) }, data: { activo: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
