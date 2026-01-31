import { Router } from 'express';
import categoryController from './category.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/buildings/:buildingId/categories', isAdmin, categoryController.create.bind(categoryController));
router.get('/buildings/:buildingId/categories', categoryController.getByBuilding.bind(categoryController));
router.patch('/categories/:id', isAdmin, categoryController.update.bind(categoryController));
router.delete('/categories/:id', isAdmin, categoryController.delete.bind(categoryController));

export default router;
