import { Router } from 'express';
import authRoutes from '../modules/auth/auth.routes';
import orgRoutes from '../modules/org/org.routes';
import buildingRoutes from '../modules/buildings/building.routes';
import categoryRoutes from '../modules/categories/category.routes';
import taskRoutes from '../modules/tasks/task.routes';
import readingRoutes from '../modules/readings/reading.routes';
import staffRoutes from '../modules/staff/staff.routes';
import analyticsRoutes from '../modules/analytics/analytics.routes';
import notificationRoutes from '../modules/notifications/notification.routes';

const router = Router();

// Health check
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/org', orgRoutes);
router.use('/buildings', buildingRoutes);
router.use('/categories', categoryRoutes);
router.use('/tasks', taskRoutes);
router.use('/readings', readingRoutes);
router.use('/staff', staffRoutes);
router.use('/analytics', analyticsRoutes);
router.use('/notifications', notificationRoutes);

export default router;
