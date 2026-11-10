import React from 'react';
import { GenreType, TVEra } from '../types/tv';
import { CheckSquare, Square, Tv, Sparkles } from 'lucide-react';
import { playButtonBeep, playKnobClick } from '../utils/audioEffects';

interface SideChannelsPanelProps {
  activeGenres: GenreType[];
  onToggleGenre: (genre: GenreType) => void;
  onSelectAllGenres: () => void;
  onClearAllGenres: () => void;
  currentEra: TVEra;
  onSelectEra: (era: TVEra) => void;
  genreCounts: Record<GenreType, number>;
}

const ALL_GENRES: { label: string; value: GenreType }[] = [
  { label: 'Cartoons', value: 'Cartoons' },
  { label: 'Comedy', value: 'Comedy' },
  { label: 'Commercials', value: 'Commercials' },
  { label: 'Drama', value: 'Drama' },
  { label: 'Gameshows', value: 'Gameshows' },
  { label: 'Movies', value: 'Movies' },
  { label: 'Music', value: 'Music' },
  { label: 'News', value: 'News' },
  { label: 'Documentary', value: 'Documentary' },
  { label: 'Sci-Fi', value: 'Sci-Fi' },
];

const ERAS: { id: TVEra; label: string; year: string; thumb: string; color: string }[] = [
  {
    id: '1950s',
    label: "'50s TV",
    year: '1954 RCA Victor',
    thumb: 'Wood Console',
    color: 'from-amber-900 to-amber-950',
  },
  {
    id: '1970s',
    label: "'70s TV",
    year: '1975 Zenith Color',
    thumb: 'Amber Portable',
    color: 'from-amber-700 to-amber-900',
  },
  {
    id: '1980s',
    label: "'80s TV",
    year: '1984 Trinitron',
    thumb: 'Silver Trinitron',
    color: 'from-stone-600 to-stone-800',
  },
  {
    id: '1990s',
    label: "'90s TV",
    year: '1995 Cyber CRT',
    thumb: 'Black Curved Tube',
    color: 'from-stone-800 to-stone-950',
  },
];

export const SideChannelsPanel: React.FC<SideChannelsPanelProps> = ({
  activeGenres,
  onToggleGenre,
  onSelectAllGenres,
  onClearAllGenres,
  currentEra,
  onSelectEra,
  genreCounts,
}) => {
  return (
    <div className="w-full lg:w-64 bg-[#14151a] rounded-2xl p-4 border border-stone-800 shadow-xl flex flex-col gap-4 text-stone-300">
      {/* Era TV Set Selection (As seen on right side of image_1cd60cce.png) */}
      <div>
        <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-stone-800">
          <span className="text-[11px] font-mono uppercase tracking-widest text-amber-400 font-bold flex items-center gap-1">
            <Tv className="w-3.5 h-3.5 text-amber-400" /> TV CABINET ERA
          </span>
          <span className="text-[10px] text-stone-500 font-mono">RETRO SKINS</span>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {ERAS.map((era) => {
            const isSelected = currentEra === era.id;
            return (
              <button
                key={era.id}
                onClick={() => {
                  playKnobClick();
                  onSelectEra(era.id);
                }}
                className={`p-2 rounded-xl text-left transition-all border relative flex flex-col items-center justify-center ${
                  isSelected
                    ? 'bg-amber-950/70 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(245,158,11,0.3)] ring-1 ring-amber-400'
                    : 'bg-stone-900/80 hover:bg-stone-800 border-stone-800 text-stone-400 hover:text-stone-200'
                }`}
              >
                {/* Mini CRT Graphic Icon */}
                <div
                  className={`w-10 h-7 rounded-md border mb-1 flex items-center justify-center bg-gradient-to-br ${era.color} ${
                    isSelected ? 'border-amber-400' : 'border-stone-700'
                  }`}
                >
                  <div className="w-6 h-4 rounded-sm bg-black/60 flex items-center justify-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400/80 animate-pulse" />
                  </div>
                </div>

                <span className="font-crt text-lg tracking-wider font-bold leading-none">
                  {era.label}
                </span>
                <span className="text-[9px] font-mono text-stone-400 truncate max-w-full">
                  {era.thumb}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Category / Genre Checkboxes (Directly modeled after image_1cd60cce.png) */}
      <div className="border-t border-stone-800 pt-3">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" /> GENRES
          </span>
          <div className="flex items-center gap-1 text-[11px] font-mono text-stone-400">
            <button
              onClick={() => {
                playButtonBeep();
                onSelectAllGenres();
              }}
              className="hover:text-amber-300 transition-colors underline"
            >
              All
            </button>
            <span>|</span>
            <button
              onClick={() => {
                playButtonBeep();
                onClearAllGenres();
              }}
              className="hover:text-amber-300 transition-colors underline"
            >
              None
            </button>
          </div>
        </div>

        {/* Scrollable / Stacked list of genres */}
        <div className="flex flex-col gap-1 max-h-64 overflow-y-auto pr-1 scrollbar-thin">
          {ALL_GENRES.map((g) => {
            const isChecked = activeGenres.includes(g.value);
            const count = genreCounts[g.value] || 0;

            return (
              <label
                key={g.value}
                onClick={() => {
                  playButtonBeep();
                  onToggleGenre(g.value);
                }}
                className={`flex items-center justify-between px-2 py-1 rounded text-xs font-mono cursor-pointer transition-colors ${
                  isChecked
                    ? 'text-stone-100 hover:bg-stone-800/80'
                    : 'text-stone-500 hover:bg-stone-900/50'
                }`}
              >
                <div className="flex items-center gap-2">
                  {isChecked ? (
                    <CheckSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  ) : (
                    <Square className="w-3.5 h-3.5 text-stone-600 shrink-0" />
                  )}
                  <span>{g.label}</span>
                </div>
                <span className="text-[10px] text-stone-500 tabular-nums">
                  ({count})
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};
