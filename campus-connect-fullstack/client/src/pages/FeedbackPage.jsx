import { useEffect, useState } from 'react';
import { apiFetch } from '../api';

export default function FeedbackPage() {
  const [stats, setStats] = useState({
    submissions: '500+',
    averageRating: '4.7',
    eventsImproved: '20+',
    satisfactionRate: '98%'
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    event: '',
    rating: 0,
    comments: '',
    suggestions: '',
    contactCheck: false
  });
  const [hoverRating, setHoverRating] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadStats = () => {
    apiFetch('/api/feedback')
      .then((data) => {
        if (data.stats) setStats(data.stats);
      })
      .catch(() => {});
  };

  useEffect(() => {
    loadStats();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.rating) {
      setError('Please select a star rating.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await apiFetch('/api/feedback', {
        method: 'POST',
        body: formData
      });
      setShowModal(true);
      setFormData({
        name: '',
        email: '',
        event: '',
        rating: 0,
        comments: '',
        suggestions: '',
        contactCheck: false
      });
      loadStats();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="hero-section text-center">
        <div className="container">
          <h1>Your Opinion Matters</h1>
          <p className="lead">
            Help us improve our events by sharing your feedback and suggestions
          </p>
        </div>
      </header>

      <div className="container">
        <div className="bg-light text-dark rounded-3 p-4 mb-4">
          <div className="row text-center">
            <div className="col-md-3 p-2">
              <div className="fs-2 fw-bold text-primary">{stats.submissions}</div>
              <div className="small text-muted">FEEDBACK SUBMISSIONS</div>
            </div>
            <div className="col-md-3 p-2">
              <div className="fs-2 fw-bold text-primary">{stats.averageRating}</div>
              <div className="small text-muted">AVERAGE RATING</div>
            </div>
            <div className="col-md-3 p-2">
              <div className="fs-2 fw-bold text-primary">{stats.eventsImproved}</div>
              <div className="small text-muted">EVENTS IMPROVED</div>
            </div>
            <div className="col-md-3 p-2">
              <div className="fs-2 fw-bold text-primary">{stats.satisfactionRate}</div>
              <div className="small text-muted">SATISFACTION RATE</div>
            </div>
          </div>
        </div>
      </div>

      <section id="feedback-form" className="container my-5">
        <div className="row w-100">
          <div className="col-lg-8 mx-auto text-center mb-4">
            <h2>Share Your Experience</h2>
            <p className="text-muted">Your feedback helps us create better events for everyone</p>
          </div>
        </div>
        <div className="row justify-content-center w-100">
          <div className="col-12 col-md-10 col-lg-8">
            <div className="card">
              <div className="card-body p-4 p-md-5">
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label htmlFor="name" className="form-label">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label htmlFor="email" className="form-label">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="event" className="form-label">
                      Event Attended
                    </label>
                    <select
                      className="form-select"
                      id="event"
                      required
                      value={formData.event}
                      onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                    >
                      <option value="" disabled>
                        Select an event
                      </option>
                      <option value="Technical Symposium">Technical Symposium</option>
                      <option value="Cultural Fest">Cultural Fest</option>
                      <option value="Sports Meet">Sports Meet</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Traditional Day">Traditional Day</option>
                      <option value="Google Developer Groups Guest Lecture">
                        Google Developer Groups Guest Lecture
                      </option>
                      <option value="Nakshatra">Nakshatra 2025</option>
                    </select>
                  </div>

                  <div className="mb-4">
                    <label className="form-label d-block">Rate Your Experience</label>
                    <div className="fs-3 text-warning">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <i
                          key={star}
                          className={`bi ${
                            (hoverRating || formData.rating) >= star ? 'bi-star-fill' : 'bi-star'
                          } me-2`}
                          style={{ cursor: 'pointer' }}
                          onMouseEnter={() => setHoverRating(star)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setFormData({ ...formData, rating: star })}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label htmlFor="comments" className="form-label">
                      Comments
                    </label>
                    <textarea
                      className="form-control"
                      id="comments"
                      rows={4}
                      required
                      placeholder="Please share your thoughts, suggestions, or any issues you experienced..."
                      value={formData.comments}
                      onChange={(e) => setFormData({ ...formData, comments: e.target.value })}
                    />
                  </div>

                  <div className="mb-4">
                    <label htmlFor="suggestions" className="form-label">
                      Suggestions for Improvement
                    </label>
                    <textarea
                      className="form-control"
                      id="suggestions"
                      rows={3}
                      placeholder="How can we make our events better?"
                      value={formData.suggestions}
                      onChange={(e) => setFormData({ ...formData, suggestions: e.target.value })}
                    />
                  </div>

                  <div className="mb-4 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input"
                      id="contactCheck"
                      checked={formData.contactCheck}
                      onChange={(e) => setFormData({ ...formData, contactCheck: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="contactCheck">
                      I would like to be contacted about my feedback
                    </label>
                  </div>

                  <div className="text-center">
                    <button
                      type="submit"
                      className="btn btn-primary btn-lg px-5"
                      disabled={submitting}
                    >
                      {submitting ? 'Submitting...' : 'Submit Feedback'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center mb-4">
            <h2>Get in Touch</h2>
            <p className="text-muted">
              Have questions or need assistance? Our team is here to help
            </p>
          </div>
        </div>
        <div className="row justify-content-center">
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-envelope-fill text-primary fs-1 mb-3 d-block" />
                <h4>Email Us</h4>
                <p className="text-muted">We&apos;ll respond within 24 hours</p>
                <a href="mailto:info@campusconnect.com" className="text-decoration-none">
                  info@campusconnect.com
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-telephone-fill text-primary fs-1 mb-3 d-block" />
                <h4>Call Us</h4>
                <p className="text-muted">Mon-Fri from 9am to 5pm</p>
                <a href="tel:+1234567890" className="text-decoration-none">
                  +123 456 7890
                </a>
              </div>
            </div>
          </div>
          <div className="col-md-4 mb-4">
            <div className="card h-100">
              <div className="card-body text-center p-4">
                <i className="bi bi-geo-alt-fill text-primary fs-1 mb-3 d-block" />
                <h4>Visit Us</h4>
                <p className="text-muted">Come say hello at our campus</p>
                <p className="mb-0">MIT Academy of Engineering, Alandi</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark">
              <div className="modal-header border-0">
                <h5 className="modal-title">Thank You!</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body text-center py-4">
                <i className="bi bi-check-circle-fill text-success fs-1 mb-3 d-block" />
                <h4>Feedback Submitted Successfully</h4>
                <p className="mb-0">
                  We appreciate your input and will use it to improve our future events.
                </p>
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => setShowModal(false)}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

