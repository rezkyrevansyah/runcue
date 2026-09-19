'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
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
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const currentConfig = STEP_TYPE_CONFIG[value] || STEP_TYPE_CONFIG.run;

  const updateCoords = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const menuHeight = 260;
      const spaceBelow = window.innerHeight - rect.bottom;
      
      const top = spaceBelow < menuHeight && rect.top > menuHeight
        ? rect.top - menuHeight - 6
        : rect.bottom + 6;

      const left = Math.max(10, Math.min(rect.left, window.innerWidth - 220));
      setCoords({ top, left });
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      updateCoords();
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent | TouchEvent) {
      const target = event.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }

    function handleScrollOrResize() {
      if (isOpen) {
        updateCoords();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
      window.addEventListener('scroll', handleScrollOrResize, true);
      window.addEventListener('resize', handleScrollOrResize);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
      window.removeEventListener('scroll', handleScrollOrResize, true);
      window.removeEventListener('resize', handleScrollOrResize);
    };
  }, [isOpen]);

  return (
    <div className="relative inline-block text-left">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
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

      {/* Floating Dropdown Menu Portaled to document.body */}
      {isOpen && coords && typeof document !== 'undefined' && createPortal(
        <div
          ref={menuRef}
          style={{
            position: 'fixed',
            top: `${coords.top}px`,
            left: `${coords.left}px`,
            zIndex: 9999,
          }}
          className="w-52 rounded-2xl bg-[#18181B] p-1.5 shadow-2xl border border-[#2B2B30] flex flex-col gap-0.5 animate-in fade-in-50 zoom-in-95 duration-100"
          role="listbox"
        >
          <div className="px-2.5 py-1 text-[10px] font-bold tracking-wider uppercase text-[#67676F]">
            Select Stage Type
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
        </div>,
        document.body
      )}
    </div>
  );
}
