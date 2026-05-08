import { Router } from "express";
import { CampaignController } from "../controllers/campaign.controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export const campaignRoutes = Router();

campaignRoutes.use(AuthMiddleware);

campaignRoutes.post('/', CampaignController.create);

campaignRoutes.get('/', CampaignController.listAll);

campaignRoutes.delete('/:id', CampaignController.delete);