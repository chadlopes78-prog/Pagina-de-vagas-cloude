import { useCallback, useEffect, useRef, useState } from 'preact/hooks';
import { PREVIEW_MODE } from '../config';
import { goBack, goNext, goTo } from './navigation';
import { clearState, INITIAL_STATE, loadState, saveState } from './persistence';
import type { QuizAnswers, QuizState, StepId } from './types';

const TRANSIENT: ReadonlySet<StepId> = new Set<StepId>(['cvAnalysis', 'profileAnalysis', 'declined']);

export interface QuizApi {
  state: QuizState;
  /** Actualiza respostas sem mudar de etapa. */
  update: (patch: Partial<QuizAnswers>) => void;
  /** Avança para a próxima etapa (opcionalmente gravando respostas na mesma operação). */
  next: (patch?: Partial<QuizAnswers>) => void;
  /** Vai para uma etapa específica (ex.: "declined"). */
  jump: (step: StepId) => void;
  back: () => void;
  reset: () => void;
}

/**
 * Estado central do quiz: respostas, etapa actual, persistência local
 * e integração com o botão "voltar" do navegador/Android (sem reload).
 */
export function useQuiz(): QuizApi {
  const [state, setState] = useState<QuizState>(() => (PREVIEW_MODE ? INITIAL_STATE : loadState()));
  /** Entradas que este quiz adicionou ao histórico do navegador. */
  const pushed = useRef(0);

  useEffect(() => {
    if (!PREVIEW_MODE) saveState(state);
  }, [state]);

  useEffect(() => {
    const onPop = () => {
      if (pushed.current > 0) pushed.current -= 1;
      setState((s) => goBack(s));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const recordHistory = useCallback((from: StepId) => {
    // Etapas automáticas substituem a entrada em vez de criar uma nova,
    // para que "voltar" nunca regresse a uma animação.
    if (TRANSIENT.has(from)) {
      window.history.replaceState({ quiz: true }, '');
    } else {
      window.history.pushState({ quiz: true }, '');
      pushed.current += 1;
    }
  }, []);

  const update = useCallback((patch: Partial<QuizAnswers>) => {
    setState((s) => ({ ...s, answers: { ...s.answers, ...patch } }));
  }, []);

  const next = useCallback(
    (patch?: Partial<QuizAnswers>) => {
      setState((s) => {
        const withAnswers = patch ? { ...s, answers: { ...s.answers, ...patch } } : s;
        return goNext(withAnswers);
      });
      recordHistory(state.step);
    },
    [recordHistory, state.step],
  );

  const jump = useCallback(
    (step: StepId) => {
      setState((s) => goTo(s, step));
      recordHistory(state.step);
    },
    [recordHistory, state.step],
  );

  const back = useCallback(() => {
    if (pushed.current > 0) {
      window.history.back(); // o handler de popstate faz o goBack
    } else {
      setState((s) => goBack(s));
    }
  }, []);

  const reset = useCallback(() => {
    clearState();
    setState(INITIAL_STATE);
  }, []);

  return { state, update, next, jump, back, reset };
}
