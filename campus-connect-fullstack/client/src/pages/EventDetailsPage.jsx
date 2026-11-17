import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../api';

const staticDetails = [
  {
    id: 'technical-symposium',
    title: 'Technical Symposium',
    date: 'January 15, 2025',
    category: 'Technical',
    description:
      'Join us for a day of technical talks, workshops, and networking with industry experts.'
  },
  {
    id: 'cultural-fest',
    title: 'Cultural Fest',
    date: 'February 10, 2025',
    category: 'Cultural',
    description:
      'Celebrate the diverse cultures of our campus with performances, food stalls, and more.'
  },
  {
    id: 'sports-meet',
    title: 'Sports Meet',
    date: 'March 25, 2025',
    category: 'Sports',
    description: 'Compete in various sports events and showcase your athletic skills.'
  },
  {
    id: 'hackathon',
    title: 'Hackathon',
    date: 'April 5, 2025',
    category: 'Technical',
    description:
      'Participate in our 24-hour hackathon and develop innovative solutions to real-world problems.'
  },
  {
    id: 'traditional-day',
    title: 'Traditional Day',
    date: 'May 20, 2025',
    category: 'Cultural',
    description:
      'Celebrate our cultural heritage with traditional attire, music, and dance performances.'
  },
  {
    id: 'gdg-lecture',
    title: 'Google Developer Groups Guest Lecture',
    date: 'June 15, 2025',
    category: 'Technical',
    description:
      'Attend a guest lecture by Google Developer Groups and learn about the latest trends in technology.'
  }
];

export default function EventDetailsPage() {
  const [searchParams] = useSearchParams();
  const eventId = searchParams.get('id');
  const [selectedEvent, setSelectedEvent] = useState(null);

  useEffect(() => {
    if (!eventId) {
      setSelectedEvent(null);
      return;
    }
    apiFetch(`/api/events/${encodeURIComponent(eventId)}`)
      .then((data) => setSelectedEvent(data.event))
      .catch(() => setSelectedEvent(null));
  }, [eventId]);

  return (
    <>
      <header className="hero-section text-center">
        <h1 style={{ fontWeight: 'bolder' }}>Event Details</h1>
        <p>Find out more about each event happening in 2025</p>
      </header>

      {selectedEvent && (
        <section className="container my-5">
          <div className="card p-4">
            <div className="row align-items-center">
              <div className="col-md-5 mb-3 mb-md-0">
                <img
                  src={selectedEvent.image}
                  alt={selectedEvent.title}
                  className="img-fluid rounded"
                />
              </div>
              <div className="col-md-7">
                <span className={`badge bg-${selectedEvent.badgeColor} mb-2`}>
                  {selectedEvent.badgeLabel}
                </span>
                <h2>{selectedEvent.title}</h2>
                <p>
                  <strong>Date:</strong> {selectedEvent.date}
                </p>
                {selectedEvent.venue && (
                  <p>
                    <strong>Venue:</strong> {selectedEvent.venue}
                  </p>
                )}
                {selectedEvent.capacity && (
                  <p>
                    <strong>Capacity:</strong> {selectedEvent.capacity} seats
                  </p>
                )}
                <p>{selectedEvent.description}</p>
                {selectedEvent.subCategories?.length > 0 && (
                  <p>
                    <strong>Categories:</strong> {selectedEvent.subCategories.join(', ')}
                  </p>
                )}
                <Link
                  to={`/scanner?event=${encodeURIComponent(selectedEvent.selectKey || selectedEvent.title)}`}
                  className="btn btn-primary me-2"
                >
                  Register Now
                </Link>
                <Link to="/events" className="btn btn-outline-secondary">
                  All Events
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {staticDetails.map((item) => (
        <section key={item.id} id={item.id} className="container my-5">
          <div className="row">
            <div className="col-12">
              <h2>{item.title}</h2>
              <p>Date: {item.date}</p>
              <p>Category: {item.category}</p>
              <p>Description: {item.description}</p>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}

