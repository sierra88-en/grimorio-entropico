import React, { useState } from 'react';
import { Search, Sparkles, BookOpen, X, ChevronRight } from 'lucide-react';
import { TAROT_ARCANOS_MAYORES, CartaTarot, INTENCIONES } from '../data/tarotData';
import { sound } from '../utils/audio';

export const ArcanaLibrary: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedCard, setSelectedCard] = useState<CartaTarot | null>(null);

  const filteredCards = TAROT_ARCANOS_MAYORES.filter((c) =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.arquetipo.toLowerCase().includes(search.toLowerCase()) ||
    c.elementoPlaneta.toLowerCase().includes(search.toLowerCase()) ||
    c.palabrasClave.some((kw) => kw.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="w-full space-y-6">
      {/* Search Header */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#120f1f]/90 border border-[#2d243d] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="font-cinzel text-lg sm:text-xl font-bold text-[#f5ebd7] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#d4af37]" />
            <span>Biblioteca Sagrada: Los 22 Arcanos Mayores</span>
          </h2>
          <p className="text-xs text-[#958ea3] mt-0.5">
            Grabados clásicos de Rider-Waite (1909) con correspondencias herméticas y lecturas tripartitas
          </p>
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-[#756a87] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por arcano, planeta o palabra..."
            className="w-full pl-9 pr-4 py-2 rounded-lg bg-[#0e0c17] border border-[#2e2640] text-xs text-[#f5ebd7] placeholder-[#6e6482] focus:outline-none focus:border-[#d4af37]"
          />
        </div>
      </div>

      {/* Grid of 22 Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
        {filteredCards.map((card) => (
          <div
            key={card.id}
            onClick={() => {
              sound.playClick();
              setSelectedCard(card);
            }}
            className="group cursor-pointer rounded-xl bg-[#130f21] border border-[#271f38] hover:border-[#d4af37] p-2.5 flex flex-col items-center transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-[#d4af37]/10"
          >
            {/* Roman & Alchemy header */}
            <div className="w-full flex items-center justify-between px-1 mb-1.5 text-[10px] text-[#8e84a1]">
              <span className="font-cinzel font-bold text-[#d4af37]">{card.numeroRomano}</span>
              <span className="text-xs text-[#f4e295]">{card.simboloAlquimico}</span>
            </div>

            {/* Thumbnail */}
            <div className="relative w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#0c0a14] border border-[#302642]">
              <img
                src={card.imagen}
                alt={card.nombre}
                referrerPolicy="no-referrer"
                loading="lazy"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Title */}
            <div className="w-full text-center mt-2">
              <div className="font-cinzel text-xs font-bold text-[#f5ebd7] truncate group-hover:text-[#f4e295]">
                {card.nombre}
              </div>
              <div className="text-[10px] text-[#7d7391] truncate font-garamond italic">
                {card.elementoPlaneta}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed Modal on Click */}
      {selectedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05040a]/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 sm:p-7 rounded-2xl bg-[#0f0c1a] border border-[#d4af37]/50 shadow-2xl text-left space-y-5">
            <button
              onClick={() => setSelectedCard(null)}
              className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1a1426] text-[#8c829e] hover:text-[#f5ebd7] hover:bg-[#271e38] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Content */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
              {/* Card preview */}
              <div className="md:col-span-5 flex flex-col items-center">
                <div className="w-48 sm:w-56 rounded-xl border-2 border-[#d4af37] p-2 bg-[#0c0a14] shadow-xl">
                  <div className="aspect-[2/3] rounded-lg overflow-hidden">
                    <img
                      src={selectedCard.imagen}
                      alt={selectedCard.nombre}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-top"
                    />
                  </div>
                </div>

                <div className="mt-3 text-center">
                  <div className="text-xs font-mono text-[#d4af37]">
                    {selectedCard.elementoPlaneta} · {selectedCard.simboloAlquimico}
                  </div>
                  <div className="flex flex-wrap gap-1 justify-center mt-2">
                    {selectedCard.palabrasClave.map((kw, i) => (
                      <span key={i} className="text-[10px] px-2 py-0.5 rounded bg-[#1b152b] border border-[#302645] text-[#b0a5c4]">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Details & Interpretations */}
              <div className="md:col-span-7 space-y-4">
                <div>
                  <span className="text-xs font-mono text-[#d4af37]">Arcano {selectedCard.numeroRomano}</span>
                  <h3 className="font-cinzel text-2xl font-bold text-[#f5ebd7]">{selectedCard.nombre}</h3>
                  <p className="text-xs text-[#9f95b0] font-garamond italic">{selectedCard.arquetipo}</p>
                </div>

                <div className="p-3 rounded-lg bg-[#181226] border-l-2 border-[#d4af37] text-xs font-garamond italic text-[#e3d8f0]">
                  "{selectedCard.consejoOracular}"
                </div>

                {/* 3 Full Interpretations */}
                <div className="space-y-3">
                  {INTENCIONES.map((it) => (
                    <div key={it.id} className="p-3 rounded-lg bg-[#130f21] border border-[#2b223c]">
                      <div className="text-[11px] font-cinzel font-bold text-[#d4af37] uppercase tracking-wider mb-1">
                        {it.label}
                      </div>
                      <p className="text-xs text-[#d2c9de] font-garamond leading-relaxed">
                        {selectedCard.interpretacion[it.id]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
