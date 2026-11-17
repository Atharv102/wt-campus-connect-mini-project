# CampusConnect &mdash; Integrated College Event Lifecycle Management & QR Attendance System

> **Course:** Web Technology Mini-Project (T.Y. B.Tech Computer Engineering)  
> **Institution:** MIT Academy of Engineering (MIT AOE), Alandi, Pune  
> **Student:** Atharv Jadhav  
> **PRN:** `202401100102`  
> **Division:** B  
> **GitHub Repository:** [https://github.com/Atharv102/wt-campus-connect-mini-project](https://github.com/Atharv102/wt-campus-connect-mini-project)  
> **Live Deployment:** [https://Atharv102.github.io/wt-campus-connect-mini-project/](https://Atharv102.github.io/wt-campus-connect-mini-project/)

---

## 1. Problem Statement & Real-World Motivation
In collegiate institutions such as MIT Academy of Engineering, organizing academic, cultural (e.g. *Nakshatra 2025*), and sports events is plagued by operational hurdles:
- **Dispersed Announcements:** Event details are scattered across disparate social messaging groups and paper flyers.
- **Congested Check-In Queues:** Manual paper attendance registers cause bottleneck delays, proxy attendances, and crowd hazards during major festivals with 1000+ attendees.
- **Unverified Attendance Logs:** Lost or unreadable paper lists make attendance audit and certification difficult.
- **Low Feedback Engagement:** Delayed manual feedback yields negligible response rates, preventing qualitative institutional audit.

**CampusConnect** solves these real-world problems by delivering an end-to-end full-stack web application with instant event filtering, digital registration, dynamic cryptographic QR code ticket generation, high-speed camera optical attendance check-in, organizer dashboards, and post-event analytics.

---

## 2. Technologies Used
- **Frontend Presentation:** React 18, Vite 5, React Router v6, Bootstrap 5, Bootstrap Icons, Responsive CSS3 Grid.
- **Camera & Barcode Processing:** `html5-qrcode` (webcam/mobile camera scanning) and `qrcode.react` (vector SVG QR rendering).
- **Backend Application Server:** Node.js, Express.js 4.21.2 (stateless RESTful API, asynchronous event loop, CORS middleware).
- **Authentication & Security:** JSON Web Tokens (JWT), role-based access control (Student vs. Organizer), duplicate scan prevention (HTTP 409).
- **Database Persistence:** File-backed NoSQL document store (`db.json` with collections: `users`, `events`, `registrations`, `nakshatraRegistrations`, `attendance`, `feedbacks`).
- **Cloud Hosting & VCS:** Git, GitHub (Atharv102), and GitHub Pages static hosting.

---

## 3. Major Features
1. **Interactive Event Discovery:** Browse festivals by Academic, Cultural, or Sports categories with live search and rulebook PDF downloads.
2. **One-Click Event Registration Modal:** Pre-selects events, subcategories (e.g. Solo Dance, Hackathon), and validates contact numbers.
3. **Dynamic QR Ticket Generation:** Dynamically renders encrypted SVG/Canvas QR passes with unique `REG-2025-xxxx` badges.
4. **Camera-Based Optical Check-In:** Organizers scan physical QR badges via device webcams at 10 FPS with sub-second verification.
5. **Real-Time Attendance Dashboard:** Live headcount tracker with Present/Absent counts and duplicate entry prevention (HTTP 409).
6. **Event Feedback & Analytics Engine:** 5-star rating system, qualitative commentary, and satisfaction metric calculations.

---

## 4. Database Collections & Architecture
The NoSQL document store (`server/data/db.json`) manages six collections:
- `users`: User identity and roles (`student` vs. `organizer`).
- `events`: College event catalog with categories, dates, venues, capacities, and subcategories.
- `registrations`: Student enrollment records mapped to unique `REG-2025-xxxx` IDs.
- `nakshatraRegistrations`: Dedicated registration records for MIT AOE's Nakshatra cultural festival.
- `attendance`: Verified check-in logs containing timestamps, attendee names, and duplicate locks.
- `feedbacks`: Star ratings, qualitative feedback, and event satisfaction metrics.

---

## 5. RESTful API Endpoints

| HTTP Verb | Endpoint URI | Auth Level | Purpose | Status Codes |
|:---:|:---|:---:|:---|:---:|
| `GET` | `/api/health` | Public | Server uptime & timestamp health probe | `200 OK` |
| `POST` | `/api/auth/login` | Public | Verify credentials & issue signed JWT | `200`, `400`, `401` |
| `POST` | `/api/auth/register` | Public | Register student with unique email check | `201`, `400`, `409` |
| `GET` | `/api/events` | Public | Fetch events with category & search filter | `200 OK` |
| `POST` | `/api/events` | Organizer | Create new college event with capacity | `201`, `400`, `403` |
| `POST` | `/api/registrations` | Public | Validate enrollment & issue `REG-xxxx` ID | `201`, `400` |
| `GET` | `/api/attendance` | Public | Fetch live attendance summary & logs | `200 OK` |
| `POST` | `/api/attendance/checkin` | Organizer | Optical QR scan check-in; duplicate lockout | `201`, `400`, `409` |
| `POST` | `/api/feedback` | Public | Submit star rating, comments & suggestions | `201`, `400` |

---

## 6. How to Run Locally

### 1. Prerequisites
- Node.js (v18.x / v20.x / v22.x LTS)
- Google Chrome or any modern web browser

### 2. Setup & Execution
```bash
# Clone the repository
git clone https://github.com/Atharv102/wt-campus-connect-mini-project.git
cd wt-campus-connect-mini-project

# Option A: Run the static client (standalone)
# Open index.html directly in any web browser or serve with:
npx serve .

# Option B: Run Full-Stack Express Server + React SPA
cd campus-connect-fullstack/server
npm install
node index.js
# Open http://localhost:5001 in your browser
```

---

## 7. Individual Presentation & Viva Voce Quick Cheatsheet

### Q1: What real-world problem does CampusConnect address?
**Answer:** It addresses the chaotic operational challenges of college fests (like MIT AOE's Nakshatra and TechFest): paper-based check-in queues, missing attendance data, fragmented communications, and low feedback rates by providing a centralized digital portal.

### Q2: How does the QR check-in prevent duplicate entries?
**Answer:** The registration engine generates a unique ID (`REG-2025-xxxx`) embedded into a QR code. When scanned at the gate, the server validates the ID against `attendance`. If a record already exists with that `regId`, it immediately triggers an HTTP `409 Conflict` response with an alert, preventing double-entry fraud.

### Q3: Why is a decoupled React + Express architecture beneficial?
**Answer:** Decoupling ensures the frontend can run interactive device camera streams and responsive dark/light themes independently, while the Node.js/Express backend provides high-speed, non-blocking asynchronous RESTful endpoints secured by JWT bearer tokens.

---

## 8. Submission Deliverables
- **Moodle Project Documentation:** `202401100102_Atharv_Jadhav_Project.pdf`
- **Moodle Project Source Code:** `202401100102_Atharv_Jadhav_Project.zip`
- **Deployed Application Link:** [https://Atharv102.github.io/wt-campus-connect-mini-project/](https://Atharv102.github.io/wt-campus-connect-mini-project/)
- **GitHub Repository:** [https://github.com/Atharv102/wt-campus-connect-mini-project](https://github.com/Atharv102/wt-campus-connect-mini-project)
