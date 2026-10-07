import { h, type ComponentChildren } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { VIDEO_ASPECT_RATIO, VIDEO_FALLBACK_URL, VIDEO_POSTER_URL } from '../config';
import { getVideoSource, loadScriptOnce, type VideoSource } from '../quiz/video';

const IFRAME_ALLOW = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen';
const TITLE = 'Vídeo: como avançar para oportunidades de trabalho em Portugal';

/** Tipo MIME a partir da extensão, para o navegador escolher a fonte que consegue tocar. */
function mimeFor(src: string): string | undefined {
  const ext = src.split(/[?#]/)[0].split('.').pop()?.toLowerCase();
  if (ext === 'webm') return 'video/webm';
  if (ext === 'ogv') return 'video/ogg';
  if (ext === 'mp4' || ext === 'm4v') return 'video/mp4';
  return undefined;
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" width="30" height="30" aria-hidden="true" focusable="false">
      <path d="M8 5.5v13a1 1 0 001.5.86l10.5-6.5a1 1 0 000-1.72L9.5 4.64A1 1 0 008 5.5z" fill="currentColor" />
    </svg>
  );
}

/**
 * Player responsivo da etapa final. O YouTube usa uma "capa" leve e só carrega
 * o player ao tocar (poupa dados e acelera a página em Android de baixo custo).
 */
export function VideoPlayer({ source = getVideoSource() }: { source?: VideoSource }) {
  const [playing, setPlaying] = useState(false);
  const vturbScript = source.kind === 'vturb' ? source.scriptUrl : '';

  useEffect(() => {
    if (vturbScript) loadScriptOnce(vturbScript);
  }, [vturbScript]);
  /** Proporção real do ficheiro de vídeo (lida dos metadados); senão usa a configurada. */
  const [fileRatio, setFileRatio] = useState<{ w: number; h: number } | null>(null);
  const ratio = fileRatio ? `${fileRatio.w} / ${fileRatio.h}` : VIDEO_ASPECT_RATIO;
  const vertical = fileRatio ? fileRatio.h > fileRatio.w : VIDEO_ASPECT_RATIO === '9 / 16' || VIDEO_ASPECT_RATIO === '4 / 5';

  const frame = (content: ComponentChildren, extra = '') => (
    <div class={`video${vertical ? ' video--vertical' : ''}${extra}`} style={{ aspectRatio: ratio }}>
      {content}
    </div>
  );

  switch (source.kind) {
    case 'vturb':
      // Mesmo HTML do código de incorporação da VTurb; o script substitui o placeholder pelo player.
      return (
        <div class="video video--vturb">
          {h(
            'vturb-smartplayer',
            { id: `vid-${source.playerId}`, style: 'display: block; margin: 0 auto; width: 100%;' },
            <div
              class="vturb-player-placeholder"
              style="position: relative; width: 100%; padding: 56.25% 0 0; z-index: 0; background-color: black;"
            />,
          )}
        </div>
      );

    case 'none':
      return frame(
        <div class="video__placeholder" role="img" aria-label="Vídeo em breve">
          <span class="video__play video__play--muted">
            <PlayIcon />
          </span>
          <strong>O vídeo será disponibilizado em breve</strong>
          <span>Entretanto, pode continuar através do botão abaixo.</span>
        </div>,
        ' video--empty',
      );

    case 'file':
      return frame(
        <video
          class="video__media"
          poster={VIDEO_POSTER_URL || undefined}
          controls
          playsInline
          preload="metadata"
          controlsList="nodownload"
          onLoadedMetadata={(e) => {
            const { videoWidth: w, videoHeight: h } = e.currentTarget;
            if (w > 0 && h > 0) setFileRatio({ w, h });
          }}
        >
          <source src={source.src} type={mimeFor(source.src)} />
          {VIDEO_FALLBACK_URL && <source src={VIDEO_FALLBACK_URL} type={mimeFor(VIDEO_FALLBACK_URL)} />}
          O seu navegador não suporta a reprodução deste vídeo.
        </video>,
      );

    case 'youtube':
      if (playing) {
        return frame(<iframe class="video__media" src={source.embedUrl} title={TITLE} allow={IFRAME_ALLOW} />);
      }
      return frame(
        <button type="button" class="video__facade" onClick={() => setPlaying(true)} aria-label="Reproduzir o vídeo">
          <img
            src={VIDEO_POSTER_URL || source.thumbnailUrl}
            alt=""
            decoding="async"
            onError={(e) => (e.currentTarget.style.visibility = 'hidden')}
          />
          <span class="video__play">
            <PlayIcon />
          </span>
        </button>,
      );

    case 'vimeo':
    case 'iframe':
      return frame(
        <iframe
          class="video__media"
          src={source.embedUrl}
          title={TITLE}
          allow={IFRAME_ALLOW}
         
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />,
      );
  }
}
