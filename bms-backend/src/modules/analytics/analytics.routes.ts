import { Router } from 'express';
import analyticsController from './analytics.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/org/stats', analyticsController.getOrgStats.bind(analyticsController));
router.get('/category/:categoryId', analyticsController.getCategoryStats.bind(analyticsController));
router.get('/building/:buildingId', analyticsController.getBuildingStats.bind(analyticsController));
router.get('/trend/:categoryId', analyticsController.getReadingTrend.bind(analyticsController));
router.get('/staff/performance', analyticsController.getStaffPerformance.bind(analyticsController));

export default router;
