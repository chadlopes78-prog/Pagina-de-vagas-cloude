import { useEffect, useState } from 'preact/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { StepLayout } from '../components/StepLayout';
import { goToFinalCta, isCtaConfigured } from '../quiz/cta';
import type { QuizAnswers } from '../quiz/types';

interface FinalStepProps {
  answers: QuizAnswers;
  onRestart: () => void;
}

export function FinalStep({ answers, onRestart }: FinalStepProps) {
  const [redirecting, setRedirecting] = useState(false);
  const [notConfigured, setNotConfigured] = useState(false);
  // Se o utilizador voltar do checkout (cache do navegador), reactivar o botão.
  useEffect(() => {
    const onShow = () => setRedirecting(false);
    window.addEventListener('pageshow', onShow);
    return () => window.removeEventListener('pageshow', onShow);
  }, []);

  const today = new Date().toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });

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
    <StepLayout
      eyebrow="Próxima etapa"
      title="Você pode avançar para a próxima etapa"
      lead="A sua avaliação inicial foi concluída. Agora pode continuar o processo e conhecer os próximos passos para procurar oportunidades de trabalho em Portugal."
    >
      <article class="offer">
        <div class="offer__top">
          <span class="offer__badge">
            <Icon name="spark" size={14} /> Avaliação concluída · {today}
          </span>
          <h2 class="offer__title">Auxiliar de Vagas</h2>
          <p class="offer__route">
            <span>Moçambique</span>
            <Icon name="arrowRight" size={18} />
            <span>Portugal</span>
          </p>
        </div>
        <p class="offer__text">
          Garanta o seu espaço no Auxiliar de Vagas de Moçambique para Portugal e continue o seu processo ainda hoje.
        </p>

        <div class="offer__cta">
          <Button size="lg" pulse={!redirecting} arrow={!redirecting} onClick={handleCta} disabled={redirecting}>
            {redirecting ? 'A abrir…' : 'Garantir o meu espaço agora'}
          </Button>
          {notConfigured && (
            <p class="field__error" role="alert">
              O link de inscrição ainda não está disponível. Tente novamente mais tarde.
            </p>
          )}
        </div>
      </article>

      <p class="legal">
        Esta avaliação inicial não representa uma garantia de contratação. A seleção final depende das vagas
        disponíveis, requisitos e processos de recrutamento aplicáveis.
      </p>

      <button type="button" class="text-link" onClick={onRestart}>
        Refazer a avaliação
      </button>
    </StepLayout>
  );
}
