import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.material.findMany({
            where: { activo: true },
            orderBy: { codigo: 'asc' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener materiales' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { codigo, nombre, unidad, stockActual, stockMinimo, costoUnitario } = req.body;
        
        // Verificar si ya existe el código
        const existente = await prisma.material.findUnique({ where: { codigo } });
        
        if (existente) {
            if (existente.activo) {
                return res.status(400).json({ error: 'El código de material ya existe' });
            } else {
                // Reactivar y actualizar
                const reactivado = await prisma.material.update({
                    where: { codigo },
                    data: {
                        nombre,
                        unidad,
                        stockActual: Number(stockActual) || 0,
                        stockMinimo: Number(stockMinimo) || 0,
                        costoUnitario: Number(costoUnitario) || 0,
                        activo: true
                    }
                });
                return res.status(200).json(reactivado);
            }
        }

        const data = { 
            codigo, 
            nombre, 
            unidad, 
            stockActual: Number(stockActual) || 0,
            stockMinimo: Number(stockMinimo) || 0,
            costoUnitario: Number(costoUnitario) || 0
        };
        const nuevo = await prisma.material.create({ data });
        res.status(201).json(nuevo);
    } catch (error: any) {
        console.error("Error creating material:", error);
        res.status(400).json({ error: error.message || 'Error al crear material', details: error });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const materialId = Number(req.params.id);
        const actualizado = await prisma.material.update({
            where: { materialId },
            data: req.body
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar material' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const materialId = Number(req.params.id);
        await prisma.material.update({
            where: { materialId },
            data: { activo: false }
        });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar material' });
    }
});

export default router;
