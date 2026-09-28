import { ChildProfile, ParentSettings, DailyPlayTracker } from '../types';
import { INITIAL_CHILD_PROFILE, INITIAL_PARENT_SETTINGS } from '../data/rewardsData';

const STORAGE_KEYS = {
  PROFILE: 'dentika_child_profile',
  SETTINGS: 'dentika_parent_settings',
  DAILY: 'dentika_daily_tracker',
  SYNC_CODE: 'dentika_sync_code',
};

// Generate random 6-character sync code (e.g., GIGI-72)
export function generateSyncCode(): string {
  const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const prefix = letters[Math.floor(Math.random() * letters.length)] + letters[Math.floor(Math.random() * letters.length)];
  const num = Math.floor(1000 + Math.random() * 9000);
  return `GIGI-${num}`;
}

export function getStoredSyncCode(): string {
  if (typeof window === 'undefined') return 'GIGI-1000';
  let code = localStorage.getItem(STORAGE_KEYS.SYNC_CODE);
  if (!code) {
    code = generateSyncCode();
    localStorage.setItem(STORAGE_KEYS.SYNC_CODE, code);
  }
  return code;
}

export function loadProfileFromStorage(): ChildProfile {
  if (typeof window === 'undefined') return INITIAL_CHILD_PROFILE;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
    if (data) {
      return { ...INITIAL_CHILD_PROFILE, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load profile from storage', e);
  }
  return INITIAL_CHILD_PROFILE;
}

export function saveProfileToStorage(profile: ChildProfile) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  } catch (e) {
    console.error('Failed to save profile to storage', e);
  }
}

export function loadParentSettings(): ParentSettings {
  if (typeof window === 'undefined') return INITIAL_PARENT_SETTINGS;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (data) {
      return { ...INITIAL_PARENT_SETTINGS, ...JSON.parse(data) };
    }
  } catch (e) {
    console.error('Failed to load settings', e);
  }
  return INITIAL_PARENT_SETTINGS;
}

export function saveParentSettings(settings: ParentSettings) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.error('Failed to save settings', e);
  }
}

export function getTodayDateString(): string {
  return new Date().toISOString().split('T')[0];
}

export function loadDailyTracker(): DailyPlayTracker {
  const today = getTodayDateString();
  const defaultTracker: DailyPlayTracker = {
    date: today,
    secondsPlayedToday: 0,
    brushingDoneMorning: false,
    brushingDoneNight: false,
  };

  if (typeof window === 'undefined') return defaultTracker;
  try {
    const data = localStorage.getItem(STORAGE_KEYS.DAILY);
    if (data) {
      const parsed = JSON.parse(data);
      if (parsed.date === today) {
        return parsed;
      }
    }
  } catch (e) {}

  return defaultTracker;
}

export function saveDailyTracker(tracker: DailyPlayTracker) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEYS.DAILY, JSON.stringify(tracker));
  } catch (e) {}
}

// Cloud Sync Functions
export async function syncUploadToCloud(
  syncCode: string,
  profile: ChildProfile,
  settings: ParentSettings
): Promise<{ success: boolean; message: string; updatedAt?: string }> {
  try {
    const response = await fetch('/api/sync/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        syncCode,
        progressData: {
          playerName: profile.name,
          score: profile.score,
          stars: profile.stars,
          avatar: profile.avatar,
          profile,
          settings,
        },
      }),
    });

    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Gagal sinkronisasi');
    }
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Koneksi gagal. Sedang dalam mode luring/offline.',
    };
  }
}

export async function syncDownloadFromCloud(
  syncCode: string
): Promise<{ success: boolean; profile?: ChildProfile; settings?: ParentSettings; message: string }> {
  try {
    const response = await fetch(`/api/sync/load/${encodeURIComponent(syncCode)}`);
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Data tidak ditemukan');
    }

    const { progressData } = result;
    return {
      success: true,
      profile: progressData.profile,
      settings: progressData.settings,
      message: 'Data berhasil disinkronkan dari server!',
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Tidak dapat mengunduh data. Pastikan perangkat tersambung internet.',
    };
  }
}

// Direct Weekly Report Email trigger
export async function sendWeeklyReportEmail(
  email: string,
  childName: string,
  reportSummary: any
): Promise<{ success: boolean; message: string; sentAt?: string }> {
  try {
    const response = await fetch('/api/parent/email-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, childName, reportSummary }),
    });
    const result = await response.json();
    if (!response.ok) {
      throw new Error(result.error || 'Gagal mengirim email');
    }
    return result;
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Gagal mengirim email secara online.',
    };
  }
}
