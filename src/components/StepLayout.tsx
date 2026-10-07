import type { ComponentChildren } from 'preact';
import { useEffect, useRef } from 'preact/hooks';

interface StepLayoutProps {
  eyebrow?: string;
  title: ComponentChildren;
  lead?: ComponentChildren;
  children?: ComponentChildren;
  /** Acções fixas no fundo do ecrã (botão CONTINUAR). */
  actions?: ComponentChildren;
  center?: boolean;
}

/**
 * Estrutura comum das etapas. Ao montar, leva o foco ao título para
 * que leitores de ecrã anunciem a nova etapa (sem reload da página).
 */
export function StepLayout({ eyebrow, title, lead, children, actions, center = false }: StepLayoutProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
  }, []);

  return (
    <section class={`step${center ? ' step--center' : ''}`}>
      <div class="step__body">
        {eyebrow && <p class="eyebrow">{eyebrow}</p>}
        <h1 class="step__title" ref={headingRef} tabIndex={-1}>
          {title}
        </h1>
        {lead && <p class="step__lead">{lead}</p>}
        {children}
      </div>
      {actions && <div class="step__actions">{actions}</div>}
    </section>
  );
}
