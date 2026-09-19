'use client';

import React, { useState, useMemo } from 'react';
import { Workout } from '@/types/workout';
import { calculateTotalDuration, expandWorkout } from '@/lib/timer-engine';
import { formatTimeMMSS, STEP_TYPE_CONFIG } from '@/lib/constants';
import {
  Search,
  Plus,
  Play,
  SlidersHorizontal,
  Copy,
  Trash2,
  X,
  Zap,
  Footprints,
  Flame,
  Clock,
  Layers,
} from 'lucide-react';

interface WorkoutsViewProps {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
  onEditWorkout: (workout: Workout) => void;
  onCreateNew: () => void;
  onDeleteWorkout: (id: string) => void;
  onDuplicateWorkout: (workout: Workout) => void;
}

type FilterCategory = 'all' | 'interval' | 'run' | 'walk';

export function WorkoutsView({
  workouts,
  onSelectWorkout,
  onEditWorkout,
  onCreateNew,
  onDeleteWorkout,
  onDuplicateWorkout,
}: WorkoutsViewProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filterCategories: { id: FilterCategory; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'interval', label: 'Intervals' },
    { id: 'run', label: 'Run' },
    { id: 'walk', label: 'Walk' },
  ];

  const filteredWorkouts = useMemo(() => {
    return workouts.filter(w => {
      // 1. Search Query filter
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !query ||
        w.name.toLowerCase().includes(query) ||
        w.blocks.some(b => {
          if (b.kind === 'step') {
            return (
              b.label.toLowerCase().includes(query) ||
              STEP_TYPE_CONFIG[b.type].label.toLowerCase().includes(query)
            );
          }
          return b.steps.some(
            s =>
              s.label.toLowerCase().includes(query) ||
              STEP_TYPE_CONFIG[s.type].label.toLowerCase().includes(query)
          );
        });

      // 2. Category filter
      let matchesCategory = true;
      if (activeCategory === 'interval') {
        matchesCategory = w.blocks.some(b => b.kind === 'repeat');
      } else if (activeCategory === 'run') {
        matchesCategory = w.blocks.some(b =>
          b.kind === 'step'
            ? b.type === 'run'
            : b.steps.some(s => s.type === 'run')
        );
      } else if (activeCategory === 'walk') {
        matchesCategory = w.blocks.some(b =>
          b.kind === 'step'
            ? b.type === 'walk'
            : b.steps.some(s => s.type === 'walk')
        );
      }

      return matchesSearch && matchesCategory;
    });
  }, [workouts, searchQuery, activeCategory]);

  const getPresetIcon = (workout: Workout) => {
    const hasInterval = workout.blocks.some(b => b.kind === 'repeat');
    if (hasInterval) return { Icon: Zap, color: 'text-[#CFFF04]' };
    const hasRun = workout.blocks.some(b => (b.kind === 'step' ? b.type === 'run' : false));
    if (hasRun) return { Icon: Flame, color: 'text-[#FFB020]' };
    return { Icon: Footprints, color: 'text-[#5B9CFF]' };
  };

  return (
    <div className="flex flex-col gap-5 max-w-md mx-auto w-full px-5 pt-3 pb-28">
      {/* Header */}
      <header className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-[#F5F5F7]">
            Workouts
          </h1>
          <p className="text-xs text-[#9B9BA3] mt-0.5 font-medium">
            {workouts.length} saved workouts
          </p>
        </div>

        <button
          type="button"
          onClick={onCreateNew}
          className="flex items-center gap-1.5 h-10 px-4 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] text-xs font-black active:scale-95 transition cursor-pointer shadow-md shadow-[#D6FE3E]/15"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>New Workout</span>
        </button>
      </header>

      {/* Search Bar */}
      <div className="relative flex items-center w-full">
        <Search className="w-4 h-4 text-[#67676F] absolute left-3.5 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          placeholder="Search workout name or stage..."
          className="w-full h-11 pl-10 pr-9 rounded-2xl bg-[#18181B] border border-[#2B2B30] text-xs text-[#F5F5F7] placeholder-[#67676F] focus:outline-none focus:border-[#D6FE3E] transition"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="absolute right-3 text-[#67676F] hover:text-[#F5F5F7] cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Category Chips */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        {filterCategories.map(cat => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                isActive
                  ? 'bg-[#D6FE3E] text-[#111108] shadow-xs'
                  : 'bg-[#18181B] border border-[#2B2B30] text-[#9B9BA3] hover:text-[#F5F5F7]'
              }`}
            >
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* Workouts List */}
      {filteredWorkouts.length === 0 ? (
        <div className="flex flex-col items-center justify-center p-8 rounded-3xl bg-[#18181B] border border-[#2B2B30] text-center gap-3 my-4">
          <Layers className="w-8 h-8 text-[#67676F]" />
          <div className="flex flex-col gap-1">
            <span className="text-sm font-bold text-[#F5F5F7]">No workouts found</span>
            <span className="text-xs text-[#9B9BA3]">
              {searchQuery
                ? `No workouts match "${searchQuery}".`
                : 'No workouts in this category yet.'}
            </span>
          </div>
          {searchQuery ? (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="text-xs font-bold text-[#D6FE3E] underline cursor-pointer mt-1"
            >
              Clear search
            </button>
          ) : (
            <button
              type="button"
              onClick={onCreateNew}
              className="h-10 px-4 rounded-full bg-[#232327] hover:bg-[#2B2B30] text-xs font-bold text-[#F5F5F7] cursor-pointer mt-1"
            >
              Create Workout Now
            </button>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filteredWorkouts.map(w => {
            const totalSec = calculateTotalDuration(w);
            const expanded = expandWorkout(w);
            const { Icon, color } = getPresetIcon(w);

            return (
              <div
                key={w.id}
                className="flex flex-col gap-3 p-4 rounded-3xl bg-[#18181B] border border-[#2B2B30] hover:border-[#3E3E45] transition-all"
              >
                {/* Top Row: Icon, Title & Actions */}
                <div className="flex items-center justify-between">
                  <div
                    onClick={() => onSelectWorkout(w)}
                    className="flex items-center gap-3 min-w-0 cursor-pointer flex-1 mr-2"
                  >
                    <div className="w-10 h-10 rounded-2xl bg-[#232327] border border-[#2B2B30] flex items-center justify-center shrink-0">
                      <Icon className={`w-5 h-5 ${color}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <h3 className="font-bold text-sm text-[#F5F5F7] truncate hover:text-[#D6FE3E] transition">
                        {w.name}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-[#9B9BA3] mt-0.5">
                        <span className="flex items-center gap-1 font-semibold text-[#F5F5F7] tabular-nums">
                          <Clock className="w-3 h-3 text-[#67676F]" />
                          {formatTimeMMSS(totalSec)}
                        </span>
                        <span>·</span>
                        <span>{expanded.length} stages</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions Icons */}
                  <div className="flex items-center gap-0.5 shrink-0">
                    <button
                      type="button"
                      onClick={() => onDuplicateWorkout(w)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] transition cursor-pointer"
                      title="Duplicate"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditWorkout(w)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] transition cursor-pointer"
                      title="Edit Workout"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {workouts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(w.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#67676F] hover:text-[#FF5A52] hover:bg-[#232327] transition cursor-pointer"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Step Sequence Chips Preview */}
                <div className="flex items-center gap-1.5 overflow-x-auto py-1 no-scrollbar">
                  {w.blocks.map(b => {
                    if (b.kind === 'step') {
                      const cfg = STEP_TYPE_CONFIG[b.type] || STEP_TYPE_CONFIG.run;
                      return (
                        <div
                          key={b.id}
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#232327] border border-[#2B2B30] text-[11px] font-semibold text-[#9B9BA3] shrink-0"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: cfg.accentColor }}
                          />
                          <span>{b.label}</span>
                          <span className="font-mono text-[10px] text-[#67676F]">
                            {formatTimeMMSS(b.durationSeconds)}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={b.id}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-[#232327] border border-[#D6FE3E]/30 text-[11px] font-semibold text-[#D6FE3E] shrink-0"
                      >
                        <span className="font-black">×{b.count}</span>
                        <span>Interval</span>
                        <span className="font-mono text-[10px] text-[#9B9BA3]">
                          ({b.steps.map(s => s.label).join('/')})
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Direct Play Button */}
                <button
                  type="button"
                  onClick={() => onSelectWorkout(w)}
                  className="w-full h-11 rounded-2xl bg-[#232327] hover:bg-[#D6FE3E] text-[#F5F5F7] hover:text-[#111108] font-bold text-xs flex items-center justify-center gap-2 active:scale-[0.98] transition cursor-pointer mt-0.5"
                >
                  <Play className="w-3.5 h-3.5 fill-current ml-0.5" />
                  <span>Select & Start Session</span>
                </button>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-[#F5F5F7]">Delete Workout?</h3>
            <p className="text-xs text-[#9B9BA3] leading-relaxed">
              This workout will be permanently removed from your device.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="h-11 rounded-full bg-[#232327] hover:bg-[#2B2B30] text-[#F5F5F7] font-semibold text-sm active:scale-95 transition cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteWorkout(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="h-11 rounded-full bg-[#FF5A52] hover:bg-[#f0453d] text-white font-semibold text-sm active:scale-95 transition cursor-pointer shadow-sm shadow-red-500/20"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
