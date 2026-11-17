import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

const eventCategories = {
  'Nakshatra 2025': [
    'Dance Competition',
    'Music Performance',
    'Drama & Theatre',
    'Fashion Show',
    'Art & Photography',
    'Literary Events'
  ],
  'TechFest 2025': ['Workshops', 'Hackathons', 'Competitions', 'Technical Talks'],
  'Sports Meet 2025': ['Cricket', 'Football', 'Basketball', 'Athletics', 'Volleyball', 'Chess'],
  'AI Workshop': ['Machine Learning', 'Deep Learning', 'AI Fundamentals'],
  'Alumni Meet': ['Networking', 'Talks', 'Cultural Events'],
  'Chess Tournament': ['Rapid', 'Blitz', 'Classical'],
  'Sports Carnival': ['Cricket', 'Football', 'Basketball', 'Volleyball', 'Athletics', 'Chess'],
  'Technical Symposium': [
    'Hackathon',
    'Paper Presentation',
    'Project Exhibition',
    'Coding Competition',
    'Robotics',
    'Workshop'
  ]
};

const selectableEvents = [
  {
    key: 'Nakshatra 2025',
    title: 'Nakshatra 2025',
    badge: 'Cultural',
    badgeColor: 'primary',
    date: 'Feb 15-17, 2025',
    img: '/img/nakshtra-bg.jpeg',
    desc: 'Annual cultural festival featuring dance, music, drama, and more. Join us for three days of excitement and talent showcase.'
  },
  {
    key: 'TechFest 2025',
    title: 'TechFest 2025',
    badge: 'Academic',
    badgeColor: 'success',
    date: 'Jan 20-22, 2025',
    img: '/img/techfest.jpg',
    desc: 'Technical festival with workshops, hackathons, and competitions. Showcase your technical skills and win exciting prizes.'
  },
  {
    key: 'Sports Meet 2025',
    title: 'Sports Meet 2025',
    badge: 'Sports',
    badgeColor: 'danger',
    date: 'Mar 10-15, 2025',
    img: '/img/sports.png',
    desc: 'Annual sports competition featuring cricket, football, basketball, athletics, and more. Participate and show your sporting spirit.'
  },
  {
    key: 'AI Workshop',
    title: 'AI & Machine Learning Workshop',
    badge: 'Academic',
    badgeColor: 'success',
    date: 'Dec 5, 2024',
    img: '/img/aiws.jpg',
    desc: 'Hands-on workshop on artificial intelligence and machine learning fundamentals with industry experts.'
  },
  {
    key: 'Alumni Meet',
    title: 'Alumni Meet 2024',
    badge: 'Cultural',
    badgeColor: 'primary',
    date: 'Dec 20, 2024',
    img: '/img/alumni.jpg',
    desc: 'Annual gathering of MIT Academy of Engineering alumni. Network with former students and share experiences.'
  },
  {
    key: 'Chess Tournament',
    title: 'Inter-College Chess Tournament',
    badge: 'Sports',
    badgeColor: 'danger',
    date: 'Nov 25, 2024',
    img: '/img/chess.jpg',
    desc: 'Strategic chess competition open to all colleges. Test your skills and compete for the championship title.'
  }
];

export default function RegisterScannerPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const formRef = useRef(null);

  const [eventsList, setEventsList] = useState([]);
  const [activeTab, setActiveTab] = useState('register');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    category: '',
    terms: false
  });
  const [currentRegistration, setCurrentRegistration] = useState(() => {
    const saved = localStorage.getItem('eventRegistration');
    return saved ? JSON.parse(saved) : null;
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [manualId, setManualId] = useState('');
  const [manualStatus, setManualStatus] = useState('');

  useEffect(() => {
    apiFetch('/api/events')
      .then((data) => setEventsList(data.events || []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    const eventFromQuery = searchParams.get('event');
    if (eventFromQuery) {
      setSelectedEvent(eventFromQuery);
      setActiveTab('register');
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else if (currentRegistration) {
      setActiveTab('qr');
    }
  }, [searchParams]);

  const handleSelectEvent = (eventKey) => {
    setSelectedEvent(eventKey);
    setFormState((prev) => ({ ...prev, category: '' }));
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const data = await apiFetch('/api/registrations', {
        method: 'POST',
        body: {
          name: formState.name,
          email: formState.email,
          phone: formState.phone,
          college: formState.college,
          event: selectedEvent,
          category: formState.category
        }
      });
      setCurrentRegistration(data.registration);
      localStorage.setItem('eventRegistration', JSON.stringify(data.registration));
      setActiveTab('qr');
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDownloadQr = () => {
    const canvas = document.querySelector('#qrcode canvas');
    if (!canvas || !currentRegistration) return;
    const link = document.createElement('a');
    link.download = `qr-code-${currentRegistration.id}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  const handleManualVerify = async () => {
    if (!manualId.trim()) return;
    setManualStatus('');
    try {
      await apiFetch('/api/attendance/checkin', {
        method: 'POST',
        body: { regId: manualId.trim() }
      });
      setManualStatus(`Checked in ${manualId.trim()} successfully.`);
      setManualId('');
    } catch (err) {
      setManualStatus(err.message);
    }
  };

  const displayedEvents =
    eventsList.length > 0
      ? eventsList.map((e) => ({
          key: e.selectKey || e.title,
          title: e.title,
          badge: e.badgeLabel,
          badgeColor: e.badgeColor,
          date: e.date,
          img: e.image,
          desc: e.shortDescription,
          subCategories: e.subCategories
        }))
      : selectableEvents;

  const matchedEvent = displayedEvents.find((e) => e.key === selectedEvent || e.title === selectedEvent);
  const categories =
    matchedEvent?.subCategories || eventCategories[selectedEvent] || ['General Participation'];

  return (
    <>
      <header className="hero-section text-center">
        <h1>Event QR Code System</h1>
        <p>Register for events and get your unique QR code for easy check-in</p>
      </header>

      <div className="container my-5">
        <ul className="nav nav-tabs mb-4" role="tablist">
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'register' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('register')}
            >
              Register for Event
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'qr' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('qr')}
            >
              My QR Code
            </button>
          </li>
          <li className="nav-item" role="presentation">
            <button
              className={`nav-link ${activeTab === 'scan' ? 'active' : ''}`}
              type="button"
              onClick={() => setActiveTab('scan')}
            >
              Scan QR Code
            </button>
          </li>
        </ul>

        {activeTab === 'register' && (
          <div>
            <h3 className="mb-4">Select an Event to Register</h3>
            <div className="row g-4">
              {displayedEvents.map((ev) => (
                <div className="col-md-4" key={ev.key}>
                  <div className="card event-card h-100">
                    <img src={ev.img} className="card-img-top" alt={ev.title} />
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center mb-2">
                        <span className={`badge bg-${ev.badgeColor}`}>{ev.badge}</span>
                        <small className="text-muted">{ev.date}</small>
                      </div>
                      <h5 className="card-title">{ev.title}</h5>
                      <p className="card-text">{ev.desc}</p>
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => handleSelectEvent(ev.key)}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {selectedEvent && (
              <div ref={formRef} className="mt-5 card p-4">
                <h4 className="mb-4">
                  Register for <span className="text-primary">{selectedEvent}</span>
                </h4>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="fullName" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="fullName"
                        required
                        value={formState.name}
                        onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        Email
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={formState.email}
                        onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="phone" className="form-label">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="form-control"
                        id="phone"
                        required
                        value={formState.phone}
                        onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="college" className="form-label">
                        College
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="college"
                        required
                        value={formState.college}
                        onChange={(e) => setFormState({ ...formState, college: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="eventCategory" className="form-label">
                      Event Category
                    </label>
                    <select
                      className="form-select"
                      id="eventCategory"
                      required
                      value={formState.category}
                      onChange={(e) => setFormState({ ...formState, category: e.target.value })}
                    >
                      <option value="" disabled>
                        Select category
                      </option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="termsCheck"
                      required
                      checked={formState.terms}
                      onChange={(e) => setFormState({ ...formState, terms: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                      I agree to the terms and conditions
                    </label>
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Generating...' : 'Register & Generate QR Code'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {activeTab === 'qr' && (
          <div>
            {!currentRegistration ? (
              <div className="text-center py-5">
                <i className="bi bi-qr-code fs-1 text-secondary mb-3 d-block" />
                <h4>No QR Code Available</h4>
                <p>Please register for an event first to generate your QR code.</p>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setActiveTab('register')}
                >
                  Register Now
                </button>
              </div>
            ) : (
              <div className="row g-4">
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body">
                      <h4 className="card-title mb-4">Your Registration Details</h4>
                      <p>
                        <strong>Name:</strong> {currentRegistration.name}
                      </p>
                      <p>
                        <strong>Email:</strong> {currentRegistration.email}
                      </p>
                      <p>
                        <strong>Event:</strong> {currentRegistration.event}
                      </p>
                      <p>
                        <strong>Category:</strong> {currentRegistration.category}
                      </p>
                      <p>
                        <strong>Registration ID:</strong> {currentRegistration.id}
                      </p>
                      <div className="mt-4 d-flex flex-wrap gap-2">
                        <button type="button" className="btn btn-primary" onClick={handleDownloadQr}>
                          Download QR Code
                        </button>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setActiveTab('register');
                            setFormState({
                              name: '',
                              email: '',
                              phone: '',
                              college: '',
                              category: '',
                              terms: false
                            });
                          }}
                        >
                          Register for Another Event
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="card h-100">
                    <div className="card-body text-center">
                      <h4 className="card-title mb-4">Your QR Code</h4>
                      <p>Present this QR code at the event for check-in</p>
                      <div
                        id="qrcode"
                        className="d-inline-block p-3 bg-white rounded"
                      >
                        <QRCodeCanvas value={JSON.stringify(currentRegistration)} size={200} />
                      </div>
                      <p className="small text-muted mt-2">
                        Registration ID: {currentRegistration.id}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'scan' && (
          <div className="row g-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="mb-3">Scan Attendee QR Code</h4>
                  <p>This section is for event organizers to scan attendee QR codes for check-in.</p>
                  {user?.role === 'organizer' ? (
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => navigate('/qr-scanner')}
                    >
                      <i className="bi bi-qr-code-scan me-2" />
                      Open QR Scanner
                    </button>
                  ) : (
                    <>
                      <div className="alert alert-info">
                        <i className="bi bi-info-circle-fill me-2" />
                        You need organizer privileges to use this feature.
                      </div>
                      <Link to="/login" className="btn btn-outline-primary">
                        Login as Organizer
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h4 className="mb-3">Manual Check-in</h4>
                  <p>Enter registration ID manually if QR code is not scannable.</p>
                  <div className="input-group mb-3">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Enter Registration ID"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      disabled={user?.role !== 'organizer'}
                    />
                    <button
                      className="btn btn-primary"
                      type="button"
                      disabled={user?.role !== 'organizer'}
                      onClick={handleManualVerify}
                    >
                      Verify
                    </button>
                  </div>
                  <div className="form-text">Example: REG-2025-1234</div>
                  {manualStatus && <div className="alert alert-info mt-3 mb-0">{manualStatus}</div>}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

