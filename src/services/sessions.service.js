import { usersRepository } from '../repositories/users.repository.js';
import { createHash } from '../utils/hash.js';

class SessionsService {
    async registerUser({ first_name, last_name, email, password }) {
        // 1. Validar presencia de campos obligatorios
        if (!first_name || !last_name || !email || !password) {
            const error = new Error('Faltan campos obligatorios');
            error.statusCode = 400;
            throw error;
        }

        // 2. Normalizar email (trim + lowercase)
        const normalizedEmail = email.trim().toLowerCase();

        // 3. Validar formato de email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(normalizedEmail)) {
            const error = new Error('El formato del email es inválido');
            error.statusCode = 400;
            throw error;
        }

        // 4. Validar longitud mínima de contraseña (ej. 6 caracteres)
        if (password.length < 6) {
            const error = new Error('La contraseña debe tener al menos 6 caracteres');
            error.statusCode = 400;
            throw error;
        }

        // 5. Verificar si el usuario ya existe
        const existingUser = await usersRepository.findByEmail(normalizedEmail);
        if (existingUser) {
            const error = new Error('El email ya está registrado');
            error.statusCode = 409;
            throw error;
        }

        // 6. Hashear la contraseña
        const hashedPassword = createHash(password);

        // 7. Guardar usuario (forzando rol "user" por defecto, ignora roles enviados por el body)
        const newUser = await usersRepository.createUser({
            first_name: first_name.trim(),
            last_name: last_name.trim(),
            email: normalizedEmail,
            password: hashedPassword,
            role: 'user'
        });

        // 8. Convertir a objeto JS y eliminar el password antes de retornar
        const userResponse = newUser.toObject();
        delete userResponse.password;

        return userResponse;
    }
}

export const sessionsService = new SessionsService();