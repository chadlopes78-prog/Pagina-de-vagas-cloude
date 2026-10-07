import { useRef, useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { ChoiceGroup } from '../components/ChoiceGroup';
import { StepLayout } from '../components/StepLayout';
import { EUR_TO_MZN_RATE, SALARY_EXAMPLES_EUR } from '../config';
import { eurToMzn, formatEur, formatMzn } from '../quiz/currency';
import { revealUnansweredQuestion } from '../quiz/revealQuestion';
import type { SalaryOpinion } from '../quiz/types';

interface SalaryStepProps {
  value: SalaryOpinion | null;
  onChange: (value: SalaryOpinion) => void;
  onContinue: () => void;
}

export function SalaryStep({ value, onChange, onContinue }: SalaryStepProps) {
  const [showHint, setShowHint] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  return (
    <StepLayout
      eyebrow="Remuneração"
      title="Conheça alguns valores de remuneração em Portugal"
      lead="Estes valores são apenas exemplos ilustrativos. A remuneração real depende da profissão, empresa, experiência, contrato e outros fatores."
      actions={
        <Button
          arrow
          onClick={() => {
            if (!value) {
              // A pergunta fica abaixo dos cartões: levar o utilizador até ela.
              setShowHint(true);
              revealUnansweredQuestion(questionRef.current);
              return;
            }
            onContinue();
          }}
        >
          Continuar
        </Button>
      }
    >
      <ul class="salary-grid" aria-label="Exemplos de remuneração mensal">
        {SALARY_EXAMPLES_EUR.map((eur, i) => (
          <li class="salary-card" key={eur} style={{ animationDelay: `${i * 70}ms` }}>
            <span class="salary-card__eur">{formatEur(eur)}</span>
            <span class="salary-card__per">por mês</span>
            <span class="salary-card__mzn">≈ {formatMzn(eurToMzn(eur))}</span>
          </li>
        ))}
      </ul>
      <p class="fine-print">
        Conversão aproximada a 1 € ≈ {EUR_TO_MZN_RATE.toLocaleString('pt-PT')} MT, apenas para referência. Não é uma
        taxa de câmbio oficial.
      </p>

      <div class="question-block" ref={questionRef}>
        <ChoiceGroup
          name="salary"
          legend="Na sua opinião, estes salários são justos para si?"
          value={value}
          onChange={(v) => {
            setShowHint(false);
            onChange(v);
          }}
          choices={[
            { value: 'fair', label: 'Sim, são justos' },
            { value: 'notFair', label: 'Não' },
          ]}
        />
        {showHint && (
          <p class="field__error" role="alert">
            Responda a esta pergunta para continuar.
          </p>
        )}
      </div>
    </StepLayout>
  );
}
