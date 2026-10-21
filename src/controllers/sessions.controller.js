import { generateToken } from '../utils/jwt.js';

const COOKIE_NAME = 'currentUser';

const getCookieOptions = () => ({
    httpOnly: true,
    sameSite: 'lax',
    maxAge: 3600000, // 1 hora
    secure: process.env.NODE_ENV === 'production'
});

export const registerUser = async (req, res) => {
    // req.user es inyectado por la estrategia 'register' de Passport
    const user = req.user.toObject ? req.user.toObject() : { ...req.user };
    delete user.password;

    return res.status(201).json({
        status: 'success',
        payload: {
            id: user._id || user.id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            role: user.role
        }
    });
};

export const loginUser = async (req, res) => {
    // req.user es inyectado por la estrategia 'login' de Passport
    const tokenPayload = {
        id: req.user._id || req.user.id,
        email: req.user.email,
        role: req.user.role || 'user'
    };

    const token = generateToken(tokenPayload);

    res.cookie(COOKIE_NAME, token, getCookieOptions());
    return res.status(200).json({ status: 'success', message: 'Login correcto' });
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