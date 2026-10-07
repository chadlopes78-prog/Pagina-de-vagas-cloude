import { STORAGE_KEY } from '../config';
import { EMPTY_ANSWERS, type QuizState, type StepId } from './types';

const VALID_STEPS: ReadonlySet<StepId> = new Set<StepId>([
  'welcome',
  'declined',
  'personal',
  'education',
  'experience',
  'salary',
  'cv',
  'cvUpload',
  'cvAnalysis',
  'noCv',
  'profileAnalysis',
  'score',
  'final',
]);

export const INITIAL_STATE: QuizState = { step: 'welcome', history: [], answers: EMPTY_ANSWERS };

function isStep(value: unknown): value is StepId {
  return typeof value === 'string' && VALID_STEPS.has(value as StepId);
}

/** Lê o progresso guardado. Qualquer dado inválido devolve o estado inicial. */
export function loadState(): QuizState {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as Partial<QuizState>;
    if (!isStep(parsed.step) || !Array.isArray(parsed.history) || !parsed.history.every(isStep)) {
      return INITIAL_STATE;
    }
    const answers = { ...EMPTY_ANSWERS, ...(parsed.answers ?? {}) };
    let step = parsed.step;
    // Etapas que exigem um ficheiro em memória não podem ser retomadas sem ele.
    if (step === 'cvAnalysis' && !answers.cvFile) step = 'cvUpload';
    if (step === 'declined') step = 'welcome';
    return { step, history: parsed.history, answers };
  } catch {
    return INITIAL_STATE;
  }
}

export function saveState(state: QuizState): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Modo privado / armazenamento cheio: o quiz continua a funcionar sem persistência.
  }
}

export function clearState(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignorar
  }
}
