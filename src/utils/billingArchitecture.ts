/**
 * Arquitectura de Licenciamiento Nativo para Google Play Billing (v1.1)
 * Sin pasarelas externas de pago ni enlaces prohibidos en Play Store.
 */

export const PRO_PRODUCT_SKU = 'universo_decide_alchemical_pro_v1';

export interface ProEntitlementStatus {
  isPro: boolean;
  productId: string;
  platform: 'web' | 'android-play-billing';
  versionTarget: '1.1.0';
}

export interface AlchemicalProFeature {
  id: 'csv_export' | 'unlimited_presets' | 'celtic_cross';
  title: string;
  description: string;
  etaVersion: string;
}

export const UPCOMING_PRO_FEATURES: AlchemicalProFeature[] = [
  {
    id: 'csv_export',
    title: 'Exportación CSV de la Bitácora',
    description:
      'Exporta tu historial íntegro de tiradas con fecha, intención, veredicto, latencia y huella hexadecimal para análisis estadístico externo.',
    etaVersion: 'v1.1',
  },
  {
    id: 'unlimited_presets',
    title: 'Presets Ilimitados en Ruleta',
    description:
      'Crea, categoriza y guarda colecciones ilimitadas de listas personalizadas sin restricciones de almacenamiento.',
    etaVersion: 'v1.1',
  },
  {
    id: 'celtic_cross',
    title: 'Tirada Cruz Celta (10 Cartas)',
    description:
      'Lectura completa tradicional de 10 Arcanos Mayores sin repetición mediante muestreo criptográfico secuencial.',
    etaVersion: 'v1.1',
  },
];

export function getProEntitlementStatus(): ProEntitlementStatus {
  const isCapacitorNative =
    typeof window !== 'undefined' &&
    Boolean((window as unknown as { Capacitor?: { isNativePlatform?: () => boolean } }).Capacitor?.isNativePlatform?.());

  return {
    isPro: false,
    productId: PRO_PRODUCT_SKU,
    platform: isCapacitorNative ? 'android-play-billing' : 'web',
    versionTarget: '1.1.0',
  };
}
