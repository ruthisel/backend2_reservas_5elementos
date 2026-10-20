import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL);
        console.log('[Database] Conexión a MongoDB Atlas establecida con éxito.');
    } catch (error) {
        console.error(`[Database Error] Error al conectar a MongoDB: ${error.message}`);
        process.exit(1);
    }
};