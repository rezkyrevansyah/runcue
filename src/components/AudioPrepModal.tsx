'use client';

import React, { useState } from 'react';
import { AudioSettings } from '@/types/workout';
import { speakText, playBeep, unlockAudio } from '@/lib/audio';
import {
  ChevronLeft,
  Mic,
  CheckCircle2,
  Volume2,
  BellRing,
  Headphones,
  Bell,
  Sun,
  Timer,
  ChevronDown,
} from 'lucide-react';

interface AudioPrepModalProps {
  settings: AudioSettings;
  onUpdateSettings: (settings: AudioSettings) => void;
  onConfirmStart: () => void;
  onCancel: () => void;
}

export function AudioPrepModal({
  settings,
  onUpdateSettings,
  onConfirmStart,
  onCancel,
}: AudioPrepModalProps) {
  const [isPlayingVoice, setIsPlayingVoice] = useState(false);
  const [isPlayingBeep, setIsPlayingBeep] = useState(false);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const handleTestVoice = async () => {
    if (isPlayingVoice) return;
    setIsPlayingVoice(true);
    unlockAudio();
    await speakText('Audio setup ready. Three, two, one, go!', settings.speechRate || 'normal');
    setIsPlayingVoice(false);
  };

  const handleTestBeep = () => {
    if (isPlayingBeep) return;
    setIsPlayingBeep(true);
    unlockAudio();
    playBeep(880, 0.25);
    setTimeout(() => setIsPlayingBeep(false), 300);
  };

  const handleStart = () => {
    unlockAudio();
    onConfirmStart();
  };

  const toggleSetting = (key: keyof AudioSettings) => {
    if (typeof settings[key] === 'boolean') {
      onUpdateSettings({
        ...settings,
        [key]: !settings[key],
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in-50">
      <div className="w-full max-w-sm max-h-[92vh] bg-[#0A0A0B] border border-[#2B2B30] rounded-3xl p-5 sm:p-6 flex flex-col gap-4 overflow-y-auto shadow-2xl animate-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="w-10 h-10 rounded-full bg-[#18181B] border border-[#2B2B30] text-[#F5F5F7] flex items-center justify-center active:scale-95 transition cursor-pointer"
            title="Back"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-lg font-bold text-[#F5F5F7]">
            Audio Setup
          </h2>
        </div>

        {/* Intro */}
        <p className="text-xs text-[#9B9BA3] leading-relaxed">
          Ensure audio is ready before starting. Workout cues and notifications will run in the background.
        </p>

        {/* VoiceStatusCard */}
        <div className="flex flex-col gap-3 p-4 rounded-2xl bg-[#232327] border border-[#2B2B30]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#D6FE3E] text-[#111108] flex items-center justify-center shrink-0">
                <Mic className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F5F5F7]">
                  English Voice Guidance
                </span>
                <span className="text-xs font-semibold text-[#CFFF04]">
                  Ready on this device
                </span>
              </div>
            </div>
            <CheckCircle2 className="w-5 h-5 text-[#CFFF04] shrink-0" />
          </div>

          {/* Test Buttons Row */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={handleTestVoice}
              disabled={isPlayingVoice}
              className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#18181B] hover:bg-[#202024] border border-[#2B2B30] text-xs font-semibold text-[#F5F5F7] transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <Volume2 className="w-3.5 h-3.5 text-[#F5F5F7]" />
              <span>{isPlayingVoice ? 'Playing...' : 'Test Voice'}</span>
            </button>

            <button
              type="button"
              onClick={handleTestBeep}
              disabled={isPlayingBeep}
              className="flex items-center justify-center gap-2 h-11 px-3 rounded-xl bg-[#18181B] hover:bg-[#202024] border border-[#2B2B30] text-xs font-semibold text-[#F5F5F7] transition active:scale-95 disabled:opacity-50 cursor-pointer"
            >
              <BellRing className="w-3.5 h-3.5 text-[#F5F5F7]" />
              <span>{isPlayingBeep ? 'Beeping...' : 'Test Beep'}</span>
            </button>
          </div>
        </div>

        {/* Tips List */}
        <div className="flex flex-col gap-2.5">
          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
            <div className="w-10 h-10 rounded-xl bg-[#232327] flex items-center justify-center shrink-0">
              <Headphones className="w-5 h-5 text-[#F5F5F7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#F5F5F7]">Use Headphones</span>
              <span className="text-xs text-[#9B9BA3] leading-tight">
                Cues stay audible while phone is in your pocket and screen is off.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
            <div className="w-10 h-10 rounded-xl bg-[#232327] flex items-center justify-center shrink-0">
              <Volume2 className="w-5 h-5 text-[#F5F5F7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#F5F5F7]">Turn Up Media Volume</span>
              <span className="text-xs text-[#9B9BA3] leading-tight">
                Ensure media volume is loud enough before beginning.
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3.5 p-3.5 rounded-2xl bg-[#18181B] border border-[#2B2B30]">
            <div className="w-10 h-10 rounded-xl bg-[#232327] flex items-center justify-center shrink-0">
              <Bell className="w-5 h-5 text-[#F5F5F7]" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-[#F5F5F7]">Keep Notifications On</span>
              <span className="text-xs text-[#9B9BA3] leading-tight">
                Shows active stages and timer controls during your run.
              </span>
            </div>
          </div>
        </div>

        {/* Advanced Audio Controls Accordion */}
        <div className="flex flex-col gap-2 pt-1">
          <button
            type="button"
            onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
            className="flex items-center justify-between py-1 text-xs font-semibold text-[#9B9BA3] hover:text-[#F5F5F7] cursor-pointer"
          >
            <span>Additional Audio Options</span>
            <ChevronDown className={`w-4 h-4 transition-transform ${showAdvancedSettings ? 'rotate-180' : ''}`} />
          </button>

          {showAdvancedSettings && (
            <div className="flex flex-col gap-2.5 p-3.5 rounded-2xl bg-[#18181B] border border-[#2B2B30] text-xs">
              <div className="flex items-center justify-between">
                <span>Voice Guidance</span>
                <input
                  type="checkbox"
                  checked={settings.voiceEnabled}
                  onChange={() => toggleSetting('voiceEnabled')}
                  className="accent-[#D6FE3E] w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Transition Beeps</span>
                <input
                  type="checkbox"
                  checked={settings.beepEnabled}
                  onChange={() => toggleSetting('beepEnabled')}
                  className="accent-[#D6FE3E] w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>3-2-1 Countdown Beeps</span>
                <input
                  type="checkbox"
                  checked={settings.countdownEnabled}
                  onChange={() => toggleSetting('countdownEnabled')}
                  className="accent-[#D6FE3E] w-4 h-4"
                />
              </div>
              <div className="flex items-center justify-between">
                <span>Keep Screen Awake (WakeLock)</span>
                <input
                  type="checkbox"
                  checked={settings.wakeLockEnabled}
                  onChange={() => toggleSetting('wakeLockEnabled')}
                  className="accent-[#D6FE3E] w-4 h-4"
                />
              </div>
            </div>
          )}
        </div>

        {/* PrimaryButton Start Session */}
        <button
          type="button"
          onClick={handleStart}
          className="w-full h-13 rounded-full bg-[#D6FE3E] hover:bg-[#c9f62c] text-[#111108] font-black text-sm flex items-center justify-center gap-2 active:scale-95 transition cursor-pointer shadow-lg shadow-[#D6FE3E]/15 mt-1"
        >
          <span>Start Session</span>
        </button>
      </div>
    </div>
  );
}
