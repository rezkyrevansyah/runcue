'use client';

import React from 'react';
import { House, ListChecks, Settings } from 'lucide-react';

export type NavTab = 'beranda' | 'latihan' | 'pengaturan';

interface BottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
}

export function BottomNav({ activeTab, onTabChange }: BottomNavProps) {
  const tabs = [
    { id: 'beranda' as NavTab, label: 'Beranda', icon: House },
    { id: 'latihan' as NavTab, label: 'Latihan', icon: ListChecks },
    { id: 'pengaturan' as NavTab, label: 'Pengaturan', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#18181B] border-t border-[#2B2B30] px-4 pt-2.5 pb-6 sm:pb-4 shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-2">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1.5 rounded-2xl transition-all cursor-pointer ${
                isActive
                  ? 'text-[#D6FE3E]'
                  : 'text-[#67676F] hover:text-[#9B9BA3]'
              }`}
            >
              <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110' : ''}`} />
              <span className={`text-[11px] font-bold tracking-tight ${isActive ? 'font-black' : 'font-medium'}`}>
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
