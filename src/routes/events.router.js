import { Router } from 'express';
import passport from 'passport';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import {
    createEvent,
    getEvents,
    getEventById,
    updateEvent,
    updateEventStatus
} from '../controllers/events.controller.js';

const router = Router();

// Middleware helper de passport
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

router.post('/', passportCustom('current'), authorizeRoles('organizer', 'admin'), createEvent);
router.get('/', getEvents);
router.get('/:id', getEventById);
router.put('/:id', passportCustom('current'), authorizeRoles('organizer', 'admin'), updateEvent);
router.patch('/:id/status', passportCustom('current'), authorizeRoles('organizer', 'admin'), updateEventStatus);

export default router;