import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import EventsPage from './pages/EventsPage';
import EventDetailsPage from './pages/EventDetailsPage';
import RegisterScannerPage from './pages/RegisterScannerPage';
import NakshatraPage from './pages/NakshatraPage';
import NakshatraFormPage from './pages/NakshatraFormPage';
import AttendancePage from './pages/AttendancePage';
import QrScannerPage from './pages/QrScannerPage';
import FeedbackPage from './pages/FeedbackPage';
import LoginPage from './pages/LoginPage';

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/events" element={<EventsPage />} />
              <Route path="/event-details" element={<EventDetailsPage />} />
              <Route path="/scanner" element={<RegisterScannerPage />} />
              <Route path="/nakshatra" element={<NakshatraPage />} />
              <Route path="/form" element={<NakshatraFormPage />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/qr-scanner" element={<QrScannerPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

