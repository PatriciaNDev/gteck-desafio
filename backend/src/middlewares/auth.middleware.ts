import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
declare global {
    namespace Express {
        interface Request {
            user?: string | jwt.JwtPayload;
        }
    }
}

export const AuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        res.status(401).json({ error: 'Token não fornecido.' });
        return;
    }

    const [, token] = authHeader.split(' ');

    if (!token) {
        res.status(401).json({ error: 'Token mal formatado.' });
        return;
    }

    const secret = process.env.JWT_SECRET;
    
    if (!secret) {
        res.status(500).json({ error: 'Erro interno de configuração do servidor.' });
        return;
    }

    try {
        const decoded = jwt.verify(token, secret);
        
        req.user = decoded;

        return next();
    } catch (error: unknown) {
        res.status(401).json({ error: 'Token inválido ou expirado.' });
        return;
    }
};
