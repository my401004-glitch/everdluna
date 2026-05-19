// src/components/music/PitchDetector.ts

export class PitchDetector {
  private audioCtx: AudioContext | null = null;
  private analyser: AnalyserNode | null = null;
  private micStream: MediaStream | null = null;
  private source: MediaStreamAudioSourceNode | null = null;
  private buf: Float32Array = new Float32Array(2048);

  constructor() {}

  public async startTracking(onPitchDetected: (freq: number) => void): Promise<void> {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error("마이크 입력이 지원되지 않는 브라우저입니다.");
    }

    this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;

    this.source = this.audioCtx.createMediaStreamSource(this.micStream);
    this.source.connect(this.analyser);

    const updatePitch = () => {
      if (!this.analyser) return;
      this.analyser.getFloatTimeDomainData(this.buf as any);
      const pitch = this.autoCorrelate(this.buf, this.audioCtx!.sampleRate);
      onPitchDetected(pitch);
      if (this.micStream) {
        requestAnimationFrame(updatePitch);
      }
    };

    updatePitch();
  }

  public stopTracking(): void {
    if (this.micStream) {
      this.micStream.getTracks().forEach(track => track.stop());
      this.micStream = null;
    }
    if (this.source) {
      this.source.disconnect();
      this.source = null;
    }
    if (this.audioCtx) {
      this.audioCtx.close();
      this.audioCtx = null;
    }
    this.analyser = null;
  }

  // 자기상관 알고리즘 (Autocorrelation)
  private autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    let size = buffer.length;
    let rms = 0;

    for (let i = 0; i < size; i++) {
      let val = buffer[i];
      rms += val * val;
    }
    rms = Math.sqrt(rms / size);
    if (rms < 0.01) return -1; // 소리가 너무 작으면 감지하지 않음

    let r1 = 0, r2 = size - 1;
    const thres = 0.2;
    for (let i = 0; i < size / 2; i++) {
      if (Math.abs(buffer[i]) < thres) { r1 = i; break; }
    }
    for (let i = size - 1; i >= size / 2; i--) {
      if (Math.abs(buffer[i]) < thres) { r2 = i; break; }
    }

    buffer = buffer.slice(r1, r2);
    size = buffer.length;

    let c = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - i; j++) {
        c[i] = c[i] + buffer[j] * buffer[j + i];
      }
    }

    let d = 0;
    while (c[d] > c[d + 1]) d++;
    let maxval = -1, maxpos = -1;
    for (let i = d; i < size; i++) {
      if (c[i] > maxval) {
        maxval = c[i];
        maxpos = i;
      }
    }
    let T0 = maxpos;

    let x1 = c[T0 - 1], x2 = c[T0], x3 = c[T0 + 1];
    let a = (x1 + x3 - 2 * x2) / 2;
    let b = (x3 - x1) / 2;
    if (a) T0 = T0 - b / (2 * a);

    return sampleRate / T0;
  }

  // 주파수(Hz)를 가장 가까운 음고 이름(예: C4, A#4 등)으로 변환
  public static getNoteFromFreq(frequency: number): { note: string; deviation: number } | null {
    if (frequency === -1 || isNaN(frequency)) return null;

    const noteStrings = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
    const c0 = 16.35; // C0 주파수
    const h = 12 * Math.log2(frequency / c0);
    const oct = Math.floor(h / 12);
    const noteIdx = Math.round(h % 12);
    const note = noteStrings[noteIdx === 12 ? 0 : noteIdx] + oct;
    
    // 타겟 주파수 계산
    const targetFreq = c0 * Math.pow(2, Math.round(h) / 12);
    const deviation = Math.round((frequency - targetFreq) * 10) / 10;

    return { note, deviation };
  }
}
