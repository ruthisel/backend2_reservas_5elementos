import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import {
    createTicket,
    getMyTickets,
    getEventTickets,
    cancelTicket
} from '../controllers/tickets.controller.js';

const router = Router();

const passportCustom = (strategy) => {
    return (req, res, next) => {
        passport.authenticate(strategy, { session: false }, (err, user) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({ status: 'error', message: 'No autenticado' });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};

// POST /api/events/:eid/tickets -> Inscribirse a evento
router.post('/events/:eid/tickets', passportCustom('current'), createTicket);

// GET /api/tickets/my-tickets -> Mis inscripciones
router.get('/tickets/my-tickets', passportCustom('current'), getMyTickets);

// GET /api/events/:eid/tickets -> Inscripciones de un evento (organizer u admin)
router.get(
    '/events/:eid/tickets',
    passportCustom('current'),
    authorizeRoles('organizer', 'admin'),
    getEventTickets
);

// PATCH /api/tickets/:tid/cancel -> Cancelar ticket
router.patch('/tickets/:tid/cancel', passportCustom('current'), cancelTicket);

export default router;