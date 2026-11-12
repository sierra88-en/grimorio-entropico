import React, { useState } from 'react';
import { Coins, Sparkles, RotateCw, Sun, Moon, HelpCircle } from 'lucide-react';
import { EntropyResult } from '../utils/entropyEngine';
import { EntropyBadge } from './EntropyBadge';
import { sound } from '../utils/audio';

interface AlchemicalCoinProps {
  onFlipCoin: (question: string) => Promise<{ result: 'SOL' | 'LUNA'; entropy: EntropyResult }>;
  onOpenDetails: () => void;
}

export const AlchemicalCoin: React.FC<AlchemicalCoinProps> = ({
  onFlipCoin,
  onOpenDetails,
}) => {
  const [question, setQuestion] = useState('');
  const [isFlipping, setIsFlipping] = useState(false);
  const [lastResult, setLastResult] = useState<'SOL' | 'LUNA' | null>(null);
  const [lastEntropy, setLastEntropy] = useState<EntropyResult | null>(null);
  const [rotationDegrees, setRotationDegrees] = useState(0);

  const SUGGESTED_DILEMMAS = [
    '¿Debo emprender este proyecto ahora?',
    '¿Es prudente aceptar este acuerdo?',
    '¿Conviene dar el primer paso afectivo?',
    '¿Debo soltar lo que me inquieta?'
  ];

  const handleFlip = async (customQ?: string) => {
    if (isFlipping) return;
    const activeQuestion = customQ !== undefined ? customQ : question;

    setIsFlipping(true);
    sound.playCoinFlip();

    // Trigger visual spin
    const spins = 5 + Math.floor(Math.random() * 3); // 5 to 7 full rotations

    try {
      const outcome = await onFlipCoin(activeQuestion);

      // Determine final degrees
      // SOL = even multiples of 360 (0deg, 360deg, 720deg)
      // LUNA = odd multiples of 180 (180deg, 540deg, etc.)
      const isSol = outcome.result === 'SOL';
      const targetDeg = spins * 360 + (isSol ? 0 : 180);
      setRotationDegrees((prev) => prev + targetDeg);

      // Settle timing
      setTimeout(() => {
        setLastResult(outcome.result);
        setLastEntropy(outcome.entropy);
        setIsFlipping(false);
        sound.playCoinLand();
      }, 1600);
    } catch {
      setIsFlipping(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      {/* Question Input Card */}
      <div className="p-4 sm:p-5 rounded-xl bg-[#120f1f]/90 border border-[#2d243d] shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-cinzel font-semibold tracking-wider text-[#dcd2be] flex items-center gap-1.5 uppercase">
            <Coins className="w-4 h-4 text-[#d4af37]" />
            <span>Consulta a la Moneda Alquímica</span>
          </label>
          <span className="text-[11px] text-[#958ea3]">
            Binario Estocástico Puro: Sol (Sí / Acción) · Luna (No / Espera)
          </span>
        </div>

        <div className="relative">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Escribe tu dilema o pregunta al cosmos (opcional)..."
            disabled={isFlipping}
            onKeyDown={(e) => {
              if (e.key === 'Enter') handleFlip();
            }}
            className="w-full px-4 py-2.5 rounded-lg bg-[#0e0c17] border border-[#2e2640] text-sm text-[#f5ebd7] placeholder-[#6e6482] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] transition-all"
          />
        </div>

        {/* Quick suggestions */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] text-[#7d7391] mr-1">Sugerencias:</span>
          {SUGGESTED_DILEMMAS.map((sug, i) => (
            <button
              key={i}
              type="button"
              disabled={isFlipping}
              onClick={() => {
                setQuestion(sug);
                handleFlip(sug);
              }}
              className="text-[11px] px-2.5 py-1 rounded-md bg-[#181326] border border-[#2b243b] text-[#b3a8c7] hover:text-[#f4e295] hover:border-[#d4af37]/40 transition-colors"
            >
              {sug}
            </button>
          ))}
        </div>

        {/* Entropy Badge and Action Button */}
        <div className="mt-4 pt-4 border-t border-[#251e33] flex flex-col sm:flex-row items-center justify-between gap-3">
          <EntropyBadge entropy={lastEntropy} onOpenDetails={onOpenDetails} />

          <button
            onClick={() => handleFlip()}
            disabled={isFlipping}
            className="w-full sm:w-auto px-6 py-2.5 rounded-lg bg-gradient-to-r from-[#9b722d] via-[#d4af37] to-[#e6c65b] text-[#0d0b17] font-cinzel font-bold text-sm tracking-wider shadow-lg shadow-[#d4af37]/20 hover:shadow-[#d4af37]/40 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#0d0b17]" />
            <span>{isFlipping ? 'Girando en el Vórtice...' : 'Lanzar Moneda Alquímica'}</span>
          </button>
        </div>
      </div>

      {/* 3D Coin Visual Area */}
      <div className="py-10 px-6 rounded-2xl bg-[#0e0c18] border border-[#261f36] flex flex-col items-center justify-center text-center relative overflow-hidden">
        {/* Ambient gold/silver radial light */}
        <div className="absolute w-72 h-72 rounded-full bg-[#d4af37]/10 blur-3xl pointer-events-none" />

        {/* 3D Coin Container */}
        <div className="relative w-56 h-56 perspective-1000 my-4 cursor-pointer" onClick={() => !isFlipping && handleFlip()}>
          <div
            className="w-full h-full relative preserve-3d transition-transform duration-[1600ms] ease-[cubic-bezier(0.2,0.8,0.2,1)]"
            style={{
              transform: `rotateY(${rotationDegrees}deg)`,
            }}
          >
            {/* FRONT FACE: SOL INVICTUS (Oro Alquímico / Afirmativo / SÍ) */}
            <div className="absolute inset-0 rounded-full backface-hidden p-2 bg-gradient-to-tr from-[#7c561b] via-[#d4af37] to-[#ffe58f] shadow-2xl shadow-[#d4af37]/30 border-4 border-[#ffec99] flex flex-col items-center justify-between overflow-hidden">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#593d10]/40 pointer-events-none" />
              
              <div className="text-[10px] font-cinzel font-bold text-[#3d2707] tracking-widest mt-2 uppercase">
                Sol Invictus · Veritas
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#ffea9f] to-[#c69a30] flex items-center justify-center shadow-inner border border-[#fffae0]">
                  <Sun className="w-12 h-12 text-[#4a2e05] animate-spin duration-[40000ms]" />
                </div>
                <div className="font-cinzel text-xl font-extrabold text-[#3a2305] tracking-widest mt-1">
                  SÍ
                </div>
              </div>

              <div className="text-[9px] font-mono font-semibold text-[#4e3208] mb-2 tracking-wider">
                ☉ ORO · ACCIÓN · FUEGO
              </div>
            </div>

            {/* BACK FACE: LUNA REGALIS (Plata Mística / Receptivo / NO) */}
            <div className="absolute inset-0 rounded-full backface-hidden rotate-y-180 p-2 bg-gradient-to-tr from-[#32364a] via-[#8c94b2] to-[#e4e8f7] shadow-2xl shadow-[#8c94b2]/30 border-4 border-[#d5dcf5] flex flex-col items-center justify-between overflow-hidden">
              <div className="absolute inset-1 rounded-full border border-dashed border-[#1c1f2e]/40 pointer-events-none" />

              <div className="text-[10px] font-cinzel font-bold text-[#1a1c2b] tracking-widest mt-2 uppercase">
                Luna Regalis · Mysterium
              </div>

              <div className="flex flex-col items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-gradient-to-b from-[#e5e9f8] to-[#7f88a8] flex items-center justify-center shadow-inner border border-[#ffffff]">
                  <Moon className="w-12 h-12 text-[#181b29]" />
                </div>
                <div className="font-cinzel text-xl font-extrabold text-[#171926] tracking-widest mt-1">
                  NO
                </div>
              </div>

              <div className="text-[9px] font-mono font-semibold text-[#1a1c2b] mb-2 tracking-wider">
                ☽ PLATA · PAUSA · AGUA
              </div>
            </div>
          </div>
        </div>

        {/* Outcome Interpretation Banner */}
        <div className="mt-4 max-w-lg">
          {lastResult ? (
            <div className="space-y-3 animate-fade-in">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#181329] border border-[#d4af37]/40 text-sm font-cinzel font-bold text-[#f5ebd7]">
                {lastResult === 'SOL' ? (
                  <>
                    <Sun className="w-4 h-4 text-[#d4af37]" />
                    <span>EL UNIVERSO DETERMINA: SOL (AFIRMATIVO / SÍ)</span>
                  </>
                ) : (
                  <>
                    <Moon className="w-4 h-4 text-[#9db2e8]" />
                    <span>EL UNIVERSO DETERMINA: LUNA (RECEPTIVO / NO)</span>
                  </>
                )}
              </div>

              {question && (
                <p className="text-xs text-[#a99ebc] font-garamond italic">
                  Dilema consultado: "{question}"
                </p>
              )}

              <p className="text-sm text-[#ded8c7] font-garamond leading-relaxed">
                {lastResult === 'SOL'
                  ? 'La energía solar marca luz verde para la acción deliberada, la firma de acuerdos y el avance decidido. El principio activo del fuego transmuta cualquier obstáculo.'
                  : 'El influjo lunar aconseja quietud, introspección y cautela. No fuerces los acontecimientos en este momento; deja que las aguas se asienten antes de tomar resoluciones definitivas.'}
              </p>
            </div>
          ) : (
            <p className="text-sm text-[#8c829e] font-garamond italic">
              Haz clic en la moneda o pulsa "Lanzar Moneda Alquímica" para canalizar la tirada con ruido físico atmosférico.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
