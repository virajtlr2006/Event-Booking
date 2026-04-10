import express from 'express';
import { createBooking, deleteBooking, getBookingById, getBookingsByEvent, getBookingsByUser } from './booking.controller.js';


const BookingRouter = express.Router();

BookingRouter.post('/', createBooking);
BookingRouter.get('/:id', getBookingById);
BookingRouter.get('/user/:userID', getBookingsByUser);
BookingRouter.get('/event/:eventID', getBookingsByEvent);
BookingRouter.delete('/:id', deleteBooking);

export default BookingRouter;