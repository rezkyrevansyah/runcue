'use client';

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { Workout } from '@/types/workout';
import { calculateTotalDuration, expandWorkout } from '@/lib/timer-engine';
import { formatTimeMMSS } from '@/lib/constants';
import {
  Play,
  SlidersHorizontal,
  Plus,
  Plane,
  Bookmark,
  Zap,
  Footprints,
  Flame,
  Trash2,
  Copy,
  Download,
  X,
} from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { InstallGuideModal } from '@/components/InstallGuideModal';

interface HomeViewProps {
  workouts: Workout[];
  onSelectWorkout: (workout: Workout) => void;
  onEditWorkout: (workout: Workout) => void;
  onCreateNew: () => void;
  onDeleteWorkout: (id: string) => void;
  onDuplicateWorkout: (workout: Workout) => void;
}

export function HomeView({
  workouts,
  onSelectWorkout,
  onEditWorkout,
  onCreateNew,
  onDeleteWorkout,
  onDuplicateWorkout,
}: HomeViewProps) {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [bannerDismissed, setBannerDismissed] = useState(false);
  const [showInstallGuide, setShowInstallGuide] = useState(false);
  const [bookmarkedId, setBookmarkedId] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { isInstalled, hasNativePrompt, triggerInstall } = usePwaInstall();

  // Load bookmarked workout from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('runcue_bookmarked_workout_id');
      if (saved) {
        setBookmarkedId(saved);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const showToast = (msg: string) => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    setToastMessage(msg);
    toastTimerRef.current = setTimeout(() => {
      setToastMessage(null);
    }, 2400);
  };

  const handleToggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (bookmarkedId === id) {
      setBookmarkedId(null);
      try {
        localStorage.removeItem('runcue_bookmarked_workout_id');
      } catch {}
      showToast('Removed from Featured');
    } else {
      setBookmarkedId(id);
      try {
        localStorage.setItem('runcue_bookmarked_workout_id', id);
      } catch {}
      const target = workouts.find(w => w.id === id);
      showToast(target ? `"${target.name}" set as Featured` : 'Set as Featured Workout');
    }
  };

  const handleInstallClick = async () => {
    if (hasNativePrompt) {
      await triggerInstall();
    } else {
      setShowInstallGuide(true);
    }
  };

  const featuredWorkout = (bookmarkedId && workouts.find(w => w.id === bookmarkedId)) || workouts[0];
  const isFeaturedBookmarked = Boolean(featuredWorkout && bookmarkedId === featuredWorkout.id);
  const featuredTotalSec = featuredWorkout ? calculateTotalDuration(featuredWorkout) : 0;
  const featuredExpanded = featuredWorkout ? expandWorkout(featuredWorkout) : [];
  const featuredRounds = featuredWorkout
    ? featuredWorkout.blocks.reduce((acc, b) => (b.kind === 'repeat' ? acc + b.count : acc), 0) || 1
    : 0;

  const getFeaturedSummary = (w: Workout, expanded: ReturnType<typeof expandWorkout>) => {
    if (expanded.length === 0) return 'Custom interval sequence';
    const preview = expanded
      .slice(0, 3)
      .map(s => `${s.label} ${formatTimeMMSS(s.durationSeconds)}`)
      .join(' → ');
    return expanded.length > 3 ? `${preview} → ...` : preview;
  };

  // Determine an appropriate icon for each preset based on its name/steps
  const getPresetIcon = (name: string, index: number) => {
    const lower = name.toLowerCase();
    if (lower.includes('jalan') || lower.includes('walk')) {
      return { Icon: Footprints, color: 'text-[#5B9CFF]' };
    }
    if (lower.includes('kardio') || lower.includes('cepat') || lower.includes('warm')) {
      return { Icon: Flame, color: 'text-[#FFB020]' };
    }
    return { Icon: Zap, color: 'text-[#CFFF04]' };
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full px-5 pt-3 pb-28">
      {/* 03 Beranda Header */}
      <header className="flex items-center justify-between w-full">
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 relative shrink-0">
              <Image
                src="/logo/logo_runcue_transparant_onlylogonowording.svg"
                alt="RunCue"
                width={24}
                height={24}
                className="w-full h-full object-contain"
                priority
              />
            </div>
            <span className="text-xl font-black tracking-tight text-[#F5F5F7]">
              RunCue
            </span>
          </div>
          <span className="text-xs font-medium text-[#9B9BA3] mt-0.5">
            Hey, ready to run today?
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#9B9BA3] text-xs font-semibold shadow-2xs">
          <Plane className="w-3.5 h-3.5 text-[#9B9BA3]" />
          <span>Offline</span>
        </div>
      </header>

      {/* PWA Install Banner (When not in standalone mode) */}
      {!isInstalled && !bannerDismissed && (
        <div className="flex items-center justify-between p-3 sm:p-3.5 rounded-2xl bg-[#18181B] border border-[#D6FE3E]/30 shadow-lg animate-in fade-in-50">
          <div className="flex items-center gap-3 min-w-0 pr-2">
            <div className="w-9 h-9 rounded-xl bg-[#232327] border border-[#2B2B30] flex items-center justify-center p-1.5 shrink-0">
              <Image
                src="/logo/logo_runcue_transparant_onlylogonowording.svg"
                alt="RunCue Logo"
                width={24}
                height={24}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-xs text-[#F5F5F7]">
                Install to Home Screen
              </span>
              <span className="text-[11px] text-[#9B9BA3] truncate">
                Instant access without browser & 100% offline
              </span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="h-8 px-3 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] text-xs font-black active:scale-95 transition cursor-pointer"
            >
              Install
            </button>
            <button
              type="button"
              onClick={() => setBannerDismissed(true)}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] cursor-pointer"
              title="Dismiss banner"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Featured Card (FEATURED WORKOUT) */}
      {featuredWorkout && (
        <section className="flex flex-col gap-4 p-5 sm:p-6 rounded-3xl bg-[#232327] border border-[#2B2B30] shadow-xl">
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black tracking-wider uppercase">
              Featured Workout
            </div>
            <button
              type="button"
              onClick={e => handleToggleBookmark(featuredWorkout.id, e)}
              className={`p-2 rounded-xl transition cursor-pointer active:scale-90 ${
                isFeaturedBookmarked
                  ? 'text-[#D6FE3E] bg-[#D6FE3E]/15 border border-[#D6FE3E]/30'
                  : 'text-[#9B9BA3] hover:text-[#F5F5F7] hover:bg-[#18181B]'
              }`}
              title={isFeaturedBookmarked ? 'Unpin from Featured' : 'Pin as Featured'}
            >
              <Bookmark className={`w-4 h-4 ${isFeaturedBookmarked ? 'fill-current' : ''}`} />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black text-[#F5F5F7] tracking-tight">
              {featuredWorkout.name}
            </h2>
            <p className="text-xs text-[#9B9BA3] line-clamp-1 leading-relaxed">
              {getFeaturedSummary(featuredWorkout, featuredExpanded)}
            </p>
          </div>

          {/* 3-Column Stats */}
          <div className="grid grid-cols-3 gap-2 py-1 border-y border-[#2B2B30]/80">
            <div className="flex flex-col py-1.5">
              <span className="text-lg font-black text-[#F5F5F7] tabular-nums">
                {formatTimeMMSS(featuredTotalSec)}
              </span>
              <span className="text-[11px] font-medium text-[#9B9BA3]">Total</span>
            </div>
            <div className="flex flex-col py-1.5">
              <span className="text-lg font-black text-[#F5F5F7] tabular-nums">
                {featuredExpanded.length}
              </span>
              <span className="text-[11px] font-medium text-[#9B9BA3]">Stages</span>
            </div>
            <div className="flex flex-col py-1.5">
              <span className="text-lg font-black text-[#F5F5F7]">
                × {featuredRounds}
              </span>
              <span className="text-[11px] font-medium text-[#9B9BA3]">Rounds</span>
            </div>
          </div>

          {/* PrimaryButton Start This Workout */}
          <button
            type="button"
            onClick={() => onSelectWorkout(featuredWorkout)}
            className="w-full h-13 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] active:scale-[0.98] text-[#111108] font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#D6FE3E]/15 transition cursor-pointer select-none"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Start This Workout</span>
          </button>
        </section>
      )}

      {/* Saved Presets Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-[#F5F5F7]">
            Saved Workouts
          </h3>
          <button
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-1 text-xs font-bold text-[#D6FE3E] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>New Workout</span>
          </button>
        </div>

        {workouts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#18181B] border border-[#2B2B30] text-center text-xs text-[#9B9BA3]">
            No saved workouts. Create a new workout above.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {workouts.map((w, idx) => {
              const totalSec = calculateTotalDuration(w);
              const exp = expandWorkout(w);
              const { Icon, color } = getPresetIcon(w.name, idx);
              const isBookmarked = bookmarkedId === w.id;

              return (
                <div
                  key={w.id}
                  className="flex items-center justify-between p-3.5 sm:p-4 rounded-2xl bg-[#18181B] border border-[#2B2B30] hover:border-[#3E3E45] transition-all group"
                >
                  <div
                    onClick={() => onSelectWorkout(w)}
                    className="flex items-center gap-3.5 flex-1 min-w-0 cursor-pointer pr-2"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#232327] border border-[#2B2B30] flex items-center justify-center shrink-0">
                      <Icon className={`w-4 h-4 ${color}`} />
                    </div>
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-sm text-[#F5F5F7] group-hover:text-[#D6FE3E] transition truncate">
                        {w.name}
                      </span>
                      <div className="flex items-center gap-1.5 text-xs text-[#9B9BA3]">
                        <span className="tabular-nums font-medium">{formatTimeMMSS(totalSec)}</span>
                        <span>·</span>
                        <span>{exp.length} stages</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Play Button */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={e => handleToggleBookmark(w.id, e)}
                      className={`w-8 h-8 rounded-xl flex items-center justify-center transition cursor-pointer active:scale-90 ${
                        isBookmarked
                          ? 'text-[#D6FE3E] bg-[#D6FE3E]/15'
                          : 'text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327]'
                      }`}
                      title={isBookmarked ? 'Unpin from Featured' : 'Pin to Featured'}
                    >
                      <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? 'fill-current' : ''}`} />
                    </button>
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
                    <button
                      type="button"
                      onClick={() => onSelectWorkout(w)}
                      className="w-10 h-10 rounded-full bg-[#232327] hover:bg-[#D6FE3E] hover:text-[#111108] text-[#F5F5F7] flex items-center justify-center transition ml-1 cursor-pointer active:scale-95 shadow-xs"
                      title="Start Workout"
                    >
                      <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-22 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#18181B]/95 backdrop-blur-md border border-[#D6FE3E]/40 text-xs font-semibold text-[#F5F5F7] shadow-2xl flex items-center gap-2 animate-in fade-in-50 slide-in-from-bottom-2 duration-150 pointer-events-none">
          <Bookmark className="w-3.5 h-3.5 text-[#D6FE3E] fill-current shrink-0" />
          <span className="truncate max-w-xs">{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
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

      {/* PWA Install Guide Modal */}
      {showInstallGuide && (
        <InstallGuideModal onClose={() => setShowInstallGuide(false)} />
      )}
    </div>
  );
}
