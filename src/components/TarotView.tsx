import React, { useState } from 'react';
import { Sparkles, Copy, Check, RotateCw, BookOpen, Compass, ChevronRight } from 'lucide-react';
import { CartaTarot, IntencionTipo, INTENCIONES } from '../data/tarotData';
import { EntropyResult } from '../utils/entropyEngine';
import { EntropyBadge } from './EntropyBadge';
import { IntentionSelector } from './IntentionSelector';
import { sound } from '../utils/audio';

interface TarotViewProps {
  card: CartaTarot | null;
  intencion: IntencionTipo;
  entropy: EntropyResult | null;
  isConsulting: boolean;
  onSelectIntencion: (i: IntencionTipo) => void;
  onConsult: () => void;
  onOpenDetails: () => void;
}

export const TarotView: React.FC<TarotViewProps> = ({
  card,
  intencion,
  entropy,
  isConsulting,
  onSelectIntencion,
  onConsult,
  onOpenDetails,
}) => {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [activeReadingTab, setActiveReadingTab] = useState<IntencionTipo>(intencion);

  // Sync active tab when external intention changes
  React.useEffect(() => {
    setActiveReadingTab(intencion);
  }, [intencion]);

  // Reset image error state when new card arrives
  React.useEffect(() => {
    setImgError(false);
  }, [card?.id]);

  const handleCopy = () => {
    if (!card) return;
    const text = `✦ GRIMORIO ENTRÓPICO · ARCANO MAYOR ✦\n` +
      `Arcano: ${card.numeroRomano} - ${card.nombre}\n` +
      `Símbolo Alquímico: ${card.simboloAlquimico} (${card.elementoPlaneta})\n` +
      `Arquetipo: ${card.arquetipo}\n` +
      `Intención: ${intencion.toUpperCase()}\n` +
      `Mensaje: ${card.interpretacion[intencion]}\n` +
      `Consejo Oracular: "${card.consejoOracular}"\n` +
      `Fuente Entrópica: ${entropy?.sourceLabel || 'CSPRNG'}`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2400);
  };

  const currentIntencionInfo = INTENCIONES.find((i) => i.id === activeReadingTab) || INTENCIONES[0];

  return (
    <div className="w-full space-y-6">
      {/* Top Controls Area */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#120f1f]/90 border border-[#2d243d] shadow-xl">
        <IntentionSelector
          selectedIntencion={intencion}
          onSelect={(i) => {
            onSelectIntencion(i);
            setActiveReadingTab(i);
          }}
          disabled={isConsulting}
        />

        <div className="mt-4 pt-4 border-t border-[#251e33] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <EntropyBadge entropy={entropy} onOpenDetails={onOpenDetails} />
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onConsult();
            }}
            disabled={isConsulting}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#9b722d] via-[#d4af37] to-[#e6c65b] text-[#0d0b17] font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#0d0b17]" />
            <span>{card ? 'Extraer Otro Arcano' : 'Consultar al Oráculo'}</span>
          </button>
        </div>
      </div>

      {/* Main Content: Card or Deck Standby */}
      {!card ? (
        <div className="text-center py-12 px-6 rounded-2xl bg-[#0f0c1a]/70 border border-[#261f36] relative overflow-hidden">
          <div className="max-w-md mx-auto space-y-5">
            {/* Mystic Card Deck Graphic */}
            <div className="relative w-40 h-64 mx-auto group cursor-pointer" onClick={onConsult}>
              {/* Back card 2 */}
              <div className="absolute inset-0 translate-x-2 -translate-y-2 rounded-xl bg-[#1d172e] border border-[#d4af37]/20 opacity-50 shadow-md rotate-3" />
              {/* Back card 1 */}
              <div className="absolute inset-0 -translate-x-1 -translate-y-1 rounded-xl bg-[#1a1429] border border-[#d4af37]/30 opacity-75 shadow-lg -rotate-2" />
              {/* Top face-down card */}
              <div className="relative w-full h-full rounded-xl bg-gradient-to-b from-[#1c162b] to-[#0c0a14] border-2 border-[#d4af37]/60 shadow-2xl p-3 flex flex-col items-center justify-between group-hover:border-[#d4af37] group-hover:scale-105 transition-all duration-300">
                <div className="w-full flex justify-between text-[#d4af37] text-xs font-cinzel">
                  <span>✦</span>
                  <span>78</span>
                  <span>✦</span>
                </div>
                
                <div className="w-20 h-20 rounded-full border-2 border-dashed border-[#d4af37]/50 flex items-center justify-center text-[#d4af37]">
                  <Compass className="w-10 h-10 animate-[spin_30s_linear_infinite]" />
                </div>

                <div className="text-center">
                  <div className="text-[11px] font-cinzel tracking-widest text-[#d4af37]">ARCANUM</div>
                  <div className="text-[9px] font-mono text-[#8c829e]">UNIVERSUM</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5ebd7] tracking-wider">
                El Mazo de los Arcanos Mayores Aguarda
              </h2>
              <p className="mt-2 text-sm text-[#9f95b0] font-garamond italic leading-relaxed">
                Selecciona tu intención en el panel superior y pulsa "Consultar al Oráculo" para que el ruido atmosférico planetario fije la carta de tu destino.
              </p>
            </div>

            <button
              onClick={onConsult}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-lg bg-[#191426] border border-[#d4af37]/50 text-[#f5ebd7] font-cinzel text-xs font-semibold hover:bg-[#d4af37] hover:text-[#0d0b17] transition-all"
            >
              <span>Comenzar Invocación</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Revealed Card Display */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Physical Card Frame */}
          <div className="lg:col-span-5 flex flex-col items-center">
            <div className="relative w-full max-w-[320px] rounded-2xl bg-gradient-to-b from-[#1f1930] via-[#151121] to-[#0c0a14] p-3.5 border-2 border-[#d4af37] shadow-2xl shadow-[#d4af37]/20 group">
              {/* Inner card border */}
              <div className="rounded-xl border border-[#d4af37]/40 p-2.5 bg-[#0e0c17] flex flex-col items-center">
                {/* Card Header: Roman Numeral & Alchemy */}
                <div className="w-full flex items-center justify-between px-2 py-1 mb-2 border-b border-[#2b243b]">
                  <span className="font-cinzel text-sm font-bold text-[#d4af37]">
                    {card.numeroRomano}
                  </span>
                  <span className="text-lg text-[#f4e295] font-serif" title={card.elementoPlaneta}>
                    {card.simboloAlquimico}
                  </span>
                  <span className="text-[11px] font-mono text-[#8f85a1]">
                    ID {card.id}
                  </span>
                </div>

                {/* Card Artwork */}
                <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#161224] border border-[#3b3250] flex items-center justify-center">
                  {!imgError ? (
                    <img
                      src={card.imagen}
                      alt={card.nombre}
                      referrerPolicy="no-referrer"
                      onError={() => setImgError(true)}
                      className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    /* High-Fidelity Alchemical Fallback Artwork */
                    <div className="w-full h-full p-4 flex flex-col items-center justify-between text-center bg-gradient-to-b from-[#1b152b] to-[#0d0b17]">
                      <div className="text-2xl text-[#d4af37]">{card.simboloAlquimico}</div>
                      <div className="space-y-2">
                        <div className="font-cinzel text-xl font-bold text-[#f5ebd7]">{card.nombre}</div>
                        <div className="text-xs font-mono text-[#8a7f9e]">{card.elementoPlaneta}</div>
                        <div className="text-[11px] text-[#baaecd] italic">Grabado Clásico Rider-Waite (1909)</div>
                      </div>
                      <div className="text-xs font-cinzel text-[#d4af37]">ARCANUM VERA</div>
                    </div>
                  )}

                  {/* Shimmer gradient on card */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                </div>

                {/* Card Footer: Name & Title */}
                <div className="w-full text-center mt-3 pt-2 border-t border-[#2b243b]">
                  <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#f5ebd7]">
                    {card.nombre}
                  </h3>
                  <p className="text-[11px] text-[#d4af37] font-garamond italic mt-0.5">
                    {card.arquetipo}
                  </p>
                </div>
              </div>
            </div>

            {/* Keywords */}
            <div className="flex flex-wrap items-center justify-center gap-1.5 mt-3 max-w-[320px]">
              {card.palabrasClave.map((kw, i) => (
                <span
                  key={i}
                  className="text-[11px] px-2 py-0.5 rounded-full bg-[#181426] border border-[#312845] text-[#b3a8c7]"
                >
                  {kw}
                </span>
              ))}
            </div>
          </div>

          {/* Right Column: Oracular Interpretation & Grimoire Reading */}
          <div className="lg:col-span-7 space-y-4">
            {/* Card Hero Title */}
            <div className="p-4 sm:p-5 rounded-xl bg-[#120f1f] border border-[#2b243b] relative overflow-hidden">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[#d4af37]">
                    <span>ARCANO {card.numeroRomano}</span>
                    <span>·</span>
                    <span>{card.elementoPlaneta}</span>
                    <span>·</span>
                    <span className="text-base">{card.simboloAlquimico}</span>
                  </div>
                  <h2 className="font-cinzel text-2xl sm:text-3xl font-extrabold text-[#f5ebd7] tracking-wide mt-1">
                    {card.nombre}
                  </h2>
                  <p className="text-xs sm:text-sm text-[#9f95b0] font-garamond italic mt-0.5">
                    {card.arquetipo}
                  </p>
                </div>

                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1b162b] border border-[#372d4c] hover:border-[#d4af37]/50 text-xs text-[#cbbddb] hover:text-[#f4e295] transition-colors shrink-0"
                  title="Copiar lectura al portapapeles"
                >
                  {copied ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-300">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              {/* Oracular Council Quote */}
              <div className="mt-4 p-3 rounded-lg bg-[#181329] border-l-2 border-[#d4af37] text-xs sm:text-sm text-[#ded4eb] font-garamond italic">
                "{card.consejoOracular}"
              </div>
            </div>

            {/* Intention Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-[#141021] border border-[#282138] rounded-lg">
              {INTENCIONES.map((it) => {
                const isActive = activeReadingTab === it.id;
                const isConsulted = it.id === intencion;

                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      sound.playClick();
                      setActiveReadingTab(it.id);
                    }}
                    className={`flex-1 py-2 px-2 text-xs font-cinzel font-semibold rounded-md transition-all text-center relative ${
                      isActive
                        ? 'bg-[#271e3d] text-[#f5ebd7] shadow border border-[#d4af37]/50'
                        : 'text-[#8f85a1] hover:text-[#ded8c7] hover:bg-[#1a152b]'
                    }`}
                  >
                    <span>{it.label}</span>
                    {isConsulted && (
                      <span className="inline-block w-1.5 h-1.5 rounded-full bg-[#d4af37] ml-1.5 align-middle" title="Intención invocada" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Reading Body */}
            <div className="p-5 sm:p-6 rounded-xl bg-[#120f1f] border border-[#2b243b] relative min-h-[160px]">
              <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#d4af37] mb-2">
                <span>Interpretación: {currentIntencionInfo.label}</span>
                {activeReadingTab === intencion && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#f4e295]">
                    Enfoque Activo
                  </span>
                )}
              </div>

              <p className="text-sm sm:text-base text-[#e5dcd0] font-garamond leading-relaxed tracking-wide">
                {card.interpretacion[activeReadingTab]}
              </p>

              {/* Astrological / Alchemical Footnote */}
              <div className="mt-5 pt-3 border-t border-[#231d30] flex flex-wrap items-center justify-between gap-2 text-[11px] text-[#867b99] font-mono">
                <div>
                  Correspondencia Hermética: <span className="text-[#cbbddb]">{card.elementoPlaneta}</span>
                </div>
                <div>
                  Símbolo Alquímico: <span className="text-[#f4e295] text-sm">{card.simboloAlquimico}</span>
                </div>
              </div>
            </div>

            {/* Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onConsult();
                }}
                disabled={isConsulting}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#1a1429] border border-[#3e3357] hover:border-[#d4af37] text-xs font-cinzel font-semibold text-[#f5ebd7] transition-all"
              >
                <RotateCw className="w-3.5 h-3.5 text-[#d4af37]" />
                <span>Re-tirar con el Cosmos</span>
              </button>

              <div className="text-[11px] text-[#786e8c]">
                Resultado fijado de forma inmutable por entropía estocástica.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
