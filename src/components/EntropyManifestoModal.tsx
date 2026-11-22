import React from 'react';
import { X, Radio, ShieldCheck, Cpu, GitBranch, ExternalLink, Zap } from 'lucide-react';

interface EntropyManifestoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EntropyManifestoModal: React.FC<EntropyManifestoModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05040a]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-[#0f0c1a] border border-[#d4af37]/40 shadow-2xl text-left space-y-6">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#1a1426] text-[#8c829e] hover:text-[#f5ebd7] hover:bg-[#271e38] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37] uppercase tracking-wider mb-1">
            <span>The Universe Decides · Arquitectura de Incerteza</span>
          </div>
          <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5ebd7]">
            Fuentes de aleatoriedad
          </h2>
          <p className="text-xs text-[#958ea3] mt-1">
            Descripción de las rutas que la app intenta usar; la fuente externa no se verifica de forma independiente.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* TRNG */}
          <div className="p-4 rounded-xl bg-[#141d1a] border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-cinzel text-sm font-bold">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Servicio externo: RANDOM.ORG</span>
            </div>
            <p className="text-xs text-[#b8d4c8] leading-relaxed">
              La aplicación solicita enteros a <strong>RANDOM.ORG</strong>. El proveedor describe su fuente como ruido atmosférico; este cliente no mide ni verifica por sí mismo cómo se genera cada valor.
            </p>
            <div className="text-[10px] font-mono text-emerald-400/90 pt-1 border-t border-emerald-500/20">
              Servicio de terceros · Requiere conexión
            </div>
          </div>

          {/* CSPRNG */}
          <div className="p-4 rounded-xl bg-[#211a14] border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Reserva local: Web Crypto</span>
            </div>
            <p className="text-xs text-[#ded1b6] leading-relaxed">
              <strong>crypto.getRandomValues()</strong>. Si la solicitud externa falla o no hay conexión, el navegador genera valores localmente. Aplica muestreo por rechazo para evitar sesgo de módulo al mapear los valores fuente al rango elegido.
            </p>
            <div className="text-[10px] font-mono text-amber-400/90 pt-1 border-t border-amber-500/20">
              API criptográfica del navegador · Mapeo por rechazo
            </div>
          </div>
        </div>

        {/* Fallback Waterfall Diagram */}
        <div className="p-4 rounded-xl bg-[#130f21] border border-[#2b223c] space-y-3">
          <div className="text-xs font-cinzel font-bold text-[#d4af37] uppercase tracking-wider flex items-center gap-2">
            <GitBranch className="w-4 h-4" />
            <span>Cascada de Tolerancia a Fallos (Fallback Waterfall)</span>
          </div>

          <div className="font-mono text-[11px] text-[#baaecd] bg-[#09080e] p-3 rounded-lg border border-[#231b32] space-y-1.5 leading-relaxed overflow-x-auto">
            <div>1. Solicitud de Decisión (Tarot o Moneda)</div>
            <div className="text-emerald-400">├──► Petición HTTP a RANDOM.ORG [timeout]</div>
            <div className="text-emerald-300">│    └── Éxito: Badge "RANDOM.ORG" (Verde)</div>
            <div className="text-amber-400">└──► Fallo de Red / Cuota Excedida / Timeout</div>
            <div className="text-amber-300">     └── Fallback: crypto.getRandomValues() [Badge Ámbar]</div>
          </div>

          <p className="text-xs text-[#958ea3]">
            <strong>Principio de Transparencia Algorítmica:</strong> La app nunca disfraza un resultado local como atmosférico. La procedencia exacta de cada tirada se muestra en el distintivo de auditoría.
          </p>
        </div>

        {/* References to Paper */}
        <div className="text-xs text-[#7e7491] pt-3 border-t border-[#231d30] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Adaptación de The Universe Decides, proyecto de Vitor Hugo publicado bajo MIT.
          </div>
          <a
            href="https://github.com/hugoalves-dev/the_universe_decides"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-[#d4af37] hover:underline"
          >
            <span>Ver Proyecto en GitHub</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
};
