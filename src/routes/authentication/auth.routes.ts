import { Router } from 'express';
import { AuthController } from '../../controllers/authentication/auth.controller';
import { authenticateToken } from '../../middleware/auth';

const router = Router();
const authController = new AuthController();

// Public routes
router.post('/register', (req, res) => authController.register(req, res));
router.post('/login', (req, res) => authController.login(req, res));
router.post('/refresh', (req, res) => authController.refresh(req, res));
router.post('/logout', (req, res) => authController.logout(req, res));

// Protected routes
router.post('/link-gmail', authenticateToken, (req, res) => authController.linkGmail(req as any, res));

export default router;

