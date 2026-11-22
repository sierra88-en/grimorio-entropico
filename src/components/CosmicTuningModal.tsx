import React, { useEffect, useState } from 'react';
import { Sparkles, Radio, Activity } from 'lucide-react';

interface CosmicTuningModalProps {
  isOpen: boolean;
  targetMode: 'tarot' | 'moneda';
}

const TUNING_STEPS = [
  'Preparando la consulta al servicio de aleatoriedad...',
  'Esperando respuesta del proveedor externo...',
  'Si la consulta falla, se usará Web Crypto del navegador...',
  'Aplicando el mapeo por rechazo al rango solicitado...',
  'Preparando el resultado...'
];

export const CosmicTuningModal: React.FC<CosmicTuningModalProps> = ({ isOpen, targetMode }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [frequency, setFrequency] = useState(432);

  useEffect(() => {
    if (!isOpen) {
      setStepIndex(0);
      return;
    }

    const interval = setInterval(() => {
      setStepIndex((prev) => (prev < TUNING_STEPS.length - 1 ? prev + 1 : prev));
      setFrequency((prev) => Math.floor(prev + (Math.random() * 40 - 20)));
    }, 450);

    return () => clearInterval(interval);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05040a]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-2xl bg-[#0f0c1a] border border-[#d4af37]/40 shadow-2xl shadow-[#d4af37]/20 text-center overflow-hidden">
        {/* Mystic Background Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-[#d4af37]/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-[#633e94]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Astrolabe Spinning Rings */}
        <div className="relative w-36 h-36 mx-auto mb-6 flex items-center justify-center">
          {/* Outer ring */}
          <div className="absolute inset-0 rounded-full border border-dashed border-[#d4af37]/40 animate-[spin_12s_linear_infinite]" />
          {/* Middle ring with astrological marks */}
          <div className="absolute inset-2 rounded-full border border-double border-[#958ea3]/30 animate-[spin_8s_linear_infinite_reverse]" />
          {/* Inner ring */}
          <div className="absolute inset-6 rounded-full border border-[#d4af37]/60 animate-pulse" />
          
          {/* Center sigil */}
          <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9b722d] via-[#d4af37] to-[#fff4c4] p-0.5 shadow-lg shadow-[#d4af37]/30">
            <div className="w-full h-full rounded-full bg-[#0d0b17] flex items-center justify-center text-[#d4af37]">
              {targetMode === 'tarot' ? (
                <Sparkles className="w-7 h-7 animate-spin duration-3000" />
              ) : (
                <Radio className="w-7 h-7 animate-pulse text-[#d4af37]" />
              )}
            </div>
          </div>
        </div>

        {/* Title */}
        <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-widest text-[#f5ebd7] mb-2">
          {targetMode === 'tarot' ? 'Sintonizando el Arcano Mayor' : 'Invocando la Tirada Alquímica'}
        </h3>

        {/* Live Frequency & Oscilloscope */}
        <div className="inline-flex items-center gap-2 px-3 py-1 mb-4 rounded-full bg-[#181426] border border-[#372d4c] text-xs font-mono text-[#d4af37]">
          <Activity className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
          <span>Ritmo visual: {frequency}</span>
          <span className="text-[#6d6382]">|</span>
          <span className="text-[10px] text-emerald-300">ANIMACIÓN</span>
        </div>

        {/* Animated wave bars */}
        <div className="flex items-center justify-center gap-1 h-8 mb-5">
          {[40, 75, 55, 90, 65, 80, 45, 95, 70, 50, 85, 60, 40].map((h, i) => (
            <div
              key={i}
              className="w-1 bg-gradient-to-t from-[#9b722d] to-[#f4e295] rounded-full transition-all duration-200"
              style={{
                height: `${Math.max(15, (h * (0.6 + Math.sin(Date.now() / 200 + i) * 0.4)))}%`,
                opacity: 0.6 + (i % 3) * 0.15
              }}
            />
          ))}
        </div>

        {/* Dynamic step readout */}
        <div className="min-h-[44px] flex items-center justify-center px-4">
          <p className="text-xs sm:text-sm font-garamond italic text-[#c9bfd9] transition-all duration-300">
            "{TUNING_STEPS[stepIndex]}"
          </p>
        </div>

        {/* Transparency disclaimer */}
        <p className="mt-4 text-[10px] font-mono text-[#746b85] uppercase tracking-wider">
          Animación decorativa · No representa una medición física
        </p>
      </div>
    </div>
  );
};
