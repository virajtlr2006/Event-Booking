import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// User
const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Event
const eventSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    capacity: { type: Number, required: true },
    userID: { type: String, required: true },
});

// Booking
const bookingSchema = new Schema({
    userID: { type: String, required: true },
    eventID: { type: String, required: true },
    seats: { type: Number, default: 1 },
});

export const User = model('User', userSchema);
export const Event = model('Event', eventSchema);
export const Booking = model('Booking', bookingSchema);