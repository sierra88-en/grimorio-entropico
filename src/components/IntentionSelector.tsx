import React from 'react';
import { Heart, Briefcase, Sparkles } from 'lucide-react';
import { INTENCIONES, IntencionTipo } from '../data/tarotData';
import { sound } from '../utils/audio';

interface IntentionSelectorProps {
  selectedIntencion: IntencionTipo;
  onSelect: (intencion: IntencionTipo) => void;
  disabled?: boolean;
}

export const IntentionSelector: React.FC<IntentionSelectorProps> = ({
  selectedIntencion,
  onSelect,
  disabled = false,
}) => {
  const getIcon = (name: string, isSelected: boolean) => {
    const className = `w-4 h-4 transition-transform duration-300 ${isSelected ? 'scale-110 text-[#f5ebd7]' : 'text-[#8d82a1]'}`;
    switch (name) {
      case 'Heart':
        return <Heart className={className} />;
      case 'Briefcase':
        return <Briefcase className={className} />;
      case 'Sparkles':
      default:
        return <Sparkles className={className} />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2.5">
        <label className="text-xs font-cinzel font-semibold tracking-wider text-[#dcd2be] flex items-center gap-1.5 uppercase">
          <span className="text-[#d4af37]">✦</span>
          <span>Intención de la Consulta</span>
        </label>
        <span className="text-[11px] text-[#958ea3]">
          El oráculo canalizará el mensaje hacia este plano
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
        {INTENCIONES.map((intencion) => {
          const isSelected = selectedIntencion === intencion.id;

          return (
            <button
              key={intencion.id}
              type="button"
              disabled={disabled}
              onClick={() => {
                sound.playClick();
                onSelect(intencion.id);
              }}
              className={`group text-left p-3 rounded-lg border transition-all duration-200 relative overflow-hidden ${
                isSelected
                  ? 'bg-gradient-to-br from-[#1e172d] to-[#271d3d] border-[#d4af37] shadow-lg shadow-[#d4af37]/15 ring-1 ring-[#d4af37]/50'
                  : 'bg-[#120f1f]/80 border-[#2b243b] hover:bg-[#181429] hover:border-[#43375e] text-[#a59cb6]'
              } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {/* Subtle gold line when active */}
              {isSelected && (
                <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#d4af37] to-transparent" />
              )}

              <div className="flex items-center gap-2.5 mb-1">
                <div
                  className={`p-1.5 rounded-md border ${
                    isSelected
                      ? 'bg-[#d4af37]/20 border-[#d4af37]/40 text-[#f4e295]'
                      : 'bg-[#1b172a] border-[#2b243b] text-[#807693]'
                  }`}
                >
                  {getIcon(intencion.iconName, isSelected)}
                </div>
                <div className="font-cinzel text-xs sm:text-sm font-bold tracking-wide text-[#f5ebd7]">
                  {intencion.label}
                </div>
              </div>

              <p className="text-[11px] text-[#8f85a1] leading-relaxed line-clamp-2 pl-8">
                {intencion.sublabel}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
