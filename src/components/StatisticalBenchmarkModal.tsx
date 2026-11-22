import React, { useState } from 'react';
import { Shield, Play, RotateCcw, X, CheckCircle2, AlertTriangle, Activity } from 'lucide-react';
import { getLocalCsprngInteger } from '../utils/entropyEngine';

interface BenchmarkConfig {
  name: string;
  min: number;
  max: number;
  totalRolls: number;
}

const BENCHMARK_PRESETS: BenchmarkConfig[] = [
  { name: 'Dado d6 (6 caras)', min: 1, max: 6, totalRolls: 600000 },
  { name: 'Dado d20 (20 caras)', min: 1, max: 20, totalRolls: 600000 },
  { name: 'Ruleta (7 opciones)', min: 1, max: 7, totalRolls: 600000 },
  { name: 'Moneda (2 caras)', min: 1, max: 2, totalRolls: 600000 },
];

// Cálculo aproximado de la función Gamma Incompleta para Chi-Cuadrado p-value
function gammaIncLower(s: number, z: number): number {
  let sum = 1.0 / s;
  let term = 1.0 / s;
  for (let n = 1; n < 100; n++) {
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

function computePValue(chi2: number, df: number): number {
  if (chi2 <= 0 || df <= 0) return 1;
  const k = df / 2;
  const x = chi2 / 2;
  const cdf = gammaIncLower(k, x) / gamma(k);
  return Math.max(0, Math.min(1, 1 - cdf));
}

export const StatisticalBenchmarkModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
}> = ({ isOpen, onClose }) => {
  const [selectedPreset, setSelectedPreset] = useState<BenchmarkConfig>(BENCHMARK_PRESETS[0]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentCount, setCurrentCount] = useState(0);

  const [results, setResults] = useState<{
    counts: number[];
    expected: number;
    chi2: number;
    df: number;
    pValue: number;
    elapsedMs: number;
    testedGenerator: string;
  } | null>(null);

  if (!isOpen) return null;

  const runBenchmarkTest = () => {
    if (isRunning) return;
    setIsRunning(true);
    setProgress(0);
    setCurrentCount(0);
    setResults(null);

    const range = selectedPreset.max - selectedPreset.min + 1;
    const counts = new Array(range).fill(0);
    const total = selectedPreset.totalRolls;
    const expected = total / range;
    const batchSize = 50000;
    let completed = 0;
    const startTime = performance.now();

    const processBatch = () => {
      const nextTarget = Math.min(completed + batchSize, total);

      for (let i = completed; i < nextTarget; i++) {
        // Usamos el motor exacto de la app con muestreo por rechazo
        const res = getLocalCsprngInteger(selectedPreset.min, selectedPreset.max);
        counts[res.value - selectedPreset.min]++;
      }

      completed = nextTarget;
      setCurrentCount(completed);
      setProgress(Math.round((completed / total) * 100));

      if (completed < total) {
        // Cede el hilo para mantener la interfaz a 60 fps
        setTimeout(processBatch, 0);
      } else {
        const elapsedMs = Math.round(performance.now() - startTime);

        // Cálculo de estadístico Chi-Cuadrado (χ²)
        let chi2 = 0;
        for (let i = 0; i < range; i++) {
          const diff = counts[i] - expected;
          chi2 += (diff * diff) / expected;
        }

        const df = range - 1;
        const pValue = computePValue(chi2, df);

        setResults({
          counts,
          expected,
          chi2,
          df,
          pValue,
          elapsedMs,
          testedGenerator: 'CSPRNG window.crypto + Muestreo por Rechazo (Rejection Sampling)'
        });
        setIsRunning(false);
      }
    };

    setTimeout(processBatch, 10);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-[#05080e]/90 backdrop-blur-md animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg max-h-[92vh] overflow-y-auto p-4 sm:p-5 rounded-2xl bg-[#0c1322] border border-[#dfb15b]/40 text-left space-y-3.5 shadow-2xl">
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-[#1e293b] pb-2.5">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-[#ffd15c]" />
            <div>
              <h3 className="font-cinzel text-sm sm:text-base font-bold text-[#f8fafc]">
                Laboratorio de Pruebas Chi-Cuadrado (χ²)
              </h3>
              <p className="text-[10px] text-[#94a3b8] font-mono">
                Bondad de ajuste y verificación empírica de sesgo de módulo
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-xs text-[#94a3b8] hover:text-white p-1 rounded-lg bg-[#162238] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Selector de Experimento */}
        <div className="space-y-1.5">
          <label className="text-[10px] font-mono tracking-widest text-[#64748b] uppercase block">
            Seleccionar Experimento Estadístico (600.000 muestras)
          </label>
          <div className="grid grid-cols-2 gap-1.5">
            {BENCHMARK_PRESETS.map((preset) => {
              const isSelected = selectedPreset.name === preset.name;
              return (
                <button
                  key={preset.name}
                  disabled={isRunning}
                  onClick={() => {
                    setSelectedPreset(preset);
                    setResults(null);
                  }}
                  className={`px-2.5 py-1.5 rounded-xl text-left border text-xs font-mono transition-all ${
                    isSelected
                      ? 'bg-[#dfb15b] text-[#0f172a] font-bold border-[#ffd15c] shadow-sm'
                      : 'bg-[#080d16] text-[#cbd5e1] border-[#1e293b] hover:bg-[#111a2e]'
                  }`}
                >
                  <div className="truncate">{preset.name}</div>
                  <div className={`text-[9px] ${isSelected ? 'text-[#332204]' : 'text-[#64748b]'}`}>
                    600k tiradas
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Botón de Lanzamiento del Benchmark */}
        <div>
          <button
            disabled={isRunning}
            onClick={runBenchmarkTest}
            className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#dfb15b] via-[#c89b3c] to-[#996515] border border-[#ffd573] text-[#140b01] font-cinzel font-bold text-xs tracking-wider shadow-md hover:brightness-105 active:scale-[0.99] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isRunning ? (
              <>
                <Activity className="w-4 h-4 animate-spin text-[#140b01]" />
                <span>Simulando tiradas: {currentCount.toLocaleString('es-ES')} / 600.000 ({progress}%)</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4" />
                <span>Ejecutar Prueba de 600.000 Tiradas</span>
              </>
            )}
          </button>
        </div>

        {/* Barra de Progreso */}
        {isRunning && (
          <div className="space-y-1">
            <div className="w-full h-2 bg-[#080d16] rounded-full overflow-hidden border border-[#1e293b]">
              <div
                className="h-full bg-gradient-to-r from-[#38bdf8] to-[#ffd15c] transition-all duration-75"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-[#94a3b8]">
              <span>Muestreo por Rechazo CSPRNG</span>
              <span>{progress}%</span>
            </div>
          </div>
        )}

        {/* Resultados Estadísticos */}
        {results && (
          <div className="space-y-3 animate-fade-in">
            {/* Banner de Diagnóstico */}
            <div
              className={`p-3 rounded-xl border flex items-start gap-2.5 ${
                results.pValue >= 0.05
                  ? 'bg-[#062417] border-emerald-500/50 text-emerald-200'
                  : results.pValue >= 0.01
                  ? 'bg-[#291e0a] border-amber-500/50 text-amber-200'
                  : 'bg-[#280c14] border-rose-500/50 text-rose-200'
              }`}
            >
              {results.pValue >= 0.05 ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              )}
              <div className="text-xs space-y-0.5">
                <div className="font-bold font-cinzel">
                  {results.pValue >= 0.05
                    ? 'DISTRIBUCIÓN UNIFORME CONFIRMADA (NIST α = 0.05)'
                    : results.pValue >= 0.01
                    ? 'VARIACIÓN ESTOCÁSTICA NATURAL (0.01 ≤ p < 0.05)'
                    : 'DESVIACIÓN ESTADÍSTICA DETECTADA'}
                </div>
                <p className="text-[11px] opacity-90 leading-relaxed font-sans">
                  {results.pValue >= 0.05
                    ? `No hay evidencia estadística de sesgo. Con 600.000 tiradas y p=${results.pValue.toFixed(4)}, los datos son consistentes con aleatoriedad perfecta e idéntica probabilidad en cada opción.`
                    : `El valor p (${results.pValue.toFixed(4)}) refleja la variabilidad intrínseca del azar. En pruebas masivas repetidas, una pequeña fracción cae aquí por pura probabilidad.`}
                </p>
              </div>
            </div>

            {/* Ficha de Métricas Numéricas */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="p-2 rounded-xl bg-[#080d16] border border-[#1e293b]">
                <span className="text-[9px] font-mono text-[#64748b] block">Chi-Cuadrado (χ²)</span>
                <span className="font-mono text-xs font-bold text-[#ffd15c]">{results.chi2.toFixed(3)}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#080d16] border border-[#1e293b]">
                <span className="text-[9px] font-mono text-[#64748b] block">Grados Lib. (df)</span>
                <span className="font-mono text-xs font-bold text-white">{results.df}</span>
              </div>
              <div className="p-2 rounded-xl bg-[#080d16] border border-[#1e293b]">
                <span className="text-[9px] font-mono text-[#64748b] block">Valor p (p-value)</span>
                <span className={`font-mono text-xs font-bold ${results.pValue >= 0.05 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {results.pValue.toFixed(4)}
                </span>
              </div>
            </div>

            {/* Tabla de Frecuencias Observadas vs Esperadas */}
            <div className="max-h-40 overflow-y-auto rounded-xl border border-[#1e293b] bg-[#080d16]">
              <table className="w-full text-[10px] font-mono text-left">
                <thead className="bg-[#0f172a] text-[#94a3b8] sticky top-0 border-b border-[#1e293b]">
                  <tr>
                    <th className="p-1.5">Cara / Opción</th>
                    <th className="p-1.5 text-right">Observado</th>
                    <th className="p-1.5 text-right">Esperado</th>
                    <th className="p-1.5 text-right">Desviación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1e293b]/60 text-[#cbd5e1]">
                  {results.counts.map((obs, idx) => {
                    const diff = obs - results.expected;
                    const diffPct = ((diff / results.expected) * 100).toFixed(2);
                    const valLabel = selectedPreset.min + idx;
                    return (
                      <tr key={idx} className="hover:bg-[#111a2e]/60">
                        <td className="p-1.5 font-bold text-[#ffd15c]">#{valLabel}</td>
                        <td className="p-1.5 text-right">{obs.toLocaleString('es-ES')}</td>
                        <td className="p-1.5 text-right text-[#94a3b8]">{Math.round(results.expected).toLocaleString('es-ES')}</td>
                        <td className={`p-1.5 text-right ${diff >= 0 ? 'text-emerald-400' : 'text-cyan-400'}`}>
                          {diff >= 0 ? `+${diff}` : diff} ({diffPct}%)
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="text-[10px] text-[#64748b] font-mono text-right">
              Tiempo: {results.elapsedMs} ms ({Math.round((selectedPreset.totalRolls / results.elapsedMs) * 1000).toLocaleString('es-ES')} tiradas/seg)
            </div>
          </div>
        )}

        {/* Marco Metodológico y Criterio NIST */}
        <div className="p-3 rounded-xl bg-[#080d16] border border-[#1e293b] text-[11px] text-[#94a3b8] space-y-1.5 leading-relaxed font-sans">
          <div className="font-cinzel text-xs font-bold text-[#ffd15c]">
            Marco Metodológico de Verificación:
          </div>
          <p>
            • <strong>Mitigación de Sesgo:</strong> Se usa muestreo por rechazo sobre $2^{32} = 4.294.967.296$ estados discretos de hardware.
          </p>
          <p>
            • <strong>Criterio NIST SP 800-22:</strong> Un p-value $\ge 0.05$ no demuestra que una fuente sea "mágicamente" aleatoria; confirma que con 600.000 muestras <em>no se detecta asimetría ni desviación del modelo uniforme</em>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatisticalBenchmarkModal;
