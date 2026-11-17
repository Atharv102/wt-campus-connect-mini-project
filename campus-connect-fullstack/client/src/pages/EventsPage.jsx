import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

const imagePresets = [
  { label: 'Technical / Hackathon', value: '/img/techfest.jpg' },
  { label: 'Cultural / Nakshatra', value: '/img/nakshtra-bg.jpeg' },
  { label: 'Sports Carnival', value: '/img/sports.png' },
  { label: 'AI / Workshop', value: '/img/aiws.jpg' },
  { label: 'Alumni / Seminar', value: '/img/alumni.jpg' },
  { label: 'Chess / Indoor Games', value: '/img/chess.jpg' },
  { label: 'Campus Event Banner', value: '/img/event.png' }
];

const emptyForm = {
  title: '',
  category: 'academic',
  date: '',
  venue: 'MIT Academy of Engineering, Alandi',
  capacity: '150',
  image: '/img/techfest.jpg',
  subCategories: '',
  shortDescription: '',
  description: ''
};

export default function EventsPage() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [events, setEvents] = useState([]);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSearch(searchParams.get('search') || '');
  }, [searchParams]);

  const fetchEvents = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (category !== 'all') params.set('category', category);
    if (search.trim()) params.set('search', search.trim());

    return apiFetch(`/api/events?${params.toString()}`)
      .then((data) => {
        setEvents(data.events || []);
        setError('');
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, [category, search]);

  const handleCreateEvent = async (e) => {
    e.preventDefault();
    setFormError('');
    setSubmitting(true);
    try {
      await apiFetch('/api/events', {
        method: 'POST',
        body: {
          ...formData,
          capacity: Number(formData.capacity) || 150
        }
      });
      setShowAddModal(false);
      setFormData(emptyForm);
      await fetchEvents();
    } catch (err) {
      setFormError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEvent = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await apiFetch(`/api/events/${encodeURIComponent(id)}`, { method: 'DELETE' });
      await fetchEvents();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <header className="hero-section text-center">
        <h1>Upcoming Events</h1>
        <p>Discover and participate in exciting events at MIT Academy of Engineering</p>
        {user?.role === 'organizer' && (
          <button
            type="button"
            className="btn btn-primary btn-lg mt-2"
            onClick={() => {
              setFormError('');
              setShowAddModal(true);
            }}
          >
            <i className="bi bi-plus-circle me-2" />
            Add New Event
          </button>
        )}
      </header>

      <div className="container my-5">
        <div className="row mb-4 align-items-center">
          <div className="col-md-5">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button className="btn btn-primary" type="button">
                <i className="bi bi-search" />
              </button>
            </div>
          </div>
          <div className="col-md-7">
            <div className="d-flex flex-wrap justify-content-md-end align-items-center gap-2 mt-3 mt-md-0">
              <div className="btn-group">
                {['all', 'academic', 'cultural', 'sports'].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    className={`btn btn-outline-primary ${category === cat ? 'active' : ''}`}
                    onClick={() => setCategory(cat)}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
              {user?.role === 'organizer' && (
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => {
                    setFormError('');
                    setShowAddModal(true);
                  }}
                >
                  <i className="bi bi-plus-lg me-1" />
                  Add Event
                </button>
              )}
            </div>
          </div>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status" />
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-5">
            <p className="lead">No events found matching your search or filter.</p>
          </div>
        ) : (
          <div className="row g-4">
            {events.map((ev) => (
              <div className="col-md-6 col-lg-4" key={ev.id}>
                <div className="card h-100">
                  <img src={ev.image} className="card-img-top" alt={ev.title} />
                  <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span className={`badge bg-${ev.badgeColor}`}>{ev.badgeLabel}</span>
                      <small className="text-muted">{ev.date}</small>
                    </div>
                    <h5 className="card-title">{ev.title}</h5>
                    <p className="card-text">{ev.shortDescription}</p>
                    {ev.venue && (
                      <p className="small text-muted mb-1">
                        <i className="bi bi-geo-alt me-1" />
                        {ev.venue}
                      </p>
                    )}
                    {ev.capacity && (
                      <p className="small text-muted mb-0">
                        <i className="bi bi-people me-1" />
                        Capacity: {ev.capacity} seats
                      </p>
                    )}
                  </div>
                  <div className="card-footer bg-transparent border-top-0">
                    <div className="d-flex justify-content-between align-items-center gap-2">
                      <Link to={`/event-details?id=${ev.id}`} className="btn btn-outline-primary">
                        View Details
                      </Link>
                      <div className="d-flex gap-2">
                        <Link
                          to={`/scanner?event=${encodeURIComponent(ev.selectKey || ev.title)}`}
                          className="btn btn-primary"
                        >
                          Register
                        </Link>
                        {user?.role === 'organizer' && (
                          <button
                            type="button"
                            className="btn btn-outline-danger"
                            title="Delete Event"
                            onClick={() => handleDeleteEvent(ev.id, ev.title)}
                          >
                            <i className="bi bi-trash" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.65)', overflowY: 'auto' }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content text-dark" style={{ maxHeight: '90vh' }}>
              <div className="modal-header">
                <h5 className="modal-title">Create New Campus Event</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddModal(false)}
                />
              </div>
              <form
                onSubmit={handleCreateEvent}
                className="d-flex flex-column"
                style={{ overflow: 'hidden', flex: '1 1 auto' }}
              >
                <div className="modal-body" style={{ overflowY: 'auto' }}>
                  {formError && <div className="alert alert-danger">{formError}</div>}

                  <div className="row">
                    <div className="col-md-8 mb-3">
                      <label htmlFor="eventTitle" className="form-label">
                        Event Title
                      </label>
                      <input
                        type="text"
                        id="eventTitle"
                        className="form-control bg-white text-dark border"
                        placeholder="e.g. Cloud & DevOps Bootcamp"
                        required
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      />
                    </div>
                    <div className="col-md-4 mb-3">
                      <label htmlFor="eventCategory" className="form-label">
                        Category
                      </label>
                      <select
                        id="eventCategory"
                        className="form-select bg-white text-dark border"
                        value={formData.category}
                        onChange={(e) => {
                          const cat = e.target.value;
                          const defaultImg =
                            cat === 'cultural'
                              ? '/img/nakshtra-bg.jpeg'
                              : cat === 'sports'
                                ? '/img/sports.png'
                                : '/img/techfest.jpg';
                          setFormData({ ...formData, category: cat, image: defaultImg });
                        }}
                      >
                        <option value="academic">Academic</option>
                        <option value="cultural">Cultural</option>
                        <option value="sports">Sports</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-4 mb-3">
                      <label htmlFor="eventDate" className="form-label">
                        Event Date
                      </label>
                      <input
                        type="text"
                        id="eventDate"
                        className="form-control bg-white text-dark border"
                        placeholder="e.g. Apr 18-19, 2025"
                        required
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      />
                    </div>
                    <div className="col-md-5 mb-3">
                      <label htmlFor="eventVenue" className="form-label">
                        Venue
                      </label>
                      <input
                        type="text"
                        id="eventVenue"
                        className="form-control bg-white text-dark border"
                        placeholder="e.g. MITAOE Main Auditorium"
                        value={formData.venue}
                        onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                      />
                    </div>
                    <div className="col-md-3 mb-3">
                      <label htmlFor="eventCapacity" className="form-label">
                        Capacity
                      </label>
                      <input
                        type="number"
                        id="eventCapacity"
                        min="1"
                        className="form-control bg-white text-dark border"
                        value={formData.capacity}
                        onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="eventImage" className="form-label">
                        Banner Image
                      </label>
                      <select
                        id="eventImage"
                        className="form-select bg-white text-dark border"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      >
                        {imagePresets.map((preset) => (
                          <option key={preset.value} value={preset.value}>
                            {preset.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6 mb-3">
                      <label htmlFor="eventSubs" className="form-label">
                        Sub-Categories (comma-separated)
                      </label>
                      <input
                        type="text"
                        id="eventSubs"
                        className="form-control bg-white text-dark border"
                        placeholder="e.g. Hackathon, Workshop, Quiz"
                        value={formData.subCategories}
                        onChange={(e) =>
                          setFormData({ ...formData, subCategories: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="shortDesc" className="form-label">
                      Short Description (for Event Card)
                    </label>
                    <textarea
                      id="shortDesc"
                      rows={2}
                      className="form-control bg-white text-dark border"
                      required
                      placeholder="Brief 1-2 sentence overview of the event..."
                      value={formData.shortDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, shortDescription: e.target.value })
                      }
                    />
                  </div>

                  <div className="mb-2">
                    <label htmlFor="fullDesc" className="form-label">
                      Full Description
                    </label>
                    <textarea
                      id="fullDesc"
                      rows={3}
                      className="form-control bg-white text-dark border"
                      placeholder="Detailed schedule, eligibility, prizes, and instructions..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={() => setShowAddModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
                    {submitting ? 'Publishing...' : 'Publish Event'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
