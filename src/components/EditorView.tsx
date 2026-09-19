'use client';

import React, { useState } from 'react';
import { Workout, WorkoutBlock, Step, RepeatGroup, StepType } from '@/types/workout';
import { calculateTotalDuration, expandWorkout } from '@/lib/timer-engine';
import { formatTimeMMSS, STEP_TYPE_CONFIG } from '@/lib/constants';
import { StepTypePicker } from './StepTypePicker';
import {
  X,
  Plus,
  Repeat,
  Trash2,
  Copy,
  ArrowUp,
  ArrowDown,
  Play,
  ListOrdered,
  AlertCircle,
  Clock,
} from 'lucide-react';

interface EditorViewProps {
  workout: Workout;
  onSave: (workout: Workout) => void;
  onStart: (workout: Workout) => void;
  onBack: () => void;
}

export function EditorView({ workout, onSave, onStart, onBack }: EditorViewProps) {
  const [currentWorkout, setCurrentWorkout] = useState<Workout>(workout);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const totalSeconds = calculateTotalDuration(currentWorkout);
  const expandedSteps = expandWorkout(currentWorkout);

  const validateWorkout = (): boolean => {
    if (!currentWorkout.name.trim()) {
      setValidationError('Workout name cannot be empty.');
      return false;
    }
    if (currentWorkout.blocks.length === 0) {
      setValidationError('Add at least 1 workout stage.');
      return false;
    }
    const hasTooShortStep = currentWorkout.blocks.some(b =>
      b.kind === 'step'
        ? b.durationSeconds < 5
        : b.steps.some(s => s.durationSeconds < 5)
    );
    if (hasTooShortStep) {
      setValidationError('Each workout stage must be at least 5 seconds.');
      return false;
    }
    if (totalSeconds <= 0) {
      setValidationError('Workout duration must be greater than 0 seconds.');
      return false;
    }
    setValidationError(null);
    return true;
  };

  const handleUpdateName = (name: string) => {
    setCurrentWorkout(prev => ({
      ...prev,
      name: name.slice(0, 60),
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleUpdateStep = (blockId: string, updates: Partial<Step>, subStepId?: string) => {
    setCurrentWorkout(prev => {
      const newBlocks = prev.blocks.map(b => {
        if (b.kind === 'step' && b.id === blockId) {
          return { ...b, ...updates };
        }
        if (b.kind === 'repeat' && b.id === blockId && subStepId) {
          const newSteps = (b as RepeatGroup).steps.map(s =>
            s.id === subStepId ? { ...s, ...updates } : s
          );
          return { ...b, steps: newSteps };
        }
        return b;
      });
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleUpdateRepeatCount = (groupId: string, delta: number) => {
    setCurrentWorkout(prev => {
      const newBlocks = prev.blocks.map(b => {
        if (b.kind === 'repeat' && b.id === groupId) {
          const rg = b as RepeatGroup;
          const nextCount = Math.max(1, Math.min(99, rg.count + delta));
          return { ...rg, count: nextCount };
        }
        return b;
      });
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleMoveBlock = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= currentWorkout.blocks.length) return;

    setCurrentWorkout(prev => {
      const newBlocks = [...prev.blocks];
      const temp = newBlocks[index];
      newBlocks[index] = newBlocks[targetIndex];
      newBlocks[targetIndex] = temp;
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleMoveSubStep = (groupId: string, subStepIndex: number, direction: 'up' | 'down') => {
    setCurrentWorkout(prev => {
      const newBlocks = prev.blocks.map(b => {
        if (b.kind === 'repeat' && b.id === groupId) {
          const rg = b as RepeatGroup;
          const targetIndex = direction === 'up' ? subStepIndex - 1 : subStepIndex + 1;
          if (targetIndex < 0 || targetIndex >= rg.steps.length) return b;
          const newSteps = [...rg.steps];
          const temp = newSteps[subStepIndex];
          newSteps[subStepIndex] = newSteps[targetIndex];
          newSteps[targetIndex] = temp;
          return { ...rg, steps: newSteps };
        }
        return b;
      });
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleDuplicateBlock = (index: number) => {
    setCurrentWorkout(prev => {
      const blockToDup = prev.blocks[index];
      let newBlock: WorkoutBlock;

      if (blockToDup.kind === 'step') {
        newBlock = {
          ...blockToDup,
          id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        };
      } else {
        const rg = blockToDup as RepeatGroup;
        newBlock = {
          ...rg,
          id: `rg-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          steps: rg.steps.map(s => ({
            ...s,
            id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
          })),
        };
      }

      const newBlocks = [...prev.blocks];
      newBlocks.splice(index + 1, 0, newBlock);
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleDeleteBlock = (index: number) => {
    if (currentWorkout.blocks.length <= 1) {
      setValidationError('A workout must have at least 1 stage.');
      return;
    }
    setCurrentWorkout(prev => {
      const newBlocks = prev.blocks.filter((_, i) => i !== index);
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleAddStep = () => {
    const newStep: Step = {
      id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      kind: 'step',
      type: 'run',
      label: 'Run',
      durationSeconds: 60,
    };
    setCurrentWorkout(prev => ({
      ...prev,
      blocks: [...prev.blocks, newStep],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddRepeatGroup = () => {
    const newGroup: RepeatGroup = {
      id: `rg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      kind: 'repeat',
      count: 4,
      steps: [
        {
          id: `step-${Date.now()}-1-${Math.random().toString(36).slice(2, 5)}`,
          kind: 'step',
          type: 'run',
          label: 'Run',
          durationSeconds: 60,
        },
        {
          id: `step-${Date.now()}-2-${Math.random().toString(36).slice(2, 5)}`,
          kind: 'step',
          type: 'walk',
          label: 'Walk',
          durationSeconds: 120,
        },
      ],
    };
    setCurrentWorkout(prev => ({
      ...prev,
      blocks: [...prev.blocks, newGroup],
      updatedAt: new Date().toISOString(),
    }));
  };

  const handleAddStepToGroup = (groupId: string) => {
    setCurrentWorkout(prev => {
      const newBlocks = prev.blocks.map(b => {
        if (b.kind === 'repeat' && b.id === groupId) {
          const rg = b as RepeatGroup;
          const newStep: Step = {
            id: `step-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            kind: 'step',
            type: 'walk',
            label: 'Walk',
            durationSeconds: 90,
          };
          return { ...rg, steps: [...rg.steps, newStep] };
        }
        return b;
      });
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleDeleteSubStep = (groupId: string, subStepId: string) => {
    setCurrentWorkout(prev => {
      const newBlocks = prev.blocks.map(b => {
        if (b.kind === 'repeat' && b.id === groupId) {
          const rg = b as RepeatGroup;
          if (rg.steps.length <= 1) return b;
          return { ...rg, steps: rg.steps.filter(s => s.id !== subStepId) };
        }
        return b;
      });
      return { ...prev, blocks: newBlocks, updatedAt: new Date().toISOString() };
    });
  };

  const handleSaveAndNotify = () => {
    if (!validateWorkout()) return;
    onSave(currentWorkout);
  };

  const handleStartWorkout = () => {
    if (!validateWorkout()) return;
    onStart(currentWorkout);
  };

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto w-full px-5 pt-3 pb-32">
      {/* 04 Editor Header */}
      <header className="flex items-center justify-between w-full">
        <button
          type="button"
          onClick={onBack}
          className="w-10 h-10 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#F5F5F7] flex items-center justify-center active:scale-95 transition cursor-pointer"
          title="Close Editor"
        >
          <X className="w-5 h-5" />
        </button>

        <h1 className="text-base font-bold text-[#F5F5F7]">
          Workout Editor
        </h1>

        <button
          type="button"
          onClick={() => setShowPreviewModal(true)}
          className="w-10 h-10 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#F5F5F7] flex items-center justify-center active:scale-95 transition cursor-pointer"
          title="View Full Sequence"
        >
          <ListOrdered className="w-4 h-4" />
        </button>
      </header>

      {/* Workout Name Card */}
      <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
        <label className="text-[11px] font-bold text-[#67676F] uppercase tracking-wider">
          Workout Name
        </label>
        <input
          type="text"
          value={currentWorkout.name}
          maxLength={60}
          onChange={e => handleUpdateName(e.target.value)}
          placeholder="Workout name..."
          className="w-full bg-transparent border-none text-[#F5F5F7] font-bold text-base placeholder-[#67676F] focus:outline-none"
        />
      </div>

      {/* Summary Strip (Volt Green Banner) */}
      <div className="flex items-center justify-between px-4 py-3 rounded-2xl bg-[#D6FE3E] text-[#111108] shadow-md shadow-[#D6FE3E]/10">
        <div className="flex items-center gap-2 font-black text-xs">
          <Clock className="w-4 h-4 stroke-[2.5]" />
          <span>Total {formatTimeMMSS(totalSeconds)} · {expandedSteps.length} stages</span>
        </div>
        <span className="text-xs font-black">Ready ✓</span>
      </div>

      {/* Validation Alert */}
      {validationError && (
        <div className="flex items-center gap-2 p-3.5 rounded-2xl bg-[#FF5A52]/15 border border-[#FF5A52]/30 text-xs font-semibold text-[#FF5A52] animate-in fade-in-50">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* Steps List */}
      <div className="flex flex-col gap-3">
        {currentWorkout.blocks.map((block, index) => {
          if (block.kind === 'step') {
            const step = block as Step;
            const cfg = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.run;

            return (
              <div
                key={step.id}
                className="relative flex flex-col gap-2.5 p-3.5 sm:p-4 rounded-2xl bg-[#18181B] border border-[#2B2B30] pl-5 group shadow-xs transition-colors hover:border-[#3E3E45]"
              >
                {/* Accent Bar on Left */}
                <div
                  className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl"
                  style={{ backgroundColor: cfg.accentColor }}
                />

                {/* Top Row: Type Picker + Quick Adjust Duration */}
                <div className="flex items-center justify-between gap-2">
                  <StepTypePicker
                    value={step.type}
                    onChange={t =>
                      handleUpdateStep(step.id, {
                        type: t,
                        label: STEP_TYPE_CONFIG[t].label,
                      })
                    }
                    size="md"
                  />

                  {/* Duration Controller: [-] [input] sec [+] */}
                  <div className="flex items-center rounded-xl bg-[#232327] border border-[#2B2B30] p-0.5">
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStep(step.id, {
                          durationSeconds: Math.max(5, step.durationSeconds - 15),
                        })
                      }
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#2B2B30] text-sm font-bold transition active:scale-95 cursor-pointer"
                      title="Subtract 15 seconds"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min={5}
                      max={7200}
                      step={5}
                      value={step.durationSeconds}
                      onChange={e => {
                        const val = parseInt(e.target.value, 10);
                        handleUpdateStep(step.id, {
                          durationSeconds: isNaN(val) ? 0 : Math.max(0, Math.min(val, 7200)),
                        });
                      }}
                      className="w-12 bg-transparent text-center font-black text-sm text-[#F5F5F7] tabular-nums focus:outline-none"
                    />
                    <span className="text-[11px] text-[#9B9BA3] font-bold pr-1 select-none">sec</span>
                    <button
                      type="button"
                      onClick={() =>
                        handleUpdateStep(step.id, {
                          durationSeconds: Math.min(7200, step.durationSeconds + 15),
                        })
                      }
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#2B2B30] text-sm font-bold transition active:scale-95 cursor-pointer"
                      title="Add 15 seconds"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Bottom Row: Stage Info + Action Buttons */}
                <div className="flex items-center justify-between pt-1 border-t border-[#232327]">
                  <div className="flex items-center gap-1.5 text-xs text-[#9B9BA3]">
                    <span className="font-semibold text-[#F5F5F7]">Stage {index + 1}</span>
                    <span>·</span>
                    <span className="tabular-nums font-medium">{formatTimeMMSS(step.durationSeconds)}</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, 'up')}
                      disabled={index === 0}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] disabled:opacity-20 cursor-pointer transition"
                      title="Move Up"
                    >
                      <ArrowUp className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleMoveBlock(index, 'down')}
                      disabled={index === currentWorkout.blocks.length - 1}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] disabled:opacity-20 cursor-pointer transition"
                      title="Move Down"
                    >
                      <ArrowDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDuplicateBlock(index)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] cursor-pointer transition"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteBlock(index)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#FF5A52] hover:bg-[#232327] cursor-pointer transition"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          }

          if (block.kind === 'repeat') {
            const rg = block as RepeatGroup;

            return (
              <div
                key={rg.id}
                className="flex flex-col gap-3 p-4 rounded-2xl bg-[#232327] border border-[#2B2B30] shadow-xs"
              >
                {/* Repeat Group Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-[#D6FE3E]/10 border border-[#D6FE3E]/20 flex items-center justify-center text-[#D6FE3E]">
                      <Repeat className="w-3.5 h-3.5" />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#F5F5F7]">Repeat Group</div>
                      <div className="text-[11px] text-[#9B9BA3]">{rg.steps.length} intervals</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Count Badge Controls */}
                    <div className="flex items-center rounded-xl bg-[#18181B] border border-[#2B2B30] p-0.5">
                      <button
                        type="button"
                        onClick={() => handleUpdateRepeatCount(rg.id, -1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#232327] text-xs font-bold transition active:scale-95 cursor-pointer"
                        title="Decrease rounds"
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-black text-[#D6FE3E] tabular-nums select-none">
                        × {rg.count}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleUpdateRepeatCount(rg.id, 1)}
                        className="w-6 h-6 rounded-md flex items-center justify-center text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#232327] text-xs font-bold transition active:scale-95 cursor-pointer"
                        title="Increase rounds"
                      >
                        +
                      </button>
                    </div>

                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(index, 'up')}
                        disabled={index === 0}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#18181B] disabled:opacity-20 cursor-pointer transition"
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveBlock(index, 'down')}
                        disabled={index === currentWorkout.blocks.length - 1}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#18181B] disabled:opacity-20 cursor-pointer transition"
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDuplicateBlock(index)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#18181B] cursor-pointer transition"
                        title="Duplicate"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteBlock(index)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#FF5A52] hover:bg-[#18181B] cursor-pointer transition"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Nested Steps */}
                <div className="flex flex-col gap-2">
                  {rg.steps.map((subStep, subIdx) => {
                    const cfg = STEP_TYPE_CONFIG[subStep.type] || STEP_TYPE_CONFIG.run;

                    return (
                      <div
                        key={subStep.id}
                        className="relative flex flex-col gap-2 p-3 rounded-xl bg-[#18181B] border border-[#2B2B30] pl-4 group transition-colors hover:border-[#3E3E45]"
                      >
                        <div
                          className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-xl"
                          style={{ backgroundColor: cfg.accentColor }}
                        />

                        {/* Substep Top Row: Picker + Duration Controller */}
                        <div className="flex items-center justify-between gap-2">
                          <StepTypePicker
                            value={subStep.type}
                            onChange={t =>
                              handleUpdateStep(
                                rg.id,
                                { type: t, label: STEP_TYPE_CONFIG[t].label },
                                subStep.id
                              )
                            }
                            size="sm"
                          />

                          <div className="flex items-center rounded-lg bg-[#232327] border border-[#2B2B30] p-0.5">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStep(
                                  rg.id,
                                  {
                                    durationSeconds: Math.max(5, subStep.durationSeconds - 15),
                                  },
                                  subStep.id
                                )
                              }
                              className="w-6 h-6 rounded flex items-center justify-center text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#2B2B30] text-xs font-bold transition active:scale-95 cursor-pointer"
                              title="Subtract 15 seconds"
                            >
                              -
                            </button>
                            <input
                              type="number"
                              min={5}
                              max={7200}
                              step={5}
                              value={subStep.durationSeconds}
                              onChange={e => {
                                const val = parseInt(e.target.value, 10);
                                handleUpdateStep(
                                  rg.id,
                                  {
                                    durationSeconds: isNaN(val)
                                      ? 0
                                      : Math.max(0, Math.min(val, 7200)),
                                  },
                                  subStep.id
                                );
                              }}
                              className="w-10 bg-transparent text-center font-black text-xs text-[#F5F5F7] tabular-nums focus:outline-none"
                            />
                            <span className="text-[10px] text-[#9B9BA3] font-bold pr-1 select-none">sec</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateStep(
                                  rg.id,
                                  {
                                    durationSeconds: Math.min(7200, subStep.durationSeconds + 15),
                                  },
                                  subStep.id
                                )
                              }
                              className="w-6 h-6 rounded flex items-center justify-center text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#2B2B30] text-xs font-bold transition active:scale-95 cursor-pointer"
                              title="Add 15 seconds"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        {/* Substep Bottom Row: Interval index + actions */}
                        <div className="flex items-center justify-between pt-1 border-t border-[#232327]">
                          <div className="flex items-center gap-1.5 text-[11px] text-[#9B9BA3]">
                            <span className="font-semibold text-[#F5F5F7]">Step {subIdx + 1}</span>
                            <span>·</span>
                            <span className="tabular-nums font-medium">{formatTimeMMSS(subStep.durationSeconds)}</span>
                          </div>

                          {rg.steps.length > 1 && (
                            <div className="flex items-center gap-0.5">
                              <button
                                type="button"
                                onClick={() => handleMoveSubStep(rg.id, subIdx, 'up')}
                                disabled={subIdx === 0}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] disabled:opacity-20 cursor-pointer transition"
                                title="Move Up"
                              >
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleMoveSubStep(rg.id, subIdx, 'down')}
                                disabled={subIdx === rg.steps.length - 1}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] disabled:opacity-20 cursor-pointer transition"
                                title="Move Down"
                              >
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteSubStep(rg.id, subStep.id)}
                                className="w-6 h-6 rounded-md flex items-center justify-center text-[#67676F] hover:text-[#FF5A52] hover:bg-[#232327] cursor-pointer transition"
                                title="Delete"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => handleAddStepToGroup(rg.id)}
                  className="w-full py-2 rounded-xl border border-dashed border-[#2B2B30] hover:border-[#D6FE3E] text-xs font-bold text-[#9B9BA3] hover:text-[#D6FE3E] flex items-center justify-center gap-1.5 transition cursor-pointer active:scale-98"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Stage to Group</span>
                </button>
              </div>
            );
          }

          return null;
        })}
      </div>

      {/* Add Step & Add Group Action Buttons */}
      <div className="grid grid-cols-2 gap-3 pt-1">
        <button
          type="button"
          onClick={handleAddStep}
          className="flex items-center justify-center gap-2 h-12 rounded-full border border-dashed border-[#2B2B30] hover:border-[#D6FE3E] hover:bg-[#18181B] text-[#F5F5F7] font-semibold text-xs active:scale-[0.98] transition cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Add Stage</span>
        </button>
        <button
          type="button"
          onClick={handleAddRepeatGroup}
          className="flex items-center justify-center gap-2 h-12 rounded-full border border-dashed border-[#2B2B30] hover:border-[#D6FE3E] hover:bg-[#18181B] text-[#F5F5F7] font-semibold text-xs active:scale-[0.98] transition cursor-pointer"
        >
          <Repeat className="w-4 h-4 text-[#D6FE3E]" />
          <span>Add Group</span>
        </button>
      </div>

      {/* Sticky Bottom Bar (Save & Start) */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0A0A0B]/95 backdrop-blur-md border-t border-[#2B2B30] z-40">
        <div className="max-w-md mx-auto grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handleSaveAndNotify}
            className="w-full h-13 rounded-full bg-[#18181B] hover:bg-[#232327] border border-[#2B2B30] text-[#F5F5F7] font-bold text-sm flex items-center justify-center active:scale-95 transition cursor-pointer"
          >
            Save
          </button>
          <button
            type="button"
            onClick={handleStartWorkout}
            className="w-full h-13 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer shadow-lg shadow-[#D6FE3E]/15"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Start</span>
          </button>
        </div>
      </div>

      {/* Sequence Preview Modal */}
      {showPreviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md max-h-[80vh] bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-[#F5F5F7]">
                Full Sequence ({expandedSteps.length} Stages)
              </h3>
              <button
                type="button"
                onClick={() => setShowPreviewModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2 overflow-y-auto max-h-[55vh] pr-1 divide-y divide-[#2B2B30]">
              {expandedSteps.map((step, i) => {
                const cfg = STEP_TYPE_CONFIG[step.type] || STEP_TYPE_CONFIG.run;
                return (
                  <div key={i} className="flex items-center justify-between py-2.5">
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-mono text-[#67676F] w-6">#{i + 1}</span>
                      <span
                        className="w-2.5 h-2.5 rounded-full"
                        style={{ backgroundColor: cfg.accentColor }}
                      />
                      <div className="flex flex-col">
                        <span className="font-bold text-xs text-[#F5F5F7]">{step.label}</span>
                        {step.repeatIndex && (
                          <span className="text-[10px] text-[#67676F]">
                            Round {step.repeatIndex} of {step.repeatCount}
                          </span>
                        )}
                      </div>
                    </div>
                    <span className="font-black text-xs text-[#F5F5F7] tabular-nums">
                      {formatTimeMMSS(step.durationSeconds)}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setShowPreviewModal(false)}
              className="w-full h-11 rounded-full bg-[#232327] hover:bg-[#2B2B30] text-[#F5F5F7] font-semibold text-xs cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
