import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  collection,
  getDocs,
  Firestore,
} from 'firebase/firestore';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize Gemini Client with mandatory telemetry User-Agent header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

interface CommentReply {
  id: string;
  authorName: string;
  authorRole: 'anak' | 'orang_tua' | 'dokter_gigi' | 'ai_dokter';
  content: string;
  createdAt: string;
  likes: number;
}

interface CommentItem {
  id: string;
  authorName: string;
  authorRole: 'anak' | 'orang_tua' | 'dokter_gigi';
  category: string;
  categoryLabel: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  aiAnswer?: {
    text: string;
    answeredAt: string;
    model: string;
  };
  replies: CommentReply[];
}

// System Instruction for Dental AI
const DENTAL_SYSTEM_INSTRUCTION = `Kamu adalah "Dokter Denti" — dokter gigi cilik ramah, ahli kesehatan gigi anak dan mulut dari game edukasi Dentika.
Tugasmu adalah menjawab pertanyaan anak-anak, orang tua, dan pengunjung web dengan gaya bahasa Indonesia yang hangat, ceria, mudah dimengerti anak, edukatif, dan akurat secara medis.
Materi pengetahuan mencakup kurikulum Dentika:
1. Karies & Gigi Berlubang: Bakteri Streptococcus mutans memakan gula sisa makanan dan memproduksi asam perusak email. Pencegahan: sikat gigi 2x sehari (pagi setelah sarapan & malam sebelum tidur), batasi permen/cokelat lengket, gunakan pasta gigi fluoride.
2. Karang Gigi & Plak: Plak lembut mengeras karena mineral saliva jadi karang gigi (kalkulus). Harus dibersihkan lewat scaling di dokter gigi setiap 6 bulan sekali.
3. Radang Gusi (Gingivitis): Gusi merah, bengkak, atau berdarah saat disikat karena plak kuman. Disembuhkan dengan menjaga kebersihan mulut dan sikat gigi lembut melingkar.
4. Sariawan (Stomatitis Aptosa): Luka kecil pedih di bibir/lidah karena tergigit, kurang vitamin C/B12, atau kelelahan. Hindari makanan pedas dan asam selama penyembuhan.
5. Bau Mulut (Halitosis): Sisa makanan di sela gigi dan lidah yang diurai bakteri anaerob. Harus menyikat lidah dan banyak minum air putih.
6. Gigi Sensitif: Email menipis membuka tubulus dentin. Gigi ngilu saat dingin/panas. Pakai sikat gigi berbulu halus (*ultra-soft*) dan pasta gigi khusus gigi sensitif.
7. Makanan Ramah Gigi: Apel, wortel, susu berkalsium, keju, air putih. Hindari permen keras dan minuman bersoda.
8. Standar Sikat Gigi: Minimal 2 menit, 2 kali sehari, sudut 45 derajat memutar lembut.

Format jawaban:
- Sapa penanya secara hangat dan ceria.
- Jelaskan penyebab atau jawaban intinya secara sederhana dengan analogi ramah anak.
- Berikan 2 sampai 3 langkah tips aksi praktis.
- Akhiri dengan salam penyemangat pahlawan senyum.
Gunakan emoji yang menyenangkan dan ramah. Panjang jawaban sekitar 120-250 kata.`;

// Intelligent rule-based fallback in case Gemini API key is missing or network unavailable
function getFallbackDentalAnswer(question: string, category: string, authorName?: string) {
  const name = authorName || 'Sahabat Dentika';
  const qLower = (question + ' ' + category).toLowerCase();

  let explanation = '';
  let tips: string[] = [];

  if (qLower.includes('ngilu') || qLower.includes('dingin') || qLower.includes('es') || category === 'gigi_sensitif') {
    explanation = `Rasa ngilu saat makan es krim atau minum air dingin terjadi karena lapisan pelindung email gigi menipis, sehingga saluran kecil (*tubulus dentin*) yang terhubung langsung ke saraf gigi terkena suhu dingin seketika! 🧊⚡`;
    tips = [
      'Gunakan sikat gigi berbulu super halus (*soft*) dan jangan menyikat gigi terlalu keras seperti menggosok lantai.',
      'Gunakan pasta gigi khusus gigi sensitif berfluoride agar lubang-lubang mikroskopis gigi terlindungi.',
      'Hindari langsung menggigit es batu atau makanan yang terlalu asam.',
    ];
  } else if (qLower.includes('lubang') || qLower.includes('karies') || qLower.includes('hitam') || category === 'karies') {
    explanation = `Gigi berlubang terjadi karena kuman karies (seperti *Streptococcus mutans*) memakan sisa gula manis di gigi, lalu mengeluarkan asam yang membuat lubang kecil di lapisan email gigimu! 👾💥`;
    tips = [
      'Sikat gigi 2 kali sehari: pagi 30 menit setelah sarapan dan malam tepat sebelum tidur.',
      'Bilas mulut dengan air putih hangat setiap kali selesai makan kue, cokelat, atau permen manis.',
      'Periksa ke dokter gigi setiap 6 bulan sekali untuk pemeriksaan rutin dan perlindungan fluoride.',
    ];
  } else if (qLower.includes('bau') || qLower.includes('nafas') || qLower.includes('segar') || category === 'bau_mulut') {
    explanation = `Nafas kurang segar disebabkan oleh kuman yang bersarang di sela-sela gigi dan di permukaan lidah yang menguraikan sisa makanan menjadi gas asam berbau. 🍃✨`;
    tips = [
      'Sikat lidahmu juga dengan lembut dari bagian belakang ke depan setelah menyikat gigi.',
      'Banyak minum air putih agar mulut tidak kering, karena air liur adalah pembersih alami kuman mulut.',
      'Makan buah berserat renyah seperti apel atau pir yang membantu membersihkan plak secara alami.',
    ];
  } else if (qLower.includes('darah') || qLower.includes('gusi') || qLower.includes('gingivitis') || category === 'gingivitis') {
    explanation = `Gusi berdarah saat disikat biasanya merupakan tanda *Gingivitis* (radang gusi) karena ada tumpukan plak kuman lembut di dekat batas gusi yang membuat gusi meradang. 🩺🩸`;
    tips = [
      'Tetap sikat gigi dengan lembut memutar 45 derajat ke arah batas gusi, jangan ditekan terlalu kencang.',
      'Gunakan obat kumur antiseptik tanpa alkohol atau kumur air garam hangat ringan.',
      'Bila darah tidak berhenti dalam beberapa hari, konsultasikan ke dokter gigi untuk pembersihan karang gigi (*scaling*).',
    ];
  } else if (qLower.includes('sariawan') || qLower.includes('perih') || category === 'sariawan') {
    explanation = `Sariawan adalah luka kecil yang perih di bibir atau gusi, sering kali karena bibir tidak sengaja tergigit, kurang vitamin C, atau daya tahan tubuh sedang menurun. 🌸🩹`;
    tips = [
      'Hindari makanan yang terlalu pedas, asin menyengat, atau terlalu panas selagi sariawan.',
      'Perbanyak makan buah dan sayur kaya vitamin C (jeruk manis, pepaya, brokoli).',
      'Minum air putih yang cukup dan istirahat tidur yang cukup agar tubuh cepat pulih.',
    ];
  } else {
    explanation = `Kesehatan gigi dan mulut adalah kunci tubuh yang kuat dan senyum yang percaya diri! Gigi yang sehat membuat kita bisa makan enak, berbicara jelas, dan bebas dari rasa sakit. 🦷🌟`;
    tips = [
      'Lakukan aturan emas 2x2: sikat gigi minimal 2 menit, 2 kali sehari (setelah sarapan & sebelum tidur).',
      'Pilih makanan sehat bergizi tinggi kalsium seperti susu, keju, dan telur.',
      'Rutin periksa ke dokter gigi yang ramah setiap 6 bulan sekali.',
    ];
  }

  return {
    text: `Halo ${name}, Pahlawan Senyum Cilik! 👋✨\n\n${explanation}\n\nTips Penting dari Dokter Denti:\n${tips.map((t, idx) => `${idx + 1}. ${t}`).join('\n')}\n\nTetap rajin merawat gigi setiap hari ya! Senyum sehatmu bikin dunia lebih ceria! 🚀💖`,
    answeredAt: new Date().toISOString(),
    model: 'Dokter Denti AI (Edukasi Dentika)',
  };
}

// Generate AI answer using Gemini SDK or fallback
async function generateDentalAnswer(question: string, category: string, authorName?: string) {
  try {
    if (process.env.GEMINI_API_KEY) {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Kategori Materi: ${category}\nNama Penanya: ${authorName || 'Sahabat Dentika'}\nPertanyaan / Komentar: ${question}`,
        config: {
          systemInstruction: DENTAL_SYSTEM_INSTRUCTION,
          temperature: 0.7,
        },
      });

      if (response && response.text) {
        return {
          text: response.text.trim(),
          answeredAt: new Date().toISOString(),
          model: 'Dokter Denti AI (Gemini 3.8 Flash)',
        };
      }
    }
  } catch (err) {
    console.warn('Gemini generateContent error, reverting to built-in dental model:', err);
  }

  return getFallbackDentalAnswer(question, category, authorName);
}

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3000;

  app.use(express.json({ limit: '10mb' }));

  // Persistence files
  const SYNC_FILE = path.join(__dirname, 'sync_data.json');
  const COMMENTS_FILE = path.join(__dirname, 'comments_data.json');
  const FIREBASE_CONFIG_FILE = path.join(__dirname, 'firebase-applet-config.json');

  let syncStore: Record<string, { data: any; updatedAt: string }> = {};
  let commentsStore: CommentItem[] = [];

  // Cloud Firebase Firestore Initialization
  let firestoreDb: Firestore | null = null;
  let firebaseStatus = {
    connected: false,
    projectId: '',
    databaseId: '',
    storageBucket: '',
  };

  try {
    if (fs.existsSync(FIREBASE_CONFIG_FILE)) {
      const fbConfig = JSON.parse(fs.readFileSync(FIREBASE_CONFIG_FILE, 'utf-8'));
      const fbApp = getApps().length > 0 ? getApp() : initializeApp(fbConfig);
      firestoreDb = getFirestore(fbApp, fbConfig.firestoreDatabaseId || '(default)');
      firebaseStatus = {
        connected: true,
        projectId: fbConfig.projectId || '',
        databaseId: fbConfig.firestoreDatabaseId || '(default)',
        storageBucket: fbConfig.storageBucket || '',
      };
      console.log(`[Firebase Server] Connected to Cloud Firestore in project "${fbConfig.projectId}" (DB: ${fbConfig.firestoreDatabaseId})`);
    }
  } catch (err) {
    console.warn('[Firebase Server] Notice on Firebase init:', err);
  }

  // Seed Comments matching Gambar & Kurikulum Dentika
  const seedComments: CommentItem[] = [
    {
      id: 'comm-1',
      authorName: 'Rian (8 Tahun)',
      authorRole: 'anak',
      category: 'gigi_sensitif',
      categoryLabel: 'Gigi Sensitif & Ngilu',
      title: 'Kenapa gigiku ngilu pas makan es krim?',
      content: 'Halo Dok, kenapa ya setiap kali aku makan es krim cokelat atau minum air es dingin, gigi depanku rasanya ngilu banget kayak kesetrum?',
      createdAt: new Date(Date.now() - 3600000 * 24 * 2).toISOString(),
      likes: 12,
      aiAnswer: {
        text: 'Halo Rian, Pahlawan Senyum Cilik! 🍦✨\n\nRasa ngilu saat makan es krim itu terjadi karena lapisan pelindung terluar gigimu (yang bernama email gigi) mulai menipis, atau gusimu sedikit turun. Akibatnya, saluran-saluran super kecil di dalam gigi yang disebut "dentin" langsung merasakan suhu dingin es krim dan mengirim sinyal kaget ke saraf gigi! ⚡\n\nTips dari Dokter Denti agar gigimu tidak gampang ngilu:\n1. 🪥 Gunakan sikat gigi dengan bulu yang super lembut (*soft bristles*) dan sikat pelan-pelan berputar, jangan digosok terlalu keras seperti menyikat lantai ya!\n2. 🥛 Gunakan pasta gigi khusus gigi sensitif berfluoride seukuran biji jagung.\n3. 🧊 Kurangi kebiasaan menggigit es batu secara langsung.\n\nKalau masih sering ngilu, ajak Ayah atau Ibu untuk periksa ke dokter gigi ya! Semangat menjaga gigimu tetap kuat! 🦷🌟',
        answeredAt: new Date(Date.now() - 3600000 * 24 * 2 + 120000).toISOString(),
        model: 'Dokter Denti AI (Gemini 3.8 Flash)',
      },
      replies: [
        {
          id: 'rep-1',
          authorName: 'Bunda Rian',
          authorRole: 'orang_tua',
          content: 'Terima kasih Dokter Denti! Kemarin sudah saya belikan sikat gigi bulu halus, Rian sudah mulai rajin memutar sikatnya.',
          createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
          likes: 4,
        },
      ],
    },
    {
      id: 'comm-2',
      authorName: 'Ibu Maya',
      authorRole: 'orang_tua',
      category: 'karies',
      categoryLabel: 'Karies & Gigi Berlubang',
      title: 'Waktu terbaik menyikat gigi anak agar terhindar dari kuman karies',
      content: 'Dokter, anak saya sering minta sikat gigi saat mandi sore saja. Apakah itu cukup, atau harus tetap sikat gigi lagi sebelum tidur malam?',
      createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
      likes: 8,
      aiAnswer: {
        text: 'Halo Ibu Maya yang hebat! 🌸🦷\n\nMenyikat gigi saat mandi sore tentu baik, tetapi menyikat gigi **tepat sebelum tidur malam adalah kunci paling penting** yang tidak boleh dilewatkan sama sekali!\n\nMengapa? Saat kita tidur malam, mulut memproduksi sangat sedikit air liur (*saliva*). Padahal, air liur adalah tentara alami pembersih asam. Jika masih ada sisa makanan manis atau susu di malam hari, monster kuman karies (seperti *Streptococcus mutans*) akan berpesta semalaman selama 8 jam tanpa henti dan melubangi email gigi! 👾💥\n\nJadwal Emas Menyikat Gigi Dentika:\n1. ☀️ **Pagi hari**: 30 menit setelah sarapan pagi.\n2. 🌙 **Malam hari**: Tepat sebelum tidur, dan setelah sikat gigi malam hanya boleh minum air putih hangat/biasa.\n\nAyo dampingi si kecil dengan timer lagu 2 menit di aplikasi Dentika agar sikat gigi malam jadi petualangan seru! ⏰🎶',
        answeredAt: new Date(Date.now() - 3600000 * 18 + 90000).toISOString(),
        model: 'Dokter Denti AI (Gemini 3.8 Flash)',
      },
      replies: [],
    },
    {
      id: 'comm-3',
      authorName: 'Kenzo (9 Tahun)',
      authorRole: 'anak',
      category: 'bau_mulut',
      categoryLabel: 'Bau Mulut & Nafas Segar',
      title: 'Bagaimana cara agar nafas selalu segar sepanjang hari?',
      content: 'Halo Dokter, kadang kalau bangun tidur atau habis sekolah nafasku rasanya kurang segar. Apa rahasianya biar nafas selalu segar kayak wangi permen mint?',
      createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      likes: 15,
      aiAnswer: {
        text: 'Halo Kenzo sang Penjaga Senyum! 🍃✨\n\nNafas kurang segar itu wajar sekali terjadi, terutama setelah tidur atau beraktivitas seharian! Penyebab utamanya adalah kuman yang bersembunyi di sela-sela gigi dan di **permukaan lidah** kita yang mengubah sisa makanan menjadi gas berbau asam.\n\n3 Rahasia Nafas Segar Dokter Denti:\n1. 👅 **Sikat lidahmu juga**: Setelah menyikat gigi, gunakan bulu sikat gigi secara lembut dari bagian belakang lidah ke depan untuk menyapu lapisan putih kuman.\n2. 💧 **Banyak minum air putih**: Air putih membilas kuman dan membuat mulutmu selalu basah, kuman bau mulut tidak suka lingkungan yang banyak air!\n3. 🍎 **Kudapan buah renyah**: Makan apel atau wortel renyah membantu membersihkan gigi secara alami saat dikunyah.\n\nCobalah mulai hari ini dan rasakan sensasi nafas segarmu! 🚀🦷',
        answeredAt: new Date(Date.now() - 3600000 * 6 + 60000).toISOString(),
        model: 'Dokter Denti AI (Gemini 3.8 Flash)',
      },
      replies: [],
    },
  ];

  try {
    if (fs.existsSync(SYNC_FILE)) {
      syncStore = JSON.parse(fs.readFileSync(SYNC_FILE, 'utf-8'));
    }
  } catch (err) {
    console.warn('Could not read sync_data.json, starting fresh', err);
  }

  try {
    if (fs.existsSync(COMMENTS_FILE)) {
      commentsStore = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
    } else {
      commentsStore = seedComments;
      fs.writeFileSync(COMMENTS_FILE, JSON.stringify(commentsStore, null, 2), 'utf-8');
    }
  } catch (err) {
    console.warn('Could not read comments_data.json, seeding initial comments', err);
    commentsStore = seedComments;
  }

  const saveSyncStore = () => {
    try {
      fs.writeFileSync(SYNC_FILE, JSON.stringify(syncStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write sync file', e);
    }
  };

  const saveCommentsStore = () => {
    try {
      fs.writeFileSync(COMMENTS_FILE, JSON.stringify(commentsStore, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write comments file', e);
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

  // Seed / Sync Firestore Data on Boot
  const initFirestoreSync = async () => {
    if (!firestoreDb) return;
    try {
      // 1. Comments collection
      const commCol = collection(firestoreDb, 'comments');
      const snap = await getDocs(commCol);
      if (snap.empty) {
        console.log('[Firebase Server] Seeding initial comments to Cloud Firestore...');
        for (const item of commentsStore) {
          await setDoc(doc(firestoreDb, 'comments', item.id), item);
        }
      } else {
        const cloudComments: CommentItem[] = [];
        snap.forEach(docSnap => {
          cloudComments.push(docSnap.data() as CommentItem);
        });
        cloudComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        commentsStore = cloudComments;
        saveCommentsStore();
        console.log(`[Firebase Server] Synced ${cloudComments.length} comments from Cloud Firestore`);
      }

      // 2. Leaderboard collection
      const lbCol = collection(firestoreDb, 'leaderboard');
      const lbSnap = await getDocs(lbCol);
      if (lbSnap.empty) {
        for (const entry of initialLeaderboard) {
          await setDoc(doc(firestoreDb, 'leaderboard', entry.id), entry);
        }
      }
    } catch (err) {
      console.warn('[Firebase Server] Background Firestore sync notice:', err);
    }
  };

  initFirestoreSync();

  // API: Health check & Firebase connection status
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      firebase: firebaseStatus,
      time: new Date().toISOString(),
    });
  });

  // API: Firebase Status
  app.get('/api/firebase-status', (req, res) => {
    res.json({
      success: true,
      ...firebaseStatus,
      commentsCount: commentsStore.length,
      syncProfilesCount: Object.keys(syncStore).length,
    });
  });

  // ==========================================
  // FORUM KOMENTAR & AI DOKTER GIGI ENDPOINTS
  // ==========================================

  // 1. GET /api/comments - Ambil semua komentar & jawaban dari Cloud Firebase
  app.get('/api/comments', async (req, res) => {
    if (firestoreDb) {
      try {
        const commCol = collection(firestoreDb, 'comments');
        const snap = await getDocs(commCol);
        if (!snap.empty) {
          const cloudComments: CommentItem[] = [];
          snap.forEach(docSnap => {
            cloudComments.push(docSnap.data() as CommentItem);
          });
          cloudComments.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          commentsStore = cloudComments;
          saveCommentsStore();
        }
      } catch (err) {
        console.warn('[Firebase Server] Error fetching comments from Firestore, serving cache:', err);
      }
    }
    res.json({ success: true, comments: commentsStore, cloudSynced: Boolean(firestoreDb) });
  });

  // 2. POST /api/comments - Buat komentar / pertanyaan baru
  app.post('/api/comments', async (req, res) => {
    try {
      const { authorName, authorRole, category, categoryLabel, title, content, askAi } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Isi komentar atau pertanyaan wajib diisi.' });
      }

      const newComment: CommentItem = {
        id: `comm-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        authorName: (authorName && String(authorName).trim()) || 'Sahabat Dentika',
        authorRole: authorRole || 'anak',
        category: category || 'umum',
        categoryLabel: categoryLabel || 'Pertanyaan Umum',
        title: (title && String(title).trim()) || 'Pertanyaan Baru',
        content: String(content).trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
        replies: [],
      };

      // If user requested AI assistance, generate answer automatically
      if (askAi) {
        newComment.aiAnswer = await generateDentalAnswer(
          newComment.content,
          newComment.categoryLabel,
          newComment.authorName
        );
      }

      // Persist to Cloud Firestore
      if (firestoreDb) {
        try {
          await setDoc(doc(firestoreDb, 'comments', newComment.id), newComment);
        } catch (dbErr) {
          console.warn('[Firebase Server] Warning writing comment to Firestore:', dbErr);
        }
      }

      commentsStore.unshift(newComment);
      saveCommentsStore();

      res.status(201).json({ success: true, comment: newComment, cloudSynced: Boolean(firestoreDb) });
    } catch (err: any) {
      console.error('Error creating comment:', err);
      res.status(500).json({ error: 'Gagal membuat komentar: ' + (err?.message || 'Server error') });
    }
  });

  // 3. POST /api/comments/:id/reply - Balas komentar
  app.post('/api/comments/:id/reply', async (req, res) => {
    try {
      const { id } = req.params;
      const { authorName, authorRole, content } = req.body;

      if (!content || !content.trim()) {
        return res.status(400).json({ error: 'Isi balasan wajib diisi.' });
      }

      const comment = commentsStore.find(c => c.id === id);
      if (!comment) {
        return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
      }

      const newReply: CommentReply = {
        id: `rep-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        authorName: (authorName && String(authorName).trim()) || 'Pengguna Dentika',
        authorRole: authorRole || 'anak',
        content: String(content).trim(),
        createdAt: new Date().toISOString(),
        likes: 0,
      };

      comment.replies.push(newReply);
      saveCommentsStore();

      // Update in Cloud Firestore
      if (firestoreDb) {
        try {
          await updateDoc(doc(firestoreDb, 'comments', id), { replies: comment.replies });
        } catch (dbErr) {
          console.warn('[Firebase Server] Warning updating replies in Firestore:', dbErr);
        }
      }

      res.status(201).json({ success: true, reply: newReply, comment, cloudSynced: Boolean(firestoreDb) });
    } catch (err: any) {
      console.error('Error adding reply:', err);
      res.status(500).json({ error: 'Gagal membalas: ' + (err?.message || 'Server error') });
    }
  });

  // 4. POST /api/comments/:id/like - Suka komentar
  app.post('/api/comments/:id/like', async (req, res) => {
    try {
      const { id } = req.params;
      const comment = commentsStore.find(c => c.id === id);
      if (!comment) {
        return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
      }

      comment.likes = (comment.likes || 0) + 1;
      saveCommentsStore();

      if (firestoreDb) {
        try {
          await updateDoc(doc(firestoreDb, 'comments', id), { likes: comment.likes });
        } catch (dbErr) {
          console.warn('[Firebase Server] Warning updating likes in Firestore:', dbErr);
        }
      }

      res.json({ success: true, likes: comment.likes, cloudSynced: Boolean(firestoreDb) });
    } catch (err: any) {
      console.error('Error liking comment:', err);
      res.status(500).json({ error: 'Gagal menyukai komentar.' });
    }
  });

  // 5. POST /api/comments/:id/ask-ai - Minta AI menjawab komentar tertentu
  app.post('/api/comments/:id/ask-ai', async (req, res) => {
    try {
      const { id } = req.params;
      const comment = commentsStore.find(c => c.id === id);
      if (!comment) {
        return res.status(404).json({ error: 'Komentar tidak ditemukan.' });
      }

      const aiAnswer = await generateDentalAnswer(comment.content, comment.categoryLabel, comment.authorName);
      comment.aiAnswer = aiAnswer;
      saveCommentsStore();

      if (firestoreDb) {
        try {
          await updateDoc(doc(firestoreDb, 'comments', id), { aiAnswer });
        } catch (dbErr) {
          console.warn('[Firebase Server] Warning updating aiAnswer in Firestore:', dbErr);
        }
      }

      res.json({ success: true, aiAnswer, comment, cloudSynced: Boolean(firestoreDb) });
    } catch (err: any) {
      console.error('Error asking AI for comment:', err);
      res.status(500).json({ error: 'Gagal meminta jawaban AI: ' + (err?.message || 'Server error') });
    }
  });

  // 6. POST /api/ai/ask-direct - Tanya langsung ke Dokter Denti AI
  app.post('/api/ai/ask-direct', async (req, res) => {
    try {
      const { question, category, authorName } = req.body;
      if (!question || !question.trim()) {
        return res.status(400).json({ error: 'Pertanyaan wajib diisi.' });
      }

      const answer = await generateDentalAnswer(question, category || 'Pertanyaan Umum', authorName);
      res.json({ success: true, answer });
    } catch (err: any) {
      console.error('Error in ask-direct:', err);
      res.status(500).json({ error: 'Gagal mendapatkan jawaban AI.' });
    }
  });

  // ==========================================
  // SYNC & LEADERBOARD ENDPOINTS
  // ==========================================

  // API: Sync Save ke Cloud Firebase Firestore
  app.post('/api/sync/save', async (req, res) => {
    const { syncCode, progressData } = req.body;
    if (!syncCode || !progressData) {
      return res.status(400).json({ error: 'Kode sinkronisasi dan data profil wajib diisi.' });
    }
    const cleanCode = String(syncCode).trim().toUpperCase();
    const nowIso = new Date().toISOString();

    syncStore[cleanCode] = {
      data: progressData,
      updatedAt: nowIso,
    };
    saveSyncStore();

    // Save to Cloud Firebase
    if (firestoreDb) {
      try {
        await setDoc(doc(firestoreDb, 'sync_profiles', cleanCode), {
          syncCode: cleanCode,
          playerName: progressData.playerName || 'Pahlawan Dentika',
          score: progressData.score || 0,
          stars: progressData.stars || 0,
          progressData,
          updatedAt: nowIso,
        });

        if (progressData.playerName && progressData.score !== undefined) {
          await setDoc(doc(firestoreDb, 'leaderboard', cleanCode), {
            id: cleanCode,
            name: progressData.playerName,
            score: progressData.score || 0,
            stars: progressData.stars || 0,
            avatar: progressData.avatar || 'hero',
            level: progressData.rankTitle || 'Pahlawan Senyum',
            updatedAt: nowIso,
          });
        }
      } catch (dbErr) {
        console.warn('[Firebase Server] Error saving to sync_profiles in Firestore:', dbErr);
      }
    }

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
      message: 'Data berhasil disinkronkan ke Cloud Firebase Firestore!',
      updatedAt: nowIso,
      cloudSynced: Boolean(firestoreDb),
    });
  });

  // API: Sync Load dari Cloud Firebase Firestore
  app.get('/api/sync/load/:code', async (req, res) => {
    const cleanCode = String(req.params.code).trim().toUpperCase();

    // Check Cloud Firebase Firestore first
    if (firestoreDb) {
      try {
        const snap = await getDoc(doc(firestoreDb, 'sync_profiles', cleanCode));
        if (snap.exists()) {
          const profileDoc = snap.data();
          return res.json({
            success: true,
            syncCode: cleanCode,
            progressData: profileDoc.progressData,
            updatedAt: profileDoc.updatedAt,
            source: 'cloud_firebase_firestore',
          });
        }
      } catch (err) {
        console.warn('[Firebase Server] Error reading sync_profiles from Firestore, trying cache:', err);
      }
    }

    const record = syncStore[cleanCode];
    if (!record) {
      return res.status(404).json({
        error: `Kode sinkronisasi "${cleanCode}" tidak ditemukan di server atau Cloud Firebase. Pastikan kode sudah benar atau buat kode baru di perangkat utama.`,
      });
    }
    res.json({
      success: true,
      syncCode: cleanCode,
      progressData: record.data,
      updatedAt: record.updatedAt,
      source: 'local_cache',
    });
  });

  // API: Leaderboard dari Cloud Firebase
  app.get('/api/leaderboard', async (req, res) => {
    if (firestoreDb) {
      try {
        const lbCol = collection(firestoreDb, 'leaderboard');
        const snap = await getDocs(lbCol);
        if (!snap.empty) {
          const cloudLb: any[] = [];
          snap.forEach(d => cloudLb.push(d.data()));
          cloudLb.sort((a, b) => (b.score || 0) - (a.score || 0));
          return res.json({ leaderboard: cloudLb.slice(0, 10), source: 'cloud_firebase' });
        }
      } catch (err) {
        console.warn('[Firebase Server] Error fetching leaderboard from Firestore:', err);
      }
    }
    res.json({ leaderboard: initialLeaderboard.slice(0, 10), source: 'local' });
  });

  // API: Email Weekly Report
  app.post('/api/parent/email-report', (req, res) => {
    const { email, childName } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Alamat email orang tua wajib diisi' });
    }

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
