import { ExpandedStep } from '@/types/workout';

// Singleton AudioContext for Web Audio API
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

// Caching voices for mobile & desktop browsers
let cachedVoices: SpeechSynthesisVoice[] = [];

if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
  cachedVoices = window.speechSynthesis.getVoices();
  window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
  };
}

export function unlockAudio(): void {
  try {
    const ctx = getAudioContext();
    if (ctx && ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.resume();
    }
  } catch (e) {
    console.warn('unlockAudio failed:', e);
  }
}

export function playBeep(freq = 880, duration = 0.2, type: OscillatorType = 'sine'): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Smooth envelope to prevent audio click
    gain.gain.setValueAtTime(0.001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.3, ctx.currentTime + 0.03);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration);
  } catch (err) {
    console.warn('Audio playBeep failed:', err);
  }
}

export function playCountdownBeep(isFinal = false): void {
  // Higher pitch for the final beep
  const freq = isFinal ? 880 : 520;
  const duration = isFinal ? 0.35 : 0.15;
  playBeep(freq, duration, 'sine');
}

export function cancelSpeech(): void {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}

export function speakText(text: string, rate: 'normal' | 'fast' = 'normal'): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      resolve();
      return;
    }

    cancelSpeech();

    // Ensure audio context and speech engine are awake
    unlockAudio();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = rate === 'fast' ? 1.2 : 1.0;
    utterance.pitch = 1.0;

    // Pick best available English voice or fallback
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => {
      const code = v.lang.toLowerCase().replace('_', '-');
      return code === 'en-us' || code.startsWith('en-') || code.includes('en');
    });

    if (enVoice) {
      utterance.voice = enVoice;
    }

    utterance.onend = () => resolve();
    utterance.onerror = () => resolve();

    // Safety timeout in case speech engine on mobile freezes
    setTimeout(() => resolve(), 5000);

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('speechSynthesis.speak failed:', e);
      resolve();
    }
  });
}

function durationToEnglishWords(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  if (m > 0 && s > 0) {
    return `${m} minute${m > 1 ? 's' : ''} ${s} second${s > 1 ? 's' : ''}`;
  }
  if (m > 0) {
    return `${m} minute${m > 1 ? 's' : ''}`;
  }
  return `${s} second${s > 1 ? 's' : ''}`;
}

export function generateCueInstruction(step: ExpandedStep): string {
  const durationText = durationToEnglishWords(step.durationSeconds);
  const label = step.label.toLowerCase();

  switch (step.type) {
    case 'warmup':
      return `Start warmup. ${step.label} for ${durationText}.`;
    case 'run':
      if (step.repeatIndex && step.repeatCount) {
        return `Start running for ${durationText}. Round ${step.repeatIndex} of ${step.repeatCount}.`;
      }
      return `Start running for ${durationText}.`;
    case 'walk':
      return `Walk for ${durationText}.`;
    case 'cooldown':
      return `Start cooldown for ${durationText}.`;
    case 'rest':
      return `Rest for ${durationText}.`;
    default:
      return `Start ${label} for ${durationText}.`;
  }
}
