/**
 * Motor Háptico Multiplataforma (Android Native Capacitor / Web Vibration API)
 * Proporciona retroalimentación táctil física en lanzamientos, colisiones y revelaciones.
 */

interface CapacitorHapticsPlugin {
  impact?: (options: { style: 'LIGHT' | 'MEDIUM' | 'HEAVY' }) => Promise<void>;
  vibrate?: (options: { duration?: number }) => Promise<void>;
}

const STORAGE_KEY = 'grimorio_haptics_enabled_v1';

class HapticEngine {
  private enabled: boolean = true;

  constructor() {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved !== null) {
          this.enabled = saved === 'true';
        }
      } catch {
        // Ignore storage restrictions
      }
    }
  }

  public setEnabled(val: boolean) {
    this.enabled = val;
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, String(val));
      } catch {
        // Ignore
      }
    }
  }

  public isEnabled(): boolean {
    return this.enabled;
  }

  private getNativeHaptics(): CapacitorHapticsPlugin | null {
    if (typeof window === 'undefined') return null;
    const cap = (window as unknown as { Capacitor?: { Plugins?: { Haptics?: CapacitorHapticsPlugin } } }).Capacitor;
    return cap?.Plugins?.Haptics ?? null;
  }

  private triggerPattern(pattern: number | number[], nativeStyle: 'LIGHT' | 'MEDIUM' | 'HEAVY' = 'LIGHT') {
    if (!this.enabled || typeof window === 'undefined') return;

    const nativeHaptics = this.getNativeHaptics();
    if (nativeHaptics?.impact) {
      nativeHaptics.impact({ style: nativeStyle }).catch(() => {});
    }

    if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Ignore browser autoplay / permission restrictions
      }
    }
  }

  /** Toque sutil en botones y pestañas */
  public tap() {
    this.triggerPattern(12, 'LIGHT');
  }

  /** Golpe seco metálico al asentarse la moneda */
  public coinLand() {
    this.triggerPattern([36, 32, 20], 'HEAVY');
  }

  /** Serie de micro-choques al rebotar los dados poliédricos */
  public diceCollision() {
    this.triggerPattern([22, 28, 16, 34, 14], 'MEDIUM');
  }

  /** Redoble rítmico decreciente al girar la ruleta */
  public wheelSpin() {
    this.triggerPattern([14, 55, 14, 65, 14, 80, 16, 105, 18, 140, 32], 'MEDIUM');
  }

  /** Pulso místico al revelar carta(s) del Tarot */
  public tarotReveal() {
    this.triggerPattern([16, 48, 38], 'MEDIUM');
  }
}

export const haptics = new HapticEngine();
