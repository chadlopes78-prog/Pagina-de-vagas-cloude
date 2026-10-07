import type { QuizAnswers, QuizState, StepId } from './types';

/** Número total de etapas mostrado na barra de progresso ("ETAPA X DE 10"). */
export const TOTAL_PROGRESS_STEPS = 10;

/** Posição de cada etapa na barra de progresso. `null` = barra escondida. */
const PROGRESS_POSITION: Record<StepId, number | null> = {
  welcome: null,
  declined: null,
  personal: 1,
  education: 2,
  experience: 3,
  salary: 4,
  cv: 5,
  cvUpload: 6,
  noCv: 6,
  cvAnalysis: 7,
  profileAnalysis: 8,
  score: 9,
  final: 10,
};

/** Etapas automáticas (animações) — nunca são destino do botão "voltar". */
const TRANSIENT_STEPS: ReadonlySet<StepId> = new Set<StepId>(['cvAnalysis', 'profileAnalysis', 'declined']);

/** Etapas onde o botão "voltar" não aparece. */
const NO_BACK_STEPS: ReadonlySet<StepId> = new Set<StepId>(['welcome', 'cvAnalysis', 'profileAnalysis', 'score', 'final']);

export function getProgressPosition(step: StepId): number | null {
  return PROGRESS_POSITION[step];
}

export function canGoBack(state: QuizState): boolean {
  return !NO_BACK_STEPS.has(state.step) && state.history.length > 0;
}

/** Próxima etapa a partir da etapa actual e das respostas. */
export function getNextStep(step: StepId, answers: QuizAnswers): StepId {
  switch (step) {
    case 'welcome':
      return 'personal';
    case 'personal':
      return 'education';
    case 'education':
      return 'experience';
    case 'experience':
      return 'salary';
    case 'salary':
      return 'cv';
    case 'cv':
      return answers.hasCV ? 'cvUpload' : 'noCv';
    case 'cvUpload':
      return 'cvAnalysis';
    case 'cvAnalysis':
    case 'noCv':
      return 'profileAnalysis';
    case 'profileAnalysis':
      return 'score';
    case 'score':
      return 'final';
    case 'declined':
      return 'welcome';
    case 'final':
      return 'final';
  }
}

export function goTo(state: QuizState, step: StepId): QuizState {
  if (step === state.step) return state;
  return { ...state, step, history: [...state.history, state.step] };
}

export function goNext(state: QuizState): QuizState {
  return goTo(state, getNextStep(state.step, state.answers));
}

/** Volta para a última etapa não-automática do histórico. */
export function goBack(state: QuizState): QuizState {
  const history = [...state.history];
  let previous = history.pop();
  while (previous && TRANSIENT_STEPS.has(previous)) previous = history.pop();
  if (!previous) return state;
  return { ...state, step: previous, history };
}
