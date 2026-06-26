import type { Request, Response } from 'express';
import { DashboardService } from '../services/DashboardService';

export class DashboardController {
  constructor(private readonly dashboardService = new DashboardService()) {}

  stats = async (_req: Request, res: Response): Promise<void> => {
    try {
      const stats = await this.dashboardService.getStats();
      res.json(stats);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };
}
