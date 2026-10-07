import type { ComponentChildren } from 'preact';
import { useRef, useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { ChoiceGroup, toYesNo } from '../components/ChoiceGroup';
import { StepLayout } from '../components/StepLayout';
import { revealUnansweredQuestion } from '../quiz/revealQuestion';

interface YesNoStepProps {
  name: string;
  eyebrow: string;
  title: string;
  lead?: string;
  question: string;
  yesLabel?: string;
  noLabel?: string;
  value: boolean | null;
  onChange: (value: boolean) => void;
  onContinue: () => void;
  children?: ComponentChildren;
}

/** Etapa genérica de pergunta SIM/NÃO (escolaridade, experiência, currículo…). */
export function YesNoStep({
  name,
  eyebrow,
  title,
  lead,
  question,
  yesLabel = 'Sim',
  noLabel = 'Não',
  value,
  onChange,
  onContinue,
  children,
}: YesNoStepProps) {
  const [showHint, setShowHint] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  const submit = () => {
    if (value === null) {
      setShowHint(true);
      revealUnansweredQuestion(questionRef.current);
      return;
    }
    onContinue();
  };

  return (
    <StepLayout
      eyebrow={eyebrow}
      title={title}
      lead={lead}
      actions={
        <Button arrow onClick={submit}>
          Continuar
        </Button>
      }
    >
      {children}
      <div class="question-block" ref={questionRef}>
        <ChoiceGroup
          name={name}
          legend={question}
          hideLegend={question === title}
          value={toYesNo(value)}
          onChange={(v) => {
            setShowHint(false);
            onChange(v === 'yes');
          }}
          choices={[
            { value: 'yes', label: yesLabel },
            { value: 'no', label: noLabel },
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
