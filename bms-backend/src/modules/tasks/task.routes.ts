import { Router } from 'express';
import taskController from './task.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isSupervisorOrAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', isSupervisorOrAdmin, taskController.create.bind(taskController));
router.get('/available-for-reading', taskController.getAvailableTasksForReading.bind(taskController));
router.get('/', taskController.getAll.bind(taskController));
router.get('/my-tasks', taskController.getMyTasks.bind(taskController));
router.get('/:id', taskController.getById.bind(taskController));
router.patch('/:id', isSupervisorOrAdmin, taskController.update.bind(taskController));
router.delete('/:id', isSupervisorOrAdmin, taskController.delete.bind(taskController));
router.post('/:id/assign', isSupervisorOrAdmin, taskController.assignUsers.bind(taskController));

export default router;
