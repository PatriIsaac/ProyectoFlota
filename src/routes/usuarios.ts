import { Router } from 'express';
import bcrypt from 'bcrypt';
import { prisma } from '../server';
import { requireRole } from '../middleware/auth';

const router = Router();

// Gestión de usuarios y roles es sensible (incluye asignar privilegios): solo Administrador.
router.use(requireRole('Administrador'));

// ========================== ROLES ==========================
router.get('/roles', async (req, res) => {
    try {
        const roles = await prisma.rol.findMany();
        res.json(roles);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener roles' });
    }
});

router.post('/roles', async (req, res) => {
    try {
        const { nombre, descripcion } = req.body;
        const nuevo = await prisma.rol.create({ data: { nombre, descripcion } });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear rol' });
    }
});

router.delete('/roles/:id', async (req, res) => {
    try {
        await prisma.rol.update({ where: { rolId: Number(req.params.id) }, data: { estado: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar rol' });
    }
});

// ========================== USUARIOS ==========================
router.get('/', async (req, res) => {
    try {
        const data = await prisma.usuario.findMany({
            select: { 
                usuarioId: true, 
                nombres: true, 
                apellidos: true, 
                email: true, 
                estado: true,
                rolId: true,
                Rol: true 
            }
        });
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Error' });
    }
});

router.post('/', async (req, res) => {
    try {
        const { nombres, apellidos, email, password, rolId, estado } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const nuevo = await prisma.usuario.create({
            data: { 
                nombres, 
                apellidos, 
                email, 
                password: hashedPassword, 
                rolId: Number(rolId),
                estado: estado !== undefined ? estado : true
            }
        });
        res.status(201).json(nuevo);
    } catch (error) {
        res.status(400).json({ error: 'Error al crear usuario' });
    }
});

router.patch('/:id', async (req, res) => {
    try {
        const { nombres, apellidos, email, password, rolId, estado } = req.body;
        const dataToUpdate: any = { nombres, apellidos, email, estado };
        if (rolId !== undefined) dataToUpdate.rolId = Number(rolId);
        if (password) {
            dataToUpdate.password = await bcrypt.hash(password, 10);
        }
        const actualizado = await prisma.usuario.update({
            where: { usuarioId: Number(req.params.id) },
            data: dataToUpdate
        });
        res.json(actualizado);
    } catch (error) {
        res.status(400).json({ error: 'Error al actualizar' });
    }
});

router.delete('/:id', async (req, res) => {
    try {
        await prisma.usuario.update({ where: { usuarioId: Number(req.params.id) }, data: { estado: false } });
        res.status(204).send();
    } catch (error) {
        res.status(400).json({ error: 'Error al eliminar' });
    }
});

export default router;
