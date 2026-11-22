# 🌌 Grimorio Entrópico — El Universo Decide

[![License: MIT](https://img.shields.io/badge/License-MIT-dfb15b.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-0284c7.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5%2B-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8%20%2B%20PWA-646cff.svg?style=for-the-badge&logo=vite)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Entropy](https://img.shields.io/badge/Entropy-TRNG_%2B_CSPRNG-10b981.svg?style=for-the-badge)](https://www.random.org/)

> **«El Universo Decide — no el procesador.»**  
> Un oráculo de toma de decisiones cuántico-esotérico y laboratorio estadístico que fusiona la estética de un grimorio alquímico oscuro con **entropía física atmosférica real (TRNG)**, **generación criptográfica sin sesgo de módulo (CSPRNG)** y verificación empírica mediante pruebas de bondad de ajuste **Chi-Cuadrado ($\chi^2$)**.

Diseñado, desarrollado y mantenido por **[E. Sierra Ruiz (@sierra88-en)](https://github.com/sierra88-en)**.

---

## ✨ Características Técnicas y Funcionales

### 🪙 1. Moneda Alquímica 3D (*Sol Invictus* / *Luna Regalis*)
* **Sello de Intención:** Campo opcional para formular tu consulta (*ej. "¿Acepto la oferta?"*) antes de lanzar.
* **Física & Partículas:** Rotación 3D (`preserve-3d`) con curvas Bézier y sistema de partículas radial (*polvo de estrellas y arcos de estática*) al asentarse el veredicto.
* **Tarjeta Compartible PNG:** Genera al instante un sello visual descargable en PNG con la pregunta, el veredicto y la huella criptográfica (`seedHex` y latencia en `ms`).

### 🎲 2. Dados Poliédricos RPG 3D con Física de Colisión
* **Configuración flexible:** De 1 a 5 dados simultáneos (`d4`, `d6`, `d8`, `d10`, `d12`, `d20` y `d100`).
* **Cinemática de rebote (Framer Motion):** Los dados convergen, colisionan entre sí con deformación elástica (*squash & stretch*) y rebotan con retroalimentación táctil y acústica.
* **Desglose matemático tabular:** Suma en tiempo real y recibo criptográfico por tirada.

### 🎡 3. Ruleta Estocástica en Tonos Joya
* **Paleta Alquímica:** Gajos en tonos joya profundos (ámbar oro antiguo, esmeralda abisal, borgoña rubí, índigo astral, amatista, zafiro jade y bronce).
* **Presets y Persistencia Local:** Selector rápido (*Oráculo Sí/No*, *¿Qué cenar?*, *Números 1–6*, *Acción/Pausa*) y guardado de listas personalizadas en `localStorage`.
* **Modos duales:** Vista de disco giratorio SVG o vista de lista editable.

### 🃏 4. Tarot Entrópico (22 Arcanos Mayores)
* **Modo 1 Carta o Tirada de 3 Cartas (Pasado · Presente · Futuro):** La tirada de 3 cartas utiliza muestreo sin reemplazo (`fetchDistinctHybridEntropy`) para garantizar **3 Arcanos únicos sin repetición**.
* **Enfoque de lectura:** Interpretaciones adaptadas a *Amor*, *Proyectos* o *Espíritu*.
* **Respaldo Vectorial Infallible (`ImageWithFallback`):** Si una ilustración externa no carga o estás sin conexión, se renderiza una carta ceremonial SVG con su símbolo alquímico y numeración romana.

### 📜 5. Bitácora del Oráculo, Auditoría y Laboratorio $\chi^2$
* **Bitácora del Oráculo:** Historial local persistente (hasta 50 decisiones) con filtros por herramienta, pregunta, marca temporal y huella hexadecimal.
* **Laboratorio Chi-Cuadrado ($\chi^2$) In-App:** Ejecuta **600.000 tiradas en vivo** en lotes no bloqueantes sobre `d6`, `d20`, `Ruleta de 7 opciones` o `Moneda` para calcular frecuencias observadas vs. esperadas, estadístico $\chi^2$, grados de libertad ($df$) y $p$-valor.
* **Audio Procedural y Háptica Física:** Síntesis sonora sin archivos externos (Web Audio API) + vibración física multiplataforma (`navigator.vibrate` / Capacitor `Haptics`).
* **PWA Offline-First & Android Ready:** Configurado con `vite-plugin-pwa` (Workbox), rutas relativas (`base: './'`), manifiesto `manifest.webmanifest`, política de privacidad (`public/privacy.html`) y cumplimiento estricto de políticas de Google Play Store.

---

## ⚡ Arquitectura de Aleatoriedad (TRNG + CSPRNG sin Sesgo de Módulo)

El software convencional suele depender de `Math.random()`, un generador pseudoaleatorio determinista (PRNG) no apto para imprevisibilidad criptográfica. **Grimorio Entrópico** prohíbe `Math.random()` en todas las mecánicas de decisión y opera mediante un **Motor de Entropía Híbrida** (`src/utils/entropyEngine.ts`):

```text
                 [ Solicitud de Decisión (min, max) ]
                                  │
          ┌───────────────────────┴───────────────────────┐
          ▼ (Online & Cuota disponible)                   ▼ (Offline / Timeout / Cuota agotada)
   RANDOM.ORG (TRNG)                             Kernel Local (CSPRNG)
   Ruido atmosférico físico                      window.crypto.getRandomValues()
   Timeout estricto (AbortController)            Muestreo por Rechazo en 2^32
          │                                               │
          └───────────────────────┬───────────────────────┘
                                  ▼
         [ Entrega Veredicto + Huella seedHex + Fuente Etiquetada ]
```

### 1. Resiliencia y No Reutilización (*Anti-Stale Failover*)
* Si RANDOM.ORG supera el tiempo límite (`AbortController`), devuelve error HTTP `429`/`503` o el dispositivo está sin conexión (`navigator.onLine === false`), el motor activa una ventana de enfriamiento y conmuta al instante a `getLocalCsprngInteger(min, max)`.
* **Nunca se reutiliza un valor en caché ni un resultado previo**: cada tirada solicita entropía fresca del sistema operativo (`/dev/urandom` / `BCryptGenRandom` vía `window.crypto.getRandomValues`).
* La interfaz etiqueta con transparencia el origen real de cada resultado (`RANDOM_ORG_ATMOSPHERIC` vs. `CSPRNG_KERNEL_LOCAL`).

### 2. Eliminación del Sesgo de Módulo (*Rejection Sampling*)
Mapear un entero de 32 bits directamente mediante `randomVal % range` introduce sesgo matemático cuando $2^{32} = 4\,294\,967\,296$ no es divisible exactamente entre `range` (por ejemplo, para un dado de 6 caras, $2^{32} \bmod 6 = 4$, lo que favorece ligeramente las caras `1, 2, 3, 4`).

`getLocalCsprngInteger` implementa **muestreo por rechazo estricto**:

$$\text{limit} = 2^{32} - \left(2^{32} \bmod \text{range}\right)$$

```typescript
const totalStates = 0x100000000; // 2^32 estados exactos
const limit = totalStates - (totalStates % range);
do {
  cryptoObj.getRandomValues(buffer);
  randomValue = buffer[0];
} while (randomValue >= limit); // Descarta la cola asimétrica
return min + (randomValue % range);
```

De este modo, cada resultado del intervalo cerrado `[min, max]` posee exactamente la misma cantidad de representaciones equiprobables en el espacio de 32 bits.

### 3. Verificación Estadística Reproducible (CLI)
Puedes auditar directamente la función real de producción (`getLocalCsprngInteger`) ejecutando **600.000 tiradas** desde la terminal:

```bash
npx tsx scripts/verify-entropy-bias.ts
```

> **Nota metodológica (NIST SP 800-22):** Las pruebas $\chi^2$ verifican la ausencia de sesgos o asimetrías detectables en la muestra analizada, garantizando que la capa de mapeo de software no degrada la uniformidad del generador subyacente.

---

## 🛠️ Stack Tecnológico

* **Frontend:** React 19 · TypeScript · Tailwind CSS 4
* **Animaciones y Física:** Framer Motion (`motion`) · Lucide React
* **Empaquetado y Offline:** Vite 8 · `vite-plugin-pwa` (Workbox)
* **Móvil Nativo:** Capacitor Android (`com.sierra88.grimorioentropico`)
* **Entropía Externa:** RANDOM.ORG HTTP API

---

## 🚀 Instalación y Despliegue para Desarrollo

### Prerrequisitos
* **Node.js** v18 o superior
* **npm** (incluido con Node.js)
* *(Opcional para Android)* Android Studio + Java JDK 17+

### 1. Desarrollo Web Local
```bash
# 1. Clonar el repositorio
git clone https://github.com/sierra88-en/grimorio-entropico.git
cd grimorio-entropico

# 2. Instalar dependencias
npm install

# 3. Iniciar servidor de desarrollo (http://localhost:3000)
npm run dev

# 4. Verificar tipos TypeScript
npm run lint

# 5. Compilar paquete de producción (genera ./dist listo para PWA y WebView)
npm run build
```

### 2. Empaquetado Nativo en Android (Capacitor)
```bash
# Compilar web assets con rutas relativas (base: './')
npm run build

# Añadir plataforma Android (solo la primera vez)
npx cap add android

# Configurar iconos adaptativos y recursos mipmap (opcional, requiere ImageMagick)
bash scripts/setup-android-icons.sh

# Sincronizar build con el proyecto nativo y abrir Android Studio
npx cap sync android
npx cap open android
```

---

## 📁 Estructura Principal del Proyecto

```text
grimorio-entropico/
├── public/
│   ├── icon.svg / pwa-*.png     # Iconos PWA, iOS y máscara adaptable
│   ├── manifest.json            # Manifiesto PWA con rutas relativas
│   └── privacy.html             # Política de Privacidad lista para GitHub Pages / Play Store
├── scripts/
│   ├── verify-entropy-bias.ts   # Auditoría estadística Chi-Cuadrado (600k tiradas)
│   └── setup-android-icons.sh   # Despliegue de Adaptive Icons en res/mipmap-*
├── src/
│   ├── components/              # Modales de Auditoría, Bitácora, Tarjeta PNG, Pro y Benchmark χ²
│   ├── data/tarotData.ts        # 22 Arcanos Mayores con interpretaciones por intención
│   ├── hooks/usePWAInstall.ts   # Hook nativo de instalación PWA
│   ├── utils/
│   │   ├── entropyEngine.ts     # Motor híbrido TRNG + CSPRNG con rechazo y modo offline
│   │   ├── audio.ts             # Sintetizador acústico Web Audio API
│   │   ├── haptics.ts           # Motor háptico Web Vibration / Capacitor
│   │   ├── oracleHistory.ts     # Persistencia local de Bitácora y Presets
│   │   └── billingArchitecture.ts # Base preparada para Google Play Billing (v1.1)
│   └── App.tsx
├── capacitor.config.json        # Configuración Capacitor Android (El Universo Decide)
└── vite.config.ts               # Configuración Vite + Workbox PWA (base: './')
```

---

## 👤 Autor y Créditos

* **Autor Principal:** **E. Sierra Ruiz** — [@sierra88-en](https://github.com/sierra88-en)
* **Especialidad:** *Data & Entropy Developer* · Análisis cuantitativo, aleatoriedad física real (TRNG) y ciberseguridad.
* **Apoyo al desarrollo:** Si este laboratorio te resulta útil, puedes apoyar el proyecto a través de GitHub Sponsors / perfil en [github.com/sierra88-en](https://github.com/sierra88-en) o en [Buy Me a Coffee](https://buymeacoffee.com/sierra88).

---

## 📜 Licencia

Este proyecto se distribuye bajo la **Licencia MIT**. Consulta el texto íntegro a continuación:

```text
MIT License

Copyright (c) 2026 E. Sierra Ruiz

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
