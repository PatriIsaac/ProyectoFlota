import { Router } from 'express';
import { prisma } from '../server';
import multer from 'multer';
import fs from 'fs';
import path from 'path';

// Configurar multer para guardar archivos en uploads/documentos
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = 'uploads/documentos';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

const router = Router();

router.get('/', async (req, res) => {
    try {
        const data = await prisma.documentoPersonal.findMany({
            include: { Conductor: true },
            orderBy: { vigencia: 'asc' }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener documentos' });
    }
});

router.post('/', upload.single('archivo'), async (req, res) => {
    try {
        const data = { ...req.body };
        if (data.conductorId) data.conductorId = Number(data.conductorId);
        if (data.vigencia) data.vigencia = new Date(data.vigencia);
        if (data.fechaSubida) data.fechaSubida = new Date(data.fechaSubida);
        
        // Evitar que el campo de archivo interfiera con Prisma
        delete data.archivo;
        
        let archivoUrl = null;
        let nombreArchivo = null;
        if (req.file) {
            archivoUrl = `/uploads/documentos/${req.file.filename}`;
            nombreArchivo = req.file.originalname;
        }
        
        const nuevo = await prisma.documentoPersonal.create({ 
            data: { ...data, archivoUrl, nombreArchivo } 
        });
        res.status(201).json(nuevo);
    } catch (error: any) {
        console.error("Error creating documento:", error);
        res.status(400).json({ error: error.message || 'Error al crear documento', details: error });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        const documentoId = Number(req.params.id);
        const doc = await prisma.documentoPersonal.findUnique({ where: { documentoId } });
        
        if (doc?.archivoUrl) {
            const filePath = path.join(process.cwd(), doc.archivoUrl);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.documentoPersonal.delete({ where: { documentoId } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar documento' });
    }
});

export default router;
