import { TicketModel } from '../models/Ticket.js';

class TicketsRepository {
    async create(ticketData) {
        return await TicketModel.create(ticketData);
    }

    async findById(id) {
        return await TicketModel.findById(id).populate('event', 'title date location status organizer');
    }

    async findActiveByUserAndEvent(userId, eventId) {
        return await TicketModel.findOne({
            user: userId,
            event: eventId,
            status: { $ne: 'cancelled' }
        });
    }

    async countOccupiedSpots(eventId) {
        const result = await TicketModel.aggregate([
            { $match: { event: eventId, status: { $ne: 'cancelled' } } },
            { $group: { _id: null, total: { $sum: '$quantity' } } }
        ]);
        return result.length > 0 ? result[0].total : 0;
    }

    async findByUser(userId) {
        return await TicketModel.find({ user: userId })
            .populate('event', 'title date location price')
            .sort({ createdAt: -1 });
    }

    async findByEvent(eventId) {
        return await TicketModel.find({ event: eventId, status: { $ne: 'cancelled' } })
            .populate('user', 'first_name last_name email')
            .sort({ createdAt: -1 });
    }

    async update(id, updateData) {
        return await TicketModel.findByIdAndUpdate(id, updateData, { new: true });
    }
}

export const ticketsRepository = new TicketsRepository();