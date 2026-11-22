import crypto from 'crypto';

/**
 * Script de Verificación Estadística y Prueba de Bondad de Ajuste Chi-Cuadrado (χ²)
 * 600.000 lanzamientos para dados d6, d20 y ruleta de 7 opciones.
 */

// Algoritmo matemático riguroso con muestreo por rechazo sobre 2^32 estados
function sampleCsprng(min, max) {
  const range = max - min + 1;
  const totalStates = 0x100000000; // 2^32 = 4294967296
  const limit = totalStates - (totalStates % range);

  const buf = new Uint32Array(1);
  let val;
  do {
    crypto.getRandomValues(buf);
    val = buf[0];
  } while (val >= limit);

  return min + (val % range);
}

// Cálculo de función de distribución acumulada Chi-Cuadrado (Aproximación de Wilson-Hilferty / Gamma Incompleta)
function gammaIncLower(s, z) {
  let sum = 1.0 / s;
  let term = 1.0 / s;
  for (let n = 1; n < 120; n++) {
    term *= z / (s + n);
    sum += term;
    if (term < 1e-14 * sum) break;
  }
  return sum * Math.pow(z, s) * Math.exp(-z);
}

function gamma(z) {
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

function chiSquarePValue(chi2, df) {
  if (chi2 < 0 || df <= 0) return 0;
  const k = df / 2;
  const x = chi2 / 2;
  const cdf = gammaIncLower(k, x) / gamma(k);
  return Math.max(0, Math.min(1, 1 - cdf));
}

function runBenchmark(name, min, max, totalRolls) {
  console.log(`\n======================================================`);
  console.log(`EJECUTANDO PRUEBA ESTADÍSTICA: ${name}`);
  console.log(`Muestras: ${totalRolls.toLocaleString()} tiradas | Rango: [${min}, ${max}]`);
  console.log(`======================================================`);

  const range = max - min + 1;
  const counts = new Array(range).fill(0);
  const expectedPerBucket = totalRolls / range;

  const t0 = Date.now();
  for (let i = 0; i < totalRolls; i++) {
    const val = sampleCsprng(min, max);
    counts[val - min]++;
  }
  const elapsedMs = Date.now() - t0;

  console.log(`Tiempo de ejecución: ${elapsedMs} ms (${Math.round((totalRolls / elapsedMs) * 1000).toLocaleString()} ops/seg)\n`);
  console.log(`Frecuencia esperada por valor: ${expectedPerBucket.toLocaleString('es-ES')}\n`);

  let chi2 = 0;
  console.log(`Valor | Conteos Observados | Desviación | Desviación %`);
  console.log(`------+--------------------+------------+-------------`);

  for (let i = 0; i < range; i++) {
    const observed = counts[i];
    const diff = observed - expectedPerBucket;
    const diffPct = ((diff / expectedPerBucket) * 100).toFixed(3);
    chi2 += (diff * diff) / expectedPerBucket;

    const label = (min + i).toString().padStart(5);
    const obsStr = observed.toLocaleString('es-ES').padStart(18);
    const diffStr = (diff >= 0 ? `+${diff}` : `${diff}`).padStart(10);
    const pctStr = (diffPct >= 0 ? `+${diffPct}` : `${diffPct}`).padStart(10) + '%';

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
  
  let interpretacion = '';
  if (pValue >= 0.05) {
    interpretacion = 'PASÓ CON ÉXITO (No hay evidencia estadística de sesgo; distribución compatible con aleatoriedad uniforme perfecta a nivel α=0.05)';
  } else if (pValue >= 0.01) {
    interpretacion = 'ZONA MARGINAL (p entre 0.01 y 0.05; variabilidad estocástica esperable ocasionalmente, normal en tests masivos repetidos)';
  } else {
    interpretacion = 'ANOMALÍA DETECTADA (p < 0.01; posible asimetría)';
  }

  console.log(`Conclusión:                    ${interpretacion}`);
  console.log(`------------------------------------------------------`);

  return { chi2, df, pValue };
}

// 1. Prueba de 600.000 tiradas de Dado de 6 caras (d6)
runBenchmark('Dado d6 (6 caras)', 1, 6, 600000);

// 2. Prueba de 600.000 tiradas de Dado de 20 caras (d20)
runBenchmark('Dado d20 (20 caras)', 1, 20, 600000);

// 3. Prueba de 600.000 giros de Ruleta con 7 opciones
runBenchmark('Ruleta de 7 opciones (1 a 7)', 1, 7, 600000);
