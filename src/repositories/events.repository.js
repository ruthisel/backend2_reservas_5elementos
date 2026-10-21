import { EventModel } from '../models/Event.js';

class EventsRepository {
    async create(eventData) {
        return await EventModel.create(eventData);
    }

    async findById(id) {
        return await EventModel.findById(id).populate('organizer', 'first_name last_name email');
    }

    async update(id, updateData) {
        return await EventModel.findByIdAndUpdate(id, updateData, { new: true });
    }

    async findPaginated(filters, options) {
        return await EventModel.paginate(filters, options);
    }
}

export const eventsRepository = new EventsRepository();