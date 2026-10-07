import { useEffect, useState } from 'preact/hooks';

export function prefersReducedMotion(): boolean {
  return typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches === true;
}

/**
 * Progresso animado de 0 a 100 durante `durationMs` (requestAnimationFrame,
 * sem bibliotecas). Com "reduzir movimento" activo a duração é encurtada.
 */
export function useProgress(durationMs: number): number {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const duration = prefersReducedMotion() ? Math.min(durationMs, 1200) : durationMs;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      // ease-in-out suave, com pequenas "pausas" naturais
      const eased = t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
      setPct(Math.round(eased * 100));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [durationMs]);

  return pct;
}

/** Revela itens um a um: devolve quantos já estão visíveis. */
export function useStagger(count: number, intervalMs: number): number {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const interval = prefersReducedMotion() ? Math.min(intervalMs, 250) : intervalMs;
    const timers = Array.from({ length: count }, (_, i) =>
      window.setTimeout(() => setVisible(i + 1), interval * (i + 1)),
    );
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [count, intervalMs]);

  return visible;
}
