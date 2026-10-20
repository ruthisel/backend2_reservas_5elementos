import { sessionsService } from '../services/sessions.service.js';

const COOKIE_NAME = 'currentUser';

const getCookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600000, // 1 hora en ms
    secure: process.env.NODE_ENV === 'production'
});

export const registerUser = async (req, res, next) => {
    try {
        const user = await sessionsService.register(req.body);
        res.status(201).json({ status: 'success', payload: user });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req, res, next) => {
    try {
        const { token } = await sessionsService.login(req.body);

        res.cookie(COOKIE_NAME, token, getCookieOptions());
        return res.status(200).json({ status: 'success', message: 'Login correcto' });
    } catch (error) {
        if (error.message === 'INVALID_CREDENTIALS') {
            return res.status(401).json({ status: 'error', message: 'Credenciales inválidas' });
        }
        next(error);
    }
};

export const getCurrentUser = async (req, res) => {
    return res.status(200).json({
        status: 'success',
        payload: {
            id: req.user.id,
            email: req.user.email,
            role: req.user.role
        }
    });
};

export const logoutUser = async (req, res) => {
    res.clearCookie(COOKIE_NAME, getCookieOptions());
    return res.status(200).json({ status: 'success', message: 'Sesión cerrada' });
};