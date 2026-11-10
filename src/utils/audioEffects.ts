// Web Audio API Retro Sound Synthesizer
// Provides authentic analog TV mechanical clicks, CRT power-on hum, degauss thump, and static noise.

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === 'suspended') {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export const playKnobClick = (volume = 0.6) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    
    // Low mechanical clack
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(120, t);
    osc.frequency.exponentialRampToValueAtTime(30, t + 0.04);

    gain.gain.setValueAtTime(volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.04);

    // High metal snap
    const snapOsc = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snapOsc.type = 'sine';
    snapOsc.frequency.setValueAtTime(2400, t);
    snapOsc.frequency.exponentialRampToValueAtTime(600, t + 0.02);

    snapGain.gain.setValueAtTime(volume * 0.4, t);
    snapGain.gain.exponentialRampToValueAtTime(0.001, t + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);
    snapOsc.connect(snapGain);
    snapGain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.05);
    snapOsc.start(t);
    snapOsc.stop(t + 0.03);
  } catch {
    // Graceful fallback if blocked by browser autoplay policy
  }
};

export const playButtonBeep = (volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(1400, t);
    osc.frequency.setValueAtTime(1200, t + 0.03);

    gain.gain.setValueAtTime(volume * 0.4, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 0.08);
  } catch {}
};

export const playPowerSwitch = (turningOn: boolean, volume = 0.7) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Heavy switch latch
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'square';
    osc.frequency.setValueAtTime(80, t);
    osc.frequency.exponentialRampToValueAtTime(20, t + 0.08);

    gain.gain.setValueAtTime(volume * 0.7, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.09);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(t);
    osc.stop(t + 0.1);

    if (turningOn) {
      // CRT Cathode beam charge whine / high voltage rise
      const whine = ctx.createOscillator();
      const whineGain = ctx.createGain();
      whine.type = 'sine';
      whine.frequency.setValueAtTime(300, t + 0.05);
      whine.frequency.exponentialRampToValueAtTime(15734, t + 0.7); // Authentic NTSC 15.734 kHz horizontal deflection flyback transformer frequency!

      whineGain.gain.setValueAtTime(0.001, t);
      whineGain.gain.linearRampToValueAtTime(volume * 0.15, t + 0.3);
      whineGain.gain.exponentialRampToValueAtTime(0.0001, t + 1.2);

      whine.connect(whineGain);
      whineGain.connect(ctx.destination);
      whine.start(t + 0.05);
      whine.stop(t + 1.3);
    }
  } catch {}
};

export const playDegauss = (volume = 0.8) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const t = ctx.currentTime;

    // Heavy low electromagnetic "THUUNNNNNGGGGGG" coil hum
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(110, t);
    osc.frequency.exponentialRampToValueAtTime(45, t + 1.5);

    gain.gain.setValueAtTime(volume * 0.8, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 1.6);

    // Filter to give that inside-the-chassis resonant metallic body
    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(400, t);
    filter.frequency.exponentialRampToValueAtTime(100, t + 1.5);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(t);
    osc.stop(t + 1.7);
  } catch {}
};

export const playStaticBurst = (durationMs = 350, volume = 0.3) => {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;

    const bufferSize = ctx.sampleRate * (durationMs / 1000);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const output = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = ctx.createBufferSource();
    whiteNoise.buffer = buffer;

    // Bandpass filter for authentic RF tuner static
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1800;
    filter.Q.value = 1.2;

    const gainNode = ctx.createGain();
    const t = ctx.currentTime;
    gainNode.gain.setValueAtTime(volume * 0.5, t);
    gainNode.gain.exponentialRampToValueAtTime(0.001, t + durationMs / 1000);

    whiteNoise.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(ctx.destination);

    whiteNoise.start(t);
  } catch {}
};
