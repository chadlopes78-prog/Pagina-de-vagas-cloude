import { uploadCv } from '../quiz/cvUpload';
import { canGoBack, getProgressPosition, TOTAL_PROGRESS_STEPS } from '../quiz/navigation';
import { calculateScore } from '../quiz/score';
import { useQuiz } from '../quiz/useQuiz';
import { CvAnalysisStep } from '../steps/CvAnalysisStep';
import { CvUploadStep } from '../steps/CvUploadStep';
import { DeclinedStep } from '../steps/DeclinedStep';
import { FinalStep } from '../steps/FinalStep';
import { NoCvStep } from '../steps/NoCvStep';
import { PersonalInfoStep } from '../steps/PersonalInfoStep';
import { ProfileAnalysisStep } from '../steps/ProfileAnalysisStep';
import { SalaryStep } from '../steps/SalaryStep';
import { ScoreResultStep } from '../steps/ScoreResultStep';
import { WelcomeStep } from '../steps/WelcomeStep';
import { YesNoStep } from '../steps/YesNoStep';
import { Header } from './Header';

export function QuizContainer() {
  const quiz = useQuiz();
  const { state, update, next, jump, back, reset } = quiz;
  const { step, answers } = state;

  const position = getProgressPosition(step);
  const progress = position === null ? null : { current: position, total: TOTAL_PROGRESS_STEPS };

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return <WelcomeStep onYes={() => next()} onNo={() => jump('declined')} />;

      case 'declined':
        return <DeclinedStep onBack={back} />;

      case 'personal':
        return <PersonalInfoStep answers={answers} onChange={update} onContinue={(patch) => next(patch)} />;

      case 'education':
        return (
          <YesNoStep
            name="completed12th"
            eyebrow="Escolaridade"
            title="Já terminaste a 12ª classe?"
            question="Já terminaste a 12ª classe?"
            value={answers.completed12th}
            onChange={(v) => update({ completed12th: v })}
            onContinue={() => next()}
          />
        );

      case 'experience':
        return (
          <YesNoStep
            name="hasWorkExperience"
            eyebrow="Experiência profissional"
            title="Já trabalhaste alguma vez?"
            question="Já trabalhaste alguma vez?"
            lead="Qualquer experiência conta: emprego formal, trabalho por conta própria, estágios ou trabalhos temporários."
            value={answers.hasWorkExperience}
            onChange={(v) => update({ hasWorkExperience: v })}
            onContinue={() => next()}
          />
        );

      case 'salary':
        return (
          <SalaryStep
            value={answers.salaryOpinion}
            onChange={(v) => update({ salaryOpinion: v })}
            onContinue={() => next()}
          />
        );

      case 'cv':
        return (
          <YesNoStep
            name="hasCV"
            eyebrow="Currículo"
            title="Já possui um currículo?"
            question="Já possui um currículo?"
            lead="Ter um currículo profissional pode facilitar a apresentação do seu perfil às oportunidades disponíveis."
            yesLabel="Sim, tenho currículo"
            noLabel="Não tenho currículo"
            value={answers.hasCV}
            onChange={(v) => update({ hasCV: v, ...(v ? {} : { cvFile: null }) })}
            onContinue={() => next()}
          />
        );

      case 'cvUpload':
        return (
          <CvUploadStep
            previous={answers.cvFile}
            onContinue={(file) => {
              if (!file) return next(); // mantém o ficheiro escolhido anteriormente
              next({ cvFile: { name: file.name, size: file.size, type: file.type, uploaded: false } });
              // O envio (se configurado) corre em segundo plano durante a animação de análise.
              void uploadCv(file).then((info) => update({ cvFile: info }));
            }}
          />
        );

      case 'cvAnalysis':
        return <CvAnalysisStep fileName={answers.cvFile?.name ?? ''} onContinue={() => next()} />;

      case 'noCv':
        return <NoCvStep onContinue={() => next()} />;

      case 'profileAnalysis':
        return <ProfileAnalysisStep answers={answers} onContinue={() => next({ score: calculateScore(answers) })} />;

      case 'score':
        return (
          <ScoreResultStep
            answers={answers}
            score={answers.score ?? calculateScore(answers)}
            onContinue={() => next()}
          />
        );

      case 'final':
        return <FinalStep answers={answers} onRestart={reset} />;
    }
  };

  const isWelcome = step === 'welcome';

  return (
    <div class={`app${isWelcome ? ' app--welcome' : ''}`}>
      {!isWelcome && <Header progress={progress} onBack={canGoBack(state) ? back : undefined} />}
      <main class="stage" id="conteudo">
        {/* key força a remontagem → animação de entrada a cada etapa */}
        <div class="stage__inner" key={step}>
          {renderStep()}
        </div>
      </main>
    </div>
  );
}
