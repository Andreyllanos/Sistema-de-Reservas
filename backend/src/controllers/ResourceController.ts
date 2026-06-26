import type { Request, Response } from 'express';
import { ResourceService } from '../services/ResourceService';

export class ResourceController {
  constructor(private readonly resourceService = new ResourceService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const resources = await this.resourceService.list(typeof req.query.search === 'string' ? req.query.search : '');
      res.json(resources);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const resource = await this.resourceService.getById(Number(req.params.id));
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado.' });
        return;
      }
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const resource = await this.resourceService.create(req.body);
      res.status(201).json(resource);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const resource = await this.resourceService.update(Number(req.params.id), req.body);
      if (!resource) {
        res.status(404).json({ error: 'Recurso no encontrado.' });
        return;
      }
      res.json(resource);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.resourceService.delete(Number(req.params.id));
      res.json({ ok: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };
}
