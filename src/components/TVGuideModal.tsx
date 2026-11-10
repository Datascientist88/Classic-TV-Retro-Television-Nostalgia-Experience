import React, { useState, useMemo } from 'react';
import { ChannelCategory, GenreType, TVProgram } from '../types/tv';
import { playKnobClick, playButtonBeep, playStaticBurst } from '../utils/audioEffects';
import {
  Search,
  Tv,
  Star,
  Clock,
  Play,
  Film,
  Calendar,
  X,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';

interface TVGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  programs: TVProgram[];
  currentProgramId: string | null;
  onSelectProgram: (program: TVProgram) => void;
  favorites: string[]; // program IDs
  onToggleFavorite: (programId: string) => void;
  watchHistory: string[]; // program IDs
}

export const TVGuideModal: React.FC<TVGuideModalProps> = ({
  isOpen,
  onClose,
  programs,
  currentProgramId,
  onSelectProgram,
  favorites,
  onToggleFavorite,
  watchHistory,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDecade, setSelectedDecade] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [viewTab, setViewTab] = useState<'all' | 'favorites' | 'history'>('all');

  const filteredPrograms = useMemo(() => {
    return programs.filter((p) => {
      // Tab filter
      if (viewTab === 'favorites' && !favorites.includes(p.id)) return false;
      if (viewTab === 'history' && !watchHistory.includes(p.id)) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = p.title.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        const matchesChannel = p.channelName.toLowerCase().includes(q);
        const matchesGenre = p.genre.toLowerCase().includes(q);
        const matchesYear = p.year.toString().includes(q);
        if (!matchesTitle && !matchesDesc && !matchesChannel && !matchesGenre && !matchesYear) {
          return false;
        }
      }

      // Decade filter
      if (selectedDecade !== 'all' && p.decade !== selectedDecade) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && p.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [programs, searchQuery, selectedDecade, selectedCategory, viewTab, favorites, watchHistory]);

  const allCategories = useMemo(() => {
    const set = new Set<ChannelCategory>();
    programs.forEach((p) => set.add(p.category));
    return Array.from(set);
  }, [programs]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md select-none animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl h-[90vh] bg-[#16181e] border-2 border-stone-700/80 rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.95)] flex flex-col overflow-hidden text-stone-200">
        {/* Retro Header Styled like Vintage TV Guide Magazine */}
        <div className="bg-gradient-to-r from-red-800 via-red-900 to-stone-900 px-4 sm:px-6 py-3 border-b-2 border-amber-600 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="px-3 py-1 bg-amber-400 text-red-950 font-vintage font-extrabold text-sm sm:text-base tracking-wider rounded shadow uppercase">
              TV GUIDE
            </div>
            <div>
              <h2 className="text-white font-bold text-sm sm:text-base tracking-wide flex items-center gap-2">
                Classic Broadcast Schedule & Public Archives
              </h2>
              <p className="text-[11px] text-amber-200/80 font-mono hidden sm:block">
                Over-the-air retro stations, public domain movies, and nostalgia broadcasts
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playButtonBeep();
              onClose();
            }}
            className="p-1.5 rounded-full hover:bg-black/40 text-stone-300 hover:text-white transition-colors"
            title="Close Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Toolbar: Search, Decade Filters, View Tabs */}
        <div className="p-4 bg-stone-900/90 border-b border-stone-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search programs, genres, years, or stars..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-stone-950 border border-stone-700 rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Segmented View Tabs (All / Favorites / History) */}
          <div className="flex items-center gap-1 bg-stone-950 p-1 rounded-lg border border-stone-800 self-start md:self-auto">
            <button
              onClick={() => {
                playButtonBeep();
                setViewTab('all');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors ${
                viewTab === 'all'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              All Shows ({programs.length})
            </button>
            <button
              onClick={() => {
                playButtonBeep();
                setViewTab('favorites');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewTab === 'favorites'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Star className="w-3.5 h-3.5 text-amber-400" /> Favorites ({favorites.length})
            </button>
            <button
              onClick={() => {
                playButtonBeep();
                setViewTab('history');
              }}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewTab === 'history'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-stone-400" /> History ({watchHistory.length})
            </button>
          </div>
        </div>

        {/* Filter Pills / Decades Bar */}
        <div className="px-4 py-2 bg-stone-950/70 border-b border-stone-800/80 flex items-center gap-2 overflow-x-auto scrollbar-none text-xs font-mono">
          <span className="text-stone-500 uppercase tracking-wider text-[10px] shrink-0">
            DECADE:
          </span>
          {['all', '1950s', '1960s', '1970s', '1980s'].map((d) => (
            <button
              key={d}
              onClick={() => {
                playButtonBeep();
                setSelectedDecade(d);
              }}
              className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap shrink-0 ${
                selectedDecade === d
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'bg-stone-900 text-stone-400 hover:text-stone-200'
              }`}
            >
              {d === 'all' ? 'All Decades' : d}
            </button>
          ))}

          <span className="text-stone-500 uppercase tracking-wider text-[10px] shrink-0 ml-3">
            CATEGORY:
          </span>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-stone-900 text-stone-300 border border-stone-700 rounded px-2 py-1 text-xs font-mono focus:outline-none"
          >
            <option value="all">All 10 Categories</option>
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Main Programs Grid / Schedule */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredPrograms.length === 0 ? (
            <div className="col-span-full py-16 text-center text-stone-500 font-mono">
              <Tv className="w-12 h-12 mx-auto mb-3 opacity-40" />
              <p className="text-base text-stone-300 mb-1">No broadcast programs found</p>
              <p className="text-xs text-stone-500">
                Try adjusting your search keywords, decade, or category filters.
              </p>
            </div>
          ) : (
            filteredPrograms.map((program) => {
              const isCurrentlyPlaying = currentProgramId === program.id;
              const isFav = favorites.includes(program.id);

              return (
                <div
                  key={program.id}
                  className={`group relative bg-stone-900/90 rounded-xl border p-3 flex flex-col justify-between transition-all hover:shadow-xl ${
                    isCurrentlyPlaying
                      ? 'border-emerald-500 ring-1 ring-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
                      : 'border-stone-800 hover:border-stone-700'
                  }`}
                >
                  <div>
                    {/* Top Row: Channel Number Badge, Decade, and Favorite Button */}
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-stone-950 border border-amber-600/60 rounded text-amber-300 font-crt text-lg tracking-wider leading-none">
                          CH {program.channelNumber}
                        </span>
                        <span className="text-xs font-mono text-stone-400">
                          {program.channelName}
                        </span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playButtonBeep();
                          onToggleFavorite(program.id);
                        }}
                        className={`p-1 rounded-full hover:bg-stone-800 transition-colors ${
                          isFav ? 'text-amber-400' : 'text-stone-600 hover:text-stone-400'
                        }`}
                        title={isFav ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <Star className="w-4 h-4 fill-current" />
                      </button>
                    </div>

                    {/* Program Title */}
                    <h3 className="font-bold text-stone-100 text-sm mb-1 line-clamp-2 group-hover:text-amber-300 transition-colors">
                      {program.title}
                    </h3>

                    {/* Clean Metadata without generic pills (Conforms to Design Constitution §1.A) */}
                    <div className="flex items-center gap-1.5 text-[11px] font-mono text-stone-400 mb-2">
                      <span>{program.genre}</span>
                      <span aria-hidden="true">·</span>
                      <span>{program.year}</span>
                      <span aria-hidden="true">·</span>
                      <span>{program.duration || 'Full Feature'}</span>
                    </div>

                    {/* Description */}
                    <p className="text-xs text-stone-400 line-clamp-3 mb-3 leading-relaxed">
                      {program.description}
                    </p>
                  </div>

                  {/* Bottom Row: Source/License Tag & Tune-In Action */}
                  <div className="pt-2 border-t border-stone-800 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[10px] font-mono text-stone-500">
                      <ShieldCheck className="w-3 h-3 text-emerald-500" />
                      <span className="truncate max-w-[130px]" title={program.licenseInfo}>
                        {program.isPublicDomain ? 'Public Domain' : 'Broadcast Archive'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        playStaticBurst(300, 0.3);
                        onSelectProgram(program);
                        onClose();
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold uppercase flex items-center gap-1.5 transition-all active:scale-95 ${
                        isCurrentlyPlaying
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-amber-600 hover:bg-amber-500 text-white shadow'
                      }`}
                    >
                      {isCurrentlyPlaying ? (
                        <>
                          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                          AIRING NOW
                        </>
                      ) : (
                        <>
                          <Play className="w-3.5 h-3.5 fill-current" /> TUNE IN
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
