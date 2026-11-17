import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { readDb, writeDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 5001;
const JWT_SECRET = process.env.JWT_SECRET || 'campus-connect-dev-secret';

app.use(cors());
app.use(express.json());

// Serve static assets from server/img and server/pdf
app.use('/img', express.static(path.join(__dirname, 'img')));
app.use('/pdf', express.static(path.join(__dirname, 'pdf')));

function signToken(user) {
  return jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  const token = authHeader.slice(7);
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Auth endpoints
app.post('/api/auth/login', (req, res) => {
  const { identifier, email, username, password } = req.body || {};
  const loginKey = (identifier || email || username || '').trim().toLowerCase();

  if (!loginKey || !password) {
    return res.status(400).json({ error: 'Username/email and password are required' });
  }

  const db = readDb();
  const user = db.users.find(
    (u) =>
      (u.username.toLowerCase() === loginKey || u.email.toLowerCase() === loginKey) &&
      u.password === password
  );

  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials. Please try again.' });
  }

  const token = signToken(user);
  return res.json({
    token,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      name: user.name
    }
  });
});

app.post('/api/auth/register', (req, res) => {
  const { name, email, username, password } = req.body || {};
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Name, email, and password are required' });
  }

  const db = readDb();
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedUsername = (username || email.split('@')[0]).trim().toLowerCase();

  if (
    db.users.some(
      (u) => u.email.toLowerCase() === normalizedEmail || u.username.toLowerCase() === normalizedUsername
    )
  ) {
    return res.status(409).json({ error: 'User with this email or username already exists' });
  }

  const newUser = {
    id: `u-${Date.now()}`,
    username: normalizedUsername,
    email: normalizedEmail,
    password,
    role: 'student',
    name: name.trim()
  };

  db.users.push(newUser);
  writeDb(db);

  const token = signToken(newUser);
  return res.status(201).json({
    token,
    user: {
      id: newUser.id,
      username: newUser.username,
      email: newUser.email,
      role: newUser.role,
      name: newUser.name
    }
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

// Events endpoints
app.get('/api/events', (req, res) => {
  const { category, search } = req.query;
  const db = readDb();
  let events = db.events;

  if (category && category !== 'all') {
    events = events.filter((e) => e.category.toLowerCase() === String(category).toLowerCase());
  }

  if (search) {
    const q = String(search).toLowerCase();
    events = events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.shortDescription.toLowerCase().includes(q) ||
        e.description.toLowerCase().includes(q)
    );
  }

  res.json({ events });
});

app.get('/api/events/:id', (req, res) => {
  const db = readDb();
  const event = db.events.find((e) => e.id === req.params.id);
  if (!event) {
    return res.status(404).json({ error: 'Event not found' });
  }
  res.json({ event });
});

app.post('/api/events', authenticateToken, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can create events' });
  }

  const {
    title,
    category,
    date,
    venue,
    capacity,
    image,
    shortDescription,
    description,
    subCategories
  } = req.body || {};

  if (!title || !category || !date || !shortDescription) {
    return res
      .status(400)
      .json({ error: 'Title, category, date, and short description are required' });
  }

  const normalizedCategory = String(category).trim().toLowerCase();
  const categoryMeta = {
    academic: { badgeLabel: 'Academic', badgeColor: 'success', defaultImg: '/img/techfest.jpg' },
    cultural: { badgeLabel: 'Cultural', badgeColor: 'primary', defaultImg: '/img/nakshtra-bg.jpeg' },
    sports: { badgeLabel: 'Sports', badgeColor: 'danger', defaultImg: '/img/sports.png' }
  }[normalizedCategory] || {
    badgeLabel: 'General',
    badgeColor: 'secondary',
    defaultImg: '/img/event.png'
  };

  const db = readDb();
  const baseSlug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  let id = baseSlug || `event-${Date.now()}`;
  if (db.events.some((e) => e.id === id)) {
    id = `${id}-${Date.now().toString().slice(-4)}`;
  }

  const parsedSubs = Array.isArray(subCategories)
    ? subCategories.map((s) => String(s).trim()).filter(Boolean)
    : String(subCategories || '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

  const newEvent = {
    id,
    title: title.trim(),
    category: normalizedCategory,
    badgeLabel: categoryMeta.badgeLabel,
    badgeColor: categoryMeta.badgeColor,
    date: date.trim(),
    venue: (venue || 'MIT Academy of Engineering, Alandi').trim(),
    capacity: Number(capacity) || 150,
    image: (image || categoryMeta.defaultImg).trim(),
    shortDescription: shortDescription.trim(),
    description: (description || shortDescription).trim(),
    subCategories: parsedSubs.length > 0 ? parsedSubs : ['General Participation'],
    createdBy: req.user.name,
    createdAt: new Date().toISOString()
  };

  db.events.unshift(newEvent);
  writeDb(db);

  res.status(201).json({ event: newEvent });
});

app.delete('/api/events/:id', authenticateToken, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can delete events' });
  }

  const db = readDb();
  const next = db.events.filter((e) => e.id !== req.params.id);
  if (next.length === db.events.length) {
    return res.status(404).json({ error: 'Event not found' });
  }

  db.events = next;
  writeDb(db);
  res.json({ deleted: req.params.id });
});

// Event registrations & QR code data
app.get('/api/registrations', (_req, res) => {
  const db = readDb();
  res.json({ registrations: db.registrations });
});

app.post('/api/registrations', (req, res) => {
  const { name, email, phone, college, event, category } = req.body || {};
  if (!name || !email || !phone || !college || !event || !category) {
    return res.status(400).json({ error: 'All registration fields are required' });
  }

  const db = readDb();
  const regId = 'REG-2025-' + Math.floor(1000 + Math.random() * 9000);
  const registration = {
    id: regId,
    name: name.trim(),
    email: email.trim(),
    phone: phone.trim(),
    college: college.trim(),
    event: event.trim(),
    category: category.trim(),
    registrationDate: new Date().toISOString()
  };

  db.registrations.push(registration);
  writeDb(db);

  res.status(201).json({ registration });
});

// Nakshatra registration
app.get('/api/nakshatra', (_req, res) => {
  const db = readDb();
  res.json({ registrations: db.nakshatraRegistrations });
});

app.post('/api/nakshatra', (req, res) => {
  const { fullName, email, phone, college, category, experience, additionalInfo } = req.body || {};
  if (!fullName || !email || !phone || !college || !category) {
    return res.status(400).json({ error: 'Required Nakshatra registration fields are missing' });
  }

  const db = readDb();
  const entry = {
    id: `NAK-2025-${Math.floor(1000 + Math.random() * 9000)}`,
    fullName: fullName.trim(),
    email: email.trim(),
    phone: phone.trim(),
    college: college.trim(),
    category: category.trim(),
    experience: experience || 'None',
    additionalInfo: additionalInfo || '',
    createdAt: new Date().toISOString()
  };

  db.nakshatraRegistrations.push(entry);
  writeDb(db);

  res.status(201).json({ registration: entry });
});

// Attendance endpoints
app.get('/api/attendance', (_req, res) => {
  const db = readDb();
  const totalRegistered = Math.max(120, db.registrations.length + db.attendance.length);
  const presentCount = db.attendance.filter((a) => a.status === 'Present').length;
  res.json({
    attendance: db.attendance,
    studentHistory: db.studentHistory,
    summary: {
      totalParticipants: totalRegistered,
      presentCount,
      absentCount: Math.max(0, totalRegistered - presentCount)
    }
  });
});

app.post('/api/attendance/checkin', authenticateToken, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can perform check-in' });
  }

  const { regId, name, collegeName, eventName, checkInTime } = req.body || {};
  if (!regId) {
    return res.status(400).json({ error: 'Registration ID is required' });
  }

  const db = readDb();
  const existing = db.attendance.find((entry) => entry.regId === regId);
  if (existing) {
    return res.status(409).json({ error: `Participant with ID ${regId} is already checked in.` });
  }

  const matchedRegistration = db.registrations.find((r) => r.id === regId);
  const resolvedTime =
    checkInTime || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  const newEntry = {
    regId: regId.trim(),
    name: (name || matchedRegistration?.name || 'New Participant').trim(),
    collegeName: (collegeName || matchedRegistration?.college || 'Unknown College').trim(),
    eventName: (eventName || matchedRegistration?.event || 'Unknown Event').trim(),
    checkInTime: resolvedTime,
    status: 'Present'
  };

  db.attendance.push(newEntry);
  writeDb(db);

  res.status(201).json({ entry: newEntry });
});

app.put('/api/attendance/:regId', authenticateToken, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can update attendance' });
  }

  const db = readDb();
  const idx = db.attendance.findIndex((entry) => entry.regId === req.params.regId);
  if (idx === -1) {
    return res.status(404).json({ error: 'Attendance record not found' });
  }

  const { name, collegeName, eventName, checkInTime, status } = req.body || {};
  db.attendance[idx] = {
    ...db.attendance[idx],
    ...(name !== undefined ? { name } : {}),
    ...(collegeName !== undefined ? { collegeName } : {}),
    ...(eventName !== undefined ? { eventName } : {}),
    ...(checkInTime !== undefined ? { checkInTime } : {}),
    ...(status !== undefined ? { status } : {})
  };

  writeDb(db);
  res.json({ entry: db.attendance[idx] });
});

app.delete('/api/attendance/:regId', authenticateToken, (req, res) => {
  if (req.user.role !== 'organizer') {
    return res.status(403).json({ error: 'Only organizers can delete attendance' });
  }

  const db = readDb();
  const next = db.attendance.filter((entry) => entry.regId !== req.params.regId);
  if (next.length === db.attendance.length) {
    return res.status(404).json({ error: 'Attendance record not found' });
  }

  db.attendance = next;
  writeDb(db);
  res.json({ deleted: req.params.regId });
});

// Feedback endpoints
app.get('/api/feedback', (_req, res) => {
  const db = readDb();
  const baseCount = 500;
  const totalSubmissions = baseCount + db.feedbacks.length;
  const avgRating =
    db.feedbacks.length > 0
      ? (
          (4.7 * baseCount + db.feedbacks.reduce((sum, f) => sum + Number(f.rating || 5), 0)) /
          totalSubmissions
        ).toFixed(1)
      : '4.7';

  res.json({
    feedbacks: db.feedbacks,
    stats: {
      submissions: `${totalSubmissions}+`,
      averageRating: avgRating,
      eventsImproved: '20+',
      satisfactionRate: '98%'
    }
  });
});

app.post('/api/feedback', (req, res) => {
  const { name, email, event, rating, comments, suggestions, contactCheck } = req.body || {};
  if (!name || !email || !event || !rating || !comments) {
    return res.status(400).json({ error: 'Please complete all required feedback fields' });
  }

  const db = readDb();
  const feedback = {
    id: `FB-${Date.now()}`,
    name: name.trim(),
    email: email.trim(),
    event: event.trim(),
    rating: Number(rating),
    comments: comments.trim(),
    suggestions: (suggestions || '').trim(),
    contactCheck: Boolean(contactCheck),
    createdAt: new Date().toISOString()
  };

  db.feedbacks.push(feedback);
  writeDb(db);

  res.status(201).json({ feedback });
});

// Serve built React app in production if client/dist exists
const clientDist = path.join(ROOT_DIR, 'client', 'dist');
if (fs.existsSync(clientDist)) {
  app.use(express.static(clientDist));
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientDist, 'index.html'));
    }
  });
}

app.listen(PORT, () => {
  console.log(`Campus Connect Express server running on http://localhost:${PORT}`);
});
