import React, { useState } from 'react';
import { X, Trash2, Coins, Dice5, Disc, Sparkles, Clock, ShieldCheck, Radio } from 'lucide-react';
import { OracleDecisionType, OracleHistoryEntry } from '../utils/oracleHistory';

interface OracleHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  entries: OracleHistoryEntry[];
  onClearHistory: () => void;
}

const FILTER_OPTIONS: { id: 'all' | OracleDecisionType; label: string }[] = [
  { id: 'all', label: 'Todo' },
  { id: 'moneda', label: 'Moneda' },
  { id: 'dados', label: 'Dados' },
  { id: 'ruleta', label: 'Ruleta' },
  { id: 'tarot', label: 'Tarot' },
];

export const OracleHistoryModal: React.FC<OracleHistoryModalProps> = ({
  isOpen,
  onClose,
  entries,
  onClearHistory,
}) => {
  const [filter, setFilter] = useState<'all' | OracleDecisionType>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  if (!isOpen) return null;

  const filtered = filter === 'all' ? entries : entries.filter((e) => e.type === filter);

  const getTypeIcon = (type: OracleDecisionType) => {
    switch (type) {
      case 'moneda':
        return <Coins className="w-4 h-4 text-[#ffd15c]" />;
      case 'dados':
        return <Dice5 className="w-4 h-4 text-[#38bdf8]" />;
      case 'ruleta':
        return <Disc className="w-4 h-4 text-emerald-400" />;
      case 'tarot':
        return <Sparkles className="w-4 h-4 text-violet-300" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080e]/85 backdrop-blur-md">
      <div className="w-full max-w-md max-h-[85dvh] flex flex-col rounded-2xl bg-[#0c1322] border border-[#dfb15b]/40 shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#1e293b] flex items-center justify-between bg-[#080d16]">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#ffd15c]" />
            <div>
              <h3 className="font-cinzel text-sm font-bold text-[#f8fafc] tracking-wide">
                Bitácora del Oráculo
              </h3>
              <p className="text-[10px] font-mono text-[#94a3b8]">
                Registro local en dispositivo ({entries.length})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="min-h-[36px] px-3 rounded-lg bg-[#162238] text-xs font-medium text-[#cbd5e1] hover:text-white hover:bg-[#1e293b] transition-colors flex items-center gap-1"
          >
            <X className="w-3.5 h-3.5" />
            <span>Cerrar</span>
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="px-3 pt-2.5 pb-2 border-b border-[#1e293b] flex items-center gap-1 overflow-x-auto bg-[#0a0f1a]">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-3 py-1.5 rounded-lg text-[11px] font-cinzel font-semibold whitespace-nowrap transition-colors ${
                filter === opt.id
                  ? 'bg-[#dfb15b] text-[#0d0903]'
                  : 'text-[#94a3b8] hover:text-white bg-[#101829]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Entries List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
          {filtered.length === 0 ? (
            <div className="py-10 px-4 text-center space-y-2">
              <Sparkles className="w-8 h-8 text-[#dfb15b]/40 mx-auto" />
              <div className="font-cinzel text-sm text-[#cbd5e1]">Sin registros aún</div>
              <p className="text-xs text-[#64748b] font-garamond italic">
                Cada moneda, dado, giro de ruleta o lectura de tarot quedará sellada aquí con su huella criptográfica.
              </p>
            </div>
          ) : (
            filtered.map((entry) => {
              const isTrng = entry.source === 'RANDOM_ORG_ATMOSPHERIC';
              return (
                <div
                  key={entry.id}
                  className="p-3 rounded-xl bg-[#080d16] border border-[#1e293b] space-y-1.5 text-left"
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-[#101829] border border-[#1e293b] flex items-center justify-center shrink-0">
                        {getTypeIcon(entry.type)}
                      </div>
                      <div className="min-w-0">
                        <div className="font-cinzel text-xs font-bold text-[#f8fafc] truncate">
                          {entry.resultTitle}
                        </div>
                        <div className="text-[10px] font-mono text-[#64748b]">
                          {entry.dateLabel} · {entry.timeLabel}
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div
                        className={`inline-flex items-center gap-1 text-[9px] font-mono ${
                          isTrng ? 'text-emerald-400' : 'text-[#7dd3fc]'
                        }`}
                      >
                        {isTrng ? <Radio className="w-2.5 h-2.5" /> : <ShieldCheck className="w-2.5 h-2.5" />}
                        <span>{isTrng ? 'TRNG' : 'CSPRNG'}</span>
                      </div>
                      <div className="text-[9px] font-mono text-[#94a3b8] tabular-nums">
                        {entry.seedHex}
                      </div>
                    </div>
                  </div>

                  {entry.question && (
                    <div className="text-[11px] font-garamond italic text-[#ffd15c]/90 bg-[#101829]/70 px-2.5 py-1 rounded-lg border border-[#dfb15b]/20">
                      “{entry.question}”
                    </div>
                  )}

                  {entry.resultDetail && (
                    <p className="text-[11px] text-[#94a3b8] leading-snug line-clamp-2">
                      {entry.resultDetail}
                    </p>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        {entries.length > 0 && (
          <div className="p-3 border-t border-[#1e293b] bg-[#080d16] flex items-center justify-between">
            {!confirmClear ? (
              <button
                onClick={() => setConfirmClear(true)}
                className="text-xs text-rose-300 hover:text-rose-200 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg hover:bg-rose-950/30 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Limpiar bitácora</span>
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full justify-between">
                <span className="text-[11px] text-rose-300">¿Borrar historial local?</span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setConfirmClear(false)}
                    className="px-2.5 py-1 rounded-lg bg-[#162238] text-[11px] text-[#cbd5e1]"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={() => {
                      onClearHistory();
                      setConfirmClear(false);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-rose-700 text-[11px] text-white font-semibold"
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            )}

            {!confirmClear && (
              <span className="text-[10px] text-[#64748b] font-mono">
                100% Privado · Solo en tu dispositivo
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
