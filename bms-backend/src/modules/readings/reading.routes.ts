import { Router } from 'express';
import readingController from './reading.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isSupervisorOrAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.post('/', readingController.submit.bind(readingController));
router.get('/', readingController.getAll.bind(readingController));
router.get('/pending', isSupervisorOrAdmin, readingController.getPending.bind(readingController));
router.get('/my-history', readingController.getMyHistory.bind(readingController));
router.get('/category/:buildingId/:categoryId', readingController.getByCategory.bind(readingController));

router.post('/:id/approve', isSupervisorOrAdmin, readingController.approve.bind(readingController));
router.post('/:id/reject', isSupervisorOrAdmin, readingController.reject.bind(readingController));
router.post('/:id/comments', readingController.addComment.bind(readingController));

export default router;
