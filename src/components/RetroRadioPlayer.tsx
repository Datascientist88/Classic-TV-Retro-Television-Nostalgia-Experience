import React, { useState, useRef, useEffect } from 'react';
import { RadioStation } from '../types/tv';
import { RADIO_STATIONS } from '../data/radioStations';
import { playKnobClick, playButtonBeep } from '../utils/audioEffects';
import {
  Play,
  Pause,
  SkipForward,
  SkipBack,
  Volume2,
  VolumeX,
  Radio,
  Music,
  X,
  Disc,
} from 'lucide-react';

interface RetroRadioPlayerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const RetroRadioPlayer: React.FC<RetroRadioPlayerProps> = ({ isOpen, onClose }) => {
  const [currentStationIndex, setCurrentStationIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [isMuted, setIsMuted] = useState(false);
  const [vuNeedle, setVuNeedle] = useState(30);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const station = RADIO_STATIONS[currentStationIndex];

  // VU meter animation when playing
  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        // Organic bounce between 35% and 85%
        const rand = 40 + Math.random() * 45;
        setVuNeedle(rand);
      }, 140);
    } else {
      setVuNeedle(10);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Audio stream playback
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = isMuted ? 0 : volume / 100;
  }, [volume, isMuted]);

  const togglePlay = () => {
    playButtonBeep();
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        // If external audio source blocked, simulate playing state
        setIsPlaying(true);
      });
    }
  };

  const handleNext = () => {
    playKnobClick();
    setCurrentStationIndex((prev) => (prev + 1) % RADIO_STATIONS.length);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  };

  const handlePrev = () => {
    playKnobClick();
    setCurrentStationIndex((prev) => (prev - 1 + RADIO_STATIONS.length) % RADIO_STATIONS.length);
    setIsPlaying(true);
    setTimeout(() => {
      audioRef.current?.play().catch(() => {});
    }, 100);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-96 max-w-[calc(100vw-2rem)] bg-[#251b14] border-2 border-amber-900/80 rounded-2xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.9)] text-amber-100 select-none">
      {/* Hidden Audio Element */}
      <audio
        ref={audioRef}
        src={station.streamUrl}
        loop
        onEnded={handleNext}
      />

      {/* Header with Vintage Brass Trim */}
      <div className="flex items-center justify-between pb-2 border-b border-amber-950 mb-3">
        <div className="flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400" />
          <span className="font-vintage text-amber-300 font-bold tracking-widest text-xs uppercase">
            RETRO TRANSISTOR RADIO & HI-FI
          </span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-stone-800 text-stone-400 hover:text-stone-100 transition-colors"
          title="Close player (audio continues in background)"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Center: Analog Tuning Frequency Dial + VU Meter */}
      <div className="bg-[#120d09] rounded-xl p-3 border border-amber-950/80 shadow-inner mb-3">
        {/* Analog VU Meter */}
        <div className="flex items-center justify-between mb-2 px-1">
          <span className="text-[9px] font-mono uppercase text-amber-500/80 tracking-wider">
            ANALOG VU LEVEL
          </span>
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono text-stone-400">AM / FM STEREO</span>
            <div
              className={`w-2 h-2 rounded-full ${
                isPlaying
                  ? 'bg-red-500 shadow-[0_0_6px_#ef4444]'
                  : 'bg-stone-800'
              }`}
            />
          </div>
        </div>

        {/* Vintage Needle Meter Display */}
        <div className="relative w-full h-12 bg-gradient-to-b from-[#2e2016] via-[#1c130d] to-[#0c0805] rounded-lg border border-amber-900/60 p-2 flex items-end justify-center overflow-hidden">
          {/* Tick marks */}
          <div className="absolute top-1 inset-x-4 flex justify-between text-[8px] font-mono text-amber-600/70 select-none">
            <span>-20</span>
            <span>-10</span>
            <span>-5</span>
            <span>0</span>
            <span className="text-red-400">+3 dB</span>
          </div>

          {/* Bouncing Needle */}
          <div
            className="absolute bottom-0 w-0.5 bg-gradient-to-t from-amber-600 via-amber-300 to-red-500 rounded-full origin-bottom transition-transform duration-150 ease-out"
            style={{
              height: '38px',
              left: '50%',
              transform: `rotate(${((vuNeedle - 50) / 50) * 45}deg)`,
            }}
          />
        </div>

        {/* Station Name & Frequency */}
        <div className="mt-2 flex items-center justify-between">
          <div>
            <div className="font-crt text-xl text-amber-300 tracking-wider leading-tight">
              {station.name}
            </div>
            <div className="text-[11px] font-mono text-amber-400/80">
              {station.genre} · {station.era}
            </div>
          </div>
          <div className="px-2 py-1 bg-amber-950/60 border border-amber-800/60 rounded text-amber-300 font-crt text-lg tracking-widest">
            {station.frequency}
          </div>
        </div>
      </div>

      {/* Track List Preview */}
      {station.trackList && (
        <div className="mb-3 px-2 py-1.5 bg-black/40 rounded-lg border border-amber-950 text-[11px] font-mono text-stone-400 flex items-center gap-2">
          <Disc className={`w-3.5 h-3.5 text-amber-400 ${isPlaying ? 'animate-spin' : ''}`} />
          <span className="truncate">
            Now Airing: {station.trackList[0]}
          </span>
        </div>
      )}

      {/* Playback Controls & Volume */}
      <div className="flex items-center justify-between gap-3">
        {/* Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handlePrev}
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-950 active:scale-95"
            title="Previous Station"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            onClick={togglePlay}
            className={`px-4 py-2 rounded-xl flex items-center gap-1.5 font-mono text-xs font-bold uppercase transition-all shadow-md active:scale-95 ${
              isPlaying
                ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-[0_0_12px_rgba(217,119,6,0.5)]'
                : 'bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-900/60'
            }`}
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4" /> PAUSE
              </>
            ) : (
              <>
                <Play className="w-4 h-4" /> TUNE IN
              </>
            )}
          </button>

          <button
            onClick={handleNext}
            className="p-2 rounded-lg bg-stone-900 hover:bg-stone-800 text-amber-300 border border-amber-950 active:scale-95"
            title="Next Station"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        {/* Volume Slider */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="text-stone-400 hover:text-amber-300"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(Number(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-16 accent-amber-500 h-1.5 bg-stone-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
};
