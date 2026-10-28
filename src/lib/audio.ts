type AudioListener = (enabled: boolean) => void;

class AudioManager {
  private ctx: AudioContext | null = null;
  private isEnabled: boolean = false;
  private roomToneGain: GainNode | null = null;
  private noiseNode: AudioBufferSourceNode | null = null;
  private listeners: Set<AudioListener> = new Set();

  public getSoundState(): boolean {
    return this.isEnabled;
  }

  public subscribe(cb: AudioListener): () => void {
    this.listeners.add(cb);
    cb(this.isEnabled);
    return () => this.listeners.delete(cb);
  }

  private notify() {
    this.listeners.forEach((cb) => cb(this.isEnabled));
  }

  private initContext() {
    if (this.ctx) return;
    const AC = (window as any).AudioContext || (window as any).webkitAudioContext;
    if (AC) this.ctx = new AC();
  }

  public async toggle(): Promise<boolean> {
    this.initContext();
    if (!this.ctx) return false;
    if (this.ctx.state === 'suspended') await this.ctx.resume();
    this.isEnabled = !this.isEnabled;
    if (this.isEnabled) {
      this.startAtmosphere();
      this.playChime(528, 0.12);
    } else {
      this.stopAtmosphere();
    }
    this.notify();
    return this.isEnabled;
  }

  private startAtmosphere() {
    if (!this.ctx) return;
    try {
      const bSize = this.ctx.sampleRate * 3;
      const buffer = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
      const d = buffer.getChannelData(0);
      let l = 0.0;
      for (let i = 0; i < bSize; i++) {
        l = (l + 0.02 * (Math.random() * 2 - 1)) / 1.02;
        d[i] = l * 3.5;
      }
      this.noiseNode = this.ctx.createBufferSource();
      this.noiseNode.buffer = buffer;
      this.noiseNode.loop = true;
      const lp = this.ctx.createBiquadFilter();
      lp.type = 'lowpass';
      lp.frequency.setValueAtTime(140, this.ctx.currentTime);
      this.roomToneGain = this.ctx.state ? this.ctx.createGain() : null;
      if (this.roomToneGain) {
        this.roomToneGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
        this.roomToneGain.gain.exponentialRampToValueAtTime(0.035, this.ctx.currentTime + 2.0);
        this.noiseNode.connect(lp);
        lp.connect(this.roomToneGain);
        this.roomToneGain.connect(this.ctx.destination);
        this.noiseNode.start();
      }
    } catch (e) {}
  }

  private stopAtmosphere() {
    if (this.roomToneGain && this.ctx) {
      try {
        this.roomToneGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);
        setTimeout(() => {
          this.noiseNode?.stop();
          this.noiseNode = null;
        }, 850);
      } catch (e) {}
    }
  }

  public playChime(freq = 432, volume = 0.15) {
    if (!this.ctx || !this.isEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime;
    const o1 = this.ctx.createOscillator();
    const o2 = this.ctx.createOscillator();
    const o3 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    o1.type = 'sine';
    o1.frequency.setValueAtTime(freq, t);
    o2.type = 'sine';
    o2.frequency.setValueAtTime(freq * 2.008, t);
    o3.type = 'sine';
    o3.frequency.setValueAtTime(freq * 2.992, t);
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(volume, t + 0.04);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 4.2);
    o1.connect(g);
    o2.connect(g);
    o3.connect(g);
    g.connect(this.ctx.destination);
    o1.start(t);
    o2.start(t);
    o3.start(t);
    o1.stop(t + 4.3);
    o2.stop(t + 4.3);
    o3.stop(t + 4.3);
  }

  public playRelease() {
    if (!this.ctx || !this.isEnabled) return;
    if (this.ctx.state === 'suspended') this.ctx.resume();
    const t = this.ctx.currentTime;
    const bSize = Math.floor(this.ctx.sampleRate * 2.5);
    const buffer = this.ctx.createBuffer(1, bSize, this.ctx.sampleRate);
    const d = buffer.getChannelData(0);
    for (let i = 0; i < bSize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.5;
    }
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    const f = this.ctx.createBiquadFilter();
    f.type = 'bandpass';
    f.Q.setValueAtTime(2.5, t);
    f.frequency.setValueAtTime(300, t);
    f.frequency.exponentialRampToValueAtTime(1400, t + 1.8);
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(0.08, t + 0.4);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.5);
    noise.connect(f);
    f.connect(g);
    g.connect(this.ctx.destination);
    noise.start(t);
    noise.stop(t + 2.5);
    setTimeout(() => this.playChime(216, 0.08), 500);
  }

  public playTokenFlicker() {
    if (!this.ctx || !this.isEnabled) return;
    const t = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(1800 + Math.random() * 800, t);
    gain.gain.setValueAtTime(0.015, t);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(t);
    osc.stop(t + 0.03);
  }
}

export const audio = typeof window !== 'undefined' ? new AudioManager() : (null as unknown as AudioManager);
