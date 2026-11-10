import React, { useState } from 'react';
import { TVProgram, TVSettings } from '../../types/tv';
import { CRTScreen } from '../CRTScreen';
import { playKnobClick, playPowerSwitch } from '../../utils/audioEffects';
import { Tv, Radio, Sparkles } from 'lucide-react';

interface Portable70sCabinetProps {
  settings: TVSettings;
  currentProgram: TVProgram | null;
  isTuning: boolean;
  osdMessage: string | null;
  onTogglePower: () => void;
  onChangeChannel: (delta: number) => void;
  onAdjustVolume: (delta: number) => void;
  onOpenGuide: () => void;
  onNextChannel: () => void;
  onTriggerStatic: () => void;
}

export const Portable70sCabinet: React.FC<Portable70sCabinetProps> = ({
  settings,
  currentProgram,
  isTuning,
  osdMessage,
  onTogglePower,
  onChangeChannel,
  onAdjustVolume,
  onOpenGuide,
  onNextChannel,
  onTriggerStatic,
}) => {
  const [knobRotation, setKnobRotation] = useState(0);

  const handleKnob = (delta: number) => {
    playKnobClick();
    setKnobRotation((prev) => prev + delta * 30);
    onChangeChannel(delta);
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center">
      {/* 70s Portable Handle on Top */}
      <div className="w-36 h-6 bg-gradient-to-r from-stone-700 via-stone-500 to-stone-700 rounded-t-xl border-t-2 border-x-2 border-stone-800 shadow -mb-1 flex items-center justify-center">
        <div className="w-24 h-2 bg-stone-900 rounded-full" />
      </div>

      {/* Main 1970s Woodgrain & Burnt Amber Portable TV */}
      <div className="w-full bg-[#402010] rounded-2xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.2)] border-4 border-[#281308]">
        {/* Top Trim */}
        <div className="flex items-center justify-between mb-3 px-2 border-b border-amber-950 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-vintage text-amber-200 text-base font-bold tracking-widest uppercase">
              ZENITH CHROMATRON
            </span>
            <span className="text-[10px] text-amber-300/60 font-mono hidden sm:inline">
              PORTABLE COLOR SOLID STATE
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-amber-300">COLOR MATRIX</span>
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                settings.isPoweredOn
                  ? 'bg-amber-500 shadow-[0_0_8px_#f59e0b]'
                  : 'bg-stone-800'
              }`}
            />
          </div>
        </div>

        {/* Center: Screen + Right Dial Panel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          {/* CRT Screen Frame */}
          <div className="lg:col-span-9 bg-[#1a0e07] p-3 sm:p-4 rounded-2xl border-4 border-[#2d180c] shadow-inner flex flex-col justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl p-2.5 sm:p-3 bg-gradient-to-br from-[#c97a3e] via-[#8f4a1c] to-[#4d240b] border-2 border-amber-950 shadow-inner overflow-hidden">
              <div className="w-full h-full rounded-xl overflow-hidden bg-black">
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

          {/* Right Controls Panel */}
          <div className="lg:col-span-3 bg-gradient-to-b from-[#2a1409] via-[#1f0e06] to-[#140803] rounded-xl p-3 border-2 border-[#572b13] flex flex-col justify-between items-center text-center">
            {/* Power Knob */}
            <div className="flex flex-col items-center w-full pb-2 border-b border-amber-950">
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mb-1">
                PULL ON / VOL
              </span>
              <button
                onClick={() => {
                  playPowerSwitch(!settings.isPoweredOn);
                  onTogglePower();
                }}
                className={`w-12 h-12 rounded-full border-2 transition-all flex items-center justify-center font-mono text-[10px] font-bold ${
                  settings.isPoweredOn
                    ? 'bg-amber-600 border-amber-300 text-white shadow-[0_0_10px_#d97706]'
                    : 'bg-stone-900 border-stone-700 text-stone-400'
                }`}
              >
                {settings.isPoweredOn ? 'ON' : 'OFF'}
              </button>
            </div>

            {/* Big VHF Clicker Dial */}
            <div className="flex flex-col items-center py-2">
              <span className="text-[9px] font-mono text-amber-400 uppercase tracking-widest mb-1">
                VHF SELECTOR
              </span>
              <div
                onClick={() => handleKnob(1)}
                className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 via-amber-700 to-amber-950 p-1 border-2 border-amber-900 shadow-md cursor-pointer select-none"
                style={{ transform: `rotate(${knobRotation}deg)` }}
                title="Click to click forward channel"
              >
                <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center relative">
                  <div className="absolute top-1 w-2 h-3 bg-amber-400 rounded-sm" />
                  <span className="text-amber-300 font-mono font-bold text-xs">
                    CH {currentProgram?.channelNumber || 5}
                  </span>
                </div>
              </div>
            </div>

            {/* Volume & Guide */}
            <div className="w-full pt-2 flex flex-col gap-1.5 border-t border-amber-950">
              <div className="flex items-center justify-between text-[11px] font-mono text-amber-300 px-1">
                <span>VOL {settings.volume}%</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => onAdjustVolume(-10)}
                    className="w-6 h-6 rounded bg-stone-900 border border-amber-900 text-amber-400"
                  >
                    -
                  </button>
                  <button
                    onClick={() => onAdjustVolume(10)}
                    className="w-6 h-6 rounded bg-stone-900 border border-amber-900 text-amber-400"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={onOpenGuide}
                className="w-full py-1.5 bg-amber-900/60 hover:bg-amber-800 border border-amber-700/60 rounded text-amber-200 text-xs font-mono uppercase flex items-center justify-center gap-1.5"
              >
                <Tv className="w-3 h-3" /> TV Guide
              </button>
              <button
                onClick={onTriggerStatic}
                className="w-full py-1 bg-stone-900 hover:bg-stone-800 border border-stone-800 rounded text-stone-400 text-[11px] font-mono flex items-center justify-center gap-1"
              >
                <Radio className="w-3 h-3" /> Static
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Speaker Bar */}
        <div className="mt-4 bg-[#281308] rounded-xl p-2.5 border border-[#4d240b] flex items-center justify-between px-6 text-amber-400/70 text-xs font-mono">
          <span>SUPER-CHROMATIC COLOR TUBE</span>
          <span className="flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" /> FULL FREQUENCY ACOUSTIC GRILLE
          </span>
        </div>
      </div>
    </div>
  );
};
