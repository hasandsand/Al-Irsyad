import express from 'express';
import type { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const REGISTRATIONS_FILE = path.join(DATA_DIR, 'registrations.json');
const SETTINGS_FILE = path.join(DATA_DIR, 'settings.json');

app.use(express.json());

// Ensure data directory and files exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

if (!fs.existsSync(REGISTRATIONS_FILE)) {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify([], null, 2), 'utf-8');
}

const DEFAULT_SETTINGS = {
  panitiaWhatsapp: '6281225577889',
  eventTitle: 'IMPLEMENTASI PILOT PROJECT PENGAJARAN BAHASA ARAB BERSERTIFIKAT',
  eventDate: 'Kamis, 12 November 2026',
  eventTime: '10.00–16.00 WIB',
  eventLocation: 'Pekalongan',
  googleSheetsWebhookUrl: ''
};

if (!fs.existsSync(SETTINGS_FILE)) {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(DEFAULT_SETTINGS, null, 2), 'utf-8');
}

function readRegistrations(): any[] {
  try {
    const raw = fs.readFileSync(REGISTRATIONS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function writeRegistrations(data: any[]): void {
  fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function readSettings(): any {
  try {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch {
    return DEFAULT_SETTINGS;
  }
}

function writeSettings(data: any): void {
  fs.writeFileSync(SETTINGS_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

// API Routes
app.get('/api/registrations', (_req: Request, res: Response) => {
  const records = readRegistrations();
  res.json(records);
});

app.post('/api/registrations', (req: Request, res: Response) => {
  const newRecord = req.body;
  if (!newRecord || !newRecord.namaYayasan || !newRecord.namaSekolah) {
    return res.status(400).json({ error: 'Data pendaftaran tidak lengkap' });
  }

  const records = readRegistrations();
  // Check if ID already exists
  const existingIdx = records.findIndex(r => r.id === newRecord.id);
  if (existingIdx >= 0) {
    records[existingIdx] = newRecord;
  } else {
    records.unshift(newRecord);
  }

  writeRegistrations(records);
  res.status(201).json(newRecord);
});

app.delete('/api/registrations/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  let records = readRegistrations();
  records = records.filter(r => r.id !== id);
  writeRegistrations(records);
  res.json({ success: true, message: 'Data berhasil dihapus' });
});

app.get('/api/settings', (_req: Request, res: Response) => {
  res.json(readSettings());
});

app.post('/api/settings', (req: Request, res: Response) => {
  const settings = req.body;
  writeSettings(settings);
  res.json({ success: true, settings });
});

// Admin authentication endpoint (password can be configured via ADMIN_PASSWORD or defaults to alirsyad2026)
app.post('/api/admin/login', (req: Request, res: Response) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER || 'admin';
  const adminPass = process.env.ADMIN_PASSWORD || 'alirsyad2026';

  if (username === adminUser && password === adminPass) {
    const sessionToken = Buffer.from(`${username}:${Date.now()}:${Math.random()}`).toString('base64');
    return res.json({ success: true, token: sessionToken, username });
  }

  return res.status(401).json({ success: false, error: 'Username atau password admin salah' });
});

// Download full project zip archive for transferring to another Google account or local
const handleDownloadZip = (_req: Request, res: Response) => {
  const zipPath = path.join(__dirname, 'public', 'alirsyad-pendaftaran-project.zip');
  const fallbackPath = path.join(__dirname, 'public', 'alirsyad-project-backup.zip');
  const target = fs.existsSync(zipPath) ? zipPath : fallbackPath;
  if (fs.existsSync(target)) {
    res.download(target, 'alirsyad-pendaftaran-project.zip');
  } else {
    res.status(404).json({ error: 'File backup zip belum siap' });
  }
};

app.get('/api/download-project-zip', handleDownloadZip);
app.get('/download-zip', handleDownloadZip);

// Setup Vite middleware for development or serve dist in production
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
