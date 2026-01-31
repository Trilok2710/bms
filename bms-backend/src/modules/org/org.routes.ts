import { Router } from 'express';
import orgController from './org.controller';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { isAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authMiddleware);

router.get('/', orgController.getDetails.bind(orgController));
router.get('/users', orgController.getUsers.bind(orgController));
router.get('/invite-code', orgController.getInviteCode.bind(orgController));
router.post('/invite-code', isAdmin, orgController.regenerateInviteCode.bind(orgController));
router.delete('/users/:userId', isAdmin, orgController.deactivateUser.bind(orgController));

export default router;
