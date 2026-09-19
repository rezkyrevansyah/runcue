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
    utterance.lang = 'id-ID';
    utterance.rate = rate === 'fast' ? 1.2 : 1.0;
    utterance.pitch = 1.0;

    // Pick best available Indonesian voice or fallback
    const voices = cachedVoices.length > 0 ? cachedVoices : window.speechSynthesis.getVoices();
    const idVoice = voices.find(v => {
      const code = v.lang.toLowerCase().replace('_', '-');
      return code === 'id-id' || code === 'id' || code.startsWith('id-');
    });

    if (idVoice) {
      utterance.voice = idVoice;
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

function durationToIndonesianWords(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;

  const numberWords: Record<number, string> = {
    1: 'satu', 2: 'dua', 3: 'tiga', 4: 'empat', 5: 'lima',
    6: 'enam', 7: 'tujuh', 8: 'delapan', 9: 'sembilan', 10: 'sepuluh',
    15: 'lima belas', 20: 'dua puluh', 30: 'tiga puluh', 45: 'empat puluh lima'
  };

  const getWord = (n: number) => numberWords[n] || n.toString();

  if (m > 0 && s > 0) {
    return `${getWord(m)} menit ${getWord(s)} detik`;
  }
  if (m > 0) {
    return `${getWord(m)} menit`;
  }
  return `${getWord(s)} detik`;
}

export function generateCueInstruction(step: ExpandedStep): string {
  const durationText = durationToIndonesianWords(step.durationSeconds);
  const label = step.label.toLowerCase();

  let prefix = '';
  switch (step.type) {
    case 'warmup':
      prefix = `Mulai pemanasan. ${step.label} selama ${durationText}.`;
      break;
    case 'run':
      if (step.repeatIndex && step.repeatCount) {
        prefix = `Mulai lari selama ${durationText}. Putaran ${step.repeatIndex} dari ${step.repeatCount}.`;
      } else {
        prefix = `Mulai lari selama ${durationText}.`;
      }
      break;
    case 'walk':
      prefix = `Sekarang jalan selama ${durationText}.`;
      break;
    case 'cooldown':
      prefix = `Mulai pendinginan selama ${durationText}.`;
      break;
    case 'rest':
      prefix = `Istirahat selama ${durationText}.`;
      break;
    default:
      prefix = `Mulai ${label} selama ${durationText}.`;
  }

  return prefix;
}
