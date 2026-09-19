export type StepType = 'warmup' | 'run' | 'walk' | 'cooldown' | 'rest' | 'custom';

export interface Step {
  id: string;
  kind: 'step';
  type: StepType;
  label: string;
  durationSeconds: number;
}

export interface RepeatGroup {
  id: string;
  kind: 'repeat';
  count: number;
  steps: Step[];
}

export type WorkoutBlock = Step | RepeatGroup;

export interface Workout {
  id: string;
  schemaVersion: 1;
  name: string;
  blocks: WorkoutBlock[];
  updatedAt: string;
}

export interface AudioSettings {
  voiceEnabled: boolean;
  beepEnabled: boolean;
  countdownEnabled: boolean;
  wakeLockEnabled: boolean;
  speechRate?: 'normal' | 'fast';
  language: 'en-US' | 'id-ID';
}

export interface ExpandedStep {
  id: string;
  sourceId: string;
  type: StepType;
  label: string;
  durationSeconds: number;
  repeatIndex?: number; // 1-based (e.g. 1 of 8)
  repeatCount?: number; // total repeats (e.g. 8)
  sequenceIndex: number; // 0-based index in flat array
}

export type PlayerStatus = 'ready' | 'running' | 'paused' | 'completed' | 'ended';

export interface WorkoutSummary {
  workoutName: string;
  plannedDurationSeconds: number;
  activeDurationSeconds: number;
  pauseDurationSeconds: number;
  completedStages: number;
  totalStages: number;
  breakdown: {
    type: StepType;
    label: string;
    totalSeconds: number;
  }[];
}
