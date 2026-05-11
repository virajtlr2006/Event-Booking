# Event Booking Platform - Project Report

## Project Title
**Event Booking Platform**

## Project Info
This report includes only core feature/application code from backend configuration and feature modules, plus the frontend source folder.

## Why Use My Platform
- Organized backend by feature modules for maintainability.
- Clear frontend source structure for scalable UI development.
- API-first architecture with reusable config and business logic separation.

## Folder Structure
```text
backend/config
├── database.js
└── schema.js
backend/features
├── booking
│   ├── booking.controller.js
│   └── booking.router.js
├── events
│   ├── event.controller.js
│   └── event.router.js
└── user
    ├── user.controller.js
    └── user.router.js
frontend/src
├── api
│   └── axios.js
├── App.css
├── App.jsx
├── assets
│   ├── hero.png
│   ├── react.svg
│   └── vite.svg
├── context
│   └── AuthContext.jsx
├── index.css
├── main.jsx
├── Navbar.jsx
└── pages
    ├── CreateEvent.jsx
    ├── Events.jsx
    ├── Login.jsx
    ├── MyBookings.jsx
    ├── MyEvents.jsx
    ├── Profile.jsx
    ├── Signup.jsx
    └── SingleEvent.jsx

10 directories, 26 files
```

## Selected Code Listing

### `backend/config/database.js`
```js
import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/eventbooking';

    const conn = await mongoose.connect(mongoURI);

    console.log(`🍃 MongoDB Connected: ${conn.connection.host}`);
    console.log(`📝 Database: ${conn.connection.name}`);

    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('📴 MongoDB disconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('📴 MongoDB connection closed due to app termination');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during MongoDB disconnection:', error);
        process.exit(1);
      }
    });

    return conn;
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('📴 MongoDB disconnected');
  } catch (error) {
    console.error('❌ Error disconnecting from MongoDB:', error);
  }
};
```

### `backend/config/schema.js`
```js
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
```

### `backend/features/booking/booking.controller.js`
```js
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
```

### `backend/features/booking/booking.router.js`
```js
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
```

### `backend/features/events/event.controller.js`
```js
import { Event } from "../../config/schema.js";

export const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventsByUser = async (req, res) => {
  try {
    const events = await Event.find({ userID: req.params.userID });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json({ message: 'Event deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### `backend/features/events/event.router.js`
```js
import express from 'express';
import { createEvent, deleteEvent, getAllEvents, getEventById, getEventsByUser, updateEvent } from './event.controller.js';


const EventRouter = express.Router();

EventRouter.post('/', createEvent);
EventRouter.get('/', getAllEvents);
EventRouter.get('/user/:userID', getEventsByUser);
EventRouter.get('/:id', getEventById);
EventRouter.put('/:id', updateEvent);
EventRouter.delete('/:id', deleteEvent);

export default EventRouter;
```

### `backend/features/user/user.controller.js`
```js
import bcrypt from 'bcrypt';
import { User } from '../../config/schema.js';

export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'Email already in use' });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed });

    res.status(201).json({ message: 'User created', userID: user._id });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    res.json({ userID: user._id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ message: 'User not found' });

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
```

### `backend/features/user/user.router.js`
```js
import express from 'express';
import { getProfile, login, signup } from './user.controller.js';


const UserRouter = express.Router();

UserRouter.post('/signup', signup);
UserRouter.post('/login', login);
UserRouter.get('/profile/:id', getProfile);

export default UserRouter;
```

### `frontend/src/api/axios.js`
```js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
});

export default api;
```

### `frontend/src/App.css`
```css

```

### `frontend/src/App.jsx`
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ← import this
import Events from './pages/Events';
import SingleEvent from './pages/SingleEvent';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';
import MyEvents from './pages/MyEvents';
import Navbar from './Navbar';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>          {/* ← must wrap everything */}
        <div className="app-shell">
          <Navbar/>          {/* ← place Navbar here */}
          <Routes>
            <Route path="/events" element={<Events />} />
            <Route path="/events/:id" element={<SingleEvent />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="/my-events" element={<MyEvents />} />
            <Route path="*" element={<Events />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
```

### `frontend/src/assets/react.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" aria-hidden="true" role="img" class="iconify iconify--logos" width="35.93" height="32" preserveAspectRatio="xMidYMid meet" viewBox="0 0 256 228"><path fill="#00D8FF" d="M210.483 73.824a171.49 171.49 0 0 0-8.24-2.597c.465-1.9.893-3.777 1.273-5.621c6.238-30.281 2.16-54.676-11.769-62.708c-13.355-7.7-35.196.329-57.254 19.526a171.23 171.23 0 0 0-6.375 5.848a155.866 155.866 0 0 0-4.241-3.917C100.759 3.829 77.587-4.822 63.673 3.233C50.33 10.957 46.379 33.89 51.995 62.588a170.974 170.974 0 0 0 1.892 8.48c-3.28.932-6.445 1.924-9.474 2.98C17.309 83.498 0 98.307 0 113.668c0 15.865 18.582 31.778 46.812 41.427a145.52 145.52 0 0 0 6.921 2.165a167.467 167.467 0 0 0-2.01 9.138c-5.354 28.2-1.173 50.591 12.134 58.266c13.744 7.926 36.812-.22 59.273-19.855a145.567 145.567 0 0 0 5.342-4.923a168.064 168.064 0 0 0 6.92 6.314c21.758 18.722 43.246 26.282 56.54 18.586c13.731-7.949 18.194-32.003 12.4-61.268a145.016 145.016 0 0 0-1.535-6.842c1.62-.48 3.21-.974 4.76-1.488c29.348-9.723 48.443-25.443 48.443-41.52c0-15.417-17.868-30.326-45.517-39.844Zm-6.365 70.984c-1.4.463-2.836.91-4.3 1.345c-3.24-10.257-7.612-21.163-12.963-32.432c5.106-11 9.31-21.767 12.459-31.957c2.619.758 5.16 1.557 7.61 2.4c23.69 8.156 38.14 20.213 38.14 29.504c0 9.896-15.606 22.743-40.946 31.14Zm-10.514 20.834c2.562 12.94 2.927 24.64 1.23 33.787c-1.524 8.219-4.59 13.698-8.382 15.893c-8.067 4.67-25.32-1.4-43.927-17.412a156.726 156.726 0 0 1-6.437-5.87c7.214-7.889 14.423-17.06 21.459-27.246c12.376-1.098 24.068-2.894 34.671-5.345a134.17 134.17 0 0 1 1.386 6.193ZM87.276 214.515c-7.882 2.783-14.16 2.863-17.955.675c-8.075-4.657-11.432-22.636-6.853-46.752a156.923 156.923 0 0 1 1.869-8.499c10.486 2.32 22.093 3.988 34.498 4.994c7.084 9.967 14.501 19.128 21.976 27.15a134.668 134.668 0 0 1-4.877 4.492c-9.933 8.682-19.886 14.842-28.658 17.94ZM50.35 144.747c-12.483-4.267-22.792-9.812-29.858-15.863c-6.35-5.437-9.555-10.836-9.555-15.216c0-9.322 13.897-21.212 37.076-29.293c2.813-.98 5.757-1.905 8.812-2.773c3.204 10.42 7.406 21.315 12.477 32.332c-5.137 11.18-9.399 22.249-12.634 32.792a134.718 134.718 0 0 1-6.318-1.979Zm12.378-84.26c-4.811-24.587-1.616-43.134 6.425-47.789c8.564-4.958 27.502 2.111 47.463 19.835a144.318 144.318 0 0 1 3.841 3.545c-7.438 7.987-14.787 17.08-21.808 26.988c-12.04 1.116-23.565 2.908-34.161 5.309a160.342 160.342 0 0 1-1.76-7.887Zm110.427 27.268a347.8 347.8 0 0 0-7.785-12.803c8.168 1.033 15.994 2.404 23.343 4.08c-2.206 7.072-4.956 14.465-8.193 22.045a381.151 381.151 0 0 0-7.365-13.322Zm-45.032-43.861c5.044 5.465 10.096 11.566 15.065 18.186a322.04 322.04 0 0 0-30.257-.006c4.974-6.559 10.069-12.652 15.192-18.18ZM82.802 87.83a323.167 323.167 0 0 0-7.227 13.238c-3.184-7.553-5.909-14.98-8.134-22.152c7.304-1.634 15.093-2.97 23.209-3.984a321.524 321.524 0 0 0-7.848 12.897Zm8.081 65.352c-8.385-.936-16.291-2.203-23.593-3.793c2.26-7.3 5.045-14.885 8.298-22.6a321.187 321.187 0 0 0 7.257 13.246c2.594 4.48 5.28 8.868 8.038 13.147Zm37.542 31.03c-5.184-5.592-10.354-11.779-15.403-18.433c4.902.192 9.899.29 14.978.29c5.218 0 10.376-.117 15.453-.343c-4.985 6.774-10.018 12.97-15.028 18.486Zm52.198-57.817c3.422 7.8 6.306 15.345 8.596 22.52c-7.422 1.694-15.436 3.058-23.88 4.071a382.417 382.417 0 0 0 7.859-13.026a347.403 347.403 0 0 0 7.425-13.565Zm-16.898 8.101a358.557 358.557 0 0 1-12.281 19.815a329.4 329.4 0 0 1-23.444.823c-7.967 0-15.716-.248-23.178-.732a310.202 310.202 0 0 1-12.513-19.846h.001a307.41 307.41 0 0 1-10.923-20.627a310.278 310.278 0 0 1 10.89-20.637l-.001.001a307.318 307.318 0 0 1 12.413-19.761c7.613-.576 15.42-.876 23.31-.876H128c7.926 0 15.743.303 23.354.883a329.357 329.357 0 0 1 12.335 19.695a358.489 358.489 0 0 1 11.036 20.54a329.472 329.472 0 0 1-11 20.722Zm22.56-122.124c8.572 4.944 11.906 24.881 6.52 51.026c-.344 1.668-.73 3.367-1.15 5.09c-10.622-2.452-22.155-4.275-34.23-5.408c-7.034-10.017-14.323-19.124-21.64-27.008a160.789 160.789 0 0 1 5.888-5.4c18.9-16.447 36.564-22.941 44.612-18.3ZM128 90.808c12.625 0 22.86 10.235 22.86 22.86s-10.235 22.86-22.86 22.86s-22.86-10.235-22.86-22.86s10.235-22.86 22.86-22.86Z"></path></svg>
```

### `frontend/src/assets/vite.svg`
```svg
<svg xmlns="http://www.w3.org/2000/svg" width="77" height="47" fill="none" aria-labelledby="vite-logo-title" viewBox="0 0 77 47"><title id="vite-logo-title">Vite</title><style>.parenthesis{fill:#000}@media (prefers-color-scheme:dark){.parenthesis{fill:#fff}}</style><path fill="#9135ff" d="M40.151 45.71c-.663.844-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.493c-.92 0-1.457-1.04-.92-1.788l7.479-10.471c1.07-1.498 0-3.578-1.842-3.578H15.443c-.92 0-1.456-1.04-.92-1.788l9.696-13.576c.213-.297.556-.474.92-.474h28.894c.92 0 1.456 1.04.92 1.788l-7.48 10.472c-1.07 1.497 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.087.89 1.83L40.153 45.712z"/><mask id="a" width="48" height="47" x="14" y="0" maskUnits="userSpaceOnUse" style="mask-type:alpha"><path fill="#000" d="M40.047 45.71c-.663.843-2.02.374-2.02-.699V34.708a2.26 2.26 0 0 0-2.262-2.262H24.389c-.92 0-1.457-1.04-.92-1.788l7.479-10.472c1.07-1.497 0-3.578-1.842-3.578H15.34c-.92 0-1.456-1.04-.92-1.788l9.696-13.575c.213-.297.556-.474.92-.474H53.93c.92 0 1.456 1.04.92 1.788L47.37 13.03c-1.07 1.498 0 3.578 1.842 3.578h11.376c.944 0 1.474 1.088.89 1.831L40.049 45.712z"/></mask><g mask="url(#a)"><g filter="url(#b)"><ellipse cx="5.508" cy="14.704" fill="#eee6ff" rx="5.508" ry="14.704" transform="rotate(269.814 20.96 11.29)scale(-1 1)"/></g><g filter="url(#c)"><ellipse cx="10.399" cy="29.851" fill="#eee6ff" rx="10.399" ry="29.851" transform="rotate(89.814 -16.902 -8.275)scale(1 -1)"/></g><g filter="url(#d)"><ellipse cx="5.508" cy="30.487" fill="#8900ff" rx="5.508" ry="30.487" transform="rotate(89.814 -19.197 -7.127)scale(1 -1)"/></g><g filter="url(#e)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.928 4.177)scale(1 -1)"/></g><g filter="url(#f)"><ellipse cx="5.508" cy="30.599" fill="#8900ff" rx="5.508" ry="30.599" transform="rotate(89.814 -25.738 5.52)scale(1 -1)"/></g><g filter="url(#g)"><ellipse cx="14.072" cy="22.078" fill="#eee6ff" rx="14.072" ry="22.078" transform="rotate(93.35 31.245 55.578)scale(-1 1)"/></g><g filter="url(#h)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#i)"><ellipse cx="3.47" cy="21.501" fill="#8900ff" rx="3.47" ry="21.501" transform="rotate(89.009 35.419 55.202)scale(-1 1)"/></g><g filter="url(#j)"><ellipse cx="14.592" cy="9.743" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(39.51 14.592 9.743)"/></g><g filter="url(#k)"><ellipse cx="61.728" cy="-5.321" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 61.728 -5.32)"/></g><g filter="url(#l)"><ellipse cx="55.618" cy="7.104" fill="#00c2ff" rx="5.971" ry="9.665" transform="rotate(37.892 55.618 7.104)"/></g><g filter="url(#m)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#n)"><ellipse cx="12.326" cy="39.103" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 12.326 39.103)"/></g><g filter="url(#o)"><ellipse cx="49.857" cy="30.678" fill="#8900ff" rx="4.407" ry="29.108" transform="rotate(37.892 49.857 30.678)"/></g><g filter="url(#p)"><ellipse cx="52.623" cy="33.171" fill="#00c2ff" rx="5.971" ry="15.297" transform="rotate(37.892 52.623 33.17)"/></g></g><path d="M6.919 0c-9.198 13.166-9.252 33.575 0 46.789h6.215c-9.25-13.214-9.196-33.623 0-46.789zm62.424 0h-6.215c9.198 13.166 9.252 33.575 0 46.789h6.215c9.25-13.214 9.196-33.623 0-46.789" class="parenthesis"/><defs><filter id="b" width="60.045" height="41.654" x="-5.564" y="16.92" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="c" width="90.34" height="51.437" x="-40.407" y="-6.762" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="d" width="79.355" height="29.4" x="-35.435" y="2.801" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="e" width="79.579" height="29.4" x="-30.84" y="20.8" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="f" width="79.579" height="29.4" x="-29.307" y="21.949" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="g" width="74.749" height="58.852" x="29.961" y="-17.13" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="7.659"/></filter><filter id="h" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="i" width="61.377" height="25.362" x="37.754" y="3.055" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="j" width="56.045" height="63.649" x="-13.43" y="-22.082" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="k" width="54.814" height="64.646" x="34.321" y="-37.644" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="l" width="33.541" height="35.313" x="38.847" y="-10.552" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="m" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="n" width="54.814" height="64.646" x="-15.081" y="6.78" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="o" width="54.814" height="64.646" x="22.45" y="-1.645" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter><filter id="p" width="39.409" height="43.623" x="32.919" y="11.36" color-interpolation-filters="sRGB" filterUnits="userSpaceOnUse"><feFlood flood-opacity="0" result="BackgroundImageFix"/><feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape"/><feGaussianBlur result="effect1_foregroundBlur_2002_17286" stdDeviation="4.596"/></filter></defs></svg>

```

### `frontend/src/context/AuthContext.jsx`
```jsx
import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
  return ctx;
}
```

### `frontend/src/index.css`
```css
@import "tailwindcss";

@theme {
  --color-brand-50: #eef4ff;
  --color-brand-100: #d9e6ff;
  --color-brand-200: #b8d0ff;
  --color-brand-300: #8eb0ff;
  --color-brand-400: #5f89ff;
  --color-brand-500: #3f65f2;
  --color-brand-600: #304fd0;
  --color-brand-700: #273fa7;
  --color-brand-800: #223785;
  --color-brand-900: #1f316c;

  --color-accent-400: #16d1c1;
  --color-accent-500: #0db8aa;
  --color-accent-600: #0a968a;
}

@layer base {
  body {
    min-height: 100vh;
    color: #e5e7eb;
    background:
      radial-gradient(circle at 5% 0%, rgba(63, 101, 242, 0.24), transparent 36%),
      radial-gradient(circle at 95% 0%, rgba(22, 209, 193, 0.16), transparent 34%),
      linear-gradient(180deg, #060a16 0%, #0a1021 45%, #091021 100%);
  }
}

@layer components {
  .app-shell {
    @apply min-h-screen;
  }

  .page-shell {
    @apply relative px-4 py-10 sm:px-6 lg:px-10;
  }

  .page-shell::before {
    content: "";
    @apply pointer-events-none absolute inset-x-0 top-0 -z-10 h-72;
    background: linear-gradient(180deg, rgba(63, 101, 242, 0.14), rgba(63, 101, 242, 0));
  }

  .content-wrap {
    @apply mx-auto w-full max-w-6xl;
  }

  .glass-card {
    @apply rounded-3xl border border-white/10 bg-white/5 shadow-2xl shadow-black/30 backdrop-blur-xl;
  }

  .surface-card {
    @apply rounded-2xl border border-slate-700/70 bg-slate-900/70;
  }

  .input-modern {
    @apply w-full rounded-xl border border-slate-600 bg-slate-950/80 px-4 py-3 text-sm text-white outline-none transition-all placeholder:text-slate-500 focus:border-brand-400 focus:ring-2 focus:ring-brand-500/25;
  }

  .btn-primary {
    @apply inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-brand-500 to-accent-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-black/40 transition-all hover:from-brand-400 hover:to-accent-400;
  }

  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-xl border border-slate-700 bg-slate-900/70 px-4 py-2.5 text-sm font-semibold text-slate-200 transition-all hover:border-slate-500 hover:bg-slate-800;
  }

  .badge-soft {
    @apply inline-flex items-center rounded-full border border-brand-400/30 bg-brand-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-brand-200;
  }

  .celebrate-burst {
    position: relative;
    width: 16rem;
    height: 16rem;
    animation: fade-burst 900ms ease-out forwards;
  }

  .celebrate-dot {
    --distance: 84px;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.75rem;
    height: 0.75rem;
    border-radius: 9999px;
    background: radial-gradient(circle, #ffffff 0%, #7ff5e9 45%, #3f65f2 100%);
    transform: rotate(var(--angle)) translateY(0);
    opacity: 0;
    animation: dot-burst 900ms ease-out forwards;
  }
}

@keyframes dot-burst {
  0% {
    transform: rotate(var(--angle)) translateY(0) scale(0.2);
    opacity: 0;
  }
  15% {
    opacity: 1;
  }
  100% {
    transform: rotate(var(--angle)) translateY(calc(-1 * var(--distance))) scale(1);
    opacity: 0;
  }
}

@keyframes fade-burst {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}

.cancel-modal {
  animation: cancel-modal-in 220ms ease-out;
}

@keyframes cancel-modal-in {
  0% {
    transform: translateY(10px) scale(0.97);
    opacity: 0;
  }
  100% {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}

```

### `frontend/src/main.jsx`
```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

```

### `frontend/src/Navbar.jsx`
```jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => {
    if (path === '/events') {
      return location.pathname === '/events' || location.pathname.startsWith('/events/');
    }
    return location.pathname === path;
  };

  const navLink = (path, label) => (
    <button
      onClick={() => navigate(path)}
      className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition-all ${
        isActive(path)
          ? 'bg-brand-500/20 text-brand-100'
          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
      }`}
    >
      {label}
    </button>
  );

  // Hide navbar on auth pages
  const hideOn = ['/login', '/signup'];
  if (hideOn.includes(location.pathname)) return null;

  return (
    <nav className="sticky top-0 z-50 px-3 pt-3 sm:px-4">
      <div className="content-wrap glass-card">
        <div className="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
          <button
            onClick={() => navigate('/events')}
            className="flex shrink-0 items-center gap-2.5"
          >
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-accent-500 text-base shadow-lg shadow-black/40">
              ✦
            </div>
            <div className="hidden text-left sm:block">
              <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-400">Event Platform</p>
              <p className="text-lg font-bold text-white">Evently</p>
            </div>
          </button>

          {user && (
            <div className="hidden items-center gap-1 md:flex">
              {navLink('/events', 'Events')}
              {navLink('/create-event', 'Create Event')}
              {navLink('/my-events', 'My Events')}
              {navLink('/my-bookings', 'My Bookings')}
            </div>
          )}

          <div className="flex items-center gap-2">
            {user ? (
              <>
                <button
                  onClick={() => navigate('/profile')}
                  className={`flex items-center gap-2 rounded-xl border px-2.5 py-1.5 transition-all ${
                    isActive('/profile')
                      ? 'border-brand-300/50 bg-brand-500/15'
                      : 'border-transparent hover:border-slate-600 hover:bg-slate-800/70'
                  }`}
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-500 to-accent-500 text-xs font-bold text-white">
                    {user?.name?.[0]?.toUpperCase() ?? user?.email?.[0]?.toUpperCase()}
                  </div>
                  <span className="hidden text-sm font-semibold text-slate-200 sm:block">
                    {user?.name?.split(' ')[0] ?? 'Profile'}
                  </span>
                </button>
                <button
                  onClick={handleLogout}
                  className="rounded-xl border border-slate-700 px-3 py-1.5 text-sm font-semibold text-slate-300 transition-all hover:border-red-400/40 hover:bg-red-500/10 hover:text-red-300"
                >
                  Sign out
                </button>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => navigate('/login')}
                  className="btn-secondary py-2"
                >
                  Login
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className="btn-primary py-2"
                >
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>

        {user && (
          <div className="flex items-center justify-around border-t border-white/10 px-2 py-2 md:hidden">
            {[
              { path: '/events', icon: '🗓️', label: 'Events' },
              { path: '/create-event', icon: '➕', label: 'Create' },
              { path: '/my-events', icon: '📋', label: 'Mine' },
              { path: '/my-bookings', icon: '🎫', label: 'Bookings' },
              { path: '/profile', icon: '👤', label: 'Profile' },
            ].map(({ path, icon, label }) => (
              <button
                key={path}
                onClick={() => navigate(path)}
                className={`flex min-w-16 flex-col items-center gap-1 rounded-lg px-3 py-1.5 transition-all ${
                  isActive(path)
                    ? 'bg-brand-500/20 text-brand-200'
                    : 'text-slate-400 hover:bg-slate-800/70 hover:text-slate-200'
                }`}
              >
                <span className="text-sm">{icon}</span>
                <span className="text-[11px] font-medium">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
}
```

### `frontend/src/pages/CreateEvent.jsx`
```jsx
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';

export default function CreateEvent() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) navigate('/login');
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/event', { ...data, userID: user.userID });
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to create event');
    }
  };

  const inputClass = "input-modern";

  return (
    <div className="page-shell">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 text-center">
          <span className="badge-soft mb-3">Host Experience</span>
          <h2 className="text-3xl font-bold text-white sm:text-4xl">Create a New Event</h2>
          <p className="mt-2 text-sm text-slate-300">Publish your event and start collecting bookings in minutes.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card flex flex-col gap-5 p-6 sm:p-8">

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Title</label>
            <input {...register('title', { required: 'Title is required' })} placeholder="Give your event a name" className={inputClass} />
            {errors.title && <span className="text-red-400 text-xs">{errors.title.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Description</label>
            <input {...register('description')} placeholder="What's this event about?" className={inputClass} />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Date</label>
              <input type="date" {...register('date', { required: 'Date is required' })} className={inputClass} />
              {errors.date && <span className="text-red-400 text-xs">{errors.date.message}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Capacity</label>
              <input type="number" {...register('capacity', { required: 'Required', min: 1 })} placeholder="100" className={inputClass} />
              {errors.capacity && <span className="text-red-400 text-xs">{errors.capacity.message}</span>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Location</label>
            <input {...register('location', { required: 'Location is required' })} placeholder="City, Venue" className={inputClass} />
            {errors.location && <span className="text-red-400 text-xs">{errors.location.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-2 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Publishing...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}
```

### `frontend/src/pages/Events.jsx`
```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/event')
      .then(res => setEvents(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load events'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
        <span className="text-sm text-slate-400">Loading events...</span>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="content-wrap space-y-8">
        <div className="glass-card flex flex-col gap-6 p-6 sm:p-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="badge-soft mb-3">Discover Curated Experiences</span>
            <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">Live Events</h1>
            <p className="mt-2 max-w-2xl text-sm text-slate-300 sm:text-base">
              Explore upcoming events, reserve your spot instantly, and keep all your bookings organized in one place.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            {user && (
              <>
                <button onClick={() => navigate('/create-event')} className="btn-primary">
                  + Create Event
                </button>
                <button onClick={() => navigate('/profile')} className="btn-secondary">
                  Profile
                </button>
              </>
            )}
            {!user && (
              <button onClick={() => navigate('/login')} className="btn-secondary">
                Login
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="glass-card mt-10 px-6 py-14 text-center">
            <p className="mb-4 text-5xl">🎭</p>
            <p className="text-slate-300">No events yet. Be the first to create one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {events.map(event => (
            <div key={event._id} className="group surface-card flex flex-col gap-4 p-5 transition-all hover:-translate-y-1 hover:border-brand-300/60 hover:bg-slate-900">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-base font-semibold leading-snug text-white transition-colors group-hover:text-brand-200">{event.title}</h3>
                <span className="shrink-0 rounded-lg border border-brand-300/35 bg-brand-500/10 px-2.5 py-1 text-xs font-semibold text-brand-100">
                  {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </span>
              </div>
              {event.description && (
                <p className="flex-1 text-sm leading-relaxed text-slate-300">{event.description}</p>
              )}
              <div className="flex gap-3 text-xs">
                <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-slate-300">📍 {event.location}</span>
                <span className="rounded-lg border border-slate-700 bg-slate-800/70 px-2.5 py-1 text-slate-300">👥 {event.capacity}</span>
              </div>
              <button
                onClick={() => navigate(`/events/${event._id}`)}
                className="btn-primary mt-auto w-full"
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/pages/Login.jsx`
```jsx
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await api.post('/user/login', data);
      login(res.data);
      navigate('/events');
    } catch (err) {
      alert(err.response?.data?.message || 'Login failed');
    }
  };

  const inputClass = "input-modern";

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-2xl shadow-lg shadow-black/40">✦</div>
          <h2 className="text-3xl font-bold text-white">Welcome Back</h2>
          <p className="mt-1 text-sm text-slate-300">Sign in to manage your events and bookings.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card flex flex-col gap-5 p-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="john@example.com" className={inputClass} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
            <input type="password" {...register('password', { required: 'Password is required' })} placeholder="••••••••" className={inputClass} />
            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Signing in...' : 'Sign In'}
          </button>

          <p className="text-center text-sm text-slate-300">
            No account? <Link to="/signup" className="font-semibold text-brand-200 transition-colors hover:text-brand-100">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
```

### `frontend/src/pages/MyBookings.jsx`
```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MyBookings() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelTarget, setCancelTarget] = useState(null);
  const [isCancelling, setIsCancelling] = useState(false);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get(`/booking/user/${user.userID}`)
      .then(res => setBookings(res.data))
      .catch(() => alert('Failed to load bookings'))
      .finally(() => setLoading(false));
  }, []);

  const handleCancel = async () => {
    if (!cancelTarget) return;
    try {
      setIsCancelling(true);
      await api.delete(`/booking/${cancelTarget._id}`);
      setBookings(prev => prev.filter(b => b._id !== cancelTarget._id));
      setCancelTarget(null);
    } catch {
      alert('Failed to cancel booking');
    } finally {
      setIsCancelling(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
        <span className="text-sm text-slate-400">Loading your bookings...</span>
      </div>
    </div>
  );

  return (
    <div className="page-shell">
      <div className="mx-auto w-full max-w-3xl">
        <div className="glass-card mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge-soft mb-2">Your Reservations</span>
            <h1 className="text-3xl font-bold text-white">My Bookings</h1>
          </div>
          <button onClick={() => navigate('/events')} className="btn-secondary">
            ← Back to Events
          </button>
        </div>

        {bookings.length === 0 && (
          <div className="glass-card mt-20 px-6 py-14 text-center">
            <p className="mb-4 text-5xl">🎫</p>
            <p className="text-slate-300">No bookings yet. Go grab some tickets!</p>
            <button onClick={() => navigate('/events')} className="mt-4 text-sm font-semibold text-brand-200 transition-colors hover:text-brand-100">Browse Events →</button>
          </div>
        )}

        <div className="flex flex-col gap-3">
          {bookings.map(b => (
            <div key={b._id} className="surface-card flex items-center justify-between gap-4 px-5 py-4 transition-all hover:border-brand-300/45">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-brand-300/35 bg-brand-500/15 text-lg">🎟️</div>
                <div className="flex flex-col gap-0.5">
                  <span className="text-sm font-semibold text-slate-100">
                    Event <code className="font-mono text-xs text-brand-200">{b.eventID}</code>
                  </span>
                  <span className="text-xs text-slate-400">{b.seats} seat{b.seats > 1 ? 's' : ''} booked</span>
                </div>
              </div>
              <button
                onClick={() => setCancelTarget(b)}
                className="rounded-xl border border-red-500/35 bg-red-500/10 px-3.5 py-2 text-xs font-semibold text-red-300 transition-all hover:bg-red-500/20"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>
      </div>

      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
          <div className="cancel-modal glass-card w-full max-w-md p-6">
            <div className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/35 bg-red-500/15 text-xl">
              ⚠️
            </div>
            <h2 className="text-xl font-semibold text-white">Cancel Booking?</h2>
            <p className="mt-2 text-sm text-slate-300">
              This will remove your ticket for event
              {' '}
              <span className="font-mono text-brand-200">{cancelTarget.eventID}</span>
              .
            </p>
            <div className="mt-6 flex items-center justify-end gap-2">
              <button
                onClick={() => setCancelTarget(null)}
                className="btn-secondary"
                disabled={isCancelling}
              >
                Keep Booking
              </button>
              <button
                onClick={handleCancel}
                disabled={isCancelling}
                className="rounded-xl border border-red-500/35 bg-red-500/15 px-4 py-2.5 text-sm font-semibold text-red-200 transition-all hover:bg-red-500/25 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

### `frontend/src/pages/MyEvents.jsx`
```jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function MyEvents() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [participantsByEvent, setParticipantsByEvent] = useState({});
  const [expanded, setExpanded] = useState({});
  const [loadingParticipants, setLoadingParticipants] = useState({});

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    api.get(`/event/user/${user.userID}`)
      .then((res) => setEvents(res.data))
      .catch((err) => setError(err.response?.data?.message || 'Failed to load your events'))
      .finally(() => setLoading(false));
  }, [navigate, user]);

  const loadParticipants = async (eventID) => {
    if (participantsByEvent[eventID]) return;
    try {
      setLoadingParticipants((prev) => ({ ...prev, [eventID]: true }));
      const res = await api.get(`/booking/event/${eventID}/participants`, {
        params: { userID: user.userID },
      });
      setParticipantsByEvent((prev) => ({ ...prev, [eventID]: res.data }));
    } catch (err) {
      setParticipantsByEvent((prev) => ({
        ...prev,
        [eventID]: { error: err.response?.data?.message || 'Failed to load participants' },
      }));
    } finally {
      setLoadingParticipants((prev) => ({ ...prev, [eventID]: false }));
    }
  };

  const toggleParticipants = async (eventID) => {
    const nextOpen = !expanded[eventID];
    setExpanded((prev) => ({ ...prev, [eventID]: nextOpen }));
    if (nextOpen) {
      await loadParticipants(eventID);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
          <span className="text-sm text-slate-400">Loading your events...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="content-wrap">
        <div className="glass-card mb-8 flex flex-col gap-4 p-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="badge-soft mb-2">Event Owner Dashboard</span>
            <h1 className="text-3xl font-bold text-white">My Events</h1>
            <p className="mt-2 text-sm text-slate-300">View all events you created and see their participants.</p>
          </div>
          <button onClick={() => navigate('/create-event')} className="btn-primary">
            + Create Event
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </div>
        )}

        {!error && events.length === 0 && (
          <div className="glass-card px-6 py-14 text-center">
            <p className="mb-4 text-5xl">📅</p>
            <p className="text-slate-300">You have not created any events yet.</p>
            <button onClick={() => navigate('/create-event')} className="btn-secondary mt-4">
              Create your first event
            </button>
          </div>
        )}

        <div className="space-y-4">
          {events.map((event) => {
            const participantData = participantsByEvent[event._id];
            const isOpen = expanded[event._id];
            const isLoadingParticipants = loadingParticipants[event._id];
            const participants = Array.isArray(participantData) ? participantData : [];
            const participantError = participantData?.error;

            return (
              <div key={event._id} className="surface-card overflow-hidden">
                <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-white">{event.title}</h2>
                    <p className="mt-1 text-sm text-slate-300">
                      {new Date(event.date).toLocaleDateString()} · {event.location}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">Capacity: {event.capacity}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => navigate(`/events/${event._id}`)}
                      className="btn-secondary"
                    >
                      Open Event
                    </button>
                    <button
                      onClick={() => toggleParticipants(event._id)}
                      className="btn-primary"
                    >
                      {isOpen ? 'Hide Participants' : 'View Participants'}
                    </button>
                  </div>
                </div>

                {isOpen && (
                  <div className="border-t border-slate-700/70 bg-slate-900/50 p-5">
                    {isLoadingParticipants && (
                      <p className="text-sm text-slate-400">Loading participants...</p>
                    )}

                    {!isLoadingParticipants && participantError && (
                      <div className="rounded-xl border border-red-400/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                        {participantError}
                      </div>
                    )}

                    {!isLoadingParticipants && !participantError && participants.length === 0 && (
                      <p className="text-sm text-slate-400">No participants yet.</p>
                    )}

                    {!isLoadingParticipants && !participantError && participants.length > 0 && (
                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                          <thead>
                            <tr className="text-slate-400">
                              <th className="pb-2 font-medium">Name</th>
                              <th className="pb-2 font-medium">Email</th>
                              <th className="pb-2 font-medium">Seats</th>
                            </tr>
                          </thead>
                          <tbody>
                            {participants.map((participant) => (
                              <tr key={participant.bookingID} className="border-t border-slate-700/50 text-slate-200">
                                <td className="py-2">{participant.name}</td>
                                <td className="py-2">{participant.email}</td>
                                <td className="py-2">{participant.seats}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

```

### `frontend/src/pages/Profile.jsx`
```jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return navigate('/login');
    api.get(`/user/profile/${user.userID}`)
      .then(res => setProfile(res.data))
      .catch(() => alert('Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
    </div>
  );

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="glass-card flex flex-col items-center gap-5 p-8 text-center">
          <div className="relative">
            <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-accent-500 text-3xl font-extrabold text-white shadow-lg shadow-black/40">
              {profile?.name?.[0]?.toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full border-2 border-slate-900 bg-emerald-400"></div>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-white">{profile?.name}</h2>
            <p className="mt-0.5 text-sm text-slate-300">{profile?.email}</p>
            <p className="mt-2 rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-1 font-mono text-xs text-slate-400">{profile?._id}</p>
          </div>

          <div className="mt-1 flex w-full flex-col gap-2.5">
            <button onClick={() => navigate('/events')} className="btn-primary w-full">
              Browse Events
            </button>
            <button onClick={() => navigate('/my-events')} className="btn-secondary w-full">
              My Events
            </button>
            <button onClick={() => navigate('/my-bookings')} className="btn-secondary w-full">
              My Bookings
            </button>
            <button onClick={handleLogout} className="w-full rounded-xl border border-red-500/35 bg-red-500/10 py-3 text-sm font-semibold text-red-300 transition-all hover:bg-red-500/20">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
```

### `frontend/src/pages/Signup.jsx`
```jsx
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

export default function Signup() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      await api.post('/user/signup', data);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

  const inputClass = "input-modern";

  return (
    <div className="page-shell flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-accent-500 to-brand-500 text-2xl shadow-lg shadow-black/40">◎</div>
          <h2 className="text-3xl font-bold text-white">Create Account</h2>
          <p className="mt-1 text-sm text-slate-300">Join Evently and start booking in seconds.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="glass-card flex flex-col gap-5 p-7">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Name</label>
            <input {...register('name', { required: 'Name is required' })} placeholder="John Doe" className={inputClass} />
            {errors.name && <span className="text-red-400 text-xs">{errors.name.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Email</label>
            <input type="email" {...register('email', { required: 'Email is required' })} placeholder="john@example.com" className={inputClass} />
            {errors.email && <span className="text-red-400 text-xs">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold uppercase tracking-wider text-slate-300">Password</label>
            <input type="password" {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Min 6 characters' } })} placeholder="••••••••" className={inputClass} />
            {errors.password && <span className="text-red-400 text-xs">{errors.password.message}</span>}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary mt-1 w-full disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? 'Creating account...' : 'Create Account'}
          </button>

          <p className="text-center text-sm text-slate-300">
            Already have an account? <Link to="/login" className="font-semibold text-brand-200 transition-colors hover:text-brand-100">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
```

### `frontend/src/pages/SingleEvent.jsx`
```jsx
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function SingleEvent() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingSeats, setBookingSeats] = useState(1);
  const [bookingState, setBookingState] = useState({
    status: 'idle',
    message: '',
  });

  useEffect(() => {
    api.get(`/event/${id}`)
      .then((res) => setEvent(res.data))
      .catch((err) => {
        setBookingState({
          status: 'error',
          message: err.response?.data?.message || 'Failed to load event',
        });
      })
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (bookingState.status !== 'success' && bookingState.status !== 'error') return;

    const timer = setTimeout(() => {
      setBookingState((prev) => ({ ...prev, status: 'idle', message: '' }));
    }, 3500);

    return () => clearTimeout(timer);
  }, [bookingState.status]);

  const handleBookTicket = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setBookingState({ status: 'submitting', message: '' });
      await api.post('/booking', {
        userID: user.userID,
        eventID: event._id,
        seats: Number(bookingSeats) || 1,
      });
      setBookingState({
        status: 'success',
        message: 'Booking confirmed! Your ticket is now reserved.',
      });
    } catch (err) {
      setBookingState({
        status: 'error',
        message: err.response?.data?.message || 'Booking failed. Please try again.',
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 rounded-full border-2 border-brand-400 border-t-transparent animate-spin"></div>
          <span className="text-sm text-slate-400">Loading event details...</span>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="page-shell">
        <div className="content-wrap">
          <div className="glass-card px-6 py-14 text-center">
            <h1 className="text-2xl font-bold text-white">Event not found</h1>
            <p className="mt-2 text-slate-300">The event might have been removed or the link is invalid.</p>
            <button onClick={() => navigate('/events')} className="btn-secondary mt-5">
              Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell relative overflow-hidden">
      {bookingState.status === 'success' && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="celebrate-burst">
            {Array.from({ length: 16 }).map((_, index) => (
              <span
                key={index}
                className="celebrate-dot"
                style={{ '--angle': `${index * 22.5}deg` }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="content-wrap">
        <div className="glass-card overflow-hidden">
          <div className="border-b border-white/10 px-6 py-6 sm:px-8">
            <button onClick={() => navigate('/events')} className="btn-secondary mb-5">
              ← All Events
            </button>
            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <span className="badge-soft mb-3">Single Event</span>
                <h1 className="text-3xl font-bold text-white sm:text-4xl">{event.title}</h1>
                {event.description && <p className="mt-3 max-w-2xl text-slate-300">{event.description}</p>}
              </div>
              <div className="rounded-2xl border border-brand-300/30 bg-brand-500/10 px-4 py-3 text-sm text-brand-100">
                {new Date(event.date).toLocaleDateString('en-US', {
                  weekday: 'short',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </div>
            </div>
          </div>

          <div className="grid gap-6 px-6 py-6 sm:px-8 lg:grid-cols-[1fr_320px]">
            <div className="surface-card p-5">
              <h2 className="text-lg font-semibold text-white">Event Details</h2>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Location</p>
                  <p className="mt-1 text-sm font-medium text-white">{event.location}</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Capacity</p>
                  <p className="mt-1 text-sm font-medium text-white">{event.capacity} seats</p>
                </div>
                <div className="rounded-xl border border-slate-700 bg-slate-900/70 p-4 sm:col-span-2">
                  <p className="text-xs uppercase tracking-wider text-slate-400">Event ID</p>
                  <p className="mt-1 break-all font-mono text-xs text-brand-200">{event._id}</p>
                </div>
              </div>
            </div>

            <div className="surface-card p-5">
              <h2 className="text-lg font-semibold text-white">Book Tickets</h2>
              <p className="mt-2 text-sm text-slate-300">Reserve your spot for this event in one click.</p>

              <label className="mt-4 block text-xs font-semibold uppercase tracking-wider text-slate-300">
                Number of Seats
              </label>
              <input
                type="number"
                min="1"
                max={event.capacity || 1000}
                value={bookingSeats}
                onChange={(e) => setBookingSeats(e.target.value)}
                className="input-modern mt-2"
              />

              <button
                onClick={handleBookTicket}
                disabled={bookingState.status === 'submitting'}
                className="btn-primary mt-4 w-full disabled:cursor-not-allowed disabled:opacity-50"
              >
                {bookingState.status === 'submitting' ? 'Booking...' : 'Book Tickets'}
              </button>

              {bookingState.message && (
                <div
                  className={`mt-4 rounded-xl border px-3 py-2 text-sm ${
                    bookingState.status === 'success'
                      ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-200'
                      : 'border-red-400/40 bg-red-500/10 text-red-200'
                  }`}
                >
                  {bookingState.message}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

```

