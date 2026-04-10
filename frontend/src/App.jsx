import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext'; // ← import this
import Events from './pages/Events';
import CreateEvent from './pages/CreateEvent';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import MyBookings from './pages/MyBookings';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>          {/* ← must wrap everything */}
        <div className="min-h-screen bg-slate-950">
          <Routes>
            <Route path="/events" element={<Events />} />
            <Route path="/create-event" element={<CreateEvent />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/my-bookings" element={<MyBookings />} />
            <Route path="*" element={<Events />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}