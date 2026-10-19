import { Router } from 'express';

const router = Router();

// Endpoint GET /api/events para la pre-entrega
router.get('/', (req, res) => {
    res.status(200).json({ status: 'success', payload: [] });
});

export default router;