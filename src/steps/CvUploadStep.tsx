import { useRef, useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { StepLayout } from '../components/StepLayout';
import { CV_MAX_SIZE_MB } from '../config';
import { CV_ACCEPT_ATTRIBUTE, formatFileSize, validateCvFile } from '../quiz/cvUpload';
import type { CvFileInfo } from '../quiz/types';

interface CvUploadStepProps {
  /** Ficheiro escolhido anteriormente (se o utilizador voltou a esta etapa). */
  previous: CvFileInfo | null;
  onContinue: (file: File | null) => void;
}

export function CvUploadStep({ previous, onContinue }: CvUploadStepProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string>();
  const [dragging, setDragging] = useState(false);

  const shown = file ? { name: file.name, size: file.size } : previous;

  const pick = (candidate: File | undefined) => {
    if (!candidate) return;
    const problem = validateCvFile(candidate);
    if (problem) {
      setError(problem);
      setFile(null);
      if (inputRef.current) inputRef.current.value = '';
      return;
    }
    setError(undefined);
    setFile(candidate);
  };

  const submit = () => {
    if (!file && !previous) {
      setError('Escolha o ficheiro do seu currículo para continuar.');
      return;
    }
    onContinue(file);
  };

  return (
    <StepLayout
      eyebrow="Currículo"
      title="Envie o seu currículo"
      lead="Envie o seu currículo para analisarmos as informações profissionais apresentadas."
      actions={
        <Button arrow onClick={submit}>
          Continuar
        </Button>
      }
    >
      <label
        class={`dropzone${dragging ? ' is-dragging' : ''}${shown ? ' has-file' : ''}${error ? ' has-error' : ''}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          pick(e.dataTransfer?.files[0]);
        }}
      >
        <input
          ref={inputRef}
          class="sr-only"
          type="file"
          accept={CV_ACCEPT_ATTRIBUTE}
          aria-describedby="cv-help"
          onChange={(e) => pick(e.currentTarget.files?.[0])}
        />
        {shown ? (
          <span class="dropzone__file">
            <span class="dropzone__file-icon">
              <Icon name="file" size={22} />
            </span>
            <span class="dropzone__file-meta">
              <strong>{shown.name}</strong>
              <span>
                {formatFileSize(shown.size)} · <span class="link-like">Trocar ficheiro</span>
              </span>
            </span>
            <span class="dropzone__ok" aria-label="Ficheiro válido">
              <Icon name="check" size={16} />
            </span>
          </span>
        ) : (
          <span class="dropzone__empty">
            <span class="dropzone__icon">
              <Icon name="upload" size={24} />
            </span>
            <strong>Toque para escolher o ficheiro</strong>
            <span>ou arraste-o para aqui</span>
          </span>
        )}
      </label>
      <p class="fine-print" id="cv-help">
        Formatos aceites: PDF, DOC ou DOCX · Máximo {CV_MAX_SIZE_MB} MB
      </p>
      {error && (
        <p class="field__error" role="alert">
          {error}
        </p>
      )}
    </StepLayout>
  );
}
