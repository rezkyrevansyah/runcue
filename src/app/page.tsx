'use client';

import React, { useState, useEffect } from 'react';
import { Workout, AudioSettings, WorkoutSummary } from '@/types/workout';
import {
  getStoredWorkouts,
  saveStoredWorkouts,
  getStoredSettings,
  saveStoredSettings
} from '@/lib/storage';
import { DEFAULT_PRESET, DEFAULT_AUDIO_SETTINGS } from '@/lib/constants';
import { HomeView } from '@/components/HomeView';
import { EditorView } from '@/components/EditorView';
import { PlayerView } from '@/components/PlayerView';
import { SummaryView } from '@/components/SummaryView';
import { AudioPrepModal } from '@/components/AudioPrepModal';
import { BottomNav, NavTab } from '@/components/BottomNav';
import { SettingsView } from '@/components/SettingsView';
import { WorkoutsView } from '@/components/WorkoutsView';

type AppScreen = 'home' | 'editor' | 'player' | 'summary';

export default function RunCueApp() {
  const [isClient, setIsClient] = useState(false);
  const [screen, setScreen] = useState<AppScreen>('home');
  const [activeTab, setActiveTab] = useState<NavTab>('beranda');
  const [workouts, setWorkouts] = useState<Workout[]>([DEFAULT_PRESET]);
  const [activeWorkout, setActiveWorkout] = useState<Workout>(DEFAULT_PRESET);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(DEFAULT_AUDIO_SETTINGS);
  const [showAudioPrep, setShowAudioPrep] = useState(false);
  const [summaryData, setSummaryData] = useState<WorkoutSummary | null>(null);

  // Load from localStorage on client mount
  useEffect(() => {
    setIsClient(true);
    const loadedWorkouts = getStoredWorkouts();
    const loadedSettings = getStoredSettings();
    setWorkouts(loadedWorkouts);
    setActiveWorkout(loadedWorkouts[0] || DEFAULT_PRESET);
    setAudioSettings(loadedSettings);
  }, []);

  // Update workouts state and persist
  const handleSaveWorkout = (saved: Workout) => {
    setWorkouts(prev => {
      const exists = prev.some(w => w.id === saved.id);
      const updated = exists
        ? prev.map(w => (w.id === saved.id ? saved : w))
        : [saved, ...prev];
      saveStoredWorkouts(updated);
      return updated;
    });
    setActiveWorkout(saved);
  };

  const handleDeleteWorkout = (id: string) => {
    setWorkouts(prev => {
      const filtered = prev.filter(w => w.id !== id);
      const safeList = filtered.length > 0 ? filtered : [DEFAULT_PRESET];
      saveStoredWorkouts(safeList);
      return safeList;
    });
  };

  const handleDuplicateWorkout = (w: Workout) => {
    const duplicated: Workout = {
      ...w,
      id: `workout-${Date.now()}`,
      name: `${w.name} (Salinan)`,
      updatedAt: new Date().toISOString(),
    };
    setWorkouts(prev => {
      const updated = [duplicated, ...prev];
      saveStoredWorkouts(updated);
      return updated;
    });
  };

  const handleCreateNewWorkout = () => {
    const newWorkout: Workout = {
      id: `workout-${Date.now()}`,
      schemaVersion: 1,
      name: 'Latihan Baru',
      blocks: [
        {
          id: `step-${Date.now()}-1`,
          kind: 'step',
          type: 'warmup',
          label: 'Pemanasan',
          durationSeconds: 300,
        },
        {
          id: `repeat-${Date.now()}-1`,
          kind: 'repeat',
          count: 8,
          steps: [
            {
              id: `step-${Date.now()}-2`,
              kind: 'step',
              type: 'run',
              label: 'Lari',
              durationSeconds: 60,
            },
            {
              id: `step-${Date.now()}-3`,
              kind: 'step',
              type: 'walk',
              label: 'Jalan',
              durationSeconds: 120,
            },
          ],
        },
        {
          id: `step-${Date.now()}-4`,
          kind: 'step',
          type: 'cooldown',
          label: 'Pendinginan',
          durationSeconds: 300,
        },
      ],
      updatedAt: new Date().toISOString(),
    };

    setActiveWorkout(newWorkout);
    setScreen('editor');
  };

  const handleUpdateAudioSettings = (newSettings: AudioSettings) => {
    setAudioSettings(newSettings);
    saveStoredSettings(newSettings);
  };

  const handleSelectToStart = (w: Workout) => {
    setActiveWorkout(w);
    setShowAudioPrep(true);
  };

  const handleConfirmStartPlayer = () => {
    setShowAudioPrep(false);
    setScreen('player');
  };

  const handlePlayerFinish = (summary: WorkoutSummary) => {
    setSummaryData(summary);
    setScreen('summary');
  };

  if (!isClient) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#0A0A0B] text-[#F5F5F7] font-medium text-sm">
        Memuat RunCue...
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#0A0A0B] text-[#F5F5F7] flex flex-col items-center">
      {/* 1. Main Navigation Screens (with BottomNav) */}
      {screen === 'home' && (
        <>
          {activeTab === 'beranda' && (
            <HomeView
              workouts={workouts}
              onSelectWorkout={handleSelectToStart}
              onEditWorkout={w => {
                setActiveWorkout(w);
                setScreen('editor');
              }}
              onCreateNew={handleCreateNewWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onDuplicateWorkout={handleDuplicateWorkout}
            />
          )}

          {activeTab === 'latihan' && (
            <WorkoutsView
              workouts={workouts}
              onSelectWorkout={handleSelectToStart}
              onEditWorkout={w => {
                setActiveWorkout(w);
                setScreen('editor');
              }}
              onCreateNew={handleCreateNewWorkout}
              onDeleteWorkout={handleDeleteWorkout}
              onDuplicateWorkout={handleDuplicateWorkout}
            />
          )}

          {activeTab === 'pengaturan' && (
            <SettingsView
              audioSettings={audioSettings}
              onUpdateSettings={handleUpdateAudioSettings}
            />
          )}

          <BottomNav activeTab={activeTab} onTabChange={tab => setActiveTab(tab)} />
        </>
      )}

      {/* 2. Editor Screen */}
      {screen === 'editor' && (
        <EditorView
          workout={activeWorkout}
          onSave={w => {
            handleSaveWorkout(w);
            setScreen('home');
          }}
          onStart={w => {
            handleSaveWorkout(w);
            setActiveWorkout(w);
            setShowAudioPrep(true);
          }}
          onBack={() => setScreen('home')}
        />
      )}

      {/* 3. Player Screen */}
      {screen === 'player' && (
        <PlayerView
          workout={activeWorkout}
          audioSettings={audioSettings}
          onFinish={handlePlayerFinish}
          onExit={() => setScreen('home')}
        />
      )}

      {/* 4. Summary Screen */}
      {screen === 'summary' && summaryData && (
        <SummaryView
          summary={summaryData}
          workout={activeWorkout}
          onRepeat={() => {
            setShowAudioPrep(true);
          }}
          onHome={() => setScreen('home')}
        />
      )}

      {/* Pre-run Audio Preparation Modal */}
      {showAudioPrep && (
        <AudioPrepModal
          settings={audioSettings}
          onUpdateSettings={handleUpdateAudioSettings}
          onConfirmStart={handleConfirmStartPlayer}
          onCancel={() => setShowAudioPrep(false)}
        />
      )}
    </main>
  );
}
