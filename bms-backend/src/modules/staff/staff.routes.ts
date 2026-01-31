import { Router } from 'express';
import staffController from './staff.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', staffController.getAll.bind(staffController));
router.post('/invite', isAdmin, staffController.invite.bind(staffController));
router.get('/role/:role', staffController.getByRole.bind(staffController));
router.get('/:id', staffController.getById.bind(staffController));
router.patch('/:id/role', isAdmin, staffController.updateRole.bind(staffController));
router.delete('/:id', isAdmin, staffController.deactivate.bind(staffController));

export default router;
