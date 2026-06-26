import type { Request, Response } from 'express';
import { ReservationService } from '../services/ReservationService';

export class ReservationController {
  constructor(private readonly reservationService = new ReservationService()) {}

  list = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservations = await this.reservationService.list({
        fecha: typeof req.query.fecha === 'string' ? req.query.fecha : undefined,
        estado: typeof req.query.estado === 'string' ? req.query.estado : undefined,
        recurso_id: typeof req.query.recurso_id === 'string' ? req.query.recurso_id : undefined,
      });
      res.json(reservations);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationService.getById(Number(req.params.id));
      if (!reservation) {
        res.status(404).json({ error: 'Reserva no encontrada.' });
        return;
      }
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationService.create({
        ...req.body,
        usuario_id: (req as any).user?.userId,
      });
      res.status(201).json(reservation);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  update = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationService.update(Number(req.params.id), req.body);
      if (!reservation) {
        res.status(404).json({ error: 'Reserva no encontrada.' });
        return;
      }
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  cancel = async (req: Request, res: Response): Promise<void> => {
    try {
      const reservation = await this.reservationService.cancel(Number(req.params.id));
      if (!reservation) {
        res.status(404).json({ error: 'Reserva no encontrada.' });
        return;
      }
      res.json(reservation);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    try {
      await this.reservationService.delete(Number(req.params.id));
      res.json({ ok: true });
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };
}
