import { Icon } from './Icon';
import { ProgressBar } from './ProgressBar';

interface HeaderProps {
  progress: { current: number; total: number } | null;
  onBack?: () => void;
}

export function Header({ progress, onBack }: HeaderProps) {
  return (
    <header class="topbar">
      <div class="topbar__row">
        {onBack ? (
          <button type="button" class="icon-btn" onClick={onBack} aria-label="Voltar à etapa anterior">
            <Icon name="arrowLeft" size={20} />
          </button>
        ) : (
          <span class="icon-btn icon-btn--placeholder" aria-hidden="true" />
        )}
        <p class="brand">
          <span class="brand__mark" aria-hidden="true">
            AV
          </span>
          <span class="brand__name">
            Auxiliar de Vagas
            <span class="brand__route">Moçambique → Portugal</span>
          </span>
        </p>
        <span class="icon-btn icon-btn--placeholder" aria-hidden="true" />
      </div>
      {progress && <ProgressBar current={progress.current} total={progress.total} />}
    </header>
  );
}
