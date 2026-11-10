import React, { useState } from 'react';
import { ScreenFilter, TVSettings } from '../types/tv';
import { playButtonBeep, playPowerSwitch, playKnobClick } from '../utils/audioEffects';
import {
  Power,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Tv,
  Maximize2,
  Radio,
  Shuffle,
  Sun,
  Grid,
} from 'lucide-react';

interface RemoteControlProps {
  settings: TVSettings;
  onTogglePower: () => void;
  onChangeChannel: (delta: number) => void;
  onSelectChannel: (channel: number) => void;
  onAdjustVolume: (delta: number) => void;
  onToggleMute: () => void;
  onToggleScanlines: () => void;
  onToggleCurvature: () => void;
  onCycleFilter: () => void;
  onToggleChannelSurfing: () => void;
  onOpenGuide: () => void;
  onToggleFullscreen: () => void;
}

export const RemoteControl: React.FC<RemoteControlProps> = ({
  settings,
  onTogglePower,
  onChangeChannel,
  onSelectChannel,
  onAdjustVolume,
  onToggleMute,
  onToggleScanlines,
  onToggleCurvature,
  onCycleFilter,
  onToggleChannelSurfing,
  onOpenGuide,
  onToggleFullscreen,
}) => {
  const [digitBuffer, setDigitBuffer] = useState<string>('');

  const handleDigit = (digit: number) => {
    playButtonBeep();
    const newBuf = digitBuffer + digit.toString();
    setDigitBuffer(newBuf);

    if (newBuf.length >= 2) {
      const channel = parseInt(newBuf, 10);
      onSelectChannel(channel);
      setDigitBuffer('');
    } else {
      // If 1 digit entered, auto tune after 1.2s or wait for second digit
      setTimeout(() => {
        setDigitBuffer((prev) => {
          if (prev.length === 1) {
            onSelectChannel(parseInt(prev, 10));
            return '';
          }
          return prev;
        });
      }, 1200);
    }
  };

  const getFilterLabel = (f: ScreenFilter) => {
    switch (f) {
      case 'bw':
        return 'B&W 1950s';
      case 'amber':
        return 'AMBER CRT';
      case 'green':
        return 'PHOSPHOR';
      case 'color':
      default:
        return 'RGB COLOR';
    }
  };

  return (
    <div className="w-64 bg-gradient-to-b from-[#2d2f36] via-[#222429] to-[#17181c] rounded-3xl p-4 shadow-[0_15px_35px_rgba(0,0,0,0.85),inset_0_1px_2px_rgba(255,255,255,0.2)] border-2 border-[#3c3f47] text-stone-300 select-none">
      {/* Remote Top Brand & IR Transmitter Emitter */}
      <div className="flex flex-col items-center mb-3">
        {/* IR LED */}
        <div className="w-5 h-2 bg-gradient-to-r from-red-900 via-red-600 to-red-900 rounded-full mb-1.5 shadow-[0_0_6px_#dc2626]" />
        <span className="font-mono text-[10px] tracking-widest uppercase text-stone-400 font-bold">
          COMMAND CENTER · INFRARED
        </span>
      </div>

      {/* Top Row: Power & Mute */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <button
          onClick={() => {
            playPowerSwitch(!settings.isPoweredOn);
            onTogglePower();
          }}
          className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-[9px] font-bold transition-all shadow-md active:scale-90 ${
            settings.isPoweredOn
              ? 'bg-red-600 hover:bg-red-500 text-white shadow-[0_0_12px_rgba(239,68,68,0.6)]'
              : 'bg-stone-800 hover:bg-stone-700 text-red-400 border border-red-900/40'
          }`}
          title="TV Power"
        >
          <Power className="w-4 h-4 mb-0.5" />
          <span>PWR</span>
        </button>

        {/* LED Digital Display */}
        <div className="flex-1 bg-black/80 border border-stone-700/80 rounded-lg py-1.5 px-2 text-center shadow-inner">
          <div className="text-[9px] font-mono text-stone-400 uppercase">CHANNEL</div>
          <div className="font-crt text-emerald-400 text-xl tracking-wider leading-none">
            {digitBuffer ? `CH ${digitBuffer}_` : `CH ${settings.currentChannelNumber || 2}`}
          </div>
        </div>

        <button
          onClick={() => {
            playButtonBeep();
            onToggleMute();
          }}
          className={`w-12 h-12 rounded-full flex flex-col items-center justify-center font-mono text-[9px] transition-all shadow-md active:scale-90 ${
            settings.isMuted
              ? 'bg-amber-600 text-white shadow-[0_0_10px_#f59e0b]'
              : 'bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700'
          }`}
          title="Mute Volume"
        >
          {settings.isMuted ? <VolumeX className="w-4 h-4 mb-0.5" /> : <Volume2 className="w-4 h-4 mb-0.5" />}
          <span>{settings.isMuted ? 'UNMUTE' : 'MUTE'}</span>
        </button>
      </div>

      {/* Navigation Ring / Directional Controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        <div className="flex flex-col gap-1.5 bg-stone-900/60 p-2 rounded-xl border border-stone-800 text-center">
          <span className="text-[9px] font-mono uppercase text-stone-400">CHANNEL</span>
          <button
            onClick={() => {
              playButtonBeep();
              onChangeChannel(1);
            }}
            className="py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center justify-center font-mono text-xs active:translate-y-0.5"
          >
            <ChevronUp className="w-4 h-4 mr-1 text-emerald-400" /> CH +
          </button>
          <button
            onClick={() => {
              playButtonBeep();
              onChangeChannel(-1);
            }}
            className="py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center justify-center font-mono text-xs active:translate-y-0.5"
          >
            <ChevronDown className="w-4 h-4 mr-1 text-emerald-400" /> CH -
          </button>
        </div>

        <div className="flex flex-col gap-1.5 bg-stone-900/60 p-2 rounded-xl border border-stone-800 text-center">
          <span className="text-[9px] font-mono uppercase text-stone-400">VOLUME</span>
          <button
            onClick={() => {
              playButtonBeep();
              onAdjustVolume(10);
            }}
            className="py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center justify-center font-mono text-xs active:translate-y-0.5"
          >
            VOL +
          </button>
          <button
            onClick={() => {
              playButtonBeep();
              onAdjustVolume(-10);
            }}
            className="py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded flex items-center justify-center font-mono text-xs active:translate-y-0.5"
          >
            VOL -
          </button>
        </div>
      </div>

      {/* Numeric Keypad (0-9) */}
      <div className="grid grid-cols-3 gap-1.5 mb-4 bg-stone-900/80 p-2.5 rounded-2xl border border-stone-800 shadow-inner">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button
            key={num}
            onClick={() => handleDigit(num)}
            className="h-9 rounded-lg bg-gradient-to-b from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-stone-200 font-mono text-sm font-bold border border-stone-700 shadow-sm active:scale-95 transition-transform"
          >
            {num}
          </button>
        ))}
        <button
          onClick={() => {
            playButtonBeep();
            onOpenGuide();
          }}
          className="h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-amber-400 font-mono text-[10px] font-bold border border-amber-900/50 flex items-center justify-center"
          title="TV Guide"
        >
          <Tv className="w-3.5 h-3.5" />
        </button>
        <button
          onClick={() => handleDigit(0)}
          className="h-9 rounded-lg bg-gradient-to-b from-stone-800 to-stone-900 hover:from-stone-700 hover:to-stone-800 text-stone-200 font-mono text-sm font-bold border border-stone-700 shadow-sm active:scale-95 transition-transform"
        >
          0
        </button>
        <button
          onClick={() => {
            playButtonBeep();
            onToggleChannelSurfing();
          }}
          className={`h-9 rounded-lg font-mono text-[9px] font-bold border flex items-center justify-center gap-1 transition-all ${
            settings.channelSurfing
              ? 'bg-emerald-600 text-white border-emerald-400 shadow-[0_0_8px_#10b981]'
              : 'bg-stone-800 hover:bg-stone-700 text-emerald-400 border-stone-700'
          }`}
          title="Automatic Channel Surfing"
        >
          <Shuffle className="w-3 h-3" />
        </button>
      </div>

      {/* CRT Display & Effects Toggles */}
      <div className="flex flex-col gap-1.5 pt-2 border-t border-stone-800">
        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => {
              playButtonBeep();
              onCycleFilter();
            }}
            className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-[10px] font-mono text-amber-300 flex items-center justify-center gap-1"
            title="Cycle CRT Filter"
          >
            <Sun className="w-3 h-3 text-amber-400" />
            <span>{getFilterLabel(settings.filter)}</span>
          </button>

          <button
            onClick={() => {
              playButtonBeep();
              onToggleScanlines();
            }}
            className={`py-1.5 px-2 rounded text-[10px] font-mono border flex items-center justify-center gap-1 ${
              settings.scanlines
                ? 'bg-cyan-900/60 text-cyan-200 border-cyan-600'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title="Toggle CRT Scanlines"
          >
            <Grid className="w-3 h-3 text-cyan-400" />
            <span>SCANLINES</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-1.5">
          <button
            onClick={() => {
              playButtonBeep();
              onToggleCurvature();
            }}
            className={`py-1.5 px-2 rounded text-[10px] font-mono border flex items-center justify-center gap-1 ${
              settings.curvature
                ? 'bg-purple-900/60 text-purple-200 border-purple-600'
                : 'bg-stone-800 text-stone-400 border-stone-700'
            }`}
            title="Toggle Tube Curvature"
          >
            <Radio className="w-3 h-3 text-purple-400" />
            <span>CURVATURE</span>
          </button>

          <button
            onClick={() => {
              playButtonBeep();
              onToggleFullscreen();
            }}
            className="py-1.5 px-2 bg-stone-800 hover:bg-stone-700 border border-stone-700 rounded text-[10px] font-mono text-stone-200 flex items-center justify-center gap-1"
            title="Toggle Fullscreen"
          >
            <Maximize2 className="w-3 h-3 text-stone-300" />
            <span>FULLSCREEN</span>
          </button>
        </div>
      </div>
    </div>
  );
};
