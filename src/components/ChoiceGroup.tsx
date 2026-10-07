import { Icon } from './Icon';

export interface Choice<T extends string> {
  value: T;
  label: string;
  hint?: string;
}

interface ChoiceGroupProps<T extends string> {
  name: string;
  legend: string;
  /** Esconde a legenda visualmente (quando o título da etapa já a mostra). */
  hideLegend?: boolean;
  choices: Choice<T>[];
  value: T | null;
  onChange: (value: T) => void;
}

/** Opções em cartão, baseadas em radio buttons nativos (acessíveis por teclado). */
export function ChoiceGroup<T extends string>({
  name,
  legend,
  hideLegend = false,
  choices,
  value,
  onChange,
}: ChoiceGroupProps<T>) {
  return (
    <fieldset class="choices">
      <legend class={hideLegend ? 'sr-only' : 'choices__legend'}>{legend}</legend>
      {choices.map((choice) => {
        const selected = value === choice.value;
        return (
          <label key={choice.value} class={`choice${selected ? ' is-selected' : ''}`}>
            <input
              class="choice__input"
              type="radio"
              name={name}
              value={choice.value}
              checked={selected}
              onChange={() => onChange(choice.value)}
            />
            <span class="choice__text">
              <span class="choice__label">{choice.label}</span>
              {choice.hint && <span class="choice__hint">{choice.hint}</span>}
            </span>
            <span class="choice__mark" aria-hidden="true">
              <Icon name="check" size={16} />
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}

/** Converte boolean|null <-> 'yes'|'no' para o ChoiceGroup. */
export const toYesNo = (v: boolean | null): 'yes' | 'no' | null => (v === null ? null : v ? 'yes' : 'no');
