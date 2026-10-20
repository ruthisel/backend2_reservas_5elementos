import app from './app.js';
import dotenv from 'dotenv';
import { connectDB } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 8080;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`[BACKEND2_RESERVAS_5ELEMENTOS] Servidor corriendo en http://localhost:${PORT}`);
    });
});