import React, { useState } from 'react';
import { X, Smartphone, Globe, Terminal, Check, Copy, ExternalLink, Shield } from 'lucide-react';
import { sound } from '../utils/audio';

interface CapacitorGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CapacitorGuideModal: React.FC<CapacitorGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    sound.playClick();
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const steps = [
    {
      title: '1. Despliegue Web / PWA en Vercel o Netlify',
      desc: 'Sube este proyecto a tu repositorio de GitHub (ej. el-universo-decide-es) y conéctalo en vercel.com. El build command es `npm run build` y el directorio de salida es `dist`. Tendrás la versión PWA lista con HTTPS y respuesta instantánea.',
      code: `git init\ngit add .\ngit commit -m "feat: Grimorio Entrópico - El Universo Decide"\ngit remote add origin https://github.com/tu-usuario/el-universo-decide-es.git\ngit push -u origin main`
    },
    {
      title: '2. Empaquetado Nativizado con Capacitor (Android APK)',
      desc: 'Para exportar el APK nativo e inscribirlo en F-Droid / IzzyOnDroid, ejecuta los comandos de Capacitor en la terminal de tu máquina:',
      code: `npm install @capacitor/core @capacitor/cli @capacitor/android\nnpx cap init "El Universo Decide" "com.hugo.theuniversedecides.es"\nnpm run build\nnpx cap add android\nnpx cap sync android\nnpx cap open android`
    },
    {
      title: '3. Configuración de capacitor.config.json',
      desc: 'Asegura que tu archivo capacitor.config.json apunte al directorio dist con permisos de Internet limpios (sin rastreo de ubicación ni almacenamiento invasivo):',
      code: `{\n  "appId": "com.hugo.theuniversedecides.es",\n  "appName": "Grimorio Entrópico",\n  "webDir": "dist",\n  "server": {\n    "androidScheme": "https"\n  }\n}`
    },
    {
      title: '4. Publicación en F-Droid & IzzyOnDroid',
      desc: 'El manifiesto de F-Droid compilará directamente desde tu repositorio de código abierto en GitHub. Se añadirá la etiqueta "Anti-Feature: NonFreeNet" debido a la consulta opcional a RANDOM.ORG para garantizar total transparencia con la comunidad de software libre.',
      code: `# En AndroidManifest.xml solo requieres:\n<uses-permission android:name="android.permission.INTERNET" />`
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#05040a]/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 rounded-2xl bg-[#0f0c1a] border border-[#d4af37]/40 shadow-2xl text-left space-y-5">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-lg bg-[#1a1426] text-[#8c829e] hover:text-[#f5ebd7] hover:bg-[#271e38] transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-[#d4af37]/15 border border-[#d4af37]/40 text-[#f4e295]">
            <Smartphone className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-cinzel text-xl sm:text-2xl font-bold text-[#f5ebd7]">
              Guía de Despliegue PWA & Capacitor APK
            </h2>
            <p className="text-xs text-[#958ea3]">
              Paso a paso para exportar a Vercel, generar APK con Capacitor y enviar a F-Droid / IzzyOnDroid.
            </p>
          </div>
        </div>

        {/* Steps List */}
        <div className="space-y-4">
          {steps.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-[#130f21] border border-[#2b223c] space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-cinzel text-xs sm:text-sm font-bold text-[#f5ebd7]">
                  {step.title}
                </h4>
                <button
                  onClick={() => copyToClipboard(step.code, idx)}
                  className="flex items-center gap-1 text-[11px] text-[#d4af37] hover:text-[#f4e295] bg-[#1c152c] px-2 py-0.5 rounded border border-[#3b2f52]"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="w-3 h-3 text-emerald-400" />
                      <span className="text-emerald-300">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>

              <p className="text-xs text-[#9f95b0] leading-relaxed">
                {step.desc}
              </p>

              <pre className="text-[11px] font-mono bg-[#09080e] p-2.5 rounded-lg border border-[#231b32] text-[#d4c9e8] overflow-x-auto whitespace-pre">
                {step.code}
              </pre>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="pt-3 border-t border-[#231d30] flex items-center justify-between text-xs text-[#7e7491]">
          <span>Documentación técnica de arquitectura verificada.</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1a1426] border border-[#3a2e4f] text-[#d4af37] hover:bg-[#d4af37] hover:text-[#0d0b17] transition-all font-cinzel text-xs font-semibold"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};
