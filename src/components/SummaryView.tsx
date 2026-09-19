'use client';

import React from 'react';
import { WorkoutSummary, Workout } from '@/types/workout';
import { formatTimeMMSS } from '@/lib/constants';
import { Check, Hourglass, Timer, CheckCircle2, RotateCcw, ArrowLeft } from 'lucide-react';

interface SummaryViewProps {
  summary: WorkoutSummary;
  workout: Workout;
  onRepeat: () => void;
  onHome: () => void;
}

export function SummaryView({ summary, workout, onRepeat, onHome }: SummaryViewProps) {
  const isFullyCompleted = summary.completedStages >= summary.totalStages;

  return (
    <div className="flex flex-col justify-between max-w-md mx-auto w-full min-h-[90vh] px-5 pt-6 pb-8">
      {/* 07 Selesai Content */}
      <div className="flex flex-col gap-8 my-auto">
        {/* Hero Section */}
        <section className="flex flex-col items-center text-center gap-3">
          <div className="w-20 h-20 rounded-full bg-[#D6FE3E] text-[#111108] flex items-center justify-center shadow-xl shadow-[#D6FE3E]/20">
            <Check className="w-10 h-10 stroke-[3]" />
          </div>

          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-black text-[#F5F5F7] tracking-tight">
              Latihan Selesai!
            </h1>
            <p className="text-xs text-[#9B9BA3] font-medium">
              {summary.workoutName} · Status: {isFullyCompleted ? 'Selesai' : 'Sebagian'}
            </p>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
              <Hourglass className="w-4 h-4 text-[#9B9BA3]" />
              <span className="text-2xl font-black text-[#F5F5F7] tabular-nums mt-0.5">
                {formatTimeMMSS(summary.plannedDurationSeconds)}
              </span>
              <span className="text-xs text-[#9B9BA3]">Waktu Terencana</span>
            </div>

            <div className="flex flex-col gap-1.5 p-4 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
              <Timer className="w-4 h-4 text-[#9B9BA3]" />
              <span className="text-2xl font-black text-[#F5F5F7] tabular-nums mt-0.5">
                {formatTimeMMSS(summary.activeDurationSeconds)}
              </span>
              <span className="text-xs text-[#9B9BA3]">Waktu Aktif</span>
            </div>
          </div>

          {/* Status Row */}
          <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-[#232327] border border-[#2B2B30]">
            <CheckCircle2 className="w-6 h-6 text-[#CFFF04] shrink-0" />
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#F5F5F7]">
                {summary.completedStages} dari {summary.totalStages} tahap tuntas
              </span>
              <span className="text-xs text-[#9B9BA3]">
                {isFullyCompleted
                  ? 'Semua cue terdengar tepat waktu'
                  : 'Sebagian latihan telah terselesaikan'}
              </span>
            </div>
          </div>
        </section>
      </div>

      {/* Bottom Actions */}
      <section className="flex flex-col gap-3 pt-4">
        <button
          type="button"
          onClick={onRepeat}
          className="w-full h-13 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer shadow-lg shadow-[#D6FE3E]/15"
        >
          <RotateCcw className="w-4 h-4 stroke-[2.5]" />
          <span>Ulangi Latihan</span>
        </button>

        <button
          type="button"
          onClick={onHome}
          className="w-full h-13 rounded-full bg-[#18181B] hover:bg-[#232327] border border-[#2B2B30] text-[#F5F5F7] font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar</span>
        </button>
      </section>
    </div>
  );
}
