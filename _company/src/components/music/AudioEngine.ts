// src/components/music/AudioEngine.ts

export const NOTE_FREQS: { [key: string]: number } = {
  'C4': 261.63, 'C#4': 277.18, 'D4': 293.66, 'D#4': 311.13, 'E4': 329.63,
  'F4': 349.23, 'F#4': 369.99, 'G4': 392.00, 'G#4': 415.30, 'A4': 440.00,
  'A#4': 466.16, 'B4': 493.88, 'C5': 523.25, 'C#5': 554.37, 'D5': 587.33,
  'D#5': 622.25, 'E5': 659.25, 'F5': 698.46, 'F#5': 739.99, 'G5': 783.99,
  'G#5': 830.61, 'A5': 880.00, 'A#5': 932.33, 'B5': 987.77, 'C6': 1046.50
};

export class AudioEngine {
  private ctx: AudioContext | null = null;

  constructor() {}

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  // Realistic additive piano synthesis
  public playPianoTone(freq: number, duration: number = 1.2) {
    const ctx = this.initCtx();
    const now = ctx.currentTime;
    
    // Master Gain (Volume Envelope)
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0, now);
    masterGain.gain.linearRampToValueAtTime(0.5, now + 0.008); // Sharp strike
    masterGain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    masterGain.connect(ctx.destination);

    // Piano Harmonics
    const harmonics = [1, 2, 3, 4, 5, 6];
    const gains = [0.6, 0.3, 0.15, 0.08, 0.04, 0.02];

    harmonics.forEach((h, i) => {
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq * h, now);
      
      const hGain = ctx.createGain();
      hGain.gain.setValueAtTime(gains[i], now);
      hGain.gain.exponentialRampToValueAtTime(0.0001, now + (duration / (h * 0.8)));
      
      osc.connect(hGain);
      hGain.connect(masterGain);
      osc.start(now);
      osc.stop(now + duration);
    });

    // Hammer Strike Noise (Transient)
    try {
      const bufferSize = ctx.sampleRate * 0.015; // 15ms strike noise
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.value = 1200;

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.12, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(masterGain);
      noise.start(now);
      noise.stop(now + 0.015);
    } catch (e) {
      console.warn("Hammer strike synthesis error: ", e);
    }
  }

  // Play a sequence of tones with delay
  public async playSequence(freqs: number[], toneDuration: number = 0.8, gap: number = 0.4) {
    for (let i = 0; i < freqs.length; i++) {
      this.playPianoTone(freqs[i], toneDuration);
      await new Promise(resolve => setTimeout(resolve, (toneDuration + gap) * 1000));
    }
  }

  // Play multiple notes simultaneously (a chord)
  public playChord(freqs: number[], type: string = 'sine', duration: number = 1.5) {
    freqs.forEach(freq => {
      this.playPianoTone(freq, duration);
    });
  }
}
