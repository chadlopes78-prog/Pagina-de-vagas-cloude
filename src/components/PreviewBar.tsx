import { Icon } from './Icon';

/** Botão "Recomeçar" visível apenas com VITE_PREVIEW_MODE=true. */
export function PreviewBar({ onRestart }: { onRestart: () => void }) {
  return (
    <div class="preview-bar">
      <span class="preview-bar__label">Modo preview</span>
      <button type="button" class="preview-bar__btn" onClick={onRestart}>
        <Icon name="arrowLeft" size={14} /> Recomeçar
      </button>
    </div>
  );
}
