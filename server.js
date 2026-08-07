import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { getDB, saveDB } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Upload directory setup
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer Config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

const upload = multer({ storage });
app.use('/uploads', express.static(uploadDir));

// --- API ENDPOINTS ---

// Check Passcode & PIN
app.post('/api/auth/verify-passcode', (req, res) => {
  const { passcode } = req.body;
  const db = getDB();
  if (passcode === db.settings.circlePasscode) {
    return res.json({ success: true, message: 'Passcode verified!' });
  }
  return res.status(401).json({ success: false, message: 'Passcode circle salah! Tanya temen circle kamu ya 😉' });
});

app.post('/api/auth/verify-admin', (req, res) => {
  const { pin } = req.body;
  const db = getDB();
  if (pin === db.settings.adminPin) {
    return res.json({ success: true, message: 'Admin verified!' });
  }
  return res.status(401).json({ success: false, message: 'PIN Admin salah!' });
});

// Update Passcode/PIN
app.post('/api/admin/settings', (req, res) => {
  const { circlePasscode, adminPin } = req.body;
  const db = getDB();
  if (circlePasscode) db.settings.circlePasscode = circlePasscode;
  if (adminPin) db.settings.adminPin = adminPin;
  saveDB(db);
  res.json({ success: true, settings: db.settings });
});

// Class Photo API
app.get('/api/class-photo', (req, res) => {
  const db = getDB();
  const defaultPhoto = {
    imageUrl: '/class_photo.webp',
    className: 'XII RPL 3 — SMK Angkatan 2020–2023',
    teacherName: 'Siti Mariatul Kiptiyah Spd. M.Pd',
    teacherRole: 'Guru Wali Kelas Utama',
    quote: '“Sukses selalu untuk kalian semua. Meskipun masa SMK diwarnai PJJ dan pandemi, kalian terbukti tangguh, kreatif, dan luar biasa!”',
    totalStudents: '36 Siswa'
  };
  res.json(db.classPhoto || defaultPhoto);
});

app.post('/api/class-photo', upload.single('image'), (req, res) => {
  const db = getDB();
  const currentPhoto = db.classPhoto || {};

  let imageUrl = req.body.imageUrl || currentPhoto.imageUrl || '/class_photo.webp';
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const updatedClassPhoto = {
    imageUrl,
    className: req.body.className || currentPhoto.className || 'XII RPL 3 — SMK Angkatan 2020–2023',
    teacherName: req.body.teacherName || currentPhoto.teacherName || 'Siti Mariatul Kiptiyah Spd. M.Pd',
    teacherRole: req.body.teacherRole || currentPhoto.teacherRole || 'Guru Wali Kelas Utama',
    quote: req.body.quote !== undefined ? req.body.quote : (currentPhoto.quote || ''),
    totalStudents: req.body.totalStudents || currentPhoto.totalStudents || '36 Siswa'
  };

  db.classPhoto = updatedClassPhoto;
  saveDB(db);
  res.json({ success: true, classPhoto: updatedClassPhoto });
});

// Timeline API
app.get('/api/timeline', (req, res) => {
  const db = getDB();
  res.json(db.timeline);
});

app.post('/api/timeline', (req, res) => {
  const db = getDB();
  const newEvent = {
    id: 'tl-' + Date.now(),
    ...req.body
  };
  db.timeline.push(newEvent);
  saveDB(db);
  res.json({ success: true, event: newEvent });
});

// Memories (Photo & Story) API
app.get('/api/memories', (req, res) => {
  const db = getDB();
  const year = req.query.year;
  if (year) {
    const filtered = db.memories.filter(m => m.year === year || (m.tags && m.tags.includes(year)));
    return res.json(filtered);
  }
  res.json(db.memories);
});

app.post('/api/memories', upload.single('image'), (req, res) => {
  const db = getDB();
  let imageUrl = req.body.imageUrl;
  
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const newMemory = {
    id: 'mem-' + Date.now(),
    title: req.body.title || 'Tanpa Judul',
    year: req.body.year || '2020',
    date: req.body.date || new Date().toISOString().split('T')[0],
    category: req.body.category || 'Sekolah',
    tags: req.body.tags ? (typeof req.body.tags === 'string' ? req.body.tags.split(',').map(t => t.trim()) : req.body.tags) : ['SMK'],
    imageUrl: imageUrl || 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1200&q=80',
    description: req.body.description || '',
    author: req.body.author || 'Anggota Circle'
  };

  db.memories.unshift(newMemory);
  saveDB(db);
  res.json({ success: true, memory: newMemory });
});

app.delete('/api/memories/:id', (req, res) => {
  const db = getDB();
  db.memories = db.memories.filter(m => m.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Members API
app.get('/api/members', (req, res) => {
  const db = getDB();
  res.json(db.members);
});

app.post('/api/members', upload.single('avatarFile'), (req, res) => {
  const db = getDB();
  let avatar = req.body.avatar;

  if (req.file) {
    avatar = `/uploads/${req.file.filename}`;
  }

  const newMember = {
    id: 'mbr-' + Date.now(),
    name: req.body.name,
    role: req.body.role || 'Anggota Circle',
    quote: req.body.quote || '',
    avatar: avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    social: req.body.social || '@smk2023',
    status: req.body.status || 'Alumni 2023'
  };

  db.members.push(newMember);
  saveDB(db);
  res.json({ success: true, member: newMember });
});

app.delete('/api/members/:id', (req, res) => {
  const db = getDB();
  db.members = db.members.filter(m => m.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Songs / Jukebox API
app.get('/api/songs', (req, res) => {
  const db = getDB();
  res.json(db.songs);
});

app.post('/api/songs', upload.single('audioFile'), (req, res) => {
  const db = getDB();
  let audioUrl = req.body.audioUrl;

  if (req.file) {
    audioUrl = `/uploads/${req.file.filename}`;
  }

  const newSong = {
    id: 'sng-' + Date.now(),
    title: req.body.title,
    artist: req.body.artist,
    albumCover: req.body.albumCover || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=300&q=80',
    audioUrl: audioUrl || 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3',
    tag: req.body.tag || 'Lagu Kenangan'
  };

  db.songs.push(newSong);
  saveDB(db);
  res.json({ success: true, song: newSong });
});

app.delete('/api/songs/:id', (req, res) => {
  const db = getDB();
  db.songs = db.songs.filter(s => s.id !== req.params.id);
  saveDB(db);
  res.json({ success: true });
});

// Memory Wall / Guestbook API
app.get('/api/guestbook', (req, res) => {
  const db = getDB();
  res.json(db.guestbook);
});

app.post('/api/guestbook', (req, res) => {
  const db = getDB();
  const newMsg = {
    id: 'gb-' + Date.now(),
    name: req.body.name || 'Teman Circle',
    message: req.body.message,
    createdAt: new Date().toISOString(),
    sticker: req.body.sticker || '✨'
  };
  db.guestbook.unshift(newMsg);
  saveDB(db);
  res.json({ success: true, entry: newMsg });
});

// Setup Vite development server middleware or production static server
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`✨ Server Kenangan SMK 2020-2023 berjalan di: http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  startServer();
}

export default app;

