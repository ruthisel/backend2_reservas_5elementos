import { UserModel } from '../models/User.js';

export class UserDAO {
    async getById(id) { return await UserModel.findById(id); }
    async getByEmail(email) { return await UserModel.findOne({ email }); }
    async create(userData) { return await UserModel.create(userData); }
}


import { EventModel } from '../models/Event.js';

export class EventDAO {
    async getById(id) { return await EventModel.findById(id).populate('organizer'); }
    async create(data) { return await EventModel.create(data); }
    async update(id, data) { return await EventModel.findByIdAndUpdate(id, data, { new: true }); }
    async paginate(filters, options) { return await EventModel.paginate(filters, options); }
    async updateCapacityAtomic(eventId, quantity) {
        return await EventModel.findOneAndUpdate(
            { _id: eventId, capacity: { $gte: quantity } },
            { $inc: { capacity: -quantity } },
            { new: true }
        );
    }
}


import { TicketModel } from '../models/Ticket.js';

export class TicketDAO {
    async create(data) { return await TicketModel.create(data); }
    async getById(id) { return await TicketModel.findById(id).populate('event').populate('user'); }
    async getActiveByUserAndEvent(userId, eventId) {
        return await TicketModel.findOne({ user: userId, event: eventId, status: { $ne: 'cancelled' } });
    }
    async getByUser(userId) {
        return await TicketModel.find({ user: userId }).populate('event').sort({ createdAt: -1 });
    }
    async getByEvent(eventId) {
        return await TicketModel.find({ event: eventId, status: { $ne: 'cancelled' } }).populate('user');
    }
    async update(id, data) { return await TicketModel.findByIdAndUpdate(id, data, { new: true }); }
}