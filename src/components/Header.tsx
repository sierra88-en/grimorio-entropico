import React from 'react';
import { Volume2, VolumeX, BookOpen, Compass, Coins, Sparkles } from 'lucide-react';
import { sound } from '../utils/audio';

export type AppMode = 'tarot' | 'moneda' | 'biblioteca';

interface HeaderProps {
  currentMode: AppMode;
  onSelectMode: (mode: AppMode) => void;
  onOpenManifesto: () => void;
  isMuted: boolean;
  onToggleSound: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentMode,
  onSelectMode,
  onOpenManifesto,
  isMuted,
  onToggleSound,
}) => {
  return (
    <header className="border-b border-[#2d263a]/80 bg-[#0c0a14]/90 backdrop-blur-md sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3 sm:py-3.5 flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 rounded-full bg-gradient-to-tr from-[#9b722d] via-[#d4af37] to-[#f4e295] p-0.5 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center">
            <div className="w-full h-full rounded-full bg-[#0d0b17] flex items-center justify-center text-[#d4af37]">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-cinzel text-lg sm:text-xl font-bold tracking-wider text-[#f5ebd7] whitespace-nowrap">
                Grimorio Entrópico
              </span>
              <span className="text-[10px] font-mono tracking-widest text-[#9b722d] uppercase hidden sm:inline px-1.5 py-0.5 border border-[#9b722d]/40 rounded">
                The Universe Decides
              </span>
            </div>
            <p className="text-xs text-[#958ea3] hidden sm:block">
              Oráculo de Indeterminismo Físico & Tradición Hermética
            </p>
          </div>
        </div>

        {/* Navigation / Mode Switcher */}
        <nav className="flex items-center gap-1.5 p-1 bg-[#141121] border border-[#2b243b] rounded-lg">
          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('tarot');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-semibold tracking-wider rounded-md transition-all whitespace-nowrap ${
              currentMode === 'tarot'
                ? 'bg-gradient-to-r from-[#9b722d] to-[#d4af37] text-[#0d0b17] shadow-md shadow-[#d4af37]/20'
                : 'text-[#bbb1cd] hover:text-[#f4e295] hover:bg-[#1f1930]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Tarot Entrópico</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('moneda');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-semibold tracking-wider rounded-md transition-all whitespace-nowrap ${
              currentMode === 'moneda'
                ? 'bg-gradient-to-r from-[#9b722d] to-[#d4af37] text-[#0d0b17] shadow-md shadow-[#d4af37]/20'
                : 'text-[#bbb1cd] hover:text-[#f4e295] hover:bg-[#1f1930]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            <span>Moneda Alquímica</span>
          </button>

          <button
            onClick={() => {
              sound.playClick();
              onSelectMode('biblioteca');
            }}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-cinzel font-semibold tracking-wider rounded-md transition-all whitespace-nowrap ${
              currentMode === 'biblioteca'
                ? 'bg-gradient-to-r from-[#9b722d] to-[#d4af37] text-[#0d0b17] shadow-md shadow-[#d4af37]/20'
                : 'text-[#bbb1cd] hover:text-[#f4e295] hover:bg-[#1f1930]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>22 Arcanos</span>
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              sound.playClick();
              onOpenManifesto();
            }}
            title="Fundamento Científico: Manifiesto de Entropía"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium text-[#cbbddb] bg-[#171326] border border-[#332a47] rounded-md hover:border-[#d4af37]/50 hover:text-[#f4e295] transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span className="hidden sm:inline">Manifiesto</span>
            <span className="text-[10px] text-[#9b722d] font-mono">TRNG</span>
          </button>

          <button
            onClick={onToggleSound}
            title={isMuted ? 'Activar sonido místico' : 'Silenciar sonido'}
            className="p-1.5 text-[#bbb1cd] bg-[#171326] border border-[#332a47] rounded-md hover:text-[#f4e295] hover:border-[#d4af37]/50 transition-colors"
            aria-label="Silenciar sonido"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400/80" /> : <Volume2 className="w-4 h-4 text-[#d4af37]" />}
          </button>
        </div>
      </div>
    </header>
  );
};
