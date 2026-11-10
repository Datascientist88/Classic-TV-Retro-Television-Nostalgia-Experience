/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { GenreType, ScreenFilter, TVEra, TVProgram, TVSettings } from './types/tv';
import { INITIAL_PROGRAMS } from './data/channels';
import { TopNav } from './components/TopNav';
import { Console50sCabinet } from './components/cabinets/Console50sCabinet';
import { Trinitron80sCabinet } from './components/cabinets/Trinitron80sCabinet';
import { Portable70sCabinet } from './components/cabinets/Portable70sCabinet';
import { Modern90sCabinet } from './components/cabinets/Modern90sCabinet';
import { SideChannelsPanel } from './components/SideChannelsPanel';
import { RemoteControl } from './components/RemoteControl';
import { TVGuideModal } from './components/TVGuideModal';
import { RetroRadioPlayer } from './components/RetroRadioPlayer';
import { AdminPanel } from './components/AdminPanel';
import {
  playKnobClick,
  playPowerSwitch,
  playStaticBurst,
  playButtonBeep,
} from './utils/audioEffects';
import {
  Tv,
  Radio,
  SlidersHorizontal,
  Sparkles,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
} from 'lucide-react';

const ALL_GENRES: GenreType[] = [
  'Cartoons',
  'Comedy',
  'Commercials',
  'Drama',
  'Gameshows',
  'Movies',
  'Music',
  'News',
  'Documentary',
  'Sci-Fi',
];

export default function App() {
  // Programs Catalog State
  const [programs, setPrograms] = useState<TVProgram[]>(() => {
    try {
      const saved = localStorage.getItem('classic_tv_programs');
      return saved ? JSON.parse(saved) : INITIAL_PROGRAMS;
    } catch {
      return INITIAL_PROGRAMS;
    }
  });

  // Settings State
  const [settings, setSettings] = useState<TVSettings>(() => {
    try {
      const saved = localStorage.getItem('classic_tv_settings');
      if (saved) return JSON.parse(saved);
    } catch {}
    return {
      isPoweredOn: true,
      era: '1980s',
      volume: 80,
      isMuted: false,
      filter: 'color',
      curvature: true,
      scanlines: true,
      staticBurstOnSwitch: true,
      hissVolume: 30,
      currentChannelNumber: 6,
      activeGenreFilters: ALL_GENRES,
      selectedYear: null,
      channelSurfing: false,
    };
  });

  // Active Program State
  const [currentProgramIndex, setCurrentProgramIndex] = useState(0);
  const [isTuning, setIsTuning] = useState(false);
  const [osdMessage, setOsdMessage] = useState<string | null>('CH 06 · 1981 · MTV STEREO');

  // Favorites & Watch History
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('classic_tv_favorites');
      return saved ? JSON.parse(saved) : ['retro80-1', 'toon-1', 'bw-1'];
    } catch {
      return ['retro80-1', 'toon-1', 'bw-1'];
    }
  });

  const [watchHistory, setWatchHistory] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('classic_tv_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // UI Modals
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [isRadioOpen, setIsRadioOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [showRemote, setShowRemote] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const tvContainerRef = useRef<HTMLDivElement | null>(null);
  const osdTimerRef = useRef<number | null>(null);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('classic_tv_programs', JSON.stringify(programs));
    } catch {}
  }, [programs]);

  useEffect(() => {
    try {
      localStorage.setItem('classic_tv_settings', JSON.stringify(settings));
    } catch {}
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem('classic_tv_favorites', JSON.stringify(favorites));
    } catch {}
  }, [favorites]);

  useEffect(() => {
    try {
      localStorage.setItem('classic_tv_history', JSON.stringify(watchHistory));
    } catch {}
  }, [watchHistory]);

  // Filter programs based on active genres
  const availablePrograms = useMemo(() => {
    if (settings.activeGenreFilters.length === 0) return programs;
    return programs.filter((p) => settings.activeGenreFilters.includes(p.genre));
  }, [programs, settings.activeGenreFilters]);

  // Current program
  const currentProgram = availablePrograms[currentProgramIndex] || availablePrograms[0] || programs[0] || null;

  // Genre counts
  const genreCounts = useMemo(() => {
    const counts: Record<GenreType, number> = {} as any;
    ALL_GENRES.forEach((g) => {
      counts[g] = programs.filter((p) => p.genre === g).length;
    });
    return counts;
  }, [programs]);

  // Display temporary OSD message
  const triggerOsd = (msg: string) => {
    setOsdMessage(msg);
    if (osdTimerRef.current) clearTimeout(osdTimerRef.current);
    osdTimerRef.current = window.setTimeout(() => {
      setOsdMessage(null);
    }, 3500);
  };

  // Switch program with authentic static noise and snow
  const switchToProgram = (program: TVProgram) => {
    if (settings.staticBurstOnSwitch) {
      playStaticBurst(360, 0.35);
      setIsTuning(true);
      setTimeout(() => {
        setIsTuning(false);
      }, 360);
    }

    const idx = availablePrograms.findIndex((p) => p.id === program.id);
    if (idx !== -1) {
      setCurrentProgramIndex(idx);
    }

    setSettings((prev) => ({
      ...prev,
      currentChannelNumber: program.channelNumber,
      selectedYear: program.year,
    }));

    // Record history
    setWatchHistory((prev) => [program.id, ...prev.filter((id) => id !== program.id)].slice(0, 30));

    triggerOsd(`CH ${String(program.channelNumber).padStart(2, '0')} · ${program.year} · ${program.title.substring(0, 24).toUpperCase()}`);
  };

  // Channel Step (+1 / -1)
  const handleChannelStep = (delta: number) => {
    if (availablePrograms.length === 0) return;
    const nextIdx = (currentProgramIndex + delta + availablePrograms.length) % availablePrograms.length;
    const targetProg = availablePrograms[nextIdx];
    switchToProgram(targetProg);
  };

  // Direct Channel Number Tuning
  const handleDirectChannelNumber = (channelNum: number) => {
    const target = programs.find((p) => p.channelNumber === channelNum);
    if (target) {
      switchToProgram(target);
    } else {
      // Untuned channel: show brief static
      playStaticBurst(500, 0.4);
      triggerOsd(`CH ${String(channelNum).padStart(2, '0')} · NO SIGNAL`);
      setSettings((prev) => ({ ...prev, currentChannelNumber: channelNum }));
    }
  };

  // Select Year (as on 1980s console)
  const handleSelectYear = (year: number) => {
    const matching = programs.filter((p) => p.year === year);
    if (matching.length > 0) {
      switchToProgram(matching[0]);
    } else {
      triggerOsd(`YEAR ${year} · NO ARCHIVE RECORD`);
    }
  };

  // Volume Adjustment
  const handleAdjustVolume = (delta: number) => {
    setSettings((prev) => {
      const newVol = Math.max(0, Math.min(100, prev.volume + delta));
      triggerOsd(`VOL ${newVol}%`);
      return { ...prev, volume: newVol, isMuted: false };
    });
  };

  // Toggle Mute
  const handleToggleMute = () => {
    setSettings((prev) => {
      const nextMute = !prev.isMuted;
      triggerOsd(nextMute ? 'AUDIO MUTED' : `VOL ${prev.volume}%`);
      return { ...prev, isMuted: nextMute };
    });
  };

  // Toggle Power
  const handleTogglePower = () => {
    setSettings((prev) => {
      const nextState = !prev.isPoweredOn;
      if (nextState) {
        triggerOsd('CRT POWER ON');
      }
      return { ...prev, isPoweredOn: nextState };
    });
  };

  // Cycle CRT Filters
  const handleCycleFilter = () => {
    const filters: ScreenFilter[] = ['color', 'bw', 'amber', 'green'];
    const curIdx = filters.indexOf(settings.filter);
    const next = filters[(curIdx + 1) % filters.length];
    setSettings((prev) => ({ ...prev, filter: next }));
    triggerOsd(`FILTER: ${next.toUpperCase()}`);
  };

  // Channel Surfing Mode (auto-rotates channels every 14 seconds)
  useEffect(() => {
    if (!settings.channelSurfing || !settings.isPoweredOn) return;
    const interval = setInterval(() => {
      handleChannelStep(1);
    }, 14000);
    return () => clearInterval(interval);
  }, [settings.channelSurfing, settings.isPoweredOn, currentProgramIndex, availablePrograms]);

  // Fullscreen toggle
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        return;
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleChannelStep(1);
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleChannelStep(-1);
      } else if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleAdjustVolume(5);
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handleAdjustVolume(-5);
      } else if (e.key === 'm' || e.key === 'M') {
        handleToggleMute();
      } else if (e.key === 'g' || e.key === 'G') {
        setIsGuideOpen((prev) => !prev);
      } else if (e.key === 'r' || e.key === 'R') {
        setIsRadioOpen((prev) => !prev);
      } else if (e.key === 'f' || e.key === 'F') {
        handleToggleFullscreen();
      } else if (e.key === ' ') {
        e.preventDefault();
        handleTogglePower();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [availablePrograms, currentProgramIndex, settings.isPoweredOn, settings.volume, settings.isMuted]);

  return (
    <div className="min-h-screen bg-[#0d0e12] text-stone-100 flex flex-col selection:bg-amber-500/30 selection:text-amber-200">
      {/* Top Bar strictly matching the 3-zone Top Bar Contract */}
      <TopNav
        isPoweredOn={settings.isPoweredOn}
        onTogglePower={handleTogglePower}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenRadio={() => setIsRadioOpen((prev) => !prev)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpenFavorites={() => setIsGuideOpen(true)}
      />

      {/* Main Studio / Living Room Presentation Canvas */}
      <main className="flex-1 flex flex-col justify-between p-3 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
        {/* Top Information Strip & Era Quick Selector */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-stone-900/60 border border-stone-800/80 rounded-2xl px-4 py-2.5">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-mono text-xs text-stone-300 uppercase tracking-wider">
                AIRING:
              </span>
            </div>
            <div className="text-xs font-mono text-amber-300 font-bold truncate max-w-xs sm:max-w-md">
              {currentProgram ? currentProgram.title : 'ANALOG STATIC BROADCAST'} ({currentProgram?.year || '198X'})
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setShowRemote((prev) => !prev)}
              className={`px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                showRemote
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-stone-800 text-stone-400 border-stone-700'
              }`}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{showRemote ? 'Hide Remote' : 'Show Remote'}</span>
            </button>

            <button
              onClick={() => setIsRadioOpen((prev) => !prev)}
              className={`px-3 py-1 rounded-lg border transition-colors flex items-center gap-1.5 ${
                isRadioOpen
                  ? 'bg-amber-600 text-white border-amber-500'
                  : 'bg-stone-800 text-stone-300 border-stone-700'
              }`}
            >
              <Radio className="w-3.5 h-3.5 text-amber-400" />
              <span>Retro Radio</span>
            </button>
          </div>
        </div>

        {/* Central Television Showcase Grid */}
        <div
          ref={tvContainerRef}
          className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-6 my-auto"
        >
          {/* Left / Center: Interactive Retro TV Set depending on selected era */}
          <div className="flex-1 w-full flex flex-col items-center">
            {settings.era === '1950s' && (
              <Console50sCabinet
                settings={settings}
                currentProgram={currentProgram}
                isTuning={isTuning}
                osdMessage={osdMessage}
                onTogglePower={handleTogglePower}
                onChangeChannel={handleChannelStep}
                onSelectChannel={handleDirectChannelNumber}
                onAdjustVolume={handleAdjustVolume}
                onOpenGuide={() => setIsGuideOpen(true)}
                onNextChannel={() => handleChannelStep(1)}
                onTriggerStatic={() => {
                  playStaticBurst(400, 0.4);
                  setIsTuning(true);
                  setTimeout(() => setIsTuning(false), 400);
                }}
              />
            )}

            {settings.era === '1980s' && (
              <Trinitron80sCabinet
                settings={settings}
                currentProgram={currentProgram}
                isTuning={isTuning}
                osdMessage={osdMessage}
                onTogglePower={handleTogglePower}
                onChangeChannel={handleChannelStep}
                onSelectYear={handleSelectYear}
                onAdjustVolume={handleAdjustVolume}
                onOpenGuide={() => setIsGuideOpen(true)}
                onNextChannel={() => handleChannelStep(1)}
                onTriggerStatic={() => {
                  playStaticBurst(400, 0.4);
                  setIsTuning(true);
                  setTimeout(() => setIsTuning(false), 400);
                }}
              />
            )}

            {settings.era === '1970s' && (
              <Portable70sCabinet
                settings={settings}
                currentProgram={currentProgram}
                isTuning={isTuning}
                osdMessage={osdMessage}
                onTogglePower={handleTogglePower}
                onChangeChannel={handleChannelStep}
                onAdjustVolume={handleAdjustVolume}
                onOpenGuide={() => setIsGuideOpen(true)}
                onNextChannel={() => handleChannelStep(1)}
                onTriggerStatic={() => {
                  playStaticBurst(400, 0.4);
                  setIsTuning(true);
                  setTimeout(() => setIsTuning(false), 400);
                }}
              />
            )}

            {settings.era === '1990s' && (
              <Modern90sCabinet
                settings={settings}
                currentProgram={currentProgram}
                isTuning={isTuning}
                osdMessage={osdMessage}
                onTogglePower={handleTogglePower}
                onChangeChannel={handleChannelStep}
                onAdjustVolume={handleAdjustVolume}
                onOpenGuide={() => setIsGuideOpen(true)}
                onNextChannel={() => handleChannelStep(1)}
                onTriggerStatic={() => {
                  playStaticBurst(400, 0.4);
                  setIsTuning(true);
                  setTimeout(() => setIsTuning(false), 400);
                }}
              />
            )}

            {/* Current Program Synopsis Bar below TV Set */}
            {currentProgram && (
              <div className="w-full max-w-4xl mt-4 px-4 py-3 bg-stone-900/60 border border-stone-800 rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs font-mono text-stone-400">
                <div className="flex-1">
                  <div className="text-stone-200 font-bold mb-0.5">
                    {currentProgram.title} ({currentProgram.year})
                  </div>
                  <p className="text-stone-400 line-clamp-1">
                    {currentProgram.description}
                  </p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-amber-400">{currentProgram.category}</span>
                  <span className="text-stone-600">·</span>
                  <span className="text-emerald-400">{currentProgram.licenseInfo || 'Public Domain'}</span>
                </div>
              </div>
            )}
          </div>

          {/* Right Side Columns: Side Channels Panel & Remote Control */}
          <div className="w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-4 items-center lg:items-start shrink-0">
            {/* Side Channels & Era Switcher Panel */}
            <SideChannelsPanel
              activeGenres={settings.activeGenreFilters}
              onToggleGenre={(genre) => {
                setSettings((prev) => {
                  const exists = prev.activeGenreFilters.includes(genre);
                  const updated = exists
                    ? prev.activeGenreFilters.filter((g) => g !== genre)
                    : [...prev.activeGenreFilters, genre];
                  return { ...prev, activeGenreFilters: updated };
                });
              }}
              onSelectAllGenres={() => {
                setSettings((prev) => ({ ...prev, activeGenreFilters: ALL_GENRES }));
              }}
              onClearAllGenres={() => {
                setSettings((prev) => ({ ...prev, activeGenreFilters: [] }));
              }}
              currentEra={settings.era}
              onSelectEra={(era) => {
                setSettings((prev) => ({ ...prev, era }));
                triggerOsd(`CABINET: ${era.toUpperCase()}`);
              }}
              genreCounts={genreCounts}
            />

            {/* Handheld Remote Control */}
            {showRemote && (
              <RemoteControl
                settings={settings}
                onTogglePower={handleTogglePower}
                onChangeChannel={handleChannelStep}
                onSelectChannel={handleDirectChannelNumber}
                onAdjustVolume={handleAdjustVolume}
                onToggleMute={handleToggleMute}
                onToggleScanlines={() => {
                  setSettings((prev) => ({ ...prev, scanlines: !prev.scanlines }));
                  triggerOsd(settings.scanlines ? 'SCANLINES: OFF' : 'SCANLINES: ON');
                }}
                onToggleCurvature={() => {
                  setSettings((prev) => ({ ...prev, curvature: !prev.curvature }));
                  triggerOsd(settings.curvature ? 'CURVATURE: OFF' : 'CURVATURE: ON');
                }}
                onCycleFilter={handleCycleFilter}
                onToggleChannelSurfing={() => {
                  setSettings((prev) => ({ ...prev, channelSurfing: !prev.channelSurfing }));
                  triggerOsd(settings.channelSurfing ? 'SURFING: OFF' : 'AUTO SURFING: ON');
                }}
                onOpenGuide={() => setIsGuideOpen(true)}
                onToggleFullscreen={handleToggleFullscreen}
              />
            )}
          </div>
        </div>

        {/* Quiet Editorial Footer */}
        <footer className="mt-8 pt-4 border-t border-stone-900 text-center text-xs font-mono text-stone-500">
          <p>
            Classic TV Nostalgia Experience · Streams powered by public domain archives, Library of Congress, and educational broadcasts.
          </p>
        </footer>
      </main>

      {/* Retro Radio Player Drawer */}
      <RetroRadioPlayer
        isOpen={isRadioOpen}
        onClose={() => setIsRadioOpen(false)}
      />

      {/* TV Guide Modal */}
      <TVGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
        programs={programs}
        currentProgramId={currentProgram?.id || null}
        onSelectProgram={switchToProgram}
        favorites={favorites}
        onToggleFavorite={(progId) => {
          setFavorites((prev) =>
            prev.includes(progId) ? prev.filter((id) => id !== progId) : [...prev, progId]
          );
        }}
        watchHistory={watchHistory}
      />

      {/* Station Administrator Modal */}
      <AdminPanel
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        programs={programs}
        onAddProgram={(prog) => {
          setPrograms((prev) => [prog, ...prev]);
        }}
        onDeleteProgram={(id) => {
          setPrograms((prev) => prev.filter((p) => p.id !== id));
        }}
        onResetToDefaults={() => {
          setPrograms(INITIAL_PROGRAMS);
        }}
        onImportPrograms={(newPrograms) => {
          setPrograms(newPrograms);
        }}
      />
    </div>
  );
}
