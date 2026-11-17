import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

export default function QrScannerPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user || user.role !== 'organizer') return;

    const scanner = new Html5QrcodeScanner(
      'my-qr-reader',
      { fps: 10, qrbox: 250 },
      false
    );

    scanner.render(
      async (decodedText) => {
        try {
          const parsed = JSON.parse(decodedText);
          await apiFetch('/api/attendance/checkin', {
            method: 'POST',
            body: {
              regId: parsed.id,
              name: parsed.name,
              collegeName: parsed.college,
              eventName: parsed.event
            }
          });
          setMessage(`Checked in participant: ${parsed.name} (${parsed.id})`);
          scanner.clear().catch(() => {});
          setTimeout(() => navigate('/attendance'), 1200);
        } catch (err) {
          setError(err.message || 'Invalid QR code data.');
        }
      },
      () => {
        // Ignore frame decode errors while scanning
      }
    );

    return () => {
      scanner.clear().catch(() => {});
    };
  }, [user, navigate]);

  return (
    <div className="container my-5" style={{ maxWidth: '560px' }}>
      <div className="card p-4 text-center">
        <h2 className="mb-3">Campus Connect - QR Check in</h2>
        {!user || user.role !== 'organizer' ? (
          <div className="py-3">
            <div className="alert alert-warning">
              Organizer login is required to scan attendee QR codes.
            </div>
            <Link to="/attendance" className="btn btn-primary">
              Go to Attendance Login
            </Link>
          </div>
        ) : (
          <>
            {message && <div className="alert alert-success">{message}</div>}
            {error && <div className="alert alert-danger">{error}</div>}
            <div id="my-qr-reader" className="bg-white text-dark rounded p-2" />
            <div className="mt-3">
              <Link to="/attendance" className="btn btn-outline-secondary">
                Back to Attendance
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

