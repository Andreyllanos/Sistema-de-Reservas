import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';

import authRoutes from './routes/authRoutes';
import resourceRoutes from './routes/resourceRoutes';
import reservationRoutes from './routes/reservationRoutes';

import { DashboardController } from './controllers/DashboardController';
import { authMiddleware } from './middlewares/auth';

dotenv.config();

const app = express();
const dashboardController = new DashboardController();

app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/reservations', reservationRoutes);

app.get(
  '/api/dashboard',
  authMiddleware,
  dashboardController.stats
);

// Ruta inexistente
app.use((_req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada.',
  });
});

// Error global
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);

  res.status(500).json({
    error: 'Error interno del servidor.',
  });
});

export default app;