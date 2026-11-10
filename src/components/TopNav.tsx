import React from 'react';
import { Power, Tv, Radio, Settings, Star } from 'lucide-react';
import { playPowerSwitch, playButtonBeep } from '../utils/audioEffects';

interface TopNavProps {
  isPoweredOn: boolean;
  onTogglePower: () => void;
  onOpenGuide: () => void;
  onOpenRadio: () => void;
  onOpenAdmin: () => void;
  onOpenFavorites: () => void;
}

export const TopNav: React.FC<TopNavProps> = ({
  isPoweredOn,
  onTogglePower,
  onOpenGuide,
  onOpenRadio,
  onOpenAdmin,
  onOpenFavorites,
}) => {
  return (
    <header className="flex items-center justify-between gap-8 px-4 sm:px-8 py-3.5 border-b border-stone-800/80 bg-stone-950/90 backdrop-blur-md sticky top-0 z-40">
      {/* Zone 1: Single text element wordmark in display font */}
      <a
        href="#"
        onClick={(e) => {
          e.preventDefault();
        }}
        className="font-vintage text-base sm:text-lg font-bold tracking-wider text-amber-300 hover:text-amber-200 transition-colors whitespace-nowrap shrink-0"
      >
        Classic TV Archive
      </a>

      {/* Zone 2: 4–5 clean single-line text navigation links */}
      <nav className="hidden md:flex items-center gap-6 text-xs sm:text-sm font-medium text-stone-300">
        <button
          onClick={() => {
            playButtonBeep();
            onOpenGuide();
          }}
          className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          TV Guide
        </button>
        <button
          onClick={() => {
            playButtonBeep();
            onOpenRadio();
          }}
          className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Retro Radio
        </button>
        <button
          onClick={() => {
            playButtonBeep();
            onOpenFavorites();
          }}
          className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Favorites
        </button>
        <button
          onClick={() => {
            playButtonBeep();
            onOpenAdmin();
          }}
          className="hover:text-amber-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
        >
          Station Admin
        </button>
      </nav>

      {/* Zone 3: 1 primary action */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={() => {
            playPowerSwitch(!isPoweredOn);
            onTogglePower();
          }}
          className={`px-3.5 py-1.5 text-xs font-mono font-bold tracking-wider rounded-lg transition-all flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
            isPoweredOn
              ? 'bg-red-600/90 hover:bg-red-500 text-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
              : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-[0_0_10px_rgba(16,185,129,0.5)]'
          }`}
        >
          <Power className="w-3.5 h-3.5" />
          <span>{isPoweredOn ? 'POWER OFF' : 'POWER ON'}</span>
        </button>
      </div>
    </header>
  );
};
