import { Router } from 'express';
import { register } from '../controllers/sessions.controller.js';

const router = Router();

// POST /api/sessions/register
router.post('/register', register);

export default router;