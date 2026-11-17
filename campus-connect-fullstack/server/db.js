import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_PATH = path.join(__dirname, 'data', 'db.json');

const initialData = {
  users: [
    {
      id: 'u-student-1',
      username: 'tejas4315',
      email: 'tejas4315@campusconnect.com',
      password: '12345',
      role: 'student',
      name: 'Tejas Mahamuni'
    },
    {
      id: 'u-org-1',
      username: 'organizer',
      email: 'organizer@campusconnect.com',
      password: 'admin123',
      role: 'organizer',
      name: 'Admin'
    }
  ],
  events: [
    {
      id: 'nakshatra-2025',
      title: 'Nakshatra 2025',
      category: 'cultural',
      badgeLabel: 'Cultural',
      badgeColor: 'primary',
      date: 'Feb 15-17, 2025',
      image: '/img/nakshtra-bg.jpeg',
      shortDescription:
        'Annual cultural festival featuring dance, music, drama, and more. Join us for three days of excitement and talent showcase.',
      description:
        "Don't miss MIT Academy of Engineering's flagship cultural festival! Nakshatra 2025 brings together talent from across colleges for competitions in dance, music, drama, and more.",
      subCategories: [
        'Dance Competition',
        'Music Performance',
        'Drama & Theatre',
        'Fashion Show',
        'Art & Photography',
        'Literary Events'
      ]
    },
    {
      id: 'techfest-2025',
      title: 'TechFest 2025',
      category: 'academic',
      badgeLabel: 'Academic',
      badgeColor: 'success',
      date: 'Jan 20-22, 2025',
      image: '/img/techfest.jpg',
      shortDescription:
        'Technical festival with workshops, hackathons, and competitions. Showcase your technical skills and win exciting prizes.',
      description:
        'Join us for a multi-day celebration of technology featuring workshops, hackathons, coding competitions, and technical talks with industry experts.',
      subCategories: ['Workshops', 'Hackathons', 'Competitions', 'Technical Talks']
    },
    {
      id: 'sports-meet-2025',
      title: 'Sports Meet 2025',
      category: 'sports',
      badgeLabel: 'Sports',
      badgeColor: 'danger',
      date: 'Mar 10-15, 2025',
      image: '/img/sports.png',
      shortDescription:
        'Annual sports competition featuring cricket, football, basketball, athletics, and more. Participate and show your sporting spirit.',
      description:
        'Compete with the best teams in cricket, football, basketball, athletics, volleyball, and chess in our annual inter-department and inter-college sports carnival.',
      subCategories: ['Cricket', 'Football', 'Basketball', 'Athletics', 'Volleyball', 'Chess']
    },
    {
      id: 'ai-workshop',
      title: 'AI & Machine Learning Workshop',
      selectKey: 'AI Workshop',
      category: 'academic',
      badgeLabel: 'Academic',
      badgeColor: 'success',
      date: 'Dec 5, 2024',
      image: '/img/aiws.jpg',
      shortDescription:
        'Hands-on workshop on artificial intelligence and machine learning fundamentals with industry experts.',
      description:
        'Deep dive into Machine Learning, Deep Learning, and AI fundamentals through guided hands-on labs.',
      subCategories: ['Machine Learning', 'Deep Learning', 'AI Fundamentals']
    },
    {
      id: 'alumni-meet',
      title: 'Alumni Meet 2024',
      selectKey: 'Alumni Meet',
      category: 'cultural',
      badgeLabel: 'Cultural',
      badgeColor: 'primary',
      date: 'Dec 20, 2024',
      image: '/img/alumni.jpg',
      shortDescription:
        'Annual gathering of MIT Academy of Engineering alumni. Network with former students and share experiences.',
      description:
        'Reconnect with alumni, attend interactive talks, and enjoy cultural performances on campus.',
      subCategories: ['Networking', 'Talks', 'Cultural Events']
    },
    {
      id: 'chess-tournament',
      title: 'Inter-College Chess Tournament',
      selectKey: 'Chess Tournament',
      category: 'sports',
      badgeLabel: 'Sports',
      badgeColor: 'danger',
      date: 'Nov 25, 2024',
      image: '/img/chess.jpg',
      shortDescription:
        'Strategic chess competition open to all colleges. Test your skills and compete for the championship title.',
      description:
        'Compete across Rapid, Blitz, and Classical formats in the Inter-College Chess Championship.',
      subCategories: ['Rapid', 'Blitz', 'Classical']
    }
  ],
  registrations: [],
  nakshatraRegistrations: [],
  attendance: [
    {
      regId: 'REG-2025-1001',
      name: 'Rahul Sharma',
      collegeName: 'MIT Academy of Engineering',
      eventName: 'Dance Competition',
      checkInTime: '09:15 AM',
      status: 'Present'
    },
    {
      regId: 'REG-2025-1002',
      name: 'Priya Patel',
      collegeName: 'Pune Institute of Technology',
      eventName: 'Music Performance',
      checkInTime: '09:22 AM',
      status: 'Present'
    }
  ],
  studentHistory: [
    {
      eventName: 'Technical Symposium',
      date: 'Jan 15, 2025',
      checkInTime: '09:15 AM',
      status: 'Present',
      certificateUrl: '/pdf/Technical Symposium.pdf'
    },
    {
      eventName: 'Hackathon',
      date: 'Dec 10, 2024',
      checkInTime: '08:45 AM',
      status: 'Present',
      certificateUrl: '/pdf/hakathon.pdf'
    },
    {
      eventName: 'AI Workshop',
      date: 'Dec 5, 2024',
      checkInTime: '--',
      status: 'Absent',
      certificateUrl: null
    },
    {
      eventName: 'Cultural Fest',
      date: 'Nov 20, 2024',
      checkInTime: '10:05 AM',
      status: 'Present',
      certificateUrl: '/pdf/cultural.pdf'
    },
    {
      eventName: 'Sports Meet',
      date: 'Nov 15, 2024',
      checkInTime: '09:30 AM',
      status: 'Present',
      certificateUrl: '/pdf/sports.pdf'
    },
    {
      eventName: 'Alumni Meet',
      date: 'Oct 25, 2024',
      checkInTime: '06:15 PM',
      status: 'Present',
      certificateUrl: '/pdf/alumni.pdf'
    },
    {
      eventName: 'Chess Tournament',
      date: 'Oct 10, 2024',
      checkInTime: '09:50 AM',
      status: 'Present',
      certificateUrl: '/pdf/chess.pdf'
    }
  ],
  feedbacks: []
};

export function readDb() {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify(initialData, null, 2), 'utf-8');
    return structuredClone(initialData);
  }
  const raw = fs.readFileSync(DB_PATH, 'utf-8');
  return JSON.parse(raw);
}

export function writeDb(data) {
  const dir = path.dirname(DB_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
