import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../lib/prisma';

interface RegisterParams {
    name: string;
    email: string;
    password: string;
}

interface LoginParams {
    email: string;
    password: string;
}

export const AuthService = {
    async register(data: RegisterParams) {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        })

        if (existingUser) {
            throw new Error('E-mail já cadastrado.');
        }

        const passwordHash = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                name: data.name,
                email: data.email,
                password: passwordHash,
            },
        });

        return user;
    },

    async login(data: LoginParams) {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        })

        if (!user) {
            throw new Error('Credenciais inválidas.');
        }

        const isPasswordValid = await bcrypt.compare(data.password, user.password);

        if (!isPasswordValid) {
            throw new Error('Credenciais inválidas.');
        }

        const secret = process.env.JWT_SECRET;

        if (!secret) {
            throw new Error('FATAL ERROR: JWT_SECRET não está definido nas variáveis de ambiente.');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email }, 
            secret, 
            { expiresIn: '1d' }
        );

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
            },
            token,
        };
    }
}