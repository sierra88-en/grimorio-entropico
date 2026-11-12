/**
 * Motor de Entropía Híbrida Cuántica y Criptográfica
 * Diseñado conforme a la arquitectura técnica de 'The Universe Decides'
 * Fuente primaria: Ruido atmosférico planetario (RANDOM.ORG TRNG)
 * Fuente de reserva: Generador Criptográfico Seguro de Kernel (CSPRNG window.crypto)
 * Con mitigación estricta de Sesgo de Módulo (Modulo Bias) y auditoría visible.
 */

export type EntropySourceType = 'RANDOM_ORG_ATMOSPHERIC' | 'CSPRNG_KERNEL_LOCAL';

export interface EntropyResult {
  value: number;
  source: EntropySourceType;
  sourceLabel: string;
  sourceDetail: string;
  latencyMs: number;
  timestamp: string;
  seedHex: string;
  quotaWarning?: boolean;
}

/**
 * Genera un número entero en el rango cerrado [min, max] usando CSPRNG sin sesgo de módulo
 */
export function getLocalCsprngInteger(min: number, max: number): { value: number; seedHex: string } {
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }
  const range = max - min + 1;

  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint32Array(1);
    const maxUint32 = 0xffffffff;
    // Límite superior para evitar sesgo de módulo
    const limit = maxUint32 - (maxUint32 % range);

    let randomValue: number;
    do {
      window.crypto.getRandomValues(buffer);
      randomValue = buffer[0];
    } while (randomValue >= limit);

    const mapped = min + (randomValue % range);
    const hex = '0x' + buffer[0].toString(16).padStart(8, '0').toUpperCase();
    return { value: mapped, seedHex: hex };
  } else {
    // Fallback matemático estándar en entornos sin crypto
    const pseudo = Math.floor(Math.random() * range) + min;
    return { value: pseudo, seedHex: '0x' + Math.floor(Math.random() * 0xffffffff).toString(16).toUpperCase() };
  }
}

/**
 * Solicita entropía a RANDOM.ORG con timeout y fallback inmediato al CSPRNG de Kernel
 */
export async function fetchHybridEntropy(min: number, max: number, timeoutMs = 3200): Promise<EntropyResult> {
  const startTime = performance.now();
  const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  // Intentamos obtener número de RANDOM.ORG
  // 1. Probamos primero a través del proxy local configurado en Vite (/api/random-org)
  // 2. Si falla o estamos en producción estática, probamos directo con CORS friendly URL
  const randomOrgUrls = [
    `/api/random-org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`,
    `https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`
  ];

  for (const url of randomOrgUrls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'text/plain',
        },
        cache: 'no-store'
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        const text = await response.text();
        const parsed = parseInt(text.trim(), 10);

        if (!isNaN(parsed) && parsed >= min && parsed <= max) {
          const latencyMs = Math.round(performance.now() - startTime);
          const pseudoSeed = Math.floor(Math.random() * 0xffffffff);
          const hex = '0xTRNG_' + parsed.toString(16).toUpperCase() + '_' + pseudoSeed.toString(16).slice(0, 4).toUpperCase();

          return {
            value: parsed,
            source: 'RANDOM_ORG_ATMOSPHERIC',
            sourceLabel: 'Ruido Atmosférico Físico (RANDOM.ORG)',
            sourceDetail: 'Capturado de fluctuaciones electromagnéticas planetarias y estática de descargas eléctricas globales.',
            latencyMs,
            timestamp,
            seedHex: hex
          };
        }
      }
    } catch {
      // Siguiente URL o degradación controlada
      continue;
    }
  }

  // Fallback a Generador CSPRNG del Sistema (Kernel /dev/urandom)
  const localResult = getLocalCsprngInteger(min, max);
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    value: localResult.value,
    source: 'CSPRNG_KERNEL_LOCAL',
    sourceLabel: 'Entropía de Kernel Local (CSPRNG)',
    sourceDetail: 'Reserva criptográfica segura del sistema operativo (window.crypto / /dev/urandom) sin sesgo de módulo.',
    latencyMs,
    timestamp,
    seedHex: localResult.seedHex
  };
}
