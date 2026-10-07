import { useEffect, useRef, useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { VideoPlayer } from '../components/VideoPlayer';
import { goToFinalCta, isCtaConfigured } from '../quiz/cta';
import type { QuizAnswers } from '../quiz/types';

interface FinalStepProps {
  answers: QuizAnswers;
}

/** Etapa final em formato VSL: headline → subheadline → vídeo → CTA → aviso. */
export function FinalStep({ answers }: FinalStepProps) {
  const [redirecting, setRedirecting] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    headingRef.current?.focus({ preventScroll: true });
    // Se o utilizador voltar do checkout (cache do navegador), reactivar o botão.
    const onShow = () => setRedirecting(false);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const handleCta = () => {
    if (!isCtaConfigured()) {
      setNotConfigured(true);
      goToFinalCta(answers); // apenas regista o aviso na consola
      return;
    }
    setRedirecting(true);
    goToFinalCta(answers);
  };

  return (
    <section class="vsl">
      <h1 class="vsl__title" ref={headingRef} tabIndex={-1}>
        Assista ao vídeo e descubra como avançar para oportunidades de trabalho em Portugal
      </h1>
      <p class="vsl__sub">
        Veja as informações importantes antes de garantir o seu espaço no Auxiliar de Vagas —{' '}
        <span class="nowrap">Moçambique → Portugal.</span>
      </p>

      <div class="vsl__video">
        <VideoPlayer />
      </div>

      <div class="vsl__cta">
        <Button size="lg" pulse={!redirecting} arrow={!redirecting} onClick={handleCta} disabled={redirecting}>
          {redirecting ? 'A abrir…' : 'Garantir o meu espaço agora'}
        </Button>
        {notConfigured && (
          <p class="vsl__error" role="alert">
            O link de inscrição ainda não está disponível. Tente novamente mais tarde.
          </p>
        )}
      </div>

      <div class="vsl__info">
        <p class="vsl__note">Continue apenas se as informações apresentadas fizerem sentido para o seu perfil.</p>
        <p class="vsl__legal">
          A avaliação inicial não representa uma garantia de contratação. A seleção final depende das oportunidades
          disponíveis, requisitos e processos de recrutamento.
        </p>
      </div>
    </section>
  );
}
