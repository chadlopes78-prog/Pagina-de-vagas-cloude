import { Button } from '../components/Button';
import { StepLayout } from '../components/StepLayout';

export function DeclinedStep({ onBack }: { onBack: () => void }) {
  return (
    <StepLayout
      center
      title="Obrigado pela sua visita"
      lead="Esta avaliação é dedicada a quem pretende trabalhar em Portugal. Se mudar de ideias, pode voltar e iniciar a avaliação a qualquer momento."
      actions={
        <Button variant="secondary" onClick={onBack}>
          Voltar ao início
        </Button>
      }
    />
  );
}
