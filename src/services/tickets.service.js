import crypto from 'crypto';
import { ticketsRepository } from '../repositories/tickets.repository.js';
import { eventsRepository } from '../repositories/events.repository.js';
import { mailService } from './mail.service.js';

class TicketsService {
    async createTicket(eventId, userId, userEmail, quantity = 1) {
        const qty = Number(quantity);
        if (!qty || qty <= 0) {
            throw { statusCode: 400, message: 'La cantidad solicitada debe ser mayor a 0' };
        }

        // 1. Validar que el evento exista
        const event = await eventsRepository.findById(eventId);
        if (!event) {
            throw { statusCode: 404, message: 'Evento no encontrado' };
        }

        // 2. Validar estado del evento
        if (event.status !== 'published') {
            throw { statusCode: 400, message: 'No es posible inscribirse a un evento no publicado' };
        }

        // 3. Validar inscripciones activas duplicadas del mismo usuario
        const existingTicket = await ticketsRepository.findActiveByUserAndEvent(userId, eventId);
        if (existingTicket) {
            throw { statusCode: 409, message: 'Ya posees una inscripción activa para este evento' };
        }

        // 4. Control de cupos disponibles (tickets 'cancelled' no ocupan cupo)
        const occupiedSpots = await ticketsRepository.countOccupiedSpots(eventId);
        const availableSpots = event.capacity - occupiedSpots;

        if (qty > availableSpots) {
            throw {
                statusCode: 400,
                message: `Cupos insuficientes. Cupos disponibles: ${availableSpots}`
            };
        }

        // 5. Crear ticket y código de reserva
        const reservationCode = `TCK-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
        const ticket = await ticketsRepository.create({
            user: userId,
            event: eventId,
            quantity: qty,
            reservationCode,
            status: 'confirmed'
        });

        // 6. Notificación por email
        try {
            await mailService.sendTicketConfirmation(userEmail, {
                reservationCode,
                eventTitle: event.title,
                quantity: qty,
                eventDate: event.date
            });
        } catch (err) {
            console.error('[Mail] Error al enviar email de confirmación:', err.message);
        }

        return ticket;
    }

    async getMyTickets(userId) {
        return await ticketsRepository.findByUser(userId);
    }

    async getEventTickets(eventId, user) {
        const event = await eventsRepository.findById(eventId);
        if (!event) {
            throw { statusCode: 404, message: 'Evento no encontrado' };
        }

        // Solo admin u organizador dueño del evento
        const isOwner = event.organizer._id ? event.organizer._id.toString() === user.id : event.organizer.toString() === user.id;
        if (user.role !== 'admin' && !isOwner) {
            throw { statusCode: 403, message: 'No tienes permisos para ver las inscripciones de este evento' };
        }

        return await ticketsRepository.findByEvent(eventId);
    }

    async cancelTicket(ticketId, user) {
        const ticket = await ticketsRepository.findById(ticketId);
        if (!ticket) {
            throw { statusCode: 404, message: 'Ticket no encontrado' };
        }

        if (ticket.status === 'cancelled') {
            throw { statusCode: 400, message: 'El ticket ya se encuentra cancelado' };
        }

        // Validar propiedad (solicitante o admin)
        const isOwner = ticket.user.toString() === user.id;
        if (user.role !== 'admin' && !isOwner) {
            throw { statusCode: 403, message: 'No tienes permisos para cancelar este ticket' };
        }

        // Cancelar sin eliminar físicamente (libera cupo automáticamente)
        return await ticketsRepository.update(ticketId, {
            status: 'cancelled',
            cancelledAt: new Date()
        });
    }
}

export const ticketsService = new TicketsService();