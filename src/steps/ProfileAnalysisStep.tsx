import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { StepLayout } from '../components/StepLayout';
import type { QuizAnswers } from '../quiz/types';
import { useProgress } from '../quiz/useTimeline';

const MESSAGES = [
  'A verificar os seus dados…',
  'A avaliar o seu perfil…',
  'A analisar as informações fornecidas…',
  'A preparar o seu resultado…',
  'Quase concluído…',
];

const yesNo = (v: boolean | null) => (v === null ? '—' : v ? 'Sim' : 'Não');

interface ProfileAnalysisStepProps {
  answers: QuizAnswers;
  onContinue: () => void;
}

export function ProfileAnalysisStep({ answers, onContinue }: ProfileAnalysisStepProps) {
  const pct = useProgress(7000);
  const done = pct >= 100;
  const message = MESSAGES[Math.min(MESSAGES.length - 1, Math.floor((pct / 100) * MESSAGES.length))];

  const rows: [string, string][] = [
    ['Nome', answers.name],
    ['Idade', answers.age ? `${answers.age} anos` : '—'],
    ['Província', answers.province],
    ['12ª classe', yesNo(answers.completed12th)],
    ['Experiência profissional', yesNo(answers.hasWorkExperience)],
    ['Currículo', answers.hasCV && answers.cvFile ? answers.cvFile.name : answers.hasCV ? 'Sim' : 'Não enviado'],
  ];
  // Cada linha "acende" à medida que o progresso avança.
  const checkedRows = Math.floor((pct / 100) * (rows.length + 0.5));

  const radius = 52;
  const circumference = 2 * Math.PI * radius;

  return (
    <StepLayout
      center
      eyebrow="Análise do perfil"
      title={done ? 'Avaliação concluída' : 'A analisar o seu perfil…'}
      actions={
        done ? (
          <Button arrow onClick={onContinue}>
            Ver o meu resultado
          </Button>
        ) : undefined
      }
    >
      <div class={`ring${done ? ' is-done' : ''}`}>
        <svg viewBox="0 0 120 120" width="148" height="148" aria-hidden="true">
          <circle class="ring__track" cx="60" cy="60" r={radius} />
          <circle
            class="ring__fill"
            cx="60"
            cy="60"
            r={radius}
            stroke-dasharray={circumference}
            stroke-dashoffset={circumference * (1 - pct / 100)}
          />
        </svg>
        <div
          class="ring__value"
          role="progressbar"
          aria-label="Progresso da análise"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={pct}
        >
          {done ? <Icon name="check" size={34} /> : <span>{pct}%</span>}
        </div>
      </div>

      <p class="status-line" aria-live="polite">
        {done ? 'Todas as informações foram avaliadas.' : message}
      </p>

      <dl class="summary">
        {rows.map(([label, value], i) => (
          <div key={label} class={`summary__row${i < checkedRows || done ? ' is-checked' : ''}`}>
            <dt>{label}</dt>
            <dd>
              <span class="summary__value">{value}</span>
              <span class="summary__tick" aria-hidden="true">
                <Icon name="check" size={12} />
              </span>
            </dd>
          </div>
        ))}
      </dl>
    </StepLayout>
  );
}
