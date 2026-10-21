import { EventModel } from '../models/Event.js';

export const updateEvent = async (req, res, next) => {
    try {
        const { id } = req.params;
        const event = await EventModel.findById(id);

        if (!event) {
            return res.status(404).json({ status: 'error', message: 'Evento no encontrado' });
        }

        // Un organizador solo puede editar sus propios eventos; admin puede editar todos
        if (req.user.role !== 'admin' && event.organizer.toString() !== req.user.id) {
            return res.status(403).json({
                status: 'error',
                message: 'No tienes permisos para modificar este evento'
            });
        }

        const updatedEvent = await EventModel.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ status: 'success', payload: updatedEvent });
    } catch (error) {
        next(error);
    }
};