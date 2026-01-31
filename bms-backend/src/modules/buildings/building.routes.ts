import { Router } from 'express';
import buildingController from './building.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', isAdmin, buildingController.create.bind(buildingController));
router.get('/', buildingController.getAll.bind(buildingController));
router.get('/:id', buildingController.getById.bind(buildingController));
router.patch('/:id', isAdmin, buildingController.update.bind(buildingController));
router.delete('/:id', isAdmin, buildingController.delete.bind(buildingController));

export default router;
