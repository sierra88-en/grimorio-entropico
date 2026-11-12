import React, { useState } from 'react';
import { X, Coffee, Heart, Sparkles, Check, Copy } from 'lucide-react';
import { sound } from '../utils/audio';

interface CoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CoffeeModal: React.FC<CoffeeModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const cryptoAddress = "0x71C...AlchemicalVault";

  const handleCopy = () => {
    navigator.clipboard.writeText("https://buymeacoffee.com/alquimia");
    setCopied(true);
    sound.playClick();
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05040a]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md p-6 sm:p-7 rounded-2xl bg-[#0f0c1a] border border-[#d4af37]/40 shadow-2xl text-center space-y-5">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-[#1a1426] text-[#8c829e] hover:text-[#f5ebd7] hover:bg-[#271e38] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Sigil icon */}
        <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-tr from-[#9b722d] to-[#f4e295] p-0.5 shadow-lg shadow-[#d4af37]/20 flex items-center justify-center">
          <div className="w-full h-full rounded-full bg-[#0d0b17] flex items-center justify-center text-[#d4af37]">
            <Coffee className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h3 className="font-cinzel text-xl font-bold text-[#f5ebd7]">
            Ofrenda al Alquimista
          </h3>
          <p className="text-xs text-[#9f95b0] font-garamond italic mt-1 leading-relaxed">
            "Todo intercambio sagrado equilibra la balanza del cosmos y sostiene el software libre de código abierto."
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#141021] border border-[#2d243e] text-left space-y-2">
          <div className="text-xs font-semibold text-[#f5ebd7] flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-rose-400" />
            <span>Código Abierto & Libre de Publicidad</span>
          </div>
          <p className="text-[11px] text-[#9a8fa8] leading-relaxed">
            Esta aplicación no contiene anuncios, rastreadores ni suscripciones forzosas. Tu ofrenda contribuye a mantener los servidores de entropía y el desarrollo continuo.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => sound.playClick()}
            className="w-full py-2.5 rounded-lg bg-gradient-to-r from-[#9b722d] via-[#d4af37] to-[#e6c65b] text-[#0d0b17] font-cinzel font-bold text-xs tracking-wider shadow-lg shadow-[#d4af37]/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Coffee className="w-4 h-4" />
            <span>Invitar una Ofrenda (Buy Me a Coffee)</span>
          </a>

          <button
            onClick={handleCopy}
            className="w-full py-2 rounded-lg bg-[#181326] border border-[#302642] hover:border-[#d4af37]/40 text-[#cbbddb] text-xs font-medium transition-colors flex items-center justify-center gap-1.5"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Enlace Copiado al Portapapeles</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#8f85a1]" />
                <span>Copiar Enlace de Agradecimiento</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[10px] text-[#6e6482]">
          Gratitud infinita por mantener encendida la llama de la incertidumbre pura.
        </p>
      </div>
    </div>
  );
};
