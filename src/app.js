import express from 'express';
import cookieParser from 'cookie-parser';
import passport from 'passport';
import { initializePassport } from './config/passport.config.js';
import sessionsRouter from './routes/sessions.router.js';
import eventsRouter from './routes/events.router.js';
import ticketsRouter from './routes/tickets.router.js'; // Importar

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

initializePassport();
app.use(passport.initialize());

app.use('/api/sessions', sessionsRouter);
app.use('/api/events', eventsRouter);
app.use('/api', ticketsRouter); // Montar sobre /api

export default app;