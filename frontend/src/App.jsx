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