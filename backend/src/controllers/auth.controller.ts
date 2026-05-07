import { Request, Response } from 'express';
import { z } from 'zod';
import { AuthService } from '../services/auth.service';

export const AuthController = {
    async register(req: Request, res: Response) {
        try {
            const registerSchema = z.object({
                name: z.string().min(2, { error: 'O nome deve ter pelo menos 2 caracteres' }),
                email: z.email({ error: 'Formato de e-mail inválido' }),
                password: z.string().min(5, { error: 'A senha deve ter no mínimo 5 caracteres' }),
            });

            const data = registerSchema.parse(req.body);
            const user = await AuthService.register(data);

            res.status(201).json(user);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                const errorMessage = error.issues?.[0]?.message ?? 'Dados inválidos fornecidos.';
                res.status(400).json({ error: errorMessage });
                return;
              }
              
              res.status(400).json({ error: error?.message ?? 'Erro interno ao processar cadastro.' });
        }
    },

    async login(req: Request, res: Response) {
        try {
            const loginSchema = z.object({
                email: z.email({ error: 'Formato de e-mail inválido' }),
                password: z.string().min(1, { error: 'A senha é obrigatória' }),
            });

            const data = loginSchema.parse(req.body);
            const result = await AuthService.login(data);

            res.status(200).json(result);
        } catch (error: any) {
            if (error instanceof z.ZodError) {
                res.status(400).json({ error: error.issues?.[0]?.message ?? 'Dados inválidos fornecidos.' });
                return;
              }
              
              res.status(401).json({ error: error?.message ?? 'Credenciais inválidas.' });
        }
    },
};
