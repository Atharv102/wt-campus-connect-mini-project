import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <>
      <header className="hero-section text-center">
        <h1>Welcome to Campus Connect</h1>
        <p>Your comprehensive platform for college event management</p>
        <Link to="/events" className="btn btn-primary btn-lg">
          Explore Events
        </Link>
      </header>

      <div className="container">
        <section className="section-container">
          <div className="section-text">
            <h2>Discover Campus Events</h2>
            <p>
              Campus Connect is your one-stop platform for all college events, including cultural
              fests, technical hackathons, sports meets, and academic seminars at MIT Academy of
              Engineering, Alandi.
            </p>
            <p>
              We bring students together through technology, making event management seamless and
              engaging. Our platform helps you stay updated, register easily, and never miss an
              exciting event again.
            </p>
            <Link to="/events" className="btn btn-primary mt-3">
              View All Events
            </Link>
          </div>
          <div className="section-image">
            <img src="/img/event.png" alt="Campus Event" className="img-fluid" />
          </div>
        </section>

        <section className="section-container">
          <div className="section-image">
            <img src="/img/Nakshtra 2025.png" alt="Nakshatra Event" className="img-fluid" />
          </div>
          <div className="section-text">
            <h2>Nakshatra 2025</h2>
            <p>
              Don&apos;t miss MIT Academy of Engineering&apos;s flagship cultural festival! Nakshatra
              2025 brings together talent from across colleges for competitions in dance, music,
              drama, and more.
            </p>
            <p>
              Registration is now open for all events. Showcase your talent and win exciting
              prizes!
            </p>
            <Link to="/form" className="btn btn-primary mt-3">
              Register for Nakshatra
            </Link>
          </div>
        </section>

        <section className="section-container">
          <div className="section-text">
            <h2>Sports Carnival</h2>
            <p>
              Get ready for the most exciting sports event of the year! Join us for a week-long
              celebration of athletic excellence featuring cricket, football, basketball, volleyball,
              and more.
            </p>
            <p>
              Compete with the best teams, showcase your skills, and win exciting prizes. Register
              now for inter-department tournaments and professional coaching workshops.
            </p>
            <Link to="/scanner" className="btn btn-primary mt-3">
              Register for Sports Carnival
            </Link>
          </div>
          <div className="section-image">
            <img src="/img/sports.png" alt="Sports Carnival" className="img-fluid" />
          </div>
        </section>

        <section className="section-container">
          <div className="section-image">
            <img src="/img/qr.png" alt="QR Code Scanner" className="img-fluid" />
          </div>
          <div className="section-text">
            <h2>QR-Based Attendance</h2>
            <p>
              We&apos;ve revolutionized event attendance tracking with our QR code system. No more
              paper sheets or manual entries!
            </p>
            <p>
              Each registered participant receives a unique QR code that can be scanned at event
              venues for instant check-in. Organizers can track attendance in real-time and generate
              comprehensive reports.
            </p>
            <Link to="/scanner" className="btn btn-primary mt-3">
              Try QR Scanner
            </Link>
          </div>
        </section>

        <section className="section-container">
          <div className="section-text">
            <h2>Share Your Feedback</h2>
            <p>
              Your opinion matters to us! Help us improve future events by sharing your feedback and
              suggestions.
            </p>
            <p>
              Our feedback system allows participants to rate events, provide comments, and suggest
              improvements. This valuable input helps organizers enhance the quality of future
              events.
            </p>
            <Link to="/feedback" className="btn btn-primary mt-3">
              Give Feedback
            </Link>
          </div>
          <div className="section-image">
            <img src="/img/feed.jpg" alt="Feedback" className="img-fluid" />
          </div>
        </section>
      </div>
    </>
  );
}

