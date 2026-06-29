import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

// Obtener todos los vehículos
router.get('/', async (req, res) => {
    try {
        const vehiculos = await prisma.vehiculo.findMany({
            include: {
                categoriaVehiculo: true
            }
        });
        res.json(vehiculos);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener vehículos' });
    }
});

// Obtener un vehículo por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculo = await prisma.vehiculo.findUnique({
            where: { vehiculoId: Number(id) },
            include: {
                categoriaVehiculo: true
            }
        });
        
        if (vehiculo) {
            res.json(vehiculo);
        } else {
            res.status(404).json({ error: 'Vehículo no encontrado' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el vehículo' });
    }
});

// Crear un nuevo vehículo
router.post('/', async (req, res) => {
    try {
        const nuevoVehiculo = await prisma.vehiculo.create({
            data: req.body
        });
        res.status(201).json(nuevoVehiculo);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al crear el vehículo' });
    }
});

// Actualizar un vehículo
router.patch('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const vehiculoActualizado = await prisma.vehiculo.update({
            where: { vehiculoId: Number(id) },
            data: req.body
        });
        res.json(vehiculoActualizado);
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al actualizar el vehículo' });
    }
});

// Eliminar un vehículo
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await prisma.vehiculo.delete({
            where: { vehiculoId: Number(id) }
        });
        res.status(204).send();
    } catch (error) {
        console.error(error);
        res.status(400).json({ error: 'Error al eliminar el vehículo' });
    }
});

export default router;
