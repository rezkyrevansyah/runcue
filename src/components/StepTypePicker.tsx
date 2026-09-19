'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Flame, Zap, Footprints, Wind, Coffee, Sliders, Check } from 'lucide-react';
import { StepType } from '@/types/workout';
import { STEP_TYPE_CONFIG } from '@/lib/constants';

interface StepTypePickerProps {
  value: StepType;
  onChange: (type: StepType) => void;
  size?: 'sm' | 'md';
}

const TYPE_ICONS: Record<StepType, React.ReactNode> = {
  warmup: <Flame className="w-3.5 h-3.5" />,
  run: <Zap className="w-3.5 h-3.5" />,
  walk: <Footprints className="w-3.5 h-3.5" />,
  cooldown: <Wind className="w-3.5 h-3.5" />,
  rest: <Coffee className="w-3.5 h-3.5" />,
  custom: <Sliders className="w-3.5 h-3.5" />,
};

const TYPE_OPTIONS: StepType[] = ['warmup', 'run', 'walk', 'cooldown', 'rest', 'custom'];

export function StepTypePicker({ value, onChange, size = 'md' }: StepTypePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentConfig = STEP_TYPE_CONFIG[value] || STEP_TYPE_CONFIG.run;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left" ref={containerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`inline-flex items-center gap-1.5 font-bold transition-all duration-150 cursor-pointer active:scale-95 select-none rounded-xl border border-black/5 shadow-2xs hover:shadow-xs ${
          size === 'sm' ? 'px-2.5 py-1 text-2xs' : 'px-3 py-1.5 text-xs'
        } ${currentConfig.badgeBg} ${currentConfig.badgeColor}`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="opacity-90">{TYPE_ICONS[value]}</span>
        <span>{currentConfig.label}</span>
        <ChevronDown
          className={`w-3.5 h-3.5 opacity-60 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {/* Floating Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute left-0 top-full mt-1.5 z-50 min-w-[190px] rounded-2xl bg-[#18181B] p-1.5 shadow-2xl border border-[#2B2B30] flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95 duration-100"
          role="listbox"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-[#67676F]">
            Pilih Jenis Langkah
          </div>
          {TYPE_OPTIONS.map(opt => {
            const optConfig = STEP_TYPE_CONFIG[opt];
            const isSelected = opt === value;

            return (
              <button
                key={opt}
                type="button"
                onClick={() => {
                  onChange(opt);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#232327] text-[#F5F5F7] font-bold'
                    : 'text-[#9B9BA3] hover:bg-[#232327]/60 hover:text-[#F5F5F7]'
                }`}
                role="option"
                aria-selected={isSelected}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${optConfig.badgeBg} ${optConfig.badgeColor}`}
                  >
                    {TYPE_ICONS[opt]}
                  </span>
                  <span>{optConfig.label}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[#D6FE3E]" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
