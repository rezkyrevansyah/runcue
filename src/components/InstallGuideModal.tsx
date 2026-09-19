'use client';

import React from 'react';
import Image from 'next/image';
import { X } from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';

interface InstallGuideModalProps {
  onClose: () => void;
}

export function InstallGuideModal({ onClose }: InstallGuideModalProps) {
  const { isIos } = usePwaInstall();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
      <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in zoom-in-95">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#232327] border border-[#2B2B30] flex items-center justify-center p-2 shrink-0 shadow-sm">
              <Image
                src="/logo/logo_runcue_transparant_onlylogonowording.svg"
                alt="RunCue App Icon"
                width={28}
                height={28}
                className="w-full h-full object-contain"
              />
            </div>
            <div className="flex flex-col">
              <h3 className="text-base font-black text-[#F5F5F7] leading-tight">Install to Home Screen</h3>
              <span className="text-[11px] text-[#9B9BA3] font-medium">Add RunCue to phone</span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327] cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-xs text-[#9B9BA3] leading-relaxed">
          Use RunCue like a native mobile app. Instant fullscreen launch without browser bars, and 100% offline.
        </p>

        {isIos ? (
          /* iPhone / iPad Safari Guide */
          <div className="flex flex-col gap-2.5 text-xs text-[#F5F5F7]">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
              <span className="w-5 h-5 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Tap the Share Button</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  Tap the square share icon with an upward arrow in the Safari bottom toolbar.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
              <span className="w-5 h-5 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Select &quot;Add to Home Screen&quot;</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  Scroll down the share sheet and tap &quot;Add to Home Screen&quot;.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
              <span className="w-5 h-5 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Tap &quot;Add&quot;</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  Tap &quot;Add&quot; in the top-right corner. The RunCue icon will appear on your Home Screen.
                </span>
              </div>
            </div>
          </div>
        ) : (
          /* Android Chrome / Browser Guide */
          <div className="flex flex-col gap-2.5 text-xs text-[#F5F5F7]">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
              <span className="w-5 h-5 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                1
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Tap More Options (⋮)</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  Tap the three dots menu button in the top-right corner of your browser.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
              <span className="w-5 h-5 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                2
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Select &quot;Install App&quot; or &quot;Add to Home Screen&quot;</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  Choose &quot;Install app&quot; or &quot;Add to Home screen&quot; from the menu.
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
              <span className="w-5 h-5 rounded-full bg-[#D6FE3E] text-[#111108] text-[11px] font-black flex items-center justify-center shrink-0 mt-0.5">
                3
              </span>
              <div className="flex flex-col gap-0.5">
                <span className="font-bold">Confirm Install</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  Tap &quot;Install&quot;. RunCue is ready to launch directly from your Home Screen.
                </span>
              </div>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-black text-xs cursor-pointer mt-1 active:scale-95 transition"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
