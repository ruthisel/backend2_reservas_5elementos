import { Router } from 'express';
import passport from 'passport';
import { registerUser, loginUser, getCurrentUser, logoutUser } from '../controllers/sessions.controller.js';

const router = Router();

// Middleware de autenticación personalizada para manejar respuestas JSON estructuradas
const passportCustom = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                const statusCode = strategy === 'register' && info?.message === 'El email ya está registrado' ? 409 : 401;
                return res.status(info?.message === 'Faltan campos obligatorios' ? 400 : statusCode).json({
                    status: 'error',
                    message: info?.message || 'No autorizado'
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

router.post('/register', passportCustom('register'), registerUser);
router.post('/login', passportCustom('login'), loginUser);
router.get('/current', passportCustom('current'), getCurrentUser);
router.post('/logout', logoutUser);

export default router;