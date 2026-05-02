import { Router } from 'express';
import { createTeam, getTeam, inviteMember, removeMember } from '../controllers/team';
import { authenticateJWT } from '../middleware/auth';
import { requireTeamAndRole } from '../middleware/team';

const router = Router();

// All team routes require authentication
router.use(authenticateJWT);

router.post('/', createTeam);
router.get('/:id', requireTeamAndRole('Member'), getTeam);
router.post('/:id/invite', requireTeamAndRole('Admin'), inviteMember);
router.delete('/:id/members/:uid', requireTeamAndRole('Admin'), removeMember);

export default router;
