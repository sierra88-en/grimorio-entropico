/**
 * Motor de Entropía Híbrida Cuántica y Criptográfica
 * Diseñado conforme a la arquitectura técnica de 'El Universo Decide'
 * Fuente primaria: Ruido atmosférico planetario (RANDOM.ORG TRNG)
 * Fuente de reserva / Offline: Web Crypto del navegador (crypto.getRandomValues)
 * Con mitigación estricta de Sesgo de Módulo (Modulo Bias), gestión inteligente de cuotas y auditoría visible.
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

// Ventana de enfriamiento si RANDOM.ORG agota su cuota diaria de IP o devuelve 429/503
let randomOrgCooldownUntil = 0;

/**
 * Genera un entero en [min, max] con Web Crypto y rechazo para evitar sesgo de módulo.
 * Falla de forma explícita si Web Crypto no está disponible; nunca degrada a Math.random().
 */
export function getLocalCsprngInteger(min: number, max: number): { value: number; seedHex: string } {
  if (!Number.isSafeInteger(min) || !Number.isSafeInteger(max)) {
    throw new RangeError('min y max deben ser enteros seguros.');
  }
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }
  const range = max - min + 1;
  if (!Number.isSafeInteger(range) || range < 1 || range > 0x100000000) {
    throw new RangeError('El rango solicitado debe contener entre 1 y 2^32 valores.');
  }

  const cryptoObj =
    typeof window !== 'undefined' && window.crypto
      ? window.crypto
      : typeof globalThis !== 'undefined' && globalThis.crypto
      ? globalThis.crypto
      : null;

  if (!cryptoObj || typeof cryptoObj.getRandomValues !== 'function') {
    throw new Error('Web Crypto no está disponible; no se generó ningún resultado.');
  }

  const buffer = new Uint32Array(1);
  const totalStates = 0x100000000; // Exacto 2^32 = 4294967296 estados discretos
  // Límite superior estricto para eliminar por completo el sesgo de módulo
  const limit = totalStates - (totalStates % range);

  let randomValue: number;
  do {
    cryptoObj.getRandomValues(buffer);
    randomValue = buffer[0];
  } while (randomValue >= limit);

  const mapped = min + (randomValue % range);
  const hex = '0x' + buffer[0].toString(16).padStart(8, '0').toUpperCase();
  return { value: mapped, seedHex: hex };
}

/**
 * Solicita entropía a RANDOM.ORG con timeout, detección offline instantánea, control de cuota y fallback fluido al CSPRNG
 */
export async function fetchHybridEntropy(min: number, max: number, timeoutMs = 3200): Promise<EntropyResult> {
  const startTime = performance.now();
  const timestamp = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const isOffline = typeof navigator !== 'undefined' && navigator.onLine === false;
  let quotaExhausted = Date.now() < randomOrgCooldownUntil;

  if (!isOffline && !quotaExhausted) {
    // En Capacitor Android nativo o PWA estática no existe el proxy dev /api/random-org,
    // así que priorizamos directo HTTPS y dejamos el proxy como apoyo en servidor dev web.
    const isCapacitorNative =
      typeof window !== 'undefined' &&
      Boolean((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());

    const randomOrgUrls = isCapacitorNative
      ? [`https://www.random.org/integers/?num=1&min=${min}&max=${max}&col=1&base=10&format=plain&rnd=new`]
      : [
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
            Accept: 'text/plain',
          },
          cache: 'no-store'
        });

        clearTimeout(timeoutId);

        if (response.status === 429 || response.status === 503) {
          quotaExhausted = true;
          randomOrgCooldownUntil = Date.now() + 90_000;
          break;
        }

        if (response.ok) {
          const text = await response.text();
          if (text.toLowerCase().includes('error:')) {
            quotaExhausted = true;
            randomOrgCooldownUntil = Date.now() + 90_000;
            break;
          }

          // Validar estrictamente que sea un entero plano y no HTML devuelto por SPA fallback
          if (/^\s*-?\d+\s*$/.test(text)) {
            const parsed = parseInt(text.trim(), 10);

            if (!isNaN(parsed) && parsed >= min && parsed <= max) {
              const latencyMs = Math.round(performance.now() - startTime);
              const verificationHash = getLocalCsprngInteger(0, 0xffff).seedHex.slice(2, 6);
              const hex = '0xTRNG_' + parsed.toString(16).toUpperCase().padStart(2, '0') + '_' + verificationHash;

              return {
                value: parsed,
                source: 'RANDOM_ORG_ATMOSPHERIC',
                sourceLabel: 'RANDOM.ORG (servicio externo)',
                sourceDetail: 'El proveedor describe su fuente como ruido atmosférico; la app no la verifica de forma independiente.',
                latencyMs,
                timestamp,
                seedHex: hex
              };
            }
          }
        }
      } catch {
        // Siguiente URL o degradación controlada al CSPRNG local
        continue;
      }
    }
  }

  // Reserva local mediante Web Crypto del navegador; no implica acceso directo al kernel.
  const localResult = getLocalCsprngInteger(min, max);
  const latencyMs = Math.round(performance.now() - startTime);

  return {
    value: localResult.value,
    source: 'CSPRNG_KERNEL_LOCAL',
    sourceLabel: 'Web Crypto Local (CSPRNG)',
    sourceDetail: isOffline
      ? 'Modo sin conexión activo: usando crypto.getRandomValues del navegador con muestreo por rechazo.'
      : quotaExhausted
      ? 'Servicio externo no disponible: resultado generado localmente con crypto.getRandomValues y muestreo por rechazo.'
      : 'Resultado generado localmente con crypto.getRandomValues y muestreo por rechazo.',
    latencyMs,
    timestamp,
    seedHex: localResult.seedHex,
    quotaWarning: quotaExhausted
  };
}

/**
 * Extrae `count` valores enteros únicos (sin repetición) en el rango [min, max]
 * preservando la uniformidad matemática mediante muestreo sin reemplazo (Fisher-Yates parcial).
 */
export async function fetchDistinctHybridEntropy(
  count: number,
  min: number,
  max: number,
  timeoutMs = 2400
): Promise<{ values: number[]; lastEntropy: EntropyResult }> {
  const pool: number[] = [];
  for (let i = min; i <= max; i++) {
    pool.push(i);
  }

  const chosen: number[] = [];
  let lastEntropy: EntropyResult | null = null;
  const safeCount = Math.min(count, pool.length);

  for (let step = 0; step < safeCount; step++) {
    const ent = await fetchHybridEntropy(0, pool.length - 1, timeoutMs);
    lastEntropy = ent;
    const pickedIdx = ent.value;
    chosen.push(pool[pickedIdx]);
    pool.splice(pickedIdx, 1);
  }

  return {
    values: chosen,
    lastEntropy: lastEntropy!
  };
}
