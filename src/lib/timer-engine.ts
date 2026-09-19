import { Workout, ExpandedStep, Step, RepeatGroup } from '@/types/workout';

export function expandWorkout(workout: Workout): ExpandedStep[] {
  const result: ExpandedStep[] = [];
  let seq = 0;

  for (const block of workout.blocks) {
    if (block.kind === 'step') {
      const s = block as Step;
      result.push({
        id: `${s.id}-${seq}`,
        sourceId: s.id,
        type: s.type,
        label: s.label || s.type,
        durationSeconds: Math.max(1, s.durationSeconds),
        sequenceIndex: seq++,
      });
    } else if (block.kind === 'repeat') {
      const rg = block as RepeatGroup;
      const count = Math.min(99, Math.max(1, rg.count));
      for (let r = 1; r <= count; r++) {
        for (const s of rg.steps) {
          result.push({
            id: `${s.id}-r${r}-${seq}`,
            sourceId: s.id,
            type: s.type,
            label: s.label || s.type,
            durationSeconds: Math.max(1, s.durationSeconds),
            repeatIndex: r,
            repeatCount: count,
            sequenceIndex: seq++,
          });
        }
      }
    }
  }

  return result;
}

export function calculateTotalDuration(workout: Workout): number {
  let total = 0;
  for (const block of workout.blocks) {
    if (block.kind === 'step') {
      total += (block as Step).durationSeconds;
    } else if (block.kind === 'repeat') {
      const rg = block as RepeatGroup;
      const groupSubtotal = rg.steps.reduce((sum, s) => sum + s.durationSeconds, 0);
      total += groupSubtotal * rg.count;
    }
  }
  return total;
}

export interface StagePosition {
  stageIndex: number;
  stageElapsed: number;
  stageRemaining: number;
  totalElapsed: number;
  totalRemaining: number;
  isFinished: boolean;
}

export function getPositionFromElapsed(
  expandedSteps: ExpandedStep[],
  elapsedSeconds: number
): StagePosition {
  if (expandedSteps.length === 0) {
    return {
      stageIndex: 0,
      stageElapsed: 0,
      stageRemaining: 0,
      totalElapsed: 0,
      totalRemaining: 0,
      isFinished: true,
    };
  }

  const totalDuration = expandedSteps.reduce((acc, step) => acc + step.durationSeconds, 0);

  if (elapsedSeconds >= totalDuration) {
    const lastIndex = expandedSteps.length - 1;
    return {
      stageIndex: lastIndex,
      stageElapsed: expandedSteps[lastIndex].durationSeconds,
      stageRemaining: 0,
      totalElapsed: totalDuration,
      totalRemaining: 0,
      isFinished: true,
    };
  }

  let accumulated = 0;
  for (let i = 0; i < expandedSteps.length; i++) {
    const stepDuration = expandedSteps[i].durationSeconds;
    if (elapsedSeconds < accumulated + stepDuration) {
      const stageElapsed = elapsedSeconds - accumulated;
      const stageRemaining = Math.max(0, stepDuration - stageElapsed);
      return {
        stageIndex: i,
        stageElapsed,
        stageRemaining,
        totalElapsed: elapsedSeconds,
        totalRemaining: Math.max(0, totalDuration - elapsedSeconds),
        isFinished: false,
      };
    }
    accumulated += stepDuration;
  }

  return {
    stageIndex: expandedSteps.length - 1,
    stageElapsed: expandedSteps[expandedSteps.length - 1].durationSeconds,
    stageRemaining: 0,
    totalElapsed: totalDuration,
    totalRemaining: 0,
    isFinished: true,
  };
}

export function getStageCumulativeStartTime(
  expandedSteps: ExpandedStep[],
  targetIndex: number
): number {
  let acc = 0;
  for (let i = 0; i < targetIndex && i < expandedSteps.length; i++) {
    acc += expandedSteps[i].durationSeconds;
  }
  return acc;
}
