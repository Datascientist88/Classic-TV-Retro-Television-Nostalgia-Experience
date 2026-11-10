import React from 'react';
import { TVProgram, TVSettings } from '../../types/tv';
import { CRTScreen } from '../CRTScreen';
import { playButtonBeep, playPowerSwitch } from '../../utils/audioEffects';
import { Tv, Radio, Disc } from 'lucide-react';

interface Modern90sCabinetProps {
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
  onToggleMute?: () => void;
}

export const Modern90sCabinet: React.FC<Modern90sCabinetProps> = ({
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
  onToggleMute,
}) => {
  return (
    <div className="relative mx-auto w-full max-w-4xl flex flex-col items-center">
      {/* 1990s Dark Charcoal Curved CRT Set */}
      <div className="w-full bg-[#1b1c20] rounded-3xl p-4 sm:p-6 shadow-[0_25px_60px_rgba(0,0,0,0.95),inset_0_2px_4px_rgba(255,255,255,0.15)] border-4 border-[#2b2d33]">
        {/* Top Trim */}
        <div className="flex items-center justify-between mb-3 px-2 border-b border-stone-800 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-stone-200 text-sm font-bold tracking-widest uppercase">
              SONY WEGA TRINITRON
            </span>
            <span className="text-[10px] text-cyan-400 font-mono hidden sm:inline">
              DIGITAL STEREO SURROUND · 100Hz
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-stone-400">STANDBY/TIMER</span>
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                settings.isPoweredOn
                  ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]'
                  : 'bg-red-500 shadow-[0_0_6px_#ef4444]'
              }`}
            />
          </div>
        </div>

        {/* Screen with Dual Stereo Speaker Wings */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-stretch">
          {/* Left Speaker Wing */}
          <div className="hidden md:flex md:col-span-1 bg-[#141518] rounded-xl p-1 flex-col items-center justify-center border border-stone-800">
            <div className="w-full h-48 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:4px_4px] rounded opacity-60" />
            <span className="text-[8px] font-mono text-stone-500 mt-2 rotate-90">STEREO L</span>
          </div>

          {/* CRT Screen */}
          <div className="md:col-span-10 bg-[#0d0e10] p-3 rounded-2xl border-2 border-stone-800 shadow-inner flex flex-col justify-center">
            <div className="w-full aspect-[4/3] rounded-2xl p-2 bg-gradient-to-br from-[#2b2d33] via-[#1c1d22] to-[#121316] border border-stone-700 shadow-inner overflow-hidden">
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
                  onToggleMute={onToggleMute}
                  osdMessage={osdMessage}
                />
              </div>
            </div>
          </div>

          {/* Right Speaker Wing */}
          <div className="hidden md:flex md:col-span-1 bg-[#141518] rounded-xl p-1 flex-col items-center justify-center border border-stone-800">
            <div className="w-full h-48 bg-[radial-gradient(#333_1px,transparent_1px)] [background-size:4px_4px] rounded opacity-60" />
            <span className="text-[8px] font-mono text-stone-500 mt-2 rotate-90">STEREO R</span>
          </div>
        </div>

        {/* Bottom Front Control Deck & RCA AV Jacks */}
        <div className="mt-4 bg-[#141518] rounded-xl p-3 border border-stone-800 flex flex-wrap items-center justify-between gap-3">
          {/* Front RCA Video/Audio Inputs */}
          <div className="flex items-center gap-2">
            <span className="text-[9px] font-mono text-stone-500 uppercase">VIDEO 1:</span>
            <div className="flex items-center gap-1.5">
              <div className="w-3.5 h-3.5 rounded-full bg-yellow-400 border border-stone-700 shadow-inner" title="Composite Video" />
              <div className="w-3.5 h-3.5 rounded-full bg-white border border-stone-700 shadow-inner" title="Audio L" />
              <div className="w-3.5 h-3.5 rounded-full bg-red-600 border border-stone-700 shadow-inner" title="Audio R" />
            </div>
          </div>

          {/* Quick Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                playPowerSwitch(!settings.isPoweredOn);
                onTogglePower();
              }}
              className={`px-3 py-1 rounded text-xs font-mono font-bold uppercase transition-all ${
                settings.isPoweredOn
                  ? 'bg-emerald-600 text-white shadow-[0_0_8px_#059669]'
                  : 'bg-stone-800 text-stone-400'
              }`}
            >
              POWER
            </button>
            <button
              onClick={() => {
                playButtonBeep();
                onChangeChannel(-1);
              }}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono"
            >
              CH -
            </button>
            <button
              onClick={() => {
                playButtonBeep();
                onChangeChannel(1);
              }}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono"
            >
              CH +
            </button>
            <button
              onClick={() => {
                playButtonBeep();
                onAdjustVolume(-10);
              }}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono"
            >
              VOL -
            </button>
            <button
              onClick={() => {
                playButtonBeep();
                onAdjustVolume(10);
              }}
              className="px-2.5 py-1 bg-stone-800 hover:bg-stone-700 text-stone-200 rounded text-xs font-mono"
            >
              VOL +
            </button>
            <button
              onClick={onOpenGuide}
              className="px-3 py-1 bg-cyan-900/60 hover:bg-cyan-800 text-cyan-200 border border-cyan-700/50 rounded text-xs font-mono flex items-center gap-1"
            >
              <Tv className="w-3.5 h-3.5" /> GUIDE
            </button>
            <button
              onClick={onTriggerStatic}
              className="px-2.5 py-1 bg-stone-900 hover:bg-stone-800 text-stone-400 rounded text-xs font-mono flex items-center gap-1"
            >
              <Radio className="w-3.5 h-3.5" /> RF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
