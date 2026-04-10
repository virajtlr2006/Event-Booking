import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/database.js';
import UserRouter from './features/user/user.router.js';
import EventRouter from './features/events/event.router.js';
import BookingRouter from './features/booking/booking.router.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use("/user",UserRouter)
app.use("/event",EventRouter)
app.use("/booking",BookingRouter)
export default app;