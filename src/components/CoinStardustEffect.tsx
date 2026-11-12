import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ParticleData {
  id: number;
  angle: number;
  distance: number;
  size: number;
  type: 'star' | 'orb' | 'spark' | 'diamond';
  color: string;
  duration: number;
  delay: number;
  rotateDeg: number;
  driftX: number;
  driftY: number;
}

interface CoinStardustEffectProps {
  triggerKey: number;
  resultType: 'SOL' | 'LUNA' | null;
  isActive?: boolean;
}

/**
 * Sistema de Partículas: Polvo de Estrellas y Estática Mágica
 * Genera explosiones de chispas alquímicas, estrellas centelleantes y auras de choque
 * alrededor del medallón de la moneda al realizar un lanzamiento exitoso.
 */
export const CoinStardustEffect: React.FC<CoinStardustEffectProps> = ({
  triggerKey,
  resultType = 'SOL',
  isActive = true,
}) => {
  // Paletas de color según el sello alquímico (Sol = Oro Solar / Luna = Plata Astral)
  const isSol = resultType === 'SOL';
  const colors = isSol
    ? ['#ffd15c', '#dfb15b', '#f59e0b', '#fffbeb', '#ffffff', '#fde047']
    : ['#38bdf8', '#7dd3fc', '#cbd5e1', '#ffffff', '#67e8f9', '#a5f3fc'];

  // Generador determinista de 36 partículas de polvo de estrellas por cada disparo
  const particles = useMemo<ParticleData[]>(() => {
    if (!triggerKey) return [];

    const types: ('star' | 'orb' | 'spark' | 'diamond')[] = ['star', 'orb', 'spark', 'diamond'];
    const count = 36;
    const items: ParticleData[] = [];

    for (let i = 0; i < count; i++) {
      // Distribución radial alrededor de los 360 grados con variación estocástica
      const baseAngle = (i / count) * Math.PI * 2;
      const jitter = ((i * 17) % 10 - 5) * 0.08;
      const angle = baseAngle + jitter;

      const dist = 55 + ((i * 31) % 85); // Recorrido radial de 55px a 140px
      const size = 4 + ((i * 13) % 9);   // Tamaño de 4px a 13px
      const type = types[i % types.length];
      const color = colors[i % colors.length];
      const duration = 0.95 + ((i * 7) % 6) * 0.15; // 0.95s a 1.7s
      const delay = (i % 6) * 0.04;
      const rotateDeg = (i % 2 === 0 ? 1 : -1) * (90 + (i * 45) % 270);
      const driftX = ((i * 19) % 20 - 10);
      const driftY = -12 - ((i * 23) % 24); // Flotabilidad gravitacional inversa (sube suavemente)

      items.push({
        id: i,
        angle,
        distance: dist,
        size,
        type,
        color,
        duration,
        delay,
        rotateDeg,
        driftX,
        driftY,
      });
    }

    return items;
  }, [triggerKey, isSol]);

  // Partículas ambientales continuas (polvo estelar flotante)
  const ambientMotes = useMemo(() => {
    return Array.from({ length: 8 }).map((_, idx) => {
      const angle = (idx / 8) * Math.PI * 2;
      const radius = 95 + (idx % 3) * 12;
      return {
        id: idx,
        x: Math.cos(angle) * radius,
        y: Math.sin(angle) * radius,
        size: 3 + (idx % 3),
        color: idx % 2 === 0 ? '#ffd15c' : '#38bdf8',
        duration: 3 + idx * 0.4,
        delay: idx * 0.35,
      };
    });
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center overflow-visible z-20">
      {/* 1. Partículas ambientales flotantes sutiles (aura viva continua) */}
      {ambientMotes.map((mote) => (
        <motion.div
          key={`ambient-${mote.id}`}
          className="absolute rounded-full"
          style={{
            width: mote.size,
            height: mote.size,
            backgroundColor: mote.color,
            boxShadow: `0 0 8px ${mote.color}`,
          }}
          initial={{
            x: mote.x,
            y: mote.y,
            opacity: 0.3,
            scale: 0.7,
          }}
          animate={{
            x: [mote.x - 6, mote.x + 6, mote.x - 6],
            y: [mote.y - 8, mote.y + 4, mote.y - 8],
            opacity: [0.2, 0.75, 0.2],
            scale: [0.7, 1.25, 0.7],
          }}
          transition={{
            duration: mote.duration,
            repeat: Infinity,
            delay: mote.delay,
            ease: 'easeInOut',
          }}
        />
      ))}

      {/* 2. Explosión dinámica de polvo de estrellas al ganar/lanzar */}
      <AnimatePresence>
        {isActive && triggerKey > 0 && (
          <div key={`burst-container-${triggerKey}`} className="relative flex items-center justify-center">
            {/* Onda de choque primaria: Anillo áureo o celestial expansivo */}
            <motion.div
              className="absolute rounded-full border-2"
              style={{
                borderColor: isSol ? '#ffd15c' : '#38bdf8',
                boxShadow: isSol
                  ? '0 0 25px rgba(255, 209, 92, 0.5), inset 0 0 15px rgba(255, 209, 92, 0.3)'
                  : '0 0 25px rgba(56, 189, 248, 0.5), inset 0 0 15px rgba(56, 189, 248, 0.3)',
              }}
              initial={{ width: 150, height: 150, opacity: 0.9, scale: 0.85 }}
              animate={{
                width: 280,
                height: 280,
                opacity: 0,
                scale: 1.25,
              }}
              transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            />

            {/* Onda de choque secundaria: Anillo punteado con giro estocástico */}
            <motion.div
              className="absolute rounded-full border border-dashed"
              style={{
                borderColor: isSol ? '#fffbeb' : '#a5f3fc',
              }}
              initial={{ width: 170, height: 170, opacity: 0.7, rotate: 0 }}
              animate={{
                width: 320,
                height: 320,
                opacity: 0,
                rotate: 60,
              }}
              transition={{ duration: 1.05, ease: 'easeOut', delay: 0.05 }}
            />

            {/* Haz de plasma central momentáneo */}
            <motion.div
              className="absolute w-44 h-44 rounded-full pointer-events-none"
              style={{
                background: isSol
                  ? 'radial-gradient(circle, rgba(255,209,92,0.45) 0%, rgba(245,158,11,0.15) 50%, transparent 75%)'
                  : 'radial-gradient(circle, rgba(56,189,248,0.45) 0%, rgba(14,165,233,0.15) 50%, transparent 75%)',
              }}
              initial={{ scale: 0.7, opacity: 0.9 }}
              animate={{ scale: 1.6, opacity: 0 }}
              transition={{ duration: 0.7, ease: 'easeOut' }}
            />

            {/* Destellos de Polvo de Estrellas individuales */}
            {particles.map((p) => {
              const startX = Math.cos(p.angle) * 82;
              const startY = Math.sin(p.angle) * 82;
              const targetX = Math.cos(p.angle) * (82 + p.distance) + p.driftX;
              const targetY = Math.sin(p.angle) * (82 + p.distance) + p.driftY;

              return (
                <motion.div
                  key={`sparkle-${triggerKey}-${p.id}`}
                  className="absolute flex items-center justify-center pointer-events-none"
                  style={{ width: p.size, height: p.size }}
                  initial={{
                    x: startX,
                    y: startY,
                    scale: 0,
                    opacity: 0,
                    rotate: 0,
                  }}
                  animate={{
                    x: [startX, targetX * 0.8, targetX],
                    y: [startY, targetY * 0.8, targetY],
                    scale: [0, 1.4, 1, 0.4, 0],
                    opacity: [0, 1, 0.9, 0.5, 0],
                    rotate: [0, p.rotateDeg * 0.5, p.rotateDeg],
                  }}
                  transition={{
                    duration: p.duration,
                    delay: p.delay,
                    ease: [0.18, 0.89, 0.32, 1.15],
                  }}
                >
                  {p.type === 'star' ? (
                    // Estrella de 4 puntas clásica de grimorio alquímico
                    <svg viewBox="0 0 24 24" className="w-full h-full filter drop-shadow-[0_0_6px_currentColor]" style={{ color: p.color }}>
                      <path
                        fill="currentColor"
                        d="M12,0 L14.5,9.5 L24,12 L14.5,14.5 L12,24 L9.5,14.5 L0,12 L9.5,9.5 Z"
                      />
                    </svg>
                  ) : p.type === 'diamond' ? (
                    // Diamante brillante estocástico
                    <div
                      className="w-full h-full rotate-45"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 8px ${p.color}`,
                      }}
                    />
                  ) : p.type === 'spark' ? (
                    // Estática lineal luminosa
                    <div
                      className="w-full h-0.5 rounded-full"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 6px ${p.color}`,
                        transform: `rotate(${p.angle}rad)`,
                      }}
                    />
                  ) : (
                    // Orbe de polvo estelar esférico con halo
                    <div
                      className="w-full h-full rounded-full"
                      style={{
                        backgroundColor: p.color,
                        boxShadow: `0 0 10px ${p.color}, 0 0 4px #ffffff`,
                      }}
                    />
                  )}
                </motion.div>
              );
            })}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CoinStardustEffect;
