# Fundo com Estrelas Cadentes Realistas (Next.js/React + Tailwind, TS)

> **Escopo**: implementar um background animado de céu estrelado com **estrelas cadentes** **apenas** nas páginas **Login** e **Signup**. O restante do site usa apenas o céu + estrelas cintilando (sem meteoros) **ou** nenhum background animado (configurável).

---

## 1) Entregáveis

1. **Componente** `components/ShootingStarsBackground.tsx` (TS, SSR‑safe) — renderiza `<canvas>` full‑screen com céu, estrelas e meteoros.
2. **Hook** `hooks/useRafAnimation.ts` — loop de animação com `requestAnimationFrame`, delta time e capping de FPS.
3. **Variante leve** `components/ShootingStarsLayer.tsx` — somente céu + estrelas cintilando (sem meteoros) para páginas comuns.
4. **Integração** nas rotas `app/(auth)/login/page.tsx` e `app/(auth)/signup/page.tsx` (ou equivalente): usar a versão **com meteoros** apenas nessas páginas.

> **Sem libs externas** além de React. Seguir **Tailwind** para posicionamento/z‑index.

---

## 2) Requisitos Visuais (realismo)

* **Céu**: gradiente sutil (topo mais claro que base) gerado no próprio canvas.
* **Campo de estrelas**: 300–600 pontos com tamanhos variados (distribuição log‑normal), **twinkle** leve (alpha modulado), halo/glow suave.
* **Estrelas cadentes (meteoros)**: spawn estocástico (média 1–3 a cada 8–12s, com rajadas ocasionais), trajetória levemente curvada (Bezier simples), trilha com fade usando `globalCompositeOperation: 'lighter'`, **sparks** com decaimento exponencial.
* **Parallax** sutil por camadas (3 profundidades) e leve resposta ao mouse.

---

## 3) Requisitos de Acessibilidade & Energia

* Respeitar `prefers-reduced-motion: reduce` → **desligar animação** (render estático apenas).
* Pausar quando `document.hidden === true` e retomar quando visível.
* `<canvas role="img" aria-label="Fundo de céu estrelado com estrelas cintilando">`.

---

## 4) API do Componente

```ts
export type ShootingStarsBackgroundProps = {
  className?: string;          // ex.: "fixed inset-0 -z-10 pointer-events-none"
  zIndexClass?: string;        // ex.: "-z-10" (default)
  density?: number;            // 0.5–2, default 1 (multiplica nº de estrelas)
  maxFps?: number;             // default 60
  palette?: {
    skyTop: string;            // ex.: "#0b1023"
    skyBottom: string;         // ex.: "#030713"
    star: string;              // ex.: "#DDE9FF"
    glow: string;              // ex.: "#7FCBFF"
    trail: string;             // ex.: "#B7E0FF"
  };
  spawnRate?: { mean: number; jitter: number }; // média de spawn em segundos
  enableParallax?: boolean;   // default true
  pauseWhenHidden?: boolean;  // default true
  reducedMotionOverride?: boolean; // para testes
  meteors?: boolean;          // **chave**: true = com meteoros; false = sem (padrão: false)
};
```

> **Importante**: o **prop `meteors` deve ser `true` apenas em Login/Signup**. Em todas as outras páginas, manter `false` ou usar `ShootingStarsLayer`.

---

## 5) Estrutura de Pastas

```
src/
  app/
    (auth)/
      login/page.tsx
      signup/page.tsx
    layout.tsx
  components/
    ShootingStarsBackground.tsx
    ShootingStarsLayer.tsx
  hooks/
    useRafAnimation.ts
```

---

## 6) Passo a passo de implementação

### 6.1 Hook de animação (`useRafAnimation`)

* Expor interface: `start()`, `stop()`, `isRunning`, `deltaMs`, `setFpsCap(n)`.
* Usar `requestAnimationFrame`, calcular delta com `performance.now()`.
* Aplicar **capping de FPS** (ex.: 60) ignorando frames quando necessário.
* Limpar e cancelar RAF no unmount.

### 6.2 Componente base (`ShootingStarsBackground`)

* **SSR‑safe**: acessar `window`/`document` apenas dentro de `useEffect`.
* Renderizar `<canvas>` com classes Tailwind padrão: `fixed inset-0 -z-10 pointer-events-none select-none`.
* **HiDPI**: ajustar `canvas.width/height = client * devicePixelRatio`, e escalar o contexto com `scale(dpr, dpr)`.
* Criar **buffers reutilizáveis** para estrelas, meteoros e sparks (sem alocar arrays por frame).
* Desenho em camadas por frame:

  1. céu (gradiente), 2) estrelas (com twinkle), 3) meteoros (se `props.meteors`), 4) sparks.
* **Resize**: `ResizeObserver` ou listener `resize` com debounce; re‑amostrar campo de estrelas sem piscar.

### 6.3 Céu (gradiente)

* Pré‑gerar `CanvasGradient` (vertical ou radial) com cores de `palette`.
* Desenhar como fundo 1x por resize ou armazenar em `Offscreen`/bitmap quando disponível.

### 6.4 Estrelas

* Gerar N = `base * density` pontos `{x, y, size, mag, twinklePhase, layer}`.
* **Twinkle**: alpha = `base + sin(t + phase) * amplitude + smallNoise`; amplitude pequena para não pulsar demais.
* Glow: sombra leve ou desenhar dois círculos (halo grande com alpha baixo + núcleo pequeno).

### 6.5 Meteoro (se `meteors: true`)

* **Scheduler** (Poisson): próximo spawn = `now + mean ± jitter`.
* Trajetória: gerar ângulo ~20–35°, leve curvatura via 1 ponto de controle Bezier (aprox. quadrática).
* Velocidade, comprimento e brilho variam por **layer** (para
