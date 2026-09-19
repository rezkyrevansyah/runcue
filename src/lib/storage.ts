import { Workout, AudioSettings } from '@/types/workout';
import { DEFAULT_AUDIO_SETTINGS, SAMPLE_PRESETS } from './constants';

const WORKOUTS_KEY = 'runcue_workouts_v1';
const SETTINGS_KEY = 'runcue_settings_v1';

export function getStoredWorkouts(): Workout[] {
  if (typeof window === 'undefined') return SAMPLE_PRESETS;
  try {
    const raw = localStorage.getItem(WORKOUTS_KEY);
    if (!raw) {
      saveStoredWorkouts(SAMPLE_PRESETS);
      return SAMPLE_PRESETS;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return SAMPLE_PRESETS;
  } catch (err) {
    console.error('Failed to read workouts from localStorage:', err);
    return SAMPLE_PRESETS;
  }
}

export function saveStoredWorkouts(workouts: Workout[]): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
    return true;
  } catch (err) {
    console.error('Failed to save workouts to localStorage:', err);
    return false;
  }
}

export function getStoredSettings(): AudioSettings {
  if (typeof window === 'undefined') return DEFAULT_AUDIO_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_AUDIO_SETTINGS;
    return { ...DEFAULT_AUDIO_SETTINGS, ...JSON.parse(raw) };
  } catch (err) {
    console.error('Failed to read settings from localStorage:', err);
    return DEFAULT_AUDIO_SETTINGS;
  }
}

export function saveStoredSettings(settings: AudioSettings): boolean {
  if (typeof window === 'undefined') return false;
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    return true;
  } catch (err) {
    console.error('Failed to save settings to localStorage:', err);
    return false;
  }
}
