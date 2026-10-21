import { eventsRepository } from '../repositories/events.repository.js';

class EventsService {
    async createEvent(eventData, userId) {
        const { title, description, category, date, location, capacity, price } = eventData;

        // Validar campos obligatorios
        if (!title || !description || !category || !date || !location || capacity === undefined || price === undefined) {
            throw { statusCode: 400, message: 'Faltan campos obligatorios' };
        }

        // Validar capacidad y precio
        if (capacity <= 0 || price < 0) {
            throw { statusCode: 400, message: 'La capacidad debe ser mayor a 0 y el precio mayor o igual a 0' };
        }

        // Validar fecha futura
        const eventDate = new Date(date);
        if (isNaN(eventDate.getTime()) || eventDate < new Date()) {
            throw { statusCode: 400, message: 'La fecha del evento debe ser una fecha futura' };
        }

        return await eventsRepository.create({
            ...eventData,
            date: eventDate,
            organizer: userId,
            status: 'draft'
        });
    }

    async getEvents(query) {
        const { page = 1, limit = 10, status, category, location, dateFrom, dateTo, sort } = query;

        const filters = {};
        if (status) filters.status = status;
        if (category) filters.category = category;
        if (location) filters.location = new RegExp(location, 'i');

        if (dateFrom || dateTo) {
            filters.date = {};
            if (dateFrom) filters.date.$gte = new Date(dateFrom);
            if (dateTo) filters.date.$lte = new Date(dateTo);
        }

        const options = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
            sort: sort ? { date: sort === 'asc' ? 1 : -1 } : { date: 1 },
            populate: { path: 'organizer', select: 'first_name last_name email' }
        };

        const result = await eventsRepository.findPaginated(filters, options);

        return {
            data: result.docs,
            page: result.page,
            limit: result.limit,
            total: result.totalDocs,
            totalPages: result.totalPages
        };
    }

    async getEventById(id) {
        const event = await eventsRepository.findById(id);
        if (!event) {
            throw { statusCode: 404, message: 'Evento no encontrado' };
        }
        return event;
    }

    async updateEvent(id, updateData, user) {
        const event = await this.getEventById(id);

        // Permisos de propiedad de recurso
        if (user.role !== 'admin' && event.organizer._id.toString() !== user.id) {
            throw { statusCode: 403, message: 'No tienes permisos para modificar este evento' };
        }

        // No modificar eventos cancelados
        if (event.status === 'cancelled') {
            throw { statusCode: 400, message: 'No se pueden modificar eventos cancelados' };
        }

        return await eventsRepository.update(id, updateData);
    }

    async updateStatus(id, newStatus, user) {
        const event = await this.getEventById(id);

        if (user.role !== 'admin' && event.organizer._id.toString() !== user.id) {
            throw { statusCode: 403, message: 'No tienes permisos para cambiar el estado de este evento' };
        }

        if (event.status === 'cancelled') {
            throw { statusCode: 400, message: 'Los eventos cancelados no pueden cambiar de estado' };
        }

        if (!['draft', 'published', 'cancelled', 'finished'].includes(newStatus)) {
            throw { statusCode: 400, message: 'Estado no válido' };
        }

        return await eventsRepository.update(id, { status: newStatus });
    }
}

export const eventsService = new EventsService();