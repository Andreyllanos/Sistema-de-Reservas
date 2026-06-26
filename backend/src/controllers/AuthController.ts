import type { Request, Response } from 'express';
import { AuthService } from '../services/AuthService';

export class AuthController {
  constructor(private readonly authService = new AuthService()) {}

  register = async (req: Request, res: Response): Promise<void> => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json(result);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        res.status(400).json({ error: 'Correo y contraseña obligatorios.' });
        return;
      }
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      res.status(401).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };

  profile = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await this.authService.profile((req as any).user?.userId);
      if (!user) {
        res.status(404).json({ error: 'Usuario no encontrado.' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(400).json({ error: error instanceof Error ? error.message : 'Error desconocido.' });
    }
  };
}
