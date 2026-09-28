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

export interface RewardItem {
  id: string;
  name: string;
  type: 'hat' | 'glasses' | 'cape' | 'glow' | 'tool';
  icon: string;
  cost: number;
  unlocked: boolean;
  description: string;
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

export interface ChildProfile {
  name: string;
  avatar: string;
  score: number;
  coins: number;
  stars: number;
  streakDays: number;
  lastPlayedDate: string;
  selectedHat?: string;
  selectedGlasses?: string;
  selectedCape?: string;
  selectedGlow?: string;
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
