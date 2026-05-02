import { Router } from 'express';
import { register, login, refresh, logout, me, verifyEmail, forgotPassword, resetPassword } from '../controllers/auth';
import { authenticateJWT } from '../middleware/auth';
import passport from 'passport';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

// Protected routes
router.post('/refresh', refresh);
router.post('/logout', authenticateJWT, logout);
router.get('/me', authenticateJWT, me);

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', 
  passport.authenticate('google', { session: false, failureRedirect: '/login' }),
  (req, res) => {
    const user: any = req.user;
    if (!user) return res.redirect('/login');
    
    const { generateTokens } = require('../utils/jwt');
    const { accessToken, refreshToken } = generateTokens(user.id);
    
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    res.redirect(`${process.env.CORS_ORIGIN}/app?accessToken=${accessToken}`);
  }
);

export default router;
