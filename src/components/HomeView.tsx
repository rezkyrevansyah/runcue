'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

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

  const defaultWorkout = workouts[0];
  const defaultTotalSec = defaultWorkout ? calculateTotalDuration(defaultWorkout) : 0;
  const defaultExpanded = defaultWorkout ? expandWorkout(defaultWorkout) : [];

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
                src="/logo/logo_runcue_transparant_onlylogonowording.png"
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
            Hai, Pagi ini lari?
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#9B9BA3] text-xs font-semibold shadow-2xs">
          <Plane className="w-3.5 h-3.5 text-[#9B9BA3]" />
          <span>Offline</span>
        </div>
      </header>

      {/* Featured Card (CONTOH LATIHAN) */}
      {defaultWorkout && (
        <section className="flex flex-col gap-4 p-5 sm:p-6 rounded-3xl bg-[#232327] border border-[#2B2B30] shadow-xl">
          <div className="flex items-center justify-between">
            <div className="px-3 py-1 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black tracking-wider uppercase">
              Contoh Latihan
            </div>
            <button
              type="button"
              className="text-[#9B9BA3] hover:text-[#F5F5F7] transition cursor-pointer"
              title="Bookmark"
            >
              <Bookmark className="w-4 h-4" />
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <h2 className="text-xl font-black text-[#F5F5F7] tracking-tight">
              {defaultWorkout.name}
            </h2>
            <p className="text-xs text-[#9B9BA3] line-clamp-1 leading-relaxed">
              Pemanasan 5:00 → Lari 1:00 / Jalan 2:00 × 8 → Pendinginan 5:00
            </p>
          </div>

          {/* 3-Column Stats */}
          <div className="grid grid-cols-3 gap-2 py-1 border-y border-[#2B2B30]/80">
            <div className="flex flex-col py-1.5">
              <span className="text-lg font-black text-[#F5F5F7] tabular-nums">
                {formatTimeMMSS(defaultTotalSec)}
              </span>
              <span className="text-[11px] font-medium text-[#9B9BA3]">Total</span>
            </div>
            <div className="flex flex-col py-1.5">
              <span className="text-lg font-black text-[#F5F5F7] tabular-nums">
                {defaultExpanded.length}
              </span>
              <span className="text-[11px] font-medium text-[#9B9BA3]">Tahap</span>
            </div>
            <div className="flex flex-col py-1.5">
              <span className="text-lg font-black text-[#F5F5F7]">
                × 8
              </span>
              <span className="text-[11px] font-medium text-[#9B9BA3]">Putaran</span>
            </div>
          </div>

          {/* PrimaryButton Mulai Latihan Ini */}
          <button
            type="button"
            onClick={() => onSelectWorkout(defaultWorkout)}
            className="w-full h-13 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] active:scale-[0.98] text-[#111108] font-black text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#D6FE3E]/15 transition cursor-pointer select-none"
          >
            <Play className="w-4 h-4 fill-current ml-0.5" />
            <span>Mulai Latihan Ini</span>
          </button>
        </section>
      )}

      {/* Preset Tersimpan Section */}
      <section className="flex flex-col gap-3">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-base font-bold text-[#F5F5F7]">
            Preset Tersimpan
          </h3>
          <button
            type="button"
            onClick={onCreateNew}
            className="flex items-center gap-1 text-xs font-bold text-[#D6FE3E] hover:underline cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Buat Latihan</span>
          </button>
        </div>

        {workouts.length === 0 ? (
          <div className="p-8 rounded-2xl bg-[#18181B] border border-[#2B2B30] text-center text-xs text-[#9B9BA3]">
            Belum ada latihan tersimpan. Buat latihan baru di atas.
          </div>
        ) : (
          <div className="flex flex-col gap-2.5">
            {workouts.map((w, idx) => {
              const totalSec = calculateTotalDuration(w);
              const exp = expandWorkout(w);
              const { Icon, color } = getPresetIcon(w.name, idx);

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
                        <span>{exp.length} tahap</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Play Button */}
                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={() => onDuplicateWorkout(w)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] transition cursor-pointer"
                      title="Duplikasi"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onEditWorkout(w)}
                      className="w-8 h-8 rounded-xl flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] transition cursor-pointer"
                      title="Ubah Latihan"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                    </button>
                    {workouts.length > 1 && (
                      <button
                        type="button"
                        onClick={() => setDeleteConfirmId(w.id)}
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-[#67676F] hover:text-[#FF5A52] hover:bg-[#232327] transition cursor-pointer"
                        title="Hapus"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => onSelectWorkout(w)}
                      className="w-10 h-10 rounded-full bg-[#232327] hover:bg-[#D6FE3E] hover:text-[#111108] text-[#F5F5F7] flex items-center justify-center transition ml-1 cursor-pointer active:scale-95 shadow-xs"
                      title="Mulai Latihan"
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <h3 className="text-base font-bold text-[#F5F5F7]">Hapus Latihan?</h3>
            <p className="text-xs text-[#9B9BA3] leading-relaxed">
              Latihan akan dihapus permanen dari perangkat Anda.
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="h-11 rounded-full bg-[#232327] hover:bg-[#2B2B30] text-[#F5F5F7] font-semibold text-sm active:scale-95 transition cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={() => {
                  onDeleteWorkout(deleteConfirmId);
                  setDeleteConfirmId(null);
                }}
                className="h-11 rounded-full bg-[#FF5A52] hover:bg-[#f0453d] text-white font-semibold text-sm active:scale-95 transition cursor-pointer shadow-sm shadow-red-500/20"
              >
                Hapus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
