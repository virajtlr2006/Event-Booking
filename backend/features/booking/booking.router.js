import express from 'express';
import { createBooking, deleteBooking, getBookingById, getBookingsByEvent, getBookingsByUser, getParticipantsByEvent } from './booking.controller.js';


const BookingRouter = express.Router();

BookingRouter.post('/', createBooking);
BookingRouter.get('/user/:userID', getBookingsByUser);
BookingRouter.get('/event/:eventID', getBookingsByEvent);
BookingRouter.get('/event/:eventID/participants', getParticipantsByEvent);
BookingRouter.get('/:id', getBookingById);
BookingRouter.delete('/:id', deleteBooking);

export default BookingRouter;