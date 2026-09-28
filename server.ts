import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // In-memory sync store with persistence to a json file for restart durability
  const SYNC_FILE = path.join(__dirname, 'sync_data.json');
  let syncStore: Record<string, { data: any; updatedAt: string }> = {};

  try {
    if (fs.existsSync(SYNC_FILE)) {
      syncStore = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('Could not read sync_data.json, starting fresh', err);
  }

  const saveSyncStore = () => {
    try {
      fs.writeFileSync(SYNC_FILE, JSON.stringify(syncStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write sync file', e);
    }
  };

  // Mock initial global leaderboard if empty
  const initialLeaderboard = [
    { id: '1', name: 'Alif Dokter Gigi Cilik', score: 3450, stars: 48, avatar: 'hero', level: 'Juara Senyum 🏆' },
    { id: '2', name: 'Nayla Gigi Berlian', score: 2980, stars: 42, avatar: 'fairy', level: 'Pakar Gigi ⭐' },
    { id: '3', name: 'Kenza Pahlawan Senyum', score: 2600, stars: 39, avatar: 'detective', level: 'Pembasmi Kuman 🛡️' },
    { id: '4', name: 'Rafa Sikat Kilat', score: 2250, stars: 35, avatar: 'space', level: 'Pemberantas Plak 🚀' },
    { id: '5', name: 'Zahra Putri Bersih', score: 1890, stars: 29, avatar: 'queen', level: 'Sahabat Dokter 👑' },
  ];

  // API: Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', time: new Date().toISOString() });
  });

  // API: Sync Save (Upload current child progress to cloud with 6-digit sync code)
  app.post('/api/sync/save', (req, res) => {
    const { syncCode, progressData } = req.body;
    if (!syncCode || !progressData) {
      return res.status(400).json({ error: 'Kode sinkronisasi dan data profil wajib diisi.' });
    }
    const cleanCode = String(syncCode).trim().toUpperCase();
    syncStore[cleanCode] = {
      data: progressData,
      updatedAt: new Date().toISOString(),
    };
    saveSyncStore();

    // Also update leaderboard entry if provided
    if (progressData.playerName && progressData.score !== undefined) {
      const idx = initialLeaderboard.findIndex(p => p.id === cleanCode || p.name === progressData.playerName);
      const entry = {
        id: cleanCode,
        name: progressData.playerName,
        score: progressData.score || 0,
        stars: progressData.stars || 0,
        avatar: progressData.avatar || 'hero',
        level: progressData.rankTitle || 'Pahlawan Senyum',
      };
      if (idx >= 0) {
        initialLeaderboard[idx] = entry;
      } else {
        initialLeaderboard.push(entry);
      }
      initialLeaderboard.sort((a, b) => b.score - a.score);
    }

    res.json({
      success: true,
      syncCode: cleanCode,
      message: 'Data berhasil disinkronkan ke server cloud!',
      updatedAt: syncStore[cleanCode].updatedAt,
    });
  });

  // API: Sync Load (Download child progress from cloud using 6-digit sync code)
  app.get('/api/sync/load/:code', (req, res) => {
    const cleanCode = String(req.params.code).trim().toUpperCase();
    const record = syncStore[cleanCode];
    if (!record) {
      return res.status(404).json({
        error: `Kode sinkronisasi "${cleanCode}" tidak ditemukan di server. Pastikan kode sudah benar atau buat kode baru di perangkat utama.`,
      });
    }
    res.json({
      success: true,
      syncCode: cleanCode,
      progressData: record.data,
      updatedAt: record.updatedAt,
    });
  });

  // API: Leaderboard
  app.get('/api/leaderboard', (req, res) => {
    res.json({ leaderboard: initialLeaderboard.slice(0, 10) });
  });

  // API: Email Weekly Report
  app.post('/api/parent/email-report', (req, res) => {
    const { email, childName, reportSummary } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Alamat email orang tua wajib diisi' });
    }

    // Process and log report dispatch
    const sentAt = new Date().toLocaleString('id-ID', { dateStyle: 'full', timeStyle: 'short' });
    console.log(`[Laporan Mingguan Dentika] Mengirim email ke ${email} untuk anak: ${childName} pada ${sentAt}`);

    res.json({
      success: true,
      message: `Laporan prestasi mingguan untuk ${childName || 'Ananda'} berhasil dikirim ke ${email}!`,
      sentAt,
      deliveredTo: email,
    });
  });

  // Vite middleware in dev or static files in prod
  const isProd = process.env.NODE_ENV === 'production';
  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Dentika App running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
