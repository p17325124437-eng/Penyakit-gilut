export type DentalDiseaseId =
  | 'karies'
  | 'karang_gigi'
  | 'gingivitis'
  | 'sariawan'
  | 'bau_mulut'
  | 'gigi_sensitif'
  | 'erosi_asam';

export interface DentalDisease {
  id: DentalDiseaseId;
  name: string;
  childTitle: string;
  tagline: string;
  icon: string;
  color: string;
  bgColor: string;
  borderColor: string;
  dangerLevel: 1 | 2 | 3;
  villainName: string;
  villainAvatar: string;
  description: string;
  causes: { text: string; icon: string }[];
  symptoms: { text: string; icon: string }[];
  prevention: { text: string; icon: string }[];
  funFact: string;
  story: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  diseaseCategory: DentalDiseaseId | 'umum' | 'makanan';
  categoryLabel: string;
  options: {
    id: string;
    text: string;
    icon: string;
    isCorrect: boolean;
  }[];
  explanation: string;
  hint: string;
  points: number;
}

export interface FoodItem {
  id: string;
  name: string;
  icon: string;
  isHealthy: boolean; // Healthy for teeth or tooth hazard
  description: string;
  badge: string;
}

export type AvatarCategory =
  | 'skin'
  | 'outfit'
  | 'hand'
  | 'hat'
  | 'accessory'
  | 'expression'
  | 'profession'
  | 'background'
  | 'extra'
  | 'glasses'
  | 'cape'
  | 'glow'
  | 'tool';

export interface RewardItem {
  id: string;
  name: string;
  type: AvatarCategory;
  icon: string;
  cost: number;
  unlocked: boolean;
  description: string;
  tier?: 1 | 2 | 3 | 4 | 5;
}

export interface Badge {
  id: string;
  title: string;
  icon: string;
  description: string;
  unlocked: boolean;
  progress: number;
  maxProgress: number;
  unlockedAt?: string;
}

export type ToothSkinMaterial = 'white' | 'gold' | 'black' | 'diamond';
export type ToothExpression =
  | 'senyum'
  | 'tertawa'
  | 'wink'
  | 'bahagia'
  | 'semangat'
  | 'kaget'
  | 'sedih'
  | 'marah'
  | 'malu'
  | 'ngantuk'
  | 'sayang'
  | 'keren';

export type BackgroundScene =
  | 'kamar'
  | 'klinik'
  | 'lab'
  | 'angkasa'
  | 'pantai'
  | 'kastil';

export type AvatarBaseCharacter = 'chibi' | 'molar' | 'hero' | 'boba';

export interface ChildProfile {
  name: string;
  avatar: string;
  score: number;
  coins: number;
  stars: number;
  gems: number;
  lives: number;
  maxLives: number;
  streakDays: number;
  lastPlayedDate: string;

  // Avatar Customization (from Gambar 3)
  baseCharacter?: AvatarBaseCharacter;
  skinMaterial: ToothSkinMaterial;
  expression: ToothExpression;
  tier: 1 | 2 | 3 | 4 | 5;
  selectedOutfit?: string;
  selectedHand?: string;
  selectedHat?: string;
  selectedAccessory?: string;
  selectedGlasses?: string;
  selectedCape?: string;
  selectedGlow?: string;
  selectedProfession?: string;
  selectedBackground: BackgroundScene;
  selectedExtra?: string;

  unlockedRewards: string[];
  badges: Badge[];
  completedQuizzes: number;
  correctAnswers: number;
  totalQuestionsAnswered: number;
  brushingSessionsCompleted: number;
  exploredDiseases: string[];
  germBusterHighScore: number;
  foodSorterHighScore: number;
}

export interface ParentSettings {
  pin: string;
  parentEmail: string;
  dailyTimeLimitMinutes: number; // 0 for unlimited, or 10, 15, 20, 30, 45, 60
  soundEnabled: boolean;
  musicEnabled: boolean;
  speechAudioEnabled: boolean;
  morningReminderTime: string; // e.g. "07:00"
  nightReminderTime: string; // e.g. "20:00"
  remindersActive: boolean;
}

export interface DailyPlayTracker {
  date: string;
  secondsPlayedToday: number;
  brushingDoneMorning: boolean;
  brushingDoneNight: boolean;
}

export interface CommentReply {
  id: string;
  authorName: string;
  authorRole: 'anak' | 'orang_tua' | 'dokter_gigi' | 'ai_dokter';
  content: string;
  createdAt: string;
  likes: number;
}

export interface CommentItem {
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

// ---------------------------------------------------------------------
// 1. RBAC & USER PROFILE MODELS
// ---------------------------------------------------------------------
export type UserRole = 'super_admin' | 'dokter_gigi' | 'terapis_gigi' | 'orang_tua' | 'anak';

export type UserGender = 'Laki-laki' | 'Perempuan';

export interface AppUserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL?: string;
  primaryRole: UserRole;
  activeRole: UserRole;
  // Dual-role capability
  hasParentRole: boolean;
  hasChildRole: boolean;
  // Demographic data required during registration
  age: number;
  gender: UserGender;
  childName?: string;
  childAge?: number;
  childGender?: UserGender;
  // Timestamps & Sync
  createdAt: string;
  lastLoginAt: string;
  // Sequential Level Progress
  currentLevel: number;
  completedModuleIds: string[];
  completedLevelIds: number[];
  quizScores: Record<number, { score: number; passed: boolean; attempts: number; completedAt: string }>;
}

export interface StaffAccount {
  email: string;
  name: string;
  role: 'dokter_gigi' | 'terapis_gigi';
  specialty?: string;
  addedBy: string;
  addedAt: string;
  active: boolean;
}

// ---------------------------------------------------------------------
// 2. SEQUENTIAL LEARNING & GAMIFICATION MODELS
// ---------------------------------------------------------------------
export interface EducationalModule {
  id: string;
  levelNumber: number;
  order: number; // 1, 2, 3...
  title: string;
  childTitle: string;
  summary: string;
  content: string[];
  keyTakeaway: string;
  actionTip: string;
  icon: string;
  badgeUnlockedTitle?: string;
  diseaseRef?: DentalDiseaseId;
}

export interface SequentialLevel {
  levelNumber: number;
  title: string;
  rankTitle: string;
  subtitle: string;
  icon: string;
  color: string;
  bgGradient: string;
  requiredExp: number;
  rewardCoins: number;
  rewardStars: number;
  modules: EducationalModule[];
  quizQuestions: QuizQuestion[];
}

// ---------------------------------------------------------------------
// 3. SUPER ADMIN LAYOUT & VISUAL CUSTOMIZATION
// ---------------------------------------------------------------------
export interface LayoutCardConfig {
  id: string;
  label: string;
  sublabel: string;
  icon: string; // emoji or custom SVG/image URL
  color: string;
  visible: boolean;
  order: number;
}

export interface AppCustomizationConfig {
  appTitle: string;
  appSubtitle: string;
  themePrimaryColor: string; // e.g., #21736A
  themeSecondaryColor: string; // e.g., #143D37
  themeAccentColor: string; // e.g., #22C55E
  themeBgColor: string; // e.g., #F0FDF4
  bannerTagline: string;
  cards: LayoutCardConfig[];
  updatedAt: string;
  updatedBy: string;
}

// ---------------------------------------------------------------------
// 4. RISK WARNING NOTIFICATION MODAL
// ---------------------------------------------------------------------
export interface RiskWarningData {
  title: string;
  description: string;
  riskNotice: string;
  severity: 'low' | 'medium' | 'high';
  confirmLabel: string;
  cancelLabel?: string;
  action: () => void | Promise<void>;
}

// ---------------------------------------------------------------------
// 5. CLINICAL ANALYSIS & RECOMMENDATION MODELS
// ---------------------------------------------------------------------
export interface ClinicalRecommendationNote {
  id: string;
  childUid?: string; // empty string for general global recommendation
  childName?: string;
  authorEmail: string;
  authorName: string;
  authorRole: 'dokter_gigi' | 'terapis_gigi' | 'super_admin';
  category: 'pencegahan_karies' | 'kebugaran_gusi' | 'pola_makan' | 'teknik_sikat' | 'skrining_klinis';
  note: string;
  actionStep: string;
  riskLevel: 'Rendah' | 'Sedang' | 'Tinggi';
  createdAt: string;
}

export interface DentalAnalyticsSummary {
  totalRegisteredUsers: number;
  totalChildrenProfiles: number;
  totalParentsProfiles: number;
  totalQuizzesTaken: number;
  averageHygieneScore: number;
  adherenceStats: {
    morningBrushingRate: number; // percentage (0-100)
    nightBrushingRate: number; // percentage (0-100)
    bothDailyRate: number; // percentage (0-100)
  };
  cariesRiskDistribution: {
    low: number; // percentage
    medium: number;
    high: number;
  };
  mostCommonErrors: {
    topic: string;
    mistakeCount: number;
    explanation: string;
  }[];
  expertRecommendations: string[];
}

