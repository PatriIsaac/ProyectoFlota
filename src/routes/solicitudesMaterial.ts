import { Router } from 'express';
import { prisma } from '../server';

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.solicitudMaterial.findMany({
            include: { 
                OrdenServicio: { include: { Vehiculo: true, Taller: true } }, 
                DetalleSolicitud: { include: { Material: true } } 
            },
            orderBy: { fecha: 'desc' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener solicitudes' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { numero, ordenId, fecha, estado, detalles } = req.body;
        // detalles = [{ materialId, cantidad }]
        
        const nuevo = await prisma.solicitudMaterial.create({
            data: {
                numero,
                ordenId: Number(ordenId),
                fecha: new Date(fecha),
                estado: estado || 'Pendiente',
                DetalleSolicitud: {
                    create: detalles.map((d: any) => ({
                        materialId: Number(d.materialId),
                        cantidad: Number(d.cantidad)
                    }))
                }
            },
            include: { 
                OrdenServicio: { include: { Vehiculo: true, Taller: true } }, 
                DetalleSolicitud: { include: { Material: true } } 
            }
        });
        res.status(201).json(nuevo);
    } catch (error) {
        console.error("Error creating solicitud:", error);
        res.status(400).json({ error: 'Error al crear solicitud', details: error });
    }
});

router.patch('/:id/estado', async (req, res) => {
    try {
        const solicitudId = Number(req.params.id);
        const { estado } = req.body;
        
        const solicitud = await prisma.solicitudMaterial.findUnique({
            where: { solicitudId },
            include: { DetalleSolicitud: true }
        });

        if (estado === 'APROBADA' && solicitud?.estado !== 'APROBADA') {
            for (const det of solicitud.DetalleSolicitud) {
                await prisma.material.update({
                    where: { materialId: det.materialId },
                    data: { stockActual: { decrement: det.cantidad } }
                });
            }
        }

        const actualizado = await prisma.solicitudMaterial.update({
            where: { solicitudId },
            data: { estado }
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar estado' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const solicitudId = Number(req.params.id);
        // Borrado en cascada manual de los detalles o borrado lógico (si hubiera campo activo)
        // SolicitudMaterial no tiene "activo" según schema.prisma, hacemos delete real
        await prisma.detalleSolicitud.deleteMany({ where: { solicitudId } });
        await prisma.solicitudMaterial.delete({ where: { solicitudId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar solicitud' });
    }
});

export default router;
