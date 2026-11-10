import React, { useEffect, useRef, useState } from 'react';
import { ScreenFilter, TVProgram } from '../types/tv';
import { Volume2, VolumeX, AlertCircle, RefreshCw } from 'lucide-react';

interface CRTScreenProps {
  isPoweredOn: boolean;
  currentProgram: TVProgram | null;
  filter: ScreenFilter;
  curvature: boolean;
  scanlines: boolean;
  isTuning: boolean;
  volume: number;
  isMuted: boolean;
  onNextChannel?: () => void;
  osdMessage?: string | null;
}

export const CRTScreen: React.FC<CRTScreenProps> = ({
  isPoweredOn,
  currentProgram,
  filter,
  curvature,
  scanlines,
  isTuning,
  volume,
  isMuted,
  onNextChannel,
  osdMessage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [powerPhase, setPowerPhase] = useState<'off' | 'turning-on' | 'on' | 'turning-off'>('off');
  const [streamError, setStreamError] = useState(false);

  // Power state animation sequencer
  useEffect(() => {
    if (isPoweredOn) {
      setPowerPhase('turning-on');
      const timer = setTimeout(() => {
        setPowerPhase('on');
      }, 700);
      return () => clearTimeout(timer);
    } else {
      if (powerPhase !== 'off') {
        setPowerPhase('turning-off');
        const timer = setTimeout(() => {
          setPowerPhase('off');
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [isPoweredOn]);

  // Reset stream error on program change
  useEffect(() => {
    setStreamError(false);
  }, [currentProgram?.id]);

  // Animated TV static noise generator on canvas
  useEffect(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const width = 160;
    const height = 120;
    canvas.width = width;
    canvas.height = height;

    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;

    const renderStatic = () => {
      for (let i = 0; i < data.length; i += 4) {
        const val = (Math.random() * 255) | 0;
        data[i] = val;     // R
        data[i + 1] = val; // G
        data[i + 2] = val; // B
        data[i + 3] = 255; // A
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(renderStatic);
    };

    if (isTuning || !currentProgram || streamError) {
      renderStatic();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isTuning, currentProgram, streamError]);

  // Filter CSS styles
  const getFilterStyle = (): React.CSSProperties => {
    switch (filter) {
      case 'bw':
        return { filter: 'grayscale(100%) contrast(125%) brightness(95%)' };
      case 'amber':
        return { filter: 'sepia(100%) hue-rotate(-20deg) saturate(320%) contrast(120%) brightness(90%)' };
      case 'green':
        return { filter: 'sepia(100%) hue-rotate(85deg) saturate(380%) contrast(125%) brightness(95%)' };
      case 'color':
      default:
        return { filter: 'saturate(115%) contrast(108%)' };
    }
  };

  // Embed URL for YouTube
  const getEmbedUrl = (videoId: string) => {
    return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=1`;
  };

  if (powerPhase === 'off') {
    return (
      <div className="relative w-full h-full bg-[#050608] flex items-center justify-center overflow-hidden select-none">
        {/* Pitch black CRT tube with glassy dormant curvature and room reflection */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090c]/70 to-[#020203] pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        <div className="text-stone-700/40 text-xs font-mono tracking-widest uppercase">
          CRT STANDBY
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center select-none ${
        curvature ? 'crt-curvature' : ''
      }`}
    >
      {/* Power-on beam animation */}
      {powerPhase === 'turning-on' && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center animate-crt-turn-on">
          <div className="w-full h-[3px] bg-cyan-100 shadow-[0_0_20px_#fff,0_0_40px_#38bdf8]" />
        </div>
      )}

      {/* Power-off collapse animation */}
      {powerPhase === 'turning-off' && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-cyan-100 shadow-[0_0_30px_#fff,0_0_50px_#38bdf8] animate-ping" />
        </div>
      )}

      {/* Main Video Layer */}
      <div
        className="w-full h-full relative transition-all duration-300"
        style={getFilterStyle()}
      >
        {currentProgram && !isTuning && !streamError ? (
          currentProgram.source === 'youtube' ? (
            <iframe
              key={currentProgram.id}
              src={getEmbedUrl(currentProgram.videoId)}
              title={currentProgram.title}
              className="w-full h-full border-0 absolute inset-0 object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setStreamError(true)}
            />
          ) : (
            <video
              key={currentProgram.id}
              src={currentProgram.videoId}
              autoPlay
              controls
              muted={isMuted}
              className="w-full h-full object-contain bg-black"
              onError={() => setStreamError(true)}
            />
          )
        ) : null}

        {/* Static Snow Canvas (Visible during channel tuning or no signal) */}
        {(isTuning || !currentProgram || streamError) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover opacity-90 mix-blend-screen"
            />
            {streamError && (
              <div className="relative z-20 px-6 py-4 bg-stone-900/90 border border-stone-700/80 rounded-lg text-center backdrop-blur-sm max-w-sm">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <p className="text-amber-200 font-crt text-xl tracking-wider mb-1">
                  OFF AIR / SIGNAL LOST
                </p>
                <p className="text-xs text-stone-400 mb-3">
                  Channel stream unavailable or restricted.
                </p>
                {onNextChannel && (
                  <button
                    onClick={onNextChannel}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-mono transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Tune Next Channel
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Phosphor Grid / Scanlines Overlay */}
      {scanlines && (
        <div
          className="absolute inset-0 pointer-events-none z-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.45)_50%)] bg-[length:100%_4px]"
          aria-hidden="true"
        />
      )}

      {/* Subtle Phosphor RGB Subpixel Pattern */}
      <div
        className="absolute inset-0 pointer-events-none z-20 opacity-15 mix-blend-overlay bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white/10 via-transparent to-black"
        aria-hidden="true"
      />

      {/* Glass Tube Curvature & Vignette Shadow */}
      <div
        className="absolute inset-0 pointer-events-none z-20 shadow-[inset_0_0_60px_rgba(0,0,0,0.85),inset_0_0_120px_rgba(0,0,0,0.5)] border border-white/5"
        aria-hidden="true"
      />

      {/* Diagonal Glass Reflection Highlight */}
      <div
        className="absolute inset-0 pointer-events-none z-20 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent opacity-60"
        aria-hidden="true"
      />

      {/* Vintage On-Screen Display (OSD) in Phosphor Green */}
      {osdMessage && (
        <div className="absolute top-4 left-4 z-30 pointer-events-none font-crt tracking-widest text-[#4af626] text-xl sm:text-2xl drop-shadow-[0_0_6px_rgba(74,246,38,0.8)] flex items-center gap-3 bg-black/60 px-3 py-1.5 border border-[#4af626]/30 rounded">
          <span>{osdMessage}</span>
          <div className="flex items-center gap-1 text-sm border-l border-[#4af626]/40 pl-2">
            {isMuted ? (
              <span className="flex items-center gap-1 text-red-400">
                <VolumeX className="w-4 h-4" /> MUTE
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <Volume2 className="w-4 h-4" /> VOL {volume}%
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
