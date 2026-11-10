import React, { useState } from 'react';
import { TVProgram, TVSettings } from '../../types/tv';
import { CRTScreen } from '../CRTScreen';
import { playKnobClick, playPowerSwitch, playStaticBurst } from '../../utils/audioEffects';
import { Radio, Sparkles, Tv } from 'lucide-react';

interface Console50sCabinetProps {
  settings: TVSettings;
  currentProgram: TVProgram | null;
  isTuning: boolean;
  osdMessage: string | null;
  onTogglePower: () => void;
  onChangeChannel: (delta: number) => void;
  onSelectChannel: (channelNumber: number) => void;
  onAdjustVolume: (delta: number) => void;
  onOpenGuide: () => void;
  onNextChannel: () => void;
  onTriggerStatic: () => void;
}

export const Console50sCabinet: React.FC<Console50sCabinetProps> = ({
  settings,
  currentProgram,
  isTuning,
  osdMessage,
  onTogglePower,
  onChangeChannel,
  onSelectChannel,
  onAdjustVolume,
  onOpenGuide,
  onNextChannel,
  onTriggerStatic,
}) => {
  const [antennaAngle, setAntennaAngle] = useState(38);
  const [knobRotation, setKnobRotation] = useState(0);

  const handleChannelKnob = (delta: number) => {
    playKnobClick();
    setKnobRotation((prev) => prev + delta * 30);
    onChangeChannel(delta);
  };

  const handleAntennaClick = () => {
    playStaticBurst(200, 0.2);
    setAntennaAngle((prev) => (prev === 38 ? 55 : prev === 55 ? 25 : 38));
  };

  return (
    <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center">
      {/* Telescoping Rabbit Ears Antenna on Top */}
      <div
        onClick={handleAntennaClick}
        title="Click to adjust antenna reception"
        className="relative z-10 -mb-2 cursor-pointer flex flex-col items-center group"
      >
        <div className="relative w-48 h-24 sm:h-32 flex justify-center">
          {/* Left Antenna Rod */}
          <div
            className="absolute bottom-2 origin-bottom w-1.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 rounded-t shadow-lg transition-transform duration-500 ease-out"
            style={{
              height: '100%',
              transform: `rotate(-${antennaAngle}deg)`,
            }}
          >
            <div className="w-2.5 h-2.5 -top-1.5 -left-0.5 absolute rounded-full bg-amber-400 border border-stone-600 shadow" />
          </div>

          {/* Right Antenna Rod */}
          <div
            className="absolute bottom-2 origin-bottom w-1.5 bg-gradient-to-r from-stone-400 via-stone-200 to-stone-500 rounded-t shadow-lg transition-transform duration-500 ease-out"
            style={{
              height: '100%',
              transform: `rotate(${antennaAngle}deg)`,
            }}
          >
            <div className="w-2.5 h-2.5 -top-1.5 -left-0.5 absolute rounded-full bg-amber-400 border border-stone-600 shadow" />
          </div>

          {/* Antenna Ball Swivel Base */}
          <div className="absolute bottom-0 w-8 h-8 rounded-full bg-gradient-to-b from-stone-700 via-stone-900 to-black border-2 border-stone-600 shadow-md flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-amber-600/60" />
          </div>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-amber-200/80 font-mono tracking-wider -mt-1 bg-stone-900/90 px-2 py-0.5 rounded border border-amber-900/40">
          CLICK TO ADJUST ANTENNA
        </div>
      </div>

      {/* Main Wood Console Cabinet */}
      <div className="w-full bg-[#3d2314] rounded-2xl p-4 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.9),inset_0_2px_4px_rgba(255,255,255,0.15),inset_0_-4px_8px_rgba(0,0,0,0.8)] border-4 border-[#24140b]">
        {/* Top Cabinet Header with Woodgrain & Golden Inlay */}
        <div className="flex items-center justify-between mb-4 px-2 border-b border-amber-900/40 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-vintage text-amber-300 text-sm sm:text-base tracking-widest uppercase font-bold drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
              RCA Victor
            </span>
            <span className="text-[11px] text-amber-400/60 font-serif italic hidden sm:inline">
              Master Deluxe Hi-Fi CRT
            </span>
          </div>

          {/* Power Status Pilot Light */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-200/60">
              VACUUM TUBE
            </span>
            <div
              className={`w-3 h-3 rounded-full border border-stone-700 transition-all duration-500 ${
                settings.isPoweredOn
                  ? 'bg-amber-400 shadow-[0_0_10px_#f59e0b,0_0_15px_#f59e0b]'
                  : 'bg-stone-800'
              }`}
            />
          </div>
        </div>

        {/* Center Section: CRT Screen + Right Dial Control Strip */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-stretch">
          {/* CRT Screen Outer Bezel (8 cols) */}
          <div className="lg:col-span-9 bg-[#1c120c] p-3 sm:p-5 rounded-2xl border-4 border-[#52331f] shadow-[inset_0_4px_12px_rgba(0,0,0,0.9),0_4px_12px_rgba(0,0,0,0.7)] flex flex-col justify-center">
            {/* Inner Champagne Gold Curved Tube Bezel */}
            <div className="w-full aspect-[4/3] rounded-[2.5rem] p-3 sm:p-4 bg-gradient-to-br from-[#c8ad88] via-[#a68a62] to-[#73593a] border-4 border-[#574026] shadow-[inset_0_4px_8px_rgba(255,255,255,0.4),inset_0_-6px_14px_rgba(0,0,0,0.8)] flex items-center justify-center overflow-hidden">
              {/* Glass Tube Container */}
              <div className="w-full h-full rounded-[2rem] overflow-hidden bg-black shadow-[inset_0_0_20px_rgba(0,0,0,1)]">
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

          {/* Right Brass & Bakelite Controls Panel (3 cols) */}
          <div className="lg:col-span-3 bg-gradient-to-b from-[#2b180d] via-[#211209] to-[#180d07] rounded-xl p-3 sm:p-4 border-2 border-[#52331f] shadow-inner flex flex-col justify-between items-center text-center">
            {/* Top Power Toggle Lever */}
            <div className="w-full flex flex-col items-center pb-3 border-b border-amber-900/40">
              <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase mb-1">
                MASTER POWER
              </span>
              <button
                onClick={() => {
                  playPowerSwitch(!settings.isPoweredOn);
                  onTogglePower();
                }}
                className={`relative w-14 h-8 rounded-full p-1 border-2 transition-colors duration-300 ${
                  settings.isPoweredOn
                    ? 'bg-amber-800 border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                    : 'bg-stone-900 border-stone-600'
                }`}
                title="Power TV On / Off"
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-b from-amber-200 to-amber-500 border border-amber-700 shadow-md transition-transform duration-300 ${
                    settings.isPoweredOn ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* VHF Channel Rotary Knob */}
            <div className="flex flex-col items-center py-3">
              <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase mb-1">
                VHF CHANNEL
              </span>
              <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-amber-200 via-amber-600 to-amber-900 p-1.5 shadow-[0_4px_10px_rgba(0,0,0,0.8),inset_0_2px_4px_rgba(255,255,255,0.4)] border-2 border-amber-800">
                {/* Outer Number Ring */}
                <div
                  className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center relative cursor-pointer select-none transition-transform duration-200"
                  style={{ transform: `rotate(${knobRotation}deg)` }}
                  onClick={() => handleChannelKnob(1)}
                  title="Click to click forward channel"
                >
                  {/* Brass Pointer Notch */}
                  <div className="absolute top-1 w-1.5 h-3 bg-amber-400 rounded-sm shadow-[0_0_6px_#f59e0b]" />
                  {/* Inner Ribbed Bakelite Grip */}
                  <div className="w-14 h-14 rounded-full bg-gradient-to-br from-stone-800 to-stone-950 border border-amber-900 flex items-center justify-center shadow-inner">
                    <span className="text-amber-300 font-mono font-bold text-sm">
                      CH {currentProgram?.channelNumber || 2}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-2">
                <button
                  onClick={() => handleChannelKnob(-1)}
                  className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-900/60 rounded text-[10px] font-mono active:scale-95 transition-transform"
                >
                  ◀ REV
                </button>
                <button
                  onClick={() => handleChannelKnob(1)}
                  className="px-2 py-0.5 bg-stone-800 hover:bg-stone-700 text-amber-300 border border-amber-900/60 rounded text-[10px] font-mono active:scale-95 transition-transform"
                >
                  FWD ▶
                </button>
              </div>
            </div>

            {/* Volume Potentiometer Knob */}
            <div className="flex flex-col items-center py-2 border-t border-amber-900/40 w-full">
              <span className="text-[10px] font-mono tracking-widest text-amber-300 uppercase mb-1">
                AUDIO VOLUME
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => onAdjustVolume(-10)}
                  className="w-7 h-7 rounded-full bg-stone-900 border border-stone-600 text-amber-300 flex items-center justify-center text-xs active:scale-90"
                  title="Lower volume"
                >
                  -
                </button>
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-amber-300 via-amber-600 to-amber-900 p-1 shadow flex items-center justify-center">
                  <div className="w-full h-full rounded-full bg-stone-950 flex items-center justify-center text-amber-300 font-mono text-[10px]">
                    {settings.volume}%
                  </div>
                </div>
                <button
                  onClick={() => onAdjustVolume(10)}
                  className="w-7 h-7 rounded-full bg-stone-900 border border-stone-600 text-amber-300 flex items-center justify-center text-xs active:scale-90"
                  title="Increase volume"
                >
                  +
                </button>
              </div>
            </div>

            {/* TV Guide / Quick Actions */}
            <div className="w-full pt-2 flex flex-col gap-1.5">
              <button
                onClick={onOpenGuide}
                className="w-full py-1.5 px-2 bg-gradient-to-r from-amber-900/60 to-amber-800/60 hover:from-amber-800 hover:to-amber-700 border border-amber-600/50 rounded text-amber-200 text-xs font-mono uppercase tracking-wider flex items-center justify-center gap-1.5 shadow"
              >
                <Tv className="w-3.5 h-3.5" /> Program Guide
              </button>
              <button
                onClick={onTriggerStatic}
                className="w-full py-1 px-2 bg-stone-900 hover:bg-stone-800 border border-stone-700 rounded text-stone-300 text-[11px] font-mono flex items-center justify-center gap-1"
                title="Tune analog static / antenna fuzz"
              >
                <Radio className="w-3 h-3 text-amber-400" /> Fine Tune RF
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Speaker Grille Cloth (Woven Mid-Century Fabric) */}
        <div className="mt-4 bg-[#23150c] rounded-xl p-3 border-2 border-[#452714] shadow-inner">
          <div className="w-full h-14 sm:h-16 rounded bg-[radial-gradient(#5a3920_1.5px,transparent_1.5px)] [background-size:6px_6px] bg-[#1a0f07] border border-amber-950 flex items-center justify-between px-4 sm:px-8">
            <div className="font-vintage text-amber-500/70 text-xs tracking-widest uppercase">
              RCA Solid State Sound System
            </div>
            <div className="flex items-center gap-1 text-[11px] text-amber-400/60 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>NTSC HIGH DEFINITION 525-LINE</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
