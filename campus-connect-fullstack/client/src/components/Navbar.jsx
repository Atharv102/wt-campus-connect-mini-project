import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { mode, toggleMode } = useTheme();
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    const trimmed = searchQuery.trim();
    if (trimmed) {
      navigate(`/events?search=${encodeURIComponent(trimmed)}`);
    } else {
      navigate('/events');
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark">
      <div className="container">
        <Link className="navbar-brand" to="/">
          Campus Connect
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <NavLink className="nav-link" to="/" end>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/events">
                Events
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/scanner">
                Register
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/nakshatra">
                Nakshatra
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/attendance">
                Attendance
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/feedback">
                Feedback
              </NavLink>
            </li>
            <li className="nav-item">
              <form className="d-flex" onSubmit={handleSearch}>
                <div className="search-bar">
                  <input
                    className="form-control"
                    type="search"
                    placeholder="Search"
                    aria-label="Search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="input-group-text border-0 bg-transparent"
                    aria-label="Submit search"
                  >
                    <i className="bi bi-search" />
                  </button>
                </div>
              </form>
            </li>
            <li className="nav-item d-flex align-items-center ms-3">
              <button
                type="button"
                id="modeToggle"
                className="btn btn-outline-light btn-sm"
                title="Toggle Dark/Light Mode"
                onClick={toggleMode}
              >
                <i className={`bi ${mode === 'light' ? 'bi-sun-fill' : 'bi-moon-fill'}`} id="modeIcon" />
              </button>
            </li>
            <li className="nav-item d-flex align-items-center">
              {user ? (
                <div className="d-flex align-items-center ms-lg-3 mt-2 mt-lg-0 gap-2">
                  <span className="badge bg-secondary">{user.name}</span>
                  <button
                    type="button"
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link to="/login" className="btn btn-primary ms-lg-3 mt-2 mt-lg-0">
                  Log in
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

