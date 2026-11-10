import React, { useState } from 'react';
import { TVProgram, TVSettings } from '../../types/tv';
import { CRTScreen } from '../CRTScreen';
import { playButtonBeep, playKnobClick, playPowerSwitch, playDegauss } from '../../utils/audioEffects';
import { Magnet, Radio, Sparkles } from 'lucide-react';

interface Trinitron80sCabinetProps {
  settings: TVSettings;
  currentProgram: TVProgram | null;
  isTuning: boolean;
  osdMessage: string | null;
  onTogglePower: () => void;
  onChangeChannel: (delta: number) => void;
  onSelectYear: (year: number) => void;
  onAdjustVolume: (delta: number) => void;
  onOpenGuide: () => void;
  onNextChannel: () => void;
  onTriggerStatic: () => void;
}

const EIGHTIES_YEARS = [1980, 1981, 1982, 1983, 1984, 1985, 1986, 1987, 1988, 1989];

export const Trinitron80sCabinet: React.FC<Trinitron80sCabinetProps> = ({
  settings,
  currentProgram,
  isTuning,
  osdMessage,
  onTogglePower,
  onChangeChannel,
  onSelectYear,
  onAdjustVolume,
  onOpenGuide,
  onNextChannel,
  onTriggerStatic,
}) => {
  const [knob1Rotation, setKnob1Rotation] = useState(45);
  const [knob2Rotation, setKnob2Rotation] = useState(120);

  const handleKnobTurn = (knobNum: 1 | 2, delta: number) => {
    playKnobClick();
    if (knobNum === 1) {
      setKnob1Rotation((prev) => prev + delta * 30);
      onChangeChannel(delta);
    } else {
      setKnob2Rotation((prev) => prev + delta * 30);
      onAdjustVolume(delta * 5);
    }
  };

  const handleButtonClick = (action: () => void) => {
    playButtonBeep();
    action();
  };

  const currentYear = currentProgram?.year || 1985;

  return (
    <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center">
      {/* 1980s Silver Trinitron Chassis */}
      <div className="w-full bg-gradient-to-b from-[#8f969d] via-[#757c83] to-[#596067] rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.7),inset_0_-4px_8px_rgba(0,0,0,0.8)] border-4 border-[#3c4249]">
        {/* Top Trim with Brand & Badging */}
        <div className="flex items-center justify-between mb-3 px-2">
          <div className="flex items-center gap-3">
            <span className="font-mono-tech text-white text-base sm:text-lg tracking-widest font-bold uppercase drop-shadow">
              TRINITRON COLOR TV
            </span>
            <span className="hidden sm:inline-block px-2 py-0.5 bg-black/40 border border-white/20 rounded text-[10px] font-mono text-cyan-300">
              KV-1984 STEREO
            </span>
          </div>

          {/* Pilot LEDs */}
          <div className="flex items-center gap-3 text-[10px] font-mono">
            <div className="flex items-center gap-1.5">
              <span className="text-stone-300">POWER</span>
              <div
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  settings.isPoweredOn
                    ? 'bg-emerald-400 shadow-[0_0_8px_#34d399,0_0_12px_#34d399]'
                    : 'bg-stone-900 border border-stone-600'
                }`}
              />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="text-stone-300">STEREO</span>
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_6px_#ef4444]" />
            </div>
          </div>
        </div>

        {/* Center Main Housing: Screen (Left 9 cols) + Right Control Tower (Right 3 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* CRT Screen with 80s Bevel (9 cols) */}
          <div className="lg:col-span-9 bg-[#1b1e22] p-3 sm:p-4 rounded-2xl border-4 border-[#2b3036] shadow-[inset_0_4px_16px_rgba(0,0,0,0.95)] flex flex-col justify-center">
            {/* Dark Metallic Inner Bezel */}
            <div className="w-full aspect-[4/3] rounded-2xl p-2.5 sm:p-3 bg-gradient-to-br from-[#4b525a] via-[#33373d] to-[#1f2226] border-2 border-[#121417] shadow-[inset_0_2px_4px_rgba(255,255,255,0.2),inset_0_-4px_10px_rgba(0,0,0,0.9)] overflow-hidden">
              <div className="w-full h-full rounded-xl overflow-hidden bg-black shadow-[inset_0_0_25px_rgba(0,0,0,1)]">
                <CRTScreen
                  isPoweredOn={settings.isPoweredOn}
                  currentProgram={currentProgram}
                  filter={settings.filter}
                  curvature={settings.curvature}
                  scanlines={settings.scanlines}
                  isTuning={isTuning}
                  volume={settings.volume}
                  isMuted={settings.isMuted}
                  onNextChannel={onNextChannel}
                  osdMessage={osdMessage}
                />
              </div>
            </div>
          </div>

          {/* Right Control Tower (3 cols) - Directly styled after image_1cd60cce.png */}
          <div className="lg:col-span-3 bg-gradient-to-b from-[#b2b9c0] via-[#9da5ad] to-[#7f878f] rounded-2xl p-3 border-2 border-[#4b525a] shadow-[inset_0_2px_4px_rgba(255,255,255,0.6),0_4px_10px_rgba(0,0,0,0.4)] flex flex-col justify-between items-center text-center">
            {/* Dual Chrome Rotary Knobs */}
            <div className="flex flex-col gap-3 items-center w-full">
              {/* VHF Upper Dial */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold tracking-wider text-stone-800 uppercase mb-0.5">
                  VHF TUNER
                </span>
                <div
                  onClick={() => handleKnobTurn(1, 1)}
                  className="w-16 h-16 rounded-full bg-gradient-to-br from-[#f0f3f6] via-[#bcc5ce] to-[#606972] p-1 shadow-[0_4px_8px_rgba(0,0,0,0.6),inset_0_2px_4px_rgba(255,255,255,0.9)] cursor-pointer select-none border border-stone-500"
                  title="Click to click forward channel"
                >
                  <div
                    className="w-full h-full rounded-full bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center relative transition-transform duration-150"
                    style={{ transform: `rotate(${knob1Rotation}deg)` }}
                  >
                    <div className="absolute top-1 w-1.5 h-3 bg-red-600 rounded-sm" />
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-stone-700 to-stone-900 border border-stone-400 flex items-center justify-center text-white text-[10px] font-mono font-bold">
                      {currentProgram?.channelNumber || 4}
                    </div>
                  </div>
                </div>
              </div>

              {/* UHF / Volume Lower Dial */}
              <div className="flex flex-col items-center">
                <span className="text-[9px] font-mono font-bold tracking-wider text-stone-800 uppercase mb-0.5">
                  UHF / AUDIO
                </span>
                <div
                  onClick={() => handleKnobTurn(2, 1)}
                  className="w-14 h-14 rounded-full bg-gradient-to-br from-[#f0f3f6] via-[#bcc5ce] to-[#606972] p-1 shadow-[0_3px_6px_rgba(0,0,0,0.6)] cursor-pointer select-none border border-stone-500"
                  title="Click to adjust audio"
                >
                  <div
                    className="w-full h-full rounded-full bg-gradient-to-br from-stone-300 to-stone-500 flex items-center justify-center relative transition-transform duration-150"
                    style={{ transform: `rotate(${knob2Rotation}deg)` }}
                  >
                    <div className="absolute top-1 w-1 h-2 bg-stone-900 rounded-sm" />
                    <div className="w-6 h-6 rounded-full bg-stone-800 border border-stone-400" />
                  </div>
                </div>
              </div>
            </div>

            {/* Retro 80s Logo Badge */}
            <div className="my-2 py-1 px-3 bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-400 rounded-lg shadow transform -rotate-1 border border-white/40">
              <span className="font-crt text-yellow-200 text-lg sm:text-xl font-bold tracking-widest drop-shadow-[0_2px_3px_rgba(0,0,0,0.9)]">
                ★ 80s TV ★
              </span>
            </div>

            {/* Authentic Vertical Tactile Push Buttons (As seen in image_1cd60cce.png) */}
            <div className="w-full flex flex-col gap-1.5">
              <button
                onClick={() => {
                  playPowerSwitch(!settings.isPoweredOn);
                  onTogglePower();
                }}
                className={`w-full py-1.5 rounded-md font-mono text-xs font-bold uppercase tracking-wider border transition-all active:scale-95 shadow-sm ${
                  settings.isPoweredOn
                    ? 'bg-gradient-to-b from-emerald-500 to-emerald-700 text-white border-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]'
                    : 'bg-gradient-to-b from-stone-300 to-stone-400 text-stone-800 border-stone-400'
                }`}
              >
                POWER
              </button>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleButtonClick(() => onChangeChannel(1))}
                  className="py-1 bg-gradient-to-b from-stone-200 to-stone-400 hover:from-white hover:to-stone-300 text-stone-900 border border-stone-400 rounded text-[11px] font-mono font-bold shadow-sm active:translate-y-0.5"
                >
                  CH ▲
                </button>
                <button
                  onClick={() => handleButtonClick(() => onChangeChannel(-1))}
                  className="py-1 bg-gradient-to-b from-stone-200 to-stone-400 hover:from-white hover:to-stone-300 text-stone-900 border border-stone-400 rounded text-[11px] font-mono font-bold shadow-sm active:translate-y-0.5"
                >
                  CH ▼
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                <button
                  onClick={() => handleButtonClick(() => onAdjustVolume(10))}
                  className="py-1 bg-gradient-to-b from-stone-200 to-stone-400 hover:from-white hover:to-stone-300 text-stone-900 border border-stone-400 rounded text-[11px] font-mono font-bold shadow-sm active:translate-y-0.5"
                >
                  VOL +
                </button>
                <button
                  onClick={() => handleButtonClick(() => onAdjustVolume(-10))}
                  className="py-1 bg-gradient-to-b from-stone-200 to-stone-400 hover:from-white hover:to-stone-300 text-stone-900 border border-stone-400 rounded text-[11px] font-mono font-bold shadow-sm active:translate-y-0.5"
                >
                  VOL -
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5 pt-0.5">
                <button
                  onClick={() => handleButtonClick(onOpenGuide)}
                  className="py-1 bg-gradient-to-b from-amber-200 to-amber-400 hover:from-amber-100 text-amber-950 border border-amber-500 rounded text-[11px] font-mono font-bold shadow-sm active:translate-y-0.5"
                >
                  MENU
                </button>
                <button
                  onClick={() => handleButtonClick(() => playDegauss())}
                  className="py-1 bg-gradient-to-b from-stone-700 to-stone-900 hover:from-stone-600 text-cyan-300 border border-stone-600 rounded text-[10px] font-mono font-bold shadow-sm active:translate-y-0.5 flex items-center justify-center gap-0.5"
                  title="CRT Degauss Coil"
                >
                  <Magnet className="w-3 h-3 text-cyan-400" /> DEGAUSS
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Console: Decade Year Timeline (Modeled directly after image_1cd60cce.png) */}
        <div className="mt-4 bg-[#231710] rounded-xl p-3 border-2 border-[#452e20] shadow-[inset_0_2px_8px_rgba(0,0,0,0.9)]">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 px-2 pb-1.5 border-b border-amber-900/40">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-amber-400" /> 1980s BROADCAST ARCHIVE TIMELINE
            </span>
            <span className="text-[11px] font-crt text-emerald-400 tracking-wider">
              NOW AIRING: {currentProgram?.title || 'RETRO BROADCAST'} ({currentProgram?.year || '198X'})
            </span>
          </div>

          {/* Interactive Year Selector Bar */}
          <div className="flex items-center justify-between gap-1 overflow-x-auto pt-2 pb-1 scrollbar-none">
            {EIGHTIES_YEARS.map((yr) => {
              const isActive = currentYear === yr;
              return (
                <button
                  key={yr}
                  onClick={() => {
                    playButtonBeep();
                    onSelectYear(yr);
                  }}
                  className={`px-2 py-1 rounded font-crt text-lg sm:text-xl tracking-wider transition-all duration-200 active:scale-95 ${
                    isActive
                      ? 'bg-emerald-500 text-black font-bold shadow-[0_0_12px_#34d399,0_0_20px_#10b981] scale-105'
                      : 'bg-stone-900/80 hover:bg-stone-800 text-amber-400/80 hover:text-amber-200 border border-stone-800'
                  }`}
                  title={`Jump to broadcast from year ${yr}`}
                >
                  {yr}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
