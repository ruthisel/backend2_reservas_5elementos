import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/sessions.controller.js';
import { authToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/current', authToken, getCurrentUser);
router.post('/logout', logoutUser);

export default router;