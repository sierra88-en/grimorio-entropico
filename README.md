# 🌌 Grimorio Entrópico: Laboratorio de Aleatoriedad

[![License: MIT](https://img.shields.io/badge/License-MIT-dfb15b.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-19-0284c7.svg?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6.svg?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38bdf8.svg?style=for-the-badge&logo=tailwindcss)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-12.x-ff0055.svg?style=for-the-badge&logo=framer)](https://motion.dev/)
[![Entropy Source](https://img.shields.io/badge/TRNG-RANDOM.ORG_Atmospheric-10b981.svg?style=for-the-badge)](https://www.random.org/)

> **«El Universo Decide — no el procesador.»**  
> Oráculo de toma de decisiones cuántico-esotérico que sustituye el azar algorítmico determinista (`Math.random()`) por **entropía electromagnética física real** proveniente de tormentas atmosféricas terrestres y generadores criptoseguros de kernel (CSPRNG).

Desarrollado y mantenido por **[E. Sierra Ruiz (@sierra88-en)](https://github.com/sierra88-en)**.

---

## 🔮 Características Principales

### 🪙 1. Moneda Alquímica 3D con Polvo de Estrellas
* **Sol Invictus (Sí):** Medallón ceremonial en bronce y oro hermético con grabado solar.
* **Luna Regalis (No):** Reverso astral en plata sideral y cian con la luna mística.
* **Física de giro:** Rotación tridimensional `preserve-3d` con interpolación de curvas Bézier.
* **Sistema de Partículas (Stardust):** Emisión radial de 36 partículas mágicas (estrellas de 4 puntas, orbes fluorescentes, diamantes y arcos de estática) con ondas de choque lumínicas al asentarse el resultado.
* **Pergamino oracular:** *"Sintoniza tu intención: Antes de lanzar, piensa en tu objetivo."*

### 🎲 2. Ritual de Dados RPG 3D con Física de Rebote
* **Selector configurativo:** 1 a 5 dados simultáneos con caras `d4`, `d6`, `d8`, `d10`, `d12`, `d20` y `d100`.
* **Geometría poliédrica cristalina SVG:** Facetas tridimensionales con reflejos de zafiro cósmico y runas celestes.
* **Cinemática de colisión y rebote (Framer Motion):** Los dados convergen a gran velocidad hacia el centro, chocan entre sí con deformación elástica (*squash & stretch*), rebotan en ángulos vectoriales periféricos y se asientan con oscilación amortiguada.
* **Suma matemática en tiempo real:** Desglose individual de cada dado y sumatoria total grabada en oro epigráfico (ej. `82 + 5 + 57 + 93 + 12 = 249`).
* **Micro-rebotes interactivos:** Toca cualquier dado individualmente para provocar un rebote elástico.

### 🎡 3. Ruleta Estocástica Personalizable
* **Inicio 100% limpio:** Sin listas fijas hardcodeadas; agrega libremente cualquier texto o dilema.
* **Botón "Default Key":** Carga al instante las opciones universales de decisión (*Sí, No, Tal vez, Consultar de nuevo*).
* **Botón "Borrar todo":** Limpieza total de opciones con un solo clic.
* **Modos duales:**
  * **Modo Ruleta:** Disco cromático interactivo con aguja indicadora superior y animación física de desaceleración (6-8 giros completos).
  * **Modo Lista:** Enumeración desglosada con botones `(X)` individuales para descartar opciones.
* **Badge de resultado:** *"Elegido por el universo: [Opción]"*.

### 🃏 4. Tarot Entrópico (22 Arcanos Mayores)
* **Selector de intención previa:** Filtra la lectura directa en tres dimensiones vitales:
  * 💖 **[ Amor ]:** Vínculos, afectos, parejas y relaciones interpersonales.
  * 💼 **[ Proyectos ]:** Decisiones profesionales, finanzas, creatividad y estrategia.
  * 🔮 **[ Espíritu ]:** Crecimiento personal, sincronicidad, destino y autoconocimiento.
* **Rescatador Vectorial Infallible (`ImageWithFallback`):**
  * Despliega las litografías clásicas en alta resolución.
  * **A prueba de fallos:** Si la red se corta o falla la conexión, se activa automáticamente una carta SVG vectorial en marco dorado con el símbolo alquímico, elemento astrológico y numeración romana. **Ninguna carta se ve rota**.
* **Lectura directa:** Interpretación concisa en español (máximo 3 líneas) orientada a la toma de acción.

### ℹ️ 5. Laboratorio de Teoría de Aleatoriedad y Perfil de Autor
* **Perfil oficial de autor:** E. Sierra Ruiz (`@sierra88-en · Data & Entropy Developer`) con foto de autor, licencia MIT y enlace de apoyo *"Invítame un café"*.
* **Auditoría de Entropía en vivo:** Modal con métricas de la última tirada (fuente TRNG/CSPRNG, latencia en ms, semilla hexadecimal y confirmación de sesgo 0.00%).
* **Módulos teóricos educativos desplegables:**
  * *PRNG vs. Generadores Seguros vs. Entropía Física Cuántica.*
  * *La entropía no es una prueba (Mitigación del Sesgo de Módulo).*
  * *Ejemplos de dados de 6 caras (1-6) listos para copiar con 1 clic en 6 lenguajes:*
    * **Dart (Flutter):** `final d6 = Random.secure().nextInt(6) + 1;`
    * **Java:** `int d6 = new SecureRandom().nextInt(6) + 1;`
    * **C# (.NET):** `int d6 = RandomNumberGenerator.GetInt32(1, 7);`
    * **Python:** `import secrets; d6 = secrets.randbelow(6) + 1`
    * **Node.js:** `const d6 = require("crypto").randomInt(1, 7);`
    * **PowerShell:** `[System.Security.Cryptography.RandomNumberGenerator]::GetInt32(1, 7)`

---

## ⚡ Arquitectura del Motor de Entropía Híbrido

La mayoría de software convencional utiliza algoritmos pseudorandom (como `Math.random()`), cuyas secuencias son predecibles si se conoce la semilla de tiempo (timestamp). Este laboratorio implementa una arquitectura híbrida con failover automático:
