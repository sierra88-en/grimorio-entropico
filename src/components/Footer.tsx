import React from 'react';
import { Github, Coffee, Sparkles, Smartphone, BookOpen, Compass } from 'lucide-react';
import { sound } from '../utils/audio';

interface FooterProps {
  onOpenCoffee: () => void;
  onOpenManifesto: () => void;
  onOpenCapacitor: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenCoffee,
  onOpenManifesto,
  onOpenCapacitor,
}) => {
  return (
    <footer className="mt-16 border-t border-[#261f36] bg-[#090712] py-8 px-4 text-xs text-[#8a7f9e]">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Left: Project identity */}
        <div className="flex flex-col items-center md:items-start gap-1">
          <div className="flex items-center gap-2 font-cinzel text-sm font-bold text-[#e0d6c3]">
            <Sparkles className="w-3.5 h-3.5 text-[#d4af37]" />
            <span>Grimorio Entrópico · El Universo Decide</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-[#716882]">
            <span>Inspirado en la arquitectura de Vitor Hugo</span>
            <span>·</span>
            <span>Software Libre</span>
            <span>·</span>
            <span>Sin Anuncios ni Rastreadores</span>
          </div>
        </div>

        {/* Center: Action links */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium">
          <button
            onClick={() => {
              sound.playClick();
              onOpenManifesto();
            }}
            className="hover:text-[#f4e295] transition-colors"
          >
            Manifiesto de Entropía
          </button>
          <span>·</span>
          <button
            onClick={() => {
              sound.playClick();
              onOpenCapacitor();
            }}
            className="hover:text-[#f4e295] transition-colors flex items-center gap-1"
          >
            <Smartphone className="w-3 h-3 text-[#d4af37]" />
            <span>PWA & APK Capacitor</span>
          </button>
          <span>·</span>
          <a
            href="https://github.com/vitorhugo-dotnet/the_universe_decides"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-[#f4e295] transition-colors flex items-center gap-1"
          >
            <Github className="w-3.5 h-3.5" />
            <span>Código Abierto en GitHub</span>
          </a>
        </div>

        {/* Right: Buy Me a Coffee button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playClick();
              onOpenCoffee();
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#161124] border border-[#3b2f52] hover:border-[#d4af37]/60 text-[#d8cbe8] hover:text-[#f4e295] transition-all text-xs font-cinzel font-medium group"
          >
            <Coffee className="w-3.5 h-3.5 text-[#d4af37] group-hover:scale-110 transition-transform" />
            <span>Invitar una ofrenda / Buy Me a Coffee</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
