interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);
  return (
    <div class="progress">
      <div class="progress__meta">
        <span class="progress__label">
          Etapa <strong>{current}</strong> de {total}
        </span>
        <span class="progress__pct" aria-hidden="true">
          {pct}%
        </span>
      </div>
      <div
        class="progress__track"
        role="progressbar"
        aria-label={`Etapa ${current} de ${total}`}
        aria-valuemin={0}
        aria-valuemax={total}
        aria-valuenow={current}
      >
        <div class="progress__fill" style={{ transform: `scaleX(${current / total})` }} />
      </div>
    </div>
  );
}
