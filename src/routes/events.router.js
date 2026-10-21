import { Router } from 'express';
import { handleAuth } from '../middlewares/auth.middleware.js';
import { authorizeRoles } from '../middlewares/authorize.middleware.js';
import { createEvent, updateEvent } from '../controllers/events.controller.js';

const router = Router();

// Endpoint de creación: requiere autenticación y rol 'organizer' o 'admin'
router.post(
    '/',
    handleAuth,
    authorizeRoles('organizer', 'admin'),
    createEvent
);

// Endpoint de edicion con propiedad de recurso
router.put(
    '/:id',
    handleAuth,
    authorizeRoles('organizer', 'admin'),
    updateEvent
);

export default router;