import { prisma } from '../lib/prisma';
import Big from 'big.js';
import type { Campaign } from '@prisma/client';

export interface CampaignDto {
    id: string;
    name: string;
    cost: number;
    revenue: number;
    tax: number;
    expense: number;
    grossProfit: number;
    profit: number;
    roas: number;
}

interface CreateCampaignParams {
    name: string;
    cost: number;
    revenue: number;
    tax?: number;
    expense?: number;
}

function toDto(campaign: Campaign): CampaignDto {
    const { id, name, cost, revenue } = campaign;
    
    const tax = campaign.tax ?? 0;
    const expense = campaign.expense ?? 0;

    const bigRevenue = new Big(revenue);
    const bigCost = new Big(cost);

    const grossProfit = bigRevenue.minus(bigCost).toNumber();
    const profit = bigRevenue.minus(bigCost).minus(tax).minus(expense).toNumber();

    const roas = cost > 0 ? bigRevenue.div(cost).toNumber() : 0;

    return {
        id,
        name,
        cost,
        revenue,
        tax,
        expense,
        grossProfit,
        profit,
        roas,
    };
}

export const CampaignService = {
    async create(data: CreateCampaignParams) {
        const campaign = await prisma.campaign.create({
            data: {
                ...data,
                tax: data.tax ?? 0,
                expense: data.expense ?? 0,
            },
        });

        return toDto(campaign);
    },

    async listAll(): Promise<CampaignDto[]> {
        const campaigns = await prisma.campaign.findMany();
        return campaigns.map(toDto);
    },

    async delete(id: string) {
        try {
            await prisma.campaign.delete({
                where: { id },
            });

            return { message: 'Campanha removida com sucesso.' };
        } catch (error: any) {
            if (error.code === 'P2025') {
                throw new Error('Campanha não encontrada.');
            }
            throw error;
        }
    },
};
