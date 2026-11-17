import { Link } from 'react-router-dom';

export default function NakshatraPage() {
  return (
    <>
      <header className="hero-section text-center">
        <h1>Nakshatra 2025</h1>
        <p>MIT Academy of Engineering&apos;s Annual Cultural Festival</p>
        <Link to="/form" className="btn btn-primary btn-lg">
          Register Now
        </Link>
      </header>

      <section className="container my-5">
        <div className="row">
          <div className="col-lg-8 mx-auto text-center">
            <h2>About Nakshatra</h2>
            <p className="lead">
              Nakshatra is MIT Academy of Engineering&apos;s flagship cultural festival, bringing
              together talent from across the country. Join us for three days of music, dance,
              drama, and more!
            </p>
            <p>
              With over 20 events across various categories, Nakshatra offers a platform for
              students to showcase their talents and compete with peers from different colleges.
              Whether you&apos;re a performer or a spectator, Nakshatra promises an unforgettable
              experience.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-light py-5 text-dark">
        <div className="container">
          <h2 className="text-center mb-4">Event Categories</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="card h-100">
                <img src="/img/dance.jpg" className="card-img-top" alt="Dance Competition" />
                <div className="card-body">
                  <h5 className="card-title">Dance</h5>
                  <p className="card-text">
                    Solo and group dance competitions across various styles including classical,
                    contemporary, and folk.
                  </p>
                  <Link to="/form" className="btn btn-primary">
                    Register for Dance
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <img src="/img/music.jpg" className="card-img-top" alt="Music Competition" />
                <div className="card-body">
                  <h5 className="card-title">Music</h5>
                  <p className="card-text">
                    Vocal and instrumental competitions for soloists and bands. Show off your
                    musical talent!
                  </p>
                  <Link to="/form" className="btn btn-primary">
                    Register for Music
                  </Link>
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="card h-100">
                <img src="/img/drama.jpg" className="card-img-top" alt="Drama Competition" />
                <div className="card-body">
                  <h5 className="card-title">Drama</h5>
                  <p className="card-text">
                    Mono-acting, skits, and full-length plays. Bring your theatrical skills to the
                    stage!
                  </p>
                  <Link to="/form" className="btn btn-primary">
                    Register for Drama
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container my-5">
        <div className="row align-items-center">
          <div className="col-lg-6">
            <h2>Audition Information</h2>
            <p>
              Auditions for Nakshatra 2025 will be held from January 15-20, 2025. All participants
              must register online before attending auditions.
            </p>
            <ul>
              <li>Dance auditions: January 15-16</li>
              <li>Music auditions: January 17-18</li>
              <li>Drama auditions: January 19-20</li>
            </ul>
            <p>Selected participants will be notified by January 25, 2025.</p>
            <Link to="/form" className="btn btn-primary">
              Register Now
            </Link>
          </div>
          <div className="col-lg-6">
            <img src="/img/audition.jpg" alt="Audition" className="img-fluid rounded" />
          </div>
        </div>
      </section>

      <section className="bg-dark text-white py-5">
        <div className="container text-center">
          <h2>Have Questions About Nakshatra?</h2>
          <p className="lead">
            Contact our team for any inquiries about registration, events, or participation.
          </p>
          <Link to="/feedback" className="btn btn-outline-light btn-lg mt-3">
            Contact Us
          </Link>
        </div>
      </section>
    </>
  );
}

