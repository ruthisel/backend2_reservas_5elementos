import { Router } from 'express';

const router = Router();

// Estructura base para sesiones (sin lógica de auth por ahora y espero llgar)
router.get('/', (req, res) => {
    res.status(200).json({ status: 'success', message: 'Ruta de sesiones de 5Elementos' });
});

export default router;