import { Router } from 'express';
import { ResourceController } from '../controllers/ResourceController';
import { authMiddleware, requireRole } from '../middlewares/auth';

const router = Router();
const controller = new ResourceController();

router.get('/', controller.list);
router.get('/:id', controller.getById);
router.post('/', authMiddleware, requireRole('admin'), controller.create);
router.put('/:id', authMiddleware, requireRole('admin'), controller.update);
router.delete('/:id', authMiddleware, requireRole('admin'), controller.delete);

export default router;
