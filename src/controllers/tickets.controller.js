import { ticketsService } from '../services/tickets.service.js';

export const createTicket = async (req, res) => {
    try {
        const { eid } = req.params;
        const { quantity } = req.body;
        const ticket = await ticketsService.createTicket(eid, req.user.id, req.user.email, quantity);
        return res.status(201).json({ status: 'success', payload: ticket });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const getMyTickets = async (req, res) => {
    try {
        const tickets = await ticketsService.getMyTickets(req.user.id);
        return res.status(200).json({ status: 'success', payload: tickets });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const getEventTickets = async (req, res) => {
    try {
        const { eid } = req.params;
        const tickets = await ticketsService.getEventTickets(eid, req.user);
        return res.status(200).json({ status: 'success', payload: tickets });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const cancelTicket = async (req, res) => {
    try {
        const { tid } = req.params;
        const ticket = await ticketsService.cancelTicket(tid, req.user);
        return res.status(200).json({ status: 'success', payload: ticket });
    } catch (error) {
        return res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};