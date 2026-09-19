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
} from 'lucide-react';

interface SettingsViewProps {
  audioSettings: AudioSettings;
  onUpdateSettings: (settings: AudioSettings) => void;
}

type ModalType = 'wakeLock' | 'privacy' | 'help' | null;

export function SettingsView({ audioSettings, onUpdateSettings }: SettingsViewProps) {
  const [testPlaying, setTestPlaying] = useState(false);
  const [activeModal, setActiveModal] = useState<ModalType>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
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
    showToast(`Kecepatan bicara: ${nextRate === 'fast' ? 'Cepat' : 'Normal'}`);
  };

  const handleTestAudio = async () => {
    if (testPlaying) return;
    setTestPlaying(true);
    unlockAudio();
    if (audioSettings.beepEnabled) {
      playBeep(880, 0.2);
    }
    if (audioSettings.voiceEnabled) {
      await speakText('Tes audio RunCue siap digunakan.', audioSettings.speechRate || 'normal');
    }
    setTestPlaying(false);
    showToast('Tes audio selesai');
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
          Pengaturan
        </h1>
        <p className="text-xs text-[#9B9BA3] mt-0.5">
          Sesuaikan suara audio dan preferensi latihan
        </p>
      </div>

      {/* SECTION 1: AUDIO */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#67676F] uppercase px-1">
          Audio & Notifikasi Suara
        </span>
        <div className="flex flex-col rounded-2xl bg-[#18181B] border border-[#2B2B30] overflow-hidden divide-y divide-[#2B2B30]">
          {/* Suara Panduan TTS */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Volume2 className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Panduan Suara (TTS)</span>
                <span className="text-[11px] text-[#9B9BA3]">Instruksi perpindahan tahap</span>
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

          {/* Kecepatan Bicara */}
          <button
            type="button"
            onClick={handleToggleRate}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Gauge className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Kecepatan Bicara</span>
                <span className="text-[11px] text-[#9B9BA3]">
                  {audioSettings.speechRate === 'fast' ? '1.2× (Cepat)' : '1.0× (Normal)'}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D6FE3E] font-bold">
              <span className="capitalize">{audioSettings.speechRate === 'fast' ? 'Cepat' : 'Normal'}</span>
              <ChevronRight className="w-4 h-4 text-[#67676F]" />
            </div>
          </button>

          {/* Bunyi Beep Transisi */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Sliders className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Bunyi Beep Transisi</span>
                <span className="text-[11px] text-[#9B9BA3]">Bunyi nada saat tahap berganti</span>
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

          {/* Hitung Mundur 3-2-1 */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Ear className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Hitung Mundur 3-2-1</span>
                <span className="text-[11px] text-[#9B9BA3]">Beep pada 3 detik terakhir tahap</span>
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

          {/* Layar Tetap Aktif */}
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[#9B9BA3]" />
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-[#F5F5F7]">Layar Tetap Aktif</span>
                <span className="text-[11px] text-[#9B9BA3]">Cegah layar mati saat latihan (WakeLock)</span>
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

          {/* Tes Suara & Bunyi Button */}
          <button
            type="button"
            onClick={handleTestAudio}
            disabled={testPlaying}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer active:bg-[#232327]"
          >
            <div className="flex items-center gap-3">
              <Ear className="w-5 h-5 text-[#D6FE3E]" />
              <div className="flex flex-col">
                <span className="text-sm font-bold text-[#F5F5F7]">Tes Suara & Bunyi</span>
                <span className="text-[11px] text-[#9B9BA3]">Uji keluaran speaker atau earphone</span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#D6FE3E] font-bold">
              <span>{testPlaying ? 'Memutar...' : 'Putar Tes'}</span>
              <ChevronRight className="w-4 h-4 text-[#67676F]" />
            </div>
          </button>
        </div>
      </section>

      {/* SECTION 2: UMUM */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#67676F] uppercase px-1">
          Umum & Perangkat
        </span>
        <div className="flex flex-col rounded-2xl bg-[#18181B] border border-[#2B2B30] overflow-hidden divide-y divide-[#2B2B30]">
          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Languages className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Bahasa Aplikasi</span>
            </div>
            <span className="text-xs text-[#9B9BA3] font-medium">Bahasa Indonesia</span>
          </div>

          <button
            type="button"
            onClick={() => setActiveModal('wakeLock')}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Lock className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Cara Kerja Layar Terkunci</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#67676F]" />
          </button>
        </div>
      </section>

      {/* SECTION 3: TENTANG */}
      <section className="flex flex-col gap-2">
        <span className="text-[11px] font-bold tracking-wider text-[#67676F] uppercase px-1">
          Tentang & Bantuan
        </span>
        <div className="flex flex-col rounded-2xl bg-[#18181B] border border-[#2B2B30] overflow-hidden divide-y divide-[#2B2B30]">
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition text-left cursor-pointer"
          >
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Kebijakan Privasi</span>
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
              <span className="text-sm font-semibold text-[#F5F5F7]">Bantuan & Masukan</span>
            </div>
            <ChevronRight className="w-4 h-4 text-[#67676F]" />
          </button>

          <div className="flex items-center justify-between p-4 hover:bg-[#232327]/60 transition">
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-[#9B9BA3]" />
              <span className="text-sm font-semibold text-[#F5F5F7]">Versi Aplikasi</span>
            </div>
            <span className="text-xs text-[#9B9BA3] font-mono">v1.0.0 (PWA Offline)</span>
          </div>
        </div>
      </section>

      {/* MODAL: Cara Kerja Layar Terkunci */}
      {activeModal === 'wakeLock' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Lock className="w-5 h-5 text-[#D6FE3E]" />
                <h3 className="text-base font-bold text-[#F5F5F7]">Layar & Audio</h3>
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
                Fitur ini menjaga layar ponsel Anda tetap menyala selama sesi latihan berjalan, sehingga Anda tidak perlu terus mengetuk layar.
              </div>
              <div className="p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
                <span className="font-bold text-[#F5F5F7] block mb-1">Penggunaan Headset / Earphone</span>
                Jika Anda memasukkan HP ke saku, gunakan earphone. Suara pemandu tetap terdengar saat layar mati atau aplikasi berjalan di latar.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-bold text-xs cursor-pointer mt-1"
            >
              Mengerti
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Kebijakan Privasi */}
      {activeModal === 'privacy' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <Shield className="w-5 h-5 text-[#D6FE3E]" />
                <h3 className="text-base font-bold text-[#F5F5F7]">Kebijakan Privasi</h3>
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
                <span>100% Offline & Lokal</span>
              </div>
              <p>
                RunCue tidak mengumpulkan data pribadi, lokasi GPS, atau riwayat lari Anda ke server manapun. Semua preset dan pengaturan tersimpan sepenuhnya di memori perangkat Anda (LocalStorage).
              </p>
              <div className="flex items-center gap-2 text-[#F5F5F7] pt-1">
                <CheckCircle2 className="w-4 h-4 text-[#D6FE3E] shrink-0" />
                <span>Bebas Akun & Bebas Iklan</span>
              </div>
              <p>
                Aplikasi ini siap digunakan seketika tanpa pendaftaran akun dan tanpa pelacak analitik pihak ketiga.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-bold text-xs cursor-pointer mt-1"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* MODAL: Bantuan & Masukan */}
      {activeModal === 'help' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-[#18181B] rounded-3xl p-6 shadow-2xl border border-[#2B2B30] flex flex-col gap-4 animate-in fade-in-50 zoom-in-95">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <LifeBuoy className="w-5 h-5 text-[#D6FE3E]" />
                <h3 className="text-base font-bold text-[#F5F5F7]">Bantuan Latihan</h3>
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
                <span className="font-bold text-[#F5F5F7] block mb-1">Interval Training C25K</span>
                Kombinasi lari dan jalan santai secara teratur membantu membangun daya tahan jantung dan paru tanpa risiko cedera berlebih.
              </div>
              <div className="p-3 rounded-2xl bg-[#232327] border border-[#2B2B30]">
                <span className="font-bold text-[#F5F5F7] block mb-1">Volume Media</span>
                Pastikan volume media perangkat dinaikkan sebelum memulai agar instruksi terdengar jelas saat berolahraga di luar ruangan.
              </div>
            </div>

            <button
              type="button"
              onClick={() => setActiveModal(null)}
              className="w-full h-11 rounded-full bg-[#D6FE3E] text-[#111108] font-bold text-xs cursor-pointer mt-1"
            >
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
