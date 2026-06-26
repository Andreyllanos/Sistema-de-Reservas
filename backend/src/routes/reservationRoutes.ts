import { Router } from 'express';
import { ReservationController } from '../controllers/ReservationController';
import { authMiddleware, requireRole } from '../middlewares/auth';

const router = Router();
const controller = new ReservationController();

router.get('/', authMiddleware, controller.list);
router.get('/:id', authMiddleware, controller.getById);
router.post('/', authMiddleware, requireRole(['admin', 'usuario']), controller.create);
router.put('/:id', authMiddleware, requireRole(['admin', 'usuario']), controller.update);
router.delete('/:id', authMiddleware, requireRole(['admin', 'usuario']), controller.cancel);

export default router;
