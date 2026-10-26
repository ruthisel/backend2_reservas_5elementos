
import { UserDAO } from '../daos/user.dao.js';
const userDAO = new UserDAO();

export class UserRepository {
    async findById(id) { return await userDAO.getById(id); }
    async findByEmail(email) { return await userDAO.getByEmail(email); }
    async create(userData) { return await userDAO.create(userData); }
}


import { EventDAO } from '../daos/event.dao.js';
const eventDAO = new EventDAO();

export class EventRepository {
    async findById(id) { return await eventDAO.getById(id); }
    async create(data) { return await eventDAO.create(data); }
    async update(id, data) { return await eventDAO.update(id, data); }
    async findPaginated(filters, options) { return await eventDAO.paginate(filters, options); }
    async reserveCapacity(eventId, quantity) { return await eventDAO.updateCapacityAtomic(eventId, quantity); }
}


import { TicketDAO } from '../daos/ticket.dao.js';
const ticketDAO = new TicketDAO();

export class TicketRepository {
    async create(data) { return await ticketDAO.create(data); }
    async findById(id) { return await ticketDAO.getById(id); }
    async findActiveByUserAndEvent(userId, eventId) { return await ticketDAO.getActiveByUserAndEvent(userId, eventId); }
    async findByUser(userId) { return await ticketDAO.getByUser(userId); }
    async findByEvent(eventId) { return await ticketDAO.getByEvent(eventId); }
    async update(id, data) { return await ticketDAO.update(id, data); }
}