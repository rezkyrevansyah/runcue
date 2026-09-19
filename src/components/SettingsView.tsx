'use client';

import React, { useState } from 'react';
import { AudioSettings } from '@/types/workout';
import { speakText, playBeep, unlockAudio } from '@/lib/audio';
import {
  Volume2,
  Gauge,
  Ear,
  Languages,
  Lock,
  Shield,
  LifeBuoy,
  Info,
  ChevronRight,
  X,
  Check,
  Smartphone,
  Headphones,
  Sliders,
  CheckCircle2,
  Download,
  Share,
  PlusSquare,
} from 'lucide-react';
import { usePwaInstall } from '@/hooks/usePwaInstall';
import { InstallGuideModal } from '@/components/InstallGuideModal';

interface SettingsViewProps {
  audioSettings: AudioSettings;
  onUpdateSettings: (settings: AudioSettings) => void;
}

type ModalType = 'wakeLock' | 'privacy' | 'help' | 'installPwa' | null;

export function SettingsView({ audioSettings, onUpdateSettings }: SettingsViewProps) {
  const [testPlaying, setTestPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const { isInstalled, hasNativePrompt, isIos, triggerInstall } = usePwaInstall();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleInstallClick = async () => {
    if (isInstalled) {
      showToast('RunCue is already installed on your Home Screen');
      return;
    }
    if (hasNativePrompt) {
      const outcome = await triggerInstall();
      if (outcome === 'accepted') {
        showToast('Successfully added to Home Screen!');
      }
    } else {
      setActiveModal('installPwa');
    }
  };

  const toggleSetting = (key: keyof AudioSettings) => {
    if (typeof audioSettings[key] === 'boolean') {
      const updated = {
        ...audioSettings,
        [key]: !audioSettings[key],
      };
      onUpdateSettings(updated);
    }
  };

  const handleToggleRate = () => {
    const nextRate = audioSettings.speechRate === 'fast' ? 'normal' : 'fast';
    onUpdateSettings({
      ...audioSettings,
      speechRate: nextRate,
    });
    showToast(`Speech rate: ${nextRate === 'fast' ? 'Fast (1.2×)' : 'Normal (1.0×)'}`);
  };

  const handleTestAudio = async () => {
    if (testPlaying) return;
    setTestPlaying(true);
    unlockAudio();
    if (audioSettings.beepEnabled) {
      playBeep(880, 0.2);
    }
    if (audioSettings.voiceEnabled) {
      await speakText('RunCue audio test ready.', audioSettings.speechRate || 'normal');
    }
    setTestPlaying(false);
    showToast('Audio test completed');
  };

  return (
    <div className="flex flex-col gap-6 max-w-md mx-auto w-full px-5 pt-4 pb-28">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#18181B] border border-[#D6FE3E]/40 text-[#D6FE3E] text-xs font-bold shadow-xl animate-in fade-in-50">
          {toastMessage}
        </div>
      )}

      {/* Screen Title */}
      <div>
        <h1 className="text-2xl font-black tracking-tight text-[#F5F5F7]">
          Settings
        </h1>
        <p className="text-xs text-[#9B9BA3] mt-0.5">
          Customize audio cues and workout preferences
        </p>
      </div>

      {/* SECTION 1: AUDIO */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#67676F] uppercase px-1">
          Audio & Voice Cues
        </span>
        <div className="flex flex-col rounded-2xl bg-[#18181B] border border-[#2B2B30] overflow-hidden divide-y divide-[#2B2B30]">
          {/* Voice Guidance TTS */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Voice Guidance (TTS)</span>
                <span className="text-[11px] text-[#9B9BA3]">Spoken instructions for stage transitions</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('voiceEnabled')}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                audioSettings.voiceEnabled ? 'bg-[#D6FE3E]' : 'bg-[#2B2B30]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#111108] transition-transform ${
                  audioSettings.voiceEnabled ? 'translate-x-5' : 'translate-x-0 bg-white/70'
                }`}
              />
            </button>
          </div>

          {/* Speech Rate */}
          <button
            type="button"
            onClick={handleToggleRate}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Speech Rate</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  {audioSettings.speechRate === 'fast' ? '1.2× (Fast)' : '1.0× (Normal)'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D6FE3E] font-bold">
              <span className="capitalize">{audioSettings.speechRate === 'fast' ? 'Fast' : 'Normal'}</span>
              <ChevronRight className="w-4 h-4 text-[#67676F]" />
            </div>
          </button>

          {/* Transition Beeps */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Transition Beeps</span>
                <span className="text-[11px] text-[#9B9BA3]">Audio chime when stages transition</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('beepEnabled')}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                audioSettings.beepEnabled ? 'bg-[#D6FE3E]' : 'bg-[#2B2B30]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#111108] transition-transform ${
                  audioSettings.beepEnabled ? 'translate-x-5' : 'translate-x-0 bg-white/70'
                }`}
              />
            </button>
          </div>

          {/* 3-2-1 Countdown Beeps */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Ear className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">3-2-1 Countdown Beeps</span>
                <span className="text-[11px] text-[#9B9BA3]">Beeps during the final 3 seconds of a stage</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('countdownEnabled')}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                audioSettings.countdownEnabled ? 'bg-[#D6FE3E]' : 'bg-[#2B2B30]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#111108] transition-transform ${
                  audioSettings.countdownEnabled ? 'translate-x-5' : 'translate-x-0 bg-white/70'
                }`}
              />
            </button>
          </div>

          {/* Keep Screen Awake */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Keep Screen Awake</span>
                <span className="text-[11px] text-[#9B9BA3]">Prevent screen from sleeping during workouts (WakeLock)</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => toggleSetting('wakeLockEnabled')}
              className={`w-12 h-7 rounded-full p-1 transition-colors cursor-pointer ${
                audioSettings.wakeLockEnabled ? 'bg-[#D6FE3E]' : 'bg-[#2B2B30]'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full bg-[#111108] transition-transform ${
                  audioSettings.wakeLockEnabled ? 'translate-x-5' : 'translate-x-0 bg-white/70'
                }`}
              />
            </button>
          </div>

          {/* Test Voice & Beep Button */}
          <button
            type="button"
            onClick={handleTestAudio}
            disabled={testPlaying}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer active:bg-[#232327]"
          >
            <div className="flex items-center gap-3">
              <Ear className="w-5 h-5 text-[#D6FE3E]" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F5F5F7]">Test Voice & Beep</span>
                <span className="text-[11px] text-[#9B9BA3]">Check speaker or earphone output</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D6FE3E] font-bold">
              <span>{testPlaying ? 'Playing...' : 'Play Test'}</span>
              <ChevronRight className="w-4 h-4 text-[#67676F]" />
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 2: GENERAL */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#67676F] uppercase px-1">
          General & Device
        </span>
        <div className="flex flex-col rounded-2xl bg-[#18181B] border border-[#2B2B30] overflow-hidden divide-y divide-[#2B2B30]">
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">App Language</span>
            </div>
            <span className="text-xs text-[#9B9BA3] font-medium">English</span>
          </div>

          <button
            type="button"
            onClick={handleInstallClick}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Download className="w-5 h-5 text-[#D6FE3E]" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F5F5F7]">Add to Home Screen</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  {isInstalled ? 'Already installed on this device' : 'Instant launch, full screen & 100% offline'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D6FE3E] font-bold">
              <span>{isInstalled ? 'Installed ✓' : 'Install'}</span>
              <ChevronRight className="w-4 h-4 text-[#67676F]" />
            </div>
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('wakeLock')}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Lock Screen & Background Audio</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#67676F]" />
          </button>
        </div>
      </section>

      {/* SECTION 3: ABOUT */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#67676F] uppercase px-1">
          About & Help
        </span>
        <div className="flex flex-col rounded-2xl bg-[#18181B] border border-[#2B2B30] overflow-hidden divide-y divide-[#2B2B30]">
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Privacy Policy</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#67676F]" />
          </button>

          <button
            type="button"
            onClick={() => setActiveModal('help')}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <LifeBuoy className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Help & Feedback</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#67676F]" />
          </button>

          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">App Version</span>
            </div>
            <span className="text-xs text-[#9B9BA3] font-mono">v1.0.0 (PWA Offline)</span>
          </div>
        </div>
      </section>

      {/* MODAL: Lock Screen & Background Audio */}
      {activeModal === 'wakeLock' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#D6FE3E]" />
                <h3 className="text-base font-bold text-[#F5F5F7]">Lock Screen & Audio</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-[#9B9BA3] leading-relaxed">
              <div className="p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
                <span className="font-bold text-[#F5F5F7] block mb-1">Screen WakeLock</span>
                Keeps your screen on during an active workout so you never have to tap to wake.
              </div>
              <div className="p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
                <span className="font-bold text-[#F5F5F7] block mb-1">Earphones & Pocket Mode</span>
                When placing your phone in your pocket or when the display turns off, voice cues and beeps will continue through your earphones seamlessly.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-bold text-xs cursor-pointer mt-1"
            >
              Got It
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Privacy Policy */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#D6FE3E]" />
                <h3 className="text-base font-bold text-[#F5F5F7]">Privacy Policy</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-2.5 text-xs text-[#9B9BA3] leading-relaxed">
              <div className="flex items-center gap-2 text-[#F5F5F7]">
                <CheckCircle2 className="w-4 h-4 text-[#D6FE3E] shrink-0" />
                <span>100% Offline & Local</span>
              </div>
              <p>
                RunCue never sends personal details, workout logs, or GPS locations to any remote server. All presets and settings reside strictly on your device (LocalStorage).
              </p>
              <div className="flex items-center gap-2 text-[#F5F5F7] pt-1">
                <CheckCircle2 className="w-4 h-4 text-[#D6FE3E] shrink-0" />
                <span>No Accounts & No Ads</span>
              </div>
              <p>
                Ready to use instantly with zero account signup and zero third-party advertising or trackers.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-bold text-xs cursor-pointer mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Help & Feedback */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-5 h-5 text-[#D6FE3E]" />
                <h3 className="text-base font-bold text-[#F5F5F7]">Workout Help</h3>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-[#67676F] hover:text-[#F5F5F7] hover:bg-[#232327]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 text-xs text-[#9B9BA3] leading-relaxed">
              <div className="p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
                <span className="font-bold text-[#F5F5F7] block mb-1">C25K Interval Running</span>
                Alternating between steady running and brisk walking builds cardiovascular endurance safely without overstraining joints.
              </div>
              <div className="p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
                <span className="font-bold text-[#F5F5F7] block mb-1">Media Volume</span>
                Ensure your phone&apos;s media volume is turned up before starting outdoor sessions so you never miss a cue.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-bold text-xs cursor-pointer mt-1"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Panduan Pasang ke Layar Utama HP */}
      {activeModal === 'installPwa' && (
        <InstallGuideModal onClose={() => setActiveModal(null)} />
      )}
    </div>
  );
}
