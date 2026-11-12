/**
 * Web Audio API synthesizer for Grimoire & Alchemical soundscapes
 * Completely self-contained, no external asset dependencies.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  /**
   * Sound when selecting an intention or changing modes
   */
  public playClick() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(540, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.06, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  /**
   * Frequency tuning cosmic sound during entropy harvesting
   */
  public playTuningSweep() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const filter = this.ctx.createBiquadFilter();
      const gain = this.ctx.createGain();

      osc.type = "triangle";
      osc.frequency.setValueAtTime(140, this.ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(432, this.ctx.currentTime + 0.4);
      osc.frequency.linearRampToValueAtTime(528, this.ctx.currentTime + 0.9);

      filter.type = "bandpass";
      filter.frequency.setValueAtTime(300, this.ctx.currentTime);
      filter.Q.value = 4.0;
      filter.frequency.linearRampToValueAtTime(800, this.ctx.currentTime + 0.9);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.09, this.ctx.currentTime + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 1.1);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 1.1);
    } catch {
      // Audio autoplay policy
    }
  }

  /**
   * Golden sacred chime when card reveals
   */
  public playChime() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const freqs = [528, 660, 792, 1056]; // Solfeggio / harmonic triad
      freqs.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime + idx * 0.04);

        gain.gain.setValueAtTime(0.05 / (idx + 1), this.ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + idx * 0.04 + 1.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(this.ctx.currentTime + idx * 0.04);
        osc.stop(this.ctx.currentTime + idx * 0.04 + 1.4);
      });
    } catch {
      // ignore
    }
  }

  /**
   * Metallic coin flip and spin sound
   */
  public playCoinFlip() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      // Initial metallic flick
      const flickOsc = this.ctx.createOscillator();
      const flickGain = this.ctx.createGain();
      flickOsc.type = "triangle";
      flickOsc.frequency.setValueAtTime(880, this.ctx.currentTime);
      flickOsc.frequency.exponentialRampToValueAtTime(1760, this.ctx.currentTime + 0.05);

      flickGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      flickGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      flickOsc.connect(flickGain);
      flickGain.connect(this.ctx.destination);
      flickOsc.start();
      flickOsc.stop(this.ctx.currentTime + 0.15);

      // Rapid metallic ringing during spin
      for (let i = 0; i < 6; i++) {
        const ringTime = this.ctx.currentTime + 0.1 + i * 0.14;
        const ringOsc = this.ctx.createOscillator();
        const ringGain = this.ctx.createGain();
        ringOsc.type = "sine";
        ringOsc.frequency.setValueAtTime(1200 + (i % 2) * 300, ringTime);

        ringGain.gain.setValueAtTime(0.03, ringTime);
        ringGain.gain.exponentialRampToValueAtTime(0.001, ringTime + 0.09);

        ringOsc.connect(ringGain);
        ringGain.connect(this.ctx.destination);
        ringOsc.start(ringTime);
        ringOsc.stop(ringTime + 0.09);
      }
    } catch {
      // ignore
    }
  }

  /**
   * Sound when coin settles
   */
  public playCoinLand() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(659.25, this.ctx.currentTime); // E5
      osc.frequency.exponentialRampToValueAtTime(880, this.ctx.currentTime + 0.08);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + 0.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.8);
    } catch {
      // ignore
    }
  }

  /**
   * Sound of crystalline polyhedral dice clashing and bouncing against each other
   */
  public playDiceCollision() {
    if (this.isMuted) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      // Multi-tap crystalline impacts
      const impactTaps = [0, 0.04, 0.09, 0.16];
      impactTaps.forEach((offset, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        // High pitched gemstone resonance with noise-like click
        osc.type = idx % 2 === 0 ? "triangle" : "sine";
        const baseFreq = 950 + idx * 240 + Math.random() * 150;
        osc.frequency.setValueAtTime(baseFreq, now + offset);
        osc.frequency.exponentialRampToValueAtTime(320, now + offset + 0.07);

        gain.gain.setValueAtTime(0.09 / (idx + 1), now + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.07);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now + offset);
        osc.stop(now + offset + 0.07);
      });
    } catch {
      // ignore
    }
  }
}

export const sound = new SoundEngine();
