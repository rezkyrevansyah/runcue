import { Workout, AudioSettings, StepType } from '@/types/workout';

export const DEFAULT_AUDIO_SETTINGS: AudioSettings = {
  voiceEnabled: true,
  beepEnabled: true,
  countdownEnabled: true,
  wakeLockEnabled: true,
  speechRate: 'normal',
  language: 'id-ID',
};

export const DEFAULT_PRESET: Workout = {
  id: 'preset-c25k-default',
  schemaVersion: 1,
  name: 'Interval Run/Walk C25K',
  blocks: [
    {
      id: 'step-warmup-1',
      kind: 'step',
      type: 'warmup',
      label: 'Pemanasan Jalan',
      durationSeconds: 300, // 5:00
    },
    {
      id: 'group-interval-1',
      kind: 'repeat',
      count: 8,
      steps: [
        {
          id: 'step-run-1',
          kind: 'step',
          type: 'run',
          label: 'Lari',
          durationSeconds: 60, // 1:00
        },
        {
          id: 'step-walk-1',
          kind: 'step',
          type: 'walk',
          label: 'Jalan',
          durationSeconds: 120, // 2:00
        },
      ],
    },
    {
      id: 'step-cooldown-1',
      kind: 'step',
      type: 'cooldown',
      label: 'Pendinginan Jalan',
      durationSeconds: 300, // 5:00
    },
  ],
  updatedAt: new Date().toISOString(),
};

export const SAMPLE_PRESETS: Workout[] = [
  DEFAULT_PRESET,
  {
    id: 'preset-5k-speed',
    schemaVersion: 1,
    name: '5K Speed Intervals',
    blocks: [
      {
        id: 's-5k-wm',
        kind: 'step',
        type: 'warmup',
        label: 'Pemanasan',
        durationSeconds: 300,
      },
      {
        id: 'g-5k-int',
        kind: 'repeat',
        count: 5,
        steps: [
          {
            id: 's-5k-run',
            kind: 'step',
            type: 'run',
            label: 'Lari Cepat',
            durationSeconds: 180, // 3:00
          },
          {
            id: 's-5k-walk',
            kind: 'step',
            type: 'walk',
            label: 'Jalan Santai',
            durationSeconds: 90, // 1:30
          },
        ],
      },
      {
        id: 's-5k-cd',
        kind: 'step',
        type: 'cooldown',
        label: 'Pendinginan',
        durationSeconds: 300,
      },
    ],
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'preset-recovery-walk',
    schemaVersion: 1,
    name: 'Recovery Easy Walk',
    blocks: [
      {
        id: 's-rec-1',
        kind: 'step',
        type: 'walk',
        label: 'Jalan Santai',
        durationSeconds: 900, // 15:00
      },
      {
        id: 's-rec-2',
        kind: 'step',
        type: 'walk',
        label: 'Jalan Cepat',
        durationSeconds: 300, // 5:00
      },
      {
        id: 's-rec-3',
        kind: 'step',
        type: 'cooldown',
        label: 'Jalan Pemulihan',
        durationSeconds: 600, // 10:00
      },
    ],
    updatedAt: new Date().toISOString(),
  },
];

export const STEP_TYPE_CONFIG: Record<
  StepType,
  {
    label: string;
    badgeBg: string;
    badgeColor: string;
    strokeColor: string;
    accentColor: string;
    defaultDuration: number;
  }
> = {
  warmup: {
    label: 'Pemanasan',
    badgeBg: 'bg-[#FFB020]/15',
    badgeColor: 'text-[#FFB020]',
    strokeColor: 'border-[#FFB020]/40',
    accentColor: '#FFB020',
    defaultDuration: 300,
  },
  run: {
    label: 'Lari',
    badgeBg: 'bg-[#CFFF04]',
    badgeColor: 'text-[#111108]',
    strokeColor: 'border-[#CFFF04]',
    accentColor: '#CFFF04',
    defaultDuration: 60,
  },
  walk: {
    label: 'Jalan',
    badgeBg: 'bg-[#5B9CFF]/15',
    badgeColor: 'text-[#5B9CFF]',
    strokeColor: 'border-[#5B9CFF]/40',
    accentColor: '#5B9CFF',
    defaultDuration: 120,
  },
  cooldown: {
    label: 'Pendinginan',
    badgeBg: 'bg-[#37D6C4]/15',
    badgeColor: 'text-[#37D6C4]',
    strokeColor: 'border-[#37D6C4]/40',
    accentColor: '#37D6C4',
    defaultDuration: 300,
  },
  rest: {
    label: 'Istirahat',
    badgeBg: 'bg-[#8A8A92]/15',
    badgeColor: 'text-[#8A8A92]',
    strokeColor: 'border-[#8A8A92]/40',
    accentColor: '#8A8A92',
    defaultDuration: 60,
  },
  custom: {
    label: 'Kustom',
    badgeBg: 'bg-[#FF6AC2]/15',
    badgeColor: 'text-[#FF6AC2]',
    strokeColor: 'border-[#FF6AC2]/40',
    accentColor: '#FF6AC2',
    defaultDuration: 60,
  },
};

export function formatTimeMMSS(seconds: number): string {
  const safeSec = Math.max(0, Math.floor(seconds));
  const m = Math.floor(safeSec / 60);
  const s = safeSec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

export function formatDurationHuman(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (s === 0) return `${m} menit`;
  if (m === 0) return `${s} detik`;
  return `${m}m ${s}s`;
}
