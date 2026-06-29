import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prisma } from '../server';

const router = Router();
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_fleet';

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const usuario = await prisma.usuario.findUnique({ 
            where: { email },
            include: { Rol: true }
        });
        if (!usuario) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const isValid = await bcrypt.compare(password, usuario.password);
        if (!isValid) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign({ id: usuario.usuarioId, rol: usuario.Rol?.nombre }, JWT_SECRET, { expiresIn: '1d' });
        
        res.json({ 
            user: { 
                id: usuario.usuarioId, 
                nombre: `${usuario.nombres} ${usuario.apellidos}`, 
                email: usuario.email, 
                rol: usuario.Rol?.nombre 
            }, 
            token 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});

export default router;
