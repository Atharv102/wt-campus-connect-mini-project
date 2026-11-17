import { useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';

export default function NakshatraFormPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    college: '',
    category: '',
    experience: 'None',
    additionalInfo: '',
    terms: false
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await apiFetch('/api/nakshatra', {
        method: 'POST',
        body: {
          fullName: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          category: formData.category,
          experience: formData.experience,
          additionalInfo: formData.additionalInfo
        }
      });
      setShowSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        college: '',
        category: '',
        experience: 'None',
        additionalInfo: '',
        terms: false
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <header className="hero-section text-center">
        <h1 id="form-header">Register for Nakshatra 2025</h1>
        <p>Join us for MIT Academy of Engineering&apos;s Annual Cultural Festival</p>
      </header>

      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card">
              <div className="card-body p-4 p-md-5">
                <h3 className="mb-4 pb-2">Registration Form</h3>
                {error && <div className="alert alert-danger">{error}</div>}
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="form-label" htmlFor="fullName">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      className="form-control"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label" htmlFor="emailAddress">
                        Email
                      </label>
                      <input
                        type="email"
                        id="emailAddress"
                        className="form-control"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label" htmlFor="phoneNumber">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phoneNumber"
                        className="form-control"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="collegeName">
                      College Name
                    </label>
                    <input
                      type="text"
                      id="collegeName"
                      className="form-control"
                      required
                      value={formData.college}
                      onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label" htmlFor="eventCategory">
                        Event Category
                      </label>
                      <select
                        className="form-select"
                        id="eventCategory"
                        required
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      >
                        <option value="" disabled>
                          Choose category
                        </option>
                        <option value="Dance">Dance</option>
                        <option value="Music">Music</option>
                        <option value="Drama">Drama</option>
                        <option value="Art">Art &amp; Photography</option>
                        <option value="Literary">Literary Events</option>
                      </select>
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label" htmlFor="experience">
                        Previous Experience
                      </label>
                      <select
                        className="form-select"
                        id="experience"
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      >
                        <option value="None">None</option>
                        <option value="Beginner">Beginner (0-1 years)</option>
                        <option value="Intermediate">Intermediate (1-3 years)</option>
                        <option value="Advanced">Advanced (3+ years)</option>
                      </select>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="additionalInfo">
                      Additional Information
                    </label>
                    <textarea
                      className="form-control"
                      id="additionalInfo"
                      rows={3}
                      placeholder="Tell us about your performance, special requirements, etc."
                      value={formData.additionalInfo}
                      onChange={(e) =>
                        setFormData({ ...formData, additionalInfo: e.target.value })
                      }
                    />
                  </div>

                  <div className="form-check mb-4">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="termsConditions"
                      required
                      checked={formData.terms}
                      onChange={(e) => setFormData({ ...formData, terms: e.target.checked })}
                    />
                    <label className="form-check-label" htmlFor="termsConditions">
                      I agree to the terms and conditions
                    </label>
                  </div>

                  <div className="text-center">
                    <button type="submit" className="btn btn-primary btn-lg" disabled={submitting}>
                      {submitting ? 'Submitting...' : 'Submit Registration'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showSuccess && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content text-dark">
              <div className="modal-header">
                <h5 className="modal-title">Registration Successful!</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSuccess(false)}
                />
              </div>
              <div className="modal-body text-center">
                <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }} />
                <h4 className="mt-3">Thank You for Registering!</h4>
                <p>
                  Your registration for Nakshatra 2025 has been received. We&apos;ll contact you
                  with further details about auditions and event schedules.
                </p>
              </div>
              <div className="modal-footer">
                <Link to="/nakshatra" className="btn btn-outline-primary">
                  Back to Nakshatra
                </Link>
                <Link to="/" className="btn btn-primary">
                  Go to Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

