'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Workout, AudioSettings, ExpandedStep, PlayerStatus, WorkoutSummary } from '@/types/workout';
import {
  expandWorkout,
  calculateTotalDuration,
  getPositionFromElapsed,
  getStageCumulativeStartTime,
} from '@/lib/timer-engine';
import { formatTimeMMSS, STEP_TYPE_CONFIG } from '@/lib/constants';
import { playBeep, playCountdownBeep, speakText, cancelSpeech, generateCueInstruction, unlockAudio } from '@/lib/audio';
import { useWakeLock } from '@/hooks/useWakeLock';
import {
  X,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  ChevronRight,
  Zap,
  Footprints,
  Flame,
  Wind,
  Coffee,
  Sliders,
  AlertTriangle,
} from 'lucide-react';

interface PlayerViewProps {
  workout: Workout;
  audioSettings: AudioSettings;
  onFinish: (summary: WorkoutSummary) => void;
  onExit: () => void;
}

const STEP_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  warmup: Flame,
  run: Zap,
  walk: Footprints,
  cooldown: Wind,
  rest: Coffee,
  custom: Sliders,
};

export function PlayerView({
  workout,
  audioSettings,
  onFinish,
  onExit,
}: PlayerViewProps) {
  const expandedSteps = useRef<ExpandedStep[]>(expandWorkout(workout)).current;
  const totalPlannedSeconds = useRef<number>(calculateTotalDuration(workout)).current;

  // Status & Timing Refs
  const [status, setStatus] = useState<PlayerStatus>('running');
  const [elapsedActive, setElapsedActive] = useState<number>(0);
  const [pauseTotalSeconds, setPauseTotalSeconds] = useState<number>(0);
  const [showExitConfirm, setShowExitConfirm] = useState<boolean>(false);
  const [backgroundNotice, setBackgroundNotice] = useState<boolean>(false);

  // Time anchors for drift-free precision
  const startTimestampRef = useRef<number>(Date.now());
  const activeElapsedBeforePauseRef = useRef<number>(0);
  const pauseStartTimestampRef = useRef<number | null>(null);

  // Audio Cue trackers to avoid double speech/beeps
  const lastSpokenStageIndexRef = useRef<number>(-1);
  const lastBeepedSecondRef = useRef<number>(-1);

  // Screen Wake Lock
  const { isLocked } = useWakeLock(audioSettings.wakeLockEnabled && status === 'running');

  // Resolved Current Position
  const position = getPositionFromElapsed(expandedSteps, elapsedActive);
  const currentStep = expandedSteps[position.stageIndex] || expandedSteps[0];
  const nextStep = expandedSteps[position.stageIndex + 1] || null;
  const currentConfig = STEP_TYPE_CONFIG[currentStep.type] || STEP_TYPE_CONFIG.run;
  const NextIcon = nextStep ? STEP_ICONS[nextStep.type] || Zap : null;
  const nextConfig = nextStep ? STEP_TYPE_CONFIG[nextStep.type] : null;

  // Ensure audio is unlocked on player mount
  useEffect(() => {
    unlockAudio();
  }, []);

  // Play audio cue for a stage
  const triggerStageCue = useCallback(
    async (step: ExpandedStep) => {
      cancelSpeech();
      if (audioSettings.beepEnabled) {
        playBeep(880, 0.25);
      }
      if (audioSettings.voiceEnabled) {
        const text = generateCueInstruction(step);
        await speakText(text, audioSettings.speechRate || 'normal');
      }
    },
    [audioSettings]
  );

  // Finish workout handler
  const handleWorkoutComplete = useCallback(() => {
    setStatus('completed');
    cancelSpeech();
    if (audioSettings.beepEnabled) {
      playBeep(1046.5, 0.5);
    }
    if (audioSettings.voiceEnabled) {
      speakText('Workout complete! Great job.');
    }

    const breakdownMap: Record<string, { type: typeof currentStep.type; label: string; totalSeconds: number }> = {};
    for (const s of expandedSteps) {
      if (!breakdownMap[s.type]) {
        breakdownMap[s.type] = {
          type: s.type,
          label: STEP_TYPE_CONFIG[s.type].label,
          totalSeconds: 0,
        };
      }
      breakdownMap[s.type].totalSeconds += s.durationSeconds;
    }

    onFinish({
      workoutName: workout.name,
      plannedDurationSeconds: totalPlannedSeconds,
      activeDurationSeconds: Math.round(elapsedActive),
      pauseDurationSeconds: Math.round(pauseTotalSeconds),
      completedStages: expandedSteps.length,
      totalStages: expandedSteps.length,
      breakdown: Object.values(breakdownMap),
    });
  }, [audioSettings, currentStep.type, elapsedActive, expandedSteps, onFinish, pauseTotalSeconds, totalPlannedSeconds, workout.name]);

  // Main timer loop based on real timestamp delta
  useEffect(() => {
    if (status !== 'running') return;

    if (lastSpokenStageIndexRef.current === -1) {
      lastSpokenStageIndexRef.current = 0;
      triggerStageCue(expandedSteps[0]);
    }

    const interval = setInterval(() => {
      const now = Date.now();
      const currentElapsed =
        activeElapsedBeforePauseRef.current + (now - startTimestampRef.current) / 1000;

      const pos = getPositionFromElapsed(expandedSteps, currentElapsed);

      if (pos.isFinished || currentElapsed >= totalPlannedSeconds) {
        setElapsedActive(totalPlannedSeconds);
        clearInterval(interval);
        handleWorkoutComplete();
        return;
      }

      setElapsedActive(currentElapsed);

      if (pos.stageIndex !== lastSpokenStageIndexRef.current) {
        lastSpokenStageIndexRef.current = pos.stageIndex;
        lastBeepedSecondRef.current = -1;
        triggerStageCue(expandedSteps[pos.stageIndex]);
      }

      if (audioSettings.countdownEnabled && pos.stageRemaining <= 3 && pos.stageRemaining > 0) {
        const remainingInt = Math.ceil(pos.stageRemaining);
        if (remainingInt !== lastBeepedSecondRef.current) {
          lastBeepedSecondRef.current = remainingInt;
          playCountdownBeep(remainingInt === 1);
        }
      }
    }, 150);

    return () => clearInterval(interval);
  }, [audioSettings, expandedSteps, handleWorkoutComplete, status, totalPlannedSeconds, triggerStageCue]);

  const handlePause = () => {
    setStatus('paused');
    cancelSpeech();
    pauseStartTimestampRef.current = Date.now();
    activeElapsedBeforePauseRef.current = elapsedActive;
  };

  const handleResume = () => {
    unlockAudio();
    if (pauseStartTimestampRef.current) {
      const pausedDuration = (Date.now() - pauseStartTimestampRef.current) / 1000;
      setPauseTotalSeconds(prev => prev + pausedDuration);
    }
    startTimestampRef.current = Date.now();
    pauseStartTimestampRef.current = null;
    setStatus('running');
  };

  const handleSkipNext = () => {
    lastBeepedSecondRef.current = -1;
    if (position.stageIndex < expandedSteps.length - 1) {
      const nextStart = getStageCumulativeStartTime(expandedSteps, position.stageIndex + 1);
      activeElapsedBeforePauseRef.current = nextStart;
      startTimestampRef.current = Date.now();
      setElapsedActive(nextStart);
      lastSpokenStageIndexRef.current = position.stageIndex + 1;
      triggerStageCue(expandedSteps[position.stageIndex + 1]);
    } else {
      handleWorkoutComplete();
    }
  };

  const handleSkipPrev = () => {
    lastBeepedSecondRef.current = -1;
    if (position.stageElapsed > 3 || position.stageIndex === 0) {
      const currentStart = getStageCumulativeStartTime(expandedSteps, position.stageIndex);
      activeElapsedBeforePauseRef.current = currentStart;
      startTimestampRef.current = Date.now();
      setElapsedActive(currentStart);
      lastSpokenStageIndexRef.current = position.stageIndex;
      triggerStageCue(expandedSteps[position.stageIndex]);
    } else {
      const prevStart = getStageCumulativeStartTime(expandedSteps, position.stageIndex - 1);
      activeElapsedBeforePauseRef.current = prevStart;
      startTimestampRef.current = Date.now();
      setElapsedActive(prevStart);
      lastSpokenStageIndexRef.current = position.stageIndex - 1;
      triggerStageCue(expandedSteps[position.stageIndex - 1]);
    }
  };

  const handleConfirmExit = () => {
    setShowExitConfirm(false);
    cancelSpeech();
    const breakdownMap: Record<string, { type: typeof currentStep.type; label: string; totalSeconds: number }> = {};
    for (let i = 0; i <= position.stageIndex && i < expandedSteps.length; i++) {
      const s = expandedSteps[i];
      if (!breakdownMap[s.type]) {
        breakdownMap[s.type] = {
          type: s.type,
          label: STEP_TYPE_CONFIG[s.type].label,
          totalSeconds: 0,
        };
      }
      const spent = i === position.stageIndex ? position.stageElapsed : s.durationSeconds;
      breakdownMap[s.type].totalSeconds += spent;
    }

    onFinish({
      workoutName: workout.name,
      plannedDurationSeconds: totalPlannedSeconds,
      activeDurationSeconds: Math.round(elapsedActive),
      pauseDurationSeconds: Math.round(pauseTotalSeconds),
      completedStages: position.stageIndex,
      totalStages: expandedSteps.length,
      breakdown: Object.values(breakdownMap),
    });
  };

  // Circular progress calculations
  const radius = 100;
  const circumference = 2 * Math.PI * radius; // ~628.32
  const stepDuration = currentStep.durationSeconds;
  const progressRatio = stepDuration > 0
    ? Math.max(0, Math.min(1, position.stageRemaining / stepDuration))
    : 0;
  const strokeDashoffset = circumference * (1 - progressRatio);

  return (
    <div className="flex flex-col justify-between max-w-md mx-auto w-full min-h-[92vh] px-5 pt-3 pb-8">
      {/* 06 Player Header */}
      <header className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold tracking-wider uppercase text-[#67676F]">
            Active Workout
          </span>
          <h1 className="text-base font-bold text-[#F5F5F7] tracking-tight line-clamp-1">
            {workout.name}
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          className="w-10 h-10 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#F5F5F7] flex items-center justify-center active:scale-95 transition cursor-pointer"
          title="End Session"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Background drift notice */}
      {backgroundNotice && (
        <div className="flex items-center justify-between p-3 rounded-2xl bg-[#FFB020]/15 border border-[#FFB020]/30 text-xs text-[#FFB020] animate-in fade-in-50">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Time automatically resynced.</span>
          </div>
          <button type="button" onClick={() => setBackgroundNotice(false)}>
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Hero Circular Progress Ring (Frame 06) */}
      <section className="flex flex-col items-center justify-center py-4 my-auto">
        <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 240 240">
            {/* Background Track Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              className="stroke-[#232327]"
              strokeWidth="12"
              fill="transparent"
            />
            {/* Active Progress Circle */}
            <circle
              cx="120"
              cy="120"
              r={radius}
              stroke={currentConfig.accentColor || '#CFFF04'}
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-200 ease-linear"
            />
          </svg>

          {/* Centered Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 text-center select-none">
            {/* Stage Tag Capsule */}
            <div
              className="px-4 py-1 rounded-full text-xs font-black tracking-wider uppercase shadow-xs mb-1"
              style={{
                backgroundColor: currentConfig.accentColor || '#CFFF04',
                color: '#111108',
              }}
            >
              {currentStep.label}
            </div>

            {/* Giant Countdown Timer */}
            <span className="text-6xl sm:text-7xl font-black text-[#F5F5F7] tracking-tighter tabular-nums leading-none drop-shadow-md">
              {formatTimeMMSS(position.stageRemaining)}
            </span>

            {/* Rounds or Progress info */}
            <span className="text-xs font-medium text-[#9B9BA3] mt-1">
              {currentStep.repeatIndex
                ? `Round ${currentStep.repeatIndex} of ${currentStep.repeatCount}`
                : `Stage ${position.stageIndex + 1} of ${expandedSteps.length}`}
            </span>

            {status === 'paused' && (
              <span className="text-[10px] font-bold text-[#FFB020] uppercase tracking-widest animate-pulse mt-0.5">
                SESSION PAUSED
              </span>
            )}
          </div>
        </div>
      </section>

      {/* Next Stage Card */}
      <section className="flex flex-col gap-5">
        <div className="flex items-center justify-between p-4 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#232327] flex items-center justify-center shrink-0">
              {NextIcon ? (
                <NextIcon className="w-5 h-5" style={{ color: nextConfig?.accentColor }} />
              ) : (
                <Zap className="w-5 h-5 text-[#67676F]" />
              )}
            </div>
            <div className="flex flex-col">
              <span className="text-[11px] font-medium text-[#67676F] uppercase tracking-wider">
                Next
              </span>
              <span className="text-sm font-bold text-[#F5F5F7]">
                {nextStep ? `${nextStep.label} · ${formatTimeMMSS(nextStep.durationSeconds)}` : 'Workout Complete'}
              </span>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#67676F]" />
        </div>

        {/* Player Controls (Prev, Big Volt Play/Pause, Next) */}
        <div className="flex items-center justify-center gap-6 pt-1">
          {/* Prev Button */}
          <button
            type="button"
            onClick={handleSkipPrev}
            disabled={position.stageIndex === 0 && position.stageElapsed < 3}
            className="w-14 h-14 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#F5F5F7] hover:bg-[#232327] flex items-center justify-center active:scale-95 transition cursor-pointer disabled:opacity-30"
            title="Previous Stage"
          >
            <SkipBack className="w-6 h-6" />
          </button>

          {/* Giant Volt Play/Pause Button */}
          {status === 'running' ? (
            <button
              type="button"
              onClick={handlePause}
              className="w-20 h-20 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] flex items-center justify-center shadow-lg shadow-[#D6FE3E]/20 active:scale-95 transition cursor-pointer select-none"
              title="Pause"
            >
              <Pause className="w-8 h-8 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleResume}
              className="w-20 h-20 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] flex items-center justify-center shadow-lg shadow-[#D6FE3E]/20 active:scale-95 transition cursor-pointer select-none"
              title="Resume"
            >
              <Play className="w-8 h-8 fill-current ml-1" />
            </button>
          )}

          {/* Next Button */}
          <button
            type="button"
            onClick={handleSkipNext}
            className="w-14 h-14 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#F5F5F7] hover:bg-[#232327] flex items-center justify-center active:scale-95 transition cursor-pointer"
            title="Next Stage"
          >
            <SkipForward className="w-6 h-6" />
          </button>
        </div>

        {/* End Session Text Action */}
        <div className="flex justify-center pt-1">
          <button
            type="button"
            onClick={() => setShowExitConfirm(true)}
            className="text-sm font-bold text-[#FF5A52] hover:underline cursor-pointer py-1"
          >
            End Session
          </button>
        </div>
      </section>

      {/* Confirm Exit Modal */}
      {showExitConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-[#F5F5F7]">End Workout?</h3>
            <p className="text-xs text-[#9B9BA3] leading-relaxed">
              Your workout will stop and your progress will be saved in the summary.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="h-11 rounded-full bg-[#232327] hover:bg-[#2B2B30] text-[#F5F5F7] font-semibold text-sm active:scale-95 transition cursor-pointer"
              >
                Resume
              </button>
              <button
                type="button"
                onClick={handleConfirmExit}
                className="h-11 rounded-full bg-[#FF5A52] hover:bg-[#f0453d] text-white font-semibold text-sm active:scale-95 transition cursor-pointer shadow-sm shadow-red-500/20"
              >
                End
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
