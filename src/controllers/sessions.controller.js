import { sessionsService } from '../services/sessions.service.js';

export const register = async (req, res) => {
    try {
        const user = await sessionsService.registerUser(req.body);

        return res.status(201).json({
            status: 'success',
            payload: {
                id: user._id,
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        const statusCode = error.statusCode || 500;
        return res.status(statusCode).json({
            status: 'error',
            message: error.message || 'Error interno del servidor'
        });
    }
};