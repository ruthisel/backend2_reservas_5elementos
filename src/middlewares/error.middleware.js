export const errorHandler = (err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Error interno del servidor';

    return res.status(statusCode).json({
        status: 'error',
        message
    });
};