import { Booking, Event, User } from "../../config/schema.js";

export const createBooking = async (req, res) => {
  try {
    const booking = await Booking.create(req.body);
    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingsByUser = async (req, res) => {
  try {
    const bookings = await Booking.find({ userID: req.params.userID });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getBookingsByEvent = async (req, res) => {
  try {
    const bookings = await Booking.find({ eventID: req.params.eventID });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getParticipantsByEvent = async (req, res) => {
  try {
    const { eventID } = req.params;
    const { userID } = req.query;

    const event = await Event.findById(eventID);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    if (!userID || event.userID !== userID) {
      return res.status(403).json({ message: 'Not allowed to view participants for this event' });
    }

    const bookings = await Booking.find({ eventID });
    const participants = await Promise.all(
      bookings.map(async (booking) => {
        const participant = await User.findById(booking.userID).select('name email');
        return {
          bookingID: booking._id,
          userID: booking.userID,
          seats: booking.seats,
          name: participant?.name ?? 'Unknown User',
          email: participant?.email ?? 'unknown@email.com',
        };
      })
    );

    res.json(participants);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json({ message: 'Booking deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};