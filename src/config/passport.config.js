import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { usersRepository } from '../repositories/users.repository.js';
import { createHash, isValidPassword } from '../utils/hash.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

// Extractor personalizado para obtener el token desde la cookie 'currentUser'
const cookieExtractor = (req) => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['currentUser'];
    }
    return token;
};

export const initializePassport = () => {
    // 1. Estrategia de Registro ('register')
    passport.use(
        'register',
        new LocalStrategy(
            { usernameField: 'email', passReqToCallback: true },
            async (req, email, password, done) => {
                try {
                    const { first_name, last_name } = req.body;

                    if (!first_name || !last_name || !email || !password) {
                        return done(null, false, { message: 'Faltan campos obligatorios' });
                    }

                    const normalizedEmail = email.trim().toLowerCase();
                    const existingUser = await usersRepository.findByEmail(normalizedEmail);

                    if (existingUser) {
                        return done(null, false, { message: 'El email ya está registrado' });
                    }

                    const newUser = await usersRepository.createUser({
                        first_name: first_name.trim(),
                        last_name: last_name.trim(),
                        email: normalizedEmail,
                        password: createHash(password),
                        role: 'user'
                    });

                    return done(null, newUser);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // 2. Estrategia de Login ('login')
    passport.use(
        'login',
        new LocalStrategy(
            { usernameField: 'email' },
            async (email, password, done) => {
                try {
                    if (!email || !password) {
                        return done(null, false, { message: 'Credenciales inválidas' });
                    }

                    const normalizedEmail = email.trim().toLowerCase();
                    const user = await usersRepository.findByEmail(normalizedEmail);

                    if (!user) {
                        return done(null, false, { message: 'Credenciales inválidas' });
                    }

                    const isPasswordValid = isValidPassword(password, user.password);
                    if (!isPasswordValid) {
                        return done(null, false, { message: 'Credenciales inválidas' });
                    }

                    return done(null, user);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );

    // 3. Estrategia Current ('current') mediante JWT
    passport.use(
        'current',
        new JWTStrategy(
            {
                jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
                secretOrKey: process.env.JWT_SECRET || 'secreto_fallback_jwt'
            },
            async (jwt_payload, done) => {
                try {
                    return done(null, jwt_payload);
                } catch (error) {
                    return done(error);
                }
            }
        )
    );
};