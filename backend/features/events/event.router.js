import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, updateEvent } from './event.controller.js';


const EventRouter = express.Router();

EventRouter.post('/', createEvent);
EventRouter.get('/', getAllEvents);
EventRouter.get('/:id', getEventById);
EventRouter.put('/:id', updateEvent);
EventRouter.delete('/:id', deleteEvent);

export default EventRouter;