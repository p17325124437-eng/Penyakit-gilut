import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { ChildProfile, CommentItem } from '../types';
import { soundEffects, speakText, stopSpeech } from '../utils/audio';
import { BackButton3D, ToothHealthy3D, Star3D, Shield3D } from './GameIcons';

interface CommunityForumProps {
  profile: ChildProfile;
  speechEnabled: boolean;
  onBack: () => void;
}

export const CommunityForum: React.FC<CommunityForumProps> = ({
  profile,
  speechEnabled,
  onBack,
}) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // New Comment Form State
  const [showNewCommentForm, setShowNewCommentForm] = useState<boolean>(false);
  const [authorName, setAuthorName] = useState<string>(profile.name || 'Sahabat Dentika');
  const [authorRole, setAuthorRole] = useState<'anak' | 'orang_tua' | 'dokter_gigi'>('anak');
  const [category, setCategory] = useState<string>('karies');
  const [commentTitle, setCommentTitle] = useState<string>('');
  const [commentContent, setCommentContent] = useState<string>('');
  const [askAiAuto, setAskAiAuto] = useState<boolean>(true);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Quick Direct AI Ask State
  const [directQuestion, setDirectQuestion] = useState<string>('');
  const [isAskingDirectAi, setIsAskingDirectAi] = useState<boolean>(false);
  const [directAiAnswer, setDirectAiAnswer] = useState<{
    text: string;
    answeredAt: string;
    model: string;
  } | null>(null);

  // Replying state map
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState<string>('');
  const [replyAuthorName, setReplyAuthorName] = useState<string>(profile.name || 'Sahabat Dentika');
  const [replyRole, setReplyRole] = useState<'anak' | 'orang_tua' | 'dokter_gigi'>('anak');
  const [isSubmittingReply, setIsSubmittingReply] = useState<boolean>(false);

  // AI loading per comment
  const [askingAiForId, setAskingAiForId] = useState<string | null>(null);

  // Audio playing ID
  const [speakingTextId, setSpeakingTextId] = useState<string | null>(null);

  const categories = [
    { id: 'all', label: 'Semua Topik', icon: '🌟' },
    { id: 'karies', label: 'Karies & Gigi Berlubang', icon: '🦷' },
    { id: 'karang_gigi', label: 'Karang Gigi & Plak', icon: '🪨' },
    { id: 'gingivitis', label: 'Gusi Berdarah & Radang', icon: '🩸' },
    { id: 'sariawan', label: 'Sariawan Pedih', icon: '🩹' },
    { id: 'bau_mulut', label: 'Bau Mulut & Nafas Segar', icon: '🍃' },
    { id: 'gigi_sensitif', label: 'Gigi Sensitif & Ngilu', icon: '🧊' },
    { id: 'sikat_gigi', label: 'Cara Menyikat Gigi', icon: '🪥' },
    { id: 'makanan', label: 'Makanan Ramah Gigi', icon: '🍎' },
    { id: 'umum', label: 'Tanya Bebas', icon: '💬' },
  ];

  // Fetch comments from backend
  const fetchComments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/comments');
      const data = await res.json();
      if (data && data.comments) {
        setComments(data.comments);
      }
    } catch (err) {
      console.warn('Failed to fetch from server, fallback to local state', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
    return () => {
      stopSpeech();
    };
  }, []);

  // Post New Comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      setIsSubmitting(true);
      soundEffects.tap();

      const matchedCat = categories.find(c => c.id === category);

      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: authorName.trim() || 'Sahabat Dentika',
          authorRole,
          category,
          categoryLabel: matchedCat ? matchedCat.label : 'Pertanyaan Gigi',
          title: commentTitle.trim() || 'Pertanyaan Baru',
          content: commentContent.trim(),
          askAi: askAiAuto,
        }),
      });

      const data = await res.json();
      if (data && data.success && data.comment) {
        setComments(prev => [data.comment, ...prev]);
        setCommentTitle('');
        setCommentContent('');
        setShowNewCommentForm(false);

        soundEffects.fanfare();
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.5 },
        });
      }
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Like a comment
  const handleLikeComment = async (id: string) => {
    soundEffects.tap();
    setComments(prev =>
      prev.map(c => (c.id === id ? { ...c, likes: (c.likes || 0) + 1 } : c))
    );

    try {
      await fetch(`/api/comments/${id}/like`, { method: 'POST' });
    } catch (e) {
      console.warn('Like sync failed:', e);
    }
  };

  // Ask AI for a specific comment
  const handleAskAiForComment = async (id: string) => {
    try {
      soundEffects.tap();
      setAskingAiForId(id);

      const res = await fetch(`/api/comments/${id}/ask-ai`, { method: 'POST' });
      const data = await res.json();
      if (data && data.success && data.aiAnswer) {
        setComments(prev =>
          prev.map(c => (c.id === id ? { ...c, aiAnswer: data.aiAnswer } : c))
        );
        soundEffects.coin();
      }
    } catch (err) {
      console.error('Failed to ask AI:', err);
    } finally {
      setAskingAiForId(null);
    }
  };

  // Submit reply
  const handleSendReply = async (commentId: string) => {
    if (!replyContent.trim()) return;

    try {
      setIsSubmittingReply(true);
      soundEffects.tap();

      const res = await fetch(`/api/comments/${commentId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: replyAuthorName.trim() || 'Sahabat Dentika',
          authorRole: replyRole,
          content: replyContent.trim(),
        }),
      });

      const data = await res.json();
      if (data && data.success && data.reply) {
        setComments(prev =>
          prev.map(c =>
            c.id === commentId ? { ...c, replies: [...c.replies, data.reply] } : c
          )
        );
        setReplyContent('');
        setReplyingToId(null);
        soundEffects.pop();
      }
    } catch (err) {
      console.error('Reply failed:', err);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // Direct AI Ask
  const handleAskDirectAi = async (customPrompt?: string) => {
    const q = (customPrompt || directQuestion).trim();
    if (!q) return;

    try {
      setIsAskingDirectAi(true);
      soundEffects.tap();
      setDirectAiAnswer(null);

      const res = await fetch('/api/ai/ask-direct', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          category: 'Konsultasi Interaktif AI',
          authorName: profile.name || 'Sahabat Dentika',
        }),
      });

      const data = await res.json();
      if (data && data.success && data.answer) {
        setDirectAiAnswer(data.answer);
        soundEffects.fanfare();
      }
    } catch (err) {
      console.error('Direct AI ask failed:', err);
    } finally {
      setIsAskingDirectAi(false);
    }
  };

  // Read aloud AI answer
  const handleSpeakAnswer = (text: string, id: string) => {
    if (speakingTextId === id) {
      stopSpeech();
      setSpeakingTextId(null);
    } else {
      stopSpeech();
      setSpeakingTextId(id);
      speakText(text);
    }
  };

  // Filter comments
  const filteredComments = comments.filter(c => {
    const matchCategory = activeFilter === 'all' || c.category === activeFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.aiAnswer && c.aiAnswer.text.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchCategory && matchSearch;
  });

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* ----------------------------------------------------
          1. HEADER BANNER
          ---------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#143D37] via-[#21736A] to-[#29827D] rounded-3xl p-4 sm:p-6 text-white shadow-xl border-2 border-[#6ED5B6]/30 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              soundEffects.tap();
              onBack();
            }}
            className="p-1 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Kembali ke Menu Utama"
          >
            <BackButton3D size={42} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-black font-['Fredoka'] tracking-wide">
                KOLOM KOMENTAR & TANYA AI 💬✨
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#A2E7D2] font-extrabold">
              Bisa Diakses Semua Orang • Diskusi Sehat • Jawaban Edukasi Dokter Denti AI
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              soundEffects.tap();
              setShowNewCommentForm(prev => !prev);
            }}
            className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 text-white px-4 py-2.5 rounded-2xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-green-900/40 transition-transform active:scale-95 cursor-pointer border border-green-300/40 whitespace-nowrap"
          >
            <span>✏️ Tulis Pertanyaan Baru</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------
          2. KONSULTASI CEPAT: DOKTER DENTI AI (GEMINI POWERED)
          ---------------------------------------------------- */}
      <div className="bg-gradient-to-r from-[#EFF6E9] via-[#FAFDF9] to-[#E2F8F1] rounded-3xl border-2 border-[#6ED5B6] p-5 sm:p-6 shadow-lg space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#21736A] to-[#143D37] flex items-center justify-center text-2xl shadow-md border border-[#6ED5B6]">
              🤖
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black text-[#143D37] font-['Fredoka'] flex items-center gap-2">
                Tanya Kilat Dokter Denti AI
                <span className="text-[10px] bg-[#21736A] text-white px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                  Gemini 3.8 Flash
                </span>
              </h2>
              <p className="text-xs sm:text-sm text-[#21736A] font-bold">
                Punya pertanyaan seputar gigi berlubang, sikat gigi, gusi, atau makanan? Tanyakan di sini!
              </p>
            </div>
          </div>
        </div>

        {/* Input box */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={directQuestion}
              onChange={e => setDirectQuestion(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleAskDirectAi();
              }}
              placeholder="Contoh: Dok, kenapa gigi bisa berlubang kalau makan permen?..."
              className="flex-1 px-4 py-3 rounded-2xl border-2 border-[#C4DCAC] focus:border-[#21736A] focus:outline-hidden bg-white text-sm font-semibold text-[#143D37] shadow-inner placeholder:text-[#143D37]/40"
            />
            <button
              onClick={() => handleAskDirectAi()}
              disabled={isAskingDirectAi || !directQuestion.trim()}
              className="bg-gradient-to-r from-[#21736A] to-[#29827D] hover:opacity-95 disabled:opacity-50 text-white px-6 py-3 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer whitespace-nowrap"
            >
              {isAskingDirectAi ? (
                <>
                  <span className="inline-block animate-spin">🌀</span>
                  <span>Dokter Sedang Menjawab...</span>
                </>
              ) : (
                <>
                  <span>Tanya Dokter AI 🚀</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Prompt Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pt-1">
            <span className="text-[11px] font-black text-[#143D37]/70 mr-1">Pertanyaan Populer:</span>
            {[
              'Kenapa gigi terasa ngilu saat minum air es?',
              'Berapa menit waktu sikat gigi yang ideal?',
              'Apa bedanya plak gigi dan karang gigi?',
              'Cara mengatasi sariawan yang perih?',
              'Makanan apa yang bikin gigi putih dan kuat?',
            ].map((q, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setDirectQuestion(q);
                  handleAskDirectAi(q);
                }}
                className="bg-white/80 hover:bg-[#E2F8F1] border border-[#C4DCAC] text-[#143D37] text-[11px] font-bold px-3 py-1 rounded-full transition-all cursor-pointer shadow-2xs hover:border-[#6ED5B6]"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Direct AI Answer Box */}
        {directAiAnswer && (
          <div className="mt-4 bg-white rounded-2xl border-2 border-[#6ED5B6] p-4 sm:p-5 shadow-md space-y-3 animate-fade-in">
            <div className="flex items-center justify-between border-b border-[#EFF6E9] pb-2">
              <div className="flex items-center gap-2">
                <span className="text-xl">🩺</span>
                <span className="font-black text-sm text-[#143D37] font-['Fredoka']">
                  Jawaban Ahli dari Dokter Denti
                </span>
                <span className="text-[10px] bg-[#E2F8F1] text-[#21736A] px-2 py-0.5 rounded-full font-bold">
                  {directAiAnswer.model}
                </span>
              </div>
              <button
                onClick={() => handleSpeakAnswer(directAiAnswer.text, 'direct-ai')}
                className="text-xs font-bold text-[#21736A] hover:text-[#143D37] flex items-center gap-1 bg-[#EFF6E9] px-2.5 py-1 rounded-lg border border-[#C4DCAC] cursor-pointer"
              >
                <span>{speakingTextId === 'direct-ai' ? '⏹️ Berhenti' : '🔊 Bacakan Suara'}</span>
              </button>
            </div>

            <p className="text-xs sm:text-sm text-[#143D37] font-medium leading-relaxed whitespace-pre-line">
              {directAiAnswer.text}
            </p>

            <div className="pt-2 flex justify-end">
              <button
                onClick={() => {
                  soundEffects.tap();
                  setCommentTitle(directQuestion);
                  setCommentContent(directQuestion);
                  setShowNewCommentForm(true);
                  window.scrollTo({ top: 300, behavior: 'smooth' });
                }}
                className="text-xs font-black text-[#21736A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Bagikan pertanyaan ini ke Kolom Komentar Publik 💬</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ----------------------------------------------------
          3. FORM TAMBAH KOMENTAR BARU
          ---------------------------------------------------- */}
      {showNewCommentForm && (
        <form
          onSubmit={handlePostComment}
          className="bg-white rounded-3xl border-2 border-[#21736A] p-5 sm:p-6 shadow-xl space-y-4 animate-scale-in"
        >
          <div className="flex items-center justify-between border-b border-[#EFF6E9] pb-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📝</span>
              <h3 className="text-lg font-black text-[#143D37] font-['Fredoka']">
                Tulis Komentar / Pertanyaan ke Komunitas
              </h3>
            </div>
            <button
              type="button"
              onClick={() => setShowNewCommentForm(false)}
              className="text-gray-400 hover:text-gray-600 font-black text-sm cursor-pointer p-1"
            >
              Tutup ✖
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Nama */}
            <div>
              <label className="block text-xs font-extrabold text-[#143D37] mb-1">
                Nama Pengirim:
              </label>
              <input
                type="text"
                required
                value={authorName}
                onChange={e => setAuthorName(e.target.value)}
                placeholder="Nama kamu..."
                className="w-full px-3 py-2 rounded-xl border border-[#C4DCAC] focus:border-[#21736A] text-xs font-bold text-[#143D37]"
              />
            </div>

            {/* Peran */}
            <div>
              <label className="block text-xs font-extrabold text-[#143D37] mb-1">
                Peran Pengirim:
              </label>
              <select
                value={authorRole}
                onChange={e => setAuthorRole(e.target.value as any)}
                className="w-full px-3 py-2 rounded-xl border border-[#C4DCAC] focus:border-[#21736A] text-xs font-bold text-[#143D37] bg-white"
              >
                <option value="anak">👧 Anak Cilik (Pahlawan Senyum)</option>
                <option value="orang_tua">👨‍👩‍👧 Orang Tua / Wali</option>
                <option value="dokter_gigi">🩺 Dokter Gigi / Tenaga Medis</option>
              </select>
            </div>

            {/* Kategori Materi */}
            <div>
              <label className="block text-xs font-extrabold text-[#143D37] mb-1">
                Kategori Bahasan:
              </label>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[#C4DCAC] focus:border-[#21736A] text-xs font-bold text-[#143D37] bg-white"
              >
                {categories
                  .filter(c => c.id !== 'all')
                  .map(c => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>

          {/* Judul */}
          <div>
            <label className="block text-xs font-extrabold text-[#143D37] mb-1">
              Judul Pertanyaan / Pengalaman:
            </label>
            <input
              type="text"
              required
              value={commentTitle}
              onChange={e => setCommentTitle(e.target.value)}
              placeholder="Contoh: Cara agar adik kecil mau sikat gigi tanpa menangis..."
              className="w-full px-3 py-2 rounded-xl border border-[#C4DCAC] focus:border-[#21736A] text-xs font-bold text-[#143D37]"
            />
          </div>

          {/* Isi Pesan */}
          <div>
            <label className="block text-xs font-extrabold text-[#143D37] mb-1">
              Isi Komentar / Pertanyaan Lengkap:
            </label>
            <textarea
              required
              rows={3}
              value={commentContent}
              onChange={e => setCommentContent(e.target.value)}
              placeholder="Tuliskan pertanyaan atau ceritamu secara lengkap di sini agar teman-teman dan dokter gigi bisa membantu..."
              className="w-full px-3 py-2.5 rounded-xl border border-[#C4DCAC] focus:border-[#21736A] text-xs font-medium text-[#143D37]"
            />
          </div>

          {/* Checkbox Tanya AI */}
          <div className="flex items-center gap-2 bg-[#EFF6E9] p-3 rounded-xl border border-[#C4DCAC]">
            <input
              type="checkbox"
              id="askAiCheck"
              checked={askAiAuto}
              onChange={e => setAskAiAuto(e.target.checked)}
              className="w-4 h-4 text-[#21736A] rounded-md focus:ring-0 cursor-pointer"
            />
            <label htmlFor="askAiCheck" className="text-xs font-black text-[#143D37] cursor-pointer">
              🤖 Minta Dokter Denti AI menjawab pertanyaan ini otomatis sesuai materi medis Dentika!
            </label>
          </div>

          {/* Submit buttons */}
          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => setShowNewCommentForm(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#143D37] hover:bg-[#EFF6E9] cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !commentContent.trim()}
              className="bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:opacity-95 disabled:opacity-50 text-white px-6 py-2.5 rounded-xl font-black text-xs sm:text-sm flex items-center gap-2 shadow-md transition-transform active:scale-95 cursor-pointer"
            >
              {isSubmitting ? 'Mengirim...' : 'Kirim ke Komunitas 🚀'}
            </button>
          </div>
        </form>
      )}

      {/* ----------------------------------------------------
          4. FILTER CHIPS & PENCARIAN
          ---------------------------------------------------- */}
      <div className="bg-[#FAFDF9] rounded-2xl border border-[#C4DCAC] p-3.5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="w-full sm:w-72 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Cari topik atau kata kunci..."
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#C4DCAC] text-xs font-semibold text-[#143D37] bg-white focus:outline-hidden focus:border-[#21736A]"
            />
            <span className="absolute left-3 top-2.5 text-xs text-gray-400">🔍</span>
          </div>

          <div className="text-xs font-bold text-[#21736A]">
            Menampilkan <span className="font-black text-[#143D37]">{filteredComments.length}</span> komentar
          </div>
        </div>

        {/* Filter categories */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => {
                soundEffects.tap();
                setActiveFilter(cat.id);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                activeFilter === cat.id
                  ? 'bg-[#21736A] text-white shadow-xs'
                  : 'bg-[#EFF6E9] text-[#143D37] hover:bg-[#E2F8F1] border border-[#C4DCAC]/60'
              }`}
            >
              <span>{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ----------------------------------------------------
          5. DAFTAR KOMENTAR & JAWABAN AI
          ---------------------------------------------------- */}
      {loading ? (
        <div className="text-center py-12 space-y-3">
          <div className="inline-block animate-spin text-3xl">🌀</div>
          <p className="text-sm font-bold text-[#21736A]">Memuat komentar komunitas...</p>
        </div>
      ) : filteredComments.length === 0 ? (
        <div className="bg-white rounded-3xl border-2 border-dashed border-[#C4DCAC] p-8 text-center space-y-3">
          <span className="text-4xl">💬</span>
          <h3 className="text-base font-black text-[#143D37] font-['Fredoka']">
            Belum ada komentar untuk topik ini
          </h3>
          <p className="text-xs text-[#143D37]/70 max-w-md mx-auto">
            Jadilah yang pertama mengajukan pertanyaan atau berbagi pengalaman seputar gigi sehat!
          </p>
          <button
            onClick={() => setShowNewCommentForm(true)}
            className="bg-[#21736A] text-white px-4 py-2 rounded-xl text-xs font-black hover:opacity-95 cursor-pointer shadow-xs"
          >
            Tulis Komentar Sekarang ✨
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredComments.map(comment => {
            const roleBadge =
              comment.authorRole === 'dokter_gigi'
                ? { label: 'Dokter Gigi', color: 'bg-teal-100 text-teal-800 border-teal-300' }
                : comment.authorRole === 'orang_tua'
                ? { label: 'Orang Tua', color: 'bg-amber-100 text-amber-800 border-amber-300' }
                : { label: 'Pahlawan Senyum', color: 'bg-blue-100 text-blue-800 border-blue-300' };

            const isReplying = replyingToId === comment.id;

            return (
              <div
                key={comment.id}
                className="bg-white rounded-3xl border-2 border-[#C4DCAC] p-5 shadow-sm hover:border-[#6ED5B6] transition-all space-y-4"
              >
                {/* Comment Header */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#EFF6E9] to-[#E2F8F1] border border-[#6ED5B6] flex items-center justify-center text-lg font-black text-[#21736A] shadow-xs">
                      {comment.authorRole === 'dokter_gigi'
                        ? '🩺'
                        : comment.authorRole === 'orang_tua'
                        ? '👨‍👩‍👧'
                        : '👧'}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-black text-sm text-[#143D37]">
                          {comment.authorName}
                        </span>
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${roleBadge.color}`}
                        >
                          {roleBadge.label}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#143D37]/60 font-semibold flex items-center gap-1.5 mt-0.5">
                        <span className="bg-[#EFF6E9] text-[#21736A] font-bold px-2 py-0.5 rounded-md text-[10px]">
                          {comment.categoryLabel}
                        </span>
                        <span>•</span>
                        <span>
                          {new Date(comment.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Like Button */}
                  <button
                    onClick={() => handleLikeComment(comment.id)}
                    className="flex items-center gap-1.5 bg-[#FFF1F2] hover:bg-[#FFE4E6] text-[#E11D48] px-3 py-1.5 rounded-xl border border-[#FDA4AF] text-xs font-black transition-transform active:scale-95 cursor-pointer"
                  >
                    <span>❤️</span>
                    <span>{comment.likes || 0}</span>
                  </button>
                </div>

                {/* Comment Content */}
                <div className="space-y-1">
                  <h4 className="text-base font-black text-[#143D37] font-['Fredoka']">
                    {comment.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#143D37]/90 font-medium leading-relaxed">
                    {comment.content}
                  </p>
                </div>

                {/* ----------------------------------------------------
                    JAWABAN RESMI DOKTER DENTI AI CARD
                    ---------------------------------------------------- */}
                {comment.aiAnswer ? (
                  <div className="bg-gradient-to-r from-[#EFF6E9] via-[#FAFDF9] to-[#E2F8F1] rounded-2xl border-2 border-[#6ED5B6] p-4 shadow-xs space-y-2.5">
                    <div className="flex items-center justify-between border-b border-[#C4DCAC]/40 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🤖</span>
                        <span className="font-black text-xs sm:text-sm text-[#143D37] font-['Fredoka']">
                          Jawaban Edukasi Dokter Denti AI
                        </span>
                        <span className="text-[9px] bg-[#21736A] text-white px-2 py-0.5 rounded-full font-bold">
                          {comment.aiAnswer.model}
                        </span>
                      </div>
                      <button
                        onClick={() => handleSpeakAnswer(comment.aiAnswer!.text, comment.id)}
                        className="text-[11px] font-bold text-[#21736A] hover:text-[#143D37] flex items-center gap-1 bg-white px-2 py-1 rounded-lg border border-[#C4DCAC] cursor-pointer"
                      >
                        <span>{speakingTextId === comment.id ? '⏹️ Stop' : '🔊 Dengar Suara'}</span>
                      </button>
                    </div>

                    <p className="text-xs sm:text-sm text-[#143D37] font-medium leading-relaxed whitespace-pre-line">
                      {comment.aiAnswer.text}
                    </p>
                  </div>
                ) : (
                  <div className="bg-[#EFF6E9]/60 rounded-2xl p-3 border border-dashed border-[#C4DCAC] flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#143D37]/75">
                      Belum ada jawaban dari Dokter Denti AI untuk pertanyaan ini.
                    </span>
                    <button
                      onClick={() => handleAskAiForComment(comment.id)}
                      disabled={askingAiForId === comment.id}
                      className="bg-[#21736A] hover:bg-[#143D37] disabled:opacity-50 text-white text-xs font-black px-3 py-1.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      {askingAiForId === comment.id ? (
                        <>
                          <span className="inline-block animate-spin text-[10px]">🌀</span>
                          <span>Menjawab...</span>
                        </>
                      ) : (
                        <>
                          <span>🤖 Jawab dengan AI</span>
                        </>
                      )}
                    </button>
                  </div>
                )}

                {/* ----------------------------------------------------
                    THREADED REPLIES DARI KOMUNITAS
                    ---------------------------------------------------- */}
                {comment.replies && comment.replies.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-[#EFF6E9]">
                    <div className="text-[11px] font-black text-[#21736A] uppercase tracking-wider">
                      Balasan Komunitas ({comment.replies.length}):
                    </div>
                    {comment.replies.map(reply => (
                      <div
                        key={reply.id}
                        className="bg-[#FAFDF9] rounded-xl p-3 border border-[#C4DCAC]/60 ml-4 space-y-1"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-xs text-[#143D37]">
                            {reply.authorName}
                          </span>
                          <span className="text-[10px] text-gray-400">
                            {new Date(reply.createdAt).toLocaleDateString('id-ID', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <p className="text-xs text-[#143D37]/90 font-medium leading-normal">
                          {reply.content}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ----------------------------------------------------
                    FORM BALAS
                    ---------------------------------------------------- */}
                {isReplying ? (
                  <div className="bg-[#EFF6E9] p-3 rounded-2xl border border-[#C4DCAC] space-y-2.5 animate-fade-in">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black text-[#143D37]">
                        Balas Pertanyaan {comment.authorName}:
                      </span>
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="text-xs text-gray-400 hover:text-gray-600 font-bold cursor-pointer"
                      >
                        Batal ✖
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={replyAuthorName}
                        onChange={e => setReplyAuthorName(e.target.value)}
                        placeholder="Nama kamu..."
                        className="px-3 py-1.5 rounded-xl border border-[#C4DCAC] text-xs font-bold text-[#143D37] bg-white"
                      />
                      <select
                        value={replyRole}
                        onChange={e => setReplyRole(e.target.value as any)}
                        className="px-3 py-1.5 rounded-xl border border-[#C4DCAC] text-xs font-bold text-[#143D37] bg-white"
                      >
                        <option value="anak">👧 Anak Cilik</option>
                        <option value="orang_tua">👨‍👩‍👧 Orang Tua</option>
                        <option value="dokter_gigi">🩺 Dokter Gigi</option>
                      </select>
                    </div>

                    <textarea
                      rows={2}
                      value={replyContent}
                      onChange={e => setReplyContent(e.target.value)}
                      placeholder="Tuliskan saran atau pengalamanmu di sini..."
                      className="w-full px-3 py-2 rounded-xl border border-[#C4DCAC] text-xs font-medium text-[#143D37] bg-white"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => setReplyingToId(null)}
                        className="text-xs font-bold text-[#143D37] px-3 py-1.5 rounded-xl hover:bg-white/50 cursor-pointer"
                      >
                        Batal
                      </button>
                      <button
                        onClick={() => handleSendReply(comment.id)}
                        disabled={isSubmittingReply || !replyContent.trim()}
                        className="bg-[#21736A] hover:opacity-95 disabled:opacity-50 text-white text-xs font-black px-4 py-1.5 rounded-xl transition-all cursor-pointer shadow-xs"
                      >
                        {isSubmittingReply ? 'Mengirim...' : 'Kirim Balasan 💬'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between pt-1">
                    <button
                      onClick={() => {
                        soundEffects.tap();
                        setReplyingToId(comment.id);
                      }}
                      className="text-xs font-black text-[#21736A] hover:text-[#143D37] flex items-center gap-1 cursor-pointer"
                    >
                      <span>💬 Tambah Balasan</span>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
