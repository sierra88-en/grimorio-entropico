import React from 'react';
import { Radio, ShieldCheck, Zap, Info } from 'lucide-react';
import { EntropyResult } from '../utils/entropyEngine';

interface EntropyBadgeProps {
  entropy: EntropyResult | null;
  onOpenDetails?: () => void;
}

export const EntropyBadge: React.FC<EntropyBadgeProps> = ({ entropy, onOpenDetails }) => {
  if (!entropy) {
    return (
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-[#13101f] border border-[#2b243b] text-xs text-[#8c829e]">
        <span className="w-2 h-2 rounded-full bg-[#524869] animate-pulse"></span>
        <span className="font-mono text-[11px]">Motor de Entropía: En espera de invocación</span>
      </div>
    );
  }

  const isTrng = entropy.source === 'RANDOM_ORG_ATMOSPHERIC';

  return (
    <div
      onClick={onOpenDetails}
      className={`inline-flex flex-wrap items-center gap-2 px-3 py-1.5 rounded-md border text-xs transition-all ${
        isTrng
          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200 hover:border-emerald-400'
          : 'bg-amber-950/30 border-amber-500/40 text-amber-200 hover:border-amber-400'
      } ${onOpenDetails ? 'cursor-pointer hover:shadow-md' : ''}`}
      title="Haz clic para ver la auditoría de entropía y verificación técnica"
    >
      <div className="flex items-center gap-1.5 font-medium">
        {isTrng ? (
          <>
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="font-cinzel tracking-wider font-semibold">
              RANDOM.ORG (servicio externo)
            </span>
          </>
        ) : (
          <>
            <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-cinzel tracking-wider font-semibold">
              Web Crypto Local (CSPRNG)
            </span>
          </>
        )}
      </div>

      <div className="flex items-center gap-2 text-[10px] font-mono opacity-85 border-l border-current/20 pl-2">
        <span className="flex items-center gap-0.5">
          <Zap className="w-2.5 h-2.5" />
          {entropy.latencyMs}ms
        </span>
        <span className="hidden sm:inline">·</span>
        <span className="hidden sm:inline font-mono">{entropy.seedHex}</span>
        {onOpenDetails && <Info className="w-3 h-3 text-current ml-0.5 opacity-70" />}
      </div>
    </div>
  );
};
