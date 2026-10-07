import { prefersReducedMotion } from './useTimeline';

/**
 * Quando o utilizador carrega em "Continuar" sem responder: rola suavemente até
 * à pergunta, destaca-a com uma pequena animação e dá foco à primeira opção.
 */
export function revealUnansweredQuestion(el: HTMLElement | null): void {
  if (!el) return;
  const smooth = !prefersReducedMotion();
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'center' });

  // Reinicia a animação mesmo em cliques repetidos.
  el.classList.remove('needs-answer');
  void el.offsetWidth;
  el.classList.add('needs-answer');
  window.setTimeout(() => el.classList.remove('needs-answer'), 1200);

  // Foco depois da rolagem, sem voltar a rolar (leitores de ecrã anunciam a pergunta).
  const firstOption = el.querySelector<HTMLInputElement>('input[type="radio"]');
  window.setTimeout(() => firstOption?.focus({ preventScroll: true }), smooth ? 450 : 0);
}
