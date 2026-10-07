import { useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { StepLayout } from '../components/StepLayout';
import { MAX_AGE, MIN_AGE, PROVINCES_MZ } from '../config';
import type { QuizAnswers } from '../quiz/types';
import { hasErrors, validatePersonalInfo, type PersonalErrors, type PersonalField } from '../quiz/validation';

interface PersonalInfoStepProps {
  answers: QuizAnswers;
  onChange: (patch: Partial<QuizAnswers>) => void;
  onContinue: (patch: Partial<QuizAnswers>) => void;
}

export function PersonalInfoStep({ answers, onChange, onContinue }: PersonalInfoStepProps) {
  const [touched, setTouched] = useState<Partial<Record<PersonalField, boolean>>>({});
  const [submitted, setSubmitted] = useState(false);
  const errors: PersonalErrors = validatePersonalInfo(answers);
  const showError = (field: PersonalField) => (submitted || touched[field]) && errors[field];
  const complete = !hasErrors(errors);

  const submit = (e: Event) => {
    e.preventDefault();
    setSubmitted(true);
    if (!complete) {
      const firstInvalid = (['name', 'age', 'province'] as const).find((f) => errors[f]);
      if (firstInvalid) document.getElementById(`field-${firstInvalid}`)?.focus();
      return;
    }
    onContinue({ name: answers.name.trim().replace(/\s+/g, ' '), age: answers.age.trim() });
  };

  const blur = (field: PersonalField) => setTouched((t) => ({ ...t, [field]: true }));

  return (
    <form onSubmit={submit} noValidate class="step-form">
      <StepLayout
        eyebrow="Dados pessoais"
        title="Vamos conhecer o seu perfil"
        lead="Responda a algumas perguntas rápidas para fazermos uma avaliação inicial do seu perfil."
        actions={
          <Button type="submit" arrow>
            Continuar
          </Button>
        }
      >
        <div class="fields">
          <div class={`field${showError('name') ? ' has-error' : ''}`}>
            <label for="field-name">Nome</label>
            <input
              id="field-name"
              type="text"
              autoComplete="given-name"
              autoCapitalize="words"
              enterKeyHint="next"
              placeholder="O seu nome"
              maxLength={60}
              value={answers.name}
              onInput={(e) => onChange({ name: e.currentTarget.value })}
              onBlur={() => blur('name')}
              aria-invalid={showError('name') ? 'true' : 'false'}
              aria-describedby={showError('name') ? 'error-name' : undefined}
            />
            {showError('name') && (
              <p class="field__error" id="error-name" role="alert">
                {errors.name}
              </p>
            )}
          </div>

          <div class={`field${showError('age') ? ' has-error' : ''}`}>
            <label for="field-age">Idade</label>
            <input
              id="field-age"
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              enterKeyHint="next"
              placeholder={`Entre ${MIN_AGE} e ${MAX_AGE} anos`}
              maxLength={3}
              value={answers.age}
              onInput={(e) => onChange({ age: e.currentTarget.value.replace(/\D/g, '') })}
              onBlur={() => blur('age')}
              aria-invalid={showError('age') ? 'true' : 'false'}
              aria-describedby={showError('age') ? 'error-age' : undefined}
            />
            {showError('age') && (
              <p class="field__error" id="error-age" role="alert">
                {errors.age}
              </p>
            )}
          </div>

          <div class={`field${showError('province') ? ' has-error' : ''}`}>
            <label for="field-province">Província onde vive</label>
            <div class="select">
              <select
                id="field-province"
                value={answers.province}
                onChange={(e) => {
                  onChange({ province: e.currentTarget.value });
                  blur('province');
                }}
                onBlur={() => blur('province')}
                aria-invalid={showError('province') ? 'true' : 'false'}
                aria-describedby={showError('province') ? 'error-province' : undefined}
                class={answers.province ? '' : 'is-placeholder'}
              >
                <option value="" disabled>
                  Selecione a província
                </option>
                {PROVINCES_MZ.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </div>
            {showError('province') && (
              <p class="field__error" id="error-province" role="alert">
                {errors.province}
              </p>
            )}
          </div>
        </div>
        <p class="fine-print">Os seus dados são usados apenas para esta avaliação.</p>
      </StepLayout>
    </form>
  );
}
