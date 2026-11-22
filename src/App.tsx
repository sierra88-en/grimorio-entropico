import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coins,
  Dice5,
  Disc,
  Sparkles,
  Info,
  Radio,
  ShieldCheck,
  Moon,
  ExternalLink,
  Github,
  Plus,
  X,
  Trash2,
  Copy,
  ChevronDown,
  Shield,
  Code2,
  Sun,
  Activity,
  Clock,
  BookmarkPlus,
  Layers,
  Share2,
  Vibrate,
  FileText,
  Crown,
  Download
} from 'lucide-react';
import { TAROT_ARCANOS_MAYORES, CartaTarot, IntencionTipo, INTENCIONES } from './data/tarotData';
import { fetchHybridEntropy, fetchDistinctHybridEntropy, EntropyResult } from './utils/entropyEngine';
import { sound } from './utils/audio';
import { haptics } from './utils/haptics';
import { usePWAInstall } from './hooks/usePWAInstall';
import {
  loadOracleHistory,
  appendOracleHistory,
  clearOracleHistory,
  loadCustomRuletaPresets,
  saveCustomRuletaPreset,
  OracleHistoryEntry,
  SavedRuletaPreset
} from './utils/oracleHistory';

// Bundled assets (relative paths safe for Capacitor WebView & Vite base: './')
import coinMedallionImg from './assets/images/alchemical_sun_moon_sigil_1794281853150.jpg';
import authorAvatarImg from './assets/images/author_avatar.jpg';
import { CoinStardustEffect } from './components/CoinStardustEffect';
import { StatisticalBenchmarkModal } from './components/StatisticalBenchmarkModal';
import { OracleHistoryModal } from './components/OracleHistoryModal';
import { ShareOracleCardModal, ShareOraclePayload } from './components/ShareOracleCardModal';
import { AlchemicalProModal } from './components/AlchemicalProModal';

type MobileTab = 'moneda' | 'dados' | 'ruleta' | 'tarot' | 'acerca';
type DiceType = 4 | 6 | 8 | 10 | 12 | 20 | 100;

interface DiceResult {
  face: DiceType;
  value: number;
}

/**
 * Componente 3D Poliédrico Cristalino para Dados RPG con física de colisión y rebote
 * Implementado con Framer Motion
 */
const PolyhedralDie: React.FC<{
  face: DiceType;
  value: number;
  isRolling: boolean;
  delayIndex: number;
  totalDice?: number;
  rollSessionId?: number;
}> = ({ face, value, isRolling, delayIndex, totalDice = 5, rollSessionId = 0 }) => {
  // Cálculo de vectores angulares para dispersión y choque centrípeto
  const safeTotal = Math.max(totalDice, 1);
  const angle = ((2 * Math.PI) / safeTotal) * delayIndex - Math.PI / 2;
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const isSingle = safeTotal === 1;
  const isDouble = safeTotal === 2;

  // Trayectorias físicas: Salida periférica -> Choque violento al centro -> Rebote elástico -> Asentamiento
  const initialX = isSingle ? 0 : isDouble ? (delayIndex === 0 ? -48 : 48) : cos * 52;
  const impactX = isSingle ? 0 : isDouble ? (delayIndex === 0 ? 12 : -12) : -cos * 16;
  const reboundX = isSingle ? 0 : isDouble ? (delayIndex === 0 ? -22 : 22) : cos * 24;
  const microBounceX = isSingle ? 0 : isDouble ? (delayIndex === 0 ? 6 : -6) : -cos * 6;

  const initialY = isSingle ? -45 : isDouble ? 0 : sin * 45;
  const impactY = isSingle ? 14 : isDouble ? 0 : -sin * 14;
  const reboundY = isSingle ? -16 : isDouble ? (delayIndex === 0 ? -10 : 10) : sin * 20;
  const microBounceY = isSingle ? 4 : isDouble ? (delayIndex === 0 ? 3 : -3) : -sin * 5;

  const initialRotate = isSingle ? -45 : (delayIndex % 2 === 0 ? 180 : -180);
  const finalTilt = (delayIndex % 2 === 0 ? 1 : -1) * (4 + (delayIndex * 3) % 7);

  return (
    <motion.div
      key={`${rollSessionId}-${delayIndex}-${face}`}
      className="relative flex items-center justify-center cursor-pointer select-none"
      initial={{
        scale: 0.8,
        x: initialX,
        y: initialY,
        rotate: initialRotate,
        opacity: 0.9,
      }}
      animate={
        isRolling
          ? {
              x: [0, (delayIndex % 2 === 0 ? -14 : 14), (delayIndex % 2 === 0 ? 10 : -10), 0],
              y: [0, -22, 14, -12, 0],
              rotate: [0, 90, -140, 260, 360],
              scale: [1, 1.22, 0.88, 1.18, 1],
              transition: {
                duration: 0.48,
                repeat: Infinity,
                ease: "linear",
              },
            }
          : {
              // Simulación de choque elástico con rebote (física de colisión)
              x: [initialX, impactX, reboundX, microBounceX, 0],
              y: [initialY, impactY, reboundY, microBounceY, 0],
              rotate: [
                initialRotate,
                -initialRotate * 0.45,
                initialRotate * 0.22,
                finalTilt * 2.2,
                finalTilt,
              ],
              // Squash & stretch al chocar
              scale: [0.92, 1.32, 0.82, 1.12, 0.97, 1],
              opacity: 1,
              transition: {
                duration: 0.85,
                times: [0, 0.26, 0.52, 0.78, 1],
                ease: [0.18, 0.89, 0.32, 1.15],
                delay: delayIndex * 0.035,
              },
            }
      }
      whileHover={{
        scale: 1.15,
        y: -6,
        rotate: finalTilt + 8,
        transition: { type: "spring", stiffness: 450, damping: 10 },
      }}
      whileTap={{
        scale: 0.88,
        rotate: finalTilt - 10,
        transition: { type: "spring", stiffness: 550, damping: 12 },
      }}
      onClick={() => {
        sound.playClick();
      }}
    >
      {/* Halo de choque sutil que se disipa al rebotar */}
      {!isRolling && (
        <motion.div
          className="absolute -inset-2.5 rounded-full border border-[#38bdf8]/40 pointer-events-none"
          initial={{ scale: 0.5, opacity: 0.8 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ duration: 0.5, delay: 0.24 + delayIndex * 0.035, ease: "easeOut" }}
        />
      )}

      <div className="relative w-16 h-16 sm:w-18 sm:h-18 flex items-center justify-center filter drop-shadow-[0_8px_16px_rgba(14,165,233,0.35)]">
        {/* Faceted SVG 3D Geometry con personalidad de gema alquímica */}
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <linearGradient id={`grad-die-main-${face}-${delayIndex}`} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#082f49" />
            </linearGradient>
            <linearGradient id={`grad-die-top-${face}-${delayIndex}`} x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" />
              <stop offset="100%" stopColor="#0284c7" />
            </linearGradient>
            <linearGradient id={`grad-die-side-${face}-${delayIndex}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#0f766e" />
              <stop offset="100%" stopColor="#042f2e" />
            </linearGradient>
          </defs>

          {/* Polyhedral Facets depending on type */}
          {face === 20 || face === 100 ? (
            // Icosaedro / d20
            <g stroke="#67e8f9" strokeWidth="1.2" strokeLinejoin="round">
              <polygon points="50,6 88,28 50,44 12,28" fill={`url(#grad-die-top-${face}-${delayIndex})`} />
              <polygon points="12,28 50,44 50,86 16,72" fill={`url(#grad-die-side-${face}-${delayIndex})`} />
              <polygon points="88,28 50,44 50,86 84,72" fill={`url(#grad-die-main-${face}-${delayIndex})`} />
              <polygon points="50,44 26,70 74,70" fill="#0284c7" opacity="0.9" />
              <polygon points="16,72 50,86 50,96 18,84" fill="#082f49" />
              <polygon points="84,72 50,86 50,96 82,84" fill="#0c4a6e" />
            </g>
          ) : face === 12 ? (
            // Dodecaedro / d12
            <g stroke="#67e8f9" strokeWidth="1.2" strokeLinejoin="round">
              <polygon points="50,12 85,38 72,78 28,78 15,38" fill={`url(#grad-die-main-${face}-${delayIndex})`} />
              <polygon points="50,12 85,38 96,24 50,2" fill={`url(#grad-die-top-${face}-${delayIndex})`} />
              <polygon points="85,38 72,78 94,84" fill={`url(#grad-die-side-${face}-${delayIndex})`} />
              <polygon points="28,78 72,78 50,96" fill="#042f2e" />
            </g>
          ) : face === 8 ? (
            // Octaedro / d8
            <g stroke="#67e8f9" strokeWidth="1.2" strokeLinejoin="round">
              <polygon points="50,8 88,50 50,66" fill={`url(#grad-die-top-${face}-${delayIndex})`} />
              <polygon points="50,8 12,50 50,66" fill={`url(#grad-die-main-${face}-${delayIndex})`} />
              <polygon points="50,66 88,50 50,92" fill={`url(#grad-die-side-${face}-${delayIndex})`} />
              <polygon points="50,66 12,50 50,92" fill="#082f49" />
            </g>
          ) : face === 6 ? (
            // Cubo / d6
            <g stroke="#67e8f9" strokeWidth="1.2" strokeLinejoin="round">
              <polygon points="50,10 88,32 50,54 12,32" fill={`url(#grad-die-top-${face}-${delayIndex})`} />
              <polygon points="12,32 50,54 50,92 12,70" fill={`url(#grad-die-side-${face}-${delayIndex})`} />
              <polygon points="88,32 50,54 50,92 88,70" fill={`url(#grad-die-main-${face}-${delayIndex})`} />
            </g>
          ) : (
            // Tetraedro / d4 & d10
            <g stroke="#67e8f9" strokeWidth="1.2" strokeLinejoin="round">
              <polygon points="50,10 90,82 50,64" fill={`url(#grad-die-top-${face}-${delayIndex})`} />
              <polygon points="50,10 10,82 50,64" fill={`url(#grad-die-main-${face}-${delayIndex})`} />
              <polygon points="50,64 10,82 90,82" fill={`url(#grad-die-side-${face}-${delayIndex})`} />
            </g>
          )}

          {/* Crystalline specular reflection */}
          <circle cx="34" cy="30" r="4" fill="#ffffff" opacity="0.45" filter="blur(1px)" />
        </svg>

        {/* Die Face Number */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
          <span className="font-cinzel text-lg sm:text-xl font-black text-[#ffffff] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] leading-none mt-1">
            {value}
          </span>
          <span className="text-[9px] font-mono font-bold text-[#ffd15c] opacity-90 leading-none mt-0.5">
            d{face}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

/**
 * Rescatador SVG para Cartas del Tarot
 */
const ImageWithFallback: React.FC<{ card: CartaTarot; isRevealing?: boolean }> = ({ card, isRevealing }) => {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [card.id]);

  if (hasError) {
    return (
      <div className="w-full h-full p-3 bg-gradient-to-b from-[#0e1626] via-[#090e18] to-[#05080e] flex flex-col items-center justify-between text-center select-none border border-[#ffd15c]/40">
        <div className="w-full flex items-center justify-between text-xs font-mono text-[#ffd15c] px-1">
          <span>{card.numeroRomano}</span>
          <span className="text-lg leading-none">{card.simboloAlquimico}</span>
        </div>

        <div className="relative my-auto flex flex-col items-center justify-center">
          <svg className="w-24 h-24 text-[#ffd15c]/25 animate-[spin_50s_linear_infinite]" viewBox="0 0 100 100">
            <polygon points="50,5 90,85 10,85" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <polygon points="50,95 90,15 10,15" fill="none" stroke="currentColor" strokeWidth="1.2" />
            <circle cx="50" cy="50" r="34" fill="none" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="0.8" />
          </svg>
          <div className="absolute text-4xl text-[#ffd15c] drop-shadow-[0_0_12px_rgba(255,209,92,0.5)]">
            {card.simboloAlquimico}
          </div>
        </div>

        <div className="w-full pb-1">
          <div className="font-cinzel text-xs font-bold text-[#f5ebd7] truncate tracking-wider">
            {card.nombre}
          </div>
          <div className="text-[9px] text-[#ffd15c]/80 font-mono mt-0.5">
            {card.elementoPlaneta}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative overflow-hidden bg-[#0c1322]">
      <img
        src={card.imagen}
        alt={card.nombre}
        referrerPolicy="no-referrer"
        onError={() => setHasError(true)}
        className={`w-full h-full object-cover object-top transition-transform duration-300 ${
          isRevealing ? 'scale-110 blur-xs' : 'scale-100'
        }`}
      />
      {isRevealing && (
        <div className="absolute inset-0 bg-[#ffd15c]/20 backdrop-blur-xs flex items-center justify-center">
          <Sparkles className="w-8 h-8 text-[#ffd15c] animate-spin" />
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState<MobileTab>('moneda');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState<boolean>(() => haptics.isEnabled());
  const [currentEntropy, setCurrentEntropy] = useState<EntropyResult | null>(null);
  const [showEntropyAudit, setShowEntropyAudit] = useState(false);
  const [showBenchmarkModal, setShowBenchmarkModal] = useState(false);
  const [showProModal, setShowProModal] = useState(false);
  const { isInstallable, isInstalled, install: installPWA } = usePWAInstall();

  // Bitácora del Oráculo & Tarjeta Compartible
  const [oracleHistory, setOracleHistory] = useState<OracleHistoryEntry[]>(() => loadOracleHistory());
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [sharePayload, setSharePayload] = useState<ShareOraclePayload | null>(null);

  // ==========================================
  // 1. MONEDA ALQUÍMICA + PREGUNTA / INTENCIÓN
  // ==========================================
  const [isCoinFlipping, setIsCoinFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<'SOL' | 'LUNA' | null>('SOL');
  const [coinRotation, setCoinRotation] = useState(0);
  const [stardustTrigger, setStardustTrigger] = useState<number>(1);
  const [coinQuestion, setCoinQuestion] = useState('');
  const [coinEntropy, setCoinEntropy] = useState<EntropyResult | null>(null);

  const handleFlipCoin = async () => {
    if (isCoinFlipping) return;
    setIsCoinFlipping(true);
    haptics.tap();
    if (soundEnabled) sound.playCoinFlip();

    const spins = 5 + Math.floor(Math.random() * 3);

    try {
      // 0 = SOL (Sí), 1 = LUNA (No)
      const entropy = await fetchHybridEntropy(0, 1, 2800);
      setCurrentEntropy(entropy);
      const isSol = entropy.value === 0;
      const targetDeg = spins * 360 + (isSol ? 0 : 180);
      setCoinRotation((prev) => prev + targetDeg);

      setTimeout(() => {
        const outcome: 'SOL' | 'LUNA' = isSol ? 'SOL' : 'LUNA';
        setCoinResult(outcome);
        setCoinEntropy(entropy);
        setIsCoinFlipping(false);
        setStardustTrigger((prev) => prev + 1);
        haptics.coinLand();
        if (soundEnabled) {
          sound.playCoinLand();
          sound.playChime();
        }

        const cleanQ = coinQuestion.trim();
        const updatedHistory = appendOracleHistory({
          type: 'moneda',
          question: cleanQ || undefined,
          resultTitle: isSol ? 'Sol Invictus (Sí)' : 'Luna Regalis (No)',
          resultDetail: cleanQ ? `Decisión sellada para tu consulta.` : 'Sello Ritual de Decisión.',
          source: entropy.source,
          sourceLabel: entropy.sourceLabel,
          seedHex: entropy.seedHex,
          latencyMs: entropy.latencyMs,
        });
        setOracleHistory(updatedHistory);
      }, 1500);
    } catch {
      setIsCoinFlipping(false);
    }
  };

  // ==========================================
  // 2. DADOS RPG 3D
  // ==========================================
  const [diceCount, setDiceCount] = useState<number>(5);
  const [selectedDiceType, setSelectedDiceType] = useState<DiceType>(20);
  const [diceResults, setDiceResults] = useState<DiceResult[]>([
    { face: 20, value: 18 },
    { face: 20, value: 5 },
    { face: 20, value: 14 },
    { face: 20, value: 19 },
    { face: 20, value: 12 }
  ]);
  const [isRollingDice, setIsRollingDice] = useState(false);
  const [rollSessionId, setRollSessionId] = useState<number>(1);
  const [diceEntropy, setDiceEntropy] = useState<EntropyResult | null>(null);

  const handleRollDice = async () => {
    if (isRollingDice) return;
    setIsRollingDice(true);
    haptics.tap();
    if (soundEnabled) sound.playClick();

    try {
      const rolls: DiceResult[] = [];
      let lastEnt: EntropyResult | null = null;

      for (let i = 0; i < diceCount; i++) {
        const ent = await fetchHybridEntropy(1, selectedDiceType, 1800);
        lastEnt = ent;
        rolls.push({ face: selectedDiceType, value: ent.value });
      }

      if (lastEnt) setCurrentEntropy(lastEnt);

      setTimeout(() => {
        setDiceResults(rolls);
        if (lastEnt) setDiceEntropy(lastEnt);
        setIsRollingDice(false);
        setRollSessionId((prev) => prev + 1);
        haptics.diceCollision();
        if (soundEnabled) sound.playDiceCollision();

        if (lastEnt) {
          const sum = rolls.reduce((a, b) => a + b.value, 0);
          const breakdown = rolls.map((r) => r.value).join(' + ');
          const updatedHistory = appendOracleHistory({
            type: 'dados',
            resultTitle: `${diceCount}×d${selectedDiceType} = ${sum}`,
            resultDetail: diceCount > 1 ? `Tirada: ${breakdown}` : `Resultado único en d${selectedDiceType}`,
            source: lastEnt.source,
            sourceLabel: lastEnt.sourceLabel,
            seedHex: lastEnt.seedHex,
            latencyMs: lastEnt.latencyMs,
          });
          setOracleHistory(updatedHistory);
        }
      }, 550);
    } catch {
      setIsRollingDice(false);
    }
  };

  const totalDiceSum = diceResults.slice(0, diceCount).reduce((acc, curr) => acc + curr.value, 0);

  // ==========================================
  // 3. RULETA ESTOCÁSTICA (Tonos Joya + Presets)
  // ==========================================
  const [ruletaMode, setRuletaMode] = useState<'ruleta' | 'lista'>('ruleta');
  const [ruletaOptions, setRuletaOptions] = useState<string[]>([]);
  const [newOptionText, setNewOptionText] = useState('');
  const [chosenOption, setChosenOption] = useState<string | null>(null);
  const [isSpinningWheel, setIsSpinningWheel] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [ruletaEntropy, setRuletaEntropy] = useState<EntropyResult | null>(null);
  const [showPresetsMenu, setShowPresetsMenu] = useState(false);
  const [customRuletaPresets, setCustomRuletaPresets] = useState<SavedRuletaPreset[]>(() => loadCustomRuletaPresets());
  const [presetSavedNotice, setPresetSavedNotice] = useState(false);

  const BUILTIN_PRESETS: { name: string; options: string[] }[] = [
    { name: 'Oráculo Sí / No', options: ['Sí', 'No', 'Tal vez', 'Esperar'] },
    { name: '¿Qué cenar?', options: ['Pizza', 'Tacos', 'Sushi', 'Pasta', 'Burgers', 'Ensalada'] },
    { name: 'Números 1–6', options: ['1', '2', '3', '4', '5', '6'] },
    { name: 'Acción / Pausa', options: ['Actuar ya', 'Esperar 24h', 'Pedir guía', 'Cambiar rumbo'] },
  ];

  const handleApplyPreset = (options: string[]) => {
    setRuletaOptions(options);
    setChosenOption(null);
    setShowPresetsMenu(false);
    haptics.tap();
    if (soundEnabled) sound.playClick();
  };

  const handleSaveCurrentPreset = () => {
    if (ruletaOptions.length < 2) return;
    const defaultName = ruletaOptions.slice(0, 2).join(' / ');
    const updated = saveCustomRuletaPreset(defaultName, ruletaOptions);
    setCustomRuletaPresets(updated);
    setPresetSavedNotice(true);
    haptics.tap();
    if (soundEnabled) sound.playClick();
    setTimeout(() => setPresetSavedNotice(false), 1800);
  };

  const handleAddOption = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newOptionText.trim();
    if (!trimmed) return;
    if (ruletaOptions.includes(trimmed)) return;
    setRuletaOptions([...ruletaOptions, trimmed]);
    setNewOptionText('');
    haptics.tap();
    if (soundEnabled) sound.playClick();
  };

  const handleRemoveOption = (indexToRemove: number) => {
    setRuletaOptions(ruletaOptions.filter((_, idx) => idx !== indexToRemove));
    haptics.tap();
    if (soundEnabled) sound.playClick();
  };

  const handleClearAllOptions = () => {
    setRuletaOptions([]);
    setChosenOption(null);
    haptics.tap();
    if (soundEnabled) sound.playClick();
  };

  const handleSpinWheel = async () => {
    if (isSpinningWheel || ruletaOptions.length < 2) return;
    setIsSpinningWheel(true);
    setShowPresetsMenu(false);
    haptics.wheelSpin();
    if (soundEnabled) sound.playCoinFlip();

    try {
      const entropy = await fetchHybridEntropy(0, ruletaOptions.length - 1, 2800);
      setCurrentEntropy(entropy);
      const chosenIndex = entropy.value;
      const winner = ruletaOptions[chosenIndex];

      const sliceAngle = 360 / ruletaOptions.length;
      const extraSpins = (6 + Math.floor(Math.random() * 3)) * 360;
      const targetDeg = extraSpins + (360 - chosenIndex * sliceAngle - sliceAngle / 2);
      setWheelRotation((prev) => prev + targetDeg);

      setTimeout(() => {
        setChosenOption(winner);
        setRuletaEntropy(entropy);
        setIsSpinningWheel(false);
        haptics.coinLand();
        if (soundEnabled) sound.playChime();

        const updatedHistory = appendOracleHistory({
          type: 'ruleta',
          resultTitle: winner,
          resultDetail: `Elegido entre ${ruletaOptions.length} opciones`,
          source: entropy.source,
          sourceLabel: entropy.sourceLabel,
          seedHex: entropy.seedHex,
          latencyMs: entropy.latencyMs,
        });
        setOracleHistory(updatedHistory);
      }, 1600);
    } catch {
      setIsSpinningWheel(false);
    }
  };

  // ==========================================
  // 4. TAROT ENTRÓPICO (1 CARTA + TIRADA DE 3 CARTAS)
  // ==========================================
  const [selectedIntencion, setSelectedIntencion] = useState<IntencionTipo>('amor');
  const [tarotSpreadMode, setTarotSpreadMode] = useState<'single' | 'three'>('single');
  const [currentCard, setCurrentCard] = useState<CartaTarot>(() => TAROT_ARCANOS_MAYORES[6]); // Los Enamorados
  const [threeCardSpread, setThreeCardSpread] = useState<{ label: string; card: CartaTarot }[]>(() => [
    { label: 'Pasado', card: TAROT_ARCANOS_MAYORES[2] },
    { label: 'Presente', card: TAROT_ARCANOS_MAYORES[6] },
    { label: 'Futuro', card: TAROT_ARCANOS_MAYORES[19] },
  ]);
  const [selectedSpreadIndex, setSelectedSpreadIndex] = useState<number>(1);
  const [isTarotRevealing, setIsTarotRevealing] = useState(false);
  const [tarotEntropy, setTarotEntropy] = useState<EntropyResult | null>(null);

  const handleRevealTarot = async () => {
    if (isTarotRevealing) return;
    setIsTarotRevealing(true);
    haptics.tap();
    if (soundEnabled) sound.playTuningSweep();

    try {
      if (tarotSpreadMode === 'single') {
        const entropy = await fetchHybridEntropy(0, 21, 2800);
        setCurrentEntropy(entropy);
        const drawn = TAROT_ARCANOS_MAYORES.find((c) => c.id === entropy.value) || TAROT_ARCANOS_MAYORES[0];

        setTimeout(() => {
          setCurrentCard(drawn);
          setTarotEntropy(entropy);
          setIsTarotRevealing(false);
          haptics.tarotReveal();
          if (soundEnabled) sound.playChime();

          const intencionLabel = INTENCIONES.find((i) => i.id === selectedIntencion)?.label || selectedIntencion;
          const updatedHistory = appendOracleHistory({
            type: 'tarot',
            question: `Intención: ${intencionLabel} (1 Carta)`,
            resultTitle: `${drawn.nombre} (${drawn.numeroRomano})`,
            resultDetail: drawn.interpretacion[selectedIntencion],
            source: entropy.source,
            sourceLabel: entropy.sourceLabel,
            seedHex: entropy.seedHex,
            latencyMs: entropy.latencyMs,
          });
          setOracleHistory(updatedHistory);
        }, 850);
      } else {
        const { values, lastEntropy } = await fetchDistinctHybridEntropy(3, 0, 21, 2000);
        setCurrentEntropy(lastEntropy);
        const labels = ['Pasado', 'Presente', 'Futuro'];
        const drawnSpread = values.map((id, idx) => ({
          label: labels[idx],
          card: TAROT_ARCANOS_MAYORES.find((c) => c.id === id) || TAROT_ARCANOS_MAYORES[idx],
        }));

        setTimeout(() => {
          setThreeCardSpread(drawnSpread);
          setSelectedSpreadIndex(1);
          setTarotEntropy(lastEntropy);
          setIsTarotRevealing(false);
          haptics.tarotReveal();
          if (soundEnabled) sound.playChime();

          const intencionLabel = INTENCIONES.find((i) => i.id === selectedIntencion)?.label || selectedIntencion;
          const summary = drawnSpread.map((s) => `${s.label}: ${s.card.nombre}`).join(' · ');
          const updatedHistory = appendOracleHistory({
            type: 'tarot',
            question: `Intención: ${intencionLabel} (3 Cartas)`,
            resultTitle: `${drawnSpread[0].card.nombre} / ${drawnSpread[1].card.nombre} / ${drawnSpread[2].card.nombre}`,
            resultDetail: summary,
            source: lastEntropy.source,
            sourceLabel: lastEntropy.sourceLabel,
            seedHex: lastEntropy.seedHex,
            latencyMs: lastEntropy.latencyMs,
          });
          setOracleHistory(updatedHistory);
        }, 950);
      }
    } catch {
      setIsTarotRevealing(false);
    }
  };

  // ==========================================
  // 5. ACERCA DE & TEORÍA TÉCNICA
  // ==========================================
  const [openSection, setOpenSection] = useState<'none' | 'teoria' | 'prueba' | 'ejemplos'>('none');
  const [copiedCodeLang, setCopiedCodeLang] = useState<string | null>(null);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCodeLang(label);
    setTimeout(() => setCopiedCodeLang(null), 1800);
  };

  return (
    <div className="h-[100dvh] max-h-[100dvh] w-full bg-[#07090e] text-[#ded8c7] flex flex-col justify-between overflow-hidden select-none font-sans relative">
      {/* Fondo estelar sutil con constelaciones */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full bg-[#0e3b4a]/15 blur-[90px]" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 translate-y-1/2 w-[280px] h-[280px] rounded-full bg-[#78350f]/15 blur-[80px]" />
        {/* Constelaciones tenues */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffd15c_1px,transparent_1px)] [background-size:24px_24px]" />
      </div>

      {/* HEADER: ESTÉTICA DEL GRIMORIO ("EL UNIVERSO DECIDE") */}
      <header className="relative z-10 h-13 px-3 sm:px-4 pt-1 flex items-center justify-between border-b border-[#1a2233]/80 bg-[#0a0d14]/90 backdrop-blur-md shrink-0">
        {/* Cartouche dorado */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="px-2.5 py-0.5 rounded border border-[#ffd15c]/40 bg-[#121824] shadow-sm shadow-[#ffd15c]/20">
            <span className="font-cinzel text-[11px] sm:text-xs font-black tracking-widest text-[#f5ebd7] whitespace-nowrap">
              EL UNIVERSO DECIDE
            </span>
          </div>
        </div>

        {/* Bitácora + Insignia Interactiva de Entropía */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => {
              haptics.tap();
              setShowHistoryModal(true);
            }}
            className="flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] font-mono border border-[#1e293b] bg-[#0c1322] text-[#cbd5e1] hover:border-[#dfb15b]/50 hover:text-[#ffd15c] transition-colors"
            title="Bitácora del Oráculo (Historial)"
          >
            <Clock className="w-3 h-3 text-[#dfb15b]" />
            <span className="hidden xs:inline">Bitácora</span>
            {oracleHistory.length > 0 && (
              <span className="text-[9px] text-[#ffd15c] tabular-nums">({oracleHistory.length})</span>
            )}
          </button>

          <button
            onClick={() => {
              haptics.tap();
              setShowEntropyAudit(true);
            }}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-mono border transition-all whitespace-nowrap ${
              currentEntropy?.source === 'CSPRNG_KERNEL_LOCAL'
                ? 'border-amber-500/50 bg-amber-950/50 text-amber-200 hover:border-amber-400'
                : currentEntropy?.source === 'RANDOM_ORG_ATMOSPHERIC'
                ? 'border-emerald-500/50 bg-emerald-950/50 text-emerald-200 hover:border-emerald-400'
                : 'border-[#0ea5e9]/50 bg-gradient-to-r from-[#0c2338]/80 to-[#082f49]/80 text-[#7dd3fc] hover:border-[#38bdf8]'
            }`}
            title="Ver fuente y referencia del resultado"
          >
            {currentEntropy?.source === 'CSPRNG_KERNEL_LOCAL' ? (
              <>
                <ShieldCheck className="w-3 h-3 text-amber-400 shrink-0" />
                <span>Web Crypto Local</span>
              </>
            ) : currentEntropy?.source === 'RANDOM_ORG_ATMOSPHERIC' ? (
              <>
                <Radio className="w-3 h-3 text-emerald-400 shrink-0" />
                <span>RANDOM.ORG</span>
              </>
            ) : (
              <>
                <Radio className="w-3 h-3 text-[#38bdf8] shrink-0" />
                <span>Motor Híbrido</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* 1. MÓDULO: MONEDA ALQUÍMICA (Alineada al mockup exacto)   */}
      {/* ========================================================= */}
      {activeTab === 'moneda' && (
        <main className="relative z-10 flex-1 flex flex-col justify-between items-center px-5 py-2.5 text-center overflow-hidden max-w-md mx-auto w-full">
          {/* Título de la moneda */}
          <div className="space-y-0.5 pt-0.5">
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#94a3b8] font-garamond italic">
              <Sparkles className="w-3 h-3 text-[#dfb15b]" />
              <span>Sello Ritual de Decisión</span>
            </div>
            <h2 className="font-cinzel text-xl font-bold tracking-wide text-[#f8fafc]">
              {coinResult === 'SOL' ? 'Sol Invictus (Sí)' : 'Luna Regalis (No)'}
            </h2>
          </div>

          {/* Medallón Alquímico 3D con halo astronómico y polvo de estrellas */}
          <div className="relative my-auto flex flex-col items-center justify-center">
            {/* Sistema de Partículas: Polvo de Estrellas y Estática Mágica */}
            <CoinStardustEffect
              triggerKey={stardustTrigger}
              resultType={coinResult}
              isActive={!isCoinFlipping}
            />

            {/* Guías circulares celestes */}
            <div className="absolute w-[240px] h-[240px] rounded-full border border-dashed border-[#dfb15b]/25 pointer-events-none animate-[spin_60s_linear_infinite]" />
            <div className="absolute w-[190px] h-[190px] rounded-full border border-dotted border-[#38bdf8]/20 pointer-events-none" />

            <div
              onClick={handleFlipCoin}
              className="relative w-44 h-44 sm:w-48 sm:h-48 perspective-1000 cursor-pointer active:scale-95 transition-transform"
            >
              <div
                className="w-full h-full relative preserve-3d transition-transform duration-[1500ms] ease-[cubic-bezier(0.18,0.89,0.32,1.15)]"
                style={{ transform: `rotateY(${coinRotation}deg)` }}
              >
                {/* CARA: SOL INVICTUS (Medallón de Bronce/Oro Alquímico) */}
                <div className="absolute inset-0 rounded-full backface-hidden p-1.5 bg-gradient-to-tr from-[#6c4812] via-[#e2b03d] to-[#fff3b8] shadow-2xl shadow-[#dfb15b]/30 border-4 border-[#ffed9e] overflow-hidden flex items-center justify-center">
                  <img
                    src={coinMedallionImg}
                    alt="Sol Invictus"
                    className="w-full h-full object-cover rounded-full filter contrast-125"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-black/40 via-transparent to-white/20 pointer-events-none" />
                </div>

                {/* CRUZ: LUNA REGALIS (Plata Mística) */}
                <div className="absolute inset-0 rounded-full backface-hidden rotate-y-180 p-2.5 bg-gradient-to-tr from-[#0f172a] via-[#334155] to-[#cbd5e1] shadow-2xl shadow-[#38bdf8]/20 border-4 border-[#94a3b8] flex flex-col items-center justify-center overflow-hidden">
                  <div className="w-20 h-20 rounded-full bg-[#1e293b] shadow-inner flex items-center justify-center border border-[#94a3b8]/60 mb-1">
                    <Moon className="w-10 h-10 text-[#38bdf8]" />
                  </div>
                  <span className="font-cinzel text-base font-black tracking-widest text-[#f8fafc]">
                    LUNA REGALIS
                  </span>
                  <span className="text-[9px] font-mono font-bold text-[#94a3b8] mt-0.5">
                    RECEPTIVO · NO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Tarjeta de Pergamino: "Sintoniza tu intención" + Campo de Pregunta Opcional */}
          <div className="w-full max-w-xs p-2.5 rounded-xl bg-gradient-to-b from-[#f5ebd7] to-[#e6d5b8] border-2 border-[#b89762] shadow-xl text-[#3d2c14] text-center space-y-1.5 relative overflow-hidden">
            <div className="font-cinzel text-[11px] font-bold tracking-wide uppercase">
              Sintoniza tu intención
            </div>
            <input
              type="text"
              value={coinQuestion}
              onChange={(e) => setCoinQuestion(e.target.value)}
              maxLength={80}
              placeholder="Pregunta opcional (ej. ¿Acepto la oferta?)"
              className="w-full px-2.5 py-1 rounded-lg bg-[#e8d7b9]/85 border border-[#b89762]/70 text-[11px] font-garamond font-semibold text-[#2d1e0a] placeholder-[#785c30] text-center focus:outline-none focus:border-[#784e12]"
            />

            {coinEntropy && !isCoinFlipping && (
              <button
                onClick={() =>
                  setSharePayload({
                    modeLabel: 'Moneda Alquímica',
                    question: coinQuestion.trim() || undefined,
                    verdictTitle: coinResult === 'SOL' ? 'Sol Invictus (Sí)' : 'Luna Regalis (No)',
                    verdictSubtitle: 'Resultado generado por la fuente indicada en el detalle.',
                    accentTheme: coinResult === 'SOL' ? 'sol' : 'luna',
                    entropy: coinEntropy,
                  })
                }
                className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-[#3d2c14]/10 hover:bg-[#3d2c14]/20 text-[10px] font-mono text-[#3d2c14] transition-colors"
              >
                <Share2 className="w-2.5 h-2.5" />
                <span>{coinEntropy.seedHex} · {coinEntropy.latencyMs}ms · Compartir tarjeta</span>
              </button>
            )}
          </div>

          {/* Botón Esculpido [ LANZAR ] */}
          <div className="w-full space-y-1 pb-1 pt-1.5">
            <button
              onClick={handleFlipCoin}
              disabled={isCoinFlipping}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb15b] via-[#c89b3c] to-[#996515] border-2 border-[#ffd573] text-[#140b01] font-cinzel font-black text-base tracking-widest shadow-xl shadow-[#c89b3c]/30 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isCoinFlipping ? 'SINTONIZANDO VÓRTICE...' : 'LANZAR'}
            </button>
            <p className="text-[10px] text-[#64748b]">
              El universo decidió — no el procesador.
            </p>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 2. MÓDULO: DADOS RPG (Visual 3D & Suma Matemática)        */}
      {/* ========================================================= */}
      {activeTab === 'dados' && (
        <main className="relative z-10 flex-1 flex flex-col justify-between items-center px-4 py-2 text-center overflow-hidden max-w-md mx-auto w-full">
          {/* Encabezado y configuración de Dados */}
          <div className="w-full space-y-1 text-left pt-0.5">
            <div className="flex items-center gap-1.5 text-xs text-[#94a3b8] font-garamond italic">
              <Sparkles className="w-3 h-3 text-[#dfb15b]" />
              <span>Ritual de los Dados</span>
            </div>
            <h2 className="font-cinzel text-xl font-bold tracking-wide text-[#f8fafc]">
              Dados de RPG
            </h2>

            {/* Selector de Cantidad (1 - 5) */}
            <div className="space-y-0.5 pt-0.5">
              <span className="text-[9px] font-mono tracking-widest text-[#64748b] uppercase">
                CANTIDAD
              </span>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((num) => (
                  <button
                    key={num}
                    onClick={() => {
                      if (soundEnabled) sound.playClick();
                      setDiceCount(num);
                    }}
                    className={`flex-1 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      diceCount === num
                        ? 'bg-[#dfb15b] text-[#0f172a] shadow-sm shadow-[#dfb15b]/30'
                        : 'bg-[#0c1322] border border-[#1e293b] text-[#94a3b8] hover:bg-[#162238] hover:text-[#f8fafc]'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Selector de Caras */}
            <div className="space-y-0.5 pt-0.5">
              <span className="text-[9px] font-mono tracking-widest text-[#64748b] uppercase">
                CARAS
              </span>
              <div className="flex flex-wrap gap-1.5">
                {([4, 6, 8, 10, 12, 20, 100] as DiceType[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => {
                      if (soundEnabled) sound.playClick();
                      setSelectedDiceType(d);
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      selectedDiceType === d
                        ? 'bg-[#dfb15b] text-[#0f172a] shadow-sm shadow-[#dfb15b]/30'
                        : 'bg-[#0c1322] border border-[#1e293b] text-[#94a3b8] hover:bg-[#162238] hover:text-[#f8fafc]'
                    }`}
                  >
                    d{d}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Área 3D de los dados facetados flotantes con física de colisión */}
          <div className="my-auto w-full flex items-center justify-center min-h-[140px] relative px-2">
            {/* Halo de choque cósmico en el centro de colisión */}
            <AnimatePresence>
              {!isRollingDice && (
                <motion.div
                  key={`impact-halo-${rollSessionId}`}
                  initial={{ scale: 0.3, opacity: 0.8 }}
                  animate={{ scale: 1.8, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.55, delay: 0.22, ease: "easeOut" }}
                  className="absolute w-28 h-28 rounded-full bg-gradient-to-r from-[#38bdf8]/25 via-[#dfb15b]/20 to-transparent blur-md pointer-events-none"
                />
              )}
            </AnimatePresence>

            <div className="flex flex-wrap items-center justify-center gap-3 relative z-10">
              {diceResults.slice(0, diceCount).map((die, idx) => (
                <PolyhedralDie
                  key={`${rollSessionId}-${idx}`}
                  face={die.face}
                  value={die.value}
                  isRolling={isRollingDice}
                  delayIndex={idx}
                  totalDice={diceCount}
                  rollSessionId={rollSessionId}
                />
              ))}
            </div>
          </div>

          {/* Suma matemática de resultados + Recibo Criptográfico */}
          <div className="min-h-[44px] flex flex-col items-center justify-center px-2 gap-0.5">
            <div className="font-cinzel text-xl sm:text-2xl font-black text-[#ffd15c] tracking-wider text-center drop-shadow-[0_2px_8px_rgba(255,209,92,0.35)] tabular-nums">
              {diceResults.slice(0, diceCount).map((d) => d.value).join(' + ')}
              {diceCount > 1 && ` = ${totalDiceSum}`}
            </div>
            {diceEntropy && !isRollingDice && (
              <button
                onClick={() =>
                  setSharePayload({
                    modeLabel: `Dados (${diceCount}×d${selectedDiceType})`,
                    verdictTitle: diceCount > 1 ? `Total: ${totalDiceSum}` : `Resultado: ${diceResults[0]?.value}`,
                    verdictSubtitle: `Desglose: ${diceResults.slice(0, diceCount).map((d) => d.value).join(' + ')}`,
                    accentTheme: 'cyan',
                    entropy: diceEntropy,
                  })
                }
                className="text-[10px] font-mono text-[#7dd3fc] hover:text-[#ffd15c] flex items-center gap-1 transition-colors"
              >
                <Share2 className="w-2.5 h-2.5" />
                <span>{diceEntropy.seedHex} · {diceEntropy.latencyMs}ms · Recibo</span>
              </button>
            )}
          </div>

          {/* Botón Tirar Dados */}
          <div className="w-full pb-1">
            <button
              onClick={handleRollDice}
              disabled={isRollingDice}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb15b] via-[#c89b3c] to-[#996515] border-2 border-[#ffd573] text-[#140b01] font-cinzel font-bold text-base tracking-wider shadow-lg shadow-[#c89b3c]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isRollingDice ? 'Tirando con entropía...' : 'Tirar dados'}
            </button>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 3. MÓDULO: RULETA PERSONALIZABLE (EN BLANCO POR DEFECTO)  */}
      {/* ========================================================= */}
      {activeTab === 'ruleta' && (
        <main className="relative z-10 flex-1 flex flex-col justify-between items-center px-4 py-2 text-center overflow-hidden max-w-md mx-auto w-full">
          {/* Input para agregar opciones personalizadas */}
          <form onSubmit={handleAddOption} className="w-full flex items-center gap-2 pt-0.5">
            <input
              type="text"
              value={newOptionText}
              onChange={(e) => setNewOptionText(e.target.value)}
              placeholder="Escribe tu propia opción..."
              className="flex-1 px-3 py-2 rounded-xl bg-[#0c1322] border border-[#1e293b] text-xs text-[#f8fafc] placeholder-[#64748b] focus:outline-none focus:border-[#dfb15b]"
            />
            <button
              type="submit"
              className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b8860b] text-[#0d0903] font-bold text-xs hover:brightness-110 transition-all flex items-center gap-1 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Agregar</span>
            </button>
          </form>

          {/* Barra de herramientas: Modo Ruleta/Lista + Presets y Borrar */}
          <div className="w-full flex items-center justify-between gap-1.5 mt-1.5">
            <div className="flex items-center gap-1 p-0.5 bg-[#0c1322] border border-[#1e293b] rounded-xl">
              <button
                onClick={() => setRuletaMode('ruleta')}
                className={`px-3 py-1 text-xs font-cinzel font-bold rounded-lg transition-all ${
                  ruletaMode === 'ruleta'
                    ? 'bg-[#dfb15b] text-[#0d0903] shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Ruleta
              </button>
              <button
                onClick={() => setRuletaMode('lista')}
                className={`px-3 py-1 text-xs font-cinzel font-bold rounded-lg transition-all ${
                  ruletaMode === 'lista'
                    ? 'bg-[#dfb15b] text-[#0d0903] shadow-sm'
                    : 'text-[#94a3b8] hover:text-white'
                }`}
              >
                Lista
              </button>
            </div>

            <div className="flex items-center gap-1.5 relative">
              {/* Menú de Presets Temáticos & Guardados */}
              <div className="relative">
                <button
                  onClick={() => {
                    haptics.tap();
                    setShowPresetsMenu((prev) => !prev);
                  }}
                  className="text-[10px] text-[#7dd3fc] hover:text-[#bae6fd] px-2.5 py-1 rounded-lg bg-[#0c1929] border border-[#0284c7]/40 transition-colors flex items-center gap-1 font-medium"
                  title="Cargar listas rápidas o guardadas"
                >
                  <span>Presets</span>
                  <ChevronDown className={`w-3 h-3 transition-transform ${showPresetsMenu ? 'rotate-180' : ''}`} />
                </button>

                {showPresetsMenu && (
                  <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-[#0c1322] border border-[#dfb15b]/40 shadow-2xl z-30 p-1.5 text-left space-y-1">
                    <div className="px-2 py-0.5 text-[9px] font-mono uppercase tracking-wider text-[#64748b]">
                      Listas rápidas
                    </div>
                    {BUILTIN_PRESETS.map((preset) => (
                      <button
                        key={preset.name}
                        onClick={() => handleApplyPreset(preset.options)}
                        className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-[#e2e8f0] hover:bg-[#162238] hover:text-[#ffd15c] transition-colors flex items-center justify-between"
                      >
                        <span className="truncate">{preset.name}</span>
                        <span className="text-[9px] font-mono text-[#64748b]">{preset.options.length}</span>
                      </button>
                    ))}

                    {customRuletaPresets.length > 0 && (
                      <>
                        <div className="px-2 pt-1 text-[9px] font-mono uppercase tracking-wider text-[#dfb15b]">
                          Mis listas guardadas
                        </div>
                        {customRuletaPresets.map((cp) => (
                          <button
                            key={cp.id}
                            onClick={() => handleApplyPreset(cp.options)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg text-[11px] text-[#f5ebd7] hover:bg-[#162238] hover:text-[#ffd15c] transition-colors flex items-center justify-between"
                          >
                            <span className="truncate">{cp.name}</span>
                            <span className="text-[9px] font-mono text-[#64748b]">{cp.options.length}</span>
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Botón Guardar Lista Actual */}
              {ruletaOptions.length >= 2 && (
                <button
                  onClick={handleSaveCurrentPreset}
                  className="text-[10px] text-[#ffd15c] hover:text-[#ffe8a3] px-2 py-1 rounded-lg bg-[#1c160b] border border-[#dfb15b]/40 flex items-center gap-1 transition-colors"
                  title="Guardar esta lista en tu dispositivo"
                >
                  <BookmarkPlus className="w-3 h-3" />
                  <span>{presetSavedNotice ? 'Guardada' : 'Guardar'}</span>
                </button>
              )}

              {/* Botón Borrar Todo */}
              {ruletaOptions.length > 0 && (
                <button
                  onClick={handleClearAllOptions}
                  className="text-[10px] text-rose-300 hover:text-rose-100 px-2 py-1 rounded-lg bg-[#261019] border border-rose-500/40 flex items-center gap-1 transition-colors"
                  title="Vaciar toda la lista"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Borrar</span>
                </button>
              )}
            </div>
          </div>

          {/* Visualización de la Ruleta o Lista */}
          {ruletaOptions.length < 2 ? (
            /* Estado Inicial en Blanco */
            <div className="my-auto p-5 rounded-2xl bg-[#0c1322] border border-dashed border-[#dfb15b]/40 text-center space-y-2 max-w-xs shadow-lg">
              <Disc className="w-10 h-10 text-[#dfb15b] mx-auto" />
              <div className="font-cinzel text-sm font-bold text-[#f8fafc]">
                Lista en blanco
              </div>
              <p className="text-xs text-[#94a3b8] font-garamond leading-relaxed">
                Ingresa al menos <strong>2 opciones</strong> arriba o abre <em>Presets</em> para cargar una lista rápida y girar la ruleta.
              </p>
            </div>
          ) : ruletaMode === 'ruleta' ? (
            /* Ruleta Giratoria SVG con Paleta Joya Alquímica */
            <div className="my-auto relative flex flex-col items-center justify-center">
              {/* Aguja superior */}
              <div className="w-0 h-0 border-l-[8px] border-l-transparent border-r-[8px] border-r-transparent border-t-[14px] border-t-[#ffd15c] z-20 -mb-2 drop-shadow-[0_2px_6px_rgba(255,209,92,0.5)]" />

              <div className="w-48 h-48 sm:w-52 sm:h-52 relative rounded-full p-0.5 bg-gradient-to-tr from-[#784e12] via-[#dfb15b] to-[#fff1b0] shadow-xl shadow-black/70">
                <svg
                  viewBox="0 0 200 200"
                  className="w-full h-full rounded-full transition-transform duration-[1600ms] ease-[cubic-bezier(0.12,0.8,0.2,1)] bg-[#060910]"
                  style={{ transform: `rotate(${wheelRotation}deg)` }}
                >
                  {ruletaOptions.map((opt, i) => {
                    const total = ruletaOptions.length;
                    const angle = 360 / total;
                    const startAngle = i * angle;
                    const endAngle = (i + 1) * angle;

                    const rad1 = ((startAngle - 90) * Math.PI) / 180;
                    const rad2 = ((endAngle - 90) * Math.PI) / 180;
                    const x1 = 100 + 100 * Math.cos(rad1);
                    const y1 = 100 + 100 * Math.sin(rad1);
                    const x2 = 100 + 100 * Math.cos(rad2);
                    const y2 = 100 + 100 * Math.sin(rad2);

                    // Tonos joya alquímicos profundos armonizados con obsidiana, oro y cian
                    const jewelColors = [
                      '#b8862d', // Ámbar oro antiguo
                      '#065f46', // Esmeralda abisal
                      '#7f1d1d', // Borgoña rubí
                      '#1e3a8a', // Índigo astral
                      '#4c1d95', // Amatista nocturno
                      '#115e59', // Zafiro jade
                      '#78350f', // Bronce alquímico
                    ];
                    const fillColor = jewelColors[i % jewelColors.length];

                    const textAngle = startAngle + angle / 2;
                    const textRad = ((textAngle - 90) * Math.PI) / 180;
                    const tx = 100 + 62 * Math.cos(textRad);
                    const ty = 100 + 62 * Math.sin(textRad);

                    return (
                      <g key={i}>
                        <path
                          d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                          fill={fillColor}
                          stroke="#060910"
                          strokeWidth="1.8"
                        />
                        <text
                          x={tx}
                          y={ty}
                          fill="#f8fafc"
                          fontSize="8.5"
                          fontWeight="700"
                          textAnchor="middle"
                          dominantBaseline="central"
                          transform={`rotate(${textAngle + 90}, ${tx}, ${ty})`}
                        >
                          {opt.slice(0, 9)}
                        </text>
                      </g>
                    );
                  })}
                  <circle cx="100" cy="100" r="18" fill="#dfb15b" stroke="#060910" strokeWidth="3" />
                  <circle cx="100" cy="100" r="7" fill="#060910" />
                </svg>
              </div>
            </div>
          ) : (
            /* Vista Lista de Opciones */
            <div className="my-auto w-full max-h-[160px] overflow-y-auto space-y-1.5 px-1">
              {ruletaOptions.map((opt, idx) => (
                <div
                  key={idx}
                  className={`flex items-center justify-between px-3 py-1.5 rounded-xl border transition-all ${
                    chosenOption === opt
                      ? 'bg-gradient-to-r from-[#0c1f36] to-[#122e4f] border-[#dfb15b] text-white'
                      : 'bg-[#0c1322] border-[#1e293b] text-[#cbd5e1]'
                  }`}
                >
                  <div className="flex items-center gap-2 text-xs font-mono">
                    <span className="w-5 h-5 rounded-full bg-[#162238] flex items-center justify-center text-[10px] text-[#94a3b8]">
                      {idx + 1}
                    </span>
                    <span>{opt}</span>
                  </div>
                  <button
                    onClick={() => handleRemoveOption(idx)}
                    className="text-[#64748b] hover:text-rose-400 p-0.5"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Resultado: Elegido por el universo + Recibo */}
          <div className="w-full p-2.5 rounded-xl bg-gradient-to-br from-[#0c1524] to-[#111f36] border border-[#dfb15b]/40 text-left flex items-center justify-between gap-2">
            <div className="min-w-0">
              <span className="text-[9px] font-mono tracking-widest text-[#ffd15c] uppercase block">
                ELEGIDO POR EL UNIVERSO
              </span>
              <div className="font-cinzel text-lg font-bold text-white capitalize truncate">
                {chosenOption || (ruletaOptions.length < 2 ? 'En espera de opciones...' : 'Listo para girar')}
              </div>
            </div>
            {ruletaEntropy && chosenOption && !isSpinningWheel && (
              <button
                onClick={() =>
                  setSharePayload({
                    modeLabel: 'Ruleta Estocástica',
                    verdictTitle: chosenOption,
                    verdictSubtitle: `Elegido entre ${ruletaOptions.length} posibilidades.`,
                    accentTheme: 'gold',
                    entropy: ruletaEntropy,
                  })
                }
                className="px-2 py-1 rounded-lg bg-[#080d16] border border-[#1e293b] hover:border-[#dfb15b]/60 text-[9px] font-mono text-[#7dd3fc] shrink-0 flex items-center gap-1"
              >
                <Share2 className="w-3 h-3" />
                <span>{ruletaEntropy.seedHex.slice(0, 8)}</span>
              </button>
            )}
          </div>

          {/* Botón Girar Ruleta */}
          <div className="w-full pb-1 pt-1">
            <button
              onClick={handleSpinWheel}
              disabled={isSpinningWheel || ruletaOptions.length < 2}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb15b] via-[#c89b3c] to-[#996515] border-2 border-[#ffd573] text-[#140b01] font-cinzel font-bold text-base tracking-wider shadow-lg shadow-[#c89b3c]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isSpinningWheel ? 'Girando el universo...' : 'Girar la ruleta'}
            </button>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 4. MÓDULO: TAROT ENTRÓPICO (1 CARTA O TIRADA 3 CARTAS)     */}
      {/* ========================================================= */}
      {activeTab === 'tarot' && (
        <main className="relative z-10 flex-1 flex flex-col justify-between items-center px-4 py-1.5 text-center overflow-hidden max-w-md mx-auto w-full">
          <div className="w-full space-y-1.5 pt-0.5">
            {/* Selector de Intención + Selector de Tirada (1 vs 3 Cartas) */}
            <div className="flex items-center justify-center gap-1.5 p-1 bg-[#0c1322] border border-[#1e293b] rounded-xl max-w-xs mx-auto">
              {INTENCIONES.map((it) => {
                const isActive = selectedIntencion === it.id;
                return (
                  <button
                    key={it.id}
                    onClick={() => {
                      haptics.tap();
                      if (soundEnabled) sound.playClick();
                      setSelectedIntencion(it.id);
                    }}
                    className={`flex-1 py-1 text-xs font-cinzel font-semibold rounded-lg transition-all ${
                      isActive
                        ? 'bg-[#dfb15b] text-[#0f172a] shadow-sm shadow-[#dfb15b]/30'
                        : 'text-[#94a3b8] hover:text-[#f8fafc]'
                    }`}
                  >
                    {it.id === 'amor' && 'Amor'}
                    {it.id === 'proyectos' && 'Proyectos'}
                    {it.id === 'espiritu' && 'Espíritu'}
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-center gap-1.5 max-w-[260px] mx-auto">
              <button
                onClick={() => {
                  haptics.tap();
                  setTarotSpreadMode('single');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono border transition-colors ${
                  tarotSpreadMode === 'single'
                    ? 'bg-[#162238] border-[#dfb15b]/60 text-[#ffd15c]'
                    : 'bg-[#080d16] border-[#1e293b] text-[#64748b] hover:text-[#cbd5e1]'
                }`}
              >
                1 Carta
              </button>
              <button
                onClick={() => {
                  haptics.tap();
                  setTarotSpreadMode('three');
                }}
                className={`flex-1 py-1 px-2 rounded-lg text-[10px] font-mono border transition-colors flex items-center justify-center gap-1 ${
                  tarotSpreadMode === 'three'
                    ? 'bg-[#162238] border-[#dfb15b]/60 text-[#ffd15c]'
                    : 'bg-[#080d16] border-[#1e293b] text-[#64748b] hover:text-[#cbd5e1]'
                }`}
              >
                <Layers className="w-3 h-3" />
                <span>3 Cartas (P·P·F)</span>
              </button>
            </div>
          </div>

          {tarotSpreadMode === 'single' ? (
            <>
              <div className="my-auto flex flex-col items-center justify-center">
                <div
                  onClick={handleRevealTarot}
                  className="relative rounded-2xl p-1 bg-gradient-to-b from-[#dfb15b] to-[#78541a] shadow-xl shadow-black/80 cursor-pointer active:scale-98 transition-transform"
                >
                  <div className="w-[132px] sm:w-[148px] h-[202px] sm:h-[225px] rounded-xl overflow-hidden bg-[#0a0f18] border border-[#ffd15c]/40">
                    <ImageWithFallback card={currentCard} isRevealing={isTarotRevealing} />
                  </div>
                </div>
              </div>

              <div className="space-y-0.5 max-w-sm px-2">
                <h3 className="font-cinzel text-lg sm:text-xl font-bold tracking-wide text-[#ffffff]">
                  {currentCard.nombre}
                </h3>
                <div className="text-[11px] font-mono text-[#94a3b8] flex items-center justify-center gap-2">
                  <span>Arcanos Mayores · {currentCard.numeroRomano}</span>
                  {tarotEntropy && !isTarotRevealing && (
                    <button
                      onClick={() =>
                        setSharePayload({
                          modeLabel: 'Tarot Entrópico',
                          question: `Intención: ${INTENCIONES.find((i) => i.id === selectedIntencion)?.label}`,
                          verdictTitle: `${currentCard.nombre} (${currentCard.numeroRomano})`,
                          verdictSubtitle: currentCard.consejoOracular,
                          accentTheme: 'gold',
                          entropy: tarotEntropy,
                        })
                      }
                      className="text-[#7dd3fc] hover:text-[#ffd15c] inline-flex items-center gap-1"
                    >
                      <Share2 className="w-3 h-3" />
                      <span>Recibo</span>
                    </button>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-[#cbd5e1] font-garamond leading-snug line-clamp-3 pt-0.5">
                  {currentCard.interpretacion[selectedIntencion]}
                </p>
              </div>
            </>
          ) : (
            /* Tirada de 3 Cartas: Pasado · Presente · Futuro (sin repetición de índice) */
            <>
              <div className="my-auto w-full grid grid-cols-3 gap-2 px-1 items-center">
                {threeCardSpread.map((slot, idx) => {
                  const isSelected = selectedSpreadIndex === idx;
                  return (
                    <button
                      key={`${slot.label}-${slot.card.id}`}
                      onClick={() => {
                        haptics.tap();
                        setSelectedSpreadIndex(idx);
                      }}
                      className={`flex flex-col items-center gap-1 transition-all ${
                        isSelected ? 'scale-105' : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <span
                        className={`text-[9px] font-mono uppercase tracking-wider ${
                          isSelected ? 'text-[#ffd15c] font-bold' : 'text-[#94a3b8]'
                        }`}
                      >
                        {slot.label}
                      </span>
                      <div
                        className={`w-full aspect-[2/3] max-w-[100px] rounded-xl p-0.5 transition-all ${
                          isSelected
                            ? 'bg-gradient-to-b from-[#ffd15c] to-[#b8860b] shadow-lg shadow-[#dfb15b]/30'
                            : 'bg-[#1e293b]'
                        }`}
                      >
                        <div className="w-full h-full rounded-[10px] overflow-hidden bg-[#0a0f18]">
                          <ImageWithFallback card={slot.card} isRevealing={isTarotRevealing} />
                        </div>
                      </div>
                      <span className="font-cinzel text-[10px] font-bold text-[#f8fafc] truncate w-full">
                        {slot.card.nombre}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Interpretación de la carta seleccionada en la tirada */}
              <div className="w-full p-2.5 rounded-xl bg-[#0c1322] border border-[#dfb15b]/30 text-left space-y-0.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="text-[#ffd15c] font-bold">
                    {threeCardSpread[selectedSpreadIndex]?.label.toUpperCase()} · {threeCardSpread[selectedSpreadIndex]?.card.nombre}
                  </span>
                  {tarotEntropy && !isTarotRevealing && (
                    <button
                      onClick={() =>
                        setSharePayload({
                          modeLabel: 'Tarot · 3 Cartas (P·P·F)',
                          question: `Intención: ${INTENCIONES.find((i) => i.id === selectedIntencion)?.label}`,
                          verdictTitle: threeCardSpread.map((s) => s.card.nombre).join(' · '),
                          verdictSubtitle: threeCardSpread.map((s) => `${s.label}: ${s.card.numeroRomano}`).join(' | '),
                          accentTheme: 'gold',
                          entropy: tarotEntropy,
                        })
                      }
                      className="text-[#7dd3fc] hover:text-[#ffd15c] inline-flex items-center gap-1"
                    >
                      <Share2 className="w-2.5 h-2.5" />
                      <span>Recibo</span>
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#cbd5e1] font-garamond leading-snug line-clamp-3">
                  {threeCardSpread[selectedSpreadIndex]?.card.interpretacion[selectedIntencion]}
                </p>
              </div>
            </>
          )}

          <div className="w-full pt-1 pb-1">
            <button
              onClick={handleRevealTarot}
              disabled={isTarotRevealing}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-[#dfb15b] via-[#c89b3c] to-[#996515] border-2 border-[#ffd573] text-[#140b01] font-cinzel font-bold text-base tracking-wider shadow-lg shadow-[#c89b3c]/25 hover:brightness-105 active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {isTarotRevealing
                ? 'Consultando al Oráculo...'
                : tarotSpreadMode === 'single'
                ? 'Revelar carta'
                : 'Revelar tirada (3 cartas)'}
            </button>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* 5. MÓDULO: ACERCA DE, TEORÍA Y PERFIL DE E. SIERRA RUIZ   */}
      {/* ========================================================= */}
      {activeTab === 'acerca' && (
        <main className="relative z-10 flex-1 overflow-y-auto px-4 py-3 max-w-md mx-auto w-full space-y-3.5">
          {/* Tarjeta de Autor: E. Sierra Ruiz */}
          <div className="p-4 rounded-2xl bg-[#0c1322] border border-[#1e293b] space-y-3 shadow-lg">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-[#9b722d] via-[#ffd15c] to-[#fff1b0] p-0.5 shadow-lg shadow-[#ffd15c]/20 shrink-0 relative overflow-hidden">
                <img
                  src={authorAvatarImg}
                  alt="E. Sierra Ruiz"
                  onError={(e) => {
                    const img = e.currentTarget;
                    if (!img.dataset.fallbackTried) {
                      img.dataset.fallbackTried = 'true';
                      img.src = 'https://github.com/sierra88-en.png';
                    } else {
                      img.style.display = 'none';
                    }
                  }}
                  className="w-full h-full object-cover rounded-full"
                />
                <div className="w-full h-full rounded-full bg-[#162238] flex items-center justify-center font-cinzel font-bold text-lg text-[#dfb15b] absolute inset-0 -z-10">
                  ES
                </div>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h3 className="font-cinzel text-base sm:text-lg font-bold text-[#ffffff] truncate">
                    E. Sierra Ruiz
                  </h3>
                  <span className="text-[10px] text-[#ffd15c] font-mono px-1.5 py-0.2 border border-[#ffd15c]/30 rounded shrink-0">
                    Lead
                  </span>
                </div>
                <p className="text-xs text-[#ffd15c]/90 font-mono tracking-tight truncate">
                  @sierra88-en · Data & Entropy Developer
                </p>
                <p className="text-[10px] text-[#94a3b8] mt-0.5 font-mono">
                  © 2026 E. Sierra Ruiz. Released under the MIT License.
                </p>
              </div>
            </div>

            <div className="p-2.5 rounded-xl bg-[#080d16] border border-[#1e293b] text-xs text-[#cbd5e1] font-garamond leading-relaxed">
              Desarrollo de PWA, herramientas estadísticas educativas y aleatoriedad con Web Crypto.
            </div>

            <a
              href="https://github.com/sierra88-en/grimorio-entropico"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-2.5 px-3.5 rounded-xl bg-[#080d16] border border-[#1e293b] hover:border-[#dfb15b]/60 text-xs font-mono text-[#cbd5e1] hover:text-[#ffd15c] flex items-center justify-between transition-all group"
            >
              <div className="flex items-center gap-2 truncate">
                <Github className="w-4 h-4 text-[#ffd15c] group-hover:scale-110 transition-transform shrink-0" />
                <span className="truncate">Código abierto y patrocinio en GitHub</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-[#64748b] shrink-0 ml-2" />
            </a>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => {
                  haptics.tap();
                  setShowHistoryModal(true);
                }}
                className="py-2 px-3 rounded-xl bg-[#080d16] border border-[#1e293b] hover:border-[#dfb15b]/50 text-xs font-cinzel font-semibold text-[#f5ebd7] flex items-center justify-center gap-1.5 transition-colors"
              >
                <Clock className="w-3.5 h-3.5 text-[#dfb15b]" />
                <span>Bitácora ({oracleHistory.length})</span>
              </button>

              <a
                href="./privacy.html"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-3 rounded-xl bg-[#080d16] border border-[#1e293b] hover:border-[#38bdf8]/50 text-xs font-cinzel font-semibold text-[#cbd5e1] flex items-center justify-center gap-1.5 transition-colors"
              >
                <FileText className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Privacidad</span>
              </a>
            </div>

            {isInstallable && !isInstalled && (
              <button
                onClick={() => {
                  haptics.tap();
                  installPWA();
                }}
                className="w-full py-2 px-3 rounded-xl bg-[#0c1a2e] border border-[#38bdf8]/40 hover:border-[#38bdf8] text-xs font-cinzel font-semibold text-[#7dd3fc] flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Instalar App en Dispositivo (Offline)</span>
              </button>
            )}

            <button
              onClick={() => {
                haptics.tap();
                setShowProModal(true);
              }}
              className="w-full py-2 px-3 rounded-xl bg-[#080d16]/70 border border-[#dfb15b]/25 hover:border-[#dfb15b]/60 text-[11px] font-cinzel font-semibold text-[#dfb15b] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Crown className="w-3.5 h-3.5 text-[#ffd15c]" />
              <span>Edición Alquímica Pro (Próximamente)</span>
            </button>
          </div>

          {/* Switch de Sonido y Vibración Háptica */}
          <div className="rounded-2xl bg-[#0c1322] border border-[#1e293b] divide-y divide-[#1e293b]">
            <div className="p-3.5 flex items-center justify-between gap-3">
              <div>
                <div className="font-cinzel text-xs font-bold text-[#f8fafc]">
                  Efectos de sonido
                </div>
                <p className="text-[11px] text-[#94a3b8] leading-snug">
                  Reproducir un sonido sutil cuando se complete una decisión.
                </p>
              </div>
              <button
                onClick={() => {
                  const next = !soundEnabled;
                  setSoundEnabled(next);
                  sound.setMuted(!next);
                  if (next) sound.playClick();
                }}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 relative shrink-0 ${
                  soundEnabled ? 'bg-[#0284c7]' : 'bg-[#1e293b]'
                }`}
                aria-label="Alternar efectos de sonido"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    soundEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="p-3.5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Vibrate className="w-4 h-4 text-[#dfb15b] shrink-0" />
                <div>
                  <div className="font-cinzel text-xs font-bold text-[#f8fafc]">
                    Vibración háptica
                  </div>
                  <p className="text-[11px] text-[#94a3b8] leading-snug">
                    Pulso táctil físico al aterrizar la moneda, dados o cartas.
                  </p>
                </div>
              </div>
              <button
                onClick={() => {
                  const next = !hapticsEnabled;
                  setHapticsEnabled(next);
                  haptics.setEnabled(next);
                  if (next) haptics.tap();
                }}
                className={`w-12 h-6 rounded-full transition-colors p-0.5 relative shrink-0 ${
                  hapticsEnabled ? 'bg-[#dfb15b]' : 'bg-[#1e293b]'
                }`}
                aria-label="Alternar vibración háptica"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    hapticsEnabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* TEORÍA 1: PRNG, generadores seguros y entropía física */}
          <div className="rounded-2xl bg-[#0c1322] border border-[#1e293b] overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'teoria' ? 'none' : 'teoria')}
              className="w-full p-3.5 text-left flex items-center justify-between hover:bg-[#111a2e] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Radio className="w-4 h-4 text-[#ffd15c]" />
                <span className="font-cinzel text-xs font-bold text-[#f8fafc]">
                  PRNG, generadores seguros y entropía física
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform ${openSection === 'teoria' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'teoria' && (
              <div className="p-3.5 bg-[#080d16] border-t border-[#1e293b] text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
                <p>
                  <strong>PRNG (Algoritmos Deterministas):</strong> Funciones como <code className="text-[#ffd15c]">Math.random()</code> generan secuencias predecibles basadas en una semilla (ej. milisegundos del reloj). Si se conoce la semilla, se puede predecir toda la tirada futura.
                </p>
                <p>
                  <strong>CSPRNG del navegador:</strong> <code className="text-[#ffd15c]">crypto.getRandomValues()</code> ofrece valores aleatorios criptográficamente fuertes según la implementación del navegador. La app no accede directamente a <code>/dev/urandom</code> ni al kernel.
                </p>
                <p>
                  <strong>Servicio externo RANDOM.ORG:</strong> la app solicita enteros al proveedor, que describe su fuente como ruido atmosférico. La app no mide ni verifica esa fuente de forma independiente.
                </p>
              </div>
            )}
          </div>

          {/* TEORÍA 2: La entropía no es una prueba */}
          <div className="rounded-2xl bg-[#0c1322] border border-[#1e293b] overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'prueba' ? 'none' : 'prueba')}
              className="w-full p-3.5 text-left flex items-center justify-between hover:bg-[#111a2e] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-[#ffd15c]" />
                <span className="font-cinzel text-xs font-bold text-[#f8fafc]">
                  La entropía no es una prueba
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform ${openSection === 'prueba' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'prueba' && (
              <div className="p-3.5 bg-[#080d16] border-t border-[#1e293b] text-xs text-[#cbd5e1] space-y-2 leading-relaxed">
                <p>
                  Una prueba estadística no certifica una fuente aleatoria ni su seguridad. Esta herramienta ejecuta una prueba de frecuencias chi-cuadrado con una muestra finita; un resultado compatible con el modelo no demuestra que no existan patrones.
                </p>
                <p>
                  <strong>Mitigación del sesgo de módulo:</strong> al mapear un entero de 32 bits a ciertos rangos, un módulo simple puede dar probabilidades ligeramente distintas. Este motor usa muestreo por rechazo para evitar ese sesgo de mapeo, bajo el supuesto de que los valores fuente de Web Crypto son uniformes.
                </p>
                <div className="pt-1">
                  <button
                    onClick={() => setShowBenchmarkModal(true)}
                    className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b8860b] text-[#0f172a] font-cinzel font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 active:scale-98 transition-all"
                  >
                    <Activity className="w-3.5 h-3.5" />
                    <span>Lanzar Test Chi-Cuadrado (600k tiradas)</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* TEORÍA 3: Ejemplos de dados de 6 caras (1-6) */}
          <div className="rounded-2xl bg-[#0c1322] border border-[#1e293b] overflow-hidden">
            <button
              onClick={() => setOpenSection(openSection === 'ejemplos' ? 'none' : 'ejemplos')}
              className="w-full p-3.5 text-left flex items-center justify-between hover:bg-[#111a2e] transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <Code2 className="w-4 h-4 text-[#ffd15c]" />
                <span className="font-cinzel text-xs font-bold text-[#f8fafc]">
                  Ejemplos de dados de 6 caras (1-6)
                </span>
              </div>
              <ChevronDown className={`w-4 h-4 text-[#94a3b8] transition-transform ${openSection === 'ejemplos' ? 'rotate-180' : ''}`} />
            </button>

            {openSection === 'ejemplos' && (
              <div className="p-3.5 bg-[#080d16] border-t border-[#1e293b] space-y-3">
                {[
                  { lang: 'Dart (Flutter)', code: 'final d6 = Random.secure().nextInt(6) + 1;' },
                  { lang: 'Java', code: 'int d6 = new SecureRandom().nextInt(6) + 1;' },
                  { lang: 'C# (.NET)', code: 'int d6 = RandomNumberGenerator.GetInt32(1, 7);' },
                  { lang: 'Python', code: 'import secrets\nd6 = secrets.randbelow(6) + 1' },
                  { lang: 'Node.js (JavaScript)', code: 'const crypto = require("crypto");\nconst d6 = crypto.randomInt(1, 7);' },
                  { lang: 'PowerShell', code: '[System.Security.Cryptography.RandomNumberGenerator]::GetInt32(1, 7)' }
                ].map((item, idx) => (
                  <div key={idx} className="rounded-xl bg-[#0c1322] border border-[#1e293b] p-2.5 text-xs">
                    <div className="flex items-center justify-between text-[#ffd15c] font-mono text-[11px] mb-1">
                      <span>{item.lang}</span>
                      <button
                        onClick={() => copyToClipboard(item.code, item.lang)}
                        className="text-[10px] text-[#94a3b8] hover:text-[#ffd15c] flex items-center gap-1"
                      >
                        <Copy className="w-3 h-3" />
                        <span>{copiedCodeLang === item.lang ? 'Copiado' : 'Copiar'}</span>
                      </button>
                    </div>
                    <pre className="font-mono text-[10.5px] text-[#cbd5e1] bg-[#060910] p-1.5 rounded border border-[#1e293b] overflow-x-auto whitespace-pre">
                      {item.code}
                    </pre>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="text-center pt-2 pb-4 text-[10px] text-[#64748b] space-y-0.5">
            <p>Adaptación de The Universe Decides de Vitor Hugo (MIT) · © 2026 E. Sierra Ruiz</p>
            <p>Sin cuenta ni analítica integrada; hay solicitudes a terceros descritas en la política de privacidad.</p>
          </div>
        </main>
      )}

      {/* ========================================================= */}
      {/* BARRA DE NAVEGACIÓN INFERIOR (5 PESTAÑAS FIJAS)          */}
      {/* ========================================================= */}
      <nav className="relative z-20 h-16 border-t border-[#1e293b] bg-[#060a12]/95 backdrop-blur-md px-2 flex items-center justify-around shrink-0 max-w-md mx-auto w-full">
        {/* 1. Moneda */}
        <button
          onClick={() => {
            if (soundEnabled) sound.playClick();
            setActiveTab('moneda');
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'moneda' ? 'text-[#ffd15c]' : 'text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Coins className={`w-5 h-5 transition-transform ${activeTab === 'moneda' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-cinzel font-semibold tracking-wider">Moneda</span>
        </button>

        {/* 2. Dados */}
        <button
          onClick={() => {
            if (soundEnabled) sound.playClick();
            setActiveTab('dados');
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'dados' ? 'text-[#ffd15c]' : 'text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Dice5 className={`w-5 h-5 transition-transform ${activeTab === 'dados' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-cinzel font-semibold tracking-wider">Dados</span>
        </button>

        {/* 3. Ruleta */}
        <button
          onClick={() => {
            if (soundEnabled) sound.playClick();
            setActiveTab('ruleta');
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'ruleta' ? 'text-[#ffd15c]' : 'text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Disc className={`w-5 h-5 transition-transform ${activeTab === 'ruleta' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-cinzel font-semibold tracking-wider">Ruleta</span>
        </button>

        {/* 4. Tarot */}
        <button
          onClick={() => {
            if (soundEnabled) sound.playClick();
            setActiveTab('tarot');
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'tarot' ? 'text-[#ffd15c]' : 'text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Sparkles className={`w-5 h-5 transition-transform ${activeTab === 'tarot' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-cinzel font-semibold tracking-wider">Tarot</span>
        </button>

        {/* 5. Acerca */}
        <button
          onClick={() => {
            if (soundEnabled) sound.playClick();
            setActiveTab('acerca');
          }}
          className={`flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all ${
            activeTab === 'acerca' ? 'text-[#ffd15c]' : 'text-[#64748b] hover:text-[#94a3b8]'
          }`}
        >
          <Info className={`w-5 h-5 transition-transform ${activeTab === 'acerca' ? 'scale-110' : ''}`} />
          <span className="text-[10px] font-cinzel font-semibold tracking-wider">Acerca</span>
        </button>
      </nav>

      {/* Modal de Auditoría y Recibo Criptográfico */}
      {showEntropyAudit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05080e]/85 backdrop-blur-md animate-fade-in">
          <div className="w-full max-w-sm p-5 rounded-2xl bg-[#0c1322] border border-[#ffd15c]/40 text-left space-y-3">
            <div className="flex items-center justify-between">
              <div className="font-cinzel text-sm font-bold text-[#f8fafc] flex items-center gap-2">
                <Shield className="w-4 h-4 text-[#ffd15c]" />
                <span>Recibo Criptográfico & Auditoría</span>
              </div>
              <button
                onClick={() => setShowEntropyAudit(false)}
                className="text-xs text-[#94a3b8] hover:text-white px-2.5 py-1 rounded-lg bg-[#162238]"
              >
                Cerrar
              </button>
            </div>

            <div className="p-3 rounded-xl bg-[#080d16] border border-[#1e293b] text-xs font-mono space-y-1.5 text-[#cbd5e1]">
              <div className="flex justify-between gap-2">
                <span className="text-[#64748b]">Fuente activa:</span>
                <span className="text-[#ffd15c] font-bold text-right">
                  {currentEntropy?.source === 'RANDOM_ORG_ATMOSPHERIC'
                    ? 'RANDOM.ORG (servicio externo)'
                    : 'Web Crypto Local (CSPRNG)'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Latencia:</span>
                <span className="tabular-nums">{currentEntropy?.latencyMs ? `${currentEntropy.latencyMs} ms` : '0 ms (local)'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Referencia hexadecimal:</span>
                <span className="text-[11px] text-emerald-400 tabular-nums">{currentEntropy?.seedHex || 'sin resultado'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#64748b]">Sesgo de módulo:</span>
                <span className="text-emerald-300">Muestreo por rechazo</span>
              </div>
            </div>

            <p className="text-[11px] text-[#94a3b8] font-garamond italic leading-relaxed">
              {currentEntropy?.sourceDetail ||
                'Cuando hay conexión disponible se solicita un número a RANDOM.ORG. Si el servicio no está disponible, se usa crypto.getRandomValues del navegador.'}
            </p>

            <div className="space-y-2 pt-1">
              {currentEntropy && (
                <button
                  onClick={() => {
                    setShowEntropyAudit(false);
                    setSharePayload({
                      modeLabel: 'Auditoría de Entropía',
                      verdictTitle: currentEntropy.sourceLabel,
                      verdictSubtitle: `Referencia local (no es una prueba criptográfica): ${currentEntropy.seedHex}`,
                      accentTheme: currentEntropy.source === 'RANDOM_ORG_ATMOSPHERIC' ? 'gold' : 'cyan',
                      entropy: currentEntropy,
                    });
                  }}
                  className="w-full py-2 px-3 rounded-xl bg-[#101829] border border-[#1e293b] hover:border-[#38bdf8]/50 text-[#7dd3fc] font-cinzel font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Generar Tarjeta de Recibo</span>
                </button>
              )}

              <button
                onClick={() => {
                  setShowEntropyAudit(false);
                  setShowBenchmarkModal(true);
                }}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-[#dfb15b] to-[#b8860b] text-[#0f172a] font-cinzel font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm hover:brightness-110 active:scale-98 transition-all"
              >
                <Activity className="w-3.5 h-3.5" />
                <span>Ejecutar Test Chi-Cuadrado (600k tiradas)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Interactivo de Benchmark Estadístico Chi-Cuadrado */}
      <StatisticalBenchmarkModal
        isOpen={showBenchmarkModal}
        onClose={() => setShowBenchmarkModal(false)}
      />

      {/* Modal Bitácora del Oráculo */}
      <OracleHistoryModal
        isOpen={showHistoryModal}
        onClose={() => setShowHistoryModal(false)}
        entries={oracleHistory}
        onClearHistory={() => setOracleHistory(clearOracleHistory())}
      />

      {/* Modal Sello / Tarjeta Compartible */}
      <ShareOracleCardModal
        isOpen={!!sharePayload}
        onClose={() => setSharePayload(null)}
        payload={sharePayload}
      />

      {/* Modal Edición Alquímica Pro (Próximamente - Google Play Billing v1.1) */}
      <AlchemicalProModal
        isOpen={showProModal}
        onClose={() => setShowProModal(false)}
      />
    </div>
  );
}
