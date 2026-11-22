import React from 'react';
import { X, Crown, FileSpreadsheet, ListPlus, Sparkles, ShieldCheck } from 'lucide-react';
import { UPCOMING_PRO_FEATURES, getProEntitlementStatus } from '../utils/billingArchitecture';

interface AlchemicalProModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AlchemicalProModal: React.FC<AlchemicalProModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const status = getProEntitlementStatus();

  const getFeatureIcon = (id: string) => {
    switch (id) {
      case 'csv_export':
        return <FileSpreadsheet className="w-4 h-4 text-[#38bdf8]" />;
      case 'unlimited_presets':
        return <ListPlus className="w-4 h-4 text-emerald-400" />;
      case 'celtic_cross':
      default:
        return <Sparkles className="w-4 h-4 text-[#ffd15c]" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080e]/85 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl bg-[#0c1322] border border-[#dfb15b]/50 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] bg-gradient-to-r from-[#0e1628] via-[#131d33] to-[#0e1628] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#1d170c] border border-[#dfb15b]/50 flex items-center justify-center">
              <Crown className="w-4 h-4 text-[#ffd15c]" />
            </div>
            <div>
              <h3 className="font-cinzel text-sm font-bold text-[#f8fafc] tracking-wide">
                Edición Alquímica Pro
              </h3>
              <p className="text-[10px] font-mono text-[#dfb15b]">
                Próximamente · Versión {status.versionTarget}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#162238] text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 space-y-3 text-left">
          <p className="text-xs text-[#cbd5e1] font-garamond italic leading-relaxed">
            El núcleo del oráculo (Moneda, Dados, Ruleta, Tarot de 1 y 3 cartas, y Auditoría CSPRNG) seguirá siendo gratuito y libre de anuncios para siempre. En la versión 1.1 llegarán herramientas avanzadas opcionales:
          </p>

          <div className="space-y-2">
            {UPCOMING_PRO_FEATURES.map((feat) => (
              <div
                key={feat.id}
                className="p-3 rounded-xl bg-[#080d16] border border-[#1e293b] flex items-start gap-2.5"
              >
                <div className="w-7 h-7 rounded-lg bg-[#101829] border border-[#1e293b] flex items-center justify-center shrink-0 mt-0.5">
                  {getFeatureIcon(feat.id)}
                </div>
                <div className="min-w-0">
                  <div className="font-cinzel text-xs font-bold text-[#f8fafc]">
                    {feat.title}
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-snug mt-0.5">
                    {feat.description}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="p-2.5 rounded-xl bg-[#0a1420] border border-[#0284c7]/30 flex items-center gap-2 text-[10px] font-mono text-[#7dd3fc]">
            <ShieldCheck className="w-4 h-4 text-[#38bdf8] shrink-0" />
            <span>
              Integración nativa exclusiva mediante Google Play Billing en la actualización v1.1.
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 pb-4">
          <button
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b8860b] text-[#140b01] font-cinzel font-bold text-xs tracking-wider hover:brightness-110 transition-all"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
