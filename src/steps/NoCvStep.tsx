import { Button } from '../components/Button';
import { Icon } from '../components/Icon';
import { StepLayout } from '../components/StepLayout';

export function NoCvStep({ onContinue }: { onContinue: () => void }) {
  return (
    <StepLayout
      center
      eyebrow="Currículo"
      title="Não tem problema."
      lead="Pode continuar com a avaliação do seu perfil e conhecer os próximos passos."
      actions={
        <Button arrow onClick={onContinue}>
          Continuar
        </Button>
      }
    >
      <div class="hero-icon hero-icon--green" aria-hidden="true">
        <Icon name="check" size={30} />
      </div>
    </StepLayout>
  );
}
