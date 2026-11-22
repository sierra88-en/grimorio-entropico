import { getLocalCsprngInteger } from '../src/utils/entropyEngine';

/**
 * SCRIPT DE AUDITORÍA ESTADÍSTICA DE PRODUCCIÓN
 * Ejecuta pruebas de bondad de ajuste Chi-Cuadrado (χ²) sobre la función REAL
 * exportada por src/utils/entropyEngine.ts (getLocalCsprngInteger).
 *
 * Muestras: 600.000 lanzamientos para:
 *  1. Dado d6 (1 a 6)
 *  2. Dado d20 (1 a 20)
 *  3. Ruleta de 7 opciones (1 a 7)
 */

function gammaIncLower(s: number, z: number): number {
  let sum = 1.0 / s;
  let term = 1.0 / s;
  for (let n = 1; n < 120; n++) {
    term *= z / (s + n);
    sum += term;
    if (term < 1e-14 * sum) break;
  }
  return sum * Math.pow(z, s) * Math.exp(-z);
}

function gamma(z: number): number {
  const g = 7;
  const C = [
    0.99999999999980993,
    676.5203681218851,
    -1259.1392167224028,
    771.32342877765313,
    -176.61502916214059,
    12.507343278686905,
    -0.138571095836524,
    9.9843695780195716e-6,
    1.5056327351493116e-7
  ];
  if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
  z -= 1;
  let x = C[0];
  for (let i = 1; i < g + 2; i++) x += C[i] / (z + i);
  const t = z + g + 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
}

function chiSquarePValue(chi2: number, df: number): number {
  if (chi2 < 0 || df <= 0) return 0;
  const k = df / 2;
  const x = chi2 / 2;
  const cdf = gammaIncLower(k, x) / gamma(k);
  return Math.max(0, Math.min(1, 1 - cdf));
}

export function runStatisticalTest(name: string, min: number, max: number, totalRolls: number) {
  console.log(`\n======================================================`);
  console.log(`AUDITORÍA EN VIVO: ${name}`);
  console.log(`Módulo importado: src/utils/entropyEngine.ts -> getLocalCsprngInteger`);
  console.log(`Muestras: ${totalRolls.toLocaleString()} | Rango: [${min}, ${max}]`);
  console.log(`======================================================`);

  const range = max - min + 1;
  const counts = new Array<number>(range).fill(0);
  const expectedPerBucket = totalRolls / range;

  const t0 = Date.now();
  for (let i = 0; i < totalRolls; i++) {
    // LLAMADA DIRECTA AL CÓDIGO REAL DE PRODUCCIÓN:
    const res = getLocalCsprngInteger(min, max);
    counts[res.value - min]++;
  }
  const elapsedMs = Date.now() - t0;

  console.log(`Tiempo: ${elapsedMs} ms (${Math.round((totalRolls / elapsedMs) * 1000).toLocaleString()} ops/s)\n`);
  console.log(`Frecuencia esperada por resultado: ${expectedPerBucket.toLocaleString('es-ES')}\n`);

  let chi2 = 0;
  console.log(`Valor | Conteos Observados | Desviación | Desviación %`);
  console.log(`------+--------------------+------------+-------------`);

  for (let i = 0; i < range; i++) {
    const observed = counts[i];
    const diff = observed - expectedPerBucket;
    const diffPctNum = (diff / expectedPerBucket) * 100;
    const diffPctStr = diffPctNum.toFixed(3);
    chi2 += (diff * diff) / expectedPerBucket;

    const label = (min + i).toString().padStart(5);
    const obsStr = observed.toLocaleString('es-ES').padStart(18);
    const diffStr = (diff >= 0 ? `+${diff}` : `${diff}`).padStart(10);
    const pctStr = (diffPctNum >= 0 ? `+${diffPctStr}` : `${diffPctStr}`).padStart(10) + '%';

    if (range <= 20 || i < 5 || i >= range - 5) {
      console.log(`${label} | ${obsStr} | ${diffStr} | ${pctStr}`);
    } else if (i === 5) {
      console.log(`  ... |                ... |        ... |         ...`);
    }
  }

  const df = range - 1;
  const pValue = chiSquarePValue(chi2, df);

  console.log(`\n------------------------------------------------------`);
  console.log(`Estadístico Chi-Cuadrado (χ²): ${chi2.toFixed(4)}`);
  console.log(`Grados de Libertad (df):       ${df}`);
  console.log(`Valor p (p-value):             ${pValue.toFixed(5)}`);

  let conclusion = '';
  if (pValue >= 0.05) {
    conclusion = 'PASÓ CON ÉXITO (Distribución compatible con aleatoriedad uniforme a nivel α=0.05)';
  } else if (pValue >= 0.01) {
    conclusion = 'ZONA MARGINAL (p entre 0.01 y 0.05; variabilidad estocástica esperable ocasionalmente)';
  } else {
    conclusion = 'RECHAZADA HIPÓTESIS NULA (p < 0.01; posible anomalía)';
  }

  console.log(`Conclusión:                    ${conclusion}`);
  console.log(`------------------------------------------------------`);

  return { chi2, df, pValue, counts };
}

// Ejecución directa de los 3 casos solicitados:
runStatisticalTest('Dado d6 (6 caras)', 1, 6, 600000);
runStatisticalTest('Dado d20 (20 caras)', 1, 20, 600000);
runStatisticalTest('Ruleta de 7 opciones (1 a 7)', 1, 7, 600000);
