'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Info, X } from 'lucide-react';

export function Header() {
  const [showInfo, setShowInfo] = useState(false);

  return (
    <>
      <header className="flex items-center justify-between w-full pb-1 pt-1">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 shadow-2xs overflow-hidden shrink-0">
            <Image
              src="/logo/logo_runcue_transparant_onlylogonowording.png"
              alt="RunCue Logo"
              width={36}
              height={36}
              className="w-8 h-8 object-contain"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center leading-none">
              <span className="text-xl font-black tracking-tight text-slate-900">Run</span>
              <span className="text-xl font-black tracking-tight text-lime-600">Cue</span>
            </div>
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">Interval Guide</span>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setShowInfo(true)}
          className="flex items-center justify-center w-11 h-11 rounded-2xl bg-white border border-slate-200/80 text-slate-600 hover:text-slate-900 hover:bg-slate-50 active:scale-95 transition shadow-2xs cursor-pointer"
          aria-label="Tentang RunCue"
        >
          <Info className="w-5 h-5" />
        </button>
      </header>

      {/* Info Dialog */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden shrink-0">
                  <Image
                    src="/logo/logo_runcue_transparant_onlylogonowording.png"
                    alt="RunCue Logo"
                    width={28}
                    height={28}
                    className="w-6 h-6 object-contain"
                  />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 leading-tight">
                    Run<span className="text-lime-600">Cue</span>
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Interval Audio Coach</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowInfo(false)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Panduan interval lari & jalan dengan suara Bahasa Indonesia. Tanpa akun, 100% tersimpan di perangkat.
            </p>

            <button
              type="button"
              onClick={() => setShowInfo(false)}
              className="w-full h-12 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-800 font-semibold text-sm active:scale-[0.98] transition cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </>
  );
}
