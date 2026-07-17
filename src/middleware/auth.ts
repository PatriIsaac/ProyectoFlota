import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_fleet';

export interface AuthRequest extends Request {
    usuario?: { id: number; rol?: string };
}

// Exige un JWT válido (Authorization: Bearer <token>) para continuar.
export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
    const header = req.headers.authorization;
    const token = header?.startsWith('Bearer ') ? header.slice(7) : undefined;
    if (!token) {
        res.status(401).json({ error: 'Token requerido' });
        return;
    }
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { id: number; rol?: string };
        req.usuario = { id: payload.id, rol: payload.rol };
        next();
    } catch {
        res.status(401).json({ error: 'Token inválido o expirado' });
    }
}

// Exige que el usuario autenticado tenga uno de los roles indicados.
export function requireRole(...roles: string[]) {
    return (req: AuthRequest, res: Response, next: NextFunction) => {
        if (!req.usuario?.rol || !roles.includes(req.usuario.rol)) {
            res.status(403).json({ error: 'No autorizado' });
            return;
        }
        next();
    };
}
