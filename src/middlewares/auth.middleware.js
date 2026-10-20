import { verifyToken } from '../utils/jwt.js';

export const authToken = (req, res, next) => {
    const token = req.cookies?.currentUser;

    if (!token) {
        return res.status(401).json({ status: 'error', message: 'No autenticado' });
    }

    const decoded = verifyToken(token);
    if (!decoded) {
        return res.status(401).json({ status: 'error', message: 'Token inválido o expirado' });
    }

    req.user = decoded;
    next();
};