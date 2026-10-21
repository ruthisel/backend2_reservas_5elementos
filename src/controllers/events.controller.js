import { eventsService } from '../services/events.service.js';

export const createEvent = async (req, res, next) => {
    try {
        const event = await eventsService.createEvent(req.body, req.user.id);
        res.status(201).json({ status: 'success', payload: event });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const getEvents = async (req, res, next) => {
    try {
        const result = await eventsService.getEvents(req.query);
        res.status(200).json({ status: 'success', ...result });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const getEventById = async (req, res, next) => {
    try {
        const event = await eventsService.getEventById(req.params.id);
        res.status(200).json({ status: 'success', payload: event });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const updateEvent = async (req, res, next) => {
    try {
        const updated = await eventsService.updateEvent(req.params.id, req.body, req.user);
        res.status(200).json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};

export const updateEventStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const updated = await eventsService.updateStatus(req.params.id, status, req.user);
        res.status(200).json({ status: 'success', payload: updated });
    } catch (error) {
        res.status(error.statusCode || 500).json({ status: 'error', message: error.message });
    }
};