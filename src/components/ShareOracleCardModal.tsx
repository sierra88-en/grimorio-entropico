import React, { useState } from 'react';
import { X, Download, Share2, Check, Copy, Radio, ShieldCheck, Sun, Moon, Sparkles } from 'lucide-react';
import { EntropyResult } from '../utils/entropyEngine';

export interface ShareOraclePayload {
  modeLabel: string;
  question?: string;
  verdictTitle: string;
  verdictSubtitle?: string;
  accentTheme?: 'sol' | 'luna' | 'gold' | 'cyan';
  entropy: EntropyResult;
}

interface ShareOracleCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  payload: ShareOraclePayload | null;
}

export const ShareOracleCardModal: React.FC<ShareOracleCardModalProps> = ({
  isOpen,
  onClose,
  payload,
}) => {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);

  if (!isOpen || !payload) return null;

  const isTrng = payload.entropy.source === 'RANDOM_ORG_ATMOSPHERIC';
  const sourceDisplay = isTrng
    ? 'Ruido Atmosférico Físico (RANDOM.ORG)'
    : 'Entropía Cuántica Local (CSPRNG)';

  const buildShareText = () => {
    const lines = [
      `✦ GRIMORIO ENTRÓPICO — EL UNIVERSO DECIDE ✦`,
      payload.question ? `Pregunta: "${payload.question}"` : null,
      `Veredicto (${payload.modeLabel}): ${payload.verdictTitle}`,
      payload.verdictSubtitle ? payload.verdictSubtitle : null,
      `—`,
      `Fuente: ${sourceDisplay}`,
      `Huella: ${payload.entropy.seedHex} · ${payload.entropy.latencyMs}ms · ${payload.entropy.timestamp}`,
    ].filter(Boolean);
    return lines.join('\n');
  };

  const handleCopyOrShare = async () => {
    const text = buildShareText();
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({
          title: 'Grimorio Entrópico · Sello del Oráculo',
          text,
        });
        return;
      } catch {
        // User cancelled or share unsupported, fall back to copy
      }
    }

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard failure
    }
  };

  const handleDownloadPng = () => {
    setDownloading(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = 900;
      canvas.height = 1125;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Background obsidian gradient
      const bg = ctx.createRadialGradient(450, 460, 60, 450, 560, 680);
      bg.addColorStop(0, '#131d33');
      bg.addColorStop(0.55, '#090e1a');
      bg.addColorStop(1, '#04060a');
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Decorative subtle star dots
      ctx.fillStyle = 'rgba(255, 209, 92, 0.25)';
      for (let i = 0; i < 60; i++) {
        const sx = ((i * 197) % 840) + 30;
        const sy = ((i * 313) % 1065) + 30;
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3) + 0.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Outer gold frame
      ctx.strokeStyle = 'rgba(223, 177, 91, 0.55)';
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, 828, 1053);

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.28)';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(48, 48, 804, 1029);

      // Header title
      ctx.fillStyle = '#ffd15c';
      ctx.font = 'bold 26px Georgia, serif';
      ctx.textAlign = 'center';
      ctx.fillText('EL UNIVERSO DECIDE', 450, 118);

      ctx.fillStyle = '#94a3b8';
      ctx.font = '18px monospace';
      ctx.fillText(`SELLO DEL ORÁCULO · ${payload.modeLabel.toUpperCase()}`, 450, 154);

      // Central Astrolabe Circle
      ctx.strokeStyle = 'rgba(223, 177, 91, 0.45)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(450, 420, 140, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(56, 189, 248, 0.35)';
      ctx.setLineDash([6, 8]);
      ctx.beginPath();
      ctx.arc(450, 420, 165, 0, Math.PI * 2);
      ctx.stroke();
      ctx.setLineDash([]);

      // Inner medallion fill
      const medGrad = ctx.createLinearGradient(340, 310, 560, 530);
      if (payload.accentTheme === 'luna') {
        medGrad.addColorStop(0, '#1e293b');
        medGrad.addColorStop(1, '#475569');
      } else {
        medGrad.addColorStop(0, '#784e12');
        medGrad.addColorStop(0.5, '#dfb15b');
        medGrad.addColorStop(1, '#fff1b0');
      }
      ctx.fillStyle = medGrad;
      ctx.beginPath();
      ctx.arc(450, 420, 112, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = payload.accentTheme === 'luna' ? '#f8fafc' : '#140b01';
      ctx.font = 'bold 54px Georgia, serif';
      ctx.fillText(
        payload.accentTheme === 'luna' ? '☽' : payload.accentTheme === 'sol' ? '☀' : '✦',
        450,
        438
      );

      // Question (if provided)
      let currentY = 635;
      if (payload.question) {
        ctx.fillStyle = '#94a3b8';
        ctx.font = 'italic 24px Georgia, serif';
        ctx.fillText('Intención consultada:', 450, currentY);
        currentY += 40;

        ctx.fillStyle = '#f5ebd7';
        ctx.font = 'bold 28px Georgia, serif';
        const wrapped = wrapText(ctx, `“${payload.question}”`, 720);
        wrapped.slice(0, 2).forEach((line) => {
          ctx.fillText(line, 450, currentY);
          currentY += 36;
        });
        currentY += 18;
      }

      // Verdict Title
      ctx.fillStyle = '#ffd15c';
      ctx.font = 'bold 42px Georgia, serif';
      const verdictLines = wrapText(ctx, payload.verdictTitle, 740);
      verdictLines.slice(0, 2).forEach((line) => {
        ctx.fillText(line, 450, currentY);
        currentY += 48;
      });

      if (payload.verdictSubtitle) {
        ctx.fillStyle = '#cbd5e1';
        ctx.font = '22px Georgia, serif';
        const subLines = wrapText(ctx, payload.verdictSubtitle, 720);
        subLines.slice(0, 2).forEach((line) => {
          ctx.fillText(line, 450, currentY);
          currentY += 30;
        });
      }

      // Cryptographic Receipt Box at bottom
      ctx.fillStyle = '#060a13';
      ctx.strokeStyle = 'rgba(223, 177, 91, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.fillRect(80, 880, 740, 155);
      ctx.strokeRect(80, 880, 740, 155);

      ctx.textAlign = 'left';
      ctx.fillStyle = isTrng ? '#34d399' : '#7dd3fc';
      ctx.font = 'bold 18px monospace';
      ctx.fillText(`FUENTE: ${sourceDisplay}`, 110, 922);

      ctx.fillStyle = '#cbd5e1';
      ctx.font = '18px monospace';
      ctx.fillText(`HUELLA HEX: ${payload.entropy.seedHex}`, 110, 958);
      ctx.fillText(`LATENCIA: ${payload.entropy.latencyMs} ms   ·   HORA: ${payload.entropy.timestamp}`, 110, 992);

      ctx.fillStyle = '#64748b';
      ctx.font = '15px monospace';
      ctx.fillText('Grimorio Entrópico · Muestreo sin sesgo de módulo (0.00%)', 110, 1022);

      const url = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = url;
      a.download = `sello-oraculo-${Date.now()}.png`;
      a.click();
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080e]/90 backdrop-blur-md">
      <div className="w-full max-w-sm rounded-2xl bg-[#0c1322] border border-[#dfb15b]/50 shadow-2xl overflow-hidden">
        {/* Visual Card Preview */}
        <div className="relative p-5 bg-gradient-to-b from-[#0f1729] via-[#090e1a] to-[#060910] text-center space-y-3 border-b border-[#1e293b]">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#162238] text-[#94a3b8] hover:text-white transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="text-[10px] font-mono tracking-widest text-[#dfb15b] uppercase">
            Sello del Oráculo · {payload.modeLabel}
          </div>

          <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-[#784e12] via-[#dfb15b] to-[#fff1b0] p-0.5 shadow-lg shadow-[#dfb15b]/25">
            <div className="w-full h-full rounded-full bg-[#090e1a] flex items-center justify-center">
              {payload.accentTheme === 'luna' ? (
                <Moon className="w-8 h-8 text-[#38bdf8]" />
              ) : payload.accentTheme === 'sol' ? (
                <Sun className="w-8 h-8 text-[#ffd15c]" />
              ) : (
                <Sparkles className="w-8 h-8 text-[#ffd15c]" />
              )}
            </div>
          </div>

          {payload.question && (
            <div className="px-3 py-1.5 rounded-lg bg-[#0c1322]/90 border border-[#dfb15b]/25 text-xs font-garamond italic text-[#f5ebd7]">
              “{payload.question}”
            </div>
          )}

          <div>
            <h4 className="font-cinzel text-xl font-black text-[#ffd15c] tracking-wide">
              {payload.verdictTitle}
            </h4>
            {payload.verdictSubtitle && (
              <p className="text-xs text-[#cbd5e1] font-garamond mt-0.5">
                {payload.verdictSubtitle}
              </p>
            )}
          </div>

          {/* Cryptographic Receipt Strip */}
          <div className="p-2.5 rounded-xl bg-[#05080f] border border-[#1e293b] text-left font-mono text-[10px] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#64748b]">Fuente:</span>
              <span className={`font-semibold flex items-center gap-1 ${isTrng ? 'text-emerald-400' : 'text-[#7dd3fc]'}`}>
                {isTrng ? <Radio className="w-3 h-3" /> : <ShieldCheck className="w-3 h-3" />}
                {isTrng ? 'RANDOM.ORG (TRNG)' : 'CSPRNG Local'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748b]">Huella Hex:</span>
              <span className="text-[#ffd15c] tabular-nums">{payload.entropy.seedHex}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#64748b]">Latencia / Hora:</span>
              <span className="text-[#cbd5e1] tabular-nums">
                {payload.entropy.latencyMs} ms · {payload.entropy.timestamp}
              </span>
            </div>
          </div>
        </div>

        {/* Share & Download Actions */}
        <div className="p-4 flex items-center gap-2 bg-[#080d16]">
          <button
            onClick={handleDownloadPng}
            disabled={downloading}
            className="flex-1 py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b8860b] text-[#140b01] font-cinzel font-bold text-xs flex items-center justify-center gap-1.5 shadow-md hover:brightness-110 active:scale-[0.98] transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{downloading ? 'Generando...' : 'Guardar PNG'}</span>
          </button>

          <button
            onClick={handleCopyOrShare}
            className="flex-1 py-2.5 px-3 rounded-xl bg-[#101829] border border-[#1e293b] hover:border-[#dfb15b]/50 text-[#e2e8f0] font-cinzel font-semibold text-xs flex items-center justify-center gap-1.5 transition-all"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-300">Copiado</span>
              </>
            ) : typeof navigator !== 'undefined' && typeof navigator.share === 'function' ? (
              <>
                <Share2 className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Compartir</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Copiar recibo</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}
