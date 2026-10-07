import { useEffect } from 'preact/hooks';
import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { HERO_IMAGE_URL } from '../config';

interface WelcomeStepProps {
  onYes: () => void;
  onNo: () => void;
}

export function WelcomeStep({ onYes, onNo }: WelcomeStepProps) {
  useEffect(() => window.scrollTo(0, 0), []);

  return (
    <section class="welcome">
      <div class="welcome__media">
        <img
          src={HERO_IMAGE_URL}
          alt="Vista de Lisboa ao entardecer, com a Ponte 25 de Abril sobre o rio Tejo"
          width={1200}
          height={900}
          fetchPriority="high"
          decoding="async"
        />
        <span class="welcome__tag">
          <span class="flag-dot" aria-hidden="true" />
          Lisboa, Portugal
        </span>
      </div>

      <div class="welcome__content">
        <p class="eyebrow eyebrow--gold">Avaliação inicial de perfil</p>
        <h1 class="welcome__title">Tem o sonho de trabalhar em Portugal?</h1>
        <p class="welcome__lead">
          Descubra se o seu perfil está preparado para avançar para oportunidades de trabalho em Portugal.
        </p>

        <div class="welcome__actions">
          <Button size="lg" arrow onClick={onYes}>
            Sim, quero trabalhar em Portugal
          </Button>
          <Button variant="ghost" onClick={onNo}>
            Não
          </Button>
        </div>

        <ul class="trust-row" aria-label="Sobre a avaliação">
          <li>
            <Icon name="clock" size={16} /> Cerca de 2 minutos
          </li>
          <li>
            <Icon name="shield" size={16} /> Gratuita
          </li>
          <li>
            <Icon name="lock" size={16} /> Dados protegidos
          </li>
        </ul>
      </div>
    </section>
  );
}
