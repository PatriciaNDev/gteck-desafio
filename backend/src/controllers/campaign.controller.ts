import { Request, Response } from 'express';
import { z } from 'zod';
import { CampaignService } from '../services/campaign.service';

const createCampaignSchema = z.object({
    name: z.string({ error: 'O nome é obrigatório' }).min(1, 'O nome não pode estar vazio'),
    cost: z.number({ error: 'O custo é obrigatório' }).gt(0, 'O custo deve ser maior que zero.'),
    revenue: z.number({ error: 'A receita é obrigatória' }).gt(0, 'A receita deve ser maior que zero.'),
    tax: z.number({ error: 'As taxas devem ser um número' }).min(0, 'As taxas não podem ser negativas').optional(),
    expense: z.number({ error: 'As despesas devem ser um número' }).min(0, 'As despesas não podem ser negativas').optional(),
});

const paramsSchema = z.object({
    id: z.string({ error: 'ID da campanha não fornecido.' }),
});

export const CampaignController = {
    async create(req: Request, res: Response) {
        try {
            const data = createCampaignSchema.parse(req.body);
            const campaign = await CampaignService.create(data);

            res.status(201).json(campaign);
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const errorMessage = error.issues?.[0]?.message ?? 'Dados inválidos fornecidos.';
                res.status(400).json({ error: errorMessage });
                return;
            }
            
            const errorMessage = error instanceof Error ? error.message : 'Erro interno ao criar a campanha.';
            res.status(500).json({ error: errorMessage });
        }
    },

    async listAll(req: Request, res: Response) {
        try {
            const campaigns = await CampaignService.listAll();
            res.status(200).json(campaigns);
        } catch (error: unknown) {
            const errorMessage = error instanceof Error ? error.message : 'Erro interno ao listar as campanhas.';
            res.status(500).json({ error: errorMessage });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const { id } = paramsSchema.parse(req.params);

            const result = await CampaignService.delete(id);

            res.status(200).json(result);
        } catch (error: unknown) {
            if (error instanceof z.ZodError) {
                const errorMessage = error.issues?.[0]?.message ?? 'ID da campanha inválido.';
                res.status(400).json({ error: errorMessage });
                return;
            }

            const errorMessage = error instanceof Error ? error.message : 'Erro interno ao remover a campanha.';
            const statusCode = errorMessage === 'Campanha não encontrada.' ? 404 : 500;
            
            res.status(statusCode).json({ error: errorMessage });
        }
    }
};
