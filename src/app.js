import express from 'express';
import cookieParser from 'cookie-parser';
import sessionsRouter from './routes/sessions.router.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser()); // Middleware para procesar req.cookies

app.use('/api/sessions', sessionsRouter);

export default app;