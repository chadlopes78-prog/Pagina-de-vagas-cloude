import { useEffect, useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { StepLayout } from '../components/StepLayout';
import { formatScore, getScoreFactors, getScoreTier, MAX_SCORE } from '../quiz/score';
import type { QuizAnswers } from '../quiz/types';
import { prefersReducedMotion } from '../quiz/useTimeline';
import { firstName } from '../quiz/validation';

const CONFIRMATIONS = ['Perfil analisado', 'Informações avaliadas', 'Avaliação concluída', 'Próxima etapa disponível'];

/** Contador animado até à pontuação final. */
function useCountUp(target: number, durationMs = 1400): number {
  const [value, setValue] = useState(prefersReducedMotion() ? target : 0);
  useEffect(() => {
    if (prefersReducedMotion()) return;
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      setValue(Math.round(target * (1 - Math.pow(1 - t, 3)) * 10) / 10);
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);
  return value;
}

interface ScoreResultStepProps {
  answers: QuizAnswers;
  score: number;
  onContinue: () => void;
}

export function ScoreResultStep({ answers, score, onContinue }: ScoreResultStepProps) {
  const shown = useCountUp(score);
  const tier = getScoreTier(score);
  const factors = getScoreFactors(answers);
  const name = firstName(answers.name);

  return (
    <StepLayout
      eyebrow="Avaliação concluída"
      title="Resultado da sua avaliação"
      actions={
        <Button arrow size="lg" onClick={onContinue}>
          Ver a próxima etapa
        </Button>
      }
    >
      <div class="score-card">
        <p class="score-card__label">Índice de compatibilidade</p>
        <p class="score-card__value" aria-label={`${formatScore(score)} de ${MAX_SCORE}`}>
          <span class="score-card__big">{formatScore(shown)}</span>
          <span class="score-card__max">/ {MAX_SCORE}</span>
        </p>
        <div class="score-card__bar" aria-hidden="true">
          <span style={{ transform: `scaleX(${shown / MAX_SCORE})` }} />
        </div>
        <p class="score-card__tier">
          <Icon name="shield" size={16} /> {tier.label}
        </p>
      </div>

      <p class="result-headline">{tier.headline(name)}</p>
      <p class="step__lead">
        O seu perfil apresenta características que justificam avançar para a próxima etapa de candidatura às
        oportunidades de trabalho em Portugal.
      </p>

      <ul class="confirm-grid">
        {CONFIRMATIONS.map((label, i) => (
          <li key={label} style={{ animationDelay: `${300 + i * 90}ms` }}>
            <span class="confirm-grid__icon">
              <Icon name="check" size={14} />
            </span>
            {label}
          </li>
        ))}
      </ul>

      <details class="factors">
        <summary>Como foi calculado o índice</summary>
        <ul>
          {factors.map((f) => (
            <li key={f.label} class={f.met ? 'is-met' : ''}>
              <span>{f.label}</span>
              <span>{f.met ? 'Favorável' : 'A desenvolver'}</span>
            </li>
          ))}
        </ul>
        <p class="fine-print">
          Índice indicativo, calculado com base nas respostas fornecidas. Não representa garantia de contratação.
        </p>
      </details>
    </StepLayout>
  );
}
