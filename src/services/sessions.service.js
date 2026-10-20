import { usersRepository } from '../repositories/users.repository.js';
import { isValidPassword } from '../utils/hash.js';
import { generateToken } from '../utils/jwt.js';

class SessionsService {
    async register(userData) {
        // Mantener la lógica de registro implementada en Pre-entrega 2
        return await usersRepository.createUser(userData);
    }

    async login({ email, password }) {
        if (!email || !password) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const normalizedEmail = email.trim().toLowerCase();
        const user = await usersRepository.findByEmail(normalizedEmail);

        if (!user) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const isPasswordValid = isValidPassword(password, user.password);
        if (!isPasswordValid) {
            throw new Error('INVALID_CREDENTIALS');
        }

        const tokenPayload = {
            id: user._id || user.id,
            email: user.email,
            role: user.role || 'user'
        };

        const token = generateToken(tokenPayload);
        return { token, payload: tokenPayload };
    }
}

export const sessionsService = new SessionsService();