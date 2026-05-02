import { Router } from 'express';
import { checkout, portal } from '../controllers/billing';
import { authenticateJWT } from '../middleware/auth';

const router = Router();

// Protected routes
router.post('/checkout', authenticateJWT, checkout);
router.post('/portal', authenticateJWT, portal);

export default router;
