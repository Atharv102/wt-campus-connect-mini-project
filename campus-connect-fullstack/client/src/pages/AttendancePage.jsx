import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { apiFetch } from '../api';
import { useAuth } from '../context/AuthContext';

export default function AttendancePage() {
  const { user, login } = useAuth();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [attendance, setAttendance] = useState([]);
  const [studentHistory, setStudentHistory] = useState([]);
  const [summary, setSummary] = useState({ totalParticipants: 120, presentCount: 0, absentCount: 120 });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEvent, setSelectedEvent] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const [editingId, setEditingId] = useState(null);
  const [editDraft, setEditDraft] = useState({});

  const [manual, setManual] = useState({
    regId: '',
    name: '',
    collegeName: '',
    eventName: '',
    checkInTime: ''
  });
  const [statusMessage, setStatusMessage] = useState('');

  const loadData = async () => {
    try {
      const data = await apiFetch('/api/attendance');
      setAttendance(data.attendance || []);
      setStudentHistory(data.studentHistory || []);
      if (data.summary) setSummary(data.summary);
    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    try {
      await login(identifier, password);
      setIdentifier('');
      setPassword('');
    } catch (err) {
      setLoginError(err.message);
    }
  };

  const handleManualCheckIn = async (e) => {
    e.preventDefault();
    setStatusMessage('');
    try {
      await apiFetch('/api/attendance/checkin', {
        method: 'POST',
        body: manual
      });
      setManual({ regId: '', name: '', collegeName: '', eventName: '', checkInTime: '' });
      setStatusMessage('Participant checked in successfully!');
      loadData();
    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  const handleDelete = async (regId) => {
    if (!window.confirm('Are you sure you want to delete this attendance record?')) return;
    try {
      await apiFetch(`/api/attendance/${encodeURIComponent(regId)}`, { method: 'DELETE' });
      loadData();
    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  const handleSaveEdit = async (regId) => {
    try {
      await apiFetch(`/api/attendance/${encodeURIComponent(regId)}`, {
        method: 'PUT',
        body: editDraft
      });
      setEditingId(null);
      loadData();
    } catch (err) {
      setStatusMessage(err.message);
    }
  };

  const handleDownloadReport = () => {
    const rowsHtml = attendance
      .map(
        (r) =>
          `<tr><td>${r.regId}</td><td>${r.name}</td><td>${r.collegeName}</td><td>${r.eventName}</td><td>${r.checkInTime}</td><td>${r.status}</td></tr>`
      )
      .join('');
    const htmlContent = `<html><head><title>Attendance List</title><style>table{border-collapse:collapse;width:100%}th,td{border:1px solid #000;padding:8px;text-align:left}th{background:#f2f2f2}</style></head><body><h2>Attendance List</h2><table><thead><tr><th>ID</th><th>Name</th><th>College</th><th>Event</th><th>Check-in Time</th><th>Status</th></tr></thead><tbody>${rowsHtml}</tbody></table></body></html>`;
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'attendance-list.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredAttendance = attendance.filter((entry) => {
    const q = searchTerm.toLowerCase();
    return (
      entry.regId.toLowerCase().includes(q) ||
      entry.name.toLowerCase().includes(q) ||
      entry.collegeName.toLowerCase().includes(q) ||
      entry.eventName.toLowerCase().includes(q)
    );
  });

  const progressPct = summary.totalParticipants
    ? Math.min(100, Math.round((summary.presentCount / summary.totalParticipants) * 100))
    : 0;

  return (
    <>
      <header className="hero-section text-center">
        <h1>Attendance Tracking</h1>
        <p>Monitor and manage event attendance in real-time</p>
      </header>

      {!user && (
        <div className="container my-5">
          <div className="row justify-content-center">
            <div className="col-md-6 col-lg-5">
              <div className="card">
                <div className="card-body p-4 p-md-5">
                  <h3 className="card-title text-center mb-4">Attendance Portal Login</h3>
                  {loginError && <div className="alert alert-danger">{loginError}</div>}
                  <form onSubmit={handleLogin}>
                    <div className="mb-3">
                      <label htmlFor="username" className="form-label">
                        Username or Email
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        required
                        value={identifier}
                        onChange={(e) => setIdentifier(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="password" className="form-label">
                        Password
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </div>
                    <button type="submit" className="btn btn-primary w-100 mt-2">
                      Login
                    </button>
                  </form>
                  <div className="mt-4 small text-muted">
                    <div>Demo Student: <code>tejas4315</code> / <code>12345</code></div>
                    <div>Demo Organizer: <code>organizer</code> / <code>admin123</code></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {user && user.role === 'student' && (
        <div className="container my-5">
          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                  <h3 className="card-title mb-0">Welcome, {user.name}</h3>
                  <p className="text-muted mb-0">Student Attendance Dashboard</p>
                </div>
                <div className="badge bg-primary p-2 fs-6">Student View</div>
              </div>
              <div className="row mt-4">
                <div className="col-md-4 mb-3">
                  <div className="card bg-light text-dark">
                    <div className="card-body text-center">
                      <h5>Events Attended</h5>
                      <div className="display-4 fw-bold text-primary">
                        {studentHistory.filter((h) => h.status === 'Present').length}
                      </div>
                      <p className="text-muted mb-0">
                        Out of {studentHistory.length} registered events
                      </p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-light text-dark">
                    <div className="card-body text-center">
                      <h5>Attendance Rate</h5>
                      <div className="display-4 fw-bold text-success">
                        {studentHistory.length
                          ? Math.round(
                              (studentHistory.filter((h) => h.status === 'Present').length /
                                studentHistory.length) *
                                100
                            )
                          : 0}
                        %
                      </div>
                      <p className="text-muted mb-0">Overall attendance</p>
                    </div>
                  </div>
                </div>
                <div className="col-md-4 mb-3">
                  <div className="card bg-light text-dark">
                    <div className="card-body text-center">
                      <h5>Next Event</h5>
                      <div className="fw-bold">Nakshatra 2025</div>
                      <p className="text-muted mb-0">Feb 15, 2025 - 9:00 AM</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h4 className="card-title">My Event Attendance History</h4>
              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>Event Name</th>
                      <th>Date</th>
                      <th>Check-in Time</th>
                      <th>Status</th>
                      <th>Certificate</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentHistory.map((row) => (
                      <tr key={row.eventName}>
                        <td>{row.eventName}</td>
                        <td>{row.date}</td>
                        <td>{row.checkInTime}</td>
                        <td>
                          <span
                            className={`badge ${
                              row.status === 'Present' ? 'bg-success' : 'bg-danger'
                            }`}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td>
                          {row.certificateUrl ? (
                            <a
                              href={row.certificateUrl}
                              className="btn btn-sm btn-outline-primary"
                              download
                            >
                              Download
                            </a>
                          ) : (
                            <button type="button" className="btn btn-sm btn-outline-secondary" disabled>
                              N/A
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {user && user.role === 'organizer' && (
        <div className="container my-5">
          {statusMessage && (
            <div className="alert alert-info alert-dismissible fade show">
              {statusMessage}
              <button
                type="button"
                className="btn-close"
                onClick={() => setStatusMessage('')}
              />
            </div>
          )}

          <div className="card mb-4">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h3 className="card-title mb-0">Attendance Management</h3>
                  <p className="text-muted mb-0">Organizer Dashboard</p>
                </div>
                <div className="badge bg-success p-2 fs-6">Organizer View</div>
              </div>
            </div>
          </div>

          <div className="row mb-4">
            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Event Selection</h3>
                  <div className="mb-3">
                    <label htmlFor="eventSelect" className="form-label">
                      Select Event
                    </label>
                    <select
                      className="form-select"
                      id="eventSelect"
                      value={selectedEvent}
                      onChange={(e) => setSelectedEvent(e.target.value)}
                    >
                      <option value="">Choose an event...</option>
                      <option value="Nakshatra 2025">Nakshatra 2025</option>
                      <option value="Technical Symposium">Technical Symposium</option>
                      <option value="Sports Carnival">Sports Carnival</option>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Traditional Day">Traditional Day</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label htmlFor="dateSelect" className="form-label">
                      Select Date
                    </label>
                    <input
                      type="date"
                      className="form-control"
                      id="dateSelect"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                    />
                  </div>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => {
                      if (selectedEvent && selectedDate) {
                        setStatusMessage(`Showing attendance for ${selectedEvent} on ${selectedDate}`);
                      } else {
                        setStatusMessage('Please select both an event and date');
                      }
                    }}
                  >
                    Load Attendance
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card h-100">
                <div className="card-body">
                  <h3 className="card-title">Attendance Summary</h3>
                  <div className="row text-center">
                    <div className="col-4">
                      <h4>{summary.totalParticipants}</h4>
                      <p>Total Participants</p>
                    </div>
                    <div className="col-4">
                      <h4>{summary.presentCount}</h4>
                      <p>Present</p>
                    </div>
                    <div className="col-4">
                      <h4>{summary.absentCount}</h4>
                      <p>Absent</p>
                    </div>
                  </div>
                  <div className="progress mt-3">
                    <div
                      className="progress-bar bg-success"
                      role="progressbar"
                      style={{ width: `${progressPct}%` }}
                    >
                      {progressPct}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="card mb-4">
            <div className="card-body">
              <h4 className="card-title mb-3">Manual Check-in</h4>
              <form className="row g-3" onSubmit={handleManualCheckIn}>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Registration ID (e.g. REG-2025-1234)"
                    required
                    value={manual.regId}
                    onChange={(e) => setManual({ ...manual, regId: e.target.value })}
                  />
                </div>
                <div className="col-md-3">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Participant Name"
                    value={manual.name}
                    onChange={(e) => setManual({ ...manual, name: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="College"
                    value={manual.collegeName}
                    onChange={(e) => setManual({ ...manual, collegeName: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Event"
                    value={manual.eventName}
                    onChange={(e) => setManual({ ...manual, eventName: e.target.value })}
                  />
                </div>
                <div className="col-md-2">
                  <button type="submit" className="btn btn-primary w-100">
                    Check In
                  </button>
                </div>
              </form>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
                <h3 className="card-title mb-0">Attendance List</h3>
                <div className="d-flex flex-wrap gap-2">
                  <input
                    type="text"
                    className="form-control"
                    style={{ width: '240px' }}
                    placeholder="Search participants"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Link to="/qr-scanner" className="btn btn-success">
                    <i className="bi bi-qr-code-scan me-2" />
                    Scan QR
                  </Link>
                  <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={handleDownloadReport}
                  >
                    Download List
                  </button>
                </div>
              </div>

              <div className="table-responsive">
                <table className="table table-hover">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>College</th>
                      <th>Event Category</th>
                      <th>Check-in Time</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((entry) => {
                      const isEditing = editingId === entry.regId;
                      return (
                        <tr key={entry.regId}>
                          <td>{entry.regId}</td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editDraft.name}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, name: e.target.value })
                                }
                              />
                            ) : (
                              entry.name
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editDraft.collegeName}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, collegeName: e.target.value })
                                }
                              />
                            ) : (
                              entry.collegeName
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editDraft.eventName}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, eventName: e.target.value })
                                }
                              />
                            ) : (
                              entry.eventName
                            )}
                          </td>
                          <td>
                            {isEditing ? (
                              <input
                                type="text"
                                className="form-control form-control-sm"
                                value={editDraft.checkInTime}
                                onChange={(e) =>
                                  setEditDraft({ ...editDraft, checkInTime: e.target.value })
                                }
                              />
                            ) : (
                              entry.checkInTime
                            )}
                          </td>
                          <td>
                            <span className="badge bg-success">{entry.status}</span>
                          </td>
                          <td>
                            {isEditing ? (
                              <button
                                type="button"
                                className="btn btn-sm btn-success me-1"
                                onClick={() => handleSaveEdit(entry.regId)}
                              >
                                Save
                              </button>
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-primary me-1"
                                onClick={() => {
                                  setEditingId(entry.regId);
                                  setEditDraft({
                                    name: entry.name,
                                    collegeName: entry.collegeName,
                                    eventName: entry.eventName,
                                    checkInTime: entry.checkInTime
                                  });
                                }}
                              >
                                <i className="bi bi-pencil" />
                              </button>
                            )}
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleDelete(entry.regId)}
                            >
                              <i className="bi bi-trash" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className="small text-muted">
                Showing 1 to {filteredAttendance.length} of {filteredAttendance.length} entries
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

