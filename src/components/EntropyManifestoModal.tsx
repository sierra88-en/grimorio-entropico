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
            Manifiesto de Entropía Física & Algorítmica
          </h2>
          <p className="text-xs text-[#958ea3] mt-1">
            Fundamento científico de aleatoriedad genuina para la resolución de parálisis por análisis.
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* TRNG */}
          <div className="p-4 rounded-xl bg-[#141d1a] border border-emerald-500/30 space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-cinzel text-sm font-bold">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>Fuente Primaria: TRNG Físico</span>
            </div>
            <p className="text-xs text-[#b8d4c8] leading-relaxed">
              <strong>Ruido Atmosférico Planetario (RANDOM.ORG)</strong>. Capturado por receptores de radio que registran las descargas electrostáticas y relámpagos que cruzan la atmósfera de la Tierra en tiempo real. No existe ecuación matemática que pueda predecir el resultado.
            </p>
            <div className="text-[10px] font-mono text-emerald-400/90 pt-1 border-t border-emerald-500/20">
              Incertidumbre Física Pura · Cero Sesgo Humano
            </div>
          </div>

          {/* CSPRNG */}
          <div className="p-4 rounded-xl bg-[#211a14] border border-amber-500/30 space-y-2">
            <div className="flex items-center gap-2 text-amber-300 font-cinzel text-sm font-bold">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Fuente de Reserva: CSPRNG de Kernel</span>
            </div>
            <p className="text-xs text-[#ded1b6] leading-relaxed">
              <strong>window.crypto.getRandomValues()</strong>. Si la red falla o se agota la cuota del servidor, se activa la reserva del sistema operativo (<code className="text-[#f4e295]">/dev/urandom</code> en Linux/Android). Aplica muestreo por rechazo para erradicar el <em>Modulo Bias</em>.
            </p>
            <div className="text-[10px] font-mono text-amber-400/90 pt-1 border-t border-amber-500/20">
              Criptográficamente Seguro · Uniformidad Matemática
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
            <div className="text-emerald-400">├──► Petición HTTP a RANDOM.ORG (Ruido Atmosférico) [Timeout 3.2s]</div>
            <div className="text-emerald-300">│    └── Éxito: Badge "Ruido Atmosférico Físico" (Verde)</div>
            <div className="text-amber-400">└──► Fallo de Red / Cuota Excedida / Timeout</div>
            <div className="text-amber-300">     └── Fallback: CSPRNG de Kernel (window.crypto) [Badge Ámbar]</div>
          </div>

          <p className="text-xs text-[#958ea3]">
            <strong>Principio de Transparencia Algorítmica:</strong> La app nunca disfraza un resultado local como atmosférico. La procedencia exacta de cada tirada se muestra en el distintivo de auditoría.
          </p>
        </div>

        {/* References to Paper */}
        <div className="text-xs text-[#7e7491] pt-3 border-t border-[#231d30] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div>
            Basado en la arquitectura de Vitor Hugo (<em>com.hugo.theuniversedecides</em>).
          </div>
          <a
            href="https://github.com/vitorhugo-dotnet/the_universe_decides"
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
