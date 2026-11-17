import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer>
      <div className="container">
        <div className="row">
          <div className="col-md-4">
            <h5>Follow Us</h5>
            <a href="https://facebook.com" target="_blank" rel="noreferrer">
              <img src="/img/facebook.png" alt="Facebook" className="social-icon" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noreferrer">
              <img src="/img/xtwitter.png" alt="Twitter" className="social-icon" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer">
              <img src="/img/instagram.png" alt="Instagram" className="social-icon" />
            </a>
          </div>
          <div className="col-md-4">
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link to="/events">Events</Link>
              </li>
              <li>
                <Link to="/nakshatra">Nakshatra</Link>
              </li>
              <li>
                <Link to="/attendance">Attendance</Link>
              </li>
              <li>
                <Link to="/feedback">Feedback</Link>
              </li>
              <li>
                <Link to="/scanner">QR Scanner</Link>
              </li>
            </ul>
          </div>
          <div className="col-md-4">
            <h5>Contact Us</h5>
            <p>MIT Academy of Engineering, Alandi</p>
            <p>Email: info@campusconnect.com</p>
            <p>Phone: +123 456 7890</p>
          </div>
        </div>
        <div className="copyright">
          <p>&copy; 2025 Campus Connect | All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

