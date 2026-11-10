import React, { useEffect, useRef, useState } from 'react';
import { ScreenFilter, TVProgram } from '../types/tv';
import { Volume2, VolumeX, AlertCircle, RefreshCw, Play, Pause } from 'lucide-react';
import { playKnobClick } from '../utils/audioEffects';

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
  onToggleMute?: () => void;
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
  onToggleMute,
  osdMessage,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const [powerPhase, setPowerPhase] = useState<'off' | 'turning-on' | 'on' | 'turning-off'>('off');
  const [streamError, setStreamError] = useState(false);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [isAutoplayMuted, setIsAutoplayMuted] = useState(false);
  const [isVideoLoading, setIsVideoLoading] = useState(true);

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

  // Reset stream states on program change
  useEffect(() => {
    setStreamError(false);
    setIsVideoLoading(true);
  }, [currentProgram?.id]);

  // Robust HTML5 Video Playback & Autoplay handling
  useEffect(() => {
    if (!videoRef.current || !isPoweredOn || isTuning || !currentProgram) return;

    const video = videoRef.current;
    video.volume = isMuted || isAutoplayMuted ? 0 : volume / 100;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            setIsVideoPlaying(true);
            setIsVideoLoading(false);
          })
          .catch(() => {
            // Browser autoplay policy blocked unmuted audio: fallback to muted playback
            video.muted = true;
            setIsAutoplayMuted(true);
            video.play()
              .then(() => {
                setIsVideoPlaying(true);
                setIsVideoLoading(false);
              })
              .catch(() => {
                setIsVideoPlaying(false);
              });
          });
      }
    };

    attemptPlay();
  }, [currentProgram?.id, isPoweredOn, isTuning, volume, isMuted, isAutoplayMuted]);

  // Handle user click on CRT screen to toggle play or unmute audio
  const handleScreenClick = () => {
    if (!videoRef.current) return;
    playKnobClick();

    if (isAutoplayMuted) {
      setIsAutoplayMuted(false);
      videoRef.current.muted = false;
      videoRef.current.volume = volume / 100;
      if (onToggleMute && isMuted) {
        onToggleMute();
      }
    }

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => setIsVideoPlaying(true)).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

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
        data[i] = val;
        data[i + 1] = val;
        data[i + 2] = val;
        data[i + 3] = 255;
      }
      ctx.putImageData(imgData, 0, 0);
      animId = requestAnimationFrame(renderStatic);
    };

    if (isTuning || !currentProgram || streamError || isVideoLoading) {
      renderStatic();
    }

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isTuning, currentProgram, streamError, isVideoLoading]);

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

  const isDirectVideo = currentProgram && (currentProgram.source === 'direct' || currentProgram.videoId.startsWith('http'));

  if (powerPhase === 'off') {
    return (
      <div className="relative w-full h-full bg-[#050608] flex items-center justify-center overflow-hidden select-none">
        <div className="absolute inset-0 bg-radial from-transparent via-[#08090c]/70 to-[#020203] pointer-events-none" />
        <div className="absolute inset-0 opacity-15 bg-gradient-to-tr from-transparent via-white/10 to-transparent pointer-events-none" />
        <div className="text-stone-700/40 text-xs font-mono tracking-widest uppercase">
          CRT STANDBY · TURN POWER ON
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleScreenClick}
      className={`relative w-full h-full bg-black overflow-hidden flex items-center justify-center select-none cursor-pointer ${
        curvature ? 'crt-curvature' : ''
      }`}
    >
      {/* Power-on beam animation */}
      {powerPhase === 'turning-on' && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center animate-crt-turn-on pointer-events-none">
          <div className="w-full h-[3px] bg-cyan-100 shadow-[0_0_20px_#fff,0_0_40px_#38bdf8]" />
        </div>
      )}

      {/* Power-off collapse animation */}
      {powerPhase === 'turning-off' && (
        <div className="absolute inset-0 z-40 bg-black flex items-center justify-center pointer-events-none">
          <div className="w-2 h-2 rounded-full bg-cyan-100 shadow-[0_0_30px_#fff,0_0_50px_#38bdf8] animate-ping" />
        </div>
      )}

      {/* Main Video Layer */}
      <div
        className="w-full h-full relative transition-all duration-300"
        style={getFilterStyle()}
      >
        {currentProgram && !isTuning && !streamError ? (
          isDirectVideo ? (
            <video
              ref={videoRef}
              key={currentProgram.id}
              src={currentProgram.videoId}
              autoPlay
              playsInline
              loop
              muted={isMuted || isAutoplayMuted}
              className="w-full h-full object-contain bg-black"
              onCanPlay={() => {
                setIsVideoLoading(false);
                videoRef.current?.play().catch(() => {});
              }}
              onLoadedData={() => {
                setIsVideoLoading(false);
              }}
              onPlay={() => setIsVideoPlaying(true)}
              onPause={() => setIsVideoPlaying(false)}
              onError={(e) => {
                console.warn('Video load error', e);
                setStreamError(true);
              }}
            />
          ) : (
            <iframe
              key={currentProgram.id}
              src={`https://www.youtube-nocookie.com/embed/${currentProgram.videoId}?autoplay=1&mute=${isMuted ? 1 : 0}&controls=1&modestbranding=1&rel=0&iv_load_policy=3&playsinline=1&fs=1`}
              title={currentProgram.title}
              className="w-full h-full border-0 absolute inset-0 object-cover"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              onError={() => setStreamError(true)}
            />
          )
        ) : null}

        {/* Static Snow Canvas (Visible during channel tuning, loading, or signal loss) */}
        {(isTuning || !currentProgram || streamError || isVideoLoading) && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black">
            <canvas
              ref={canvasRef}
              className="absolute inset-0 w-full h-full object-cover opacity-85 mix-blend-screen"
            />
            {streamError ? (
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
                    onClick={(e) => {
                      e.stopPropagation();
                      onNextChannel();
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded text-xs font-mono transition-colors"
                  >
                    <RefreshCw className="w-3.5 h-3.5" /> Tune Next Channel
                  </button>
                )}
              </div>
            ) : isVideoLoading ? (
              <div className="relative z-20 px-4 py-2 bg-black/70 border border-amber-500/30 rounded text-amber-300 font-crt text-lg tracking-widest flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                TUNING FREQUENCY...
              </div>
            ) : null}
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

      {/* Autoplay Muted / Tap to Unmute Banner */}
      {isAutoplayMuted && isVideoPlaying && (
        <div className="absolute bottom-4 inset-x-6 z-30 pointer-events-none flex justify-center animate-bounce">
          <div className="bg-amber-950/90 border border-amber-500/80 px-4 py-1.5 rounded-full text-amber-200 font-mono text-xs shadow-lg flex items-center gap-2">
            <VolumeX className="w-3.5 h-3.5 text-amber-400" />
            <span>CLICK SCREEN TO UNMUTE AUDIO</span>
          </div>
        </div>
      )}

      {/* Paused Overlay Indicator */}
      {!isVideoPlaying && !isVideoLoading && !isTuning && (
        <div className="absolute inset-0 z-25 bg-black/40 flex items-center justify-center pointer-events-none">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 border-2 border-amber-400/60 flex items-center justify-center text-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.4)]">
            <Play className="w-8 h-8 ml-1 fill-current" />
          </div>
        </div>
      )}

      {/* Vintage On-Screen Display (OSD) in Phosphor Green */}
      {osdMessage && (
        <div className="absolute top-4 left-4 z-30 pointer-events-none font-crt tracking-widest text-[#4af626] text-xl sm:text-2xl drop-shadow-[0_0_6px_rgba(74,246,38,0.8)] flex items-center gap-3 bg-black/60 px-3 py-1.5 border border-[#4af626]/30 rounded">
          <span>{osdMessage}</span>
          <div className="flex items-center gap-1 text-sm border-l border-[#4af626]/40 pl-2">
            {isMuted || isAutoplayMuted ? (
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
