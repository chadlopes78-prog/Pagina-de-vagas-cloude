import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { StepLayout } from '../components/StepLayout';
import { useStagger } from '../quiz/useTimeline';

const CHECKS = [
  'A verificar informações',
  'A analisar experiência',
  'A verificar formação',
  'A preparar avaliação',
];

interface CvAnalysisStepProps {
  fileName: string;
  onContinue: () => void;
}

export function CvAnalysisStep({ fileName, onContinue }: CvAnalysisStepProps) {
  // +1 para o estado "concluído" depois do último item
  const visible = useStagger(CHECKS.length + 1, 1100);
  const done = visible > CHECKS.length;

  return (
    <StepLayout
      center
      eyebrow="Currículo"
      title={done ? 'Análise concluída' : 'Analisando o seu currículo'}
      lead={done ? 'O seu currículo foi analisado com sucesso.' : fileName}
      actions={
        done ? (
          <Button arrow onClick={onContinue}>
            Ir para a próxima etapa
          </Button>
        ) : undefined
      }
    >
      <div class={`scan${done ? ' is-done' : ''}`} aria-hidden="true">
        <div class="scan__doc">
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
        {!done && <div class="scan__beam" />}
        {done && (
          <div class="scan__badge">
            <Icon name="check" size={22} />
          </div>
        )}
      </div>

      <ul class="checklist" aria-live="polite">
        {CHECKS.map((label, i) => {
          const state = i < visible ? 'done' : i === visible ? 'active' : 'pending';
          return (
            <li key={label} class={`checklist__item is-${state}`}>
              <span class="checklist__icon">
                {state === 'done' ? <Icon name="check" size={14} /> : <span class="spinner" />}
              </span>
              {label}
            </li>
          );
        })}
      </ul>
    </StepLayout>
  );
}
